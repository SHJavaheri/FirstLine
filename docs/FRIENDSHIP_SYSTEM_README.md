# Friendship & Trust Recommendation System

## Overview

The FirstLine platform now includes a comprehensive consumer friendship and trust recommendation system. This feature allows consumer accounts to connect with each other and see which professionals their friends have used and rated, helping them make more informed decisions when selecting lawyers, accountants, and other professionals.

## Key Features

- **Friend Requests**: Send, accept, decline, and cancel friend requests
- **Friendship Management**: View friends list, remove friends, find mutual friends
- **Trust Recommendations**: See which friends have used a professional and their ratings
- **Smart Search Ranking**: Professionals are ranked higher if trusted by your network
- **Rate Limiting**: Prevents spam with 50 friend requests per 24-hour window
- **Privacy Controls**: Profile visibility settings (PUBLIC, FRIENDS_ONLY, PRIVATE)

## Database Schema

### New Models

#### FriendRequest
Tracks all friend request states between users.
- `id`: Unique identifier
- `senderId`: User who sent the request
- `receiverId`: User who received the request
- `status`: PENDING | ACCEPTED | DECLINED | CANCELLED
- `createdAt`, `updatedAt`: Timestamps

**Indexes**: `[senderId, receiverId]` (unique), `[receiverId, status]`, `[senderId]`, `[createdAt]`

#### Friendship
Bidirectional friendship storage for O(1) lookups.
- `id`: Unique identifier
- `userId`: First user in friendship
- `friendId`: Second user in friendship
- `createdAt`: When friendship was established

**Indexes**: `[userId, friendId]` (unique), `[userId]`, `[friendId]`, `[createdAt]`

**Note**: Friendships are stored bidirectionally. When A and B become friends, two records are created: (A→B) and (B→A).

#### FriendRequestRateLimit
Prevents abuse by limiting friend request frequency.
- `accountId`: User account
- `requestCount`: Number of requests in current window
- `windowStart`: Start of current 24-hour window

**Limits**: 50 requests per 24 hours

### Updated Models

#### Account
New fields added:
- `allowFriendRequests`: Boolean (default: true)
- `profileVisibility`: PUBLIC | FRIENDS_ONLY | PRIVATE (default: PUBLIC)

New relations:
- `sentFriendRequests`: Friend requests sent by this user
- `receivedFriendRequests`: Friend requests received by this user
- `friendships`: Friendships where this user is userId
- `friendOf`: Friendships where this user is friendId
- `friendRequestRateLimit`: Rate limit tracking

## API Endpoints

### Friend Requests

#### Send Friend Request
```http
POST /api/friends/requests
Content-Type: application/json

{
  "receiverId": "user_id_here"
}
```

**Response**:
```json
{
  "success": true,
  "friendRequest": {
    "id": "request_id",
    "senderId": "sender_id",
    "receiverId": "receiver_id",
    "status": "PENDING",
    "sender": { ... },
    "receiver": { ... }
  }
}
```

**Errors**:
- 403: Only consumers can send friend requests
- 400: Cannot send to yourself, already friends, pending request exists, rate limit exceeded

#### Get Friend Requests
```http
GET /api/friends/requests?type=sent|received&status=PENDING
```

**Query Parameters**:
- `type`: "sent" or "received" (default: "received")
- `status`: "PENDING" | "ACCEPTED" | "DECLINED" | "CANCELLED" (optional)

**Response**:
```json
{
  "requests": [
    {
      "id": "request_id",
      "status": "PENDING",
      "sender": { "id": "...", "firstName": "...", ... },
      "receiver": { "id": "...", "firstName": "...", ... },
      "createdAt": "2026-03-01T..."
    }
  ]
}
```

#### Accept/Decline/Cancel Friend Request
```http
POST /api/friends/requests/[requestId]
Content-Type: application/json

{
  "action": "accept" | "decline" | "cancel"
}
```

**Actions**:
- `accept`: Receiver accepts the request (creates bidirectional friendship)
- `decline`: Receiver declines the request
- `cancel`: Sender cancels their pending request

**Response**:
```json
{
  "success": true,
  "result": { ... }
}
```

### Friendship Management

#### Get Friends List
```http
GET /api/friends?search=john&limit=50&offset=0
```

**Query Parameters**:
- `search`: Filter by name or email (optional)
- `limit`: Number of results (default: 50)
- `offset`: Pagination offset (default: 0)

**Response**:
```json
{
  "friends": [
    {
      "id": "friend_id",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john@example.com",
      "profilePhotoUrl": "...",
      "bio": "...",
      "locationCity": "...",
      "locationState": "...",
      "jobTitle": "...",
      "createdAt": "..."
    }
  ]
}
```

#### Get Friend Details
```http
GET /api/friends/[friendId]
```

**Response**: Friend account details (same structure as friends list item)

#### Remove Friend
```http
DELETE /api/friends/[friendId]
```

**Response**:
```json
{
  "success": true
}
```

**Note**: This deletes both directions of the friendship.

#### Get Mutual Friends
```http
GET /api/friends/mutual/[userId]
```

