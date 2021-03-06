import Link from "next/link";
import moment from "moment";
import { useRouter } from "next/router";

import dbConnect, { Jsonify } from "middleware/database";
import EmployeeModel from "models/Employee";
import Paginate from "components/Common/Paginate";
import { useRef, useState } from "react";
import axios from "axios";
import Supervisor from "models/Supervisor";
import { Input, InputLabel, MenuItem, Select } from "@mui/material";

export async function getServerSideProps({ query }) {
  const { page } = query;
  const limit = 10;
  await dbConnect();
  const employeesCount = await EmployeeModel.count();
  const employees = await EmployeeModel.find({})
    .limit(limit)
    .sort({ createdAt: "desc" })
    .skip(page ? (page - 1) * limit : 0)
    .exec();

  const supervisors = await Supervisor.find({});

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
  const [preview, setPreview] = useState(null);
  const router = useRouter();
  const previewRef = useRef(null);
  const [sEid, setSEid] = useState(null);
  const [selectedSupervisors, setSelectedSupervisors] = useState("");
  const [employeeState, setEmployeeState] = useState(employees);

  useOutsideAlerter(previewRef);

  function useOutsideAlerter(ref) {
    if (!preview) return;

    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        setPreview(null);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }

  const handlePreview = (employee) => {
    // axios
    //   .get("/api/admin/supervisor")
    //   .then(({ data }) => console.log(data))
    //   .catch((e) => console.log(e));
    setPreview(employee);
    setSEid(employee._id);
  };

  const handleSupervisorAssignment = (value, id) => {
    setSelectedSupervisors(value);
    axios
      .put("/api/admin/employee", {
        supervisor: value,
        _id: sEid,
      })
      .then(({ data }) => router.replace(router.asPath))
      .catch((e) => console.log(e));
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
          <ul className="flex justify-start ">
            <li className="pr-2 text-[18px] pt-1 text-[#ffffff]">
              <Link href="/admin/dashboard"> Home </Link>
            </li>
            <li className="pr-2 pt-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>

            <li className="pr-2 text-[18px] pt-1  text-[#ffffff]">
              <Link href="/admin/employee"> Employee Management </Link>
            </li>
          </ul>
          <ul className="flex justify-end ">
            <li className="pr-2 text-[16px] bg-[#fefefe] text-[#313131] font-semibold pl-4  pr-5 py-2 rounded-3xl ">
              <Link href="/admin/employee/add-employee">Add Employees</Link>
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
                          pathname: "/admin/employee/[employee]",
                          query: { employee: employee._id },
                        }}
                      >
                        <a className="bg-[#ee571b] px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
                          View
                        </a>
                      </Link>

                      {!employee.supervisor && (
                        <button onClick={() => handlePreview(employee)}>
                          <a className="bg-[#ee571b] px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
                            Assign Supervisor
                          </a>
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Paginate
              page={router.query.page}
              limit={limit}
              count={employeesCount}
              link="/admin/employee"
            />
          </div>
        </div>

        <div
          className={`fixed top-0 right-0 w-full h-screen bg-black bg-opacity-20 backdrop-blur-[5px] backdrop-hue-rotate-30 ${
            preview
              ? "translate-x-[0px] opacity-100 z-[48]"
              : "translate-x-[400px] opacity-0 z-[-1]"
          } } transition-all duration-500 transition-ease-in-out  px-6 py-4 shadow-xl rounded-lg`}
        >
          <div
            className={`fixed top-0 right-0 w-full md:w-[500px] h-screen bg-white bg-opacity-90 backdrop-blur-[5px] ${
              preview
                ? "translate-x-[0px] opacity-100"
                : "translate-x-[800px] opacity-0"
            } } transition-all duration-500 transition-ease-in-out z-50 px-6 py-4 shadow-xl rounded-lg`}
            ref={previewRef}
          >
            <div>
              <div className="flex justify-end font-bold tacking-wider">
                <button onClick={() => setPreview(null)}>
                  <i className="fa fa-times"></i> Close
                </button>
              </div>

              <div className="tracking-wider text-slate-700">
                <p className="capitalize">
                  <i className="fa fa-user"></i> {preview?.name}
                </p>
                <div className="flex space-x-3 flex-wrap">
                  <p className="space-x-2">
                    <i className="fa fa-envelope text-orange-400"></i>
                    <span>{preview?.email}</span>
                  </p>
                  <p>
                    <i className="fa fa-phone-alt text-orange-400"></i>{" "}
                    {preview?.phone}
                  </p>
                </div>
                <div className="mt-5">
                  <p>{preview?.vName}</p>
                  <p>{preview?.pName}</p>
                  <p>{preview?.message}</p>
                  <p>
                    {moment(preview?.createdAt).format(
                      "DD MMM, YYYY hh:mm:ss A"
                    )}
                  </p>
                </div>
                <div className="mt-5">
                  <div className="form-group space-y-2">
                    <InputLabel id="demo-simple-select-label">
                      Select Supervisor
                    </InputLabel>
                    <Select
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={selectedSupervisors}
                      label="Assign Supervisor"
                      onChange={({ target }) => {
                        handleSupervisorAssignment(target.value);
                      }}
                      // onBlur={handleBlur("city")}
                      fullWidth
                      // error={errors.city && touched.city ? true : false}
                      // placeholder="Enter Employee's Mobile Number"
                      variant="standard"
                      displayEmpty
                    >
                      <MenuItem value="">
                        <em>Select Supervisor</em>
                      </MenuItem>
                      {supervisors.map((supervisor, index) => (
                        <MenuItem value={supervisor._id} key={index}>
                          {supervisor.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
