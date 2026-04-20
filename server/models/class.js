import mongoose from "mongoose";

const ClassSchema = new mongoose.Schema(
  {
    name: { type: String },

    semester: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Semester",
    },

    section: {type:String},
  },
  { timestamps: true },
);
ClassSchema.index({semester:1,section:1},{unique:true})
let Class = mongoose.model("Class", ClassSchema);

export default Class;
