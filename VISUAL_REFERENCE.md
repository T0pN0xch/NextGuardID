# NextGuard ID - Visual Reference & Component Guide

## Component Architecture

```
App Root
├── Index.tsx (Main Router)
│   ├── MyKadUsageConfirmation (Modal - Global)
│   │   ├── AlertDialog
│   │   ├── Card with Institution Info
│   │   ├── Badge for Action Types
│   │   ├── Alert for Privacy Notice
│   │   └── Timer Countdown
│   │
│   └── Routes
│       ├── /mykad-audit-trail → MyKadAuditTrailPage (NEW)
│       │   ├── Statistics Dashboard (4 Cards)
│       │   ├── Trust Information Alert
│       │   ├── Event Log Table
│       │   │   ├── Timestamp
│       │   │   ├── Institution Info
│       │   │   ├── Action Badge
│       │   │   ├── Purpose
│       │   │   ├── Status Badge
│       │   │   └── View Proof Button
│       │   │       └── Blockchain Verification Dialog
│       │   │
│       │   └── Trust Sections (2 Cards)
│       │       ├── How Blockchain Protects You
│       │       └── Your Privacy is Safe
│       │
│       └── Other Routes (unchanged)
```

---

## User Journey Maps

### Journey 1: Approving MyKad Usage

```
┌─────────────────────────────────────────────────────────┐
│ LOGIN                                                   │
└──────────────────┬──────────────────────────────────────┘
                   │
                   ↓
        ┌──────────────────────────┐
        │ Wait 2 seconds           │
        │ (Demo auto-trigger)      │
        └──────────────┬───────────┘
                       │
                       ↓
        ┌──────────────────────────────────────┐
        │ MYKAD USAGE CONFIRMATION MODAL       │
        │                                      │
        │ 🏥 Kuala Lumpur Hospital            │
        │ Patient Registration                │
        │ Dec 11, 2024 • 14:30:00             │
        │ Kuala Lumpur, Malaysia              │
        │                                      │
        │ ⏱️  Expires in: 2:00                │
        │                                      │
        │ [Deny Request] [Approve & Confirm] │
        └──────────────┬───────────────────────┘
                       │ User clicks "Approve"
                       ↓
        ┌──────────────────────────────────────┐
        │ Process approval                     │
        │ - Create MyKadAuditEvent            │
        │ - Generate blockchain hash          │
        │ - Record in audit trail             │
        │ - Close modal                        │
        └──────────────┬───────────────────────┘
                       │
                       ↓
        ┌──────────────────────────────────────┐
        │ USER CONTINUES TO APP               │
        │ Modal closes                         │
        │ Event recorded in system            │
        └──────────────────────────────────────┘
```

### Journey 2: Viewing Audit Trail

