# NextGuard ID - Visual Design Mockups

## 🎨 Component Layouts & User Experience

---

## Feature 1: Real-Time MyKad Usage Confirmation

### Modal Design

```
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║                  🛡️  MYKAD USAGE REQUEST                                 ║
║                  Your MyKad identity is being requested                   ║
║                                                                            ║
║  ┌────────────────────────────────────────────────────────────────────┐  ║
║  │                                                                    │  ║
║  │  🏥 INSTITUTION                                                   │  ║
║  │     Kuala Lumpur Hospital                                        │  ║
║  │     Hospital • Kuala Lumpur, Malaysia                            │  ║
║  │     ✓ Verified Institution                                       │  ║
║  │                                                                    │  ║
║  │  ─────────────────────────────────────────────────────────────   │  ║
║  │                                                                    │  ║
║  │  [🎯] ACTION TYPE                                                │  ║
║  │      ┌──────────────────────────────┐                            │  ║
║  │      │ Patient Registration          │                            │  ║
║  │      └──────────────────────────────┘                            │  ║
║  │                                                                    │  ║
║  │  ─────────────────────────────────────────────────────────────   │  ║
║  │                                                                    │  ║
║  │  🛡️  PURPOSE OF USE                                              │  ║
║  │      Patient Registration - New Account Creation                 │  ║
║  │                                                                    │  ║
║  │  ─────────────────────────────────────────────────────────────   │  ║
║  │                                                                    │  ║
║  │  ⏰ REQUESTED AT                                                  │  ║
║  │     Dec 11, 2024 • 14:30:00                                     │  ║
║  │                                                                    │  ║
║  │  ─────────────────────────────────────────────────────────────   │  ║
║  │                                                                    │  ║
║  │  📍 LOCATION                                                      │  ║
║  │     Kuala Lumpur, Malaysia                                       │  ║
║  │                                                                    │  ║
║  └────────────────────────────────────────────────────────────────────┘  ║
║                                                                            ║
║  ℹ️  PRIVACY NOTICE                                                       ║
║  Your MyKad identity will be shared. No sensitive medical data is stored  ║
║  on the blockchain, only this access event and consent record.            ║
║                                                                            ║
║  ⏱️  EXPIRES IN: 1:45 ⏳                                                  ║
║                                                                            ║
║  ┌─────────────────────┐         ┌──────────────────────┐                ║
║  │ ❌ Deny Request     │         │ ✅ Approve & Confirm │                ║
║  └─────────────────────┘         └──────────────────────┘                ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
```

### Color Scheme
- **Primary** - Blue (Trust, Security)
- **Accent** - Emerald Green (Approve Action)
- **Danger** - Red (Deny/Block)
- **Background** - Light slate with glass effect

### Key UI Elements
✓ Large shield icon  
✓ Institution name prominent  
✓ Color-coded action badge  
✓ Privacy notice emphasized  
✓ Clear timer countdown  
✓ Two distinct buttons  
✓ Disabled state on processing  
✓ Emergency styling (red) when applicable  

---

## Feature 2: MyKad Audit Trail Page

### Page Layout

