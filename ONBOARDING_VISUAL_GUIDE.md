# 🎯 Interactive Onboarding - Visual Guide

## Onboarding Journey Map

```
START: New User Login
│
├─ Check localStorage
│  └─ First time? → Show guide
│  └─ Returning? → Hide guide
│
└─ Guide Card Appears (Bottom-Right)
   │
   Step 1: WELCOME
   ├─ Title: 👋 Welcome to NextGuard ID
   ├─ Description: Overview of features
   ├─ Button: [Next →]
   └─ Progress: ●○○○○○ (1/6)
      │
      └─ Click Next
         │
         Step 2: DASHBOARD
         ├─ Title: 📊 Dashboard Overview
         ├─ Description: View usage stats
         ├─ Button: [Go to Page →]
         ├─ Sidebar: HIGHLIGHTS Dashboard
         └─ Progress: ●●○○○○ (2/6)
            │
            └─ User clicks "Go to Page"
               └─ Navigates to /dashboard
                  │
                  └─ Route updates
                     ├─ Context detects match
                     ├─ Guide: ✓ You're here!
                     ├─ Button: [Next →]
                     └─ User clicks Next
                        │
                        Step 3: AUDIT LOG
                        ├─ Title: 🔐 Audit Log & History
                        ├─ Description: Learn search/export
                        ├─ Button: [Go to Page →]
                        ├─ Sidebar: HIGHLIGHTS Audit Log
                        └─ Progress: ●●●○○○ (3/6)
                           │
                           └─ User clicks "Go to Page"
                              └─ Navigates to /audit-log
                                 │
                                 ... (similar for steps 4, 5)
                                 │
                                 Step 6: SETTINGS (FINAL)
                                 ├─ Title: ⚙️ Settings & Security
                                 ├─ Description: Configure preferences
                                 ├─ Button: [✓ Complete]
                                 └─ Progress: ●●●●●● (6/6)
                                    │
                                    └─ User clicks Complete
                                       ├─ localStorage updated
                                       ├─ Guide disappears
                                       └─ Tutorial marked as done
```

## Screen Layout During Onboarding

```
┌──────────────────────────────────────────────────────────────┐
│  NextGuard ID    [?] [🔔] [👤] [Ahmad ▼]                   │ ← Header
├──────────┬────────────────────────────────────────────────────┤
│          │                                                    │
│ [Side]   │                                                    │
│ [bar]    │                     [Main Content Area]           │
│          │                                                    │
│ 📊       │  ┌─────────────────────────┐                     │
│ ✋       │  │                         │  ┌──────────────────┐│
│ 🔐       │  │    Dashboard Page       │  │ GUIDE CARD       ││
│ 🤝       │  │                         │  │ ╔════════════════╗││
│ ⚙️        │  │                         │  │║ 📊 Dashboard   X║││
│          │  │    Stats & Charts       │  │║ ↳ Monitor usage ║││
│          │  │                         │  │╠════════════════╣││
│          │  │                         │  │║ Command center ║││
│          │  │    Recent Activity      │  │║ • View stats   ║││
│          │  │                         │  │║ • See usage    ║││
│          │  │                         │  │║ • Track online ║││
│          │  │                         │  │║ • Get insights ║││
│          │  │                         │  │║                ║││
│          │  │                         │  │║ ✓ You're here! ║││
│          │  │                         │  │║                ║││
│          │  │                         │  │║ ●●●○○○ (3/6)  ║││
│          │  │                         │  │║                ║││
│          │  │                         │  │║ [← Prev][Next]║││
│          │  └─────────────────────────┘  │║ Access Tutorial║││
│          │                                │║  from Settings ║││
│          │                                │╚════════════════╝││
│          │                                └──────────────────┘│
└──────────┴────────────────────────────────────────────────────┘
```

## Sidebar Highlighting

### Normal State
```
┌──────────────┐
│ 📊 Dashboard │  ← Not highlighted
│ ✋ Suspicious│  ← Not highlighted
│ 🔐 Audit Log │  ← Not highlighted
│ 🤝 Consent   │  ← Not highlighted
│ ⚙️ Settings  │  ← Not highlighted
└──────────────┘
```

### During Step 2 (Dashboard)
```
┌────────────────────────┐
│ 📊 Dashboard           │ ← HIGHLIGHTED
│    (with blue ring)    │    (glow effect)
│ ✋ Suspicious          │    (pulse dot ●)
│ 🔐 Audit Log          │
│ 🤝 Consent            │
│ ⚙️ Settings           │
└────────────────────────┘
```

## Button States Throughout Journey

### Step 1 (Welcome) - Any Route OK
```
Previous Button: [DISABLED]
Next Button:     [ENABLED] → Goes to Step 2
```

### Step 2 (Dashboard) - Not Yet Visited
```
Previous Button: [ENABLED]
Go to Page:      [ENABLED] → Navigate to /dashboard
```

### Step 2 (Dashboard) - After Navigation
```
Previous Button: [ENABLED]
Next Button:     [ENABLED] → Goes to Step 3
Status:          ✓ You're on the right page!
```

