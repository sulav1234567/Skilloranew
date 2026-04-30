import User from "../../models/user.js";
import bcrypt from "bcryptjs";
import {
  GenerateAccessToken,
  GenerateRefreshToken,
  VerifyRefreshToken,
} from "../../utlits/jwt.utlits.js";


const isProduction = process.env.NODE_ENV === "production";

const cookieOptions = isProduction
  ? `HttpOnly; Secure; SameSite=${process.env.SAME_SITE}; Domain=.skillsoora.com`   
  : `HttpOnly; SameSite=${process.env.SAME_SITE}`;   


export const SignupUser = async (req, res) => {
  try {
    const {
      skilloraemail,
      skillorafullname,
      skillorapassword,
      skilloraconfirmpassword,
    } = req.body;
    console.log(
      skilloraemail,
      skillorafullname,
      skillorapassword,
      skilloraconfirmpassword,
    );

    if (
      !skilloraemail ||
      !skillorafullname ||
      !skillorapassword ||
      !skilloraconfirmpassword
    ) {
      return res.status(400).json({
        message: "some fields are missing",
      });
    }

    if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(skilloraemail)) {
      return res.status(400).json({
        message: "Invalid Email",
      });
    }

    let finduser = await User.findOne({ email: skilloraemail });
  
    if (skillorapassword != skilloraconfirmpassword) {
      return res.status(400).json({
        message: "Passwords Doesnot Match",
      });
    }

    const hashedpassword = await bcrypt.hash(skillorapassword, 10);

    if(!finduser){
      const createUser = new User({
        Fullname: skillorafullname,
        email: skilloraemail,
        password: hashedpassword,
        authprovider:{
          local:true,
          google:false,
          github:false
        },
        role:"user"
      });
        await createUser.save()
    return res.status(200).json({
      message: "You Are Successfully registered to this system",
    });
    }

    if(finduser && finduser.authprovider?.google){
      finduser.password = hashedpassword;
      finduser.authprovider.local = true;
      await finduser.save()
      return res.status(200).json({
        message: "Local account linked to Google account",
      });
    }

    return res.status(400).json({
        message: "Wrong Credentials",
      });


   
  } catch (err) {
    return res.status(err.status || 500).json({
      message: err.message || "Internal Server Error",
    });
  }
};

export const LoginUser = async (req, res) => {
  let { skilloraloginemail, skilloraloginpassword } = req.body;
  

  if (!skilloraloginemail || !skilloraloginpassword) {
    return res.status(400).json({
      message: "Data Missing",
    });
  }

  if (!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(skilloraloginemail)) {
    return res.status(400).json({
      message: "Invalid Email",
    });
  }

  let finduser = await User.findOne({ email: skilloraloginemail });

 

  if (!finduser) {
    return res.status(400).json({
      message: "Wrongn Credentials",
    });
  }

  if(!finduser.authprovider.local){
    return res.status(400).json({
      message:"wrong credentials"
    })

  }

   let compare = await bcrypt.compare(skilloraloginpassword,finduser.password)
   if(!compare){
     return res.status(400).json({
      message: "Wrongn Credentials",
    });

   }

  try {
    let accesstoken = GenerateAccessToken(finduser);
    let refreshtoken = GenerateRefreshToken(finduser);
    let hashrefreshtoken = await bcrypt.hash(refreshtoken, 10);

    res.setHeader("Set-Cookie", [
      `refreshtoken=${refreshtoken}; ${cookieOptions}; Path=/`,
      `accesstoken=${accesstoken}; ${cookieOptions}; Path=/`,
    ]);

    finduser.refreshtoken = hashrefreshtoken;
    await finduser.save();

    res.status(200).json({
      message: "login successful",
    });
  } catch (err) {
    console.log(err);
    res.status(err?.response?.status || 500).json({
      message: "Internal Server Error. Try Again!",
    });
  }
};

export const RefreshToken = async (req, res) => {
  let refreshtoken = req.cookies.refreshtoken;
  
  if (!refreshtoken) {
    res.setHeader("Set-Cookie", [
      `refreshtoken=; ${cookieOptions}; Path=/`,
      `accesstoken=; ${cookieOptions}; Path=/`,
    ]);

    return res.status(401).json({
      message: "Unauthorized Please Login Again!",
    });
  }

  try{
   const decoded = VerifyRefreshToken(refreshtoken);

   const user = await User.findById(decoded.id);

   if(!user || !user.refreshtoken){
    return res.status(400).json({
        message:"user not found"
    })
   }

   const isvalid = await bcrypt.compare(refreshtoken,user.refreshtoken)

   if(!isvalid){
    return res.status(400).json({
        message:"Invalid Refresh Token"
    })
   }

   const accesstoken = GenerateAccessToken(user);
   const refreshtokeng=GenerateRefreshToken(user);
   const hashrefreshtoken = await bcrypt.hash(refreshtokeng,10)

   user.refreshtoken=hashrefreshtoken;
   await user.save();
   res.setHeader("Set-Cookie", [
      `refreshtoken=${refreshtokeng}; ${cookieOptions}; Path=/`,
      `accesstoken=${accesstoken}; ${cookieOptions}; Path=/`,
    ]);

   res.status(200).json({
    message:"ok"
   })



  }catch(err){

    res.setHeader("Set-Cookie", [
      `refreshtoken=; ${cookieOptions}; Path=/`,
      `accesstoken=; ${cookieOptions}; Path=/`,
    ]);

    return res.status(401).json({
      message: "Unauthorized Please Login Again",
    });

  }



};


export const Logout=async(req,res)=>{
  try {
    const refreshtoken = req.cookies.refreshtoken;
    

    if (refreshtoken) {
      try {
        const decoded = VerifyRefreshToken(refreshtoken);
        const user = await User.findById(decoded.id);

        if (user) {
          user.refreshtoken = null;
          await user.save();
        }
      } catch (err) {
        
      }
    }

    res.setHeader("Set-Cookie", [
      `refreshtoken=; ${cookieOptions}; Path=/`,
      `accesstoken=; ${cookieOptions}; Path=/`,
    ]);

    return res.status(200).json({
      message: "Logged out successfully",
    });

  } catch (err) {
    return res.status(500).json({
      message: "Logout failed",
    });
  }
}



