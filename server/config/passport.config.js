import passport from "passport"
import{Strategy as GoogleStrategy} from "passport-google-oauth20"
import User from "../models/user.js"


passport.use(
    new GoogleStrategy({
        clientID:process.env.CLIENT_ID,
        clientSecret:process.env.CLIENT_SECRET,
        callbackURL:`${process.env.BACKEND_URL}/auth/google/callback`
    },
     async(accessToken,refreshToken,profile,done)=>{
         try {
        const email = profile.emails[0].value;

        let user = await User.findOne({ email });

        if (!user) {
          user = await User.create({
            Fullname: profile.displayName,
            email,
            password:null,
            googleId: profile.id,
            avatar: profile.photos[0].value,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);

     }
    }

)
)