**Response**:
```json
{
  "mutualFriends": [
    {
      "id": "...",
      "firstName": "...",
      "lastName": "...",
      ...
    }
  ]
}
```

### Trust & Recommendations

#### Get Friend Trust Data for Professional
```http
GET /api/professionals/[professionalId]/friend-trust
```

**Response**:
```json
{
  "trustData": {
    "friendsWhoUsed": [
      {
        "friendId": "friend_id",
        "friendName": "Jane Smith",
        "friendPhoto": "...",
        "rating": 5,
        "comment": "Excellent lawyer!",
        "ratedAt": "2026-02-15T..."
      }
    ],
    "averageFriendRating": 4.7,
    "friendCount": 3,
    "trustScore": 4.65
  }
}
```

#### Enhanced Professional Search
```http
GET /api/lawyers?includeTrust=true&sortBy=friendTrust&q=tax&location=NYC
```

**Query Parameters**:
- `includeTrust`: "true" to include friend trust data (requires consumer login)
- `sortBy`: "rating" | "friendTrust" | "price" (default: "rating")
- Standard search filters: `q`, `specialization`, `location`, `minRate`, `maxRate`, `minRating`

**Response**:
```json
{
  "lawyers": [
    {
      "id": "...",
      "name": "...",
      "profession": "Lawyer",
      "rating": 4.8,
      "friendTrustData": {
        "friendCount": 3,
        "averageFriendRating": 4.7,
        "trustScore": 4.74,
        "trustedByNetwork": true
      },
      ...
    }
  ]
}
```

## Trust Score Algorithm

The trust score combines the professional's overall rating with ratings from your friends:

```typescript
function calculateTrustScore(
  baseRating: number,
  friendAvgRating: number,
  friendRatingCount: number
): number {
  if (friendRatingCount === 0) {
    return baseRating;
  }

  // Friend ratings weighted up to 80% based on count
  const friendWeight = Math.min(friendRatingCount * 0.2, 0.8);
  const baseWeight = 1 - friendWeight;

  return (baseRating * baseWeight) + (friendAvgRating * friendWeight);
}
```

**Examples**:
- 0 friends rated: Trust score = base rating (5.0)
- 1 friend rated 5.0: Trust score = 0.8 × 5.0 + 0.2 × 5.0 = 5.0
- 3 friends rated 4.5: Trust score = 0.4 × 4.8 + 0.6 × 4.5 = 4.62
- 5+ friends rated 4.0: Trust score = 0.2 × 4.8 + 0.8 × 4.0 = 4.16

## Search Ranking Tiers

Professionals are ranked in priority tiers when `sortBy=friendTrust`:

1. **Tier 1** (Highest): 3+ friends used, avg friend rating ≥ 4.0
2. **Tier 2**: 1-2 friends used, avg friend rating ≥ 3.5
3. **Tier 3**: High overall rating (≥ 4.5), no friend data
4. **Tier 4**: All others

Within each tier, professionals are sorted by:
- Trust score (descending)
- Number of friend ratings (descending)
- Overall rating (descending)
- Price (ascending, if `sortBy=price`)

## Security & Rate Limiting

### Rate Limits

**Friend Requests**:
- 50 requests per 24-hour rolling window per user
- Tracked in `FriendRequestRateLimit` table
- Window resets automatically after 24 hours

**API Rate Limits** (recommended for production):
- 100 requests/minute for friend endpoints
- 1000 requests/minute for search endpoints

### Validation Rules

**Friend Request Validation**:
1. Sender and receiver must both be CONSUMER accounts
2. Cannot send request to yourself
3. Cannot send if already friends
4. Cannot send if pending request exists (either direction)
5. Receiver must have `allowFriendRequests = true`
6. Neither account can be suspended

**Authorization**:
- All friend endpoints require authenticated CONSUMER user
- Users can only manage their own friend requests
- Only request receiver can accept/decline
- Only request sender can cancel

### Privacy Controls

**Profile Visibility**:
- `PUBLIC`: Anyone can see profile, send friend requests
- `FRIENDS_ONLY`: Only friends see full profile
- `PRIVATE`: Profile hidden, friend requests disabled

**Rating Visibility**:
- Friends can see each other's ratings on professionals
- Non-friends only see aggregate ratings
- Individual ratings are never exposed to non-friends

## Edge Cases Handled

### Suspended Accounts
- Cannot send/receive new friend requests
- Existing friendships remain but are "inactive"
- Don't appear in friend searches
- Their ratings still count (historical data integrity)

### Deleted Accounts
- Cascade delete: FriendRequests, Friendships, RateLimits
- Ratings remain (anonymized as "Former User")
- Trust scores recalculate without deleted user's ratings

### Professional Accounts
- Cannot send/receive friend requests (403 error)
- Not included in friendship graph
- Can still be rated by consumers

### Duplicate Prevention
- Unique constraint on `[senderId, receiverId]` in FriendRequest
- Unique constraint on `[userId, friendId]` in Friendship
- API validates no pending request exists before creating new one

