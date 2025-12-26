# NextGuard ID - Live Demonstration Script (Demo-Focused)
**Duration: ~5 minutes | Slides Cover Concepts, Demo Shows Usage**

---

## 📋 Quick Setup Checklist

- [ ] App running: `npm run dev` on localhost:5173
- [ ] Mock data visible on all pages
- [ ] MetaMask installed (optional)
- [ ] This script open as reference
- [ ] Ready to navigate and click

---

## 🎬 PAGE 1: HOME / INDEX PAGE (15 seconds)

**What to Say:** "Let's start with the home page - this is where users first learn about NextGuard ID."

**What to Do:**
- Show the landing page briefly
- Point to the main features listed
- Click "Get Started" or "Dashboard" button

**What to Point Out:**
- Logo and "Your Digital Identity Guardian" tagline
- The 4 key features (Real-time approval, Blockchain audit trail, Identity protection, Transparency)

**Then:** Navigate to Dashboard

---

## 🎬 PAGE 2: DASHBOARD (45 seconds)

**Scenario:** "Ahmad logs in to see his identity protection status at a glance."

**What to Do:**
1. Point to the 4 metric cards at the top
2. Read the numbers (approvals, blocked, emergency access, suspicious)
3. Scroll down to show the recent access table
4. Show the usage timeline below

**What to Say While Pointing:**
- "These cards show his real-time status - how many times his MyKad was accessed, how many were blocked, emergency situations, and suspicious alerts."
- "The table shows each access - who accessed it, when, and the status."
- "The timeline visualizes his monthly usage pattern."

**Key Point:** "Everything you see here is recorded on the blockchain."

**Then:** Navigate to MyKad Audit Trail

---

## 🎬 PAGE 3: MYKAD AUDIT TRAIL (1.5 minutes)

**Scenario:** "Ahmad gets a suspicious email saying someone opened a Maybank account. He checks the blockchain audit trail to verify if it's real or a scam."

**What to Do:**
1. Click "Connect MetaMask Wallet" (optional, skip if not needed)
2. Show the table of events with columns: Timestamp, Institution, Action, Status, TX Hash, Block
3. **Search for "Maybank"** - show the search result (likely zero results)
4. Click on a TX Hash to show Polygonscan link

**What to Say:**
- "Search for 'Maybank'... Zero results. That means Maybank never accessed his MyKad. The email is a scam. He has blockchain proof."
- Point to the table: "Each row is a verified event. Look at the TX Hash - that's the blockchain transaction proof."
- "Click here to see it on Polygonscan..." [Show the actual blockchain record if the link works]

**Key Point:** "Every access is cryptographically proven. No one can fake this data or hide it."

**Then:** Navigate to Consent Management

---

## 🎬 PAGE 4: CONSENT MANAGEMENT (1 minute)

**Scenario:** "Ahmad receives an access request from Kuala Lumpur Hospital for patient registration. He approves it with specific data, then later revokes access when he changes his mind."

**What to Do:**
1. Show "Pending Approval Requests" section
2. Click "Approve" on a low-risk request (hospital registration)
3. Review the confirmation dialog (institution, data, purpose, expiry)
4. Click "Yes, Approve"
5. Scroll down to "Active Consents" section
6. Click "Revoke" on an active consent
7. Confirm the revocation

**What to Say:**
- "Hospital is requesting: Full Name, IC Number, Email for patient registration. Expires in 90 days."
- "Ahmad reviews and approves. [Confirm approval]"
- "Later, he decides to revoke access [Click revoke, confirm]"

**Key Point:** "Users control exactly which data each institution can access and can revoke anytime."

**Then:** Navigate to Suspicious Activity

---

## 🎬 PAGE 5: USER PROFILE (30 seconds)

**Location:** `http://localhost:5173/profile`

---

### 📖 Full Demonstration Script - Read Aloud:

"Now let's look at Ahmad's profile page. This shows his personal information verified through MyDigital ID, which is Malaysia's official digital identity system.

Notice at the top there's a prominent blue alert box saying 'Secured by MyDigital ID'. This is important. Ahmad's profile information isn't stored by NextGuard ID. It's sourced from the government's official MyDigital ID system. This means:

