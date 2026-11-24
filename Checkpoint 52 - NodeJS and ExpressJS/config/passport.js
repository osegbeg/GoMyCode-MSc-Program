const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const userStore = require("../models/userStore");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "placeholder_client_id",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "placeholder_client_secret",
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      try {
        let user = userStore.findByGoogleId(profile.id);

        if (!user) {
          const email = profile.emails && profile.emails[0] ? profile.emails[0].value : `${profile.id}@google.oauth`;
          user = userStore.findByEmail(email) || userStore.create({
            name: profile.displayName || "Google User",
            email,
            googleId: profile.id,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;