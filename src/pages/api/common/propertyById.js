import createHandler from "@/middleware";
import Property from "models/Property";

const handler = createHandler();

handler.get(async (req, result) => {
  Property.findById(req.query.id)
    .then((res) => {
      result.status(200).json({ message: "record found.", record: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", error: err })
    );
});

export default handler;
