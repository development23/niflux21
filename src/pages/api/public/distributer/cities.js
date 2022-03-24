import createHandler from "@/middleware";
import Distributer from "models/Distributer";

const handler = createHandler();

handler.get(async (req, result) => {
  Distributer.find({ city: { $ne: req.query.userCity } })
    .distinct("city")
    .then((res) => {
      //   console.log(res);
      result.status(201).json({ message: "Success.", cities: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", err })
    );
});

export default handler;
