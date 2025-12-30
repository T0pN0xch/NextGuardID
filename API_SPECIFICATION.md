# NextGuard ID - API Integration Specification

## Overview

This document outlines the API endpoints needed to connect NextGuard ID with real backend services, healthcare systems, and blockchain infrastructure.

---

## 1. MyKad Usage Confirmation Endpoints

### 1.1 Get Pending Confirmation Requests

**Endpoint:** `GET /api/mykad/confirmation-requests`

**Description:** Retrieve all pending MyKad usage confirmation requests for the authenticated user.

**Request:**
```http
GET /api/mykad/confirmation-requests
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": [
    {
      "id": "req_1234567890",
      "institution": {
        "id": "h1",
        "name": "Kuala Lumpur Hospital",
        "type": "hospital",
        "location": "Kuala Lumpur, Malaysia",
        "contactNumber": "+60-3-2615 5555",
        "isVerified": true
      },
      "action": "registration",
      "purpose": "Patient Registration - New Account Creation",
      "timestamp": "2024-12-11T14:30:00Z",
      "location": "Kuala Lumpur, Malaysia",
      "expiresIn": 120,
      "expiresAt": "2024-12-11T14:32:00Z"
    }
  ],
  "count": 1
}
```

**Error Response (401 Unauthorized):**
```json
{
  "status": "error",
  "error": "Authentication required",
  "code": "AUTH_REQUIRED"
}
```

---

### 1.2 Approve MyKad Usage Request

**Endpoint:** `POST /api/mykad/confirmation-requests/{requestId}/approve`

**Description:** Approve a MyKad usage request and record it on the blockchain.

**Request:**
```http
POST /api/mykad/confirmation-requests/req_1234567890/approve
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "biometricVerification": "fingerprint_hash_123abc",
  "userConfirmation": "confirmed"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "requestId": "req_1234567890",
    "approved": true,
    "timestamp": "2024-12-11T14:30:45Z",
    "blockchainHash": "0xabcd1234efgh5678ijkl9012mnop3456",
    "blockNumber": 19245678,
    "transactionId": "0x5678efgh1234ijkl9012mnop3456abcd"
  },
  "message": "MyKad usage approved and recorded on blockchain"
}
```

**Error Response (400 Bad Request):**
```json
{
  "status": "error",
  "error": "Request expired or already processed",
  "code": "INVALID_REQUEST",
  "details": {
    "requestId": "req_1234567890",
    "reason": "EXPIRED"
  }
}
```

---

### 1.3 Deny MyKad Usage Request

**Endpoint:** `POST /api/mykad/confirmation-requests/{requestId}/deny`

**Description:** Deny a MyKad usage request and record the denial.

**Request:**
```http
POST /api/mykad/confirmation-requests/req_1234567890/deny
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "reason": "Suspicious activity",
  "reportAsSpam": false
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "requestId": "req_1234567890",
    "denied": true,
    "timestamp": "2024-12-11T14:30:55Z",
    "blockchainHash": "0xijkl9012mnop3456abcd5678efgh1234",
    "blockNumber": 19245679,
    "institutionNotified": true
  },
  "message": "MyKad usage request denied"
}
```

---

## 2. MyKad Audit Trail Endpoints

### 2.1 Get Complete Audit Trail

**Endpoint:** `GET /api/mykad/audit-trail`

**Description:** Retrieve the complete chronological audit trail of MyKad usage for the authenticated user.

**Request:**
```http
GET /api/mykad/audit-trail?limit=50&offset=0&sortBy=date&order=desc
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Query Parameters:**
- `limit` (integer, optional): Number of events to return (default: 50, max: 500)
- `offset` (integer, optional): Pagination offset (default: 0)
- `sortBy` (string, optional): Sort field: `date`, `institution`, `status` (default: `date`)
- `order` (string, optional): `asc` or `desc` (default: `desc`)
- `status` (string, optional): Filter by status: `approved`, `denied`, `pending`, `emergency_used`
- `action` (string, optional): Filter by action type
- `startDate` (ISO8601, optional): Filter events after this date
- `endDate` (ISO8601, optional): Filter events before this date

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "events": [
      {
        "id": "audit1",
        "timestamp": "2024-12-11T14:30:00Z",
        "institution": {
          "id": "h1",
          "name": "Kuala Lumpur Hospital",
          "type": "hospital",
          "location": "Kuala Lumpur, Malaysia",
          "registeredDate": "2023-01-15T00:00:00Z",
          "isVerified": true
        },
        "action": "registration",
        "purpose": "Patient Registration - New Account Creation",
        "status": "approved",
        "blockchainHash": "0xabcd1234efgh5678ijkl9012mnop3456",
        "blockNumber": 19245678,
        "verified": true,
        "location": "Kuala Lumpur, Malaysia",
        "transactionId": "0x5678efgh1234ijkl9012mnop3456abcd",
        "gasUsed": "45000"
      }
    ],
    "total": 10,
    "limit": 50,
    "offset": 0,
    "hasMore": false
  }
}
```