## Migration Instructions

### 1. Run Database Migration

```bash
cd frontend
npx prisma migrate dev --name add_friendship_system
```

This will:
- Create FriendRequest, Friendship, FriendRequestRateLimit tables
- Add new enums (FriendRequestStatus, ProfileVisibility)
- Update Account table with new fields and relations
- Create all necessary indexes

### 2. Generate Prisma Client

```bash
npx prisma generate
```

This regenerates the Prisma client with the new models and types.

### 3. Verify Migration

Check that all tables were created:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('FriendRequest', 'Friendship', 'FriendRequestRateLimit');
```

### 4. Test Endpoints

Use the provided API endpoints to test:
1. Send a friend request
2. Accept the request
3. Search for professionals with trust data
4. Remove a friend

## TypeScript Types

All types are exported from `@/types`:

```typescript
import type {
  FriendRequest,
  FriendRequestStatus,
  Friend,
  FriendTrustData,
  LawyerWithTrust,
  ProfileVisibility,
} from "@/types";
```

## Repository Functions

### Friend Repository (`@/backend/repositories/friend-repository`)

```typescript
// Friend Requests
sendFriendRequest(senderId: string, receiverId: string)
acceptFriendRequest(requestId: string, userId: string)
declineFriendRequest(requestId: string, userId: string)
cancelFriendRequest(requestId: string, userId: string)
getFriendRequests(userId: string, type: "sent" | "received", status?: FriendRequestStatus)

// Friendships
getFriends(userId: string, search?: string, limit?: number, offset?: number)
getFriendById(userId: string, friendId: string)
removeFriend(userId: string, friendId: string)
isFriend(userId: string, friendId: string): Promise<boolean>
getMutualFriends(userId: string, otherUserId: string)
getFriendIds(userId: string): Promise<string[]>
```

### Friend Trust Repository (`@/backend/repositories/friend-trust-repository`)

```typescript
getFriendTrustDataForProfessional(userId: string, professionalAccountId: string): Promise<FriendTrustData>
getProfessionalsWithFriendTrust(userId: string, professionalIds: string[]): Promise<Map<...>>
calculateTrustScore(baseRating: number, friendAvgRating: number, friendRatingCount: number): number
getTrustTier(friendCount: number, averageFriendRating: number): TrustTier
sortProfessionalsByTrust<T>(professionals: T[], trustData: Map<...>, sortBy: "rating" | "friendTrust" | "price"): T[]
```

### Enhanced Lawyer Repository (`@/backend/repositories/lawyer-repository`)

```typescript
listProfessionalProfilesWithTrust(
  filters: LawyerSearchFilters,
  userId?: string,
  sortBy: "rating" | "friendTrust" | "price" = "rating"
)
```

## Frontend Integration Examples

### Search with Trust Data

```typescript
// Fetch lawyers with friend trust data
const response = await fetch('/api/lawyers?includeTrust=true&sortBy=friendTrust&q=tax');
const { lawyers } = await response.json();

// Display trust indicators
lawyers.forEach(lawyer => {
  if (lawyer.friendTrustData.trustedByNetwork) {
    console.log(`✓ Trusted by ${lawyer.friendTrustData.friendCount} friends`);
    console.log(`Average friend rating: ${lawyer.friendTrustData.averageFriendRating}`);
  }
});
```

### Send Friend Request

```typescript
const response = await fetch('/api/friends/requests', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ receiverId: 'user_123' })
});

if (response.ok) {
  const { friendRequest } = await response.json();
  console.log('Friend request sent!', friendRequest);
}
```

### Accept Friend Request

```typescript
const response = await fetch(`/api/friends/requests/${requestId}`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ action: 'accept' })
});

if (response.ok) {
  console.log('You are now friends!');
}
```

## Performance Considerations

### Database Queries
- All friendship lookups use indexed queries (O(1) or O(log n))
- Friend list queries are paginated (default 50 per page)
- Trust score calculation uses single query with joins (no N+1)

### Caching Recommendations
For production, implement Redis caching:
- Friend lists: 1-hour TTL
- Trust data: 15-minute TTL
- Rate limits: 24-hour TTL with atomic increments

### Scaling
The system is designed to scale to millions of users:
- Bidirectional friendship storage enables fast lookups
- Composite indexes optimize all query patterns
- Trust score calculation is O(n) where n = number of friends (typically <500)

## Future Enhancements

Potential features to consider:
1. Friend suggestions based on mutual friends
2. Notification system for friend requests
3. Friendship cooldown period after unfriending
4. Maximum friend limit (e.g., 500 friends)
5. Block/report functionality
6. Friend activity feed
7. Privacy settings for individual ratings
8. Trust score visibility toggle

## Support

For issues or questions about the friendship system:
1. Check this README for API documentation
2. Review the architectural plan at `.windsurf/plans/friendship-trust-system-922783.md`
3. Examine repository code for implementation details
4. Test endpoints using the examples provided

---

**Version**: 1.0.0  
**Last Updated**: March 1, 2026  
**Status**: ✅ Implemented and Ready for Testing
