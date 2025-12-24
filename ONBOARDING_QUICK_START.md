# 🚀 Interactive Onboarding - Quick Start

## How to Test

### Option 1: Fresh Browser (Recommended)
1. Open browser in **Incognito/Private mode**
2. Navigate to `http://localhost:8080`
3. Log in with any MyKad number
4. **Floating guide card appears** with Welcome step!

### Option 2: Clear localStorage
1. Open DevTools (F12)
2. Go to **Console**
3. Paste: `localStorage.clear()`
4. Refresh page
5. Log in
6. **Guide card appears**

### Option 3: Reset in Code
Delete these from localStorage in user's browser:
```javascript
localStorage.removeItem('onboarding_completed');
localStorage.removeItem('onboarding_step');
```

---

## What You'll See

### Step 1: Welcome
```
┌─────────────────────────────────┐
│ 👋 Welcome to NextGuard ID      │
│ Let's get you started!          │
└─────────────────────────────────┘
Details:
✓ Secure MyKad management
✓ Blockchain-verified audit trails
✓ Complete consent control
✓ Real-time security monitoring

Progress: 1/6
[← Previous] [Next →]
```

### Step 2: Dashboard
```
┌─────────────────────────────────┐
│ 📊 Dashboard Overview           │
│ Monitor your identity usage     │
└─────────────────────────────────┘
Details:
• View total MyKad usage
• See recent usage
• Track online vs offline
• Get insights

Status: 👉 Navigate to this page

Progress: 2/6
[← Previous] [Go to Page →]
```

**Sidebar shows**: Dashboard nav item highlighted with blue ring ●

### Step 3 onwards
Same pattern - navigate to each page:
- `/dashboard` → `/audit-log` → `/suspicious` → `/consent` → `/settings`

### Final Step: Settings
```
⚙️ Settings & Security

[← Previous] [✓ Complete]
```

After clicking Complete:
- Guide disappears
- localStorage updated
- `onboarding_completed = true`

---

## Resume Tutorial

### From Settings
1. Go to Settings page
2. Look for **"Help & Tutorial"** section
3. Click **"Resume Tutorial"** button
4. Guide reappears from where you left off

### From Header
1. Click **(?)** help button in top toolbar
2. Guide appears

### From User Menu
1. Click your avatar in header
2. Select **"Interactive Tutorial"**
3. Guide appears

---

## What Happens at Each Step

| Step | Route | What to Do |
|------|-------|-----------|
| 1 | / (any) | Click Next |
| 2 | - | Click "Go to Page" |
| 3 | /dashboard | Navigate ✓ |
| 4 | /dashboard | Click Next |
| 5 | - | Click "Go to Page" |
| 6 | /audit-log | Navigate ✓ |
| (repeat for steps 4, 5, 6...) | | |

---

## Features to Notice

✨ **Smart Navigation**
- "Go to Page" button appears when navigation needed
- "Next" button appears when on correct page
- Can't skip, must visit each page

✨ **Visual Feedback**
- Sidebar nav item highlights with blue ring
- Pulse dot indicator (●)
- Status messages (Amber = navigate, Green = you're here)

✨ **Progress Tracking**
- Progress dots: ●●●○○○
- Step counter: "3 of 6"
- Can go back with Previous button

✨ **Always Accessible**
- Won't disappear until you complete or close
- Can close anytime with (X) button
- Can resume anytime from Settings or Help

---

## Keyboard Shortcuts

While guide is visible:
- **Esc**: *Close guide* (mark as complete)
- **←/→**: Previous/Next navigation (use buttons instead)

---

## For Developers

### To Modify Content
Edit `src/components/onboarding/InteractiveGuide.tsx`:
```tsx
const tutorialSteps = [
  {
    id: 'welcome',
    title: '👋 Welcome to NextGuard ID',
    description: 'Your description...',
    targetRoute: '/',
    details: ['Detail 1', 'Detail 2'],
  },
  // Add more steps...
];
```

### To Add a Page
1. Add to `tutorialSteps` array
2. Update `totalSteps` in context
3. Add route mapping in `Sidebar.tsx` `stepRoutes`

### To Disable for Everyone
```javascript
localStorage.setItem('onboarding_completed', 'true');
```

### To Reset for Everyone
```javascript
localStorage.removeItem('onboarding_completed');
localStorage.removeItem('onboarding_step');
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Guide doesn't appear | Clear localStorage, refresh |
| Button won't enable | Ensure you're on correct page |
| Sidebar doesn't highlight | Check that onboarding is active |
| Can't resume tutorial | Go to Settings → Help & Tutorial |
| Text looks wrong | Check browser zoom level (100%) |

---

## Files to Check

If something doesn't work:
1. **GuideComponent**: `src/components/onboarding/InteractiveGuide.tsx`
2. **Context**: `src/context/OnboardingContext.tsx`
3. **Integration**: `src/pages/Index.tsx`
4. **Sidebar**: `src/components/layout/Sidebar.tsx`
5. **Header**: `src/components/layout/Header.tsx`

---

## Quick Test Checklist

- [ ] Guide appears on fresh login
- [ ] Can click Next/Previous
- [ ] Sidebar highlights correct page
- [ ] "Go to Page" button navigates correctly
- [ ] "You're here!" message shows
- [ ] Progress updates correctly
- [ ] Complete button works
- [ ] Can resume from Settings
- [ ] Help button works
- [ ] User menu option works
- [ ] Mobile layout adapts
- [ ] All 6 steps work

---

## Performance Notes

✅ **No impact on app performance**
- Guide is lightweight floating component
- Uses React Context (built-in)
- localStorage is client-side only
- No API calls made
- No bundle size increase

---

## Expected Behavior

### First Visit
- Guide appears → Step 1/6 with Welcome
- User can navigate through all 6 steps
- Each step requires visiting that page
- Takes ~2-3 minutes to complete

### Returning Visit
- Guide doesn't appear (already completed)
- Can restart anytime from Settings or Help button
- Progress is remembered, can resume

### Benefits
- Users learn by doing, not just reading
- Fully understand each feature
- See features in actual context
- More engaging than static tutorial
- Higher completion rate

---

## Notes

- Guide is **non-intrusive** - doesn't block content
- Can use app normally while guide is showing
- **Mobile-responsive** - adapts to screen size
- **Keyboard-friendly** - all buttons accessible
- **Accessible** - screen reader compatible labels
- **Fast** - no loading delays

---

## Success Criteria

Tutorial is working correctly if:
1. ✅ Guide appears on first login
2. ✅ Each step shows correct information
3. ✅ Navigation buttons work as expected
4. ✅ Sidebar highlights correct page
5. ✅ Status messages display correctly
6. ✅ Can complete all 6 steps
7. ✅ Guide marks as complete
8. ✅ Can resume anytime
9. ✅ No errors in console
10. ✅ Smooth animations

**If all 10 are true → WORKING PERFECTLY! 🎉**

---

**Ready to test? Log in to NextGuard ID and enjoy the interactive onboarding experience!**
