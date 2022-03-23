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
        "beats.$.expenses": req.body.expenses,
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

export default handler;
