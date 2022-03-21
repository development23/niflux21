import createHandler from "@/middleware";
import AdminModel from "models/Admin";

const handler = createHandler();

var bcrypt = require("bcryptjs");

handler.post(async (req, res) => {
  //   console.log(req.body);
  const response = res;
  const admin = await AdminModel.findOne({ email: req.body.username })
    .then(async (res) => {
      const isValidated = await bcrypt.compare(req.body.password, res.password);
      if (isValidated) {
        response.status(200).json({ success: "Admin Validated", admin: res });
      } else {
        response.status(301).json({ error: "Incorrect Password", admin: res });
      }
    })
    .catch((err) =>
      response.status(404).json({ error: "Not Found", admin: err })
    );
});

export default handler;
