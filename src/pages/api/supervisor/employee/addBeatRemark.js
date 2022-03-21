import createHandler from "@/middleware";
import Employee from "models/Employee";
import Mongoose from "mongoose";
const handler = createHandler();
handler.post((req, result) => {
  Employee.updateOne(
    {
      _id: req.body.eid,
      "beats._id": req.body.beatId,
    },
    {
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

export default handler;
