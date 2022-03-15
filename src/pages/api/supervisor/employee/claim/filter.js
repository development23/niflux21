import createHandler from "@/middleware";
import Employee from "models/Employee";
import Mongoose from "mongoose";
import moment from "moment";

const handler = createHandler();

handler.post((req, res) => {
  //   console.log(req.body);
  let startOfMonth;
  let endOfMonth;
  if (req.body.month === "thisMonth") {
    startOfMonth = moment().startOf("month").toDate();
    endOfMonth = moment().endOf("month").toDate();
  } else if (req.body.month === "lastMonth") {
    startOfMonth = moment().subtract(1, "M").startOf("month").toDate();
    endOfMonth = moment().subtract(1, "M").endOf("month").toDate();
  } else if (req.body.month != "thisMonth" && req.body.month != "lastMonth") {
    startOfMonth = moment(req.body.month, "YYYY-MM").startOf("month").toDate();
    endOfMonth = moment(req.body.month, "YYYY-MM").endOf("month").toDate();
  }

  //   console.log(endOfMonth);

  Employee.aggregate([
    {
      $match: {
        _id: Mongoose.Types.ObjectId(req.body.eid),
        // beatType: "Local",
      },
    },

    { $unwind: "$beats" },
    { $sort: { "beats.createdAt": -1 } },

    {
      $match: {
        $and: [
          { "beats.createdAt": { $gte: startOfMonth } },
          { "beats.createdAt": { $lte: endOfMonth } },
        ],
      },
    },

    {
      $project: {
        beats: 1,
        _id: 1,
        name: 1,
        disObj: { $toObjectId: "$beats.distributer" },
      },
    },
    {
      $lookup: {
        from: "distributers",
        localField: "disObj",
        foreignField: "_id",
        as: "beats.distributer",
      },
    },
  ])
    .then((data) =>
      res.status(200).json({ message: "Success", employee: data })
    )
    .catch((e) => {
      console.log(e);
      res.status(401).json({ message: "Failed", data: e });
    });
});

export default handler;
