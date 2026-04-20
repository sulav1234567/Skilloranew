import mongoose from "mongoose";
import Course from "../../models/course.js"
import Semester from "../../models/semester.js";

export let CreateSemester = async(req,res)=>{
    let {semesternumber,courseid}=req.body;

    if(!semesternumber || isNaN(semesternumber) || !courseid){
        return res.status(400).json({
            message:"Some Data Not Found"
        })
    }

    if(!mongoose.Types.ObjectId.isValid(courseid)){
        return res.status(400).json({
            message:"invalid course id"
        })
    }

    try{
      let existingcourse = await Course.findById(courseid);

      let createSemester = new Semester({
        SemesterNumber:semesternumber,
        course:existingcourse._id
      });

      await createSemester.save()

      res.status(200).json({
        message:"semester created"
      })

    }
    catch(err){

        return res.status(400).json({
            message:`${err.name}:${err}`
        })

    }

}

export const EditSemester = async (req,res)=>{

      let {semesternumber,courseid}=req.body;
      let semesterid = req.params.semesterid;

    if(!semesternumber || isNaN(semesternumber) || !courseid){
        return res.status(400).json({
            message:"Some Data Not Found"
        })
    }

    if(!mongoose.Types.ObjectId.isValid(courseid)){
        return res.status(400).json({
            message:"invalid course id"
        })
    }

    if(!mongoose.Types.ObjectId.isValid(semesterid)){
        return res.status(400).json({
            message:"invalid semester id"
        })
    }

    try{
      let existingcourse = await Course.findById(courseid);
      let existingsemester = await Semester.findById(semesterid)

      existingsemester.SemesterNumber=semesternumber
      existingsemester.course = existingcourse._id

      await existingsemester.save()

      res.status(200).json({
        message:"semester edited"
      })

    }
    catch(err){

        return res.status(400).json({
            message:`${err.name}:${err}`
        })

    }

}