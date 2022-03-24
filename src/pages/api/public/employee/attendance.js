import createHandler from "@/middleware";
import Employee from "models/Employee";
import Mongoose from "mongoose";

const handler = createHandler();

handler.get(async (req, result) => {
  // console.log(req.query.id);

  await Employee.aggregate([
    { $match: { _id: Mongoose.Types.ObjectId(req.query.id) } },
    { $unwind: "$attendance" },
    { $sort: { "attendance.createdAt": -1 } },
    {
      $project: {
        attendance: 1,
      },
    },
  ])
    .then((res) => {
      result.status(201).json({ message: "record updated.", record: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", err })
    );
});

export default handler;
