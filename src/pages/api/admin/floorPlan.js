import createHandler from "@/middleware";
import Property from "models/Property";
import Mongoose from "mongoose";

const handler = createHandler();
// console.log("floorPlan.js");
handler.post(async (req, result) => {
  await Property.updateOne(
    { _id: req.body._id },
    { $push: { floorPlan: req.body.floorPlan } }
  )
    .then((res) => {
      result.status(201).json({ message: "record updated.", record: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", error: err })
    );
});

handler.put(async (req, result) => {
  await Property.updateOne(
    {
      _id: req.body._id,
      "floorPlan._id": req.body.fid,
    },
    { $set: { "floorPlan.$": req.body.floorPlan } }
  )
    .then((res) => {
      result.status(201).json({ message: "record updated.", record: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", error: err })
    );
});

handler.delete(async (req, result) => {
  await Property.updateOne(
    { _id: req.query.pid },
    { $pull: { floorPlan: { _id: req.query.fid } } }
  )
    .then((res) => {
      result.status(201).json({ message: "record updated.", record: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", error: err })
    );
});

export default handler;