1. His data comes from an authoritative, trusted source
2. His profile information is read-only - NextGuard ID can't modify it
3. If he needs to update his information, he goes directly to MyDigital ID, not to NextGuard ID

This separation is crucial for security and regulatory compliance. NextGuard ID controls identity usage, not identity data. We track who accesses his identity and record it on blockchain. The government holds the master copy of his identity data.

Looking at his profile information:
- Full Name: Ahmad Abdullah (verified)
- MyKad Number: 880101-14-3456 (formatted for readability)
- Email: ahmad.abdullah@example.com
- Phone: +60 12-3456 7890
- Address: Kuala Lumpur, Malaysia
- Date of Birth: 1988-01-01
- Nationality: Malaysian
- Status: Active

Each field has a green checkmark indicating it's verified through MyDigital ID. This builds trust. Ahmad knows his profile data is authentic because it comes from the government system.

The key message here is: Your profile is verified and trusted. All your identity data is authenticated. And NextGuard ID's job is to track and control how institutions use this verified identity. This is the complete picture of digital identity protection."

[Show the profile page with the verified checkmarks and MyDigital ID security notice]

---

## 🎬 PAGE 6: USAGE PAGE - MANUAL IC TRACKING (45 seconds)

**Location:** `http://localhost:5173/usage`

---

### 📖 Full Demonstration Script - Read Aloud:

"Let me explain an important scenario. Not all MyKad usage is digital. In Malaysia, many transactions still happen at physical locations.

Imagine Ahmad visited his local clinic yesterday. The receptionist asked for his MyKad, scanned it or manually entered his IC number into their system. That's a MyKad usage event, but it's not recorded on the blockchain automatically because it didn't go through a digital API.

This is a problem with traditional solutions. They only capture digital interactions, missing a huge chunk of real-world MyKad usage. With NextGuard ID, we solve this by letting users manually log these offline transactions.

Look at the Usage Page. At the top, you can see a list of previous manual IC entries. For example:

**Clinic Walk-in Registration**
Date: December 16, 2025
Purpose: Patient registration
Note: 'IC entered on paper form at Klinik Sejahtera reception'

**Bank Branch Account Opening**
Date: November 15, 2025
Purpose: Account opening
Note: 'IC photocopied and attached to paper application'

These are real-world transactions that Ahmad logged manually. The system records them with a timestamp, purpose, location, and any notes Ahmad wants to add.

Now, if Ahmad wants to add a new manual usage record, he clicks 'Add Manual IC Usage' and fills out a simple form:
- Service Name: 'Petrol Station Membership'
- Purpose: 'Loyalty program registration'
- Category: 'Retail'
- Data Shared: 'Full Name, IC Number'
- Date: Today's date
- Additional Note: 'Signed up for Shell petrol card rewards at Shell Sentral'

He clicks 'Save Offline Usage', and it's added to his complete audit trail.

The genius of this is that Ahmad now has a complete record of ALL MyKad usage - both digital and physical. When he checks his usage history, he sees:
- The hospital visit where they scanned his IC
- The bank branch where they photocopied it
- The government office where he renewed his license
- The retail store where he entered it for a membership

This is important for Malaysia because we're still in transition between physical and digital systems. Most countries are fully digital, but here, many institutions still use physical IC cards or manual entry. NextGuard ID captures both, giving Ahmad a truly complete audit trail.

He can search by service name, filter by risk level, sort by date - all the tools to find what he's looking for. When combined with the blockchain audit trail we saw earlier, Ahmad has complete visibility of his identity usage - 100% of the time, whether it's digital or physical."

[Navigate to the Usage page and show existing offline records and the form for adding new ones]

---

## 🎬 PAGE 5: SUSPICIOUS ACTIVITY DETECTION (45 seconds)

**Scenario:** "Ahmad receives alerts - the system detected rapid access attempts and blocked them automatically."

