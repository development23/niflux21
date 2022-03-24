import createHandler from "@/middleware";
import Employee from "models/Employee";
import Mongoose from "mongoose";
import moment from "moment";
const handler = createHandler();

handler.put(async (req, res) => {
  //   req.body.date = moment().format();
  // console.log(req.body.data.travelTime.startTime);
  req.body.claim = { claimDate: moment().format("YYYY-MM-DD") };
  Employee.updateOne(
    { _id: req.body.id },
    { $push: { claims: req.body.claim } }
  )
    .then((data) => {
      //   console.log(data);
      res.status(200).json({ message: "Success", claims: data });
    })
    .catch((e) => {
      console.log(e);
      res.status(401).json({ message: "Failed", data: e });
    });
});
handler.get(async (req, result) => {
  await Employee.aggregate([
    { $match: { _id: Mongoose.Types.ObjectId(req.query.id) } },
    { $unwind: "$claims" },
    { $sort: { "claims.createdAt": -1 } },
    {
      $project: {
        claims: 1,
      },
    },
  ])
    .then((res) => {
      result.status(201).json({ message: "success", claims: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", err })
    );
});
export default handler;
