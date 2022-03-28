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
              <Link href="/admin/dashboard"> Home </Link>{" "}
            </li>
            <li className="pr-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>
            <li className="pr-2 text-[16px]  text-[#ffffff]">
              <a> Leave Management </a>
            </li>
            <li className="pr-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>

            <li className="pr-2 text-[16px]  text-[#ffffff] capitalize">
              <a href={`/admin/employee/${employee?._id}`}> {employee.name}</a>
            </li>
            <li className="pr-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>
            <li className="pr-2 text-[16px]  text-[#ffffff]">
              <a> Leave </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="m-7">
        <Link
          href={{
            pathname: "/admin/employee/leave/pending/[employee]",
            query: { employee: employee._id },
          }}
        >
          <a className="bg-[#193f6b] ml-3 px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
            Pending Leave
          </a>
        </Link>

        <Link
          href={{
            pathname: "/admin/employee/leave/approve/[employee]",
            query: { employee: employee._id },
          }}
        >
          <a className="bg-[#193f6b] ml-3 px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
            Approved Leave
          </a>
        </Link>

        <Link
          href={{
            pathname: "/admin/employee/leave/reject/[employee]",
            query: { employee: employee._id },
          }}
        >
          <a className="bg-[#193f6b] ml-3 px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
            Reject Leave
          </a>
        </Link>
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
                From/To
              </th>

              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-slate-50 text-slate-500 border-slate-100"
                    : "bg-slate-600 text-slate-200 border-slate-500")
                }
              >
                Reason
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
            </tr>
          </thead>
          <tbody>
            {employee.leaves
              .slice(0)
              .reverse()
              .map((item, index) => (
                <tr key={item._id}>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <i className="fas fa-calendar text-orange-500 mr-2"></i>
                    {moment(item.from).format("Do, MMM YY")} /{" "}
                    {moment(item.to).format("Do, MMM YY")}
                  </td>

                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <b> {item.reason} </b>
                  </td>

                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <i className={`fas fa-circle ${"text-red-500"} mr-2`}></i>
                    {item.status}
                  </td>

                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    <i className="fas fa-calendar text-orange-500 mr-2"></i>
                    {moment(item.createdAt).format("Do, MMM YY hh:mm a")}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
