import createHandler from "@/middleware";
import Employee from "models/Employee";
import Mongoose from "mongoose";

const handler = createHandler();

handler.post(async (req, res) => {
  Employee.updateOne(
    { _id: req.body.id },
    { $push: { leaves: req.body.leave } }
  )
    .then((data) => {
      console.log(data);
      res.status(200).json({ message: "Success", data: data });
    })
    .catch((e) => {
      console.log(e);
      res.status(401).json({ message: "Failed", data: e });
    });
});

// handler.put((req, result) => {
//   Employee.updateOne(
//     {
//       _id: req.body.id,
//       "leaves._id": req.body.leave.id,
//     },
//     { $set: { "leaves.$.status": req.body.leave.status } }
//   )
//     .then((res) => {
//       result.status(201).json({ message: "record updated.", record: res });
//     })
//     .catch((err) =>
//       result.status(403).json({ message: "Something went wrong", err })
//     );
// });

handler.get(async (req, res) => {
  // console.log(req.query.id);

  Employee.aggregate([
    {
      $match: {
        _id: Mongoose.Types.ObjectId(req.query.id),
        "leaves.0": { $exists: true },
      },
    },
    { $unwind: "$leaves" },

    { $sort: { "leaves.createdAt": -1 } },

    {
      $project: {
        leaves: 1,
        name: 1,
      },
    },
  ])
    .then((data) => {
      // console.log(data);
      res.status(200).json({ message: "Success", leaves: data });
    })
    .catch((e) => {
      console.log(e);
      res.status(401).json({ message: "Failed", data: e });
    });
});

export default handler;
