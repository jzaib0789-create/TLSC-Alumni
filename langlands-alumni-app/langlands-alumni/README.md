# Langlands School & College — Alumni Registry

A full-stack alumni registration and management app connected to Supabase.

## Features
- Public alumni self-registration form (shareable link)
- Photo upload
- Admin login (protected panel)
- Search, filter, view full profiles
- Export to CSV
- Works as a mobile app (PWA — installable on Android/iOS)

## Deployment (Vercel — Free)

### Step 1: Create a GitHub account
Go to https://github.com and sign up (or log in).

### Step 2: Create a new repository
1. Click the + icon → "New repository"
2. Name it: langlands-alumni
3. Set to Public
4. Click "Create repository"

### Step 3: Upload the code
1. On the new repo page, click "uploading an existing file"
2. Drag and drop ALL files from this folder (keeping the folder structure)
3. Click "Commit changes"

### Step 4: Deploy on Vercel
1. Go to https://vercel.com and sign up with GitHub
2. Click "Add New Project"
3. Select your langlands-alumni repository
4. Click "Deploy" — Vercel detects React automatically
5. Done! You get a live URL like: https://langlands-alumni.vercel.app

### Step 5: Set up photo storage in Supabase
1. Go to your Supabase project → Storage
2. Click "New bucket"
3. Name it: alumni-photos
4. Check "Public bucket"
5. Click "Save"

## URLs
- Public form: https://your-app.vercel.app/
- Admin panel: https://your-app.vercel.app/admin/login

## Adding more admin users
Go to Supabase → Authentication → Users → Add User
