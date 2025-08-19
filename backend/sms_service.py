from twilio.rest import Client
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

class SMSService:
    def __init__(self):
        self.account_sid = os.getenv('TWILIO_ACCOUNT_SID')
        self.auth_token = os.getenv('TWILIO_AUTH_TOKEN')
        self.phone_number = os.getenv('TWILIO_PHONE_NUMBER')
        
        if self.account_sid and self.auth_token:
            self.client = Client(self.account_sid, self.auth_token)
        else:
            self.client = None
            print("Warning: Twilio credentials not found. SMS functionality disabled.")

    def send_sms(self, to_phone, message):
        """Send SMS message to a phone number"""
        if not self.client:
            print(f"SMS would be sent to {to_phone}: {message}")
            return {"success": False, "error": "Twilio not configured"}
        
        try:
            # Format phone number
            if not to_phone.startswith('+'):
                to_phone = '+1' + to_phone.replace('-', '').replace('(', '').replace(')', '').replace(' ', '')
            
            message = self.client.messages.create(
                body=message,
                from_=self.phone_number,
                to=to_phone
            )
            
            return {
                "success": True,
                "message_sid": message.sid,
                "status": message.status
            }
        except Exception as e:
            print(f"Error sending SMS: {str(e)}")
            return {"success": False, "error": str(e)}

    def send_booking_confirmation(self, booking_data):
        """Send booking confirmation SMS"""
        message = f"""🌟 LashLuxe Booking Confirmed! 🌟

Hi {booking_data['client_name']}! Your lash appointment is confirmed:

📅 Date: {booking_data['appointment_date']}
🕐 Time: {booking_data['appointment_time']}
💫 Service: {booking_data['service_name']}
💰 Price: ${booking_data['price']}
⏰ Duration: {booking_data['duration']} minutes

📍 Location: 123 Beauty Lane, City
📞 Questions? Call us at (555) 123-4567

We can't wait to make your lashes gorgeous! ✨

Reply STOP to opt out."""

        return self.send_sms(booking_data['client_phone'], message)

    def send_reminder_24h(self, booking_data):
        """Send 24-hour reminder SMS"""
        message = f"""✨ LashLuxe Reminder ✨

Hi {booking_data['client_name']}! This is a friendly reminder about your lash appointment:

📅 Tomorrow at {booking_data['appointment_time']}
💫 Service: {booking_data['service_name']}

📍 Location: 123 Beauty Lane, City

Prep tips:
• Come with clean lashes (no mascara/makeup)
• Avoid caffeine 2hrs before (reduces eye twitching)
• Bring headphones if you'd like to listen to music

Need to reschedule? Call us at (555) 123-4567

See you soon! 💕"""

        return self.send_sms(booking_data['client_phone'], message)

    def send_reminder_2h(self, booking_data):
        """Send 2-hour reminder SMS"""
        message = f"""💫 LashLuxe - See You Soon! 💫

Hi {booking_data['client_name']}! Your lash appointment is in 2 hours:

🕐 {booking_data['appointment_time']} today
💫 {booking_data['service_name']}
📍 123 Beauty Lane, City

Final reminders:
✓ Clean lashes (no makeup)
✓ Arrive 5 minutes early
✓ Comfortable clothing

Questions? Call (555) 123-4567

Can't wait to see you! ✨"""

        return self.send_sms(booking_data['client_phone'], message)

    def send_followup_message(self, booking_data):
        """Send follow-up message after appointment"""
        message = f"""💕 Thank You, {booking_data['client_name']}! 💕

We hope you love your new lashes! ✨

Aftercare reminders:
• No water/steam for 24-48 hours
• Use oil-free makeup remover
• Brush gently with lash wand
• Book your refill in 2-3 weeks

Rate your experience: [link]
Book your next appointment: [link]

Questions? Text us anytime!
Lash Beauty Bot & LashLuxe Team 💫"""

        return self.send_sms(booking_data['client_phone'], message)

    def send_cancellation_confirmation(self, booking_data):
        """Send cancellation confirmation SMS"""
        message = f"""LashLuxe - Cancellation Confirmed

Hi {booking_data['client_name']}, your appointment on {booking_data['appointment_date']} at {booking_data['appointment_time']} has been cancelled.

We'd love to reschedule! Book online or call (555) 123-4567.

Thanks for choosing LashLuxe! 💕"""

        return self.send_sms(booking_data['client_phone'], message)