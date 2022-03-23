import createHandler from "@/middleware";
import User from "models/User";

const handler = createHandler();

handler.put(async (req, result) => {
  User.updateOne({ _id: req.body.uid }, { $addToSet: { likes: req.body.pid } })
    .then((res) => {
      result.status(201).json({ message: "record created.", record: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", error: err })
    );
});

handler.post(async (req, result) => {
  User.updateOne({ _id: req.body.uid }, { $pull: { likes: req.body.pid } })
    .then((res) => {
      result.status(201).json({ message: "record created.", record: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", error: err })
    );
});

export default handler;
