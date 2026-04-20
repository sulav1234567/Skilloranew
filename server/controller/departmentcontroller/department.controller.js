import mongoose from "mongoose";
import Department from "../../models/department.js";
import User from "../../models/user.js";

export const CreateDepartment = async (req, res) => {
  let {
    departmentname,
    headofdepartment,
    departmentdiscription,
    departmentestd,
  } = req.body;

  if (!departmentname || !headofdepartment || !departmentestd) {
    return res.status(400).json({
      message: "One Or More Data Is Missing",
    });
  }

  let findDepartment = await Department.findOne({
    departmentname: departmentname,
  });

  if (findDepartment) {
    return res.status(400).json({
      message: "Error: Duplicate Department",
    });
  }

  try {
    let findHOD = await User.findById(headofdepartment);

    if (!findHOD) {
      return res.status(400).json({
        message: "HOD is not found",
      });
    }

    let department = new Department({
      departmentname: departmentname,
      discription: departmentdiscription,
      HOD: findHOD._id,
      established: departmentestd,
    });

    await department.save();
    return res.status(200).json({
      message: "Department Created",
    });
  } catch (err) {
    res.status(400).json({
      message: `${err.name}: ${err.message}`,
    });
  }
};

export const EditDepartment = async (req, res) => {
  let {
    departmentname,
    headofdepartment,
    departmentdiscription,
    departmentestd,
  } = req.body;
  let departmentid = req.params.departmentid;
  if (!departmentname || !headofdepartment || !departmentestd) {
    return res.status(400).json({
      message: "One Or More Data Is Missing",
    });
  }

  
  try {
    let findDepartment = await Department.findById(departmentid);
    if (!findDepartment) {
      return res.status(400).json({
        message: "Error: Department not found",
      });
    }
    let findHOD = await User.findById(headofdepartment);

    if (!findHOD) {
      return res.status(400).json({
        message: "HOD is not found",
      });
    }

    ((findDepartment.departmentname = departmentname),
      (findDepartment.discription = departmentdiscription),
      (findDepartment.HOD = findHOD._id),
      (findDepartment.established = departmentestd));

    await findDepartment.save();
    return res.status(200).json({
      message: "Department Edited",
    });
  } catch (err) {
    res.status(400).json({
      message: `${err.name}: ${err.message}`,
    });
  }
};