---

### 2.2 Get Single Audit Event

**Endpoint:** `GET /api/mykad/audit-trail/{eventId}`

**Description:** Retrieve detailed information about a specific audit event.

**Request:**
```http
GET /api/mykad/audit-trail/audit1
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": "audit1",
    "timestamp": "2024-12-11T14:30:00Z",
    "institution": {
      "id": "h1",
      "name": "Kuala Lumpur Hospital",
      "type": "hospital",
      "location": "Kuala Lumpur, Malaysia",
      "contactNumber": "+60-3-2615 5555",
      "registeredDate": "2023-01-15T00:00:00Z",
      "isVerified": true
    },
    "action": "registration",
    "purpose": "Patient Registration - New Account Creation",
    "status": "approved",
    "blockchainHash": "0xabcd1234efgh5678ijkl9012mnop3456",
    "blockNumber": 19245678,
    "verified": true,
    "location": "Kuala Lumpur, Malaysia",
    "ipAddress": "203.123.45.67",
    "userAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
    "transactionId": "0x5678efgh1234ijkl9012mnop3456abcd",
    "gasUsed": "45000",
    "gasPrice": "20",
    "blockTimestamp": "2024-12-11T14:30:15Z",
    "confirmations": 125,
    "expiresAt": "2024-12-25T14:30:00Z"
  }
}
```

---

### 2.3 Get Audit Trail Statistics

**Endpoint:** `GET /api/mykad/audit-trail/stats`

**Description:** Get statistical summary of MyKad usage.

**Request:**
```http
GET /api/mykad/audit-trail/stats?period=30d
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Query Parameters:**
- `period` (string, optional): `7d`, `30d`, `90d`, `1y`, `all` (default: `30d`)

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "period": "30d",
    "totalEvents": 10,
    "approved": 8,
    "denied": 1,
    "pending": 0,
    "emergencyUsed": 1,
    "institutions": 5,
    "topInstitutions": [
      {
        "id": "h1",
        "name": "Kuala Lumpur Hospital",
        "accesses": 3,
        "status": "approved"
      }
    ],
    "actionBreakdown": {
      "registration": 2,
      "record_access": 4,
      "verification": 2,
      "consent_approval": 1,
      "emergency_access": 1
    },
    "blockedAttempts": 1,
    "suspiciousActivities": 0
  }
}
```

---

### 2.4 Verify Blockchain Hash

**Endpoint:** `POST /api/mykad/verify-blockchain`

**Description:** Verify that a blockchain hash is valid and has not been tampered with.

**Request:**
```http
POST /api/mykad/verify-blockchain
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "blockchainHash": "0xabcd1234efgh5678ijkl9012mnop3456",
  "blockNumber": 19245678,
  "eventId": "audit1"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "verified": true,
    "valid": true,
    "hash": "0xabcd1234efgh5678ijkl9012mnop3456",
    "blockNumber": 19245678,
    "blockTimestamp": "2024-12-11T14:30:15Z",
    "confirmations": 125,
    "network": "polygon",
    "contractAddress": "0xNEXTGUARD_ID_CONTRACT",
    "eventData": {
      "user": "0x...masked_address",
      "institution": "Kuala Lumpur Hospital",
      "action": "registration",
      "timestamp": "2024-12-11T14:30:00Z",
      "status": "approved"
    }
  }
}
```

---

## 3. Healthcare Institution Endpoints

### 3.1 Get Registered Healthcare Institutions

**Endpoint:** `GET /api/healthcare/institutions`

**Description:** Retrieve list of registered and verified healthcare institutions.

