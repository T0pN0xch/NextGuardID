# ✅ Interactive Onboarding - Verification Checklist

Use this checklist to verify the interactive onboarding system is working correctly.

---

## 🧪 Pre-Test Setup

- [ ] Browser opened in **Incognito/Private mode**
  - OR localStorage cleared
  - OR testing in fresh window
- [ ] App running at `http://localhost:8080`
- [ ] No console errors visible
- [ ] Ready to test

---

## 🎯 Test Sequence

### Test 1: Guide Appears on Login ✅
- [ ] Log in with any MyKad number
- [ ] **Expected**: Floating guide card appears (bottom-right)
- [ ] **Expected**: Card shows "Welcome to NextGuard ID"
- [ ] **Expected**: Progress shows "1 of 6"
- [ ] **Status**: ⭕ PASS / ❌ FAIL

### Test 2: Welcome Screen Content ✅
- [ ] Card shows:
  - [ ] Title: "👋 Welcome to NextGuard ID"
  - [ ] Description about the platform
  - [ ] 4-5 bullet points with features
  - [ ] Progress dots (1 filled, 5 empty)
  - [ ] Step counter: "Step 1 of 6"
- [ ] **Status**: ⭕ PASS / ❌ FAIL

### Test 3: Navigation Buttons ✅
- [ ] **Previous button** is DISABLED (grayed out)
- [ ] **Next button** is ENABLED and clickable
- [ ] Close button (X) is in top-right
- [ ] **Status**: ⭕ PASS / ❌ FAIL

### Test 4: Click Next → Dashboard Step ✅
- [ ] Click **Next** button
- [ ] **Expected**: Card updates to "📊 Dashboard Overview"
- [ ] **Expected**: Progress shows "2 of 6"
- [ ] **Expected**: Card shows "Go to Page →" button
- [ ] **Expected**: Sidebar highlights Dashboard item with blue ring
- [ ] **Expected**: Pulse indicator dot (●) visible on Dashboard
- [ ] **Status**: ⭕ PASS / ❌ FAIL

### Test 5: Dashboard Step Content ✅
- [ ] Card displays:
  - [ ] Title: "📊 Dashboard Overview"
  - [ ] Description about viewing usage stats
  - [ ] 4 bullet points about dashboard features
  - [ ] Status message: "👉 Navigate to this page"
  - [ ] Amber/yellow background on message
- [ ] **Status**: ⭕ PASS / ❌ FAIL

### Test 6: Navigate to Dashboard ✅
- [ ] Click "Go to Page" button in guide card
- [ ] **Expected**: Navigate to `/dashboard` automatically
- [ ] Wait for page to load
- [ ] **Expected**: Guide card updates with status
- [ ] **Expected**: Shows "✓ You're here!" (green message)
- [ ] **Expected**: "Next" button is now enabled
- [ ] **Expected**: Previous button is enabled
- [ ] **Status**: ⭕ PASS / ❌ FAIL

### Test 7: Progress Updates ✅
- [ ] Progress dots show: ●●○○○○
- [ ] Step counter shows: "Step 2 of 6"
- [ ] Previous step dot is green (visited)
- [ ] Current step dot is blue
- [ ] **Status**: ⭕ PASS / ❌ FAIL

### Test 8: Click Next → Audit Log ✅
- [ ] Click **Next** button
- [ ] **Expected**: Card updates to "🔐 Audit Log & History"
- [ ] **Expected**: Progress shows "3 of 6"
- [ ] **Expected**: Sidebar highlights "Audit Log" with blue ring
- [ ] **Expected**: Pulse dot (●) on Audit Log
- [ ] **Status**: ⭕ PASS / ❌ FAIL

### Test 9: Navigate to Audit Log ✅
- [ ] Click "Go to Page" button
- [ ] **Expected**: Navigate to `/audit-log`
- [ ] **Expected**: Guide shows "✓ You're here!"
- [ ] **Expected**: "Next" button enables
- [ ] **Status**: ⭕ PASS / ❌ FAIL

### Test 10: Suspicious Activity Page ✅
- [ ] Click **Next**
- [ ] **Expected**: Card shows "✋ Suspicious Activity"
- [ ] **Expected**: Progress shows "4 of 6"
- [ ] Click "Go to Page"
- [ ] **Expected**: Navigate to `/suspicious`
- [ ] **Expected**: Shows "✓ You're here!"
- [ ] **Status**: ⭕ PASS / ❌ FAIL

