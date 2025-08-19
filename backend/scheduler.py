from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.date import DateTrigger
from datetime import datetime, timedelta
from sms_service import SMSService
import atexit

class ReminderScheduler:
    def __init__(self, db, booking_model):
        self.scheduler = BackgroundScheduler()
        self.sms_service = SMSService()
        self.db = db
        self.Booking = booking_model
        
        # Start the scheduler
        self.scheduler.start()
        
        # Shut down the scheduler when exiting the app
        atexit.register(lambda: self.scheduler.shutdown())

    def schedule_booking_reminders(self, booking):
        """Schedule all reminders for a booking"""
        try:
            appointment_datetime = datetime.combine(
                booking.appointment_date,
                datetime.strptime(booking.appointment_time, '%I:%M %p').time()
            )
            
            # Schedule 24-hour reminder
            reminder_24h = appointment_datetime - timedelta(hours=24)
            if reminder_24h > datetime.now():
                self.scheduler.add_job(
                    func=self._send_24h_reminder,
                    trigger=DateTrigger(run_date=reminder_24h),
                    args=[booking.id],
                    id=f"reminder_24h_{booking.id}",
                    replace_existing=True
                )
                print(f"Scheduled 24h reminder for booking {booking.id} at {reminder_24h}")

            # Schedule 2-hour reminder
            reminder_2h = appointment_datetime - timedelta(hours=2)
            if reminder_2h > datetime.now():
                self.scheduler.add_job(
                    func=self._send_2h_reminder,
                    trigger=DateTrigger(run_date=reminder_2h),
                    args=[booking.id],
                    id=f"reminder_2h_{booking.id}",
                    replace_existing=True
                )
                print(f"Scheduled 2h reminder for booking {booking.id} at {reminder_2h}")

            # Schedule follow-up message (24 hours after appointment)
            followup_time = appointment_datetime + timedelta(hours=24)
            self.scheduler.add_job(
                func=self._send_followup_message,
                trigger=DateTrigger(run_date=followup_time),
                args=[booking.id],
                id=f"followup_{booking.id}",
                replace_existing=True
            )
            print(f"Scheduled follow-up for booking {booking.id} at {followup_time}")

        except Exception as e:
            print(f"Error scheduling reminders for booking {booking.id}: {str(e)}")

    def cancel_booking_reminders(self, booking_id):
        """Cancel all reminders for a booking"""
        try:
            self.scheduler.remove_job(f"reminder_24h_{booking_id}")
        except:
            pass
        
        try:
            self.scheduler.remove_job(f"reminder_2h_{booking_id}")
        except:
            pass
        
        try:
            self.scheduler.remove_job(f"followup_{booking_id}")
        except:
            pass
        
        print(f"Cancelled all reminders for booking {booking_id}")

    def _send_24h_reminder(self, booking_id):
        """Send 24-hour reminder"""
        try:
            booking = self.Booking.query.get(booking_id)
            if booking and booking.status == 'confirmed':
                booking_data = self._get_booking_data(booking)
                result = self.sms_service.send_reminder_24h(booking_data)
                print(f"24h reminder sent for booking {booking_id}: {result}")
        except Exception as e:
            print(f"Error sending 24h reminder for booking {booking_id}: {str(e)}")

    def _send_2h_reminder(self, booking_id):
        """Send 2-hour reminder"""
        try:
            booking = self.Booking.query.get(booking_id)
            if booking and booking.status == 'confirmed':
                booking_data = self._get_booking_data(booking)
                result = self.sms_service.send_reminder_2h(booking_data)
                print(f"2h reminder sent for booking {booking_id}: {result}")
        except Exception as e:
            print(f"Error sending 2h reminder for booking {booking_id}: {str(e)}")

    def _send_followup_message(self, booking_id):
        """Send follow-up message"""
        try:
            booking = self.Booking.query.get(booking_id)
            if booking and booking.status == 'confirmed':
                booking_data = self._get_booking_data(booking)
                result = self.sms_service.send_followup_message(booking_data)
                print(f"Follow-up sent for booking {booking_id}: {result}")
        except Exception as e:
            print(f"Error sending follow-up for booking {booking_id}: {str(e)}")

    def _get_booking_data(self, booking):
        """Convert booking object to data dictionary for SMS"""
        from app import LASH_SERVICES
        
        service_info = LASH_SERVICES.get(booking.service_type, {})
        
        return {
            'client_name': booking.client_name,
            'client_phone': booking.client_phone,
            'appointment_date': booking.appointment_date.strftime('%A, %B %d, %Y'),
            'appointment_time': booking.appointment_time,
            'service_name': service_info.get('name', booking.service_type),
            'price': service_info.get('price', 0),
            'duration': service_info.get('duration', 0)
        }

    def get_scheduled_jobs(self):
        """Get list of all scheduled jobs"""
        return [(job.id, job.next_run_time) for job in self.scheduler.get_jobs()]