import React, { useState } from 'react';
import { Shield, MapPin, Phone, Mail, User, CheckCircle, XCircle, Clock, AlertTriangle } from 'lucide-react';

const VerificationSystem = ({ bookingData, onVerificationComplete }) => {
  const [verificationStep, setVerificationStep] = useState(1);
  const [verificationData, setVerificationData] = useState({
    governmentId: '',
    emergencyContact: '',
    emergencyPhone: '',
    socialMediaProfile: '',
    referralSource: '',
    depositAmount: 25, // $25 deposit for verification
    paymentMethod: '',
    agreesToTerms: false,
    agreesToBackground: false
  });
  const [verificationStatus, setVerificationStatus] = useState('pending'); // pending, approved, rejected
  const [adminNotificationSent, setAdminNotificationSent] = useState(false);

  // Your admin phone number for verification notifications
  const ADMIN_PHONE = "+1234567890"; // Replace with your actual number

  const handleVerificationSubmit = async () => {
    try {
      // Send verification request to admin (you)
      const adminMessage = `🔒 NEW CLIENT VERIFICATION REQUEST

📋 Booking Details:
• Client: ${bookingData.client_name}
• Phone: ${bookingData.client_phone}
• Email: ${bookingData.client_email}
• Service: ${bookingData.service_name}
• Date: ${bookingData.appointment_date}
• Time: ${bookingData.appointment_time}

🛡️ Verification Info:
• Gov ID: ${verificationData.governmentId}
• Emergency Contact: ${verificationData.emergencyContact} (${verificationData.emergencyPhone})
• Social Media: ${verificationData.socialMediaProfile}
• Referral: ${verificationData.referralSource}
• Deposit: $${verificationData.depositAmount}

✅ To APPROVE and send address:
Reply "APPROVE ${bookingData.client_phone}"

❌ To REJECT:
Reply "REJECT ${bookingData.client_phone}"

🏠 Your address will only be sent AFTER your approval.`;

      // Simulate SMS to admin
      console.log(`SMS to ${ADMIN_PHONE}:`, adminMessage);
      
      // In real implementation, this would be:
      // await sendSMS(ADMIN_PHONE, adminMessage);
      
      setAdminNotificationSent(true);
      setVerificationStatus('pending');
      
      // Send confirmation to client
      const clientMessage = `🔒 LashBeautyByKim - Verification Submitted

Hi ${bookingData.client_name}! Your verification has been submitted for review.

📋 Next Steps:
• Kim will review your information within 2 hours
• You'll receive address details once approved
• Your $${verificationData.depositAmount} deposit secures your appointment

⏰ Appointment: ${bookingData.appointment_date} at ${bookingData.appointment_time}

Thank you for understanding our safety procedures! 💕`;

      console.log(`SMS to ${bookingData.client_phone}:`, clientMessage);
      
      alert(`TEST RUN - Messages would be sent to:
      
ADMIN (${ADMIN_PHONE}):
${adminMessage}

CLIENT (${bookingData.client_phone}):
${clientMessage}`);
      
    } catch (error) {
      console.error('Error sending verification request:', error);
    }
  };

  const simulateAdminApproval = () => {
    // Simulate admin approving the client
    const approvalMessage = `✅ LashBeautyByKim - APPROVED!

Hi ${bookingData.client_name}! Great news - you've been approved for home service! 🎉

📍 SERVICE ADDRESS:
123 Beauty Lane
Apt 4B
Your City, State 12345

🚗 PARKING:
• Street parking available
• Visitor spots in front of building
• Ring buzzer #4B when you arrive

📝 IMPORTANT REMINDERS:
• Arrive exactly on time
• Come with clean lashes (no makeup)
• Bring a valid ID
• Your deposit is confirmed

⏰ Appointment: ${bookingData.appointment_date} at ${bookingData.appointment_time}

See you soon! Can't wait to make your lashes gorgeous! ✨

Questions? Call/text: (555) 123-4567`;

    console.log(`APPROVED - SMS to ${bookingData.client_phone}:`, approvalMessage);
    
    setVerificationStatus('approved');
    
    alert(`ADMIN APPROVAL SIMULATION:
    
Address sent to client (${bookingData.client_phone}):
${approvalMessage}`);
  };

  const simulateAdminRejection = () => {
    const rejectionMessage = `❌ LashBeautyByKim - Application Update

Hi ${bookingData.client_name}, thank you for your interest in our services.

Unfortunately, we're unable to provide home service at this time. We'd love to serve you at our studio location instead!

💫 STUDIO OPTION:
• Same services available
• Professional studio setting
• Easy booking available

Your deposit will be refunded within 2-3 business days.

Questions? Call us at (555) 123-4567

Thank you for understanding! 💕`;

    console.log(`REJECTED - SMS to ${bookingData.client_phone}:`, rejectionMessage);
    
    setVerificationStatus('rejected');
    
    alert(`ADMIN REJECTION SIMULATION:
    
Message sent to client (${bookingData.client_phone}):
${rejectionMessage}`);
  };

  const renderVerificationForm = () => (
    <div className="space-y-6">
      <div className="text-center">
        <Shield className="w-16 h-16 text-pink-400 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">Security Verification Required</h3>
        <p className="text-pink-200/80">For home services, we require verification to ensure everyone's safety</p>
      </div>

      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-lg p-4">
        <div className="flex items-center">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mr-2" />
          <p className="text-yellow-200 text-sm">
            <strong>Required:</strong> $25 refundable deposit + verification for home service approval
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-pink-200 mb-2">
            <User className="w-4 h-4 inline mr-1" />
            Government ID (Driver's License #, State ID #, or Passport #) *
          </label>
          <input
            type="text"
            value={verificationData.governmentId}
            onChange={(e) => setVerificationData(prev => ({ ...prev, governmentId: e.target.value }))}
            className="w-full bg-black/40 border border-pink-500/30 rounded-lg px-4 py-2 text-white focus:border-pink-400 focus:outline-none"
            placeholder="e.g., DL123456789 (CA)"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-pink-200 mb-2">
              Emergency Contact Name *
            </label>
            <input
              type="text"
              value={verificationData.emergencyContact}
              onChange={(e) => setVerificationData(prev => ({ ...prev, emergencyContact: e.target.value }))}
              className="w-full bg-black/40 border border-pink-500/30 rounded-lg px-4 py-2 text-white focus:border-pink-400 focus:outline-none"
              placeholder="Full name"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-pink-200 mb-2">
              <Phone className="w-4 h-4 inline mr-1" />
              Emergency Contact Phone *
            </label>
            <input
              type="tel"
              value={verificationData.emergencyPhone}
              onChange={(e) => setVerificationData(prev => ({ ...prev, emergencyPhone: e.target.value }))}
              className="w-full bg-black/40 border border-pink-500/30 rounded-lg px-4 py-2 text-white focus:border-pink-400 focus:outline-none"
              placeholder="(555) 123-4567"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-pink-200 mb-2">
            Social Media Profile (Instagram/Facebook) *
          </label>
          <input
            type="url"
            value={verificationData.socialMediaProfile}
            onChange={(e) => setVerificationData(prev => ({ ...prev, socialMediaProfile: e.target.value }))}
            className="w-full bg-black/40 border border-pink-500/30 rounded-lg px-4 py-2 text-white focus:border-pink-400 focus:outline-none"
            placeholder="https://instagram.com/yourusername"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-pink-200 mb-2">
            How did you hear about us?
          </label>
          <select
            value={verificationData.referralSource}
            onChange={(e) => setVerificationData(prev => ({ ...prev, referralSource: e.target.value }))}
            className="w-full bg-black/40 border border-pink-500/30 rounded-lg px-4 py-2 text-white focus:border-pink-400 focus:outline-none"
          >
            <option value="">Select...</option>
            <option value="instagram">Instagram</option>
            <option value="facebook">Facebook</option>
            <option value="friend">Friend/Referral</option>
            <option value="google">Google Search</option>
            <option value="tiktok">TikTok</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="bg-pink-900/20 border border-pink-500/30 rounded-lg p-4">
          <h4 className="font-semibold text-pink-200 mb-2">Security Deposit</h4>
          <p className="text-pink-200/80 text-sm mb-3">
            $25 refundable deposit required for home service verification. 
            Refunded if service is cancelled or declined.
          </p>
          <div className="text-2xl font-bold text-pink-400">${verificationData.depositAmount}</div>
        </div>

        <div className="space-y-3">
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={verificationData.agreesToTerms}
              onChange={(e) => setVerificationData(prev => ({ ...prev, agreesToTerms: e.target.checked }))}
              className="mt-1 w-4 h-4 text-pink-500 border-pink-500/30 rounded focus:ring-pink-400"
            />
            <span className="text-sm text-pink-200/80">
              I agree to provide valid identification upon arrival and understand that home service 
              requires approval for safety reasons. I consent to background verification.
            </span>
          </label>
          
          <label className="flex items-start space-x-3">
            <input
              type="checkbox"
              checked={verificationData.agreesToBackground}
              onChange={(e) => setVerificationData(prev => ({ ...prev, agreesToBackground: e.target.checked }))}
              className="mt-1 w-4 h-4 text-pink-500 border-pink-500/30 rounded focus:ring-pink-400"
            />
            <span className="text-sm text-pink-200/80">
              I understand the address will only be provided after approval, and I agree to 
              arrive on time and follow all safety protocols.
            </span>
          </label>
        </div>
      </div>

      <button
        onClick={handleVerificationSubmit}
        disabled={!verificationData.governmentId || !verificationData.emergencyContact || 
                 !verificationData.emergencyPhone || !verificationData.socialMediaProfile ||
                 !verificationData.agreesToTerms || !verificationData.agreesToBackground}
        className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold py-3 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
      >
        Submit Verification & Pay Deposit ($25)
      </button>
    </div>
  );

  const renderPendingStatus = () => (
    <div className="text-center space-y-6">
      <Clock className="w-16 h-16 text-yellow-400 mx-auto animate-pulse" />
      <h3 className="text-2xl font-bold text-white">Verification Under Review</h3>
      <p className="text-pink-200/80">
        Your information has been sent to Kim for review. You'll receive the address once approved.
      </p>
      
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
        <p className="text-blue-200 text-sm">
          <strong>Review Time:</strong> Usually within 2 hours<br />
          <strong>Status:</strong> Pending approval<br />
          <strong>Next Step:</strong> Address will be sent via SMS once approved
        </p>
      </div>

      {/* TEST BUTTONS - Remove in production */}
      <div className="bg-gray-900/50 border border-gray-500/30 rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">🧪 TEST ADMIN ACTIONS (Remove in production)</h4>
        <div className="flex space-x-3">
          <button
            onClick={simulateAdminApproval}
            className="flex-1 bg-green-600 text-white py-2 px-4 rounded text-sm hover:bg-green-700"
          >
            ✅ Simulate Approve
          </button>
          <button
            onClick={simulateAdminRejection}
            className="flex-1 bg-red-600 text-white py-2 px-4 rounded text-sm hover:bg-red-700"
          >
            ❌ Simulate Reject
          </button>
        </div>
      </div>
    </div>
  );

  const renderApprovedStatus = () => (
    <div className="text-center space-y-6">
      <CheckCircle className="w-16 h-16 text-green-400 mx-auto" />
      <h3 className="text-2xl font-bold text-white">Approved! Address Sent</h3>
      <p className="text-pink-200/80">
        Congratulations! You've been approved for home service. The address has been sent to your phone.
      </p>
      
      <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
        <p className="text-green-200 text-sm">
          <strong>✅ Verification Complete</strong><br />
          <strong>📍 Address sent to:</strong> {bookingData.client_phone}<br />
          <strong>📅 Appointment:</strong> {bookingData.appointment_date} at {bookingData.appointment_time}
        </p>
      </div>
    </div>
  );

  const renderRejectedStatus = () => (
    <div className="text-center space-y-6">
      <XCircle className="w-16 h-16 text-red-400 mx-auto" />
      <h3 className="text-2xl font-bold text-white">Application Declined</h3>
      <p className="text-pink-200/80">
        We're unable to provide home service at this time. Studio service is available instead.
      </p>
      
      <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4">
        <p className="text-red-200 text-sm">
          <strong>Refund:</strong> Your $25 deposit will be refunded within 2-3 business days<br />
          <strong>Alternative:</strong> Studio appointments available<br />
          <strong>Contact:</strong> (555) 123-4567 for questions
        </p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gradient-to-br from-gray-900 via-purple-900/50 to-black border border-pink-500/20 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {verificationStatus === 'pending' && adminNotificationSent && renderPendingStatus()}
          {verificationStatus === 'approved' && renderApprovedStatus()}
          {verificationStatus === 'rejected' && renderRejectedStatus()}
          {verificationStatus === 'pending' && !adminNotificationSent && renderVerificationForm()}
        </div>
      </div>
    </div>
  );
};

export default VerificationSystem;