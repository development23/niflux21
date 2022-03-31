import Link from "next/link";
import moment from "moment";
import { useRouter } from "next/router";
import Image from "next/image";

import dbConnect, { Jsonify } from "middleware/database";
import EmployeeModel from "models/Employee";

import { rgbDataURL } from "util/ColorDataUrl";
import { IconButton } from "@mui/material";
import axios from "axios";

export async function getServerSideProps({ query }) {
  const { employee, page } = query;

  await dbConnect();
  const employeeData = await EmployeeModel.findOne({ _id: employee });

  return {
    props: {
      employee: Jsonify(employeeData),
    },
  };
}

export default function Employee({ employee }) {
  const color = "dark";
  const router = useRouter();

  return (
    <>
      <div className="px-2 py-3 bg-slate-600 rounded pl-4 text-white shadow mb-5 backdrop-blur-[5px] space-y-1">
        <div className="justify-between flex">
          <ul className="flex justify-start mt-1">
            <li className="pr-2 text-[16px] text-[#ffffff]">
              <Link href="/supervisor/dashboard"> Home </Link>{" "}
            </li>
            <li className="pr-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>
            <li className="pr-2 text-[16px]  text-[#ffffff]">
              <Link href="/supervisor/all-employee"> Employee Management </Link>
            </li>
            <li className="pr-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>

            <li className="pr-2 text-[16px]  text-[#ffffff] capitalize">
              <a href="/supervisor/all-employee"> {employee.name} </a>
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
                  <span className="capitalize">{employee.name} Details</span>
                </h2>
              </div>

              <IconButton
                aria-label="Edit"
                onClick={() => router.push("edit-employee?key=" + employee._id)}
              >
                <i className="fa fa-pen text-white" />
              </IconButton>

              {/* <IconButton
                aria-label="Attendance"
                onClick={() => router.push("attendance?eid=" + employee._id)}
              >
                <i className="fa fa-calendar text-white" />
              </IconButton> */}

              {/* <IconButton
                aria-label="delete"
                onClick={() => handleEmployeeDeletion(employee._id)}
              >
                <i className="fa fa-trash text-red-500" />
              </IconButton> */}
            </div>
          </div>
          <div className="block w-full  ">
            <div className="px-2 py-3 bg-slate-600 rounded pl-4 text-white shadow   backdrop-blur-[5px] space-y-1">
              <div className="flex flex-wrap overflow-hidden xl:-mx-4">
                <div className="w-full overflow-hidden xl:my-2 xl:px-4 xl:w-full">
                  <p className="text-[18px] ">
                    Name :{" "}
                    <span className="text-[18px] "> {employee?.name} </span>
                  </p>
                </div>

                <div className="w-full overflow-hidden xl:my-2 xl:px-4 xl:w-1/2">
                  <p className="text-[17px] ">
                    Mobile No :{" "}
                    <span className="text-[16px] ">
                      {" "}
                      +91-{employee?.phone}{" "}
                    </span>
                  </p>
                </div>

                <div className="w-full overflow-hidden xl:my-2 xl:px-4 xl:w-1/2">
                  <p className="text-[17px] ">
                    Email :{" "}
                    <span className="text-[16px] "> {employee?.email} </span>
                  </p>
                </div>

                <div className="w-full overflow-hidden xl:my-2 xl:px-4 xl:w-1/2">
                  <p className="text-[17px] ">
                    City :{" "}
                    <span className="text-[16px] "> {employee?.city} </span>
                  </p>
                </div>

                <div className="w-full overflow-hidden xl:my-2 xl:px-4 xl:w-1/2">
                  <p className="text-[17px] ">
                    State :{" "}
                    <span className="text-[16px] "> {employee?.state} </span>
                  </p>
                </div>

                <div className="w-full overflow-hidden xl:my-2 xl:px-4 xl:w-full">
                  <p className="text-[17px] ">
                    Address :{" "}
                    <span className="text-[16px] "> {employee?.address} </span>
                  </p>
                </div>

                <div className="w-full overflow-hidden xl:my-2 xl:px-4 xl:w-full">
                  <p className="text-[17px] ">
                    Created at :
                    <span className="text-[16px] ">
                      {" "}
                      {moment(employee?.createdAt).format(
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
        <div className="flex">
          <Link
            href={{
              pathname: "/supervisor/employee/attendance/[employee]",
              query: { employee: employee._id },
            }}
          >
            <a className="bg-[#193f6b] px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
              Attendance
            </a>
          </Link>

          <Link
            href={{
              pathname: "/supervisor/employee/work/[employee]",
              query: { employee: employee._id },
            }}
          >
            <a className="bg-[#193f6b] ml-3 px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
              Work
            </a>
          </Link>

          <Link
            href={{
              pathname: "/supervisor/employee/location/[employee]",
              query: { employee: employee._id },
            }}
          >
            <a className="bg-[#193f6b] ml-3 px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
              Location
            </a>
          </Link>

          <Link
            href={{
              pathname: "/supervisor/employee/leave/[employee]",
              query: { employee: employee._id },
            }}
          >
            <a className="bg-[#193f6b] ml-3 px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
              Leave
            </a>
          </Link>

          <Link
            href={{
              pathname: "/supervisor/employee/claim/[employee]",
              query: { employee: employee._id },
            }}
          >
            <a className="bg-[#193f6b] ml-3 px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
              Claim
            </a>
          </Link>
        </div>
      </section>
    </>
  );
}
