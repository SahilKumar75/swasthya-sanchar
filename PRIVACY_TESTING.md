# Privacy Controls Testing Guide

This document explains how to test the privacy controls for the Emergency QR/Link feature.

## 🎯 Overview

The privacy system allows patients to control what information is visible on their emergency QR code page while ensuring critical medical information is always shown for safety.

## 📋 Privacy Settings Rules

### Always Public (Cannot be Hidden)
These fields are **always visible** for emergency responder safety:
- ✅ Name
- ✅ Date of Birth / Age
- ✅ Blood Group
- ✅ Emergency Contact
- ✅ Allergies
- ✅ Chronic Conditions
- ✅ Current Medications

### User Controllable (Optional Fields)
Patients can toggle visibility for these fields:
- ⚧️ Gender
- 📞 Phone
- ✉️ Email
- 📍 Address
- 📏 Height
- ⚖️ Weight
- 📐 Waist Circumference
- 🏥 Previous Surgeries

## 🧪 Testing Steps

### Step 1: Set Up Test Patient

1. **Login to Patient Portal**
   - Navigate to: `http://localhost:3000/patient`
   - Login with your patient credentials
   - Connect your MetaMask wallet

2. **Complete Registration** (if new user)
   - Fill in all personal information
   - Add medical details (allergies, conditions, medications)
   - Add physical measurements (height, weight, waist)
   - Complete all 5 steps

### Step 2: Configure Privacy Settings

1. **Enter Edit Mode**
   - In your patient dashboard, click **"Edit Profile"** button
   
2. **Scroll to Privacy Settings Section**
   - Purple card with Shield icon
   - Located below Physical Measurements section
   - Only visible in edit mode

3. **Review Default Settings**
   - Critical medical info: **Locked (always public)**
   - Personal info fields: **Toggle switches available**

4. **Test Different Privacy Scenarios**

#### Scenario A: Minimal Visibility (Privacy Focused)
Turn **OFF** all controllable fields:
- ❌ Gender
- ❌ Phone
- ❌ Email
- ❌ Address
- ❌ Physical Measurements (Height, Weight, Waist)
- ❌ Previous Surgeries

Expected Result: Only name, age, blood group, emergency contact, allergies, conditions, and medications visible.

#### Scenario B: Emergency Essentials
Turn **ON** only:
- ✅ Gender
- ✅ Phone

Expected Result: Name, age, blood group, emergency contact, gender, phone + critical medical info visible.

#### Scenario C: Full Disclosure
Turn **ON** all controllable fields:
- ✅ All fields enabled

Expected Result: Complete profile visible.

5. **Save Changes**
   - Click **"Save Changes"** button
   - Wait for blockchain transaction to confirm
   - You'll see a success message

### Step 3: Test Emergency Page

1. **Get Emergency URL**
   - In patient dashboard (after saving), find the QR code section
   - Click **"View Full Emergency Page"** or
   - Copy the QR code URL (format: `/emergency/[your-wallet-address]`)

2. **Open in New Tab/Incognito**
   - Open the emergency URL in a new browser tab
   - Or use incognito mode to simulate first responder access
   - **No wallet connection or login required!**

3. **Verify Visibility**

   Check what's displayed:
   
   **Always Visible:**
   - ✅ Name
   - ✅ Date of Birth / Age
   - ✅ Blood Group (red card, large text)
   - ✅ Emergency Contact (blue card with phone link)
   - ✅ Allergies (yellow warning cards)
   - ✅ Chronic Conditions (bulleted list)
   - ✅ Current Medications (bulleted list)
   
   **Conditionally Visible** (based on your privacy settings):
   - Gender
   - Phone number
   - Email address
   - Physical address
   - Physical measurements (height, weight, waist)
   - Previous surgeries
   
   **Privacy Notice:**
   - ✅ Purple shield icon at bottom
   - ✅ Message: "Patient controls visibility. Critical medical info always shown for safety."

### Step 4: Test Privacy Toggle Changes

1. **Return to Dashboard**
   - Go back to patient portal
   - Click **"Edit Profile"** again

2. **Change Privacy Settings**
   - Toggle some switches (turn ON/OFF)
   - Example: Turn ON "Emergency Contact" if it was OFF

3. **Save and Refresh**
   - Save changes (wait for confirmation)
   - Go back to emergency page
   - **Hard refresh** the page (Ctrl+Shift+R or Cmd+Shift+R)

4. **Verify Changes Applied**
   - Check if newly enabled fields now appear
   - Check if newly disabled fields are now hidden

## ✅ Expected Behavior Checklist

### Dashboard (Edit Mode)
- [ ] Privacy Settings section visible in edit mode
- [ ] Toggle switches work (click to enable/disable)
- [ ] Visual indicators show status (green = public, gray = private)
- [ ] "Always Public" section shows 7 locked fields (Name, DOB, Blood Group, Emergency Contact, Allergies, Conditions, Medications)
- [ ] "You Control" section shows 8 optional fields with toggles
- [ ] Changes persist after saving

