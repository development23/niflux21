import createHandler from "@/middleware";
import Property from "models/Property";

const handler = createHandler();

handler.post(async (req, result) => {
  Property.updateOne(
    { _id: req.body.pid },
    { $push: { ratings: { uid: req.body.uid, rating: req.body.rating } } }
  )
    .then((res) => {
      result.status(201).json({ message: "record updated.", record: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", error: err })
    );
});

handler.put(async (req, result) => {
  // console.log(req.body.uid);
  Property.updateOne(
    { _id: req.body.pid, "ratings.uid": req.body.uid },
    { $set: { "ratings.$": { uid: req.body.uid, rating: req.body.rating } } }
  )
    .then((res) => {
      result.status(201).json({ message: "record updated.", record: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", error: err })
    );
});

export default handler;