**What to Do:**
1. Show the suspicious activity cards/list
2. Point to each activity: HIGH RISK (red), MEDIUM RISK (yellow)
3. Show the status: BLOCKED ✅, FLAGGED ⚠️, RESOLVED ✓

**What to Say While Pointing:**
- "Activity 1: 5 access attempts in 2 minutes from different banks - BLOCKED"
- "Activity 2: MyKad used 500km away - FLAGGED for verification"
- "Activity 3: Institution tried to access data beyond consent - BLOCKED"
- "Activity 4: Failed login attempts - RESOLVED"

**Key Point:** "AI detects suspicious patterns and blocks fraud in real-time before it happens."

**Then:** Navigate to Blockchain Explorer

---

## 🎬 PAGE 6: BLOCKCHAIN EXPLORER (1 minute)

**Scenario:** "A hospital wants to verify all MyKad access records are authentic. They check the blockchain explorer to independently verify the data."

**What to Do:**
1. Show the blockchain records table with columns
2. Point to: TX Hash, Timestamp, Institution, Action, Status, Block Number
3. **Search for an institution** (e.g., "Hospital") to show filtering
4. Click on a TX Hash to show Polygonscan link (if possible)

**What to Say:**
- "Every transaction is recorded on Polygon blockchain with a unique hash."
- "Search for 'Hospital'... See all hospital-related transactions."
- "Click this TX Hash to see it on Polygonscan - the public blockchain explorer. Anyone can verify this independently."

**Key Point:** "Complete transparency - regulators, hospitals, auditors can all verify records independently without trusting any single company."

**Then:** Go back to show summary (or navigate to Settings if time permits)

---

## 🎬 PAGE 7: USER PROFILE (Optional - 15 seconds)

**Scenario:** "User's verified MyDigital ID profile - sourced from government, not NextGuard ID."

**What to Do:**
- Show the blue security alert: "Secured by MyDigital ID"
- Point to profile fields with green checkmarks
- Mention it's read-only

**What to Say:**
- "Profile data comes from Malaysia's official MyDigital ID system - verified and read-only."

---

## 🎬 PAGE 8: USAGE PAGE (Optional - 30 seconds)

**Scenario:** "Ahmad manually logs an offline clinic visit where they scanned his IC."

**What to Do:**
1. Show existing offline records in the table
2. Click "Add Manual IC Usage"
3. Fill one example (Service: "Clinic", Purpose: "Registration", Date, Note)
4. Click Save to show it's added

**What to Say:**
- "Not all MyKad usage is digital. Users can manually log offline transactions where IC was used."
- "This captures the complete audit trail - both digital and physical transactions."

---

## 📊 SUMMARY (30 seconds)

**Point Out:**
1. **Dashboard** - Real-time overview of all activities
2. **Audit Trail** - Blockchain-verified proof with Polygonscan links
3. **Consent** - Granular, revocable access control
4. **Suspicious Activity** - AI-powered fraud detection and blocking
5. **Blockchain Explorer** - Public verification and regulatory compliance

**Final Message:**
"Every transaction, approval, denial, and security event is recorded on the Polygon blockchain. Users have complete control, transparency, and cryptographic proof of their identity usage. That's NextGuard ID."

---

#  FULL DEMONSTRATION SCRIPT - COMPLETE DIALOGUE

**Read this from start to finish during the demo**

---

## INTRODUCTION

"Good afternoon, everyone. My name is [Your Name] and I'm here to demonstrate NextGuard ID - a blockchain-powered solution that transforms how Malaysians protect their digital identity.

Imagine this: Your MyKad is lost. Someone finds it. Now they have your identity information - your name, your IC number, your identity. Without NextGuard ID, you have no idea what they're doing with it. Are they opening bank accounts? Applying for loans? Committing fraud in your name? You won't know until bills start arriving or the police show up.

But what if you could see in real-time every single time someone used your MyKad? What if you could instantly approve or deny access? What if you had cryptographic proof on a public blockchain that you never authorized a particular access? That's NextGuard ID.

Let me walk you through how it works. We're going to start with a user named Ahmad - a Malaysian professional whose MyKad was accidentally found at a shopping mall. Ahmad has already completed the onboarding session where he set up his account and connected his MyDigital ID. Now I'll show you how he uses NextGuard ID to protect his identity and control who accesses his data.

