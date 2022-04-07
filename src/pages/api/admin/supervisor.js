import createHandler from "@/middleware";

import Supervisor from "models/Supervisor";

const handler = createHandler();

handler.post(async (req, res) => {
  //   console.log(req.body);
  const data = req.body;
  const supervisor = await new Supervisor(data);
  //   console.log(vendor);
  supervisor
    .save()
    .then((result) =>
      res.status(201).json({ message: "Record Created.", record: result })
    )
    .catch((err) =>
      res.status(403).json({ message: "Something went wrong.", error: err })
    );
});

handler.put(async (req, result) => {
  await Supervisor.updateOne({ _id: req.body._id }, req.body)
    .then((res) => {
      result.status(201).json({ message: "record updated.", record: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", error: err })
    );
});

handler.delete(async (req, res) => {
  const id = req.query.supervisor;

  await Supervisor.findByIdAndDelete(id)
    .then((e) =>
      res.status(200).json({ message: "Record Deleted.", record: e })
    )
    .catch((err) =>
      res.status(403).json({ message: "Something went wrong.", error: err })
    );
});

handler.get(async (req, res) => {
  Supervisor.find({ name: { $regex: req.query.name.toLowerCase() } })
    .then((data) => res.status(200).json({ supervisor: data }))
    .catch((err) =>
      res.status(403).json({ message: "Something went wrong", error: err })
    );
});

export default handler;
