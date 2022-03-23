import createHandler from "@/middleware";
import axios from "axios";

const handler = createHandler();

handler.post(async (req, res) => {
  // console.log("hello");
  //   console.log(req.body.phone);
  axios
    .post(
      "https://2factor.in/API/V1/9df0a4a6-2873-11ea-9fa5-0200cd936042/ADDON_SERVICES/SEND/TSMS",
      {
        VAR1: req.body.otp,
        // VAR2: req.body.phone,
        // VAR3: process.env.DB_NAME,
        From: "niflux",
        To: req.body.phone,
        TemplateName: "niflux",
      },
      {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      }
    )
    .then(({ data }) => {
      console.log(data);
      res.status(200).json({ success: "OTP Sent.", response: data });
    })
    .catch((err) => res.status(401).json({ error: "Failed.", response: err }));
  // res.status(200).json({ success: "OTP Sent.", response: req.body.otp });
});

export default handler;
