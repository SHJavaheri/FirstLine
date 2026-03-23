# Database Migration Instructions

## Overview
All code changes have been completed for the following features:
1. ✅ Fixed duplicate favorite error (using upsert)
2. ✅ Favorites now display on consumer profile page
3. ✅ Edit Profile button is now functional
4. ✅ Rating system implemented (5-star with comments, consumer-only)

## Required Steps

### 1. Start Your Database Server
Make sure your PostgreSQL database server is running at `localhost:5432`.

### 2. Run the Migration
```bash
cd frontend
npx prisma migrate dev --name add_rating_model
```

This will:
- Create the `Rating` table in your database
- Add the necessary relations
- Generate the updated Prisma Client

### 3. Restart Your Development Server
After the migration completes, restart your Next.js dev server:
```bash
npm run dev
```

## What Was Changed

### Database Schema (`prisma/schema.prisma`)
- Added `Rating` model with fields: id, consumerId, professionalProfileId, rating (1-5), comment, timestamps
- Added `ratings` relation to `Account` model
- Added `ratings` relation to `ProfessionalProfile` model
- Unique constraint on `[consumerId, professionalProfileId]` to prevent duplicate ratings

### Backend Files Created/Modified
- ✅ `src/backend/repositories/favorite-repository.ts` - Fixed upsert for favorites
- ✅ `src/backend/repositories/rating-repository.ts` - New rating operations
- ✅ `src/app/api/profile/route.ts` - Profile update endpoint
- ✅ `src/app/api/ratings/route.ts` - Rating CRUD operations
- ✅ `src/app/api/ratings/[professionalAccountId]/route.ts` - Get ratings for a professional

### Frontend Components Created
- ✅ `src/components/profile/edit-profile-dialog.tsx` - Edit profile modal
- ✅ `src/components/ratings/rating-dialog.tsx` - 5-star rating with comment
- ✅ `src/components/ratings/ratings-list.tsx` - Display all ratings

### UI Components Added
- ✅ Dialog component (via shadcn/ui)
- ✅ Textarea component (via shadcn/ui)

### Pages Updated
- ✅ `src/app/profile/page.tsx` - Now shows actual favorites and has working Edit Profile button
- ✅ `src/app/lawyers/[id]/page.tsx` - Added rating functionality for consumers

## Features

### 1. Favorites
- Consumers can add/remove professionals to favorites
- Favorites display on profile page with full professional cards
- Fixed duplicate favorite error

### 2. Edit Profile
- Click "Edit Profile" button on profile page
- Update: First Name, Last Name, Job Title, Bio, City, State, Phone
- Changes save and page refreshes automatically

### 3. Rating System
- **Consumer-only feature** (professionals cannot rate other professionals)
- 5-star rating system with optional comment
- One rating per consumer per professional
- Can edit or delete existing ratings
- Average rating automatically calculated and updated on professional profile
- Ratings display on professional profile pages with reviewer info

## Testing Checklist

After migration:
- [ ] Login as a consumer
- [ ] Add a professional to favorites
- [ ] Check that favorite appears on profile page
- [ ] Click Edit Profile and update information
- [ ] Visit a professional's profile page
- [ ] Submit a rating with comment
- [ ] Edit your rating
- [ ] Delete your rating
- [ ] Verify professionals cannot see rating button when viewing other professionals

## Notes
- All lint errors related to `prisma.rating` will resolve after running the migration
- The rating system enforces 1-5 star range
- Average ratings update automatically when ratings are added/updated/deleted
