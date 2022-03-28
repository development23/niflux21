import createHandler from "@/middleware";
import Employee from "models/Employee";
import Mongoose from "mongoose";
import moment from "moment";

const handler = createHandler();

handler.post((req, res) => {
  // console.log(req.body);

  let startOfMonth = moment(req.body.date).startOf("day").toDate();
  let endOfMonth = moment(req.body.date).endOf("day").toDate();

  // console.log(startOfMonth);
  // console.log(endOfMonth);

  Employee.aggregate([
    {
      $match: {
        _id: Mongoose.Types.ObjectId(req.body.eid),
        // beatType: "Local",
      },
    },

    { $unwind: "$locations" },
    { $sort: { "locations.createdAt": -1 } },

    {
      $match: {
        $and: [
          { "locations.createdAt": { $gte: startOfMonth } },
          { "locations.createdAt": { $lte: endOfMonth } },
        ],
      },
    },

    {
      $project: {
        _id: 1,
        name: 1,
        locations: 1,
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