```
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║  🔒 MYKAD AUDIT TRAIL                                                    ║
║  Complete blockchain-verified history of your MyKad identity usage       ║
║                                                                            ║
║  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐        ║
║  │ ✅ APPROVED      │  │ ❌ DENIED        │  │ 🚨 EMERGENCY     │        ║
║  │                  │  │                  │  │                  │        ║
║  │       8          │  │       1          │  │       1          │        ║
║  │ Successful       │  │ Blocked requests │  │ Critical usage   │        ║
║  │ accesses         │  │                  │  │                  │        ║
║  └──────────────────┘  └──────────────────┘  └──────────────────┘        ║
║                                                                            ║
║  ┌──────────────────────────────────────────────────────────────────┐    ║
║  │ ℹ️  WHY YOUR AUDIT TRAIL MATTERS                                 │    ║
║  │                                                                  │    ║
║  │  • Fraud Prevention: Detect unauthorized use of MyKad           │    ║
║  │  • Transparency: See exactly when/where identity was used       │    ║
║  │  • Accountability: Providers are accountable for access         │    ║
║  │  • Immutable Records: Cannot be tampered with                   │    ║
║  │  • Privacy Protected: No medical data stored on blockchain      │    ║
║  └──────────────────────────────────────────────────────────────────┘    ║
║                                                                            ║
║  CHRONOLOGICAL EVENT LOG                                                  ║
║  ┌────────────────────────────────────────────────────────────────────┐   ║
║  │ DATE & TIME    │ INSTITUTION        │ ACTION  │ PURPOSE   │ STATUS  │  ║
║  ├────────────────────────────────────────────────────────────────────┤   ║
║  │ Dec 11 14:30   │ Kuala Lumpur       │ [🔵 REG]│ Patient   │ ✅ APP │  ║
║  │                │ Hospital           │         │ Reg       │ [View] │  ║
║  ├────────────────────────────────────────────────────────────────────┤   ║
║  │ Dec 10 09:15   │ Selangor Medical   │ [🟣 REC]│ Medical   │ ✅ APP │  ║
║  │                │ Clinic             │         │ Records   │ [View] │  ║
║  ├────────────────────────────────────────────────────────────────────┤   ║
║  │ Dec 09 16:45   │ Cardiac Specialist │ [🔵 VER]│ Specialist│ ✅ APP │  ║
║  │                │ Centre             │         │ Appt      │ [View] │  ║
║  ├────────────────────────────────────────────────────────────────────┤   ║
║  │ Dec 08 11:20   │ Pharmacy Plus      │ [🟢 CON]│ Medicin   │ ✅ APP │  ║
║  │                │                    │         │ e Purchase│ [View] │  ║
║  ├────────────────────────────────────────────────────────────────────┤   ║
║  │ ... 6 more events ...                                              │   ║
║  └────────────────────────────────────────────────────────────────────┘   ║
║                                                                            ║
║  ┌──────────────────────────────────────┐  ┌─────────────────────────┐   ║
║  │ ✓ HOW BLOCKCHAIN PROTECTS YOU        │  │ ✓ YOUR PRIVACY IS SAFE  │   ║
║  │                                      │  │                         │   ║
║  │ 1️⃣  Immutable Records              │  │ ✓ No Medical Data      │   ║
║  │ Records cannot be modified/deleted   │  │ ✓ You Control Access    │   ║
║  │                                      │  │ ✓ Encrypted Comms       │   ║
║  │ 2️⃣  Transparent Access             │  │                         │   ║
║  │ See when MyKad is used               │  │                         │   ║
║  │                                      │  │                         │   ║
║  │ 3️⃣  Fraud Detection                │  │                         │   ║
║  │ Identify suspicious usage            │  │                         │   ║
║  └──────────────────────────────────────┘  └─────────────────────────┘   ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
```

### Blockchain Proof Dialog

