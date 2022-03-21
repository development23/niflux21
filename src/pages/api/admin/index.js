import createHandler from "@/middleware";
import Admin from "models/Admin";

const handler = createHandler();

handler.post(async (req, res) => {
  //   console.log(req.body);
  const admin = new Admin(req.body);
  admin
    .save()
    .then((result) => {
      res.status(201).json({ success: "Record Created.", record: result });
    })
    .catch((err) => {
      res.status(403).json({ error: "Something went wrong.", record: err });
    });
});

handler.get(async (req, res) => {
  res.status(500).json({ error: "Something went wrong." });

  // try {

  //   const data = req.body;
  //   console.log(data);
  // } catch (e) {
  //   res.status(500).json({ error: "Something went wrong." });
  // }
});

export default handler;
