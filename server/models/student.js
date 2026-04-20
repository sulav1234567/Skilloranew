import mongoose from "mongoose";


const StudentSchema = new mongoose.Schema(
  {
   

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    class:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Class"
    }
  },
  { timestamps: true },
);
StudentSchema.index({class: 1 })
let Student = mongoose.model("Student", StudentSchema);

export default Student;
