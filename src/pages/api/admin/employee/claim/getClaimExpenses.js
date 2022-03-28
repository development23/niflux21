import createHandler from "@/middleware";
import Employee from "models/Employee";
import Mongoose from "mongoose";
import moment from "moment";

const handler = createHandler();

handler.post((req, res) => {
  let startOfMonth;
  let endOfMonth;

  startOfMonth = moment(req.body.date).startOf("month").toDate();
  endOfMonth = moment(req.body.date).endOf("month").toDate();

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
