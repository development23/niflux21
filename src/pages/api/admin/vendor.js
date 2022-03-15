import createHandler from "@/middleware";
import Property from "models/Property";
import Vendor from "models/Vendor";

const handler = createHandler();

var bcrypt = require("bcryptjs");

handler.post(async (req, res) => {
  //   console.log(req.body);
  const data = req.body;
  const vendor = await new Vendor(data);
  //   console.log(vendor);
  vendor
    .save()
    .then((result) =>
      res.status(201).json({ message: "Record Created.", record: result })
    )
    .catch((err) =>
      res.status(403).json({ message: "Something went wrong.", error: err })
    );
});

handler.put(async (req, result) => {
  await Vendor.updateOne({ _id: req.body._id }, req.body)
    .then((res) => {
      result.status(201).json({ message: "record updated.", record: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", error: err })
    );
});

handler.delete(async (req, res) => {
  const id = req.query.vendor;

  await Property.deleteMany({ vid: id })
    .then(async (data) => {
      console.log(data);

      await Vendor.findByIdAndDelete(id)
        .then((e) =>
          res.status(200).json({ message: "Record Deleted.", record: e })
        )
        .catch((err) =>
          res.status(403).json({ message: "Something went wrong.", error: err })
        );
    })
    .catch((err) => console.log(err));
});

export default handler;
