# LashLuxe - AI Lash Booking Chatbot

A sophisticated AI-powered chatbot for booking lash extension appointments with automated SMS reminders and confirmations.

## Features

### 🤖 AI Chatbot
- **Lash Beauty Bot**: Intelligent AI assistant powered by OpenAI GPT
- Natural conversation flow for booking appointments
- Service recommendations based on client needs
- Real-time availability checking
- Comprehensive lash service knowledge

### 📱 SMS Notifications
- **Instant Confirmation**: Immediate SMS when booking is made
- **24-Hour Reminder**: Automated reminder sent day before appointment
- **2-Hour Reminder**: Final reminder on appointment day
- **Follow-up Care**: Aftercare tips sent 24 hours post-appointment
- **Cancellation Confirmations**: SMS notifications for cancelled bookings

### 💅 Lash Services
- Classic Lashes ($80, 120 min)
- Volume Lashes ($120, 150 min)
- Mega Volume Lashes ($160, 180 min)
- Lash Lift & Tint ($60, 60 min)
- Lash Refills ($50, 90 min)

### 🎛️ Admin Dashboard
- View all bookings and their status
- Monitor SMS delivery status
- Send manual reminders
- Cancel bookings with automatic notifications
- Track scheduled reminder jobs

## Tech Stack

### Backend
- **Flask**: Python web framework
- **SQLAlchemy**: Database ORM
- **OpenAI API**: GPT-3.5 for AI conversations
- **Twilio**: SMS messaging service
- **APScheduler**: Background job scheduling
- **SQLite**: Database storage

### Frontend
- **React**: User interface framework
- **Tailwind CSS**: Styling framework
- **Lucide React**: Icon library
- **Axios**: HTTP client

## Setup Instructions

### Prerequisites
- Python 3.8+
- Node.js 16+
- OpenAI API key
- Twilio account (for SMS functionality)

### 1. Clone and Setup Environment

```bash
git clone <repository-url>
cd lash-booking-chatbot

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install Python dependencies
pip install -r requirements.txt

# Install Node.js dependencies
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Twilio Configuration (for SMS)
TWILIO_ACCOUNT_SID=your_twilio_account_sid
TWILIO_AUTH_TOKEN=your_twilio_auth_token
TWILIO_PHONE_NUMBER=+1234567890

# Flask Configuration
FLASK_ENV=development
DATABASE_URL=sqlite:///bookings.db
```

### 3. Get API Keys

#### OpenAI API Key
1. Visit [OpenAI Platform](https://platform.openai.com)
2. Create an account and navigate to API Keys
3. Create a new API key
4. Add to your `.env` file

#### Twilio Setup (for SMS)
1. Create account at [Twilio](https://www.twilio.com)
2. Get your Account SID and Auth Token from the Console
3. Purchase a phone number for sending SMS
4. Add credentials to your `.env` file

### 4. Database Setup

The database will be automatically created when you first run the Flask app.

### 5. Running the Application

#### Development Mode

```bash
# Terminal 1: Start Flask backend
cd backend
python app.py

# Terminal 2: Start React frontend
npm start
```

#### Using Concurrent Mode

```bash
# Run both frontend and backend together
npm run dev
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## Usage

### For Clients
1. Visit the website
2. Click the chat bubble to start conversation with Lash Beauty Bot
3. Ask questions about services or request to book an appointment
4. Follow Lash Beauty Bot's guidance to complete booking
5. Receive immediate SMS confirmation
6. Get automated reminders before your appointment

### For Administrators
1. Access the admin dashboard at `/admin` (you'll need to add routing)
2. View all bookings and their SMS status
3. Send manual reminders if needed
4. Cancel bookings (clients get automatic SMS notification)
5. Monitor scheduled reminder jobs

## API Endpoints

### Chat & Booking
- `POST /api/chat` - Send message to AI chatbot
- `POST /api/book` - Create new booking
- `GET /api/services` - Get available services
- `GET /api/available-slots` - Get available time slots for date

### SMS Management
- `POST /api/send-reminder/{booking_id}` - Send manual reminder
- `GET /api/sms-status/{booking_id}` - Get SMS delivery status
- `POST /api/cancel-booking/{booking_id}` - Cancel booking with SMS

### Admin
- `GET /api/bookings` - Get all bookings
- `GET /api/scheduled-jobs` - Get scheduled reminder jobs

## SMS Message Templates

### Confirmation Message
```
🌟 LashLuxe Booking Confirmed! 🌟

Hi [Name]! Your lash appointment is confirmed:
📅 Date: [Date]
🕐 Time: [Time]
💫 Service: [Service]
💰 Price: $[Price]

📍 Location: 123 Beauty Lane, City
📞 Questions? Call us at (555) 123-4567

We can't wait to make your lashes gorgeous! ✨
```

### 24-Hour Reminder
```
✨ LashLuxe Reminder ✨

Hi [Name]! Reminder about your lash appointment:
📅 Tomorrow at [Time]
💫 Service: [Service]

Prep tips:
• Come with clean lashes (no mascara/makeup)
• Avoid caffeine 2hrs before
• Bring headphones for music

Need to reschedule? Call (555) 123-4567
```

## Deployment

### Production Deployment

1. **Environment Setup**
   ```bash
   export FLASK_ENV=production
   export OPENAI_API_KEY=your_production_key
   export TWILIO_ACCOUNT_SID=your_production_sid
   # ... other environment variables
   ```

2. **Database Migration**
   ```bash
   # For production, consider using PostgreSQL
   export DATABASE_URL=postgresql://user:password@host:port/dbname
   ```

3. **Build Frontend**
   ```bash
   npm run build
   ```

4. **Deploy Options**
   - **Heroku**: Use provided `Procfile`
   - **AWS**: Deploy with Elastic Beanstalk or EC2
   - **DigitalOcean**: Use App Platform or Droplets
   - **Vercel**: Frontend deployment with serverless functions

### Docker Deployment (Optional)

```dockerfile
# Dockerfile example
FROM python:3.9-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt

COPY . .
EXPOSE 5000

CMD ["python", "backend/app.py"]
```

## Customization

### Adding New Services
Update the `LASH_SERVICES` dictionary in `backend/app.py`:

```python
LASH_SERVICES = {
    "new_service": {
        "name": "New Service Name",
        "duration": 90,  # minutes
        "price": 100,    # dollars
        "description": "Service description"
    }
}
```

### Modifying SMS Templates
Edit the message templates in `backend/sms_service.py` to match your business branding and requirements.

### Customizing AI Responses
Update the system prompt in the `get_ai_response` function in `backend/app.py` to adjust Lash Beauty Bot's personality and knowledge base.

## Troubleshooting

### Common Issues

1. **SMS Not Sending**
   - Verify Twilio credentials are correct
   - Check phone number format (include country code)
   - Ensure Twilio account has sufficient balance

2. **AI Responses Not Working**
   - Verify OpenAI API key is valid
   - Check API usage limits
   - Ensure internet connection for API calls

3. **Database Errors**
   - Delete `bookings.db` and restart to recreate database
   - Check file permissions in the project directory

4. **Frontend Build Issues**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Check Node.js version compatibility

## Support

For support and questions:
- Email: support@lashluxe.com
- Phone: (555) 123-4567

## License

This project is licensed under the MIT License - see the LICENSE file for details.