**Request:**
```http
GET /api/healthcare/institutions?type=hospital&verified=true&limit=50
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Query Parameters:**
- `type` (string, optional): `hospital`, `clinic`, `specialist`, `pharmacy`, `lab`
- `verified` (boolean, optional): Filter by verification status
- `limit` (integer, optional): Number of results (default: 50)
- `offset` (integer, optional): Pagination offset

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "institutions": [
      {
        "id": "h1",
        "name": "Kuala Lumpur Hospital",
        "type": "hospital",
        "location": "Kuala Lumpur, Malaysia",
        "coordinates": {
          "lat": 3.1494,
          "lng": 101.7029
        },
        "contactNumber": "+60-3-2615 5555",
        "email": "info@klhospital.gov.my",
        "website": "https://klhospital.gov.my",
        "registeredDate": "2023-01-15T00:00:00Z",
        "isVerified": true,
        "verificationDate": "2023-01-20T00:00:00Z",
        "rating": 4.8,
        "totalAccesses": 245,
        "denialRate": 0.02
      }
    ],
    "total": 47,
    "limit": 50,
    "offset": 0
  }
}
```

---

### 3.2 Get Institution Details

**Endpoint:** `GET /api/healthcare/institutions/{institutionId}`

**Description:** Get detailed information about a specific healthcare institution.

**Request:**
```http
GET /api/healthcare/institutions/h1
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": "h1",
    "name": "Kuala Lumpur Hospital",
    "type": "hospital",
    "location": "Kuala Lumpur, Malaysia",
    "address": "Jln Pahang, 50000 Kuala Lumpur",
    "coordinates": {
      "lat": 3.1494,
      "lng": 101.7029
    },
    "contactNumber": "+60-3-2615 5555",
    "email": "info@klhospital.gov.my",
    "website": "https://klhospital.gov.my",
    "registeredDate": "2023-01-15T00:00:00Z",
    "isVerified": true,
    "verificationDate": "2023-01-20T00:00:00Z",
    "verificationStatus": "APPROVED",
    "rating": 4.8,
    "totalAccesses": 245,
    "denialRate": 0.02,
    "recentIncidents": 0,
    "certifications": [
      "ISO 27001",
      "HIPAA Compliant",
      "Malaysia Healthcare Quality"
    ],
    "departments": [
      "Emergency",
      "Cardiology",
      "Neurology",
      "Pediatrics"
    ]
  }
}
```

---

## 4. User Profile & MyKad Endpoints

### 4.1 Get MyKad Information

**Endpoint:** `GET /api/user/mykad`

**Description:** Retrieve authenticated user's MyKad information (name, IC number masked, photo).

**Request:**
```http
GET /api/user/mykad
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "fullName": "Ahmad bin Abdullah",
    "icNumber": "XXXXXX-XX-1234",
    "dateOfBirth": "1990-05-15",
    "gender": "Male",
    "nationality": "Malaysian",
    "state": "Kuala Lumpur",
    "photoUrl": "https://api.example.com/photos/user-12345.jpg",
    "status": "ACTIVE",
    "expiryDate": "2030-05-15",
    "registrationDate": "2023-01-01T00:00:00Z",
    "blockchainAddress": "0x...encrypted_address"
  }
}
```

---

### 4.2 Get MyKad Usage Consent

**Endpoint:** `GET /api/user/mykad/consent`

**Description:** Get current MyKad usage consent status and preferences.

**Request:**
```http
GET /api/user/mykad/consent
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "requireConfirmation": true,
    "confirmationTimeout": 120,
    "allowEmergencyAccess": true,
    "notificationPreference": "all",
    "biometricVerification": true,
    "preApprovedInstitutions": [],
    "blockedInstitutions": [],
    "consentHistory": {
      "lastUpdated": "2024-12-01T10:00:00Z",
      "totalApprovals": 15,
      "totalDenials": 2
    }
  }
}
```

---

### 4.3 Update MyKad Consent Settings

**Endpoint:** `PUT /api/user/mykad/consent`

**Description:** Update MyKad usage consent preferences.

**Request:**
```http
PUT /api/user/mykad/consent
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "requireConfirmation": true,
  "confirmationTimeout": 180,
  "allowEmergencyAccess": true,
  "notificationPreference": "important_only",
  "biometricVerification": true,
  "blockedInstitutions": ["h99"]
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "updated": true,
    "timestamp": "2024-12-11T15:00:00Z",
    "settings": {
      "requireConfirmation": true,
      "confirmationTimeout": 180,
      "allowEmergencyAccess": true,
      "notificationPreference": "important_only",
      "biometricVerification": true,
      "blockedInstitutions": ["h99"]
    }
  }
}
```