### Final Step (Settings) - On Correct Page
```
Previous Button: [ENABLED]
Complete:        [ENABLED] → Finish tutorial
Progress:        ●●●●●● (6/6)
```

## Guide Card Message States

### When Navigation Needed
```
┌─────────────────────────────────────┐
│  ⚠️ Amber Background Message         │
│  👉 Navigate to this page to         │
│     continue your tutorial           │
│  [Go to Page →]                      │
└─────────────────────────────────────┘
```

### When On Correct Page
```
┌─────────────────────────────────────┐
│  ✅ Green Background Message         │
│  ✓ Great! You're on the right page.  │
│  [Next →]                            │
└─────────────────────────────────────┘
```

### Welcome Step (No Navigation Needed)
```
┌─────────────────────────────────────┐
│  Just introduction text              │
│  [Next →]                            │
└─────────────────────────────────────┘
```

## Color Coding

### Progress Indicators
- **Blue (Current)**: Current step ●
- **Green (Visited)**: Completed steps ●
- **Gray (Upcoming)**: Future steps ●

### Sidebar Highlight
- **Blue Ring**: ring-blue-400
- **Shadow Glow**: shadow-blue-500/30
- **Pulse Dot**: bg-blue-500 animate-pulse

### Status Messages
- **Amber**: Navigate needed (🟡)
- **Green**: On correct page (🟢)
- **Blue**: Progress & info (🔵)

### Buttons
- **Primary Action**: Blue→Cyan gradient
- **Complete Action**: Green→Emerald gradient
- **Disabled**: Grayed out

## User Journey - Timeline

```
Time  Action                    Guide State              UI Feedback
────────────────────────────────────────────────────────────────────
0:00  User logs in              Welcome step appears     Card: Step 1/6
0:10  Clicks Next               Dashboard step active    Card: Step 2/6
0:15  Clicks "Go to Page"       Navigating...           Navigation
0:20  Route updates to /dash    Page validation         ✓ Status message
0:30  Clicks Next               Audit Log step active   Card: Step 3/6
0:35  Clicks "Go to Page"       Navigating...           Navigation
0:40  Route updates to /audit   Page validation         ✓ Status message
...   (repeat for remaining steps)
5:00  Clicks Complete           Tutorial finished       Card disappears
5:01  localStorage updated      Showing complete        Can resume later
```

## Access Points for Resuming Tutorial

### Method 1: Header Button
```
Header Toolbar
    │
    └─ [?] Help Button
       │
       └─ Click → Guide Card Reappears
```

### Method 2: User Menu
```
Header → [👤 Ahmad ▼]
    │
    ├─ My Profile
    ├─ Interactive Tutorial ← CLICK HERE
    │
    └─ Logout
```

### Method 3: Settings Page
```
Settings Page
    │
    └─ Help & Tutorial Section
       │
       └─ [Start/Resume Tutorial] Button
          │
          └─ Click → Guide Card Reappears
             └─ Resumes from last step
```

## Mobile Responsive Behavior

### On Desktop (>640px)
```
Full Layout:
├─ Header (Full Width)
├─ Sidebar (Left, 256px)
├─ Main Content (Center)
└─ Guide Card (Fixed, Bottom-Right)
```

### On Tablet (≥640px)
```
Sidebar can collapse:
├─ Header (Full Width)
├─ Sidebar (Left, 64px when collapsed)
├─ Main Content (Expanded)
└─ Guide Card (Fixed, Bottom-Right, smaller)
```

### On Mobile (<640px)
```
No sidebar menu labels:
├─ Header (Full Width)
├─ Sidebar (Icons only, 64px)
├─ Main Content (Full)
└─ Guide Card (Fixed, Smaller)
   └─ Adjusted padding/margins
```

## Data Flow

```
User Login
    │
    └─ Index.tsx
       ├─ Check localStorage
       ├─ Initialize OnboardingContext
       │  └─ isFirstTime = true
       │  └─ currentStep = 0
       │  └─ showOnboarding = true
       │
       └─ Render InteractiveGuide
          │
          └─ Display Card for Step 0
             │
             └─ User clicks Next
                │
                └─ nextStep() called
                   ├─ currentStep = 1
                   ├─ Save to localStorage
                   │
                   └─ Re-render Guide
                      └─ Display Card for Step 1
                         │
                         └─ User navigates to page
                            │
                            └─ useLocation triggers
                               ├─ setCurrentRoute(path)
                               ├─ Context validates
                               │
                               └─ isPageReached = true
                                  │
                                  └─ Guide updates
                                     └─ Show "You're here!"
                                     └─ Enable Next button
                                        │
                                        └─ User clicks Next
                                           └─ (Cycle repeats)
```

---

**Legend**:
- `┌──┐` = Container/Box
- `├──` = Branch/Item
- `└──` = Final Branch
- `│` = Vertical Connection
- `→` = Direction/Flow
- `●` = Indicator/Dot
