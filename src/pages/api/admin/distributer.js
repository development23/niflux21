import createHandler from "@/middleware";
import Distributer from "models/Distributer";

const handler = createHandler();

var bcrypt = require("bcryptjs");

handler.get(async (req, result) => {
  // console.log(req.query.name.toLowerCase());
  await Distributer.find({ name: { $regex: req.query.name.toLowerCase() } })
    .then((res) => {
      // console.log(res);
      result.status(201).json({ message: "Success.", distributer: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", err })
    );
});

handler.post(async (req, res) => {
  //   console.log(req.body);
  const data = req.body;
  const distributer = await new Distributer(data);
  //   console.log(vendor);
  distributer
    .save()
    .then((result) =>
      res.status(201).json({ message: "Employee Created.", record: result })
    )
    .catch((err) =>
      res.status(403).json({ message: "Something went wrong.", error: err })
    );
});
handler.delete(async (req, res) => {
  const id = req.query.distributer;

  await Distributer.findByIdAndDelete(id)
    .then((e) =>
      res.status(200).json({ message: "Record Deleted.", record: e })
    )
    .catch((err) =>
      res.status(403).json({ message: "Something went wrong.", error: err })
    );
});
handler.put(async (req, result) => {
  await Distributer.updateOne({ _id: req.body._id }, req.body)
    .then((res) => {
      result.status(201).json({ message: "record updated.", record: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", error: err })
    );
});

export default handler;
