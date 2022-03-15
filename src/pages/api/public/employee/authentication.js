import createHandler from "@/middleware";
import Employee from "models/Employee";

const handler = createHandler();

handler.get(async (req, res) => {
  // console.log(req.query.phone);

  Employee.aggregate([
    {
      $lookup: {
        from: "supervisors",
        localField: "supervisor",
        foreignField: "_id",
        as: "supervisorDetails",
      },
    },
    {
      $match: { phone: req.query.phone },
    },
    // { $group: "name" },
    { $limit: 1 },
    {
      $project: {
        name: 1,
        email: 1,
        phone: 1,
        _id: 1,
        city: 1,
        state: 1,
        currentLocation: 1,
        address: 1,
        dob: 1,
        department: 1,
        gender: 1,
        aadharNo: 1,
        designation: 1,
        employeeCode: 1,
        profile_image: 1,
        beatsCount: { $size: "$beats" },
        leavesCount: { $size: "$leaves" },
        attendanceCount: { $size: "$attendance" },
        supervisorDetails: {
          name: 1,
          phone: 1,
        },
      },
    },
  ])
    .then((employee) =>
      res.status(200).json({ message: "Success", employee: employee })
    )
    .catch((err) => {
      console.log(err);
      res.status(401).json({ message: "Record Not Found", err: err });
    });

  //   res.status(200).json({ name: "John Doe" });
});

handler.post(async (req, res) => {
  console.log(req.body);
  res.status(200).json({ name: "John Doe" });
});

export default handler;