Through NextGuard ID, Ahmad gains complete visibility and control over his identity. He can see exactly who's accessing it, when they're accessing it, what they're accessing, and he can approve, deny, or revoke access instantly.

The key difference from traditional systems is blockchain. Every single action - every approval, every denial, every suspicious activity blocked - is recorded permanently on the Polygon blockchain. This isn't stored on NextGuard ID's servers where it could be hacked or deleted. It's stored across thousands of validator nodes worldwide.

Let me show you this in action."

---

## PAGE 0A: LOGIN PAGE

"Let's start from the beginning. Ahmed opens the NextGuard ID app on his phone.

[Show Login Page]

He sees the login screen using MyDigital ID - Malaysia's official government-backed digital identity system. This uses biometric authentication - his fingerprint or face - which is far more secure than a password.

Ahmed authenticates with his fingerprint or face.

[Ahmed authenticates with biometric]

After successful authentication, the system sends him an OTP for the second layer of security.

Let me navigate to the OTP verification page."

[Click Next or Navigate to OTP Page]

---

## PAGE 0B: OTP VERIFICATION PAGE

"Ahmed receives an OTP - a One-Time Password. This can come from an authenticator app or SMS message. It's valid for just 5 minutes and can only be used once.

[Show OTP Page]

Ahmed enters the 6-digit code.

[Enter OTP Code]

He clicks Verify. Once verified, Ahmed is authenticated through both government-verified identity and the OTP. He's now logged in and taken to the home page.

Important: In about 5 minutes, Ahmad will receive a real-time approval request from a healthcare institution. This will pop up while he's browsing the app - demonstrating how NextGuard ID alerts users instantly when their MyKad is being requested. This is exactly what makes the system powerful: Ahmad doesn't have to wait to check his account - the system notifies him immediately when action is needed.

This two-factor authentication - MyDigital ID biometrics plus OTP - ensures secure access."

[Click Continue or Navigate to Home Page]

---

## PAGE 1: HOME PAGE

"Let's start with the home page. This is where users first encounter NextGuard ID. You can see the tagline: 'Your Digital Identity Guardian'. The platform is designed to solve one fundamental problem - when your MyKad is lost or stolen, you have zero visibility into who's using it. 

Here on this page you can see the four core features we offer:
- Real-time approval systems
- Blockchain audit trails  
- Identity protection
- Complete transparency

Let me navigate to the dashboard to show you how this works in practice."

[Click Dashboard]

---

## PAGE 2: DASHBOARD

"Perfect, we're on Ahmad's Dashboard now. This is his control center - where he can see everything about his MyKad usage.

Look at these four metric cards at the top. The first one shows MyKad Approvals - this is how many times Ahmad approved access to his identity this month. See the number? That means that many institutions requested access, and Ahmad reviewed and approved each one.

The second card shows Approvals Blocked - these are attempts that were flagged or blocked automatically. The system detected something suspicious and prevented unauthorized access.

The third card is Emergency Access - imagine Ahmad was in an accident and rushed to hospital. Emergency situations can request immediate access with one click approval.

And the fourth card shows Suspicious Activity - our AI flagged some unusual patterns that Ahmad needs to be aware of.

Now scroll down. You can see the detailed table showing recent MyKad access events. Each row shows: timestamp, which institution accessed it, what action they performed, and the status - whether it was approved, denied, or emergency.

Below that is the usage timeline - a visual representation of his MyKad usage throughout the month.

Here's the key part: Every single record you see here - every approval, every block, every event - is permanently recorded on the Polygon blockchain. That means Ahmad can go to Polygonscan anytime and independently verify any record. No company, not even NextGuard ID, can change or delete these records.

Let me navigate to the Audit Trail to show you the blockchain verification."

[Click Audit Trail]

---

## PAGE 3: MYKAD AUDIT TRAIL

"We're now on the MyKad Audit Trail page. Let me walk you through a scenario.

