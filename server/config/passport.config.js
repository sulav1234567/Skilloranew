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

        let user = await User.findOne({ email:email });


        if (!user) {
          user = new User({
            Fullname: profile.displayName,
            email,
            password:null,
            googleId: profile.id,
            avatar: profile.photos[0].value,
            authprovider:{
                google:true,
                local:false
            }
          });
          await user.save()
          return done(null, user);
        }

        if (user.authprovider === "local" && !user.googleId) {
          user.googleId = profile.id;
          user.authprovider = {
            google:true,
            local:true
          };
          if (!user.avatar) {
            user.avatar = profile.photos?.[0]?.value;
          }

          await user.save();
          return done(null, user);
        }
        return done(null, user);
      } catch (err) {
        return done(err, null);

     }
    }

)
)