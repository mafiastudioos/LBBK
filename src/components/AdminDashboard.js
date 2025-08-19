import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, Clock, Phone, Mail, MessageSquare, CheckCircle, XCircle, Send, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [smsStatus, setSmsStatus] = useState({});
  const [scheduledJobs, setScheduledJobs] = useState([]);

  useEffect(() => {
    fetchBookings();
    fetchScheduledJobs();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/bookings');
      if (response.data.success) {
        setBookings(response.data.bookings);
        // Fetch SMS status for each booking
        response.data.bookings.forEach(booking => {
          fetchSmsStatus(booking.id);
        });
      }
    } catch (error) {
      console.error('Error fetching bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchSmsStatus = async (bookingId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/sms-status/${bookingId}`);
      if (response.data.success) {
        setSmsStatus(prev => ({
          ...prev,
          [bookingId]: response.data
        }));
      }
    } catch (error) {
      console.error(`Error fetching SMS status for booking ${bookingId}:`, error);
    }
  };

  const fetchScheduledJobs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/scheduled-jobs');
      if (response.data.success) {
        setScheduledJobs(response.data.scheduled_jobs);
      }
    } catch (error) {
      console.error('Error fetching scheduled jobs:', error);
    }
  };

  const sendManualReminder = async (bookingId) => {
    try {
      const response = await axios.post(`http://localhost:5000/api/send-reminder/${bookingId}`);
      if (response.data.success) {
        alert('Reminder sent successfully!');
        fetchSmsStatus(bookingId);
      } else {
        alert('Failed to send reminder: ' + response.data.error);
      }
    } catch (error) {
      alert('Error sending reminder: ' + error.message);
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      const response = await axios.post(`http://localhost:5000/api/cancel-booking/${bookingId}`);
      if (response.data.success) {
        alert('Booking cancelled successfully!');
        fetchBookings();
        fetchScheduledJobs();
      } else {
        alert('Failed to cancel booking: ' + response.data.error);
      }
    } catch (error) {
      alert('Error cancelling booking: ' + error.message);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed': return 'text-green-600 bg-green-100';
      case 'cancelled': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage bookings and SMS notifications</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Bookings</p>
                <p className="text-2xl font-bold text-gray-900">{bookings.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Confirmed</p>
                <p className="text-2xl font-bold text-gray-900">
                  {bookings.filter(b => b.status === 'confirmed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <MessageSquare className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">SMS Sent</p>
                <p className="text-2xl font-bold text-gray-900">
                  {Object.values(smsStatus).filter(s => s.confirmation_sent).length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Scheduled Jobs</p>
                <p className="text-2xl font-bold text-gray-900">{scheduledJobs.length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bookings Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">Recent Bookings</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SMS Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {bookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.client_name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Mail className="h-4 w-4 mr-1" />
                            {booking.client_email}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <Phone className="h-4 w-4 mr-1" />
                            {booking.client_phone}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.service_type}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {formatDate(booking.appointment_date)}
                      </div>
                      <div className="text-sm text-gray-500">{booking.appointment_time}</div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {smsStatus[booking.id] && (
                        <div className="text-xs space-y-1">
                          <div className={`flex items-center ${smsStatus[booking.id].confirmation_sent ? 'text-green-600' : 'text-gray-400'}`}>
                            {smsStatus[booking.id].confirmation_sent ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                            Confirmation
                          </div>
                          <div className={`flex items-center ${smsStatus[booking.id].reminder_24h_sent ? 'text-green-600' : 'text-gray-400'}`}>
                            {smsStatus[booking.id].reminder_24h_sent ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                            24h Reminder
                          </div>
                          <div className={`flex items-center ${smsStatus[booking.id].reminder_2h_sent ? 'text-green-600' : 'text-gray-400'}`}>
                            {smsStatus[booking.id].reminder_2h_sent ? <CheckCircle className="h-3 w-3 mr-1" /> : <XCircle className="h-3 w-3 mr-1" />}
                            2h Reminder
                          </div>
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      {booking.status === 'confirmed' && (
                        <button
                          onClick={() => sendManualReminder(booking.id)}
                          className="text-blue-600 hover:text-blue-900 flex items-center"
                          title="Send Manual Reminder"
                        >
                          <Send className="h-4 w-4" />
                        </button>
                      )}
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => cancelBooking(booking.id)}
                          className="text-red-600 hover:text-red-900 flex items-center"
                          title="Cancel Booking"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Scheduled Jobs */}
        {scheduledJobs.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Scheduled Reminders</h2>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {scheduledJobs.map((job, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-900">{job.id}</div>
                    <div className="text-xs text-gray-500">
                      {job.next_run ? new Date(job.next_run).toLocaleString() : 'No next run'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;