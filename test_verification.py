#!/usr/bin/env python3
"""
Test script for the LashBeautyByKim verification system
This demonstrates the complete flow for home service verification
"""

import requests
import json
import time
from datetime import datetime

# Configuration
BASE_URL = "http://localhost:5000"
YOUR_PHONE = "+1234567890"  # Replace with your actual phone number

def test_verification_flow():
    """Test the complete verification flow"""
    
    print("🧪 TESTING LASHBEAUTYBYKIM VERIFICATION SYSTEM")
    print("=" * 60)
    
    # Test data
    test_client_data = {
        'client_name': 'Sarah Johnson',
        'client_phone': YOUR_PHONE,  # This will be your phone for testing
        'client_email': 'sarah.test@example.com',
        'service_type': 'volume_lashes',
        'appointment_date': '2024-08-25',
        'appointment_time': '2:00 PM',
        'special_requests': 'First time client, home service requested'
    }
    
    verification_data = {
        'government_id': 'DL123456789 (CA)',
        'emergency_contact': 'Mike Johnson (Brother)',
        'emergency_phone': '+1987654321',
        'social_media_profile': 'https://instagram.com/sarah_johnson_test',
        'referral_source': 'Instagram',
        'deposit_amount': 25
    }
    
    print("📋 TEST CLIENT DATA:")
    print(f"Name: {test_client_data['client_name']}")
    print(f"Phone: {test_client_data['client_phone']}")
    print(f"Service: Volume Lashes")
    print(f"Date: {test_client_data['appointment_date']} at {test_client_data['appointment_time']}")
    print()
    
    # Step 1: Create a booking first
    print("1️⃣ CREATING TEST BOOKING...")
    try:
        booking_response = requests.post(f"{BASE_URL}/api/book", json=test_client_data)
        
        if booking_response.status_code == 200:
            booking_result = booking_response.json()
            booking_id = booking_result.get('booking_id')
            print(f"✅ Booking created successfully! ID: {booking_id}")
        else:
            print(f"❌ Failed to create booking: {booking_response.text}")
            return
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure Flask app is running on localhost:5000")
        return
    except Exception as e:
        print(f"❌ Error creating booking: {e}")
        return
    
    print()
    
    # Step 2: Submit verification request
    print("2️⃣ SUBMITTING VERIFICATION REQUEST...")
    verification_payload = {
        'booking_id': booking_id,
        **verification_data
    }
    
    try:
        verification_response = requests.post(f"{BASE_URL}/api/verify-client", json=verification_payload)
        
        if verification_response.status_code == 200:
            verification_result = verification_response.json()
            print("✅ Verification request submitted!")
            print(f"Admin notified: {verification_result.get('admin_notified')}")
            print(f"Client notified: {verification_result.get('client_notified')}")
            print()
            print("📱 CHECK YOUR PHONE NOW!")
            print("You should receive an SMS with verification details and approval/rejection options.")
        else:
            print(f"❌ Failed to submit verification: {verification_response.text}")
            return
            
    except Exception as e:
        print(f"❌ Error submitting verification: {e}")
        return
    
    print()
    
    # Step 3: Wait for admin response simulation
    print("3️⃣ ADMIN RESPONSE SIMULATION")
    print("In a real scenario, you would:")
    print("• Receive SMS with client verification details")
    print("• Review the client information")
    print("• Text back 'APPROVE +1234567890' or 'REJECT +1234567890'")
    print()
    
    # Simulate admin approval
    print("🤖 SIMULATING ADMIN APPROVAL...")
    time.sleep(2)
    
    try:
        approval_response = requests.post(f"{BASE_URL}/api/admin/approve-client", json={'booking_id': booking_id})
        
        if approval_response.status_code == 200:
            approval_result = approval_response.json()
            print("✅ Client approved and address sent!")
            print(f"Client notified: {approval_result.get('client_notified')}")
            print()
            print("📱 CHECK YOUR PHONE AGAIN!")
            print("You should receive another SMS with the home address and appointment details.")
        else:
            print(f"❌ Failed to approve client: {approval_response.text}")
            
    except Exception as e:
        print(f"❌ Error approving client: {e}")
    
    print()
    
    # Step 4: Test rejection flow
    print("4️⃣ TESTING REJECTION FLOW...")
    print("Creating another booking to test rejection...")
    
    # Create another test booking
    test_client_data_2 = {
        **test_client_data,
        'client_name': 'Jane Doe',
        'client_email': 'jane.test@example.com',
        'appointment_time': '4:00 PM'
    }
    
    try:
        booking_response_2 = requests.post(f"{BASE_URL}/api/book", json=test_client_data_2)
        
        if booking_response_2.status_code == 200:
            booking_result_2 = booking_response_2.json()
            booking_id_2 = booking_result_2.get('booking_id')
            
            # Test rejection
            rejection_response = requests.post(f"{BASE_URL}/api/admin/reject-client", json={
                'booking_id': booking_id_2,
                'reason': 'incomplete verification documents'
            })
            
            if rejection_response.status_code == 200:
                rejection_result = rejection_response.json()
                print("✅ Client rejection sent!")
                print(f"Client notified: {rejection_result.get('client_notified')}")
                print(f"Refund required: {rejection_result.get('refund_required')}")
                print()
                print("📱 CHECK YOUR PHONE ONE MORE TIME!")
                print("You should receive an SMS about the rejection with studio option.")
            else:
                print(f"❌ Failed to reject client: {rejection_response.text}")
                
    except Exception as e:
        print(f"❌ Error testing rejection: {e}")
    
    print()
    print("=" * 60)
    print("✅ VERIFICATION SYSTEM TEST COMPLETED!")
    print()
    print("📋 SUMMARY OF SMS MESSAGES YOU SHOULD HAVE RECEIVED:")
    print("1. Admin notification with client verification details")
    print("2. Client approval with home address and instructions")
    print("3. Client rejection with studio option and refund info")
    print()
    print("🔒 SECURITY FEATURES DEMONSTRATED:")
    print("• Government ID verification required")
    print("• Emergency contact collection")
    print("• Social media profile verification")
    print("• Deposit requirement ($25)")
    print("• Admin approval before address sharing")
    print("• Automatic rejection handling with refunds")
    print()
    print("💡 NEXT STEPS:")
    print("• Update YOUR_PHONE variable with your real number")
    print("• Set up Twilio credentials in .env file")
    print("• Test with real SMS integration")
    print("• Deploy to production with secure address storage")

def test_simple_verification():
    """Simple test that just sends verification SMS"""
    print("📱 SIMPLE VERIFICATION TEST")
    print("=" * 40)
    
    try:
        response = requests.post(f"{BASE_URL}/api/test-verification")
        
        if response.status_code == 200:
            result = response.json()
            print("✅ Test verification request sent!")
            print(f"Result: {result.get('message')}")
            print(f"Note: {result.get('note')}")
            print()
            print("📱 Check your phone for the admin notification SMS!")
        else:
            print(f"❌ Failed to send test: {response.text}")
            
    except requests.exceptions.ConnectionError:
        print("❌ Could not connect to server. Make sure Flask app is running on localhost:5000")
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🚀 LASHBEAUTYBYKIM VERIFICATION SYSTEM TEST")
    print()
    print("Choose test type:")
    print("1. Full verification flow test")
    print("2. Simple SMS test")
    
    choice = input("\nEnter choice (1 or 2): ").strip()
    
    if choice == "1":
        test_verification_flow()
    elif choice == "2":
        test_simple_verification()
    else:
        print("Invalid choice. Running simple test...")
        test_simple_verification()