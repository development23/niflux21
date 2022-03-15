import Link from "next/link";
import moment from "moment";
import { useRouter } from "next/router";
import Image from "next/image";
import Mongoose from "mongoose";
import dbConnect, { Jsonify } from "middleware/database";
import EmployeeModel from "models/Employee";
import { useRef, useState } from "react";
import { rgbDataURL } from "util/ColorDataUrl";
import { IconButton } from "@mui/material";
import axios from "axios";
import { Loader } from "@googlemaps/js-api-loader";

export async function getServerSideProps({ query }) {
  const { index } = query;
  const startOfMonth = moment().startOf("month").toDate();
  const endOfMonth = moment().endOf("month").toDate();
  await dbConnect();
  const employeeData = await EmployeeModel.aggregate([
    {
      $match: {
        _id: Mongoose.Types.ObjectId(index),
        // beatType: "Local",
      },
    },

    { $unwind: "$beats" },
    { $sort: { "beats.createdAt": -1 } },

    {
      $match: {
        $and: [
          { "beats.createdAt": { $gte: startOfMonth } },
          { "beats.createdAt": { $lte: endOfMonth } },
        ],
      },
    },

    {
      $project: {
        beats: 1,
        _id: 1,
        name: 1,
        disObj: { $toObjectId: "$beats.distributer" },
      },
    },
    {
      $lookup: {
        from: "distributers",
        localField: "disObj",
        foreignField: "_id",
        as: "beats.distributer",
      },
    },
  ]);

  //   console.log(employeeData);

  return {
    props: {
      employeeData: Jsonify(employeeData),
      eid: index,
    },
  };
}

