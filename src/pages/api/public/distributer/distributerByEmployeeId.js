import createHandler from "@/middleware";
import Distributer from "models/Distributer";

const handler = createHandler();

handler.get(async (req, result) => {
  Distributer.find({ employeeId: req.query.id })
    .then((res) => {
      //   console.log(res);
      result.status(201).json({ message: "Success.", distributer: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", err })
    );
});

export default handler;