---

## 5. Notification Endpoints

### 5.1 Send Push Notification

**Endpoint:** `POST /api/notifications/push`

**Internal Use - Healthcare System to NextGuard**

**Request:**
```http
POST /api/notifications/push
X-API-Key: {hospital_api_key}
Content-Type: application/json

{
  "userId": "user_12345",
  "type": "mykad_usage_request",
  "title": "MyKad Access Request",
  "body": "Kuala Lumpur Hospital requests access to your MyKad",
  "data": {
    "requestId": "req_1234567890",
    "institutionId": "h1",
    "action": "registration"
  },
  "priority": "high",
  "ttl": 120
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "notificationId": "notif_abc123",
  "delivered": true,
  "timestamp": "2024-12-11T14:30:00Z"
}
```

---

### 5.2 Get Notification History

**Endpoint:** `GET /api/notifications`

**Description:** Get notification history for the authenticated user.

**Request:**
```http
GET /api/notifications?limit=20&read=false
Authorization: Bearer {jwt_token}
Content-Type: application/json
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "notifications": [
      {
        "id": "notif_123",
        "type": "mykad_usage_request",
        "title": "MyKad Access Request",
        "body": "Kuala Lumpur Hospital requests access to your MyKad",
        "timestamp": "2024-12-11T14:30:00Z",
        "read": false,
        "data": {
          "requestId": "req_1234567890"
        }
      }
    ],
    "total": 5,
    "unread": 2
  }
}
```

---

## 6. Authentication Endpoints

### 6.1 Login with MyKad

**Endpoint:** `POST /api/auth/login-mykad`

**Description:** Authenticate user with MyKad and BioSmart system.

**Request:**
```http
POST /api/auth/login-mykad
Content-Type: application/json

{
  "icNumber": "123456-12-1234",
  "biometricToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "deviceId": "device_abc123",
  "timestamp": "2024-12-11T14:30:00Z"
}
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "id": "user_12345",
      "fullName": "Ahmad bin Abdullah",
      "icNumber": "XXXXXX-XX-1234"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expiresIn": 3600,
    "lastLogin": "2024-12-11T14:30:00Z"
  }
}
```

---

## 7. Error Handling

### Standard Error Response Format

All error responses follow this format:

```json
{
  "status": "error",
  "error": "Descriptive error message",
  "code": "ERROR_CODE",
  "timestamp": "2024-12-11T14:30:00Z",
  "details": {
    // Additional context
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `AUTH_REQUIRED` | 401 | Authentication required |
| `INVALID_TOKEN` | 401 | JWT token is invalid or expired |
| `FORBIDDEN` | 403 | User does not have permission |
| `NOT_FOUND` | 404 | Resource not found |
| `INVALID_REQUEST` | 400 | Request validation failed |
| `EXPIRED_REQUEST` | 400 | Request has expired |
| `DUPLICATE_REQUEST` | 409 | Resource already exists |
| `RATE_LIMIT` | 429 | Rate limit exceeded |
| `INTERNAL_ERROR` | 500 | Server error |

---

## 8. Rate Limiting

All endpoints have rate limits:

```
- Authenticated Requests: 1000 requests/hour
- Public Endpoints: 100 requests/hour
- Critical Endpoints (approval/denial): 50 requests/hour
```

Rate limit headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1702318200
```

---

## 9. Security Requirements

### Headers Required
```http
Authorization: Bearer {jwt_token}
X-Client-Version: 1.0.0
X-Request-ID: {unique_request_id}
Content-Type: application/json
```

### HTTPS Only
All endpoints must use HTTPS. HTTP requests will be rejected.

### Certificate Pinning
For mobile applications, implement certificate pinning.

### Request Signing (Optional)
For healthcare system requests, implement HMAC-SHA256 signing.

---

## 10. Webhook Events

Healthcare systems can subscribe to webhook events:

```http
POST {webhook_url}
X-Signature: sha256=...
Content-Type: application/json

{
  "event": "mykad_approval",
  "timestamp": "2024-12-11T14:30:00Z",
  "data": {
    "requestId": "req_1234567890",
    "userId": "user_12345",
    "institutionId": "h1",
    "blockchainHash": "0x..."
  }
}
```

---

**NextGuard ID - API Specification v1.0**

For integration support, contact: `api-support@nextguard-id.gov.my`
