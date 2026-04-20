import mongoose from "mongoose";
import Class from "../../models/class.js";
import Semester from "../../models/semester.js";



export const CreateClass = async (req,res)=>{
    let{classname,semesterid,section}=req.body;


    if(!mongoose.Types.ObjectId.isValid(semesterid)){
        return res.status(400).json({
            message:"semester id is not valid"
        })
    }

    if(!classname || !section){
        return res.status(400).json({
            message:"Some Data are invalid"
        })
    }
    try{
        let existingsemester = await Semester.findById(semesterid)
        if(!existingsemester){
            return res.status(400).json({
                message:"Semester not found"
            })
        }
      let newclass = new Class({
        name:classname,
        semester:existingsemester._id,
        section:section
      })

      await newclass.save()

    }catch(err){

        res.status(400).json({
            message:`${err.name}`
        })
    }

}

export const EditClass = async (req,res)=>{
    let{classname,semesterid,section}=req.body;
    let classid = req.params.classid


    if(!mongoose.Types.ObjectId.isValid(semesterid) || !mongoose.Types.ObjectId.isValid(classid)){
        return res.status(400).json({
            message:"semester id or classid is not valid"
        })
    }

    if(!classname || !section){
        return res.status(400).json({
            message:"Some Data are invalid"
        })
    }
    try{
        let existingClass = await Class.findById(classid)
        let existingsemester = await Semester.findById(semesterid)
        if(!existingsemester || !existingClass){
            return res.status(400).json({
                message:"Semester  or class not found"
            })
        }
      
        existingClass.name=classname,
        existingClass.semester=existingsemester._id,
        existingClass.section=section
     

      await existingClass.save()

    }catch(err){

        res.status(400).json({
            message:`${err.name}`
        })
    }

}