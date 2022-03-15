import Link from "next/link";
import moment from "moment";
import { useRouter } from "next/router";
import Image from "next/image";

import dbConnect, { Jsonify } from "middleware/database";
import EmployeeModel from "models/Employee";
import Paginate from "components/Common/Paginate";
import Property from "models/Property";
import { rgbDataURL } from "util/ColorDataUrl";
import { IconButton } from "@mui/material";
import axios from "axios";

export async function getServerSideProps({ query }) {
  const { employee, page } = query;
  // console.log(employee);
  const limit = 10;

  await dbConnect();
  const employeeData = await EmployeeModel.findOne({ _id: employee });

  const propertyCount = await Property.find({ vid: employee }).count();
  const properties = await Property.find({ vid: employee })
    .limit(limit)
    .sort({ createdAt: "desc" })
    .skip(page ? (page - 1) * limit : 0)
    .exec();

  return {
    props: {
      employee: Jsonify(employeeData),
      propertyCount: propertyCount,
      properties: Jsonify(properties),
      limit: limit,
    },
  };
}

export default function Employee({
  employee,
  propertyCount,
  properties,
  limit,
}) {
  const color = "dark";
  const router = useRouter();

  const handleEmployeeDeletion = (employeeId) => {
    const r = confirm(
      "Are you sure you want to delete this employee. With this all the property of this employee will be deleted too?"
    );
    if (!r) return;

    axios
      .delete(`/api/admin/employee?employee=${employeeId}`)
      .then(({ data }) => {
        console.log(data);
        router.replace("/admin/employee");
      })
      .catch((err) => console.log(err));
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
              <Link href="/admin/employee"> Employee Management </Link>
            </li>
            <li className="pr-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>

            <li className="pr-2 text-[16px]  text-[#ffffff] capitalize">
              <a href="/admin/employee"> {employee.name} </a>
            </li>
          </ul>
          <ul className="flex justify-end ">
            <li className="pr-2 text-[16px] bg-[#fefefe] text-[#313131] font-semibold pl-4  pr-5 py-2 rounded-3xl ">
              <Link
                href={{
                  pathname: "/admin/property/add-property",
                  query: { employee: employee._id },
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
                  <span className="capitalize">{employee.name} Details</span>
                </h2>
              </div>

              <IconButton
                aria-label="Edit"
                onClick={() => router.push("edit-employee?key=" + employee._id)}
              >
                <i className="fa fa-pen text-white" />
              </IconButton>

              <IconButton
                aria-label="Attendance"
                onClick={() => router.push("attendance?eid=" + employee._id)}
              >
                <i className="fa fa-calendar text-white" />
              </IconButton>

              <IconButton
                aria-label="delete"
                onClick={() => handleEmployeeDeletion(employee._id)}
              >
                <i className="fa fa-trash text-red-500" />
              </IconButton>
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

      {/* <section className="mt-5">
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
                  Properties of{" "}
                  <span className="capitalize">{employee.name}</span>
                </h2>
              </div>
            </div>
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
                    Property
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
                {properties.map((item, index) => (
                  <tr key={item._id}>
                    <th className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left capitalize">
                      <span
                        className={
                          "ml-3 font-bold capitalize" +
                          +(color === "light" ? "text-slate-600" : "text-white")
                        }
                      >
                        <Link
                          href={{
                            pathname: "/admin/property/[property]",
                            query: { property: item.slug },
                          }}
                        >
                          <a className="flex items-center space-x-2">
                            <span className="w-12 h-12">
                              <Image
                                src={item.thumbnail}
                                className="h-12 w-12 bg-white rounded-full border"
                                alt="..."
                                width={40}
                                height={40}
                                quality={60}
                                placeholder={rgbDataURL(2, 129, 210)}
                                layout="responsive"
                              />
                            </span>{" "}
                            <span>{item.name}</span>
                          </a>
                        </Link>
                      </span>
                    </th>
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
                            `/admin/property/edit-property?key=${item._id}`
                          )
                        }
                      >
                        <i className="fa fa-edit text-slate-300" />
                      </IconButton>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* <Paginate
              page={router.query.page}
              limit={limit}
              count={propertyCount}
              link="/admin/employee"
            /> }
          </div>
        </div>
    </section> */}
    </>
  );
}