```
┌──────────────────────────────────────┐
│ SIDEBAR - NAVIGATION                 │
│                                      │
│ 👤 Profile                          │
│ 📊 Dashboard                        │
│ ⚠️  Suspicious Activity             │
│ 📍 MyKad Lost Tracking              │
│ 🔒 MyKad Audit Trail ← CLICK HERE  │
│ 📋 ID Usage                         │
│ 🔑 Consent                          │
│ ⛓️  Blockchain                      │
│ ⚙️  Settings                        │
│                                      │
└──────────────────┬──────────────────┘
                   │
                   ↓
    ┌──────────────────────────────────────┐
    │ MYKAD AUDIT TRAIL PAGE               │
    │                                      │
    │ 🔒 MyKad Audit Trail               │
    │ Blockchain-verified history         │
    │                                      │
    │ ┌────────────────────────────────┐  │
    │ │ STATISTICS CARDS               │  │
    │ │ ✅ Approved: 8                 │  │
    │ │ ❌ Denied: 1                   │  │
    │ │ 🚨 Emergency: 1                │  │
    │ │ 🔐 Verified: 10                │  │
    │ └────────────────────────────────┘  │
    │                                      │
    │ ℹ️  Why Your Audit Trail Matters    │
    │ • Fraud Prevention                   │
    │ • Transparency                       │
    │ • Accountability                     │
    │ • Immutable Records                  │
    │ • Privacy Protected                  │
    │                                      │
    │ CHRONOLOGICAL EVENT LOG              │
    │ ┌────────────────────────────────┐  │
    │ │ Dec 11 14:30 | KL Hospital     │  │
    │ │ [Patient Reg] | ✅ Approved    │  │
    │ │ Purpose: Account Creation...   │  │
    │ │                     [View Proof]  │
    │ │                                  │
    │ │ Dec 10 09:15 | Selangor Medical│  │
    │ │ [Rec Access] | ✅ Approved     │  │
    │ │ Purpose: Medical Records...    │  │
    │ │                     [View Proof]  │
    │ │                                  │
    │ │ ... more events ...            │  │
    │ └────────────────────────────────┘  │
    │                                      │
    │ ✓ How Blockchain Protects You      │
    │ ✓ Your Privacy is Safe             │
    └──────────────────┬──────────────────┘
                       │ User clicks [View Proof]
                       ↓
    ┌──────────────────────────────────────┐
    │ BLOCKCHAIN VERIFICATION DIALOG       │
    │                                      │
    │ 🔒 Blockchain-Verified Event        │
    │ Recorded on distributed ledger      │
    │                                      │
    │ Institution: Kuala Lumpur Hospital  │
    │ Action: Patient Registration        │
    │ Timestamp: Dec 11, 2024 14:30:00    │
    │ Status: Approved                    │
    │                                      │
    │ Transaction Hash:                   │
    │ 0xabcd1234efgh5678ijkl...          │
    │                                      │
    │ Block Number: 19245678              │
    │ Verification: ✓ Verified            │
    │                                      │
    │ ℹ️  Privacy Assurance               │
    │ Only access event recorded...       │
    │                                      │
    │ [Copy Hash]  [Copy Block #]         │
    │                                      │
    └──────────────────────────────────────┘
```

---

## Component Relationships

### MyKadUsageConfirmation Dependencies
```
MyKadUsageConfirmation.tsx
├── Imports
│   ├── AlertDialog (shadcn/ui)
│   ├── Card, CardContent (shadcn/ui)
│   ├── Badge (shadcn/ui)
│   ├── Alert, AlertDescription (shadcn/ui)
│   ├── Icons (lucide-react)
│   │   ├── Shield
│   │   ├── MapPin
│   │   ├── Clock
│   │   ├── Building2
│   │   ├── CheckCircle2
│   │   ├── XCircle
│   │   ├── AlertTriangle
│   │   └── Loader2
│   ├── Types
│   │   └── MyKadUsageConfirmationRequest
│   └── Utilities
│       └── cn (classname merger)
└── Exports
    └── MyKadUsageConfirmation Component
```

### MyKadAuditTrailPage Dependencies
```
MyKadAuditTrailPage.tsx
├── Imports
│   ├── UI Components
│   │   ├── Card, CardContent, CardHeader
│   │   ├── Badge
│   │   ├── Button
│   │   ├── Alert, AlertDescription, AlertTitle
│   │   ├── Table (TableBody, TableCell, etc.)
│   │   └── Dialog, DialogContent, etc.
│   ├── Icons (lucide-react)
│   │   ├── Building2
│   │   ├── CheckCircle2
│   │   ├── XCircle
│   │   ├── Clock
│   │   ├── Lock
│   │   ├── Shield
│   │   ├── TrendingUp
│   │   └── AlertTriangle
│   ├── Types
│   │   └── MyKadAuditEvent
│   ├── Data
│   │   └── mockMyKadAuditEvents
│   └── Utilities
│       ├── format (date-fns)
│       └── cn (classname merger)
└── Exports
    └── MyKadAuditTrailPage Component
```

---

## Color Coding Reference

### Status Indicators

