import Link from "next/link";
import moment from "moment";
import { useRouter } from "next/router";
import Image from "next/image";

import dbConnect, { Jsonify } from "middleware/database";
import EmployeeModel from "models/Employee";
import { useRef, useEffect, useState } from "react";
import { rgbDataURL } from "util/ColorDataUrl";
import { IconButton } from "@mui/material";
import Mongoose from "mongoose";
import axios from "axios";
import { Loader } from "@googlemaps/js-api-loader";

export async function getServerSideProps({ query }) {
  const { employee, page } = query;
  const startOfMonth = moment().startOf("month").toDate();
  const endOfMonth = moment().endOf("month").toDate();
  await dbConnect();

  const employeeData = await EmployeeModel.aggregate([
    {
      $match: {
        _id: Mongoose.Types.ObjectId(employee),
        // beatType: "Local",
      },
    },

    { $unwind: "$locations" },
    { $sort: { "locations.createdAt": -1 } },

    {
      $match: {
        $and: [
          { "locations.createdAt": { $gte: startOfMonth } },
          { "locations.createdAt": { $lte: endOfMonth } },
        ],
      },
    },

    {
      $project: {
        _id: 1,
        name: 1,
        locations: 1,
      },
    },
  ]);
  // console.log(employeeData[0]);
  return {
    props: {
      employeeData: Jsonify(employeeData),
      id: employee,
    },
  };
}

export default function Employee({ employeeData, id }) {
  const color = "dark";
  const router = useRouter();
  const [preview, setPreview] = useState(null);
  const [sEid, setSEid] = useState(null);
  const [eid, setEid] = useState(id);
  const previewRef = useRef(null);
  const [data, setData] = useState(null);
  const [employee, setEmployee] = useState(employeeData);
  // useEffect(() => {
  //   console.log(employee[0].name);
  // }, []);
  const [selectedDate, setSelectedDate] = useState(
    moment().format("YYYY-MM-DD")
  );
  let googlemap = useRef(null);

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

  const handleDateFilter = (date) => {
    // console.log(moment().format());
    axios
      .post(`/api/supervisor/employee/location/filter`, {
        eid: eid,
        date: date,
      })
      .then(({ data }) => {
        setEmployee(data.employee);
        // console.log(data.employee);
      })
      .catch((e) => console.log(e));
  };
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
              <Link href="/supervisor/all-employee"> Location Management </Link>
            </li>
            <li className="pr-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>

            <li className="pr-2 text-[16px]  text-[#ffffff] capitalize">
              <a href="#"> {employee[0]?.name} Location </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mb-5">
        <button
          onClick={() => {
            setEmployee(employeeData);
          }}
        >
          <a className="bg-[#193f6b] ml-3 mb-5  px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
            ALL
          </a>
        </button>

        <span className="ml-5 mb-5 mt-5 ">
          <input
            type="date"
            name="select month"
            className="bg-gray-200 p-1 border-2 border-[#193f6b] mt-5"
            value={selectedDate}
            onChange={(e) => {
              handleDateFilter(e.target.value), setSelectedDate(e.target.value);
            }}
            max={moment().format("YYYY-MM-DD")}
          />
        </span>
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
                Creation Date
              </th>
            </tr>
          </thead>
          <tbody>
            {employee
              .slice(0)
              .reverse()
              .map((item, index) => (
                <tr key={item.locations._id}>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <button
                      onClick={() =>
                        handlePreview(
                          employee,
                          item.locations.longitude,
                          item.locations.latitude
                        )
                      }
                    >
                      <a className="bg-[#ee571b] px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
                        View Location
                      </a>
                    </button>
                  </td>

                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    <i className="fas fa-calendar text-orange-500 mr-2"></i>
                    {moment(item.locations.createdAt).format(
                      "Do, MMM YY hh:mm a"
                    )}
                  </td>
                </tr>
              ))}
            {employee.length === 0 && (
              <tr>
                <td
                  colSpan="2"
                  className="w-full p-3 bg-slate-500 flex-row  text-center"
                >
                  <a className="text-white">No Record Found</a>
                </td>
              </tr>
            )}
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
