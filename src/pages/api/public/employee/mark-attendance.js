import createHandler from "@/middleware";
import Employee from "models/Employee";
import Mongoose from "mongoose";
import moment from "moment";

const handler = createHandler();

handler.post(async (req, res) => {
  req.body.attendance.date.date = moment().format("YYYY-MM-DD");
  req.body.attendance.date.signIn = moment().format();
  // console.log();
  const attendance = await Employee.findOne({
    _id: req.body.id,
    "attendance.date": req.body.attendance.date.date,
  });

  // console.log(attendance);

  if (!attendance) {
    // console.log(req.body.attendance.date.date);

    console.log(req.body.attendance.date);

    Employee.updateOne(
      { _id: req.body.id },
      { $push: { attendance: req.body.attendance.date } }
    )
      .then((data) => {
        // console.log(data);
        res.status(200).json({ message: "Success", data: data });
      })
      .catch((e) => {
        console.log(e);
        res.status(401).json({ message: "Failed", data: e });
      });
  } else {
    res.status(409).json({
      message: "Duplicate Signin.",
      data: `User has already Signed in for this  ${moment().format(
        "DD, MMM YYYY"
      )}.`,
    });
  }
});

handler.put((req, result) => {
  req.body.attendance.date.date = moment().format("YYYY-MM-DD");
  req.body.attendance.date.signOut = moment().format();
  // console.log(req.body.attendance.date);
  Employee.updateOne(
    {
      _id: req.body.id,
      "attendance.date": req.body.attendance.date.date,
    },
    {
      $set: {
        "attendance.$.signOut": req.body.attendance.date.signOut,
        "attendance.$.signOutCoordinates":
          req.body.attendance.date.signOutCoordinates,
      },
    }
  )
    .then((res) => {
      result.status(201).json({ message: "record updated.", record: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", err })
    );
});

handler.get(async (req, res) => {
  // console.log(req.query.id);
  Employee.aggregate([
    // Get just the docs that contain a shapes element where color is 'red'
    { $match: { _id: Mongoose.Types.ObjectId(req.query.id) } },
    {
      $project: {
        attendance: {
          $filter: {
            input: "$attendance",
            as: "attendance",
            cond: { $eq: ["$$attendance.date", req.query.date] },
          },
        },
        _id: 0,
      },
    },
  ])
    .then((data) => res.status(200).json({ message: "Success", data: data }))
    .catch((e) => {
      console.log(e);
      res.status(401).json({ message: "Failed", data: e });
    });
});

export default handler;
