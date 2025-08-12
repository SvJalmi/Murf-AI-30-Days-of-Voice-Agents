#!/usr/bin/env python3
"""
Day 11: Error Handling Test Scenarios
Test script to simulate API failures and verify fallback responses
"""

import requests
import json
import time
import sys

# Base URL for testing
BASE_URL = "http://localhost:5000"

def test_api_endpoint(endpoint, method='GET', data=None, files=None, description=""):
    """Test an API endpoint and measure response time"""
    print(f"\n🧪 Testing: {description}")
    print(f"   Endpoint: {method} {endpoint}")
    
    start_time = time.time()
    
    try:
        if method == 'POST':
            if files:
                response = requests.post(f"{BASE_URL}{endpoint}", files=files, data=data, timeout=30)
            else:
                response = requests.post(f"{BASE_URL}{endpoint}", json=data, timeout=30)
        else:
            response = requests.get(f"{BASE_URL}{endpoint}", timeout=30)
        
        elapsed = time.time() - start_time
        
        # Try to get JSON response
        try:
            json_response = response.json()
            success = json_response.get('success', False)
            error_msg = json_response.get('error', 'No error message')
            is_fallback = json_response.get('is_fallback', False)
        except:
            json_response = None
            success = response.status_code == 200
            error_msg = response.text[:100] if response.text else "No response text"
            is_fallback = False
        
        # Print results
        status_icon = "✅" if success else "❌"
        fallback_icon = "🔄" if is_fallback else ""
        
        print(f"   Result: {status_icon} {response.status_code} {fallback_icon}")
        print(f"   Time: {elapsed:.2f}s")
        
        if not success:
            print(f"   Error: {error_msg}")
        elif is_fallback:
            print(f"   ⚠️  Fallback response activated")
        
        return {
            'success': success,
            'status_code': response.status_code,
            'response_time': elapsed,
            'is_fallback': is_fallback,
            'error': error_msg if not success else None
        }
        
    except requests.exceptions.Timeout:
        elapsed = time.time() - start_time
        print(f"   Result: ⏱️  TIMEOUT after {elapsed:.2f}s")
        return {'success': False, 'error': 'Timeout', 'response_time': elapsed}
    
    except requests.exceptions.ConnectionError:
        elapsed = time.time() - start_time
        print(f"   Result: 🔌 CONNECTION ERROR after {elapsed:.2f}s")
        return {'success': False, 'error': 'Connection Error', 'response_time': elapsed}
    
    except Exception as e:
        elapsed = time.time() - start_time
        print(f"   Result: 💥 EXCEPTION: {str(e)} after {elapsed:.2f}s")
        return {'success': False, 'error': str(e), 'response_time': elapsed}

def run_error_tests():
    """Run comprehensive error handling tests"""
    print("🚀 Day 11: AI Voice Agent Error Handling Test Suite")
    print("=" * 60)
    
    test_results = []
    
    # Test 1: Basic TTS functionality
    result = test_api_endpoint(
        "/generate-audio",
        "POST",
        data={"text": "Testing error handling system"},
        description="Basic Text-to-Speech Generation"
    )
    test_results.append(("TTS Basic", result))
    
    # Test 2: Empty text input
    result = test_api_endpoint(
        "/generate-audio", 
        "POST",
        data={"text": ""},
        description="TTS with empty text (should fail gracefully)"
    )
    test_results.append(("TTS Empty Input", result))
    
    # Test 3: Extremely long text (should be handled)
    long_text = "This is a very long text that exceeds normal limits. " * 100
    result = test_api_endpoint(
        "/generate-audio",
        "POST", 
        data={"text": long_text},
        description="TTS with extremely long text"
    )
    test_results.append(("TTS Long Text", result))
    
    # Test 4: LLM Query with text
    result = test_api_endpoint(
        "/llm/query",
        "POST",
        data={"text": "What is artificial intelligence?"},
        description="LLM Query with text input"
    )
    test_results.append(("LLM Text Query", result))
    
    # Test 5: Chat endpoint (new session)
    session_id = f"test_session_{int(time.time())}"
    result = test_api_endpoint(
        f"/agent/chat/{session_id}",
        "POST", 
        data={"text": "Hello, I'm testing the error handling system"},
        description="Conversation Bot - New Session"
    )
    test_results.append(("Chat New Session", result))
    
    # Test 6: Get chat history
    result = test_api_endpoint(
        f"/agent/chat/{session_id}",
        "GET",
        description="Get Chat History"
    )
    test_results.append(("Chat History", result))
    
    # Test 7: Chat with non-existent session
    result = test_api_endpoint(
        "/agent/chat/nonexistent_session_123",
        "POST",
        data={"text": "This should create a new session"},
        description="Chat with non-existent session"
    )
    test_results.append(("Chat Non-existent Session", result))
    
    # Print summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    total_tests = len(test_results)
    successful_tests = sum(1 for _, result in test_results if result['success'])
    fallback_responses = sum(1 for _, result in test_results if result.get('is_fallback', False))
    
    print(f"Total Tests: {total_tests}")
    print(f"Successful: {successful_tests}/{total_tests} ({successful_tests/total_tests*100:.1f}%)")
    print(f"Fallback Responses: {fallback_responses}")
    
    # Detailed results
    print("\n📋 DETAILED RESULTS:")
    for test_name, result in test_results:
        status = "✅ PASS" if result['success'] else "❌ FAIL"
        fallback = " (FALLBACK)" if result.get('is_fallback') else ""
        time_str = f"{result['response_time']:.2f}s"
        
        print(f"  {status} {test_name:<25} {time_str:>8} {fallback}")
        
        if not result['success'] and result.get('error'):
            print(f"      Error: {result['error']}")
    
    # Performance analysis
    print("\n⏱️  PERFORMANCE ANALYSIS:")
    avg_time = sum(r['response_time'] for _, r in test_results) / len(test_results)
    max_time = max(r['response_time'] for _, r in test_results)
    min_time = min(r['response_time'] for _, r in test_results)
    
    print(f"  Average Response Time: {avg_time:.2f}s")
    print(f"  Fastest Response: {min_time:.2f}s") 
    print(f"  Slowest Response: {max_time:.2f}s")
    
    return test_results

if __name__ == "__main__":
    print("Starting error handling tests...")
    print("Make sure the Flask server is running on localhost:5000")
    print()
    
    try:
        results = run_error_tests()
        print("\n🎉 Error handling test suite completed!")
        
    except KeyboardInterrupt:
        print("\n\n⏹️  Test suite interrupted by user")
        sys.exit(0)
    except Exception as e:
        print(f"\n💥 Test suite failed with error: {e}")
        sys.exit(1)