```css
/* Approved Status */
.status-approved {
  background-color: #DCFCE7; /* emerald-100 */
  color: #15803D;            /* emerald-800 */
  border-color: #6EE7B7;     /* emerald-300 */
}

/* Denied Status */
.status-denied {
  background-color: #FEE2E2; /* red-100 */
  color: #991B1B;            /* red-800 */
  border-color: #FECACA;     /* red-300 */
}

/* Pending Status */
.status-pending {
  background-color: #FEF3C7; /* amber-100 */
  color: #92400E;            /* amber-800 */
  border-color: #FDE68A;     /* amber-300 */
}

/* Emergency Status */
.status-emergency {
  background-color: #FEE2E2; /* red-100 */
  color: #991B1B;            /* red-800 */
  border-color: #FECACA;     /* red-300 */
}
```

### Action Type Colors

```css
/* Registration */
.action-registration {
  background-color: #DBEAFE; /* blue-100 */
  color: #1E40AF;            /* blue-800 */
  border-color: #BFDBFE;     /* blue-300 */
}

/* Record Access */
.action-record-access {
  background-color: #F3E8FF; /* purple-100 */
  color: #6D28D9;            /* purple-800 */
  border-color: #E9D5FF;     /* purple-300 */
}

/* Verification */
.action-verification {
  background-color: #CFFAFE; /* cyan-100 */
  color: #0891B2;            /* cyan-800 */
  border-color: #A5F3FC;     /* cyan-300 */
}

/* Consent Approval */
.action-consent {
  background-color: #DCFCE7; /* emerald-100 */
  color: #15803D;            /* emerald-800 */
  border-color: #A7F3D0;     /* emerald-300 */
}

/* Emergency Access */
.action-emergency {
  background-color: #FEE2E2; /* red-100 */
  color: #991B1B;            /* red-800 */
  border-color: #FECACA;     /* red-300 */
}
```

---

## State Management

### Global State (in Index.tsx)

```typescript
// Confirmation Modal State
const [confirmationRequest, setConfirmationRequest] = 
  useState<MyKadUsageConfirmationRequest | null>(null);

const [showConfirmation, setShowConfirmation] = 
  useState<boolean>(false);

const [isProcessing, setIsProcessing] = 
  useState<boolean>(false);

// Auth State
const [isAuthenticated, setIsAuthenticated] = 
  useState<boolean>(false);

const [userIc, setUserIc] = 
  useState<string>('');

const [userName, setUserName] = 
  useState<string>('');
```

### Handler Functions

```typescript
// Show confirmation request
const showMockConfirmationRequest = () => {
  // Create request object
  // Set request state
  // Show modal
};

// Handle approval
const handleApprove = (requestId: string) => {
  // Set processing
  // Simulate blockchain recording
  // Close modal
};

// Handle denial
const handleDeny = (requestId: string) => {
  // Set processing
  // Record denial
  // Close modal
};
```

---

## Type Definitions

### MyKadUsageConfirmationRequest
```typescript
interface MyKadUsageConfirmationRequest {
  id: string;                              // Unique request ID
  institution: HealthcareInstitution;      // Institution details
  action: MyKadAuditAction;                // Type of action
  purpose: string;                         // Why access is needed
  timestamp: Date;                         // When requested
  location: string;                        // Geographic location
  expiresIn: number;                       // Seconds until expiration
}
```

### MyKadAuditEvent
```typescript
interface MyKadAuditEvent {
  id: string;                              // Event ID
  timestamp: Date;                         // When it occurred
  institution: HealthcareInstitution;      // Institution involved
  action: MyKadAuditAction;                // Type of action
  purpose: string;                         // Reason for access
  status: MyKadAuditStatus;                // Result status
  blockchainHash: string;                  // Blockchain hash
  blockNumber: number;                     // Block number
  verified: boolean;                       // Verification status
  ipAddress?: string;                      // Optional IP
  location?: string;                       // Optional location
  expiresAt?: Date;                        // Optional expiry
}
```

### HealthcareInstitution
```typescript
interface HealthcareInstitution {
  id: string;                              // Institution ID
  name: string;                            // Institution name
  type: 'hospital' | 'clinic' | 
        'specialist' | 'pharmacy' | 'lab'; // Type
  location: string;                        // Location
  contactNumber: string;                   // Phone
  registeredDate: Date;                    // Registration date
  isVerified: boolean;                     // Verification status
}
```

---

## Data Sample

