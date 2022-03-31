import createHandler from "@/middleware";
import Employee from "models/Employee";

const handler = createHandler();

handler.put((req, result) => {
  console.log(req.body);
  Employee.updateOne(
    {
      _id: req.body.id,
      "attendance._id": req.body.aid,
    },
    {
      $set: {
        "attendance.$.lateSignInStatus": req.body.status,
      },
    }
  )
    .then((res) => {
      result.status(201).json({ message: "record updated.", record: res });
    })
    .catch((err) => {
      result.status(403).json({ message: "Something went wrong", err });
    });
});

export default handler;
