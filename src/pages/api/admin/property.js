import createHandler from "@/middleware";
import Property from "models/Property";

const handler = createHandler();

handler.post(async (req, result) => {
  // console.log(req.body);

  const property = new Property(req.body);
  await property
    .save()
    .then((res) => {
      result.status(201).json({ message: "record created.", record: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", error: err })
    );
});

handler.put(async (req, result) => {
  await Property.updateOne({ _id: req.body._id }, req.body)
    .then((res) => {
      result.status(201).json({ message: "record updated.", record: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", error: err })
    );
});

handler.get(async (req, res) => {
  console.log("here");
  res.status(500).json({ error: "Something went wrong." });
  // try {

  //   const data = req.body;
  //   console.log(data);
  // } catch (e) {
  //   res.status(500).json({ error: "Something went wrong." });
  // }
});

handler.delete(async (req, result) => {
  const id = req.query.property;
  await Property.deleteOne({ _id: id })
    .then((res) => {
      result.status(200).json({ message: "record deleted.", record: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", error: err })
    );
});

export default handler;
