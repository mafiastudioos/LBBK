import smtplib
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

class FreeEmailService:
    def __init__(self):
        # Using Gmail's free SMTP (you can use any email provider)
        self.smtp_server = "smtp.gmail.com"
        self.smtp_port = 587
        self.email = os.getenv('BUSINESS_EMAIL', 'your-email@gmail.com')
        self.password = os.getenv('EMAIL_APP_PASSWORD', 'your-app-password')  # Use App Password, not regular password
        
    def send_email(self, to_email, subject, html_body, text_body=None):
        """Send email using free Gmail SMTP"""
        try:
            msg = MIMEMultipart('alternative')
            msg['Subject'] = subject
            msg['From'] = self.email
            msg['To'] = to_email

            # Add text version
            if text_body:
                text_part = MIMEText(text_body, 'plain')
                msg.attach(text_part)

            # Add HTML version
            html_part = MIMEText(html_body, 'html')
            msg.attach(html_part)

            # Send email
            server = smtplib.SMTP(self.smtp_server, self.smtp_port)
            server.starttls()
            server.login(self.email, self.password)
            server.send_message(msg)
            server.quit()

            return {"success": True, "message": "Email sent successfully"}
        
        except Exception as e:
            print(f"Error sending email: {str(e)}")
            return {"success": False, "error": str(e)}

    def send_booking_confirmation(self, booking_data):
        """Send booking confirmation email"""
        subject = "✨ Your Lash Appointment is Confirmed!"
        
        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ec4899, #a855f7); padding: 30px; text-align: center; color: white;">
                <h1 style="margin: 0;">🌟 LashBeautyByKim 🌟</h1>
                <p style="margin: 10px 0 0 0; opacity: 0.9;">Your appointment is confirmed!</p>
            </div>
            
            <div style="padding: 30px; background: white;">
                <h2 style="color: #ec4899;">Hi {booking_data['client_name']}!</h2>
                
                <p>We're excited to see you for your lash appointment! Here are your booking details:</p>
                
                <div style="background: #fdf2f8; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="color: #be185d; margin-top: 0;">📅 Appointment Details</h3>
                    <p><strong>Service:</strong> {booking_data['service_name']}</p>
                    <p><strong>Date:</strong> {booking_data['appointment_date']}</p>
                    <p><strong>Time:</strong> {booking_data['appointment_time']}</p>
                    <p><strong>Duration:</strong> {booking_data['duration']} minutes</p>
                    <p><strong>Price:</strong> ${booking_data['price']}</p>
                </div>
                
                <div style="background: #f0f9ff; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="color: #0369a1; margin-top: 0;">📍 Location</h3>
                    <p>123 Beauty Lane<br>Your City, State 12345</p>
                    <p><strong>Phone:</strong> (555) 123-4567</p>
                </div>
                
                <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="color: #166534; margin-top: 0;">💡 Preparation Tips</h3>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>Come with clean lashes (no mascara or makeup)</li>
                        <li>Avoid caffeine 2 hours before (reduces eye twitching)</li>
                        <li>Wear comfortable clothing</li>
                        <li>Bring headphones if you'd like to listen to music</li>
                    </ul>
                </div>
                
                <p style="text-align: center; margin: 30px 0;">
                    <strong>Need to reschedule?</strong><br>
                    Call us at (555) 123-4567 or email hello@lashbeautybykim.com
                </p>
                
                <p style="text-align: center; color: #ec4899;">
                    We can't wait to make your lashes gorgeous! ✨
                </p>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
                <p style="margin: 0; color: #6b7280; font-size: 14px;">
                    LashBeautyByKim • 123 Beauty Lane • (555) 123-4567
                </p>
            </div>
        </body>
        </html>
        """
        
        text_body = f"""
        LashBeautyByKim - Appointment Confirmed!
        
        Hi {booking_data['client_name']}!
        
        Your lash appointment is confirmed:
        
        Service: {booking_data['service_name']}
        Date: {booking_data['appointment_date']}
        Time: {booking_data['appointment_time']}
        Duration: {booking_data['duration']} minutes
        Price: ${booking_data['price']}
        
        Location:
        123 Beauty Lane
        Your City, State 12345
        Phone: (555) 123-4567
        
        Preparation Tips:
        - Come with clean lashes (no mascara or makeup)
        - Avoid caffeine 2 hours before
        - Wear comfortable clothing
        - Bring headphones if you'd like music
        
        Need to reschedule? Call (555) 123-4567
        
        We can't wait to see you!
        LashBeautyByKim Team ✨
        """
        
        return self.send_email(booking_data['client_email'], subject, html_body, text_body)

    def send_reminder_email(self, booking_data):
        """Send appointment reminder email"""
        subject = "✨ Reminder: Your lash appointment is tomorrow!"
        
        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ec4899, #a855f7); padding: 20px; text-align: center; color: white;">
                <h1 style="margin: 0;">✨ Appointment Reminder ✨</h1>
            </div>
            
            <div style="padding: 30px; background: white;">
                <h2 style="color: #ec4899;">Hi {booking_data['client_name']}!</h2>
                
                <p>This is a friendly reminder about your lash appointment:</p>
                
                <div style="background: #fdf2f8; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
                    <h3 style="color: #be185d; margin-top: 0;">Tomorrow at {booking_data['appointment_time']}</h3>
                    <p><strong>{booking_data['service_name']}</strong></p>
                </div>
                
                <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="color: #166534; margin-top: 0;">Final Reminders:</h3>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>Clean lashes (no makeup)</li>
                        <li>Arrive 5 minutes early</li>
                        <li>Comfortable clothing</li>
                    </ul>
                </div>
                
                <p style="text-align: center; color: #ec4899;">
                    See you soon! 💕
                </p>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(booking_data['client_email'], subject, html_body)

    def send_followup_email(self, booking_data):
        """Send follow-up aftercare email"""
        subject = "💕 Thank you! Lash aftercare tips inside"
        
        html_body = f"""
        <html>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <div style="background: linear-gradient(135deg, #ec4899, #a855f7); padding: 20px; text-align: center; color: white;">
                <h1 style="margin: 0;">💕 Thank You! 💕</h1>
            </div>
            
            <div style="padding: 30px; background: white;">
                <h2 style="color: #ec4899;">Hi {booking_data['client_name']}!</h2>
                
                <p>We hope you love your new lashes! ✨</p>
                
                <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; margin: 20px 0;">
                    <h3 style="color: #166534; margin-top: 0;">🌟 Aftercare Instructions</h3>
                    <ul style="margin: 0; padding-left: 20px;">
                        <li>No water/steam for 24-48 hours</li>
                        <li>Use oil-free makeup remover</li>
                        <li>Brush gently with lash wand daily</li>
                        <li>Avoid rubbing or pulling</li>
                        <li>Sleep on your back if possible</li>
                        <li>Book refills in 2-3 weeks</li>
                    </ul>
                </div>
                
                <p style="text-align: center;">
                    <strong>Questions?</strong><br>
                    Call (555) 123-4567 or email hello@lashbeautybykim.com
                </p>
                
                <p style="text-align: center; color: #ec4899;">
                    Thank you for choosing LashBeautyByKim! 💫
                </p>
            </div>
        </body>
        </html>
        """
        
        return self.send_email(booking_data['client_email'], subject, html_body)