### Test 11: Consent Page ✅
- [ ] Click **Next**
- [ ] **Expected**: Card shows "🤝 Consent Management"
- [ ] **Expected**: Progress shows "5 of 6"
- [ ] Click "Go to Page"
- [ ] **Expected**: Navigate to `/consent`
- [ ] **Expected**: Shows "✓ You're here!"
- [ ] **Status**: ⭕ PASS / ❌ FAIL

### Test 12: Settings Page (Final) ✅
- [ ] Click **Next**
- [ ] **Expected**: Card shows "⚙️ Settings & Security"
- [ ] **Expected**: Progress shows "6 of 6"
- [ ] **Expected**: All progress dots are filled: ●●●●●●
- [ ] **Expected**: Button text is "✓ Complete" (not "Next")
- [ ] **Expected**: Button has green gradient
- [ ] Click "Go to Page"
- [ ] **Expected**: Navigate to `/settings`
- [ ] **Expected**: Shows "✓ You're here!"
- [ ] **Status**: ⭕ PASS / ❌ FAIL

### Test 13: Complete Tutorial ✅
- [ ] Click **Complete** button
- [ ] **Expected**: Guide card disappears
- [ ] **Expected**: Can still use Settings page normally
- [ ] **Expected**: No guide card visible
- [ ] Check DevTools Console
- [ ] **Expected**: No errors
- [ ] **Status**: ⭕ PASS / ❌ FAIL

### Test 14: Verify localStorage Updated ✅
- [ ] Open DevTools (F12)
- [ ] Go to **Application → LocalStorage**
- [ ] **Expected**: See `onboarding_completed = true`
- [ ] **Expected**: `onboarding_step` is not present (or 5)
- [ ] **Status**: ⭕ PASS / ❌ FAIL

---

## 🔄 Test 15: Resume Tutorial ✅

### From Settings Button
- [ ] Go to **Settings** page
- [ ] Look for "Help & Tutorial" section
- [ ] Click **"Resume Tutorial"** button
- [ ] **Expected**: Guide card reappears at last step
- [ ] **Expected**: Shows Settings step (6 of 6)
- [ ] Click **Complete** again
- [ ] **Expected**: Guide disappears
- [ ] **Status**: ⭕ PASS / ❌ FAIL

### From Header Help Button
- [ ] Click **(?)** help button in header toolbar
- [ ] **Expected**: Guide card reappears
- [ ] **Expected**: Shows at Step 1 (Welcome)
- [ ] Click **Close** (X button)
- [ ] **Expected**: Guide disappears
- [ ] **Status**: ⭕ PASS / ❌ FAIL

### From User Menu
- [ ] Click user avatar in header
- [ ] **Expected**: Dropdown menu appears
- [ ] **Expected**: See "Interactive Tutorial" option
- [ ] Click **"Interactive Tutorial"**
- [ ] **Expected**: Guide card appears at Step 1
- [ ] **Status**: ⭕ PASS / ❌ FAIL

---

## 📱 Test 16: Mobile Responsiveness ✅

- [ ] Shrink browser window to mobile size (320px width)
- [ ] **Expected**: Guide card still visible and readable
- [ ] **Expected**: Text doesn't overflow
- [ ] **Expected**: Buttons are clickable
- [ ] **Expected**: Sidebar collapses if needed
- [ ] Expand back to desktop (1920px)
- [ ] **Expected**: Full layout works
- [ ] **Status**: ⭕ PASS / ❌ FAIL

---

## 🌐 Test 17: Browser Compatibility ✅

Test in different browsers:

### Chrome/Chromium
- [ ] Guide appears
- [ ] Navigation works
- [ ] No console errors
- [ ] Status: ⭕ PASS / ❌ FAIL

### Firefox
- [ ] Guide appears
- [ ] Navigation works
- [ ] No console errors
- [ ] Status: ⭕ PASS / ❌ FAIL

### Safari
- [ ] Guide appears
- [ ] Navigation works
- [ ] No console errors
- [ ] Status: ⭕ PASS / ❌ FAIL

### Edge
- [ ] Guide appears
- [ ] Navigation works
- [ ] No console errors
- [ ] Status: ⭕ PASS / ❌ FAIL

---

## 🎨 Test 18: Visual Elements ✅

