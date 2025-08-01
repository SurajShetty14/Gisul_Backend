# Gisul_Backend

## Google OAuth Setup

To enable Google OAuth login/signup, you need to add the following environment variables to your `.env` file:

```
# Google OAuth variables
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=https://your-backend-domain.com/auth/google/callback
```

### How to get Google OAuth credentials:

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" and create an OAuth 2.0 Client ID
5. Set the authorized redirect URI to: `https://your-backend-domain.com/auth/google/callback`
6. Copy the Client ID and Client Secret to your `.env` file

### Required Dependencies

Install the required packages:

```bash
npm install axios google-auth-library
```

### OAuth Flow

1. User visits `/auth/google` - redirects to Google OAuth
2. Google redirects back to `/auth/google/callback` with authorization code
3. Server exchanges code for tokens and verifies user
4. If user exists, logs them in; if not, creates new user
5. Redirects to frontend with JWT token: `https://www.snibo.co/login-success?token=JWT_TOKEN`
