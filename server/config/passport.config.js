import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/User.js";

passport.use(
  "google",
  new GoogleStrategy(
    {
      clientID     : process.env.CLIENT_ID,
      clientSecret : process.env.CLIENT_SECRET,
      callbackURL  : `${process.env.BACKEND_URL}/auth/google/callback`,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email  = profile.emails?.[0]?.value;
        const avatar = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error("No email returned from Google account."), null);
        }

       
        let user = await User.findOne({ googleId: profile.id });

        if (user) {
          if (!user.avatar) {
            user.avatar = avatar;
          }
          await user.save();
          return done(null, user);
        }

       
        user = await User.findOne({ email });

        if (user) {
          user.googleId            = profile.id;
          user.authprovider.google = true;   
          if (!user.avatar) {
            user.avatar = avatar;
          }
          user.lastLogin = new Date();
          await user.save();
          return done(null, user);
        }

      
        user = await User.create({
          Fullname   : profile.displayName,
          email      : email,
          avatar     : avatar,
          googleId   : profile.id,
          authprovider: {
            google : true,
            local  : false,
            github : false,
          },
          role       : "user",
        });

        return done(null, user);

      } catch (err) {
        return done(err, null);
      }
    }
  )
);

export default passport;