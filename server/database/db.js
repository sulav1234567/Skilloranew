import mongoose from "mongoose"
let connect = async()=>{
    try{
   let conn=await mongoose.connect(`${process.env.MONGODB_URI}`)
   console.log(`Database connected: ${conn.connection.host}`)
    }catch(err){
 console.log(`Database Error: ${err.message}`)
    }
}

export default connect