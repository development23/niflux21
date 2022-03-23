import Link from "next/link";
import moment from "moment";
import { useRouter } from "next/router";
import { getSession, signOut, useSession } from "next-auth/react";

import dbConnect, { Jsonify } from "middleware/database";
import EmployeeModel from "models/Employee";
import Paginate from "components/Common/Paginate";
import { useRef, useState } from "react";
import axios from "axios";
import Supervisor from "models/Supervisor";
import { Input, InputLabel, MenuItem, Select } from "@mui/material";
import { useEffect } from "react";

export async function getServerSideProps(context) {
  const { page } = context.query;

  const session = await getSession(context);

  const limit = 50;
  await dbConnect();

  //console.log(supervisor);

  const employeesCount = await EmployeeModel.find({
    supervisor: session.id,
  }).count();
  const employees = await EmployeeModel.find({ supervisor: session.id })
    .limit(limit)
    .sort({ createdAt: "desc" })
    .skip(page ? (page - 1) * limit : 0)
    .exec();

  // console.log(employeesCount);

  const supervisors = await Supervisor.findOne({ _id: session.id });

  return {
    props: {
      employees: Jsonify(employees),
      employeesCount: employeesCount,
      supervisors: Jsonify(supervisors),
      limit: limit,
    },
  };
}

export default function Employee({
  employees,
  employeesCount,
  limit,
  supervisors,
}) {
  const color = "light";
  const router = useRouter();
  const [sEid, setSEid] = useState(null);
  const [selectedSupervisors, setSelectedSupervisors] = useState("");
  const [employeeState, setEmployeeState] = useState(employees);
  const session = useSession();
  useEffect(() => {}, [session]);

  const handleSearch = ({ target }) => {
    setEmployeeState(
      employees.filter(
        (item) =>
          item.name.toLowerCase().includes(target.value.toLowerCase()) ||
          item.phone.toLowerCase().includes(target.value.toLowerCase()) ||
          item.city.toLowerCase().includes(target.value.toLowerCase())
      )
    );
  };

  return (
    <>
      <div className="px-2 py-3 bg-slate-600 rounded pl-4 text-white shadow mb-5 backdrop-blur-[5px] space-y-1">
        <div className="justify-between flex">
          <ul className="flex justify-start ">
            <li className="pr-2 text-[18px] pt-1 text-[#ffffff]">
              <Link href="/supervisor/dashboard"> Home </Link>
            </li>
            <li className="pr-2 pt-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>

            <li className="pr-2 text-[18px] pt-1  text-[#ffffff]">
              <Link href="/supervisor/all-employee"> Employee Management </Link>
            </li>
          </ul>
        </div>
      </div>

      <section className="mt-5">
        <div
          className={
            "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
            (color === "light" ? "bg-white" : "bg-slate-700 text-white")
          }
        >
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full flex-grow text-center flex-1">
                <h2
                  className={
                    "font-semibold text-lg tracking-widest " +
                    (color === "light" ? "text-slate-700" : "text-white")
                  }
                >
                  Listing of Employees
                </h2>
              </div>
            </div>
          </div>

          <div className="m-5 md:flex">
            <Input
              placeholder="Search Employee"
              variant="standard"
              onChange={handleSearch}
            />
          </div>

          <div className="block w-full overflow-x-auto">
            {/* Projects table */}
            <table className="items-center w-full bg-transparent border-collapse">
              <thead>
                <tr>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-slate-50 text-slate-500 border-slate-100"
                        : "bg-slate-600 text-slate-200 border-slate-500")
                    }
                  >
                    Employee
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-slate-50 text-slate-500 border-slate-100"
                        : "bg-slate-600 text-slate-200 border-slate-500")
                    }
                  >
                    Phone Number
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-slate-50 text-slate-500 border-slate-100"
                        : "bg-slate-600 text-slate-200 border-slate-500")
                    }
                  >
                    Email Address
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-slate-50 text-slate-500 border-slate-100"
                        : "bg-slate-600 text-slate-200 border-slate-500")
                    }
                  >
                    Location
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-slate-50 text-slate-500 border-slate-100"
                        : "bg-slate-600 text-slate-200 border-slate-500")
                    }
                  >
                    Status
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-slate-50 text-slate-500 border-slate-100"
                        : "bg-slate-600 text-slate-200 border-slate-500")
                    }
                  >
                    Creation Date
                  </th>
                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-slate-50 text-slate-500 border-slate-100"
                        : "bg-slate-600 text-slate-200 border-slate-500")
                    }
                  >
                    Action
                  </th>

                  <th
                    className={
                      "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                      (color === "light"
                        ? "bg-slate-50 text-slate-500 border-slate-100"
                        : "bg-slate-600 text-slate-200 border-slate-500")
                    }
                  >
                    Attendance
                  </th>
                </tr>
              </thead>
              <tbody>
                {employeeState.map((employee, index) => (
                  <tr key={employee._id}>
                    <th className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left capitalize">
                      <span
                        className={
                          "ml-3 font-bold capitalize" +
                          +(color === "light" ? "text-slate-600" : "text-white")
                        }
                      >
                        {employee.name}
                      </span>
                    </th>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <i className="fas fa-phone-alt text-orange-500 mr-2"></i>
                      {employee.phone}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <i className="fas fa-envelope text-orange-500 mr-2"></i>
                      {employee.email}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 capitalize">
                      {employee.city}, {employee.state}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <div className="flex items-center">
                        <i
                          className={`fas fa-circle ${
                            employee.active ? "text-green-500" : "text-red-500"
                          } mr-2`}
                        ></i>
                        {employee.active ? "Active" : "Inactive"}
                      </div>
                    </td>

                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      {moment(employee.createdAt).format("Do, MMM YY hh:mm a")}
                    </td>

                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left space-x-3">
                      <Link
                        href={{
                          pathname: "/supervisor/employee/[employee]",
                          query: { employee: employee._id },
                        }}
                      >
                        <a className="bg-[#ee571b] px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
                          View
                        </a>
                      </Link>
                    </td>

                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left space-x-3">
                      <Link
                        href={{
                          pathname:
                            "/supervisor/employee/attendance/[employee]",
                          query: { employee: employee._id },
                        }}
                      >
                        <a className="bg-[#ee571b] px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
                          Attendance
                        </a>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Paginate
              page={router.query.page}
              limit={limit}
              count={employeesCount}
              link="/supervisor/all-employee"
            />
          </div>
        </div>
      </section>
    </>
  );
}
