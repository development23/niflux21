import React from "react";
import Link from "next/link";
import Image from "next/image";
// components

import CardLineChart from "components/Cards/CardLineChart.js";
import CardBarChart from "components/Cards/CardBarChart.js";
import CardPageVisits from "components/Cards/CardPageVisits.js";
import CardSocialTraffic from "components/Cards/CardSocialTraffic.js";

// layout for page
import moment from "moment";
import Admin from "layouts/Admin.js";
import Supervisor from "models/Supervisor";
import Employee from "models/Employee";
import Distributer from "models/Distributer";
import dbConnect from "middleware/database";
// import AdminModel from "models/admin";
export async function getServerSideProps({ query }) {
  // console.log("her");
  const { page } = query;
  // const limit = 10;
  await dbConnect();
  const distributerCount = await Distributer.count();
  const supervisors = await Supervisor.count();
  const employee = await Employee.count();
  let start = moment().startOf("day").toDate();
  let end = moment().endOf("day").toDate();
  const attendance = await Employee.aggregate([
    { $unwind: "$attendance" },
    {
      $match: {
        $and: [
          { "attendance.createdAt": { $gte: start } },
          { "attendance.createdAt": { $lte: end } },
        ],
      },
    },
    { $group: { _id: null, attendance: { $sum: 1 } } },
    { $sort: { "attendance.createdAt": -1 } },
    {
      $project: {
        attendance: 1,
      },
    },
  ]);
  // console.log(attendance[0].attendance);
  return {
    props: {
      distributerCount: distributerCount,
      supervisorsCount: supervisors,
      employeeCount: employee,
      todayAttendance: attendance[0].attendance,
    },
  };
}
export default function Dashboard({
  distributerCount,
  supervisorsCount,
  employeeCount,
  todayAttendance,
}) {
  return (
    <>
      <section className="flex flex-wrap  ">
        {/* <div className="w-full overflow-hidden sm:w-1/4 cursor-pointer">
          <Link href="/admin/vendor/add-vendor">
            <div className={`text-center`}>
              <Image
                src={require("../../../public/images/dashboard/vendor.png")}
              />
              <h2> Add Vendor </h2>
            </div>
          </Link>
        </div> */}
        <div className="w-full overflow-hidden sm:w-1/4 cursor-pointer">
          <Link href="/admin/distributer/add-distributer">
            <div className={`text-center`}>
              <Image
                src={require("../../../public/images/dashboard/vendor.png")}
              />
              <h2> Add Distributor </h2>
            </div>
          </Link>
        </div>

        <div className="w-full overflow-hidden sm:w-1/4 cursor-pointer">
          <Link href="/admin/supervisor/add-supervisor">
            <div className={`text-center`}>
              <Image
                src={require("../../../public/images/dashboard/property.png")}
              />
              <h2> Add Supervisor </h2>
            </div>
          </Link>
        </div>
        <div className="w-full overflow-hidden    sm:w-1/4">
          <Link href="/admin/employee/add-employee">
            <div className={`text-center`}>
              <Image
                src={require("../../../public/images/dashboard/vendor.png")}
              />

              <h2> Add Employees </h2>
            </div>
          </Link>
        </div>

        {/* <div className="w-full overflow-hidden    sm:w-1/4">
          <Link href="/admin/vendor/add-vendor">
            <div className={`text-center`}>
              <Image
                src={require("../../../public/images/dashboard/property.png")}
              />
              <h2> Property Management </h2>
            </div>
          </Link>
        </div> */}
      </section>
      <section className="flex flex-wrap  mt-10">
        {/* <div className="w-full overflow-hidden sm:w-1/4 cursor-pointer">
          <Link href="/admin/vendor/add-vendor">
            <div className={`text-center`}>
              <Image
                src={require("../../../public/images/dashboard/vendor.png")}
              />
              <h2> Add Vendor </h2>
            </div>
          </Link>
        </div> */}
        <div className="w-full overflow-hidden sm:w-1/4 cursor-pointer">
          <Link href="/admin/distributer">
            <div className={`text-center`}>
              <Image
                src={require("../../../public/images/dashboard/vendor.png")}
              />
              <h2> {distributerCount} </h2>
              <h2> All Distributor </h2>
            </div>
          </Link>
        </div>

        <div className="w-full overflow-hidden sm:w-1/4 cursor-pointer">
          <Link href="/admin/supervisor">
            <div className={`text-center`}>
              <Image
                src={require("../../../public/images/dashboard/property.png")}
              />
              <h2> {supervisorsCount} </h2>
              <h2> All Supervisor </h2>
            </div>
          </Link>
        </div>
        <div className="w-full overflow-hidden    sm:w-1/4">
          <Link href="/admin/employee">
            <div className={`text-center`}>
              <Image
                src={require("../../../public/images/dashboard/vendor.png")}
              />
              <h2> {employeeCount} </h2>
              <h2> All Employees </h2>
            </div>
          </Link>
        </div>

        {/* <div className="w-full overflow-hidden    sm:w-1/4">
          <Link href="/admin/vendor/add-vendor">
            <div className={`text-center`}>
              <Image
                src={require("../../../public/images/dashboard/property.png")}
              />
              <h2> Property Management </h2>
            </div>
          </Link>
        </div> */}
      </section>
      <section className="flex flex-wrap  mt-10">
        <div className="w-full overflow-hidden    sm:w-1/4">
          <Link href="/admin/DailyAttendance">
            <div className={`text-center`}>
              <Image
                src={require("../../../public/images/dashboard/vendor.png")}
              />
              <h2> {todayAttendance} </h2>
              <h2> Today's Attendance </h2>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}

Dashboard.layout = Admin;
