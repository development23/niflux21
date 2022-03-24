import dbConnect, { Jsonify } from "middleware/database";
import Employee from "models/Employee";
import moment from "moment";
import { Formik, Field, Form } from "formik";
import axios from "axios";
import { useRouter } from "next/router";

export async function getServerSideProps() {
  dbConnect();
  //   const employees = await Employee.find(
  //     { "leaves.0": { $exists: true } },
  //     { leaves: 1, name: 1 },
  //     { sort: { "leaves.createdAt": -1 } }
  //   );

  const employees = await Employee.aggregate([
    { $match: { "leaves.0": { $exists: true } } },
    { $unwind: "$leaves" },

    { $sort: { "leaves.createdAt": -1 } },
    // {
    //   $group: {
    //     _id: "$_id",
    //     leaves: { $push: "$leaves" },
    //     name: {
    //       $addToSet: "$name",
    //     },
    //   },
    // },
    {
      $project: {
        leaves: 1,
        name: 1,
      },
    },
  ]);

  // console.log("===============================================");

  // console.log(employees);

  return {
    props: {
      employees: Jsonify(employees),
    },
  };
}

export default function Leaves({ employees }) {
  const color = "light";
  const router = useRouter();
  // console.log(employees);

  const handleStatusChange = (values) => {
    const r = confirm("Are you sure?");
    if (!r) return;

    axios
      .put(`/api/admin/employee/leave`, {
        ...values,
      })
      .then(({ data }) => {
        console.log(data);
        router.replace(router.asPath);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div>
      <div className="px-2 py-3 bg-slate-600 rounded pl-4 text-white shadow mb-5 backdrop-blur-[5px] space-y-1">
        <div className="justify-between flex">
          <ul className="flex justify-start ">
            <li className="pr-2 text-[16px] pt-1 text-[#ffffff]">
              <a href="/admin/dashboard"> Home </a>
            </li>
            <li className="pr-2 pt-1">
              <i className="fas fa-chevron-right text-[13px] text-[#ffffff]"></i>
            </li>

            <li className="pr-2 text-[16px] pt-1  capitalize text-[#ffffff]">
              <a href="/admin/employee"> Employee Management </a>
            </li>

            <li className="pr-2 pt-1">
              <i className="fas fa-chevron-right text-[13px] text-[#ffffff]"></i>
            </li>

            <li className="pr-2 text-[16px] pt-1  capitalize text-[#ffffff]">
              <p> Leaves </p>
            </li>
          </ul>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="items-center w-full bg-transparent border-collapse    ">
          <thead>
            <tr>
              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-[#dcdcdd]"
                }
              >
                Name
              </th>
              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-[#dcdcdd]"
                }
              >
                From
              </th>
              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-[#dcdcdd]"
                }
              >
                To
              </th>
              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-[#dcdcdd]"
                }
              >
                Reason
              </th>
              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-[#dcdcdd]"
                }
              >
                Status
              </th>
              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-[#dcdcdd]"
                }
              >
                Remarks
              </th>

              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-[#dcdcdd]"
                }
              >
                Update Status
              </th>
              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-[#dcdcdd]"
                }
              >
                Creation Date
              </th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee, index) => (
              <tr key={index}>
                <th className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left capitalize">
                  {employee.name}
                </th>
                <th className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left capitalize">
                  <span
                    className={
                      "ml-3 font-bold capitalize" +
                      +(color === "light" ? "text-slate-600" : "text-white")
                    }
                  >
                    {employee.leaves.from}
                  </span>
                </th>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <i className="fas fa-phone-alt text-orange-500 mr-2"></i>
                  {employee.leaves.to}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <i className="fas fa-envelope text-orange-500 mr-2"></i>
                  {employee.leaves.reason}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 capitalize">
                  {employee.leaves.status}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <div className="flex items-center">
                    <i
                      className={`fas fa-circle ${
                        employee.leaves.status
                          ? "text-green-500"
                          : "text-red-500"
                      } mr-2`}
                    ></i>
                    {employee.leaves.status}
                  </div>
                </td>
                <td>
                  <Formik
                    initialValues={{
                      attendanceStatus:
                        employee.leaves.status === "pending"
                          ? ""
                          : employee.leaves.status,
                      lid: employee.leaves._id,
                      eid: employee._id,
                    }}
                    onSubmit={handleStatusChange}
                  >
                    {({ setFieldValue, values, handleSubmit }) => (
                      <Form>
                        <Field
                          component="select"
                          id="attendanceStatus"
                          name="attendanceStatus"
                          className="bg-white py-1 px-2 w-full mt-2 rounded-sm border-[1px] border-gray-500"
                          onChange={({ target }) => {
                            setFieldValue("attendanceStatus", target.value);
                            handleSubmit();
                          }}
                          value={values.attendanceStatus}
                        >
                          <option value="" disabled>
                            Select Status
                          </option>
                          <option value="approve">Approve</option>
                          <option value="reject">Reject</option>
                        </Field>
                      </Form>
                    )}
                  </Formik>
                </td>

                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                  {moment(employee.leaves.createdAt).format(
                    "Do, MMM YY hh:mm a"
                  )}
                </td>

                {/* <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left space-x-3">
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
                    </td> */}
              </tr>
            ))}
          </tbody>
        </table>{" "}
      </div>
    </div>
  );
}
