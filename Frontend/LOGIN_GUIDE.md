# Login Guide for Tikr

## Understanding the Error

The error "Google OAuth is not configured" appears because:
1. Google OAuth credentials are not set up in the environment variables
2. Your email is registered with **password-based login (LOCAL)**, not Google OAuth

## How to Login with Your Registered Email

### Option 1: Email + Password Flow (Recommended)

1. **Enter your email** in the email field
2. Click the **"Continue"** button (the purple gradient button)
3. The system will check your auth provider
4. You'll be taken to the **password entry screen**
5. Enter your password and click **"Sign in"**

### Option 2: Direct Username Login

1. **Enter your email** in the email field
2. Click **"Continue with Username"** button
3. Enter your password
4. Click **"Sign in"**

## Why OAuth Buttons Don't Work

The OAuth buttons (Google, Microsoft) will only work if:
1. OAuth credentials are configured in `.env.local`
2. Your account was created with that OAuth provider

Since your email is registered with password login, you should use the email + password flow instead.

## Login Flow Diagram

```
┌─────────────────────────────────────┐
│  Enter Email: user@example.com      │
│  [Continue Button]                  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  System checks: This is LOCAL user  │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Enter Password: ********           │
│  [Sign in Button]                   │
└─────────────────────────────────────┘
              ↓
┌─────────────────────────────────────┐
│  Redirected to Dashboard            │
│  (Based on your role)               │
└─────────────────────────────────────┘
```

## Error Messages Explained

### "Google OAuth is not configured"
- **Cause**: OAuth credentials not set up
- **Solution**: Use email + password login instead

### "This email is registered with password login"
- **Cause**: Trying to use OAuth for a password-based account
- **Solution**: Click "Continue" button and enter your password

### "Email mismatch"
- **Cause**: OAuth email doesn't match the entered email
- **Solution**: Use the correct email for your account

## Setting Up OAuth (For Administrators)

If you want to enable OAuth login:

1. Get OAuth credentials from Google/Microsoft
2. Add to `Frontend/.env.local`:
   ```env
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_client_id
   NEXT_PUBLIC_MICROSOFT_CLIENT_ID=your_client_id
   ```
3. Restart the development server
4. Users can then register/login with OAuth

## Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Can't login with Google | Use email + password instead |
| Forgot password | Click "Forgot password?" link |
| Account not found | Contact administrator to create account |
| Wrong auth provider | Use the method your account was created with |

## Need Help?

- Check if your email is registered in the database
- Verify you're using the correct password
- Contact your system administrator for account issues
- See `OAUTH_SETUP_GUIDE.md` for OAuth configuration

## Summary

**For your registered email:**
1. Enter email
2. Click "Continue" (purple button)
3. Enter password
4. Sign in

**Don't use OAuth buttons unless:**
- OAuth is configured
- Your account was created with OAuth
