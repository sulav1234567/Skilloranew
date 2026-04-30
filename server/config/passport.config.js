import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GithubStrategy } from "passport-github2";
import User from "../models/user.js";
import axios from "axios"
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

passport.use(
  "github",
  new GithubStrategy(
    {
      clientID     : process.env.GITHUB_CLIENT_ID,
      clientSecret : process.env.GITHUB_CLIENT_SECRET,
      callbackURL  : `${process.env.BACKEND_URL}/auth/github/callback`,
      scope        : ["user:email"],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {

        let user = await User.findOne({ githubid: profile.id });

        if (user) {
          return done(null, user);
        }

        let email = profile.emails?.[0]?.value;

        if (!email) {
          try {
            const emailRes = await axios.get("https://api.github.com/user/emails", {
              headers: {
                Authorization          : `Bearer ${accessToken}`,
                Accept                 : "application/vnd.github+json",
                "X-GitHub-Api-Version" : "2022-11-28",
              },
            });
            const primary = emailRes.data.find((e) => e.primary && e.verified);
            email = primary?.email;
          } catch (emailErr) {
            console.error("Could not fetch GitHub email:", emailErr.message);
          }
        }

        if (!email) {
          return done(
            new Error("No verified email found on GitHub account. Please make your email public."),
            null
          );
        }
        user = await User.findOne({ email });

        if (user) {
          user.githubid            = profile.id;
          user.username            = profile.username;
          user.authprovider.github = true;
          if (!user.avatar) {
            user.avatar = profile.photos?.[0]?.value;
          }
          await user.save();
          return done(null, user);
        }

      
        user = await User.create({
          Fullname   : profile.displayName || profile.username,
          email      : email,
          avatar     : profile.photos?.[0]?.value,
          githubid   : profile.id,
          username   : profile.username,
          authprovider: {
            github : true,
            local  : false,
            google : false,
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