### Sidebar Highlighting
- [ ] While on Audit Log step:
  - [ ] Audit Log nav item has **blue ring** around it
  - [ ] Ring has **glow/shadow effect**
  - [ ] Has **animated pulse dot** (●)
- [ ] When on next step:
  - [ ] Previous page returns to normal
  - [ ] New page gets highlighted
- [ ] **Status**: ⭕ PASS / ❌ FAIL

### Guide Card Appearance
- [ ] Card has **gradient header** (blue to cyan)
- [ ] Card has **white background**
- [ ] Card has **rounded corners**
- [ ] Card has **shadow/depth effect**
- [ ] Close button (X) is in top-right
- [ ] **Status**: ⭕ PASS / ❌ FAIL

### Status Messages
- [ ] Amber message shown: "👉 Navigate to this page"
- [ ] Green message shown: "✓ You're here!"
- [ ] Messages have appropriate background colors
- [ ] **Status**: ⭕ PASS / ❌ FAIL

### Progress Indicators
- [ ] Dots update as you progress
- [ ] Current dot is blue
- [ ] Completed dots are green
- [ ] Upcoming dots are gray
- [ ] **Status**: ⭕ PASS / ❌ FAIL

---

## ⚙️ Test 19: Edge Cases ✅

### Manual Route Change
- [ ] On Dashboard step
- [ ] Manually navigate to Consent (skip page)
- [ ] **Expected**: Guide doesn't advance
- [ ] **Expected**: Shows "Navigate to this page" message
- [ ] Navigate back to Audit Log (correct page)
- [ ] **Expected**: Shows "You're here!"
- [ ] **Status**: ⭕ PASS / ❌ FAIL

### Previous Button
- [ ] On Step 3
- [ ] Click **Previous**
- [ ] **Expected**: Goes back to Step 2
- [ ] Click **Previous** again
- [ ] **Expected**: Goes back to Step 1
- [ ] Click **Previous** again
- [ ] **Expected**: Button stays disabled
- [ ] **Status**: ⭕ PASS / ❌ FAIL

### Close Button
- [ ] Click **(X)** close button
- [ ] **Expected**: Guide disappears
- [ ] **Expected**: localStorage marked complete
- [ ] Refresh page
- [ ] **Expected**: Guide doesn't reappear
- [ ] **Status**: ⭕ PASS / ❌ FAIL

---

## 🐛 Test 20: Error Handling ✅

- [ ] Open **DevTools Console** (F12)
- [ ] Go through entire onboarding
- [ ] **Expected**: No red errors
- [ ] **Expected**: No warnings about undefined
- [ ] **Expected**: No React errors
- [ ] **Status**: ⭕ PASS / ❌ FAIL

---

## 📊 Final Score

Count your PASS results:

```
Total Tests: 20
Passed:      _____ / 20
Failed:      _____ / 20
Success Rate: _____ %

✅ 95-100%: EXCELLENT - Ready for production
✅ 85-94%:  GOOD - Minor issues only
⚠️  70-84%:  OK - Fix issues before deploy
❌ <70%:    POOR - Needs significant work
```

---

## ✅ Completion Criteria

All of the following must be TRUE:

- [ ] Guide appears on first login
- [ ] All 6 steps show correct content
- [ ] Navigation works for all steps
- [ ] Sidebar highlights correctly
- [ ] Status messages display properly
- [ ] Progress tracking works
- [ ] localStorage updates correctly
- [ ] Can resume from Settings
- [ ] Can resume from Header
- [ ] Mobile layout works
- [ ] No console errors
- [ ] At least 95% tests pass

**If all above are checked**: ✅ **READY FOR PRODUCTION**

---

## 🎯 Test Results Summary

**Date**: ________________  
**Tester**: ________________  
**Environment**: ________________  
**Browser**: ________________  
**Device**: ________________  

**Overall Status**: 
- [ ] ✅ PASS - All tests passed
- [ ] ⚠️  CONDITIONAL - Minor issues only
- [ ] ❌ FAIL - Significant issues found

**Issues Found** (if any):
```
1. _________________________________
2. _________________________________
3. _________________________________
```

**Recommendations**:
```
_________________________________
_________________________________
_________________________________
```

---

## 📝 Sign-Off

I have completed testing and verified:
- Testing checklist: ✅ / ❌
- All critical tests: ✅ / ❌
- System is ready: ✅ / ❌

**Signed**: ________________  
**Date**: ________________  

---

**Use this checklist to ensure everything is working perfectly before deployment!**
