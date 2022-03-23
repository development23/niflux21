import createHandler from "@/middleware";
import Employee from "models/Employee";

const handler = createHandler();

handler.put((req, result) => {
  Employee.updateOne(
    {
      _id: req.body.eid,
      "leaves._id": req.body.lid,
    },
    { $set: { "leaves.$.status": req.body.attendanceStatus } }
  )
    .then((res) => {
      result.status(201).json({ message: "record updated.", record: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", err })
    );
});

export default handler;
