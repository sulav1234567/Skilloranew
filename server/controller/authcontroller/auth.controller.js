import User from "../../models/user.js"
import bcrypt from "bcryptjs"


const SignupUser = async(req,res)=>{

    
    try{
        const{skilloraemail,skillorafullname,skillorapassword,skilloraconfirmpassword}=req.body;
        console.log(skilloraemail,skillorafullname,skillorapassword,skilloraconfirmpassword)

        if(!skilloraemail||!skillorafullname||!skillorapassword||!skilloraconfirmpassword){
            return res.status(400).json({
                message:"some fields are missing"
            })

        }

        if(!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(skilloraemail)){
            return res.status(400).json({
                message:"Invalid Email"
            })

        }
        

        let finduser = await User.findOne({email:skilloraemail})
        if(finduser){
            return res.status(400).json({
                message:"Wrong Credentials"
            })
        }
        if(skillorapassword!=skilloraconfirmpassword){
            return res.status(400).json({
                message:"Passwords Doesnot Match"
            })
        }

        const hashedpassword = await bcrypt.hash(skillorapassword,10);

        const createUser = new User({
            Fullname:skillorafullname,
            email:skilloraemail,
            password:hashedpassword

        })

        await createUser.save()
        return res.status(200).json({
            message:"You Are Successfully registered to this system"
        })
        





    }catch(err){

        return res.status(err.status || 500).json({
            message:err.message||"Internal Server Error"
        })
    }
}

export {
    SignupUser
}