export default function Claim({ employeeData, eid }) {
  const color = "dark";
  const router = useRouter();
  const [preview, setPreview] = useState(null);
  const [employee, setEmployee] = useState(employeeData);
  const [sEid, setSEid] = useState(null);
  const previewRef = useRef(null);
  const [pimg, setImg] = useState(null);
  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM"));
  let [googlemap, setgooglemap] = useState(null);
  let googlemap1 = useRef(null);
  const handlePreview = (item) => {
    // console.log(lat);
    //let signInInfo = data;
    console.log(item?.beats.travelTime.startCoordinates.latitude);
    handleMap(
      item?.beats.travelTime.startCoordinates.longitude,
      item?.beats.travelTime.startCoordinates.latitude
    );
    setImg(item.beats);
    setPreview(item);
    setSEid(item._id);
  };

  const handleMap = (long, lat) => {
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
        map = new google.maps.Map(googlemap1.current, {
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

      setgooglemap(googlemap1);

      //let signInInfo = data;
    } else {
      // console.log(lat);
      // useRef(null);

      setgooglemap(null);
    }
  };

  const handleThisMonthClaimFilter = (month) => {
    // console.log(moment().format());
    axios
      .post(`/api/supervisor/employee/claim/filter`, {
        eid: eid,
        month: month,
      })
      .then(({ data }) => setEmployee(data.employee))
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
              <Link href="/supervisor/employee"> Work Management </Link>
            </li>
            <li className="pr-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>

            <li className="pr-2 text-[16px]  text-[#ffffff] capitalize">
              <a href="/supervisor/all-employee"> {employee.name} Claim </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mb-5">
        <button
          onClick={() => {
            handleThisMonthClaimFilter("thisMonth"),
              setSelectedDate(moment().format("YYYY-MM"));
          }}
        >
          <a className="bg-[#193f6b] ml-3 mb-5  px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
            This Month
          </a>
        </button>
        <button
          onClick={() => {
            handleThisMonthClaimFilter("lastMonth"),
              setSelectedDate(moment().subtract(1, "M").format("YYYY-MM"));
          }}
        >
          <a className="bg-[#193f6b] ml-3 mb-5  px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
            Last Month
          </a>
        </button>

        <span className="ml-5 mb-5 mt-5 ">
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
        </span>

        <div className="mt-5 px-4">
          <p className="text-2xl space-x-2">
            <span className="font-semibold">Total Distance Travelled:</span>
            <span>
              {employee.reduce(
                (a, v) => (a = a + parseFloat(v.beats.distance)),
                0
              )}
            </span>
          </p>
          <p className="text-2xl space-x-2">
            <span className="font-semibold">Total Beats:</span>
            <span>{employee.length}</span>
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
                Beat
              </th>
              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-slate-50 text-slate-500 border-slate-100"
                    : "bg-slate-600 text-slate-200 border-slate-500")
                }
              >
                Distance
              </th>

              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-slate-50 text-slate-500 border-slate-100"
                    : "bg-slate-600 text-slate-200 border-slate-500")
                }
              >
                Site Photo
              </th>

              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-slate-50 text-slate-500 border-slate-100"
                    : "bg-slate-600 text-slate-200 border-slate-500")
                }
              >
                Site Status
              </th>

              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-slate-50 text-slate-500 border-slate-100"
                    : "bg-slate-600 text-slate-200 border-slate-500")
                }
              >
                Beat Status
              </th>

              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-slate-50 text-slate-500 border-slate-100"
                    : "bg-slate-600 text-slate-200 border-slate-500")
                }
              >
                Order Status
              </th>

              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-slate-50 text-slate-500 border-slate-100"
                    : "bg-slate-600 text-slate-200 border-slate-500")
                }
              >
                Travel Time
              </th>

              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-slate-50 text-slate-500 border-slate-100"
                    : "bg-slate-600 text-slate-200 border-slate-500")
                }
              >
                createdAt
              </th>
            </tr>
          </thead>
          <tbody>
            {employee.map((item, index) => (
              <tr key={item.beats._id}>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <button onClick={() => handlePreview(item)}>
                    <a>
                      <i className="fas fa-user text-orange-500 mr-2"></i>
                      {item.beats.beat}
                    </a>
                  </button>
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                  <i className="fas fa-map text-orange-500 mr-2"></i>
                  {item.beats.distance}
                </td>

                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                  {!item.beats.sitePhoto ? (
                    "Not Available"
                  ) : (
                    <Image
                      src={item.beats.sitePhoto}
                      className="img-fluid border clickable-image"
                      alt="..."
                      width={10}
                      height={10}
                      quality={60}
                      placeholder={rgbDataURL(2, 129, 210)}
                      layout="responsive"
                      onClick={() => handlePreview(item)}
                    />
                  )}
                </td>

                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                  {item.beats.siteStatus}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                  {item.beats.status}
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                  {item.beats.orderStatus.status}
                </td>

                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                  <p>
                    {" "}
                    <b>Start Time - </b>{" "}
                    {moment(item.beats.travelTime.startTime).format(
                      "Do, MMM YY hh:mm a"
                    )}{" "}
                    <br></br>
                    <b>End Time - </b>{" "}
                    {moment(item.beats.travelTime.endTime).format(
                      "Do, MMM YY hh:mm a"
                    )}{" "}
                    <br></br>
                    <b>Start Coordinate - </b>{" "}
                    {item.beats.travelTime.startCoordinates.longitude} /{" "}
                    {item.beats.travelTime.startCoordinates.latitude} <br></br>
                    <b> End Coordinate - </b>{" "}
                    {item.beats.travelTime.endCoordinates.longitude} /{" "}
                    {item.beats.travelTime.endCoordinates.latitude}
                  </p>
                </td>
                <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                  {moment(item.beats.createdAt).format("Do, MMM YY hh:mm a")}
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
        className={`overflow-y-auto  fixed top-0 right-0 w-full h-[1000rem] bg-black bg-opacity-20 backdrop-blur-[5px] backdrop-hue-rotate-30 ${
          preview
            ? "translate-x-[0px] opacity-100 z-[48]"
            : "translate-x-[400px] opacity-0 z-[-1]"
        } } transition-all duration-500 transition-ease-in-out  px-6 py-4 shadow-xl rounded-lg`}
      >
        <div
          className={`overflow-y-auto fixed top-0 right-0 w-full md:w-[500px] h-screen bg-white bg-opacity-90 backdrop-blur-[5px] ${
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

              {/* {console.log()} */}

              <div className="mt-5">
                <p> Beat - {pimg?.beat}</p>
                <p> Distance - {pimg?.distance}</p>
                <p> Site Status - {pimg?.siteStatus}</p>
                <p> Beat Status - {pimg?.status}</p>
                <p>
                  {" "}
                  Order Status - {pimg?.orderStatus.status}{" "}
                  {/* {pimg?.travelTime.startCoordinates.longitude} */}
                </p>
                <p></p>
                <p>
                  {moment(pimg?.createdAt).format("DD MMM, YYYY hh:mm:ss A")}
                </p>
                <div className="m-4 flex">
                  <button
                    onClick={() =>
                      handleMap(
                        pimg?.travelTime.startCoordinates.longitude,
                        pimg?.travelTime.startCoordinates.latitude
                      )
                    }
                  >
                    <a className="bg-[#ee571b] px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
                      Beat Start Time
                    </a>
                  </button>

                  <button
                    onClick={() =>
                      handleMap(
                        pimg?.travelTime.endCoordinates.longitude,
                        pimg?.travelTime.endCoordinates.latitude
                      )
                    }
                  >
                    <a className="bg-[#ee571b] px-4 py-2 ml-4 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
                      Beat End Time
                    </a>
                  </button>
                </div>
              </div>

              <div className="m-3">
                <p>
                  <b>Beat Address</b>
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

              <div className="m-3">
                {!pimg?.sitePhoto ? (
                  ""
                ) : (
                  <Image
                    src={pimg?.sitePhoto}
                    className="img-fluid border clickable-image"
                    alt="..."
                    width={100}
                    height={100}
                    quality={60}
                    placeholder={rgbDataURL(2, 129, 210)}
                    layout="responsive"
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
