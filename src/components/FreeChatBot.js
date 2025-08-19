import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send, MessageCircle, X, Calendar, Clock, User, Phone, Mail, Sparkles } from 'lucide-react';

const FreeChatBot = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi! I'm Lash Beauty Bot! 💫 I can help you book your lash appointment. Here's what I can help you with:\n\n💅 Learn about our services\n📅 Check availability\n📝 Book an appointment\n❓ Answer common questions\n\nWhat would you like to do?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState('main');
  const [bookingData, setBookingData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    service_type: '',
    appointment_date: '',
    appointment_time: '',
    special_requests: ''
  });
  const [services] = useState({
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
  });
  
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const addMessage = (text, sender = 'bot') => {
    const newMessage = {
      id: Date.now(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const handleRuleBasedResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Enhanced service shortcuts
    const serviceShortcuts = {
      // Classic lashes shortcuts
      'classic': 'classic_lashes',
      'natural': 'classic_lashes',
      'basic': 'classic_lashes',
      'simple': 'classic_lashes',
      'individual': 'classic_lashes',
      
      // Volume lashes shortcuts
      'volume': 'volume_lashes',
      'full': 'volume_lashes',
      'fluffy': 'volume_lashes',
      'dramatic': 'volume_lashes',
      
      // Mega volume shortcuts
      'mega': 'mega_volume',
      'mega volume': 'mega_volume',
      'russian': 'mega_volume',
      'thick': 'mega_volume',
      'fullest': 'mega_volume',
      'maximum': 'mega_volume',
      
      // Lash lift shortcuts
      'lift': 'lash_lift',
      'lash lift': 'lash_lift',
      'tint': 'lash_lift',
      'curl': 'lash_lift',
      'natural enhancement': 'lash_lift',
      'perm': 'lash_lift',
      
      // Refill shortcuts
      'refill': 'refill',
      'fill': 'refill',
      'touch up': 'refill',
      'maintenance': 'refill',
      'touch-up': 'refill'
    };

    // Check for service shortcuts first
    for (const [shortcut, serviceKey] of Object.entries(serviceShortcuts)) {
      if (input.includes(shortcut)) {
        const service = services[serviceKey];
        addMessage(`Great choice! ${service.name} is perfect for you! ✨\n\n💫 ${service.name} - $${service.price}\n⏱️ Duration: ${service.duration} minutes\n📝 ${service.description}\n\nWould you like to book this service? Just say "book ${service.name.toLowerCase()}" or "book appointment"!`);
        return;
      }
    }
    
    // Service information responses
    if (input.includes('service') || input.includes('what do you offer') || input.includes('price') || input.includes('cost')) {
      const serviceList = Object.entries(services).map(([key, service]) => 
        `💫 ${service.name} - $${service.price} (${service.duration} min)\n   ${service.description}\n   📝 Say: "${service.name.toLowerCase()}" to learn more`
      ).join('\n\n');
      
      addMessage(`Here are our lash services:\n\n${serviceList}\n\n💡 Quick shortcuts:\n• "classic" for natural look\n• "volume" for fuller lashes\n• "mega" for maximum drama\n• "lift" for natural enhancement\n• "refill" for touch-ups\n\nWould you like to book one of these services?`);
      return;
    }

    // Booking flow
    if (input.includes('book') || input.includes('appointment') || input.includes('schedule')) {
      setCurrentStep('booking');
      addMessage("Perfect! I'd love to help you book an appointment. Let me collect some information from you.\n\nFirst, what's your full name?");
      return;
    }

    // Hours/availability
    if (input.includes('hour') || input.includes('open') || input.includes('available') || input.includes('when')) {
      addMessage("📅 We're open:\n\nMonday - Saturday: 9:00 AM - 7:00 PM\nSunday: Closed\n\nAvailable appointment times:\n9:00 AM, 10:00 AM, 11:00 AM, 12:00 PM, 1:00 PM, 2:00 PM, 3:00 PM, 4:00 PM, 5:00 PM\n\nWould you like to book an appointment?");
      return;
    }

    // Location
    if (input.includes('location') || input.includes('address') || input.includes('where')) {
      addMessage("📍 We're located at:\n\n123 Beauty Lane\nYour City, State 12345\n\n📞 Phone: (555) 123-4567\n✉️ Email: hello@lashbeautybykim.com\n\nEasy parking available! Would you like to book an appointment?");
      return;
    }

    // Aftercare
    if (input.includes('aftercare') || input.includes('care') || input.includes('maintain')) {
      addMessage("✨ Lash Aftercare Tips:\n\n• No water/steam for 24-48 hours\n• Use oil-free makeup remover\n• Brush gently with lash wand daily\n• Avoid rubbing or pulling\n• Sleep on your back if possible\n• Book refills every 2-3 weeks\n\nFollowing these tips will keep your lashes looking gorgeous longer! 💕");
      return;
    }

    // Default responses based on keywords
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      addMessage("Hello! 👋 Welcome to LashBeautyByKim! I'm here to help you with:\n\n💅 Service information\n📅 Booking appointments\n📍 Location & hours\n💡 Aftercare tips\n\nWhat can I help you with today?");
      return;
    }

    if (input.includes('thank') || input.includes('thanks')) {
      addMessage("You're so welcome! 💕 I'm always here to help with your lash needs. Is there anything else you'd like to know?");
      return;
    }

    // Default fallback
    addMessage("I'd love to help you! Here are some things I can assist with:\n\n💅 Tell me about your services\n📅 I want to book an appointment\n📍 What are your hours and location?\n💡 Lash aftercare tips\n\nJust let me know what you're interested in! 😊");
  };

  const sendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Handle booking flow
    if (currentStep === 'booking') {
      handleBookingFlow(inputMessage);
    } else {
      // Handle rule-based responses
      setTimeout(() => {
        handleRuleBasedResponse(inputMessage);
      }, 500);
    }

    setInputMessage('');
  };

  const handleBookingFlow = (input) => {
    // Simple booking flow without backend
    if (!bookingData.client_name) {
      setBookingData(prev => ({ ...prev, client_name: input }));
      addMessage(`Nice to meet you, ${input}! 😊\n\nWhat's your email address?`);
    } else if (!bookingData.client_email) {
      setBookingData(prev => ({ ...prev, client_email: input }));
      addMessage(`Perfect! And your phone number?`);
    } else if (!bookingData.client_phone) {
      setBookingData(prev => ({ ...prev, client_phone: input }));
      const serviceOptions = Object.entries(services).map(([key, service]) => 
        `${service.name} - $${service.price}`
      ).join('\n');
      addMessage(`Great! Now, which service would you like?\n\n${serviceOptions}\n\nJust tell me the name of the service you prefer! 💫`);
    } else if (!bookingData.service_type) {
      // Find matching service
      const serviceName = input.toLowerCase();
      let selectedService = null;
      
      for (const [key, service] of Object.entries(services)) {
        if (serviceName.includes(service.name.toLowerCase()) || 
            serviceName.includes(key.replace('_', ' '))) {
          selectedService = key;
          break;
        }
      }
      
      if (selectedService) {
        setBookingData(prev => ({ ...prev, service_type: selectedService }));
        addMessage(`Excellent choice! ${services[selectedService].name} it is! ✨\n\nWhat date would you prefer? (Please use format: MM/DD/YYYY)`);
      } else {
        addMessage("I didn't catch which service you'd like. Could you please tell me again? You can choose from:\n\n" + 
          Object.values(services).map(s => s.name).join('\n'));
      }
    } else if (!bookingData.appointment_date) {
      setBookingData(prev => ({ ...prev, appointment_date: input }));
      addMessage(`Perfect! And what time would you prefer?\n\nAvailable times:\n9:00 AM, 10:00 AM, 11:00 AM, 12:00 PM, 1:00 PM, 2:00 PM, 3:00 PM, 4:00 PM, 5:00 PM`);
    } else if (!bookingData.appointment_time) {
      setBookingData(prev => ({ ...prev, appointment_time: input }));
      
      // Complete booking
      const selectedService = services[bookingData.service_type];
      addMessage(`🎉 Perfect! Here's your booking summary:\n\n👤 Name: ${bookingData.client_name}\n📧 Email: ${bookingData.client_email}\n📞 Phone: ${bookingData.client_phone}\n💫 Service: ${selectedService.name}\n📅 Date: ${bookingData.appointment_date}\n🕐 Time: ${input}\n💰 Price: $${selectedService.price}\n\n✅ Your appointment is confirmed!\n\n📝 IMPORTANT: Please save this information and call us at (555) 123-4567 to finalize your booking.\n\nWe can't wait to see you! 💕`);
      
      // Reset for next booking
      setCurrentStep('main');
      setBookingData({
        client_name: '',
        client_email: '',
        client_phone: '',
        service_type: '',
        appointment_date: '',
        appointment_time: '',
        special_requests: ''
      });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const quickResponses = [
    "Tell me about your services",
    "I want to book an appointment", 
    "What are your hours?",
    "Where are you located?",
    "Lash aftercare tips"
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
                  <h3 className="font-semibold">Lash Beauty Bot</h3>
                  <p className="text-xs opacity-90">FREE - No AI Costs!</p>
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
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Responses */}
          {messages.length <= 2 && (
            <div className="p-4 border-t border-gray-100">
              <p className="text-xs text-gray-500 mb-2">Quick options:</p>
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
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              />
              <button
                onClick={sendMessage}
                disabled={!inputMessage.trim()}
                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-2 rounded-full hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FreeChatBot;