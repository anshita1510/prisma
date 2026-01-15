# OAuth Setup Guide for Tikr

This guide explains how to set up Google and Microsoft OAuth authentication for your Tikr application.

## Overview

Users can now click "Continue with Google" or "Continue with Microsoft" directly without entering their email first. The OAuth flow will handle authentication and redirect them back to the application.

## Google OAuth Setup

### 1. Create Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Select **Web application** as the application type
6. Configure the OAuth consent screen if prompted

### 2. Configure Authorized Redirect URIs

Add these redirect URIs:
- **Development**: `http://localhost:3000/api/auth/google/callback`
- **Production**: `https://yourdomain.com/api/auth/google/callback`

### 3. Get Your Client ID

Copy the **Client ID** from the credentials page.

### 4. Add to Environment Variables

In your `Frontend/.env.local` file:
```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

## Microsoft OAuth Setup

### 1. Register Application in Azure

1. Go to [Azure Portal](https://portal.azure.com/)
2. Navigate to **Azure Active Directory** > **App registrations**
3. Click **New registration**
4. Enter application name (e.g., "Tikr")
5. Select **Accounts in any organizational directory and personal Microsoft accounts**

### 2. Configure Redirect URIs

Under **Authentication** > **Platform configurations** > **Add a platform** > **Web**:
- **Development**: `http://localhost:3000/api/auth/microsoft/callback`
- **Production**: `https://yourdomain.com/api/auth/microsoft/callback`

### 3. Get Your Client ID

Copy the **Application (client) ID** from the Overview page.

### 4. Add to Environment Variables

In your `Frontend/.env.local` file:
```env
NEXT_PUBLIC_MICROSOFT_CLIENT_ID=your_microsoft_client_id_here
```

## Backend API Endpoints Required

Your backend needs to implement these endpoints:

### 1. Google OAuth Callback Handler

**Endpoint**: `POST /api/users/google-callback`

**Request Body**:
```json
{
  "code": "authorization_code_from_google"
}
```

**Response**:
```json
{
  "token": "jwt_token",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "EMPLOYEE",
    "name": "John Doe"
  }
}
```

**Implementation Steps**:
1. Exchange the authorization code for access token with Google
2. Get user info from Google API
3. Find or create user in your database
4. Generate JWT token
5. Return token and user data

### 2. Microsoft OAuth Callback Handler

**Endpoint**: `POST /api/users/microsoft-callback`

**Request Body**:
```json
{
  "code": "authorization_code_from_microsoft"
}
```

**Response**: Same as Google callback

## Testing OAuth Flow

### Without OAuth Credentials (Development)

If OAuth credentials are not configured, users will see an error message:
- "Google OAuth is not configured. Please contact your administrator."
- "Microsoft OAuth is not configured. Please contact your administrator."

### With OAuth Credentials

1. Click "Continue with Google" or "Continue with Microsoft"
2. User is redirected to OAuth provider's consent screen
3. User grants permissions
4. OAuth provider redirects back to your callback URL
5. Backend exchanges code for tokens
6. User is authenticated and redirected to their dashboard

## User Flow

### Direct OAuth Login (No Email Required)

```
User clicks "Continue with Google"
    ↓
Redirect to Google OAuth consent screen
    ↓
User signs in with Google account
    ↓
Google redirects to /api/auth/google/callback with code
    ↓
Backend exchanges code for user info
    ↓
Backend creates/finds user and generates JWT
    ↓
Frontend receives token and user data
    ↓
User redirected to dashboard based on role
```

### Email-First Flow (Optional)

```
User enters email
    ↓
Backend checks auth provider
    ↓
If GOOGLE: Redirect to Google OAuth (with email hint)
If LOCAL: Show password field
If NEW_USER: Show signup message
```

## Security Considerations

1. **HTTPS Required in Production**: OAuth providers require HTTPS for redirect URIs in production
2. **State Parameter**: Consider adding CSRF protection with state parameter
3. **Token Storage**: Tokens are stored in localStorage and httpOnly cookies
4. **Token Expiration**: Implement token refresh mechanism
5. **Scope Limitation**: Only request necessary OAuth scopes (email, profile)

## Troubleshooting

### "Redirect URI mismatch" Error

- Ensure redirect URIs in OAuth provider match exactly with your callback URLs
- Check for trailing slashes
- Verify HTTP vs HTTPS

### "OAuth not configured" Error

- Check that environment variables are set correctly
- Restart the development server after adding env variables
- Verify the client ID is correct

### User Not Redirected After Login

- Check browser console for errors
- Verify backend callback endpoints are working
- Check that JWT token is being generated correctly

## Environment Variables Summary

Create a `Frontend/.env.local` file with:

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:5004

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Microsoft OAuth
NEXT_PUBLIC_MICROSOFT_CLIENT_ID=your_microsoft_client_id
```

## Files Modified/Created

### Frontend Files:
- `Frontend/app/(auth)/login/page.tsx` - Updated OAuth handlers
- `Frontend/app/(auth)/login/callback/page.tsx` - New callback handler page
- `Frontend/app/api/auth/google/callback/route.ts` - Google OAuth callback
- `Frontend/app/api/auth/microsoft/callback/route.ts` - Microsoft OAuth callback
- `Frontend/.env.example` - Environment variable template

### Backend Files (Need to be implemented):
- `Backend/src/modules/controller/users/google-callback.ts` - Google OAuth handler
- `Backend/src/modules/controller/users/microsoft-callback.ts` - Microsoft OAuth handler

## Next Steps

1. Set up OAuth credentials in Google Cloud Console and Azure Portal
2. Add environment variables to `.env.local`
3. Implement backend OAuth callback endpoints
4. Test the OAuth flow
5. Deploy to production with HTTPS redirect URIs

## Support

For issues or questions, refer to:
- [Google OAuth Documentation](https://developers.google.com/identity/protocols/oauth2)
- [Microsoft OAuth Documentation](https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-oauth2-auth-code-flow)
