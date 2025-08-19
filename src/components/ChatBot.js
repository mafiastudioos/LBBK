import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, MessageCircle, X, Calendar, Clock, User, Phone, Mail, Sparkles } from 'lucide-react';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Luna, your personal lash assistant! 💫 I'm here to help you find the perfect lash service and book your appointment. What can I help you with today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    service_type: '',
    appointment_date: '',
    appointment_time: '',
    special_requests: ''
  });
  const [services, setServices] = useState({});
  const [availableSlots, setAvailableSlots] = useState([]);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/services');
      if (response.data.success) {
        setServices(response.data.services);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const fetchAvailableSlots = async (date) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/available-slots?date=${date}`);
      if (response.data.success) {
        setAvailableSlots(response.data.available_slots);
      }
    } catch (error) {
      console.error('Error fetching available slots:', error);
      setAvailableSlots([]);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        message: inputMessage,
        session_id: sessionId
      });

      if (response.data.success) {
        const botMessage = {
          id: Date.now() + 1,
          text: response.data.response,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);

        // Check if the bot suggests booking
        if (response.data.response.toLowerCase().includes('book') || 
            response.data.response.toLowerCase().includes('appointment')) {
          setTimeout(() => {
            setShowBookingForm(true);
          }, 1000);
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage = {
        id: Date.now() + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/book', bookingData);
      
      if (response.data.success) {
        const successMessage = {
          id: Date.now(),
          text: `🎉 Perfect! Your appointment has been booked successfully! 
          
📅 **Booking Details:**
- **Service:** ${services[bookingData.service_type]?.name || bookingData.service_type}
- **Date:** ${bookingData.appointment_date}
- **Time:** ${bookingData.appointment_time}
- **Booking ID:** ${response.data.booking_id}

📱 **Text Notifications:**
${response.data.sms_sent ? '✅ Confirmation text sent!' : '⚠️ Confirmation text pending'}
- You'll receive a 24-hour reminder
- You'll get a 2-hour reminder on appointment day
- Follow-up care tips after your service

I can't wait to see you for your lash appointment! ✨`,
          sender: 'bot',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, successMessage]);
        setShowBookingForm(false);
        setBookingData({
          client_name: '',
          client_email: '',
          client_phone: '',
          service_type: '',
          appointment_date: '',
          appointment_time: '',
          special_requests: ''
        });
      } else {
        throw new Error(response.data.error);
      }
    } catch (error) {
      const errorMessage = {
        id: Date.now(),
        text: `I'm sorry, there was an issue booking your appointment: ${error.response?.data?.error || error.message}. Please try again or let me know if you'd like to choose a different time slot.`,
        sender: 'bot',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (date) => {
    setBookingData(prev => ({ ...prev, appointment_date: date, appointment_time: '' }));
    if (date) {
      fetchAvailableSlots(date);
    }
  };

  const quickResponses = [
    "What services do you offer?",
    "How much do lash extensions cost?",
    "How long do appointments take?",
    "I'd like to book an appointment",
    "What's the difference between classic and volume lashes?"
  ];

  return (
    <>
      {/* Chat Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-full shadow-2xl hover:shadow-3xl transform hover:scale-110 transition-all duration-300 z-50"
        >
          <MessageCircle size={28} />
          <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center animate-pulse">
            💬
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-t-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles size={20} />
                </div>
                <div>
                  <h3 className="font-semibold">Luna</h3>
                  <p className="text-xs opacity-90">Your Lash Assistant</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white/80 hover:text-white transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 chat-messages">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                  <p className={`text-xs mt-1 ${
                    message.sender === 'user' ? 'text-white/70' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 px-4 py-2 rounded-2xl">
                  <div className="typing-indicator">
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                    <div className="typing-dot"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Responses */}
          {messages.length <= 2 && (
            <div className="p-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
              <div className="flex flex-wrap gap-2">
                {quickResponses.slice(0, 3).map((response, index) => (
                  <button
                    key={index}
                    onClick={() => setInputMessage(response)}
                    className="text-xs bg-pink-50 text-pink-600 px-3 py-1 rounded-full hover:bg-pink-100 transition-colors"
                  >
                    {response}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex space-x-2">
              <input
                ref={inputRef}
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !inputMessage.trim()}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-2 rounded-full hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>

          {/* Booking Form Modal */}
          {showBookingForm && (
            <div className="absolute inset-0 bg-white rounded-2xl z-10">
              <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-4 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold">Book Your Appointment</h3>
                  <button
                    onClick={() => setShowBookingForm(false)}
                    className="text-white/80 hover:text-white transition-colors"
                  >
                    <X size={20} />
                  </button>
                </div>
              </div>

              <form onSubmit={handleBookingSubmit} className="p-4 space-y-4 overflow-y-auto h-full">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <User size={16} className="inline mr-1" />
                    Full Name
                  </label>
                  <input
                    type="text"
                    required
                    value={bookingData.client_name}
                    onChange={(e) => setBookingData(prev => ({ ...prev, client_name: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Mail size={16} className="inline mr-1" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={bookingData.client_email}
                    onChange={(e) => setBookingData(prev => ({ ...prev, client_email: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Phone size={16} className="inline mr-1" />
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={bookingData.client_phone}
                    onChange={(e) => setBookingData(prev => ({ ...prev, client_phone: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    placeholder="Enter your phone number"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Sparkles size={16} className="inline mr-1" />
                    Service Type
                  </label>
                  <select
                    required
                    value={bookingData.service_type}
                    onChange={(e) => setBookingData(prev => ({ ...prev, service_type: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  >
                    <option value="">Select a service</option>
                    {Object.entries(services).map(([key, service]) => (
                      <option key={key} value={key}>
                        {service.name} - ${service.price} ({service.duration} min)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Calendar size={16} className="inline mr-1" />
                    Appointment Date
                  </label>
                  <input
                    type="date"
                    required
                    value={bookingData.appointment_date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                  />
                </div>

                {bookingData.appointment_date && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <Clock size={16} className="inline mr-1" />
                      Appointment Time
                    </label>
                    <select
                      required
                      value={bookingData.appointment_time}
                      onChange={(e) => setBookingData(prev => ({ ...prev, appointment_time: e.target.value }))}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    >
                      <option value="">Select a time</option>
                      {availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {slot}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={bookingData.special_requests}
                    onChange={(e) => setBookingData(prev => ({ ...prev, special_requests: e.target.value }))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
                    rows={3}
                    placeholder="Any special requests or notes..."
                  />
                </div>

                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowBookingForm(false)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="flex-1 btn-primary disabled:opacity-50"
                  >
                    {isLoading ? 'Booking...' : 'Book Appointment'}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ChatBot;