from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv
import openai
import json
from sms_service import SMSService
from scheduler import ReminderScheduler
from verification_service import VerificationService

load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure database
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///bookings.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

# Configure OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

# Initialize services
sms_service = SMSService()
verification_service = VerificationService()

# Database Models
class Booking(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    client_name = db.Column(db.String(100), nullable=False)
    client_email = db.Column(db.String(100), nullable=False)
    client_phone = db.Column(db.String(20), nullable=False)
    service_type = db.Column(db.String(100), nullable=False)
    appointment_date = db.Column(db.DateTime, nullable=False)
    appointment_time = db.Column(db.String(10), nullable=False)
    special_requests = db.Column(db.Text)
    status = db.Column(db.String(20), default='pending')
    confirmation_sent = db.Column(db.Boolean, default=False)
    reminder_24h_sent = db.Column(db.Boolean, default=False)
    reminder_2h_sent = db.Column(db.Boolean, default=False)
    followup_sent = db.Column(db.Boolean, default=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

class ChatHistory(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    session_id = db.Column(db.String(100), nullable=False)
    message = db.Column(db.Text, nullable=False)
    sender = db.Column(db.String(10), nullable=False)  # 'user' or 'bot'
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

# Lash services configuration
LASH_SERVICES = {
    "classic_lashes": {
        "name": "Classic Lashes",
        "duration": 120,
        "price": 80,
        "description": "Natural-looking individual lash extensions"
    },
    "volume_lashes": {
        "name": "Volume Lashes",
        "duration": 150,
        "price": 120,
        "description": "Multiple lightweight extensions per natural lash"
    },
    "mega_volume": {
        "name": "Mega Volume Lashes",
        "duration": 180,
        "price": 160,
        "description": "Maximum fullness with ultra-fine extensions"
    },
    "lash_lift": {
        "name": "Lash Lift & Tint",
        "duration": 60,
        "price": 60,
        "description": "Natural lash enhancement with curl and tint"
    },
    "refill": {
        "name": "Lash Refill",
        "duration": 90,
        "price": 50,
        "description": "Maintenance for existing lash extensions"
    }
}

# Available time slots
TIME_SLOTS = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
]

def get_ai_response(user_message, conversation_history):
    """Get AI response using OpenAI API"""
    try:
        # Create system prompt for lash booking assistant
        system_prompt = f"""
        You are Lash Beauty Bot, a friendly and professional AI assistant for a luxury lash extension salon. Your role is to help clients book appointments and answer questions about lash services.

        Available Services:
        {json.dumps(LASH_SERVICES, indent=2)}

        Available Time Slots: {', '.join(TIME_SLOTS)}

        Guidelines:
        1. Be warm, professional, and knowledgeable about lash services
        2. Help clients choose the right service based on their needs
        3. Collect booking information: name, email, phone, preferred service, date, and time
        4. Suggest alternative times if requested slots are unavailable
        5. Provide aftercare tips and answer service-related questions
        6. If you need to book an appointment, ask for all required information step by step
        7. Be conversational and helpful, not robotic
        8. If asked about pricing or duration, refer to the service information above
        9. IMPORTANT: Mention that clients will receive:
           - Immediate SMS confirmation when booking
           - 24-hour reminder text before appointment
           - 2-hour reminder text on appointment day
           - Follow-up care message after service
        10. Emphasize our automated text reminder system to reduce no-shows

        Current conversation context: {conversation_history[-5:] if conversation_history else []}
        """

        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_message}
        ]

        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=messages,
            max_tokens=500,
            temperature=0.7
        )

        return response.choices[0].message.content

    except Exception as e:
        return "I apologize, but I'm having trouble processing your request right now. Please try again or contact us directly to book your appointment."

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages"""
    try:
        data = request.get_json()
        user_message = data.get('message', '')
        session_id = data.get('session_id', 'default')

        # Get conversation history
        history = ChatHistory.query.filter_by(session_id=session_id).order_by(ChatHistory.timestamp.desc()).limit(10).all()
        conversation_history = [{"sender": h.sender, "message": h.message} for h in reversed(history)]

        # Get AI response
        ai_response = get_ai_response(user_message, conversation_history)

        # Save messages to database
        user_chat = ChatHistory(session_id=session_id, message=user_message, sender='user')
        bot_chat = ChatHistory(session_id=session_id, message=ai_response, sender='bot')
        
        db.session.add(user_chat)
        db.session.add(bot_chat)
        db.session.commit()

        return jsonify({
            'response': ai_response,
            'success': True
        })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/book', methods=['POST'])
def book_appointment():
    """Book a new appointment"""
    try:
        data = request.get_json()
        
        # Validate required fields
        required_fields = ['client_name', 'client_email', 'client_phone', 'service_type', 'appointment_date', 'appointment_time']
        for field in required_fields:
            if not data.get(field):
                return jsonify({'error': f'Missing required field: {field}', 'success': False}), 400

        # Parse appointment date
        appointment_date = datetime.strptime(data['appointment_date'], '%Y-%m-%d')
        
        # Check if slot is available
        existing_booking = Booking.query.filter_by(
            appointment_date=appointment_date,
            appointment_time=data['appointment_time'],
            status='confirmed'
        ).first()

        if existing_booking:
            return jsonify({
                'error': 'This time slot is already booked. Please choose another time.',
                'success': False
            }), 409

        # Create new booking
        booking = Booking(
            client_name=data['client_name'],
            client_email=data['client_email'],
            client_phone=data['client_phone'],
            service_type=data['service_type'],
            appointment_date=appointment_date,
            appointment_time=data['appointment_time'],
            special_requests=data.get('special_requests', ''),
            status='confirmed'
        )

        db.session.add(booking)
        db.session.commit()

        # Send confirmation SMS
        service_info = LASH_SERVICES.get(data['service_type'], {})
        booking_data = {
            'client_name': data['client_name'],
            'client_phone': data['client_phone'],
            'appointment_date': appointment_date.strftime('%A, %B %d, %Y'),
            'appointment_time': data['appointment_time'],
            'service_name': service_info.get('name', data['service_type']),
            'price': service_info.get('price', 0),
            'duration': service_info.get('duration', 0)
        }

        # Send confirmation SMS
        sms_result = sms_service.send_booking_confirmation(booking_data)
        if sms_result['success']:
            booking.confirmation_sent = True
            db.session.commit()

        # Schedule reminders
        try:
            reminder_scheduler = ReminderScheduler(db, Booking)
            reminder_scheduler.schedule_booking_reminders(booking)
        except Exception as e:
            print(f"Error scheduling reminders: {str(e)}")

        return jsonify({
            'message': 'Appointment booked successfully! You\'ll receive a confirmation text shortly.',
            'booking_id': booking.id,
            'sms_sent': sms_result['success'],
            'success': True
        })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/services', methods=['GET'])
def get_services():
    """Get available lash services"""
    return jsonify({
        'services': LASH_SERVICES,
        'success': True
    })

@app.route('/api/available-slots', methods=['GET'])
def get_available_slots():
    """Get available time slots for a specific date"""
    try:
        date_str = request.args.get('date')
        if not date_str:
            return jsonify({'error': 'Date parameter is required', 'success': False}), 400

        appointment_date = datetime.strptime(date_str, '%Y-%m-%d')
        
        # Get booked slots for the date
        booked_slots = db.session.query(Booking.appointment_time).filter_by(
            appointment_date=appointment_date,
            status='confirmed'
        ).all()
        
        booked_times = [slot[0] for slot in booked_slots]
        available_slots = [slot for slot in TIME_SLOTS if slot not in booked_times]

        return jsonify({
            'available_slots': available_slots,
            'success': True
        })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/bookings', methods=['GET'])
def get_bookings():
    """Get all bookings (for admin use)"""
    try:
        bookings = Booking.query.order_by(Booking.appointment_date.desc()).all()
        booking_list = []
        
        for booking in bookings:
            booking_list.append({
                'id': booking.id,
                'client_name': booking.client_name,
                'client_email': booking.client_email,
                'client_phone': booking.client_phone,
                'service_type': booking.service_type,
                'appointment_date': booking.appointment_date.strftime('%Y-%m-%d'),
                'appointment_time': booking.appointment_time,
                'special_requests': booking.special_requests,
                'status': booking.status,
                'created_at': booking.created_at.strftime('%Y-%m-%d %H:%M:%S')
            })

        return jsonify({
            'bookings': booking_list,
            'success': True
        })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/cancel-booking/<int:booking_id>', methods=['POST'])
def cancel_booking(booking_id):
    """Cancel a booking and send confirmation SMS"""
    try:
        booking = Booking.query.get_or_404(booking_id)
        
        # Update booking status
        booking.status = 'cancelled'
        db.session.commit()

        # Cancel scheduled reminders
        try:
            reminder_scheduler = ReminderScheduler(db, Booking)
            reminder_scheduler.cancel_booking_reminders(booking_id)
        except Exception as e:
            print(f"Error cancelling reminders: {str(e)}")

        # Send cancellation confirmation SMS
        booking_data = {
            'client_name': booking.client_name,
            'client_phone': booking.client_phone,
            'appointment_date': booking.appointment_date.strftime('%A, %B %d, %Y'),
            'appointment_time': booking.appointment_time
        }
        
        sms_result = sms_service.send_cancellation_confirmation(booking_data)

        return jsonify({
            'message': 'Booking cancelled successfully',
            'sms_sent': sms_result['success'],
            'success': True
        })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/send-reminder/<int:booking_id>', methods=['POST'])
def send_manual_reminder(booking_id):
    """Send manual reminder for a booking"""
    try:
        booking = Booking.query.get_or_404(booking_id)
        
        if booking.status != 'confirmed':
            return jsonify({
                'error': 'Can only send reminders for confirmed bookings',
                'success': False
            }), 400

        # Prepare booking data
        service_info = LASH_SERVICES.get(booking.service_type, {})
        booking_data = {
            'client_name': booking.client_name,
            'client_phone': booking.client_phone,
            'appointment_date': booking.appointment_date.strftime('%A, %B %d, %Y'),
            'appointment_time': booking.appointment_time,
            'service_name': service_info.get('name', booking.service_type),
            'price': service_info.get('price', 0),
            'duration': service_info.get('duration', 0)
        }

        # Send reminder
        sms_result = sms_service.send_reminder_24h(booking_data)

        return jsonify({
            'message': 'Reminder sent successfully',
            'sms_sent': sms_result['success'],
            'success': True
        })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/sms-status/<int:booking_id>', methods=['GET'])
def get_sms_status(booking_id):
    """Get SMS status for a booking"""
    try:
        booking = Booking.query.get_or_404(booking_id)
        
        return jsonify({
            'booking_id': booking_id,
            'confirmation_sent': booking.confirmation_sent,
            'reminder_24h_sent': booking.reminder_24h_sent,
            'reminder_2h_sent': booking.reminder_2h_sent,
            'followup_sent': booking.followup_sent,
            'success': True
        })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/scheduled-jobs', methods=['GET'])
def get_scheduled_jobs():
    """Get list of scheduled reminder jobs"""
    try:
        reminder_scheduler = ReminderScheduler(db, Booking)
        jobs = reminder_scheduler.get_scheduled_jobs()
        
        return jsonify({
            'scheduled_jobs': [{'id': job[0], 'next_run': job[1].isoformat() if job[1] else None} for job in jobs],
            'success': True
        })

    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/verify-client', methods=['POST'])
def verify_client():
    """Submit client verification for home service"""
    try:
        data = request.get_json()
        
        # Required verification fields
        required_fields = [
            'booking_id', 'government_id', 'emergency_contact', 
            'emergency_phone', 'social_media_profile', 'deposit_amount'
        ]
        
        for field in required_fields:
            if not data.get(field):
                return jsonify({
                    'error': f'Missing required field: {field}',
                    'success': False
                }), 400
        
        # Get booking details
        booking = Booking.query.get(data['booking_id'])
        if not booking:
            return jsonify({
                'error': 'Booking not found',
                'success': False
            }), 404
        
        # Prepare booking data for verification
        service_info = LASH_SERVICES.get(booking.service_type, {})
        booking_data = {
            'client_name': booking.client_name,
            'client_phone': booking.client_phone,
            'client_email': booking.client_email,
            'service_name': service_info.get('name', booking.service_type),
            'service_price': service_info.get('price', 0),
            'service_duration': service_info.get('duration', 120),
            'appointment_date': booking.appointment_date.strftime('%A, %B %d, %Y'),
            'appointment_time': booking.appointment_time,
            'deposit_amount': data['deposit_amount']
        }
        
        # Prepare verification data
        verification_data = {
            'government_id': data['government_id'],
            'emergency_contact': data['emergency_contact'],
            'emergency_phone': data['emergency_phone'],
            'social_media_profile': data['social_media_profile'],
            'referral_source': data.get('referral_source', 'Unknown'),
            'deposit_amount': data['deposit_amount']
        }
        
        # Send verification request to admin
        result = verification_service.send_verification_request_to_admin(
            booking_data, verification_data
        )
        
        if result['success']:
            # Update booking status to pending verification
            booking.status = 'pending_verification'
            db.session.commit()
            
            return jsonify({
                'message': 'Verification request submitted successfully',
                'admin_notified': result['admin_sms_sent'],
                'client_notified': result['client_sms_sent'],
                'success': True
            })
        else:
            return jsonify({
                'error': 'Failed to submit verification request',
                'success': False
            }), 500
            
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/admin/approve-client', methods=['POST'])
def admin_approve_client():
    """Admin endpoint to approve client and send address"""
    try:
        data = request.get_json()
        booking_id = data.get('booking_id')
        
        if not booking_id:
            return jsonify({
                'error': 'Missing booking_id',
                'success': False
            }), 400
        
        booking = Booking.query.get(booking_id)
        if not booking:
            return jsonify({
                'error': 'Booking not found',
                'success': False
            }), 404
        
        # Prepare booking data
        service_info = LASH_SERVICES.get(booking.service_type, {})
        booking_data = {
            'client_name': booking.client_name,
            'client_phone': booking.client_phone,
            'service_name': service_info.get('name', booking.service_type),
            'service_duration': service_info.get('duration', 120),
            'appointment_date': booking.appointment_date.strftime('%A, %B %d, %Y'),
            'appointment_time': booking.appointment_time,
            'deposit_amount': 25  # Default deposit amount
        }
        
        # Send approval with address
        result = verification_service.send_approval_with_address(booking_data)
        
        if result['success']:
            # Update booking status
            booking.status = 'verified_approved'
            db.session.commit()
            
            return jsonify({
                'message': 'Client approved and address sent',
                'client_notified': result['client_notified'],
                'success': True
            })
        else:
            return jsonify({
                'error': 'Failed to send approval',
                'success': False
            }), 500
            
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/admin/reject-client', methods=['POST'])
def admin_reject_client():
    """Admin endpoint to reject client"""
    try:
        data = request.get_json()
        booking_id = data.get('booking_id')
        reason = data.get('reason', 'safety verification requirements')
        
        if not booking_id:
            return jsonify({
                'error': 'Missing booking_id',
                'success': False
            }), 400
        
        booking = Booking.query.get(booking_id)
        if not booking:
            return jsonify({
                'error': 'Booking not found',
                'success': False
            }), 404
        
        # Prepare booking data
        booking_data = {
            'client_name': booking.client_name,
            'client_phone': booking.client_phone,
            'deposit_amount': 25  # Default deposit amount
        }
        
        # Send rejection notification
        result = verification_service.send_rejection_notification(booking_data, reason)
        
        if result['success']:
            # Update booking status
            booking.status = 'verification_rejected'
            db.session.commit()
            
            return jsonify({
                'message': 'Client rejection sent',
                'client_notified': result['client_notified'],
                'refund_required': True,
                'success': True
            })
        else:
            return jsonify({
                'error': 'Failed to send rejection',
                'success': False
            }), 500
            
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

@app.route('/api/test-verification', methods=['POST'])
def test_verification():
    """Test endpoint to demonstrate the verification system"""
    try:
        # Sample test data
        booking_data = {
            'client_name': 'Sarah Johnson',
            'client_phone': '+1234567890',  # Replace with your test number
            'client_email': 'sarah@example.com',
            'service_name': 'Volume Lashes',
            'service_price': 120,
            'service_duration': 150,
            'appointment_date': 'Friday, August 25, 2024',
            'appointment_time': '2:00 PM',
            'deposit_amount': 25
        }
        
        verification_data = {
            'government_id': 'DL123456789 (CA)',
            'emergency_contact': 'Mike Johnson',
            'emergency_phone': '+1987654321',
            'social_media_profile': 'https://instagram.com/sarah_j',
            'referral_source': 'Instagram',
            'deposit_amount': 25
        }
        
        # Send test verification request
        result = verification_service.send_verification_request_to_admin(
            booking_data, verification_data
        )
        
        return jsonify({
            'message': 'Test verification sent',
            'result': result,
            'note': 'Check your phone for the admin notification SMS',
            'success': True
        })
        
    except Exception as e:
        return jsonify({
            'error': str(e),
            'success': False
        }), 500

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True, host='0.0.0.0', port=5000)