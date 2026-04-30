import passport  from "passport";
import { Strategy as GithubStrategy } from "passport-github2";
import axios from "axios"
import User      from "../models/User.js";

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

        let user = await User.findOne({ githubId: profile.id });

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
          user.githubId            = profile.id;
          user.username            = profile.username;
          user.authprovider.github = true;
          if (!user.avatar) {
            user.avatar = profile.photos?.[0]?.value;
          }
          user.lastLogin = new Date();
          await user.save();
          return done(null, user);
        }

      
        user = await User.create({
          Fullname   : profile.displayName || profile.username,
          email      : email,
          avatar     : profile.photos?.[0]?.value,
          githubId   : profile.id,
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