import createHandler from "@/middleware";
import Employee from "models/Employee";

const handler = createHandler();

handler.put((req, result) => {
  // console.log(req.body);
  Employee.updateOne(
    {
      _id: req.body.id,
      "beats._id": req.body.beatId,
    },
    {
      $set: {
        "beats.$.status": req.body.status,
      },
      $push: { "beats.$.remarks": { remark: req.body.remark } },
    }
  )
    .then((res) => {
      result.status(201).json({ message: "record updated.", record: res });
    })
    .catch((err) => {
      console.log(err);
      result.status(403).json({ message: "Something went wrong", err });
    });
});

export default handler;
