import React, { useEffect, useRef, useState } from "react";
import EmployeeModel from "models/Employee";
import dbConnect, { Jsonify } from "middleware/database";
import moment from "moment";
import axios from "axios";
import { useRouter } from "next/router";
import Link from "next/link";
import { Loader } from "@googlemaps/js-api-loader";
export async function getServerSideProps({ query }) {
  const { page } = query;
  const limit = 10;
  await dbConnect();
  const employeesCount = await EmployeeModel.count();
  let start = moment().startOf("day").toDate();
  let end = moment().endOf("day").toDate();
  const attendance = await EmployeeModel.aggregate([
    { $unwind: "$attendance" },
    {
      $match: {
        $and: [
          { "attendance.createdAt": { $gte: start } },
          { "attendance.createdAt": { $lte: end } },
        ],
      },
    },
    { $sort: { "attendance.createdAt": -1 } },
    {
      $project: {
        employee: 1,
        name: 1,
        phone: 1,
        email: 1,
        state: 1,
        city: 1,
        attendance: 1,
      },
    },
  ]);

  return {
    props: {
      attendance: Jsonify(attendance),
      employeesCount,
    },
  };
}

export default function index({ attendance, employeesCount }) {
  const [allAttendance, setAllAttendance] = useState(attendance);
  const [empIds, setEmpIds] = useState([]);

  const color = "dark";
  const router = useRouter();
  const [preview, setPreview] = useState(null);
  const [sEid, setSEid] = useState(null);
  const previewRef = useRef(null);
  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM"));
  const [isClicked, setIsClicked] = useState(false);
  let googlemap = useRef(null);
  //   console.log(attendance);
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

  // const source = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBpF6UO18TuzqIXwWlpZzQ9FJvV74xCmK8&callback=initMap`;
  useEffect(() => {
    axios
      .get("/api/admin/employee/dailyAttendance")
      .then(({ data }) => {
        setEmpIds(data.record);
        // axios
        //   .post(`/api/admin/employee/dailyAbsents`, Jsonify(data.record))
        //   .then(({ data }) => {
        //     console.log(data);
        //   })
        //   .catch((err) => console.log(err));
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const handlePreview = (distributer, long, lat) => {
    // console.log(lat);
    if (lat && long) {
      axios
        .get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}&zoom=18&addressdetails=1`
        )
        .then(({ data }) => setData(data))
        .catch((e) => console.log(e));

      const loader = new Loader({
        apiKey: "AIzaSyBA031_Ep_47FjJ3b4vxoTEM4WLuD8_T8U",
        version: "weekly",
      });
      let map;
      loader.load().then(() => {
        const google = window.google;
        map = new google.maps.Map(googlemap.current, {
          center: { lat: parseFloat(lat), lng: parseFloat(long) },
          zoom: 18,
          fullscreenControl: true, // remove the top-right button
          mapTypeControl: true, // remove the top-left buttons
          streetViewControl: false, // remove the pegman
          zoomControl: true,
        });

        new google.maps.Marker({
          position: { lat: parseFloat(lat), lng: parseFloat(long) },
          map,
          title: "Location",
        });
      });

      //let signInInfo = data;
      setPreview(distributer);
      setSEid(distributer._id);
    } else {
      // console.log(lat);
      // useRef(null);

      googlemap = null;

      setPreview(distributer);
      setData({ display_name: "Not Available." });
    }
  };

  const handleAbsentEmployees = () => {
    setIsClicked(true);
    let arr = [];
    attendance.forEach((element) => {
      arr.push(element._id);
    });
    // axios
    //   .post(`/api/admin/employee/dailyAbsents`, Jsonify(data.record))
    //   .then(({ data }) => {
    //     console.log(data);
    //   })
    //   .catch((err) => console.log(err));

    axios
      .post(`/api/admin/employee/dailyAbsents`, { ids: arr })
      .then(({ data }) => setAllAttendance(data.employees))
      .catch((err) => console.log(err?.response));

    // console.log(arr);
  };

  return (
    <>
      <div className="px-2 py-3 bg-slate-600 rounded pl-4 text-white shadow mb-5 backdrop-blur-[5px] space-y-1">
        <div className="justify-between flex">
          <ul className="flex justify-start mt-1">
            <li className="pr-2 text-[16px] text-[#ffffff]">
              <b> Home </b>{" "}
            </li>
            <li className="pr-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>
            <li className="pr-2 text-[16px]  text-[#ffffff]">
              <a> Daily Attendance</a>
            </li>
            <li className="pr-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>
          </ul>
        </div>
      </div>
      <div className="mb-5">
        {/* <button
          onClick={() => {
            handleThisMonthClaimFilter("thisMonth"),
              setSelectedDate(moment().format("YYYY-MM"));
          }}
        >
          <a className="bg-[#193f6b] ml-3 mb-5  px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
            This Month
          </a>
        </button> */}
        {/* <button
          onClick={() => {
            handleThisMonthClaimFilter("lastMonth"),
              setSelectedDate(moment().subtract(1, "M").format("YYYY-MM"));
          }}
        >
          <a className="bg-[#193f6b] ml-3 mb-5  px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
            Last Month
          </a>
        </button> */}

        {/* <span className="ml-5 mb-5 mt-5 ">
          <input
            type="month"
            name="select month"
            className="bg-gray-200 p-1 border-2 border-[#193f6b] mt-5"
            value={selectedDate}
            onChange={(e) => {
              handleThisMonthClaimFilter(e.target.value),
                setSelectedDate(e.target.value);
            }}
          />
        </span> */}

        <div className="mt-5 px-4 flex flex-row justify-between">
          <p className="text-2xl space-x-2">
            <span className="font-semibold">Today's Attendance:</span>
            <span>{attendance.length}</span>
          </p>
          {!isClicked && (
            <button onClick={handleAbsentEmployees}>
              <a className="bg-[#ee571b] px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
                Absent Employees
              </a>
            </button>
          )}
          {isClicked && (
            <button
              onClick={() => {
                setIsClicked(false);
                setAllAttendance(attendance);
              }}
            >
              <a className="bg-[#ee571b] px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
                Present Employees
              </a>
            </button>
          )}
        </div>

        <div className="mt-5 px-4">
          <p className="text-2xl space-x-2">
            <span className="font-semibold">Total Employees:</span>
            <span>{employeesCount}</span>
          </p>
        </div>
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
                Name
              </th>
              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-slate-50 text-slate-500 border-slate-100"
                    : "bg-slate-600 text-slate-200 border-slate-500")
                }
              >
                Date
              </th>
              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-slate-50 text-slate-500 border-slate-100"
                    : "bg-slate-600 text-slate-200 border-slate-500")
                }
              >
                SignIn/SignOut
              </th>

              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-slate-50 text-slate-500 border-slate-100"
                    : "bg-slate-600 text-slate-200 border-slate-500")
                }
              >
                SignIn Coordinates
              </th>

              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-slate-50 text-slate-500 border-slate-100"
                    : "bg-slate-600 text-slate-200 border-slate-500")
                }
              >
                SignOut Coordinates
              </th>

              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-slate-50 text-slate-500 border-slate-100"
                    : "bg-slate-600 text-slate-200 border-slate-500")
                }
              >
                Late SignIn Reason
              </th>

              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-slate-50 text-slate-500 border-slate-100"
                    : "bg-slate-600 text-slate-200 border-slate-500")
                }
              >
                Late SignIn Status
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
                State
              </th>
              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-slate-50 text-slate-500 border-slate-100"
                    : "bg-slate-600 text-slate-200 border-slate-500")
                }
              >
                City
              </th>
            </tr>
          </thead>
          <tbody>
            {allAttendance
              .slice(0)
              .reverse()
              .map((item, index) => (
                <tr key={item._id}>
                  <td className="border-t-0 px-6 align-middle border-l-0 capitalize border-r-0 text-xs whitespace-nowrap p-4">
                    <i className="fas fa-user text-orange-500 mr-2"></i>
                    {item.name}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0  border-r-0 text-xs whitespace-nowrap p-4">
                    <i className="fas fa-calendar text-orange-500 mr-2"></i>
                    {item.attendance.date
                      ? moment(`${item.attendance.date}`).format("MMMM Do YYYY")
                      : "Not Available"}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {/* <i className="fas fa-calendar text-orange-500 mr-2"></i> */}
                    <i class="fas fa-clock text-orange-500 mr-2"></i>
                    {item.attendance.signIn
                      ? moment(`${item.attendance.signIn}`).format("hh:mm A")
                      : "Not Signed Out Yet"}{" "}
                    / <br></br>
                    {item.attendance.signOut
                      ? moment(`${item.attendance.signOut}`).format("hh:mm A")
                      : "Not Signed Out Yet"}
                  </td>

                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {item.attendance.signIn ? (
                      <button
                        onClick={() =>
                          handlePreview(
                            item,
                            item.attendance.signInCoordinates.longitude,
                            item.attendance.signInCoordinates.latitude
                          )
                        }
                      >
                        <a className="bg-[#ee571b] px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
                          SignIn
                        </a>
                      </button>
                    ) : (
                      <button>
                        <a className="bg-slate-500 px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
                          Not Yet
                        </a>
                      </button>
                    )}
                  </td>

                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {item.attendance.signOut ? (
                      <button
                        onClick={() =>
                          handlePreview(
                            item,
                            item.attendance.signOutCoordinates.longitude,
                            item.attendance.signOutCoordinates.latitude
                          )
                        }
                      >
                        <a className="bg-[#ee571b] px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
                          SignOut
                        </a>
                      </button>
                    ) : (
                      <button>
                        <a className="bg-slate-500 px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
                          Not Yet
                        </a>
                      </button>
                    )}
                  </td>

                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {!item.attendance.lateSignInReason
                      ? "Not Found"
                      : item.attendance.lateSignInReason}
                  </td>

                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    {!item.attendance.lateSignInStatus
                      ? "Not Found"
                      : item.attendance.lateSignInStatus}
                  </td>

                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    {moment(item.attendance.createdAt).format(
                      "Do, MMM YY hh:mm a"
                    )}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    {item.state}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    {item.city}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>

        {/* <Paginate
              page={router.query.page}
              limit={limit}
              count={employeesCount}
              link="/supervisor/all-employee"
            /> */}
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
                  {moment(preview?.createdAt).format("DD MMM, YYYY hh:mm:ss A")}
                </p>
              </div>
              <div className="m-3">
                <p>
                  <b>SignIn Address</b>
                  <br></br>
                  <p>
                    <b> {!data ? "Not Available" : data?.display_name} </b>
                  </p>
                </p>

                {!googlemap ? (
                  ""
                ) : (
                  <div id="__next">
                    <div
                      id="map"
                      ref={googlemap}
                      style={{ height: 400, width: 400 }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
