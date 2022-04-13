import createHandler from "@/middleware";
import Employee from "models/Employee";
import Mongoose from "mongoose";
import moment from "moment";

const handler = createHandler();

handler.put((req, result) => {
  Employee.updateOne(
    {
      _id: req.body.id,
      "beats._id": req.body.beatId,
    },
    {
      $set: {
        "beats.$.others": req.body.others,
        "beats.$.siteStatus": req.body.status,
        "beats.$.activity": req.body.activity,
        "beats.$.status": req.body.statusBody,
      },
      $push: { "beats.$.remarks": { remark: req.body.remark } },
    }
  )
    .then((res) => {
      result.status(201).json({ message: "record updated.", record: res });
    })
    .catch((err) => {
      console.log(err);
      result.status(403).json({ message: "Something went wrong", err });
    });
});

handler.get(async (req, res) => {
  const date = new Date(req.query.date);

  Employee.aggregate([
    {
      $match: {
        _id: Mongoose.Types.ObjectId(req.query.id),
      },
    },

    { $unwind: "$beats" },
    { $sort: { "beats.createdAt": -1 } },

    {
      $match: {
        "beats._id": Mongoose.Types.ObjectId(req.query.beatId),
      },
    },

    {
      $lookup: {
        from: "employees",
        localField: "beats.jointEmployee",
        foreignField: "_id",
        as: "beats.jointEmployee",
      },
    },

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
    {
      $project: {
        beats: 1,
        _id: 1,
        beats: {
          jointEmployee: { name: 1 },
          distributer: 1,
          beat: 1,
          beatType: 1,
          activity: 1,
          distance: 1,
          sitePhoto: 1,
          siteStatus: 1,
          travelTime: 1,
          status: 1,
          others: 1,
          remarks: 1,
          _id: 1,
          expenses: 1,
          expensesAmount: 1,
        },
        // disObj: { $toObjectId: "$beats.distributer" },
      },
    },
  ])
    .then((data) => res.status(200).json({ message: "Success", beat: data }))
    .catch((e) => {
      console.log(e);
      res.status(401).json({ message: "Failed", data: e });
    });
});

export default handler;
