import createHandler from "@/middleware";
import Employee from "models/Employee";
import moment from "moment";
import Mongoose from "mongoose";

const handler = createHandler();

handler.get(async (req, result) => {
  let start = moment().startOf("day").toDate();
  let end = moment().endOf("day").toDate();
  await Employee.aggregate([
    { $unwind: "$attendance" },
    {
      $match: {
        $and: [
          { "attendance.createdAt": { $gte: start } },
          { "attendance.createdAt": { $lte: end } },
        ],
      },
    },
    { $sort: { "attendance.createdAt": -1 } },
    {
      $project: {
        employee: 1,
      },
    },
  ])
    .then((res) => {
      result.status(201).json({ message: "success.", record: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", err })
    );
});

export default handler;