### Emergency Page
- [ ] Name always displayed
- [ ] Date of Birth always displayed
- [ ] Blood group always displayed (red card)
- [ ] Emergency contact always displayed (blue card with phone link)
- [ ] Allergies always displayed (yellow cards)
- [ ] Conditions always displayed
- [ ] Medications always displayed
- [ ] Gender only shown if enabled
- [ ] Phone only shown if enabled
- [ ] Email only shown if enabled
- [ ] Address only shown if enabled
- [ ] Physical measurements only shown if enabled
- [ ] Previous surgeries only shown if enabled
- [ ] No error messages
- [ ] Print button works

### Privacy Notice
- [ ] Shield icon displayed
- [ ] "Privacy Notice" heading shown
- [ ] Explanatory text present

## 🐛 Common Issues & Solutions

### Issue: Privacy settings not saving
**Solution:** 
- Check MetaMask is connected
- Confirm transaction in MetaMask
- Wait for blockchain confirmation (3-5 seconds)
- Check browser console for errors

### Issue: Changes not appearing on emergency page
**Solution:**
- Hard refresh the emergency page (Ctrl+Shift+R)
- Clear browser cache
- Try incognito/private browsing mode
- Verify transaction completed on blockchain

### Issue: All fields showing even when disabled
**Solution:**
- Check that privacy settings were saved to blockchain
- Verify the emergency page is reading from the same wallet address
- Check browser console for JavaScript errors

### Issue: Emergency page shows "Patient not found"
**Solution:**
- Verify you're using the correct wallet address in URL
- Ensure patient is registered on blockchain
- Connect MetaMask on the emergency page to load data

## 🔍 Testing Checklist

### Basic Functionality
- [ ] Privacy Settings section loads in edit mode
- [ ] Toggle switches are clickable
- [ ] Visual feedback on toggle (green/gray)
- [ ] Save button updates blockchain
- [ ] Emergency page loads without wallet connection

### Privacy Controls
- [ ] Disabled fields NOT visible on emergency page
- [ ] Enabled fields ARE visible on emergency page
- [ ] Critical medical fields ALWAYS visible
- [ ] Toggle changes reflect immediately after save + refresh

### User Experience
- [ ] Clear labeling of always-public fields
- [ ] Easy-to-understand toggle switches
- [ ] Privacy notice visible and clear
- [ ] No broken layouts or overlapping elements
- [ ] Mobile responsive (test on phone)

## 📊 Test Results Template

Copy this template to document your testing:

```
Date: _________
Tester: _________
Browser: _________

Scenario Tested: _________
Privacy Settings Applied:
- Gender: ON/OFF
- Phone: ON/OFF
- Email: ON/OFF
- Address: ON/OFF
- Physical Measurements: ON/OFF
- Previous Surgeries: ON/OFF

Emergency Page Results:
✅/❌ Name always visible
✅/❌ DOB always visible
✅/❌ Blood group always visible
✅/❌ Emergency contact always visible
✅/❌ Optional fields visibility matches settings
✅/❌ Critical medical always visible
✅/❌ Privacy notice displayed
✅/❌ No errors in console

Notes:
_________________________________________
```

## 🎓 Key Testing Principles

1. **Always Test Both States**
   - Test with field enabled
   - Test with field disabled
   - Verify the change

2. **Test Edge Cases**
   - All fields disabled (except critical)
   - All fields enabled
   - Mix of enabled/disabled

3. **Test User Flow**
   - Complete journey: Edit → Save → View Emergency Page
   - Verify at each step

4. **Test Different Browsers**
   - Chrome/Edge
   - Firefox
   - Safari
   - Mobile browsers

## 🚀 Quick Test Script

For rapid testing, follow this 5-minute flow:

1. **Login & Edit** (1 min)
   - Login → Edit Profile → Find Privacy Settings

2. **Set Minimal** (1 min)
   - Turn OFF all optional fields (gender, phone, email, address, measurements, surgeries)
   - Save → Wait for confirmation

3. **Check Emergency** (1 min)
   - Open emergency page
   - Verify name, DOB, blood group, emergency contact, and critical medical info visible
   - Verify optional fields hidden

4. **Set Full** (1 min)
   - Edit Profile again
   - Turn ON all optional fields
   - Save

5. **Recheck Emergency** (1 min)
   - Refresh emergency page
   - Verify all optional fields now visible

**Expected: 5 minutes to verify privacy system works!**

---

## 📞 Support

If you encounter issues during testing:
1. Check browser console for errors
2. Verify MetaMask is connected
3. Confirm blockchain transaction completed
4. Review this testing guide
5. Document the issue with screenshots

Happy Testing! 🧪✨
