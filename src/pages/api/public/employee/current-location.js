import createHandler from "@/middleware";
import Employee from "models/Employee";

const handler = createHandler();

handler.post(async (req, res) => {
  Employee.updateOne(
    { _id: req.body.id },
    {
      $push: { locations: req.body.location },
      currentLocation: req.body.location,
    }
  )
    .then((data) => {
      console.log(data);
      res.status(200).json({ message: "Success", data: data });
    })
    .catch((e) => {
      console.log(e);
      res.status(401).json({ message: "Failed", data: e });
    });
});

export default handler;
