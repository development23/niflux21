import createHandler from "@/middleware";
import Lead from "models/Lead";
import { capitalize } from "../common/property";

const handler = createHandler();

handler.get("/api/admin/leads", async (req, result) => {
  const { limit, page, search } = req.query;
  const leadsCount = await Lead.count();
  await Lead.find({
    $or: [
      { email: { $regex: search.toLowerCase() } },
      { name: { $regex: search } },
      { phone: { $regex: search } },
      { vName: { $regex: capitalize(search) } },
      { pName: { $regex: capitalize(search) } },
    ],
  })
    .collation({ locale: "en", strength: 2 })
    .limit(parseInt(limit))
    .skip(parseInt(page) ? (parseInt(page) - 1) * parseInt(limit) : 0)
    .sort({ createdAt: "desc" })
    .exec()
    .then((res) => {
      result
        .status(200)
        .json({ message: "Success", leads: res, leadsCount: leadsCount });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", error: err })
    );
});

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
