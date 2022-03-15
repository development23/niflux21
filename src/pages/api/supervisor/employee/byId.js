import createHandler from "@/middleware";
import Employee from "models/Employee";

const handler = createHandler();

handler.get((req, result) => {
  // await dbConnect();
  Employee.findOne({ _id: req.query.key })
    .then((res) => {
      result.status(200).json({ message: "record Found.", employee: res });
    })
    .catch((err) => {
      console.log(err);
      result.status(403).json({ message: "Something went wrong", err });
    });
});

export default handler;
