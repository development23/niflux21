import createHandler from "@/middleware";
import Employee from "models/Employee";
import Mongoose from "mongoose";
import moment from "moment";

const handler = createHandler();

handler.put((req, result) => {
  // console.log(req.body);
  Employee.updateOne(
    {
      _id: req.body.id,
      "beats._id": req.body.beatId,
    },
    {
      $push: {
        "beats.$.expenses": req.body.expenses,
      },
      $set: {
        "beats.$.expensesAmount": req.body.expensesAmount,
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
