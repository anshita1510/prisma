# Fix: Google OAuth Error 401 - invalid_client

## 🔴 The Problem

You're seeing: **"Access blocked: Authorization Error - Error 401: invalid_client"**

This means:
- ✅ Google OAuth is configured and trying to work
- ❌ The Client ID is invalid or not set up correctly

## 🔧 Solution: Complete Google OAuth Setup

### Step 1: Create Google OAuth Credentials (Detailed)

#### A. Go to Google Cloud Console
1. Open: https://console.cloud.google.com/
2. Sign in with your Google account (anshitabharwal829@gmail.com)

#### B. Create a New Project
1. Click the **project dropdown** at the top (next to "Google Cloud")
2. Click **"NEW PROJECT"**
3. Project name: `Tikr` or `Tikr-Auth`
4. Click **"CREATE"**
5. Wait for project creation (takes a few seconds)
6. Select your new project from the dropdown

#### C. Configure OAuth Consent Screen (IMPORTANT!)
1. In the left sidebar, go to: **APIs & Services** → **OAuth consent screen**
2. Choose **"External"** (for testing with any Google account)
3. Click **"CREATE"**

4. **Fill in OAuth consent screen:**
   - App name: `Tikr`
   - User support email: `anshitabharwal829@gmail.com` (your email)
   - App logo: (optional, skip for now)
   - Application home page: `http://localhost:3000`
   - Authorized domains: (leave empty for localhost testing)
   - Developer contact information: `anshitabharwal829@gmail.com`
   - Click **"SAVE AND CONTINUE"**

5. **Scopes page:**
   - Click **"ADD OR REMOVE SCOPES"**
   - Select these scopes:
     - `.../auth/userinfo.email`
     - `.../auth/userinfo.profile`
     - `openid`
   - Click **"UPDATE"**
   - Click **"SAVE AND CONTINUE"**

6. **Test users page:**
   - Click **"ADD USERS"**
   - Add your email: `anshitabharwal829@gmail.com`
   - Add any other test emails (manager@mailinator.com, etc.)
   - Click **"ADD"**
   - Click **"SAVE AND CONTINUE"**

7. **Summary page:**
   - Review everything
   - Click **"BACK TO DASHBOARD"**

#### D. Create OAuth Client ID
1. In the left sidebar, go to: **APIs & Services** → **Credentials**
2. Click **"+ CREATE CREDENTIALS"** at the top
3. Select **"OAuth client ID"**

4. **Configure OAuth client:**
   - Application type: **Web application**
   - Name: `Tikr Web Client`
   
   - **Authorized JavaScript origins:**
     - Click **"+ ADD URI"**
     - Add: `http://localhost:3000`
   
   - **Authorized redirect URIs:**
     - Click **"+ ADD URI"**
     - Add: `http://localhost:3000/api/auth/google/callback`
     - ⚠️ Make sure there are NO trailing slashes!
     - ⚠️ Make sure it's exactly: `/api/auth/google/callback`
   
   - Click **"CREATE"**

