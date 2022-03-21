import createHandler from "@/middleware";
import Lead from "models/Lead";

const handler = createHandler();

handler.post(async (req, result) => {
  const lead = new Lead(req.body);
  await lead
    .save()
    .then((res) => {
      result.status(201).json({ message: "record created.", record: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", error: err })
    );
});

export default handler;
