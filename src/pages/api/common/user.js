import createHandler from "@/middleware";
import User from "models/User";

const handler = createHandler();

handler.post(async (req, result) => {
  const user = new User(req.body);
  await user
    .save()
    .then((res) => {
      result.status(201).json({ message: "record created.", record: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", error: err })
    );
});

handler.get(async (req, result) => {
  User.findOne({ _id: req.query.uid }, { likes: 1, name: 1 })
    .then((res) => {
      result.status(200).json({ message: "record found.", user: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", error: err })
    );
});

export default handler;
