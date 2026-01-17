import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { prisma } from "./db";
import { Role, Status, AuthProvider } from "@prisma/client";

// Debug: Log the redirect URI being used
console.log('=== Passport Configuration ===');
console.log('GOOGLE_CLIENT_ID:', process.env.GOOGLE_CLIENT_ID);
console.log('GOOGLE_REDIRECT_URI:', process.env.GOOGLE_REDIRECT_URI);
console.log('==============================');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_REDIRECT_URI || "http://localhost:5004/api/auth/google/callback",
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        console.log('=== Passport Google Strategy ===');
        const email = profile.emails?.[0].value;
        
        if (!email) {
          console.error('No email from Google');
          return done(new Error("No email from Google"), undefined);
        }

        console.log('User email:', email);

        // Check existing user by email
        let user = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (user) {
          console.log('User exists:', user.id);
          console.log('Current role:', user.role);
          // Link Google if not already linked
          if (!user.googleId || user.authProvider !== AuthProvider.GOOGLE) {
            console.log('Updating user with Google info...');
            user = await prisma.user.update({
              where: { email: email.toLowerCase() },
              data: {
                googleId: profile.id,
                authProvider: AuthProvider.GOOGLE,
                status: Status.ACTIVE,
                isActive: true,
              },
            });
          }
        } else {
          // Create new Google user
          console.log('Creating new user...');
          user = await prisma.user.create({
            data: {
              email: email.toLowerCase(),
              firstName: profile.name?.givenName || profile.displayName || "Google",
              lastName: profile.name?.familyName || "User",
              phone: "",
              designation: "Employee",
              role: Role.EMPLOYEE,
              googleId: profile.id,
              authProvider: AuthProvider.GOOGLE,
              status: Status.ACTIVE,
              isActive: true,
            },
          });
          console.log('User created:', user.id, 'with role:', user.role);
        }

        // Convert Prisma user to AuthUser format for Passport
        const authUser = {
          id: user.id,
          email: user.email,
          role: user.role,
          employeeId: undefined,
          companyId: user.companyId ?? undefined,
          designation: user.designation ?? undefined,
          isActive: user.isActive,
          departmentId: undefined,
        };

        console.log('Returning user with role:', authUser.role);
        return done(null, authUser);
      } catch (err) {
        console.error('Passport strategy error:', err);
        return done(err, undefined);
      }
    }
  )
);

// Serialize user for the session (not used with JWT, but required by Passport)
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

// Deserialize user from the session (not used with JWT, but required by Passport)
passport.deserializeUser(async (id: number, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) {
      return done(null, false);
    }
    // Convert Prisma user to AuthUser format
    const authUser = {
      id: user.id,
      email: user.email,
      role: user.role,
      employeeId: undefined,
      companyId: user.companyId ?? undefined,
      designation: user.designation ?? undefined,
      isActive: user.isActive,
      departmentId: undefined,
    };
    done(null, authUser);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
