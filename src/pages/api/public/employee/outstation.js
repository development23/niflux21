import createHandler from "@/middleware";
import Employee from "models/Employee";
import Mongoose from "mongoose";
import moment from "moment";

const handler = createHandler();

handler.post(async (req, res) => {
  //   console.log(req.body.id);
  Employee.updateOne({ _id: req.body.id }, { $push: { beats: req.body.data } })
    .then((data) => {
      //   console.log(data);
      res.status(200).json({ message: "Success", beat: data });
    })
    .catch((e) => {
      console.log(e);
      res.status(401).json({ message: "Failed", data: e });
    });
});

handler.put((req, result) => {
  console.log(req.body.beat.id);
  Employee.updateOne(
    {
      _id: req.body.id,
      "beats._id": req.body.beat.id,
    },
    {
      $set: {
        "beats.$.status": req.body.beat.status,
        "beats.$.distance": req.body.beat.distance,
        "beats.$.travelTime.endTime": req.body.beat.travelTime.endTime,
        "beats.$.travelTime.endCoordinates":
          req.body.beat.travelTime.endCoordinates,
      },
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
  //   const date = new Date(req.query.date);
  //   console.log(req.query.id);
  Employee.aggregate([
    {
      $match: {
        _id: Mongoose.Types.ObjectId(req.query.id),

        // beatType: "Outstation",
        // $or: [{ status: req.query.status }, { status: req.query.sStatus }],
      },
    },

    { $unwind: "$beats" },
    { $sort: { "beats.createdAt": -1 } },

    {
      $match: {
        "beats.beatType": "Outstation",
        $or: [
          { "beats.status": req.query.status },
          { "beats.status": req.query.sStatus },
        ],
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
  ])
    .then((data) => res.status(200).json({ message: "Success", data: data }))
    .catch((e) => {
      console.log(e);
      res.status(401).json({ message: "Failed", data: e });
    });
});

export default handler;