Imagine Ahmad gets a suspicious email: 'Congratulations! Your Maybank account has been opened.' His heart races - did someone commit fraud using his MyKad? With traditional systems, he'd have to call the bank, wait on hold, and hope they investigate. It could take weeks.

But with NextGuard ID, Ahmad immediately searches his audit trail for 'Maybank'.

[Search for "Maybank"]

Look at the results - zero. Maybank never accessed his MyKad. The email is a scam. Ahmad has instant proof that the fraudster is lying.

Now look at the table structure. Each row is a complete record with: timestamp of access, the institution name, what action they performed, the status, and most importantly - the TX Hash. This TX Hash is the blockchain transaction identifier - it's cryptographic proof that this event was recorded permanently on Polygon.

Let me click on one of these TX hashes to show you the blockchain verification.

[Click on a TX Hash]

This opens Polygonscan - the public blockchain explorer. Here you can see the actual transaction recorded on the Polygon blockchain. The transaction hash matches, block number is confirmed, gas fees are shown proving it was a real transaction. Anyone in the world can verify this independently. There's no server to hack, no database to modify. This is cryptographic proof.

When you search for any institution, all their access attempts appear immediately - hospital visits, bank interactions, government services - everything is tracked and verifiable on the blockchain.

So if Ahmad ever faces fraud accusations, or if someone claims they accessed his MyKad without permission, he has blockchain proof showing exactly what happened and when. No more 'he said, she said' - the blockchain has the evidence.

Let me navigate to Consent Management to show how Ahmad controls who gets access to his data."

[Click Consent]

---

## PAGE 4: CONSENT MANAGEMENT

"We're now on the Consent Management page. This is where Ahmad controls exactly which institutions can access which data.

Here's the scenario: Kuala Lumpur Hospital is requesting access to Ahmad's medical records for patient registration. But Ahmad wants to be careful. He doesn't want the hospital to have access to his banking information or shopping history - only what's necessary.

At the top, we see 'Pending Approval Requests'. The hospital is requesting: Full Name, IC Number, Email, Phone Number. Purpose: Patient Registration. Expires in 30 minutes. Location: Kuala Lumpur. Risk Level: Low.

Ahmad has two choices: Approve or Deny. Let me click Approve.

[Click Approve]

A confirmation dialog appears showing all the details one more time: Kuala Lumpur Hospital, the specific data they're requesting, patient registration purpose, expires in 90 days. Ahmad confirms by clicking Yes, Approve.

[Click Yes, Approve]

Instantly, two things happen:
1. The hospital gets access to his requested data
2. A blockchain transaction records his approval as permanent proof

So if there's ever a dispute - the hospital tries to access data Ahmad didn't consent to - Ahmad has cryptographic proof of exactly what he authorized.

Now scroll down to the Active Consents section. These are all institutions with current access. Each shows: institution name, purpose, which specific data fields they can access, expiration date, and status.

Most importantly - Ahmad can revoke any consent anytime. Let me demonstrate. I'll click Revoke on one of these consents.

[Click Revoke on an active consent]

A confirmation dialog asks if he's sure. Ahmad confirms.

[Click Yes, Revoke]

Watch what happens instantly:
1. The institution's access is cut off - they can no longer request any data
2. A revocation record is created in the system
3. If they try to access his data after this moment, they're blocked
4. Ahmad receives confirmation that the revocation was successful

This is the power of NextGuard ID. Ahmad isn't locked into permanent consent like traditional systems. He has complete control - approve, deny, or revoke access anytime, instantly. Every institution knows that their access can be cut off at any moment if Ahmad changes his mind or suspects misuse.

Let me navigate to Suspicious Activity to show you the fraud detection in action."

[Click Suspicious Activity]

---

## PAGE 5: SUSPICIOUS ACTIVITY DETECTION

"We're on the Suspicious Activity page. Ahmad's phone just alerted him that the system detected and blocked four suspicious activities.

Look at Activity 1: 'Rapid Multiple Access Attempts' - Red, High Risk, Blocked. What happened? An attacker got Ahmad's MyKad information and frantically tried to open 5 accounts with different banks in 2 minutes. Five access attempts in 120 seconds is physically impossible for legitimate use. The system detected this fraud pattern instantly and blocked all five attempts. The attacker got nothing.

