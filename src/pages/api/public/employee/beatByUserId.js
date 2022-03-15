import createHandler from "@/middleware";
import Employee from "models/Employee";
import Mongoose from "mongoose";
import moment from "moment";

const handler = createHandler();

handler.get(async (req, res) => {
  //   console.log(req.query.id);
  Employee.aggregate([
    {
      $match: {
        _id: Mongoose.Types.ObjectId(req.query.id),
      },
    },

    { $unwind: "$beats" },
    { $sort: { "beats.createdAt": -1 } },

    {
      $project: {
        beats: 1,
        _id: 1,
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
    .then((data) => {
      //   console.log(data);
      res.status(200).json({ message: "Success", beats: data });
    })
    .catch((e) => {
      console.log(e);
      res.status(401).json({ message: "Failed", data: e });
    });
});

export default handler;
