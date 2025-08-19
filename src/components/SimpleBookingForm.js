import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, Sparkles, CheckCircle } from 'lucide-react';

const SimpleBookingForm = () => {
  const [formData, setFormData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    service_type: '',
    appointment_date: '',
    appointment_time: '',
    special_requests: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const services = {
    "classic_lashes": { name: "Classic Lashes", price: 80, duration: 120 },
    "volume_lashes": { name: "Volume Lashes", price: 120, duration: 150 },
    "mega_volume": { name: "Mega Volume Lashes", price: 160, duration: 180 },
    "lash_lift": { name: "Lash Lift & Tint", price: 60, duration: 60 },
    "refill": { name: "Lash Refill", price: 50, duration: 90 }
  };

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create mailto link with booking details
    const selectedService = services[formData.service_type];
    const subject = "Lash Appointment Request";
    const body = `
Hi! I'd like to book a lash appointment:

Name: ${formData.client_name}
Email: ${formData.client_email}
Phone: ${formData.client_phone}
Service: ${selectedService?.name} ($${selectedService?.price})
Preferred Date: ${formData.appointment_date}
Preferred Time: ${formData.appointment_time}
Special Requests: ${formData.special_requests || 'None'}

Please confirm my appointment. Thank you!
    `.trim();

    // Open email client
    window.location.href = `mailto:hello@lashbeautybykim.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    setSubmitted(true);
  };

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8 text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Request Sent! ✨</h2>
        <p className="text-gray-600 mb-6">
          Your email client should have opened with your appointment request. 
          If it didn't, please email us directly at:
        </p>
        <div className="bg-pink-50 rounded-lg p-4 mb-6">
          <p className="font-semibold text-pink-800">hello@lashbeautybykim.com</p>
          <p className="text-pink-600 text-sm mt-1">We'll confirm your appointment within 24 hours!</p>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="btn-primary"
        >
          Book Another Appointment
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
      <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6">
        <h2 className="text-2xl font-bold flex items-center">
          <Sparkles className="mr-2" />
          Book Your Lash Appointment
        </h2>
        <p className="opacity-90 mt-1">Fill out the form below and we'll confirm your appointment!</p>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <User size={16} className="inline mr-1" />
              Full Name *
            </label>
            <input
              type="text"
              name="client_name"
              required
              value={formData.client_name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Mail size={16} className="inline mr-1" />
              Email Address *
            </label>
            <input
              type="email"
              name="client_email"
              required
              value={formData.client_email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Phone size={16} className="inline mr-1" />
              Phone Number *
            </label>
            <input
              type="tel"
              name="client_phone"
              required
              value={formData.client_phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Sparkles size={16} className="inline mr-1" />
              Service Type *
            </label>
            <select
              name="service_type"
              required
              value={formData.service_type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
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
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Preferred Date *
            </label>
            <input
              type="date"
              name="appointment_date"
              required
              value={formData.appointment_date}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock size={16} className="inline mr-1" />
              Preferred Time *
            </label>
            <select
              name="appointment_time"
              required
              value={formData.appointment_time}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            >
              <option value="">Select a time</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>
                  {slot}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Special Requests (Optional)
          </label>
          <textarea
            name="special_requests"
            value={formData.special_requests}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            rows={4}
            placeholder="Any special requests or notes..."
          />
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p className="text-yellow-800 text-sm">
            <strong>How it works:</strong> When you submit this form, your email client will open with a pre-filled message. 
            Send the email and we'll confirm your appointment within 24 hours!
          </p>
        </div>

        <button
          type="submit"
          className="w-full btn-primary text-lg py-3"
        >
          Send Appointment Request ✨
        </button>
      </form>
    </div>
  );
};

export default SimpleBookingForm;