import createHandler from "@/middleware";

import Employee from "models/Employee";

const handler = createHandler();

var bcrypt = require("bcryptjs");

// handler.post(async (req, res) => {
//   //   console.log(req.body);
//   const data = req.body;
//   const employee = await new Employee(data);
//   //   console.log(vendor);
//   employee
//     .save()
//     .then((result) =>
//       res.status(201).json({ message: "Employee Created.", record: result })
//     )
//     .catch((err) =>
//       res.status(403).json({ message: "Something went wrong.", error: err })
//     );
// });
handler.get(async (req, res) => {
  Employee.find({ _id: { $ne: req.query.id } })
    .then((data) => {
      res.status(200).json({ message: "Success", data: data });
    })
    .catch((err) =>
      res.status(403).json({ message: "Something went wrong", error: err })
    );
});
handler.put(async (req, result) => {
  //   console.log(req.body);
  Employee.updateOne({ _id: req.body.id }, req.body)
    .then((res) => {
      result.status(201).json({ message: "record updated.", record: res });
    })
    .catch((err) =>
      result.status(403).json({ message: "Something went wrong", error: err })
    );
});

export default handler;
