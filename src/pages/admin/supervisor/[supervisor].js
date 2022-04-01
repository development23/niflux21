import Link from "next/link";
import moment from "moment";
import { useRouter } from "next/router";
import Image from "next/image";

import dbConnect, { Jsonify } from "middleware/database";
import SupervisorModel from "models/Supervisor";
import Paginate from "components/Common/Paginate";
import Employee from "models/Employee";
import { rgbDataURL } from "util/ColorDataUrl";
import { IconButton, Input } from "@mui/material";
import axios from "axios";
import { useState } from "react";

export async function getServerSideProps({ query }) {
  const { supervisor, page } = query;
  // console.log(supervisor);
  const limit = 10;

  await dbConnect();
  const supervisorData = await SupervisorModel.findOne({ _id: supervisor });

  const employeeCount = await Employee.find({ vid: supervisor }).count();
  const employees = await Employee.find({ supervisor: supervisor })
    .limit(limit)
    .sort({ name: 1 })
    .skip(page ? (page - 1) * limit : 0)
    .exec();

  return {
    props: {
      supervisor: Jsonify(supervisorData),
      employeeCount: employeeCount,
      employees: Jsonify(employees),
      limit: limit,
    },
  };
}

export default function Supervisor({
  supervisor,
  employeeCount,
  employees,
  limit,
}) {
  const color = "dark";
  const router = useRouter();
  const [employeeState, setEmployeeState] = useState(employees);
  const handleSupervisorDeletion = (supervisorId) => {
    const r = confirm(
      "Are your sure you want to delete this supervisor. With this all the Employee of this supervisor will be deleted too?"
    );
    if (!r) return;

    axios
      .delete(`/api/admin/supervisor?supervisor=${supervisorId}`)
      .then(({ data }) => {
        console.log(data);
        router.replace("/admin/supervisor");
      })
      .catch((err) => console.log(err));
  };
  const handleSearch = ({ target }) => {
    setEmployeeState(
      employees.filter((item) =>
        item.name.toLowerCase().includes(target.value.toLowerCase())
      )
    );
  };
  return (
    <>
      <div className="px-2 py-3 bg-slate-600 rounded pl-4 text-white shadow mb-5 backdrop-blur-[5px] space-y-1">
        <div className="justify-between flex">
          <ul className="flex justify-start mt-1">
            <li className="pr-2 text-[16px] text-[#ffffff]">
              <Link href="/admin/dashboard"> Home </Link>{" "}
            </li>
            <li className="pr-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>
            <li className="pr-2 text-[16px]  text-[#ffffff]">
              <Link href="/admin/supervisor"> Supervisor Management </Link>
            </li>
            <li className="pr-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>

            <li className="pr-2 text-[16px]  text-[#ffffff]">
              <a href="/admin/supervisor"> {supervisor.name} </a>
            </li>
          </ul>
          <ul className="flex justify-end ">
            <li className="pr-2 text-[16px] bg-[#fefefe] text-[#313131] font-semibold pl-4  pr-5 py-2 rounded-3xl ">
              <Link
                href={{
                  pathname: "/admin/employee/add-employee",
                  query: { supervisor: supervisor._id },
                }}
              >
                <a> Add Employee</a>
              </Link>
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
              <div className="relative w-full px-4 max-w-full text-center flex-grow flex-1">
                <h2
                  className={
                    "font-semibold text-lg tracking-widest " +
                    (color === "light" ? "text-slate-700" : "text-white")
                  }
                >
                  <span className="capitalize">{supervisor.name} Details</span>
                </h2>
              </div>

              <IconButton
                aria-label="delete"
                onClick={() =>
                  router.push("edit-supervisor?key=" + supervisor._id)
                }
              >
                <i className="fa fa-pen text-red-400" />
              </IconButton>

              <IconButton
                aria-label="delete"
                onClick={() => handleSupervisorDeletion(supervisor._id)}
              >
                <i className="fa fa-trash text-red-400" />
              </IconButton>
            </div>
          </div>
          <div className="block w-full  ">
            <div className="px-2 py-3 bg-slate-600 rounded pl-4 text-white shadow   backdrop-blur-[5px] space-y-1">
              <div className="flex flex-wrap overflow-hidden xl:-mx-4">
                <div className="w-full overflow-hidden xl:my-2 xl:px-4 xl:w-full">
                  <p className="text-[18px] ">
                    Name :{" "}
                    <span className="text-[18px] "> {supervisor?.name} </span>
                  </p>
                </div>

                <div className="w-full overflow-hidden xl:my-2 xl:px-4 xl:w-1/2">
                  <p className="text-[17px] ">
                    Mobile No :{" "}
                    <span className="text-[16px] ">
                      {" "}
                      +91-{supervisor?.phone}{" "}
                    </span>
                  </p>
                </div>

                <div className="w-full overflow-hidden xl:my-2 xl:px-4 xl:w-1/2">
                  <p className="text-[17px] ">
                    Email :{" "}
                    <span className="text-[16px] "> {supervisor?.email} </span>
                  </p>
                </div>

                <div className="w-full overflow-hidden xl:my-2 xl:px-4 xl:w-1/2">
                  <p className="text-[17px] ">
                    City :{" "}
                    <span className="text-[16px] "> {supervisor?.city} </span>
                  </p>
                </div>

                <div className="w-full overflow-hidden xl:my-2 xl:px-4 xl:w-1/2">
                  <p className="text-[17px] ">
                    State :{" "}
                    <span className="text-[16px] "> {supervisor?.state} </span>
                  </p>
                </div>

                <div className="w-full overflow-hidden xl:my-2 xl:px-4 xl:w-full">
                  <p className="text-[17px] ">
                    Address :{" "}
                    <span className="text-[16px] ">
                      {" "}
                      {supervisor?.address}{" "}
                    </span>
                  </p>
                </div>

                <div className="w-full overflow-hidden xl:my-2 xl:px-4 xl:w-full">
                  <p className="text-[17px] ">
                    Created at :
                    <span className="text-[16px] ">
                      {" "}
                      {moment(supervisor?.createdAt).format(
                        "DD MMMM YYYY, hh:mm:ss A"
                      )}{" "}
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-5">
        <div
          className={
            "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
            (color === "light" ? "bg-white" : "bg-slate-700 text-white")
          }
        >
          <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full text-center flex-grow flex-1">
                <h2
                  className={
                    "font-semibold text-lg tracking-widest " +
                    (color === "light" ? "text-slate-700" : "text-white")
                  }
                >
                  Employees of{" "}
                  <span className="capitalize">{supervisor.name}</span>
                </h2>
              </div>
            </div>
          </div>
          <div className="m-5 md:flex">
            <Input
              placeholder="Search Employee"
              variant="standard"
              className="text-white"
              onChange={handleSearch}
            />
          </div>
          <div className="block w-full overflow-x-auto">
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
                    Department
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
                </tr>
              </thead>
              <tbody>
                {employeeState.map((item, index) => (
                  <tr key={item._id}>
                    <th className="border-t-0 px-6 text-left border-l-0 border-r-0 text-xs whitespace-nowrap p-4 capitalize">
                      {item.name}
                    </th>

                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      {item.department}
                    </td>

                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <i className="fas fa-map-marker text-green-500 mr-2"></i>{" "}
                      {item.city}, {item.state}
                    </td>

                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <div className="flex items-center">
                        <i
                          className={`fas fa-circle ${
                            item.active ? "text-green-500" : "text-red-500"
                          } mr-2`}
                        ></i>
                        {item.active ? "Active" : "Inactive"}
                      </div>
                    </td>

                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      {moment(item.createdAt).format("Do, MMM YY hh:mm a")}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      <IconButton
                        aria-label="delete"
                        onClick={() =>
                          router.push(
                            `/admin/employee/edit-employee?key=${item._id}`
                          )
                        }
                      >
                        <i className="fa fa-edit text-slate-300" />
                      </IconButton>
                      <Link href={`/admin/employee/${item._id}`}>
                        <a className="bg-[#ee571b] px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
                          View
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
              count={employeeCount}
              // link="/admin/supervisor"
              link={`/admin/supervisor/${supervisor._id}`}
            />
          </div>
        </div>
      </section>
    </>
  );
}