Activity 2: 'Access from Unusual Location' - Yellow, Medium Risk, Flagged. Ahmad was in Kuala Lumpur yesterday, but today his MyKad is being used in Johor Bahru - 500 kilometers away. Physically impossible to travel that distance in 30 minutes. The system flagged it for Ahmad's review. Maybe he actually traveled, or maybe an attacker has his information. The system asks him to verify. If he denies it, future access is blocked.

Activity 3: 'Consent Violation Attempt' - Red, High Risk, Blocked. Ahmad consented to UnknownBank accessing his Full Name, IC Number, Email for account opening. But the bank tried accessing his financial records, phone number, address - data Ahmad never consented to. The system detected the violation immediately and blocked it. The record is stored on blockchain. If the bank claims authorization, Ahmad has cryptographic proof they weren't authorized.

Activity 4: 'Failed Authentication Attempts' - Yellow, Medium Risk, Resolved. Someone tried accessing Ahmad's account three times from different locations and failed. The system locked the account after three attempts. Ahmad was notified, verified his credentials, and resolved the alert.

That's AI-powered fraud detection: automatic blocking of high-risk activities in real-time before fraud happens. Pattern recognition learns Ahmad's normal behavior. Every blocked attempt, every alert is recorded on blockchain. Ahmad has proof of what was attempted and when.

---

## PAGE 5B: REAL-TIME APPROVAL POPUP (DURING DEMO)

"Now, while Ahmad is browsing the app, notice what just happened - a popup appeared on his phone screen!

[Show the MyKad Usage Request Modal/Popup]

This is a critical moment. Let me explain what's happening:

A healthcare provider - Kuala Lumpur Hospital - is requesting access to Ahmad's MyKad right now. The system detected this request and immediately alerted Ahmad with a real-time popup. He didn't have to log back in or check his account. The notification came to him instantly.

Look at what the popup shows:

**Institution:** Kuala Lumpur Hospital with their icon
**Purpose:** Patient Registration
**Data Requested:** Full Name, IC Number, Email, Phone Number
**Location:** Kuala Lumpur, Malaysia
**Risk Level:** Low (green indicator)
**Urgency:** Normal priority with countdown timer

Ahmad sees ALL the details right here. He has two choices:
1. **Approve & Confirm** - Grant access and record his approval on blockchain
2. **Deny Request** - Reject the request and it's also recorded on blockchain

This is the heart of the system. Ahmad is not a passive user. He's not hoping that institutions will ask permission - he DEMANDS permission. Every single access request requires his explicit approval.

When he clicks Approve, two things happen instantly:
1. The hospital is granted access to his data
2. A blockchain transaction records his approval - cryptographic proof that Ahmad authorized this specific access for this specific institution on this specific date and time

Let me click Approve to show you what happens."

[Click Approve button on the popup]

"A confirmation dialog appears for extra security, asking Ahmad to confirm one more time. He reviews the details:
- Institution: Kuala Lumpur Hospital ✓
- Data: Full Name, IC Number, Email, Phone Number ✓
- Purpose: Patient Registration ✓
- Duration: 90 days ✓

He's confident this is correct, so he clicks 'Yes, Approve'."

[Click Yes, Approve]

"The system processes the approval. Behind the scenes:
1. The blockchain records the transaction
2. IPFS stores the metadata about what data was consented to
3. The hospital receives a notification that their request was approved
4. Ahmad receives a confirmation

This is remarkable. Ahmad now has permanent proof on the blockchain that HE approved this access. If the hospital tries to access data beyond what he consented to, he can go to Polygonscan, show the blockchain record of his approval, and prove they violated his consent. No dispute. No argument. Cryptographic proof.

And the beauty is: if Ahmad changes his mind in the future, he can revoke this consent anytime. The hospital's access is cut off immediately. That revocation is ALSO recorded on blockchain.

That's the power of real-time approval popups - they keep users in control 24/7. You're never passive. You're always aware and always in charge."

