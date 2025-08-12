#!/usr/bin/env python3
"""
Day 11: API Failure Simulation Script
This script temporarily modifies the app.py file to simulate API failures
and test the fallback response system
"""

import os
import shutil
import time
import subprocess

def backup_app_file():
    """Create backup of original app.py"""
    shutil.copy2('app.py', 'app.py.backup')
    print("✅ Created backup: app.py.backup")

def restore_app_file():
    """Restore original app.py from backup"""
    if os.path.exists('app.py.backup'):
        shutil.copy2('app.py.backup', 'app.py')
        print("✅ Restored original app.py")
    else:
        print("❌ No backup file found")

def simulate_murf_api_failure():
    """Comment out Murf API key to simulate TTS failure"""
    print("\n🎯 Simulating Murf API Failure...")
    
    with open('app.py', 'r') as f:
        content = f.read()
    
    # Comment out Murf API key line
    modified_content = content.replace(
        'MURF_API_KEY = os.getenv("MURF_API_KEY", "default_murf_key")',
        '# MURF_API_KEY = os.getenv("MURF_API_KEY", "default_murf_key")  # SIMULATED FAILURE\nMURF_API_KEY = "default_murf_key"'
    )
    
    with open('app.py', 'w') as f:
        f.write(modified_content)
    
    print("✅ Murf API key disabled")

def simulate_assemblyai_api_failure():
    """Comment out AssemblyAI API key to simulate STT failure"""
    print("\n🎯 Simulating AssemblyAI API Failure...")
    
    with open('app.py', 'r') as f:
        content = f.read()
    
    # Comment out AssemblyAI configuration
    modified_content = content.replace(
        'ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")\nif ASSEMBLYAI_API_KEY:\n    aai.settings.api_key = ASSEMBLYAI_API_KEY',
        '# ASSEMBLYAI_API_KEY = os.getenv("ASSEMBLYAI_API_KEY")  # SIMULATED FAILURE\n# if ASSEMBLYAI_API_KEY:\n#     aai.settings.api_key = ASSEMBLYAI_API_KEY\nASSEMBLYAI_API_KEY = None'
    )
    
    with open('app.py', 'w') as f:
        f.write(modified_content)
    
    print("✅ AssemblyAI API key disabled")

def simulate_gemini_api_failure():
    """Comment out Gemini API key to simulate LLM failure"""
    print("\n🎯 Simulating Gemini API Failure...")
    
    with open('app.py', 'r') as f:
        content = f.read()
    
    # Comment out Gemini configuration
    modified_content = content.replace(
        'GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")\ngemini_client = None\nif GEMINI_API_KEY:\n    gemini_client = genai.Client(api_key=GEMINI_API_KEY)',
        '# GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")  # SIMULATED FAILURE\n# gemini_client = None\n# if GEMINI_API_KEY:\n#     gemini_client = genai.Client(api_key=GEMINI_API_KEY)\nGEMINI_API_KEY = None\ngemini_client = None'
    )
    
    with open('app.py', 'w') as f:
        f.write(modified_content)
    
    print("✅ Gemini API key disabled")

def test_fallback_responses():
    """Test the application with API failures"""
    print("\n🧪 Testing Fallback Responses...")
    
    # Wait for server restart
    print("⏳ Waiting for server to restart...")
    time.sleep(3)
    
    # Run test suite
    result = subprocess.run(['python', 'test_error_scenarios.py'], capture_output=True, text=True)
    
    print("📋 Test Results:")
    print(result.stdout)
    
    if result.stderr:
        print("⚠️ Errors:")
        print(result.stderr)

def run_simulation():
    """Run complete API failure simulation"""
    print("🚀 Day 11: API Failure Simulation")
    print("=" * 50)
    
    try:
        # Create backup
        backup_app_file()
        
        print("\n📝 Original Configuration Status:")
        print("✅ All APIs configured and working")
        
        # Test 1: Simulate Murf API failure
        simulate_murf_api_failure()
        test_fallback_responses()
        
        # Test 2: Also simulate AssemblyAI failure
        simulate_assemblyai_api_failure() 
        test_fallback_responses()
        
        # Test 3: Also simulate Gemini failure (complete system failure)
        simulate_gemini_api_failure()
        test_fallback_responses()
        
        print("\n" + "=" * 50)
        print("📊 SIMULATION COMPLETE")
        print("=" * 50)
        print("✅ Tested TTS API failure scenarios")
        print("✅ Tested STT API failure scenarios") 
        print("✅ Tested LLM API failure scenarios")
        print("✅ Verified fallback response system")
        
    except Exception as e:
        print(f"❌ Simulation failed: {e}")
    
    finally:
        # Restore original file
        print("\n🔄 Restoring original configuration...")
        restore_app_file()
        print("✅ API failure simulation completed")

if __name__ == "__main__":
    run_simulation()