```
╔════════════════════════════════════════════════════════════════════════════╗
║                                                                            ║
║  BLOCKCHAIN VERIFICATION DETAILS                                          ║
║  Complete audit trail and cryptographic proof for this MyKad usage event  ║
║                                                                            ║
║  🔒 BLOCKCHAIN-VERIFIED EVENT                                            ║
║  This event is recorded on a distributed ledger and cannot be modified    ║
║  or deleted.                                                              ║
║                                                                            ║
║  ┌─────────────────────────────────────────────────────────────────────┐  ║
║  │ INSTITUTION            │ ACTION TYPE                               │  ║
║  │ Kuala Lumpur Hospital  │ Patient Registration                      │  ║
║  │                        │                                           │  ║
║  │ TIMESTAMP              │ STATUS                                    │  ║
║  │ Dec 11, 2024 14:30:00  │ [✅ Approved]                             │  ║
║  └─────────────────────────────────────────────────────────────────────┘  ║
║                                                                            ║
║  🔐 BLOCKCHAIN DETAILS                                                    ║
║                                                                            ║
║  Transaction Hash:                                                        ║
║  ┌──────────────────────────────────────────────────────────────────┐    ║
║  │ 0xabcd1234efgh5678ijkl9012mnop3456                               │    ║
║  └──────────────────────────────────────────────────────────────────┘    ║
║                                                                            ║
║  Block Number: 19245678                                                   ║
║                                                                            ║
║  Verification Status: ✓ Verified                                          ║
║                                                                            ║
║  ℹ️  PRIVACY ASSURANCE                                                    ║
║  Only this access event is recorded on the blockchain. No personal data,  ║
║  medical records, or health information is stored on the ledger. This     ║
║  ensures your health data remains private while creating an immutable     ║
║  audit trail for accountability.                                          ║
║                                                                            ║
║  ┌──────────────────────────────────┐  ┌──────────────────────────────┐  ║
║  │ Copy Transaction Hash            │  │ Copy Block Number            │  ║
║  └──────────────────────────────────┘  └──────────────────────────────┘  ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
```

---

## Mobile Responsive Views

### Confirmation Modal (Mobile)
```
┌─────────────────────────────────┐
│ 🛡️  MyKad Usage Request        │
│                                 │
│ 🏥 Kuala Lumpur Hospital       │
│    Hospital • Kuala Lumpur     │
│                                 │
│ [Patient Registration]          │
│ Patient Registration - Account  │
│ Creation                        │
│                                 │
│ Dec 11, 2024 • 14:30:00       │
│ Kuala Lumpur, Malaysia         │
│                                 │
│ Expires in: 1:45 ⏳            │
│                                 │
│ [Deny]                         │
│ [Approve & Confirm]            │
│                                 │
└─────────────────────────────────┘
```

### Audit Trail (Mobile)
```
┌──────────────────────────┐
│ 🔒 MyKad Audit Trail    │
│                          │
│ APPROVED: 8              │
│ DENIED: 1                │
│ EMERGENCY: 1             │
│ VERIFIED: 10             │
│                          │
│ EVENTS                   │
│ Dec 11 14:30             │
│ KL Hospital              │
│ [🔵 Patient Reg]         │
│ ✅ Approved              │
│ [View Proof]             │
│                          │
│ Dec 10 09:15             │
│ Selangor Medical         │
│ [🟣 Medical Access]      │
│ ✅ Approved              │
│ [View Proof]             │
│                          │
└──────────────────────────┘
```

---

## Color Palette Reference

### Primary Colors
```
Primary Blue:     #3B82F6  (Trust, Security)
Primary Dark:     #1E40AF  (Deep Trust)
Accent Emerald:   #10B981  (Approval, Success)
Danger Red:       #EF4444  (Denial, Danger)
```

### Action Type Colors
```
Registration:     #DBEAFE bg, #1E40AF text  (Blue)
Record Access:    #F3E8FF bg, #6D28D9 text  (Purple)
Verification:     #CFFAFE bg, #0891B2 text  (Cyan)
Consent:          #DCFCE7 bg, #15803D text  (Green)
Emergency:        #FEE2E2 bg, #991B1B text  (Red)
```

### Status Badge Colors
```
Approved:         #DCFCE7 bg, #15803D text  (Green)
Denied:           #FEE2E2 bg, #991B1B text  (Red)
Pending:          #FEF3C7 bg, #92400E text  (Amber)
Emergency Used:   #FEE2E2 bg, #991B1B text  (Red)
```

### Neutral Colors
```
Background:       #F8FAFC  (Light Slate)
Card BG:          #FFFFFF  (White)
Border:           #E2E8F0  (Light Slate)
Text Primary:     #0F172A  (Dark Slate)
Text Secondary:   #64748B  (Muted Slate)
```