### Mock Healthcare Institution
```json
{
  "id": "h1",
  "name": "Kuala Lumpur Hospital",
  "type": "hospital",
  "location": "Kuala Lumpur, Malaysia",
  "contactNumber": "+60-3-2615 5555",
  "registeredDate": "2023-01-15T00:00:00Z",
  "isVerified": true
}
```

### Mock Audit Event
```json
{
  "id": "audit1",
  "timestamp": "2024-12-11T14:30:00Z",
  "institution": {
    // ... institution object ...
  },
  "action": "registration",
  "purpose": "Patient Registration - New Account Creation",
  "status": "approved",
  "blockchainHash": "0xabcd1234efgh5678ijkl9012mnop3456",
  "blockNumber": 19245678,
  "verified": true,
  "location": "Kuala Lumpur, Malaysia"
}
```

---

## Navigation Flow

### Sidebar Navigation Items (Updated)

```
Profile ────────────────────→ /profile
Dashboard ──────────────────→ /dashboard
Suspicious Activity ────────→ /suspicious
MyKad Lost Tracking ────────→ /mykad-tracking
MyKad Audit Trail (NEW) ────→ /mykad-audit-trail ✨
ID Usage ───────────────────→ /usage
Consent ────────────────────→ /consent
Blockchain ─────────────────→ /blockchain
Settings ──────────────────→ /settings
```

---

## Event Handling

### Confirmation Modal Handlers

```typescript
// When user clicks "Approve & Confirm"
onApprove(requestId: string) {
  1. Set isProcessing = true
  2. Show loading spinner
  3. Simulate blockchain recording (1.5s)
  4. Create MyKadAuditEvent
  5. Close modal
  6. Set isProcessing = false
  7. Log approval to console
}

// When user clicks "Deny Request"
onDeny(requestId: string) {
  1. Set isProcessing = true
  2. Show loading spinner
  3. Create denial record (1s)
  4. Close modal
  5. Set isProcessing = false
  6. Log denial to console
}

// Auto-close on timeout
onExpire() {
  1. Modal closes automatically
  2. Request considered expired
  3. No action recorded
}
```

---

## Accessibility Features

### Keyboard Navigation
- ✓ Tab through all interactive elements
- ✓ Enter/Space to activate buttons
- ✓ Escape to close modal
- ✓ Focus visible on all elements

### Screen Reader Support
- ✓ Semantic HTML
- ✓ ARIA labels
- ✓ Role attributes
- ✓ Alt text for icons

### Visual Accessibility
- ✓ High contrast ratios
- ✓ Large touch targets
- ✓ Readable font sizes
- ✓ Clear visual hierarchy

### Motion Accessibility
- ✓ Respects prefers-reduced-motion
- ✓ No auto-playing animations
- ✓ Smooth transitions (not instant)

---

## Performance Considerations

### Bundle Impact
- `MyKadUsageConfirmation.tsx` - ~8KB
- `MyKadAuditTrailPage.tsx` - ~12KB
- Mock data - ~2KB
- Total additions - ~22KB

### Render Optimization
- Uses React.useState efficiently
- Memoized components where needed
- Minimal re-renders on state change

### Table Performance
- Handles 10+ events without lag
- Scrollable with CSS
- No virtual scrolling needed for current data volume

---

## Browser Compatibility

✓ Chrome 90+  
✓ Firefox 88+  
✓ Safari 14+  
✓ Edge 90+  
✓ Mobile browsers (iOS Safari, Chrome Android)  

---

## Future Enhancement Hooks

### Extensibility Points

1. **Notification System**
   - Add push notifications
   - Email alerts
   - SMS alerts

2. **Analytics**
   - Track approval rates
   - Usage patterns
   - Institution statistics

3. **Advanced Filtering**
   - Date range filters
   - Institution filters
   - Status filters
   - Action type filters

4. **Export Functionality**
   - Download as PDF
   - Export as CSV
   - Share audit trail

5. **Consent Management**
   - Pre-approved institutions
   - Recurring consent
   - Consent templates

6. **Emergency Override**
   - One-time emergency access
   - Medical emergency handling
   - Automatic logging

---

**NextGuard ID - Visual & Technical Reference**

*Complete component documentation and visual guides*
