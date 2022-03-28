import createHandler from "@/middleware";
import Employee from "models/Employee";

const handler = createHandler();

handler.put((req, result) => {
  Employee.updateOne(
    {
      _id: req.body.id,
      "claims._id": req.body.claimId,
    },
    {
      $set: {
        "claims.$.status": req.body.status,
      },
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
