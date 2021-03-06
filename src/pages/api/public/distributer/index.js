import createHandler from "@/middleware";
import Distributer from "models/Distributer";

const handler = createHandler();

handler.get(async (req, result) => {
  //   console.log(req.query.city);

  Distributer.find({ city: req.query.city })
    .then((res) => {
      //   console.log(res);
      result.status(201).json({ message: "Success.", distributer: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", err })
    );
});

export default handler;
