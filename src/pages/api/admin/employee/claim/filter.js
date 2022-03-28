import createHandler from "@/middleware";
import Employee from "models/Employee";
import Mongoose from "mongoose";
import moment from "moment";

const handler = createHandler();

handler.post((req, res) => {
  // console.log(req.body);
  let startOfMonth;
  let endOfMonth;
  if (req.body.month === "thisYear") {
    startOfMonth = moment().startOf("year").toDate();
    endOfMonth = moment().endOf("year").toDate();
  } else if (req.body.month === "lastYear") {
    startOfMonth = moment().subtract(1, "Y").startOf("year").toDate();
    endOfMonth = moment().subtract(1, "Y").endOf("year").toDate();
  } else if (req.body.month != "thisYear" && req.body.month != "lastYear") {
    startOfMonth = moment(req.body.month, "YYYY-MM").startOf("year").toDate();
    endOfMonth = moment(req.body.month, "YYYY-MM").endOf("year").toDate();
  }

  //   console.log(endOfMonth);

  Employee.aggregate([
    {
      $match: {
        _id: Mongoose.Types.ObjectId(req.body.eid),
        // beatType: "Local",
      },
    },

    { $unwind: "$claims" },
    { $sort: { "claims.createdAt": -1 } },

    {
      $match: {
        $and: [
          { "claims.createdAt": { $gte: startOfMonth } },
          { "claims.createdAt": { $lte: endOfMonth } },
        ],
      },
    },

    {
      $project: {
        _id: 1,
        name: 1,
        claims: 1,
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