---

## Icon Usage

### Action Icons
```
🔵 Registration     - Shield Icon + Blue
🟣 Record Access    - Lock Icon + Purple
🔵 Verification     - Trending Up + Cyan
🟢 Consent          - CheckCircle2 + Green
🔴 Emergency        - AlertTriangle + Red
```

### Status Icons
```
✅ Approved         - CheckCircle2 Green
❌ Denied          - XCircle Red
⏳ Pending          - Clock Amber
🔒 Verified        - Lock Green
⚠️ Emergency       - AlertTriangle Red
```

### Navigation Icons
```
🔒 Lock             - Audit Trail Page Link
🛡️ Shield           - Security/Confirmation
📍 Map Pin          - Location
⏰ Clock            - Time/Expiration
🏥 Building2        - Healthcare Institution
💻 Link             - Blockchain
```

---

## Typography Hierarchy

### Page Title
```
Font Size:      2xl (24px)
Font Weight:    bold (700)
Color:          Primary Blue
Margin:         Bottom 8px
```

### Section Headers
```
Font Size:      lg (18px)
Font Weight:    semibold (600)
Color:          Dark Slate
Margin:         Bottom 4px
```

### Body Text
```
Font Size:      sm (14px)
Font Weight:    normal (400)
Color:          Muted Slate
Line Height:    relaxed (1.625)
```

### Labels
```
Font Size:      xs (12px)
Font Weight:    medium (500)
Color:          Muted Slate
Text Transform: uppercase
Letter Spacing: 0.05em (wider)
```

---

## Spacing & Layout

### Card Padding
```
Small:          p-3 (12px)
Medium:         p-4 (16px)
Large:          p-6 (24px)
```

### Grid Gaps
```
Compact:        gap-2 (8px)
Regular:        gap-4 (16px)
Spacious:       gap-6 (24px)
```

### Responsive Breakpoints
```
Mobile:         0px - 640px      (1 column)
Tablet:         641px - 1024px   (2-3 columns)
Desktop:        1025px+          (4 columns)
```

---

## Interaction States

### Button States
```
Default:        Blue bg, White text
Hover:          Darker blue, scale 1.02
Active:         Pressed effect, scale 0.98
Disabled:       Gray bg, opacity 0.5
Loading:        Spinner icon, disabled state
```

### Modal States
```
Closed:         Hidden, opacity 0
Opening:        Fade in, slide up
Open:           Visible, interactive
Closing:        Fade out, slide down
```

### Link States
```
Default:        Blue text, underline
Hover:          Darker blue, scale up icon
Visited:        Purple text
Active:         Primary color, bold
```

---

## Animation Effects

### Transitions
```
fade-in:        opacity 0 → 1 (200ms)
slide-up:       translateY 20px → 0 (300ms)
scale-up:       scale 0.95 → 1 (200ms)
pulse:          opacity animation (2s infinite)
```

### Loading Animation
```
Spinner:        Rotating circle (1s)
Bounce:         Up-down movement (1s)
```

### Page Entry
```
animate-fade-in: Content fades in on page load
Duration:       400ms
Delay:          Staggered by element (50-100ms)
```

---

## Accessibility Features

✓ **Semantic HTML** - Proper heading hierarchy  
✓ **ARIA Labels** - Screen reader friendly  
✓ **Color Contrast** - WCAG AA compliant  
✓ **Keyboard Nav** - Tab through all elements  
✓ **Focus States** - Clear focus rings  
✓ **Icons + Text** - Never rely on icons alone  
✓ **Motion** - Respects prefers-reduced-motion  
✓ **Readable Text** - Minimum 14px font size  

---

## Dark Mode Support

All components support dark mode with:
- ✓ Inverted colors
- ✓ Preserved contrast ratios
- ✓ Smooth theme transitions
- ✓ Persistent user preference

---

**NextGuard ID Design System** 🎨
*Secure, Transparent, User-Centric*
