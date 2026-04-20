import Department from "../../models/department.js";
import User from "../../models/user.js";
import Course from "../../models/course.js";

export const CreateCourse = async (req, res) => {
  let { coursename, coursecode, totalsemester } = req.body;
  let departmentid = req.params.departmentid;
  let image = req.departmentimage;

  if (!coursename || !coursecode || !departmentid) {
    return res.status(400).json({
      message: "One Or More Data Is Missing",
    });
  }
  if (isNaN(totalsemester)) {
    return res.status(400).json({
      message: "Number Input is not a number",
    });
  }
  try {
    let findDepartment = await Department.findOne({
      _id: departmentid,
    });

    if (!findDepartment) {
      return res.status(400).json({
        message: "Error: Department Not Found",
      });
    }

    let findcourse = await Course.findOne({
      $or: [{ coursename: coursename }, { coursecode: coursecode }],
    });
    if (findcourse) {
      return res.status(400).json({
        message: "Course With this name or code already exists",
      });
    }

    let course = new Course({
      coursename,
      coursecode,
      TotalSemesters: totalsemester,
      Department: findDepartment._id,
    });

    await course.save();
    return res.status(200).json({
      message: "Course Created",
    });
  } catch (err) {
    res.status(400).json({
      message: `${err.name}: ${err.kind} error in ${err.path}:${err.value}`,
    });
  }
};

export const EditCourse = async (req, res) => {
  let { coursename, coursecode, totalsemester, departmentid } = req.body;
  let courseid = req.params.courseid;
  let image = req.departmentimage;

  if (!coursename || !coursecode || !courseid) {
    return res.status(400).json({
      message: "One Or More Data Is Missing",
    });
  }
  if (isNaN(totalsemester)) {
    return res.status(400).json({
      message: "Number Input is not a number",
    });
  }
  try {
    let findDepartment = await Department.findOne({
      _id: departmentid,
    });

    if (!findDepartment) {
      return res.status(400).json({
        message: "Error: Department Not Found",
      });
    }
    let findcurrentcourse = await Course.findById(courseid);
    if (!findcurrentcourse) {
      return res.status(400).json({
        message: "Course doesnot exists",
      });
    }

    let findcourse = await Course.findOne({
      _id: { $ne: findcurrentcourse._id },
      $or: [{ coursename: coursename }, { coursecode: coursecode }],
    });
    if (findcourse) {
      return res.status(400).json({
        message: "Course With this name or code already exists",
      });
    }

    ((findcurrentcourse.coursename = coursename),
      (findcurrentcourse.coursecode = coursecode),
      (findcurrentcourse.TotalSemesters = totalsemester),
      (findcurrentcourse.Department = findDepartment._id));

    await findcurrentcourse.save();
    return res.status(200).json({
      message: "Course Edited",
    });
  } catch (err) {
    res.status(400).json({
      message: `${err.name}: ${err.kind} error in ${err.path}:${err.value}`,
    });
  }
};