5. **Copy Your Credentials:**
   - A popup will show your credentials
   - **Copy the "Client ID"** (looks like: `123456789-abcdefghijk.apps.googleusercontent.com`)
   - You can also copy the Client Secret (but we don't need it for frontend OAuth)
   - Click **"OK"**

### Step 2: Add Client ID to Your Project

1. Open `Frontend/.env.local` in your code editor

2. Replace the placeholder with your actual Client ID:

```env
NEXT_PUBLIC_API_URL=http://localhost:5004

# Google OAuth Configuration
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdefghijk.apps.googleusercontent.com

# Microsoft OAuth Configuration (optional)
# NEXT_PUBLIC_MICROSOFT_CLIENT_ID=YOUR_MICROSOFT_CLIENT_ID_HERE
```

⚠️ **Important:** Replace `123456789-abcdefghijk.apps.googleusercontent.com` with YOUR actual Client ID!

3. Save the file

### Step 3: Restart Your Development Server

```bash
# Stop the current server (press Ctrl+C in the terminal)

# Then restart:
cd Frontend
npm run dev
```

⚠️ **Important:** You MUST restart the server for environment variables to take effect!

### Step 4: Clear Browser Cache

1. Open your browser
2. Press `Ctrl + Shift + Delete` (or `Cmd + Shift + Delete` on Mac)
3. Select "Cached images and files"
4. Click "Clear data"

OR simply:
- Press `Ctrl + Shift + R` (or `Cmd + Shift + R` on Mac) to hard refresh

### Step 5: Test Google Login

1. Go to: http://localhost:3000/login
2. Click **"Continue with Google"**
3. You should see Google's login page (not an error!)
4. Sign in with your Google account
5. Grant permissions
6. You'll be redirected back to Tikr and logged in!

## 🔍 Verify Your Setup

Run this command to check if everything is configured:

```bash
cd Frontend
node check-oauth-config.js
```

## 🐛 Common Issues & Fixes

### Issue 1: Still seeing "invalid_client"
**Causes:**
- Client ID not copied correctly
- Server not restarted
- Wrong Client ID format

**Fix:**
1. Double-check the Client ID in `.env.local`
2. Make sure there are no extra spaces
3. Restart the development server
4. Clear browser cache

### Issue 2: "Redirect URI mismatch"
**Cause:** The redirect URI in Google Console doesn't match exactly

**Fix:**
1. Go back to Google Cloud Console
2. Go to: Credentials → Your OAuth Client
3. Make sure redirect URI is EXACTLY: `http://localhost:3000/api/auth/google/callback`
4. No trailing slash!
5. Save and try again

### Issue 3: "Access blocked: This app's request is invalid"
**Cause:** OAuth consent screen not configured properly

**Fix:**
1. Go to: OAuth consent screen in Google Console
2. Make sure app is in "Testing" mode
3. Add your email as a test user
4. Save changes

### Issue 4: "This app isn't verified"
**Cause:** App is in testing mode (this is normal!)

**Fix:**
- Click "Advanced"
- Click "Go to Tikr (unsafe)" - this is safe for your own app
- Continue with login

## 📋 Checklist

Before testing, make sure:

- [ ] Created Google Cloud project
- [ ] Configured OAuth consent screen
- [ ] Added test users (your email)
- [ ] Created OAuth client ID (Web application)
- [ ] Added redirect URI: `http://localhost:3000/api/auth/google/callback`
- [ ] Copied Client ID correctly
- [ ] Pasted Client ID in `Frontend/.env.local`
- [ ] No extra spaces or quotes around Client ID
- [ ] Saved `.env.local` file
- [ ] Restarted development server
- [ ] Cleared browser cache

## 🎯 Expected Result

After fixing:

1. Click "Continue with Google"
2. See Google's login page (blue Google sign-in screen)
3. Sign in with your Google account
4. See permission request screen
5. Click "Allow"
6. Redirected back to Tikr
7. Logged in successfully!

## 📸 What You Should See

### Before Fix:
❌ "Access blocked: Authorization Error - Error 401: invalid_client"

### After Fix:
✅ Google's blue sign-in page
✅ "Sign in with Google" header
✅ Your email or account selection
✅ Permission request screen
✅ Successful redirect to Tikr dashboard

## 🆘 Still Having Issues?

If you're still seeing errors:

1. **Check the browser console:**
   - Press F12
   - Go to Console tab
   - Look for error messages
   - Share the error with me

2. **Check the terminal:**
   - Look at your development server logs
   - Any errors there?

3. **Verify the Client ID:**
   - Go to Google Cloud Console
   - Credentials → Your OAuth Client
   - Copy the Client ID again
   - Make sure it matches what's in `.env.local`

4. **Try incognito mode:**
   - Open browser in incognito/private mode
   - Go to login page
   - Try Google login
   - This eliminates cache issues

## 📞 Need More Help?

Share these details:
1. The exact error message you see
2. Your Client ID (first 20 characters only)
3. Screenshot of your Google Cloud Console credentials page
4. Contents of your `.env.local` (hide the full Client ID)

---

**Quick Summary:**
1. Get Client ID from Google Cloud Console
2. Add to `Frontend/.env.local`
3. Restart server
4. Clear cache
5. Test login!
