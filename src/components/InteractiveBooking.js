import React, { useState, useEffect } from 'react';
import { Calendar, Clock, User, Phone, Mail, Sparkles, CheckCircle, X } from 'lucide-react';

const InteractiveBooking = ({ onClose, onBookingComplete, services }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    client_name: '',
    client_email: '',
    client_phone: '',
    service_type: '',
    appointment_date: '',
    appointment_time: '',
    special_requests: ''
  });

  // Mock data for demonstration - in real app this would come from backend
  const [bookedSlots, setBookedSlots] = useState({
    // Format: 'YYYY-MM-DD': ['time1', 'time2']
    '2024-08-20': ['10:00 AM', '2:00 PM', '4:00 PM'],
    '2024-08-21': ['9:00 AM', '11:00 AM', '3:00 PM', '5:00 PM'],
    '2024-08-22': ['12:00 PM', '1:00 PM'],
    '2024-08-23': ['10:00 AM', '11:00 AM', '2:00 PM', '3:00 PM', '4:00 PM'],
    '2024-08-24': [], // Fully available
    '2024-08-25': ['9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM', '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'], // Fully booked
    '2024-08-26': ['11:00 AM', '1:00 PM'],
  });

  const timeSlots = [
    "9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM",
    "1:00 PM", "2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"
  ];

  const [selectedDate, setSelectedDate] = useState('');
  const [availableSlots, setAvailableSlots] = useState([]);

  // Generate calendar dates for next 30 days
  const generateCalendarDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip Sundays (day 0)
      if (date.getDay() === 0) continue;
      
      const dateStr = date.toISOString().split('T')[0];
      const bookedForDate = bookedSlots[dateStr] || [];
      const availableCount = timeSlots.length - bookedForDate.length;
      
      dates.push({
        date: dateStr,
        dateObj: date,
        day: date.getDate(),
        month: date.getMonth(),
        isToday: dateStr === today.toISOString().split('T')[0],
        isWeekend: date.getDay() === 0 || date.getDay() === 6,
        bookedSlots: bookedForDate,
        availableSlots: availableCount,
        status: availableCount === 0 ? 'fully-booked' : availableCount <= 2 ? 'limited' : 'available'
      });
    }
    
    return dates;
  };

  const calendarDates = generateCalendarDates();

  useEffect(() => {
    if (selectedDate) {
      const bookedForDate = bookedSlots[selectedDate] || [];
      const available = timeSlots.filter(slot => !bookedForDate.includes(slot));
      setAvailableSlots(available);
    }
  }, [selectedDate]);

  const handleDateSelect = (dateStr) => {
    setSelectedDate(dateStr);
    setBookingData(prev => ({ ...prev, appointment_date: dateStr, appointment_time: '' }));
  };

  const handleTimeSelect = (time) => {
    setBookingData(prev => ({ ...prev, appointment_time: time }));
  };

  const handleNext = () => {
    setCurrentStep(prev => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    const selectedService = services[bookingData.service_type];
    const bookingInfo = {
      ...bookingData,
      service_name: selectedService?.name,
      service_price: selectedService?.price,
      service_duration: selectedService?.duration
    };
    
    onBookingComplete(bookingInfo);
  };

  const getDateStatusColor = (status) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-800 border-green-200 hover:bg-green-200';
      case 'limited': return 'bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-200';
      case 'fully-booked': return 'bg-red-100 text-red-800 border-red-200 cursor-not-allowed opacity-60';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-200';
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Choose Your Service</h3>
        <p className="text-gray-600">Select the lash service you'd like to book</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {Object.entries(services).map(([key, service]) => (
          <button
            key={key}
            onClick={() => {
              setBookingData(prev => ({ ...prev, service_type: key }));
              handleNext();
            }}
            className={`p-4 border-2 rounded-xl text-left transition-all duration-200 hover:shadow-md ${
              bookingData.service_type === key 
                ? 'border-pink-500 bg-pink-50' 
                : 'border-gray-200 hover:border-pink-300'
            }`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-gray-900">{service.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{service.description}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-pink-600">${service.price}</p>
                <p className="text-xs text-gray-500">{service.duration} min</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Date</h3>
        <p className="text-gray-600">Choose your preferred appointment date</p>
      </div>

      <div className="grid grid-cols-7 gap-2 text-center text-sm">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="font-medium text-gray-500 py-2">{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {calendarDates.map((dateInfo) => (
          <button
            key={dateInfo.date}
            onClick={() => dateInfo.status !== 'fully-booked' && handleDateSelect(dateInfo.date)}
            disabled={dateInfo.status === 'fully-booked'}
            className={`
              relative p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200
              ${selectedDate === dateInfo.date ? 'border-pink-500 bg-pink-500 text-white' : getDateStatusColor(dateInfo.status)}
            `}
          >
            <div>{dateInfo.day}</div>
            <div className="text-xs mt-1">
              {dateInfo.status === 'fully-booked' ? (
                <span className="text-red-600">Full</span>
              ) : (
                <span className="text-green-600">{dateInfo.availableSlots} slots</span>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-center space-x-6 text-xs">
        <div className="flex items-center">
          <div className="w-4 h-4 bg-green-100 border border-green-200 rounded mr-2"></div>
          <span>Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-yellow-100 border border-yellow-200 rounded mr-2"></div>
          <span>Limited</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 bg-red-100 border border-red-200 rounded mr-2"></div>
          <span>Fully Booked</span>
        </div>
      </div>

      {selectedDate && (
        <div className="mt-6">
          <button
            onClick={handleNext}
            className="w-full btn-primary"
          >
            Continue to Time Selection
          </button>
        </div>
      )}
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Select Time</h3>
        <p className="text-gray-600">
          Available times for {new Date(selectedDate).toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {availableSlots.map((time) => (
          <button
            key={time}
            onClick={() => {
              handleTimeSelect(time);
              handleNext();
            }}
            className={`
              p-3 rounded-lg border-2 font-medium transition-all duration-200 hover:shadow-md
              ${bookingData.appointment_time === time 
                ? 'border-pink-500 bg-pink-500 text-white' 
                : 'border-gray-200 hover:border-pink-300 bg-white text-gray-700'
              }
            `}
          >
            <Clock size={16} className="inline mr-1" />
            {time}
          </button>
        ))}
      </div>

      {availableSlots.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-500">No available slots for this date</p>
          <button
            onClick={handleBack}
            className="mt-2 text-pink-600 hover:text-pink-700"
          >
            Choose a different date
          </button>
        </div>
      )}

      <div className="flex space-x-3">
        <button
          onClick={handleBack}
          className="flex-1 btn-secondary"
        >
          Back to Date
        </button>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Your Information</h3>
        <p className="text-gray-600">Please provide your contact details</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            <User size={16} className="inline mr-1" />
            Full Name
          </label>
          <input
            type="text"
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
            value={bookingData.client_phone}
            onChange={(e) => setBookingData(prev => ({ ...prev, client_phone: e.target.value }))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Enter your phone number"
          />
        </div>

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
      </div>

      <div className="flex space-x-3">
        <button
          onClick={handleBack}
          className="flex-1 btn-secondary"
        >
          Back to Time
        </button>
        <button
          onClick={handleNext}
          disabled={!bookingData.client_name || !bookingData.client_email || !bookingData.client_phone}
          className="flex-1 btn-primary disabled:opacity-50"
        >
          Review Booking
        </button>
      </div>
    </div>
  );

  const renderStep5 = () => {
    const selectedService = services[bookingData.service_type];
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Confirm Your Booking</h3>
          <p className="text-gray-600">Please review your appointment details</p>
        </div>

        <div className="bg-pink-50 rounded-xl p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Service</p>
              <p className="font-semibold text-gray-900">{selectedService?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Price</p>
              <p className="font-semibold text-pink-600">${selectedService?.price}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Date</p>
              <p className="font-semibold text-gray-900">
                {new Date(bookingData.appointment_date).toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Time</p>
              <p className="font-semibold text-gray-900">{bookingData.appointment_time}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="font-semibold text-gray-900">{selectedService?.duration} minutes</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Client</p>
              <p className="font-semibold text-gray-900">{bookingData.client_name}</p>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600">Contact</p>
            <p className="font-semibold text-gray-900">{bookingData.client_email}</p>
            <p className="font-semibold text-gray-900">{bookingData.client_phone}</p>
          </div>

          {bookingData.special_requests && (
            <div>
              <p className="text-sm text-gray-600">Special Requests</p>
              <p className="font-semibold text-gray-900">{bookingData.special_requests}</p>
            </div>
          )}
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleBack}
            className="flex-1 btn-secondary"
          >
            Back to Edit
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 btn-primary"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="bg-gradient-to-r from-pink-500 to-purple-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Book Your Appointment</h2>
              <p className="opacity-90">Step {currentStep} of 5</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4 bg-white/20 rounded-full h-2">
            <div 
              className="bg-white rounded-full h-2 transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        <div className="p-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
        </div>
      </div>
    </div>
  );
};

export default InteractiveBooking;