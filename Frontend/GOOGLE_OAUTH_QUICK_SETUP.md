# Google OAuth Quick Setup Guide

## 🚀 Quick Steps to Enable "Continue with Google"

### Step 1: Get Your Google Client ID

1. **Go to**: https://console.cloud.google.com/
2. **Create/Select Project**: Click project dropdown → "New Project" → Name it "Tikr"
3. **Configure OAuth Consent Screen**:
   - Go to: APIs & Services → OAuth consent screen
   - Choose: **External**
   - Fill in:
     - App name: `Tikr`
     - User support email: `your-email@gmail.com`
     - Developer contact: `your-email@gmail.com`
   - Click "Save and Continue" (skip scopes and test users for now)

4. **Create OAuth Client ID**:
   - Go to: APIs & Services → Credentials
   - Click: **Create Credentials** → **OAuth client ID**
   - Application type: **Web application**
   - Name: `Tikr Web Client`
   - Authorized JavaScript origins:
     ```
     http://localhost:3000
     ```
   - Authorized redirect URIs:
     ```
     http://localhost:3000/api/auth/google/callback
     ```
   - Click **Create**

5. **Copy the Client ID** (looks like: `123456789-abcdefg.apps.googleusercontent.com`)

### Step 2: Add Client ID to Your Project

1. Open `Frontend/.env.local`
2. Replace `YOUR_GOOGLE_CLIENT_ID_HERE` with your actual Client ID:
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abcdefg.apps.googleusercontent.com
   ```

### Step 3: Restart Your Development Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
cd Frontend
npm run dev
```

### Step 4: Update Your User's Auth Provider in Database

Your email is currently registered with `LOCAL` (password) authentication. To use Google login, you need to either:

**Option A: Create a new account with Google**
- Use a different email that's not registered yet
- Click "Continue with Google"
- It will create a new account with Google auth

**Option B: Update existing account to use Google**
Run this SQL in your database:
```sql
UPDATE "User" 
SET "authProvider" = 'GOOGLE' 
WHERE email = 'your-email@example.com';
```

### Step 5: Test Google Login

1. Go to login page: http://localhost:3000/login
2. Click **"Continue with Google"**
3. You'll be redirected to Google's login page
4. Sign in with your Google account
5. Grant permissions
6. You'll be redirected back and logged in!

## 🎯 What Happens After Setup

Once configured:
- ✅ "Continue with Google" button works
- ✅ No email entry required
- ✅ Direct redirect to Google
- ✅ Automatic account creation/login
- ✅ Secure OAuth flow

## 🔧 Backend Setup (Important!)

Your backend also needs to handle Google OAuth. Make sure these endpoints exist:

### 1. Google Callback Handler

**File**: `Backend/src/modules/controller/auth/auth.controller.ts`

The `googleLogin` method should:
1. Verify the Google token
2. Extract user info (email, name)
3. Find or create user in database
4. Generate JWT token
5. Return token and user data

### 2. Google Callback Endpoint

**File**: `Backend/src/modules/routes/auth/auth.routes.ts`

Should have:
```typescript
router.post("/google-callback", controller.googleCallback);
```

This endpoint receives the authorization code from Google and exchanges it for user information.

## 📝 Environment Variables Summary

Your `Frontend/.env.local` should have:
```env
NEXT_PUBLIC_API_URL=http://localhost:5004
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-actual-client-id-here
```

## 🐛 Troubleshooting

### Error: "Google OAuth is not configured"
- **Cause**: Client ID not set or server not restarted
- **Fix**: Add Client ID to `.env.local` and restart server

### Error: "Redirect URI mismatch"
- **Cause**: Redirect URI in Google Console doesn't match
- **Fix**: Ensure it's exactly `http://localhost:3000/api/auth/google/callback`

### Error: "This email is registered with password login"
- **Cause**: Your account uses LOCAL auth, not GOOGLE
- **Fix**: Update database or use a different email

### Google login page doesn't appear
- **Cause**: Client ID is invalid or not set
- **Fix**: Double-check Client ID in `.env.local`

## 🎨 Visual Flow

```
User clicks "Continue with Google"
         ↓
Redirect to Google login page
         ↓
User signs in with Google
         ↓
Google redirects to: /api/auth/google/callback
         ↓
Backend exchanges code for user info
         ↓
Backend creates/finds user
         ↓
Backend generates JWT token
         ↓
Frontend receives token
         ↓
User logged in and redirected to dashboard
```

## 🔐 Security Notes

1. **Never commit** `.env.local` to git (it's in `.gitignore`)
2. **Use HTTPS** in production
3. **Rotate credentials** if exposed
4. **Limit scopes** to only what you need (email, profile)
5. **Add authorized domains** in Google Console for production

## 📚 Additional Resources

- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Google Cloud Console](https://console.cloud.google.com/)
- [OAuth 2.0 Playground](https://developers.google.com/oauthplayground/)

## ✅ Checklist

- [ ] Created Google Cloud project
- [ ] Configured OAuth consent screen
- [ ] Created OAuth client ID
- [ ] Added redirect URI: `http://localhost:3000/api/auth/google/callback`
- [ ] Copied Client ID
- [ ] Added Client ID to `Frontend/.env.local`
- [ ] Restarted development server
- [ ] Updated user's authProvider in database (if needed)
- [ ] Tested Google login flow
- [ ] Backend endpoints are working

## 🎉 Success!

Once everything is set up, you can:
- Click "Continue with Google" without entering email
- Be redirected directly to Google
- Sign in and be automatically logged into Tikr
- No password needed!

---

**Need help?** Check the main `OAUTH_SETUP_GUIDE.md` for more detailed information.
