import createHandler from "@/middleware";
import Employee from "models/Employee";
import moment from "moment";
import Mongoose from "mongoose";

const handler = createHandler();

handler.post(async (req, result) => {
  // console.log(req.body.ids);
  await Employee.find({ _id: { $nin: req.body.ids } })
    .then((res) => {
      result.status(201).json({ message: "success.", employees: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", err })
    );
});

export default handler;
