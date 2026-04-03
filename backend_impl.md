# Creator OS - Complete API Specification

**Base URL:** `https://api.creatoroscm.com` (or `http://localhost:3000/api` for local)  
**Authentication:** See RBAC_impl.md file
**Response Format:** JSON

---

## Table of Contents

- [Auth Endpoints](#auth-endpoints)
- [User Endpoints](#user-endpoints)
- [Commission Endpoints](#commission-endpoints)
- [Milestone Endpoints](#milestone-endpoints)
- [Message Endpoints](#message-endpoints)
- [Payment Endpoints](#payment-endpoints)
- [Portfolio Endpoints](#portfolio-endpoints)
- [Notification Endpoints](#notification-endpoints)
- [Admin Endpoints](#admin-endpoints)

---

Create the following endpoints in the backend under /controllers, each section should be in a separate file and be ready for rbac described in RBAC_impl.md

## Auth Endpoints

**Note:** Login, signup, and password reset are handled by Keycloak. Your frontend redirects to Keycloak's login page. Only callback and logout endpoints are needed.

### POST `/api/auth/callback`

**Description:** Handle Keycloak OAuth callback (after user logs in)  
**Auth Required:** No  
**Request Body:**

```json
{
  "code": "authorization_code_from_keycloak",
  "state": "state_value"
}
```

**Response:** 200 OK

```json
{
  "access_token": "eyJhbGc...",
  "user": {
    "id": "uuid",
    "email": "artist@example.com",
    "username": "artist_name",
    "role": "ARTIST"
  }
}
```

**Service Functions:**

- Validate state parameter (CSRF protection)
- Exchange authorization code with Keycloak for JWT
- Verify JWT signature with Keycloak's public key
- Check if user exists in database
- If new user: Create user record, initialize user_preferences
- If existing user: Update last_login timestamp
- Return access token and user info

---

### POST `/api/auth/logout`

**Description:** Invalidate user session and logout from Keycloak  
**Auth Required:** Yes  
**Response:** 200 OK

```json
{
  "success": true,
  "message": "Logged out successfully",
  "keycloak_logout_url": "https://keycloak.yourdomain.com/auth/realms/creator-os/protocol/openid-connect/logout"
}
```

**Service Functions:**

- Get user ID from JWT
- Invalidate any server-side sessions
- Return Keycloak logout URL for frontend to redirect to
- Log logout event

---

## User Endpoints

### GET `/api/users/[id]`

**Description:** Get public user profile  
**Auth Required:** No  
**Response:** 200 OK

```json
{
  "id": "uuid",
  "username": "artist_name",
  "bio": "I draw cool stuff",
  "avatar_url": "https://blob.../avatar.png",
  "role": "ARTIST",
  "is_verified": true,
  "is_featured": true,
  "follower_count": 1234,
  "commission_count": 45,
  "average_rating": 4.8,
  "created_at": "2024-01-01T00:00:00Z"
}
```

**Service Functions:**

- Fetch user from database
- Get follower/commission counts
- Get average rating
- Calculate portfolio count
- Return public profile data only

---

### GET `/api/users/me`

**Description:** Get current user's profile  
**Auth Required:** Yes  
**Response:** 200 OK

```json
{
  "id": "uuid",
  "email": "artist@example.com",
  "username": "artist_name",
  "bio": "I draw cool stuff",
  "avatar_url": "...",
  "role": "ARTIST",
  "stripe_account_id": "acct_...",
  "follower_count": 1234,
  "following_count": 567,
  "commission_count": 45,
  "is_verified": true,
  "is_active": true
}
```

**Service Functions:**

- Extract user ID from JWT
- Fetch user profile
- Include sensitive data (email, stripe_account_id)
- Return complete user profile

---

### PATCH `/api/users/me`

**Description:** Update current user's profile  
**Auth Required:** Yes  
**Request Body:**

```json
{
  "bio": "Updated bio",
  "avatar_url": "https://blob.../new-avatar.png",
  "username": "new_username"
}
```

**Response:** 200 OK

```json
{
  "success": true,
  "user": { ... }
}
```

**Service Functions:**

- Validate username uniqueness if changed
- Update user in database
- Invalidate profile cache
- Log profile update
- Return updated user

---

### POST `/api/users/[id]/follow`

**Description:** Follow a user  
**Auth Required:** Yes  
**Response:** 201 Created

```json
{
  "success": true,
  "message": "Now following artist_name"
}
```

**Service Functions:**

- Get current user ID from JWT
- Validate target user exists
- Check if already following
- Insert into followers table
- Increment followed_user.follower_count
- Increment current_user.following_count
- Create notification for followed user
- Return success

---

### DELETE `/api/users/[id]/follow`

**Description:** Unfollow a user  
**Auth Required:** Yes  
**Response:** 200 OK

```json
{
  "success": true,
  "message": "Unfollowed artist_name"
}
```

**Service Functions:**

- Get current user ID from JWT
- Delete from followers table
- Decrement followed_user.follower_count
- Decrement current_user.following_count
- Delete related notifications
- Return success

---

### GET `/api/users/[id]/is-following`

**Description:** Check if current user follows target user  
**Auth Required:** Yes  
**Response:** 200 OK

```json
{
  "is_following": true
}
```

**Service Functions:**

- Get current user ID from JWT
- Query followers table
- Return boolean

---

### GET `/api/users/[id]/followers`

**Description:** List user's followers (paginated)  
**Auth Required:** No  
**Query Params:** `page=1&limit=20`  
**Response:** 200 OK

```json
{
  "followers": [
    {
      "id": "uuid",
      "username": "follower1",
      "avatar_url": "...",
      "is_verified": true
    }
  ],
  "total": 1234,
  "page": 1,
  "limit": 20
}
```

**Service Functions:**

- Get user ID from params
- Query followers table with pagination
- Join with users table for profiles
- Calculate offset
- Return paginated list

---

### GET `/api/users/[id]/following`

**Description:** List users that target user follows (paginated)  
**Auth Required:** No  
**Query Params:** `page=1&limit=20`  
**Response:** 200 OK (same structure as followers)  
**Service Functions:**

- Get user ID from params
- Query followers table (reversed) with pagination
- Join with users table
- Return paginated list

---

### POST `/api/users/[id]/block`

**Description:** Block a user  
**Auth Required:** Yes  
**Response:** 200 OK

```json
{
  "success": true,
  "message": "User blocked"
}
```

**Service Functions:**

- Get current user ID
- Create block record
- Remove existing follow relationship
- Prevent communication

---

### DELETE `/api/users/[id]/block`

**Description:** Unblock a user  
**Auth Required:** Yes  
**Response:** 200 OK

```json
{
  "success": true,
  "message": "User unblocked"
}
```

**Service Functions:**

- Get current user ID
- Delete block record
- Allow communication again

---

## Commission Endpoints

### POST `/api/commissions`

**Description:** Create new commission request  
**Auth Required:** Yes (client)  
**Request Body:**

```json
{
  "artist_id": "uuid",
  "title": "Custom character portrait",
  "description": "I want a portrait of my D&D character",
  "total_price_cents": 15000,
  "is_physical": false,
  "revision_limit": 3,
  "due_date": "2024-02-01T00:00:00Z"
}
```

**Response:** 201 Created

```json
{
  "commission": {
    "id": "uuid",
    "artist_id": "uuid",
    "client_id": "uuid",
    "title": "Custom character portrait",
    "total_price_cents": 15000,
    "status": "REQUESTED",
    "escrow_status": "HELD",
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Service Functions:**

- Get client ID from JWT
- Validate artist exists and accepts commissions
- Validate price is reasonable
- Check client is not blocked by artist
- Create commission record with status=REQUESTED
- Generate default milestones (based on template or 3-phase)
- Create initial notification for artist
- Return commission details

---

### GET `/api/commissions`

**Description:** List user's commissions (paginated)  
**Auth Required:** Yes  
**Query Params:** `page=1&limit=20&role=all&status=all`  
**Response:** 200 OK

```json
{
  "commissions": [
    {
      "id": "uuid",
      "title": "Custom character portrait",
      "artist": { "id": "uuid", "username": "artist_name" },
      "client": { "id": "uuid", "username": "client_name" },
      "total_price_cents": 15000,
      "status": "IN_PROGRESS",
      "current_milestone": "Lineart",
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 45,
  "page": 1,
  "limit": 20
}
```

**Service Functions:**

- Get user ID from JWT
- Determine if user is artist or client in commissions
- Filter by role (artist commissioned or client commissioning)
- Filter by status if provided
- Paginate results
- Include brief artist/client info
- Include current milestone info
- Return list

---

### GET `/api/commissions/[id]`

**Description:** Get commission details with full workflow  
**Auth Required:** Yes  
**Response:** 200 OK

```json
{
  "commission": {
    "id": "uuid",
    "artist": { ... },
    "client": { ... },
    "title": "Custom character portrait",
    "description": "...",
    "total_price_cents": 15000,
    "status": "IN_PROGRESS",
    "escrow_status": "HELD",
    "revision_limit": 3,
    "revisions_used": 1,
    "due_date": "2024-02-01T00:00:00Z",
    "current_milestone_id": "uuid",
    "milestones": [
      {
        "id": "uuid",
        "name": "Sketch",
        "status": "APPROVED",
        "sequence_order": 1,
        "assets": [{ "id": "uuid", "blob_url": "..." }]
      }
    ],
    "messages": [
      {
        "id": "uuid",
        "sender": { "id": "uuid", "username": "..." },
        "content": "Here's the sketch!",
        "created_at": "..."
      }
    ],
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Service Functions:**

- Get commission ID from params
- Verify user is artist or client (permission check)
- Fetch commission with relationships
- Fetch all milestones in order
- Fetch all assets per milestone
- Fetch all messages
- Calculate current milestone
- Return full commission state

---

### PATCH `/api/commissions/[id]`

**Description:** Update commission details  
**Auth Required:** Yes (artist or client)  
**Request Body:**

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "revision_limit": 4
}
```

**Response:** 200 OK

```json
{
  "success": true,
  "commission": { ... }
}
```

**Service Functions:**

- Verify user is artist or client
- Validate commission status allows editing
- Update fields
- Log change
- Return updated commission

---

### POST `/api/commissions/[id]/cancel`

**Description:** Cancel a commission  
**Auth Required:** Yes  
**Request Body:**

```json
{
  "reason": "Can't commit to timeline"
}
```

**Response:** 200 OK

```json
{
  "success": true,
  "message": "Commission cancelled"
}
```

**Service Functions:**

- Verify user is artist or client (depends on status)
- Check commission status allows cancellation
- If PAID, trigger refund via Stripe
- Update commission status to CANCELLED
- Trigger notification
- Log cancellation

---

## Milestone Endpoints

### GET `/api/commissions/[commissionId]/milestones`

**Description:** Get all milestones for a commission  
**Auth Required:** No (can be public)  
**Response:** 200 OK

```json
{
  "milestones": [
    {
      "id": "uuid",
      "name": "Sketch",
      "status": "APPROVED",
      "sequence_order": 1,
      "assets": [
        {
          "id": "uuid",
          "blob_url": "https://blob.../sketch.png",
          "is_final_version": true
        }
      ],
      "submitted_at": "2024-01-05T00:00:00Z",
      "approved_at": "2024-01-06T00:00:00Z"
    }
  ]
}
```

**Service Functions:**

- Get commission ID
- Verify user access (artist, client, or public if completed)
- Fetch milestones ordered by sequence
- Fetch assets per milestone
- Exclude non-final versions if not artist/client
- Return milestone list

---

### POST `/api/commissions/[commissionId]/milestones/[id]/submit`

**Description:** Artist submits milestone work  
**Auth Required:** Yes (artist)  
**Request Body:**

```json
{
  "message": "Here's the sketch, let me know what you think"
}
```

**Response:** 200 OK

```json
{
  "success": true,
  "milestone": {
    "id": "uuid",
    "status": "SUBMITTED",
    "submitted_at": "2024-01-05T00:00:00Z"
  }
}
```

**Service Functions:**

- Verify user is commission artist
- Verify milestone status is PENDING
- Check at least one asset exists
- Update milestone status to SUBMITTED
- Create message if provided
- Notify client
- Return updated milestone

---

### POST `/api/commissions/[commissionId]/milestones/[id]/approve`

**Description:** Client approves milestone  
**Auth Required:** Yes (client)  
**Response:** 200 OK

```json
{
  "success": true,
  "milestone": {
    "id": "uuid",
    "status": "APPROVED",
    "approved_at": "2024-01-06T00:00:00Z"
  },
  "next_milestone": { "id": "uuid", "name": "Lineart" }
}
```

**Service Functions:**

- Verify user is commission client
- Verify milestone status is SUBMITTED
- Update milestone status to APPROVED
- Update approved_at timestamp
- Get next milestone in sequence
- Update commission.current_milestone_id
- Notify artist
- If all milestones approved, update commission status to REVIEW
- Return updated milestone and next milestone

---

### POST `/api/commissions/[commissionId]/milestones/[id]/request-revision`

**Description:** Client requests revision on milestone  
**Auth Required:** Yes (client)  
**Request Body:**

```json
{
  "feedback": "The eyes look too small, can you make them bigger?",
  "revision_reason": "Eyes need adjustment"
}
```

**Response:** 201 Created

```json
{
  "revision_request": {
    "id": "uuid",
    "milestone_id": "uuid",
    "feedback": "The eyes look too small...",
    "status": "PENDING",
    "created_at": "2024-01-06T00:00:00Z"
  }
}
```

**Service Functions:**

- Verify user is commission client
- Check commission.revisions_used < revision_limit
- Create revision_request record
- Update milestone status to REVISION_REQUESTED
- Add message from client with feedback
- Increment commission.revisions_used
- Notify artist
- Return revision request

---

### POST `/api/commissions/[commissionId]/milestones/[id]/upload`

**Description:** (DEPRECATED - Use SAS token flow instead) Upload file(s) to milestone  
**Auth Required:** Yes (artist)

**New Flow (with SAS tokens):**

1. Frontend calls `POST /api/storage/sas-token` to get upload URL
2. Frontend uploads directly to Azure via SAS URL (PUT request)
3. Frontend calls `POST /api/storage/complete-upload` to confirm
4. Backend creates asset record

See **Azure Blob Storage Endpoints** section above.

**OLD Flow (kept for reference):**

This endpoint still works for backward compatibility but SAS token flow is preferred.

**Content-Type:** `multipart/form-data`  
**Request Body:**

```
file: [binary file data]
description: "Work in progress"
```

**Response:** 201 Created

```json
{
  "asset": {
    "id": "uuid",
    "milestone_id": "uuid",
    "blob_path": "commissions/uuid/milestone/uuid/sketch.png",
    "blob_url": "https://blob.../sketch.png",
    "file_size_bytes": 2048576,
    "file_type": "image/png",
    "is_final_version": false,
    "created_at": "2024-01-05T00:00:00Z"
  }
}
```

**Service Functions:**

- Verify user is commission artist
- Validate file type (image, PDF, etc.)
- Validate file size (< 50MB)
- Upload to Azure Blob Storage
- Create asset record with is_final_version=false
- Generate watermarked preview
- Update milestone asset_count
- Notify client new file uploaded
- Return asset details

---

### PATCH `/api/commissions/[commissionId]/milestones/[id]/assets/[assetId]`

**Description:** Mark asset as final version (when milestone complete)  
**Auth Required:** Yes (artist)  
**Request Body:**

```json
{
  "is_final_version": true
}
```

**Response:** 200 OK

```json
{
  "success": true,
  "asset": { ... }
}
```

**Service Functions:**

- Verify user is commission artist
- Update asset.is_final_version = true
- Generate clean (non-watermarked) download link
- Notify client final file ready
- Return updated asset

---

## Azure Blob Storage Endpoints

### POST `/api/storage/sas-token`

**Description:** Generate SAS token for direct file upload to Azure Blob Storage  
**Auth Required:** Yes  
**Request Body:**

```json
{
  "file_name": "sketch.png",
  "file_type": "image/png",
  "container": "commissions"
}
```

**Response:** 200 OK

```json
{
  "sas_url": "http://127.0.0.1:10000/devstoreaccount1/commissions/sketch.png?sv=2021-06-08&sig=...",
  "blob_path": "commissions/sketch.png",
  "expires_in": 900
}
```

**Service Functions:**

- Get user ID from JWT
- Validate file type (image, PDF only)
- Validate file size limits
- Generate blob path: `{container}/{user_id}/{timestamp}-{filename}`
- Generate SAS token with:
  - Permissions: Read, Write, Create
  - Expiration: 15 minutes
  - Scoped to specific blob
- Return full SAS URL (use 127.0.0.1 for local/dev, actual domain for prod)
- Return blob_path for database storage
- Log storage access

---

### POST `/api/storage/complete-upload`

**Description:** Confirm upload completion and move file metadata to database  
**Auth Required:** Yes  
**Request Body:**

```json
{
  "blob_path": "commissions/sketch.png",
  "milestone_id": "uuid",
  "file_size_bytes": 2048576,
  "file_type": "image/png"
}
```

**Response:** 201 Created

```json
{
  "asset": {
    "id": "uuid",
    "milestone_id": "uuid",
    "blob_path": "commissions/sketch.png",
    "blob_url": "https://yourstorage.blob.core.windows.net/commissions/sketch.png",
    "file_size_bytes": 2048576,
    "file_type": "image/png",
    "is_final_version": false,
    "created_at": "2024-01-05T00:00:00Z"
  }
}
```

**Service Functions:**

- Verify user is commission artist
- Verify blob exists in Azure Storage
- Create asset record in database with blob_path and blob_url
- Update milestone asset_count
- Generate watermarked preview if image (async job)
- Notify client that file uploaded
- Return asset details

---

### GET `/api/storage/download/[assetId]`

**Description:** Generate download link for asset (final versions only after approval)  
**Auth Required:** Yes  
**Response:** 200 OK

```json
{
  "download_url": "http://127.0.0.1:10000/devstoreaccount1/commissions/sketch.png?sv=2021-06-08&sig=..."
}
```

**Service Functions:**

- Get user ID from JWT
- Verify asset exists
- Check if user is:
  - Artist who uploaded it (always allow)
  - Client and asset.is_final_version (allow download)
  - Client and not final_version (deny, return watermarked preview instead)
- Generate read-only SAS token (expiration: 30 minutes)
- Return download URL

---

### DELETE `/api/storage/[blobPath]`

**Description:** Delete file from Azure Blob Storage  
**Auth Required:** Yes (artist)  
**Response:** 200 OK

```json
{
  "success": true,
  "message": "File deleted"
}
```

**Service Functions:**

- Verify user is commission artist
- Verify blob_path matches asset
- Delete blob from Azure Storage
- Soft delete asset record (set is_deleted = true)
- Update milestone asset_count
- Return success

---

## Message Endpoints

### POST `/api/commissions/[commissionId]/messages`

**Description:** Send message in commission chat  
**Auth Required:** Yes  
**Request Body:**

```json
{
  "content": "Looking great! Can you adjust the background?"
}
```

**Response:** 201 Created

```json
{
  "message": {
    "id": "uuid",
    "commission_id": "uuid",
    "sender": {
      "id": "uuid",
      "username": "sender_name",
      "avatar_url": "..."
    },
    "content": "Looking great! Can you adjust the background?",
    "created_at": "2024-01-05T12:34:56Z"
  }
}
```

**Service Functions:**

- Get user ID from JWT
- Verify user is artist or client in commission
- Validate message not empty
- Create message record
- Notify other party (artist or client)
- Mark notification as unread for recipient
- Return message

---

### GET `/api/commissions/[commissionId]/messages`

**Description:** Get commission chat history (paginated)  
**Auth Required:** Yes  
**Query Params:** `page=1&limit=50`  
**Response:** 200 OK

```json
{
  "messages": [
    {
      "id": "uuid",
      "sender": { "id": "uuid", "username": "...", "avatar_url": "..." },
      "content": "...",
      "created_at": "..."
    }
  ],
  "total": 237,
  "page": 1,
  "limit": 50
}
```

**Service Functions:**

- Verify user access to commission
- Fetch messages paginated, ordered by created_at DESC
- Join with user data for sender info
- Mark messages as read for current user
- Return paginated message history

---

### DELETE `/api/commissions/[commissionId]/messages/[messageId]`

**Description:** Delete own message  
**Auth Required:** Yes  
**Response:** 200 OK

```json
{
  "success": true,
  "message": "Message deleted"
}
```

**Service Functions:**

- Verify user is message sender
- Soft delete message (set is_deleted = true)
- Still count in history but show as "[deleted]"
- Return success

---

## Payment Endpoints

### POST `/api/commissions/[commissionId]/create-payment`

**Description:** Create Stripe payment session  
**Auth Required:** Yes (client)  
**Response:** 200 OK

```json
{
  "session_id": "cs_live_...",
  "checkout_url": "https://checkout.stripe.com/pay/cs_live_..."
}
```

**Service Functions:**

- Verify user is commission client
- Check commission status is REQUESTED
- Create Stripe Checkout Session with:
  - Amount from commission.total_price_cents
  - Redirect URLs (success/cancel)
  - Metadata (commission_id, artist_id, client_id)
- Save stripe_session_id temporarily
- Return checkout URL

---

### POST `/api/webhooks/stripe`

**Description:** Stripe webhook listener (payment confirmation)  
**Auth Required:** No (Stripe signature validation)  
**Stripe Event Types:**

- `checkout.session.completed`
- `charge.refunded`
- `charge.dispute.created`

**Response:** 200 OK (always, even on error)

```json
{
  "received": true
}
```

**Service Functions (for `checkout.session.completed`):**

- Validate Stripe signature
- Extract session data (commission_id, amount, customer info)
- Verify commission exists and amount matches
- Create payment record
- Update commission:
  - status = PAID
  - stripe_payment_id = session_id
  - escrow_status = HELD
- Create notification for artist
- Send confirmation email to client
- Log payment event

**Service Functions (for `charge.refunded`):**

- Find commission by stripe_charge_id
- Update payment status to REFUNDED
- Update commission status to REFUNDED
- Update escrow_status to REFUNDED
- Notify both parties
- Log refund event

**Service Functions (for `charge.dispute.created`):**

- Find commission
- Create dispute record
- Notify both parties
- Set status to IN_REVIEW
- Alert admin

---

### GET `/api/commissions/[commissionId]/payment-status`

**Description:** Get payment status  
**Auth Required:** Yes  
**Response:** 200 OK

```json
{
  "status": "SUCCEEDED",
  "amount_cents": 15000,
  "stripe_payment_id": "ch_...",
  "created_at": "2024-01-05T00:00:00Z",
  "completed_at": "2024-01-05T00:05:00Z"
}
```

**Service Functions:**

- Get commission ID
- Fetch payment record
- Return payment status

---

### POST `/api/commissions/[commissionId]/request-refund`

**Description:** Request refund (client)  
**Auth Required:** Yes (client)  
**Request Body:**

```json
{
  "reason": "Artist went inactive"
}
```

**Response:** 200 OK

```json
{
  "success": true,
  "message": "Refund requested"
}
```

**Service Functions:**

- Verify user is client
- Check commission status allows refund (not COMPLETED)
- Create dispute record
- Request refund from Stripe
- Update escrow_status to REFUNDED (pending approval)
- Notify artist (dispute created)
- Send email to both parties

---

## Portfolio Endpoints

### GET `/api/users/[userId]/portfolio`

**Description:** Get user's public portfolio  
**Auth Required:** No  
**Query Params:** `page=1&limit=12`  
**Response:** 200 OK

```json
{
  "portfolio": [
    {
      "id": "uuid",
      "title": "Character commission",
      "description": "Custom character design",
      "cover_image": "https://blob.../cover.png",
      "asset_count": 5,
      "created_at": "2024-01-01T00:00:00Z",
      "assets": [
        {
          "id": "uuid",
          "blob_url": "https://blob.../image1.png",
          "sequence_order": 1
        }
      ]
    }
  ],
  "total": 45,
  "page": 1
}
```

**Service Functions:**

- Get user ID
- Query portfolio_pieces WHERE user_id AND is_published=true
- Paginate results
- Fetch associated assets
- Only return published pieces
- Return portfolio list

---

### POST `/api/users/me/portfolio`

**Description:** Create portfolio piece  
**Auth Required:** Yes  
**Request Body:**

```json
{
  "title": "Character commission",
  "description": "A custom character design",
  "tags": "character, fantasy, digital",
  "commission_id": "uuid",
  "is_published": true
}
```

**Response:** 201 Created

```json
{
  "portfolio_piece": {
    "id": "uuid",
    "title": "Character commission",
    "user_id": "uuid",
    "is_published": true,
    "created_at": "2024-01-01T00:00:00Z"
  }
}
```

**Service Functions:**

- Get user ID from JWT
- Validate commission belongs to user (if linked)
- Create portfolio_piece record
- Increment user.portfolio_count
- Return portfolio piece

---

### POST `/api/users/me/portfolio/[pieceId]/upload`

**Description:** Upload images to portfolio piece (via SAS tokens)  
**Auth Required:** Yes

**New Flow (with SAS tokens):**

1. Frontend calls `POST /api/storage/sas-token` with `container: portfolio`
2. Frontend uploads directly to Azure via SAS URL (PUT request)
3. Frontend calls `POST /api/storage/complete-upload` with portfolio_piece_id
4. Backend creates portfolio_asset record

**Content-Type:** `multipart/form-data` (if using direct upload)  
**Request Body:**

```
files: [binary file data]
```

**Response:** 201 Created

```json
{
  "assets": [
    {
      "id": "uuid",
      "portfolio_piece_id": "uuid",
      "blob_path": "portfolio/user_id/image1.png",
      "blob_url": "https://blob.../image1.png",
      "sequence_order": 1
    }
  ]
}
```

**Service Functions:**

- Verify user owns portfolio piece
- For each file:
  - Upload to Azure Blob Storage (or via SAS token)
  - Create portfolio_asset record
  - Set sequence_order based on upload order
- Update portfolio_piece.asset_count
- Update portfolio_piece.cover_image if first
- Return created assets

---

### PATCH `/api/users/me/portfolio/[pieceId]`

**Description:** Update portfolio piece  
**Auth Required:** Yes  
**Request Body:**

```json
{
  "title": "Updated title",
  "description": "Updated description",
  "is_published": true,
  "tags": "character, fantasy"
}
```

**Response:** 200 OK

```json
{
  "success": true,
  "portfolio_piece": { ... }
}
```

**Service Functions:**

- Verify user owns portfolio piece
- Update fields
- Update portfolio_piece.updated_at
- Return updated piece

---

### DELETE `/api/users/me/portfolio/[pieceId]`

**Description:** Delete portfolio piece  
**Auth Required:** Yes  
**Response:** 200 OK

```json
{
  "success": true,
  "message": "Portfolio piece deleted"
}
```

**Service Functions:**

- Verify user owns portfolio piece
- Soft delete portfolio piece (or hard delete)
- Delete associated assets from Blob Storage
- Decrement user.portfolio_count
- Return success

---

## Notification Endpoints

### GET `/api/notifications`

**Description:** Get user's notifications (paginated)  
**Auth Required:** Yes  
**Query Params:** `page=1&limit=20&unread_only=false`  
**Response:** 200 OK

```json
{
  "notifications": [
    {
      "id": "uuid",
      "type": "COMMISSION_REQUESTED",
      "title": "New commission request",
      "message": "artist_name requested a commission",
      "related_commission_id": "uuid",
      "related_user_id": "uuid",
      "is_read": false,
      "created_at": "2024-01-05T12:34:56Z"
    }
  ],
  "total": 45,
  "page": 1,
  "unread_count": 5
}
```

**Service Functions:**

- Get user ID from JWT
- Query notifications WHERE user_id
- Filter by is_read if unread_only=true
- Paginate
- Calculate unread count
- Return notifications

---

### PATCH `/api/notifications/[id]`

**Description:** Mark notification as read  
**Auth Required:** Yes  
**Request Body:**

```json
{
  "is_read": true
}
```

**Response:** 200 OK

```json
{
  "success": true
}
```

**Service Functions:**

- Verify user owns notification
- Update is_read flag
- Return success

---

### POST `/api/notifications/mark-all-read`

**Description:** Mark all notifications as read  
**Auth Required:** Yes  
**Response:** 200 OK

```json
{
  "success": true,
  "updated": 12
}
```

**Service Functions:**

- Get user ID
- Update all notifications WHERE is_read=false
- Return count of updated rows

---

## Admin Endpoints

### GET `/api/admin/dashboard`

**Description:** Admin dashboard statistics  
**Auth Required:** Yes (ADMIN role)  
**Response:** 200 OK

```json
{
  "stats": {
    "total_users": 5234,
    "total_artists": 2341,
    "total_clients": 2893,
    "total_commissions": 12456,
    "completed_commissions": 11234,
    "total_revenue_cents": 1234567890,
    "active_disputes": 3
  }
}
```

**Service Functions:**

- Verify user is ADMIN
- Calculate user counts by role
- Count commissions by status
- Sum total revenue from payments
- Count open disputes
- Return statistics

---

### GET `/api/admin/users`

**Description:** List all users (paginated)  
**Auth Required:** Yes (ADMIN)  
**Query Params:** `page=1&limit=50&role=all&is_verified=all`  
**Response:** 200 OK

```json
{
  "users": [
    {
      "id": "uuid",
      "email": "artist@example.com",
      "username": "artist_name",
      "role": "ARTIST",
      "is_verified": true,
      "is_active": true,
      "commission_count": 45,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "total": 5234,
  "page": 1
}
```

**Service Functions:**

- Verify user is ADMIN
- Query users with filters
- Paginate
- Return user list with stats

---

### POST `/api/admin/users/[id]/verify`

**Description:** Verify an artist account  
**Auth Required:** Yes (ADMIN)  
**Response:** 200 OK

```json
{
  "success": true,
  "message": "Artist verified"
}
```

**Service Functions:**

- Verify user is ADMIN
- Update user.is_verified = true
- Create notification for artist
- Send verification email
- Log action

---

### POST `/api/admin/users/[id]/suspend`

**Description:** Suspend user account  
**Auth Required:** Yes (ADMIN)  
**Request Body:**

```json
{
  "reason": "Violation of terms of service"
}
```

**Response:** 200 OK

```json
{
  "success": true
}
```

**Service Functions:**

- Verify user is ADMIN
- Update user.is_active = false
- Invalidate all sessions
- Create log entry
- Send suspension email

---

### GET `/api/admin/disputes`

**Description:** List all disputes (paginated)  
**Auth Required:** Yes (ADMIN)  
**Query Params:** `page=1&limit=20&status=all`  
**Response:** 200 OK

```json
{
  "disputes": [
    {
      "id": "uuid",
      "commission_id": "uuid",
      "initiated_by": { "id": "uuid", "username": "..." },
      "reason": "Non-payment",
      "status": "OPEN",
      "created_at": "2024-01-05T00:00:00Z"
    }
  ],
  "total": 12,
  "page": 1
}
```

**Service Functions:**

- Verify user is ADMIN
- Query disputes with filters
- Paginate
- Return dispute list

---

### POST `/api/admin/disputes/[id]/resolve`

**Description:** Resolve a dispute  
**Auth Required:** Yes (ADMIN)  
**Request Body:**

```json
{
  "resolution": "Refund issued to client",
  "resolution_type": "REFUNDED"
}
```

**Response:** 200 OK

```json
{
  "success": true
}
```

**Service Functions:**

- Verify user is ADMIN
- Update dispute.status = RESOLVED
- Update dispute.resolution
- Update dispute.resolved_by
- Update linked commission status
- Process refund if needed
- Notify both parties
- Log resolution

---

## Error Response Format

All endpoints return errors in this format:

```json
{
  "error": "Validation failed",
  "status": 400,
  "message": "Email is required",
  "details": [
    {
      "field": "email",
      "error": "Email is required"
    }
  ]
}
```

**Common HTTP Status Codes:**

- `200` — OK
- `201` — Created
- `400` — Bad Request (validation error)
- `401` — Unauthorized (missing/invalid auth)
- `403` — Forbidden (access denied)
- `404` — Not Found
- `409` — Conflict (duplicate email, etc.)
- `422` — Unprocessable Entity (business logic error)
- `500` — Internal Server Error

---

## Rate Limiting

All endpoints are rate limited:

- **Authenticated requests:** 100 requests/minute per user
- **Unauthenticated requests:** 20 requests/minute per IP
- **Payment webhooks:** Unlimited (IP whitelist)
- **Admin endpoints:** 50 requests/minute

Rate limit headers:

```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1704067200
```

---

## Pagination

All paginated endpoints follow this pattern:

**Query params:**

- `page` — Starting from 1 (default: 1)
- `limit` — Results per page (default: 20, max: 100)

**Response:**

```json
{
  "data": [ ... ],
  "total": 1234,
  "page": 1,
  "limit": 20,
  "pages": 62
}
```

---

## Testing Endpoints Locally

```bash
# Login (get token)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'

# Get current user (with token)
curl -X GET http://localhost:3000/api/users/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Create commission
curl -X POST http://localhost:3000/api/commissions \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"artist_id":"...","title":"...","total_price_cents":15000}'
```

---

## Summary

**Total Endpoints:** 60+

| Category      | Count |
| ------------- | ----- |
| Auth          | 6     |
| Users         | 11    |
| Commissions   | 4     |
| Milestones    | 4     |
| Messages      | 3     |
| Payments      | 3     |
| Portfolio     | 4     |
| Notifications | 3     |
| Admin         | 6     |

**Start with Phase 1:**

- Auth endpoints (login, signup)
- User endpoints (profile, follow)
- Simple GET endpoints

**Then add Phase 2:**

- Commission endpoints
- Milestone endpoints
- Message endpoints

**Then add Phase 3:**

- Payment endpoints
- Webhook handling

**Then add Phase 4:**

- Portfolio endpoints

**Then add Phase 5:**

- Notification endpoints
- Admin endpoints