[Close the popup or continue to next page]

---

## PAGE 6: SETTINGS (Optional)

"Let me also show you the Settings page, where Ahmad controls his preferences and notifications.

[Navigate to Settings page]

On the Settings page, Ahmad can:

**Notification Preferences:**
- Enable/disable push notifications for approval requests
- Choose notification methods: In-app only, SMS, Email, or Push notification
- Set quiet hours (e.g., don't notify between 11 PM and 8 AM)

**Security Settings:**
- Change biometric authentication
- Update phone number for OTP
- Review login history
- Clear browser cache and session data

**Privacy Preferences:**
- Consent data retention period
- Auto-revoke inactive consents (e.g., after 180 days)
- Data deletion schedule
- Blockchain recording preferences (always on - cannot be disabled for security)

**Account Settings:**
- Update profile information (redirects to MyDigital ID)
- Download personal data
- Export audit trail as PDF or CSV

**About:**
- App version
- Terms of Service
- Privacy Policy
- Contact support
- Feedback and suggestions

The key here is control and transparency. Ahmad customizes how he wants to be notified, how long he wants his consent records kept, when old consents automatically expire. But the blockchain recording is permanent and cannot be disabled - that's for security.

This is truly user-centric identity protection. Every setting is designed to give Ahmad control while maintaining the integrity of the blockchain audit trail."

[Show the settings interface]

---

## PAGE 5: SUSPICIOUS ACTIVITY DETECTION

"We're on the Suspicious Activity page. Ahmad's phone just alerted him that the system detected and blocked four suspicious activities.

Look at Activity 1: 'Rapid Multiple Access Attempts' - Red, High Risk, Blocked. What happened? An attacker got Ahmad's MyKad information and frantically tried to open 5 accounts with different banks in 2 minutes. Five access attempts in 120 seconds is physically impossible for legitimate use. The system detected this fraud pattern instantly and blocked all five attempts. The attacker got nothing.

Activity 2: 'Access from Unusual Location' - Yellow, Medium Risk, Flagged. Ahmad was in Kuala Lumpur yesterday, but today his MyKad is being used in Johor Bahru - 500 kilometers away. Physically impossible to travel that distance in 30 minutes. The system flagged it for Ahmad's review. Maybe he actually traveled, or maybe an attacker has his information. The system asks him to verify. If he denies it, future access is blocked.

Activity 3: 'Consent Violation Attempt' - Red, High Risk, Blocked. Ahmad consented to UnknownBank accessing his Full Name, IC Number, Email for account opening. But the bank tried accessing his financial records, phone number, address - data Ahmad never consented to. The system detected the violation immediately and blocked it. The record is stored on blockchain. If the bank claims authorization, Ahmad has cryptographic proof they weren't authorized.

Activity 4: 'Failed Authentication Attempts' - Yellow, Medium Risk, Resolved. Someone tried accessing Ahmad's account three times from different locations and failed. The system locked the account after three attempts. Ahmad was notified, verified his credentials, and resolved the alert.

That's AI-powered fraud detection: automatic blocking of high-risk activities in real-time before fraud happens. Pattern recognition learns Ahmad's normal behavior. Every blocked attempt, every alert is recorded on blockchain. Ahmad has proof of what was attempted and when.

That's the power of NextGuard ID. Let me summarize what we've shown you:

- Dashboard gives real-time visibility of all activities
- Audit Trail provides blockchain-verified access history with searchable records
- Consent Management gives granular, revocable access control
- Suspicious Activity provides AI-powered fraud detection and automatic blocking
- Real-time approval popups keep Ahmad in control, alerting him instantly when his identity is requested
- Settings give Ahmad complete control over his preferences and security

Every single request, approval, denial, and blocked activity is recorded on the Polygon blockchain - immutable, transparent, and verifiable by Ahmad anytime.

Every transaction, approval, denial, and security event is recorded on the Polygon blockchain. Users have complete control, complete transparency, and cryptographic proof of their identity usage. That's NextGuard ID."

---

## END OF FULL DEMONSTRATION SCRIPT
