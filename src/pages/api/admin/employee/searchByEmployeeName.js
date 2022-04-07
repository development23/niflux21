import createHandler from "@/middleware";
import Employee from "models/Employee";

const handler = createHandler();

handler.get(async (req, result) => {
  // console.log(req.query.name.toLowerCase());
  await Employee.find({ name: { $regex: req.query.name.toLowerCase() } })
    .then((res) => {
      // console.log(res);
      result.status(201).json({ message: "Success.", employee: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", err })
    );
});

export default handler;
