import createHandler from "@/middleware";

const handler = createHandler();

handler.post(async (req, res) => {
  try {
    const data = req.body.values;
    if (
      data.email === "chahat@aladinntech.in" &&
      data.password === "admin#123"
    ) {
      res.status(200).json({ validate: true });
    } else res.status(200).json({ validate: false });
  } catch (e) {
    res.status(500).json({ error: "Something went wrong." });
  }
});

export default handler;
