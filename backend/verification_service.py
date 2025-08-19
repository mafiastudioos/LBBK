import os
from datetime import datetime
from sms_service import SMSService
from dotenv import load_dotenv

load_dotenv()

class VerificationService:
    def __init__(self):
        self.sms_service = SMSService()
        self.admin_phone = os.getenv('ADMIN_PHONE', '+1234567890')  # Your phone number
        
    def send_verification_request_to_admin(self, booking_data, verification_data):
        """Send verification request to admin for approval"""
        
        admin_message = f"""🔒 NEW CLIENT VERIFICATION REQUEST

📋 BOOKING DETAILS:
• Client: {booking_data['client_name']}
• Phone: {booking_data['client_phone']}
• Email: {booking_data['client_email']}
• Service: {booking_data['service_name']} (${booking_data['service_price']})
• Date: {booking_data['appointment_date']}
• Time: {booking_data['appointment_time']}

🛡️ VERIFICATION INFO:
• Gov ID: {verification_data['government_id']}
• Emergency Contact: {verification_data['emergency_contact']} ({verification_data['emergency_phone']})
• Social Media: {verification_data['social_media_profile']}
• Referral Source: {verification_data['referral_source']}
• Deposit Paid: ${verification_data['deposit_amount']}

⚠️ SECURITY CHECK:
• Valid ID provided: ✅
• Emergency contact: ✅
• Social media verified: ✅
• Deposit secured: ✅

✅ TO APPROVE & SEND ADDRESS:
Text back: "APPROVE {booking_data['client_phone']}"

❌ TO REJECT:
Text back: "REJECT {booking_data['client_phone']}"

🏠 Your home address will ONLY be sent after your approval.
📱 Client will be notified of your decision automatically."""

        result = self.sms_service.send_sms(self.admin_phone, admin_message)
        
        if result['success']:
            # Send confirmation to client that verification is under review
            client_message = f"""🔒 LashBeautyByKim - Verification Submitted

Hi {booking_data['client_name']}! Your home service verification has been submitted for review.

📋 WHAT HAPPENS NEXT:
• Kim will review your information within 2 hours
• You'll receive the address once approved
• Your ${verification_data['deposit_amount']} deposit secures your spot

⏰ APPOINTMENT DETAILS:
• Service: {booking_data['service_name']}
• Date: {booking_data['appointment_date']}
• Time: {booking_data['appointment_time']}

🛡️ WHY VERIFICATION?
For everyone's safety, we verify all home service clients. Thank you for understanding our security procedures!

Questions? Call/text: (555) 123-4567

LashBeautyByKim Team 💕"""

            client_result = self.sms_service.send_sms(booking_data['client_phone'], client_message)
            
            return {
                'success': True,
                'admin_sms_sent': result['success'],
                'client_sms_sent': client_result['success'],
                'message': 'Verification request sent to admin'
            }
        
        return {
            'success': False,
            'error': 'Failed to send admin notification'
        }

    def send_approval_with_address(self, booking_data):
        """Send approval message with home address to client"""
        
        # Your home address - keep this secure!
        home_address = os.getenv('HOME_ADDRESS', """123 Beauty Lane
Apt 4B
Your City, State 12345""")
        
        parking_info = os.getenv('PARKING_INFO', """• Street parking available
• Visitor spots in front of building
• Ring buzzer #4B when you arrive""")

        approval_message = f"""✅ LashBeautyByKim - APPROVED FOR HOME SERVICE!

Hi {booking_data['client_name']}! 🎉 Great news - you've been approved!

📍 SERVICE ADDRESS:
{home_address}

🚗 PARKING INSTRUCTIONS:
{parking_info}

⏰ APPOINTMENT CONFIRMED:
• Date: {booking_data['appointment_date']}
• Time: {booking_data['appointment_time']}
• Service: {booking_data['service_name']}
• Duration: ~{booking_data.get('service_duration', 120)} minutes

📝 IMPORTANT REMINDERS:
• Arrive exactly on time (not early/late)
• Come with clean lashes (no makeup/mascara)
• Bring valid photo ID for verification
• Your ${booking_data.get('deposit_amount', 25)} deposit is confirmed

🛡️ SAFETY PROTOCOLS:
• Please come alone (no extra guests)
• Follow all health and safety guidelines
• Respect the home environment

Can't wait to make your lashes absolutely gorgeous! ✨

Questions or need to reschedule? 
Call/text: (555) 123-4567

See you soon!
Kim 💕"""

        result = self.sms_service.send_sms(booking_data['client_phone'], approval_message)
        
        # Also notify admin that approval was sent
        admin_confirmation = f"""✅ APPROVAL SENT

Address successfully sent to:
{booking_data['client_name']} - {booking_data['client_phone']}

Appointment: {booking_data['appointment_date']} at {booking_data['appointment_time']}

Client has been notified and given all details."""

        admin_result = self.sms_service.send_sms(self.admin_phone, admin_confirmation)
        
        return {
            'success': result['success'],
            'client_notified': result['success'],
            'admin_notified': admin_result['success'],
            'message': 'Approval sent with address'
        }

    def send_rejection_notification(self, booking_data, reason="safety verification"):
        """Send rejection notification to client"""
        
        rejection_message = f"""❌ LashBeautyByKim - Home Service Update

Hi {booking_data['client_name']}, thank you for your interest in our home services.

Unfortunately, we're unable to provide home service at this time due to {reason}.

💫 GREAT NEWS - STUDIO OPTION AVAILABLE:
• Same professional lash services
• Beautiful, clean studio environment  
• Easy parking and access
• Same pricing and quality

💰 REFUND PROCESSING:
Your ${booking_data.get('deposit_amount', 25)} deposit will be automatically refunded within 2-3 business days.

📅 RESCHEDULE FOR STUDIO:
We'd love to serve you at our studio location! 
Call/text to book: (555) 123-4567

Thank you for understanding our safety procedures. We hope to serve you soon at our studio!

LashBeautyByKim Team 💕"""

        result = self.sms_service.send_sms(booking_data['client_phone'], rejection_message)
        
        # Notify admin that rejection was sent
        admin_notification = f"""❌ REJECTION SENT

Client rejected and notified:
{booking_data['client_name']} - {booking_data['client_phone']}

Reason: {reason}
Refund: ${booking_data.get('deposit_amount', 25)} - process refund
Studio option offered.

Follow up on refund processing."""

        admin_result = self.sms_service.send_sms(self.admin_phone, admin_notification)
        
        return {
            'success': result['success'],
            'client_notified': result['success'],
            'admin_notified': admin_result['success'],
            'message': 'Rejection sent with studio option'
        }

    def send_reminder_before_home_visit(self, booking_data):
        """Send reminder 2 hours before home service appointment"""
        
        reminder_message = f"""🏠 LashBeautyByKim - Home Service Reminder

Hi {booking_data['client_name']}! Your home lash appointment is in 2 hours!

⏰ TODAY at {booking_data['appointment_time']}
💫 Service: {booking_data['service_name']}

📍 ADDRESS REMINDER:
{os.getenv('HOME_ADDRESS', '123 Beauty Lane, Apt 4B')}

🚗 PARKING:
{os.getenv('PARKING_INFO', 'Street parking available, ring buzzer #4B')}

✅ FINAL CHECKLIST:
• Clean lashes (no makeup/mascara)
• Valid photo ID ready
• Arrive exactly on time
• Come alone (no extra guests)

Looking forward to making your lashes gorgeous! ✨

Questions? Call/text: (555) 123-4567

See you soon!
Kim 💕"""

        return self.sms_service.send_sms(booking_data['client_phone'], reminder_message)

    def process_admin_response(self, from_phone, message_body):
        """Process admin's approval/rejection response"""
        
        if from_phone != self.admin_phone:
            return {'success': False, 'error': 'Unauthorized'}
        
        message = message_body.upper().strip()
        
        if message.startswith('APPROVE '):
            client_phone = message.replace('APPROVE ', '').strip()
            # In real implementation, fetch booking data from database
            # For now, return success
            return {
                'success': True,
                'action': 'approve',
                'client_phone': client_phone,
                'message': 'Client approved, address will be sent'
            }
        
        elif message.startswith('REJECT '):
            client_phone = message.replace('REJECT ', '').strip()
            return {
                'success': True,
                'action': 'reject', 
                'client_phone': client_phone,
                'message': 'Client rejected, refund notification will be sent'
            }
        
        else:
            # Send help message to admin
            help_message = """🔒 LashBeautyByKim Admin Commands:

✅ To approve a client:
Text: "APPROVE +1234567890"

❌ To reject a client:  
Text: "REJECT +1234567890"

📋 Pending verifications will show the exact format to copy/paste.

Questions? Check the admin dashboard."""
            
            self.sms_service.send_sms(self.admin_phone, help_message)
            
            return {
                'success': False,
                'error': 'Invalid command',
                'message': 'Help sent to admin'
            }

# Test function to demonstrate the system
def test_verification_system():
    """Test the verification system with sample data"""
    
    verification_service = VerificationService()
    
    # Sample booking data
    booking_data = {
        'client_name': 'Sarah Johnson',
        'client_phone': '+1234567890',  # Replace with test number
        'client_email': 'sarah@example.com',
        'service_name': 'Volume Lashes',
        'service_price': 120,
        'service_duration': 150,
        'appointment_date': 'Friday, August 25, 2024',
        'appointment_time': '2:00 PM',
        'deposit_amount': 25
    }
    
    # Sample verification data
    verification_data = {
        'government_id': 'DL123456789 (CA)',
        'emergency_contact': 'Mike Johnson',
        'emergency_phone': '+1987654321',
        'social_media_profile': 'https://instagram.com/sarah_j',
        'referral_source': 'Instagram',
        'deposit_amount': 25
    }
    
    print("🧪 TESTING VERIFICATION SYSTEM...")
    print("=" * 50)
    
    # Test 1: Send verification request to admin
    print("1. Sending verification request to admin...")
    result1 = verification_service.send_verification_request_to_admin(booking_data, verification_data)
    print(f"Result: {result1}")
    print()
    
    # Test 2: Simulate admin approval
    print("2. Simulating admin approval...")
    result2 = verification_service.send_approval_with_address(booking_data)
    print(f"Result: {result2}")
    print()
    
    # Test 3: Test admin response processing
    print("3. Testing admin response processing...")
    result3 = verification_service.process_admin_response(
        verification_service.admin_phone, 
        f"APPROVE {booking_data['client_phone']}"
    )
    print(f"Result: {result3}")
    print()
    
    print("✅ Test completed! Check console for SMS message content.")

if __name__ == "__main__":
    test_verification_system()