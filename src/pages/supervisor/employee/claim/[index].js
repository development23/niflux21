import Link from "next/link";
import moment from "moment";
import { useRouter } from "next/router";
import Image from "next/image";
import Mongoose from "mongoose";
import dbConnect, { Jsonify } from "middleware/database";
import EmployeeModel from "models/Employee";
import { useRef, useState } from "react";
import { rgbDataURL } from "util/ColorDataUrl";
import {
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import axios from "axios";
import { Loader } from "@googlemaps/js-api-loader";

export async function getServerSideProps({ query }) {
  const { index } = query;
  const startOfMonth = moment().startOf("month").toDate();
  const endOfMonth = moment().endOf("month").toDate();
  await dbConnect();
  const employeeData = await EmployeeModel.findOne(
    { _id: index },
    {
      name: 1,
    }
  );
  const claimsData = await EmployeeModel.aggregate([
    {
      $match: {
        _id: Mongoose.Types.ObjectId(index),
        // beatType: "Local",
      },
    },

    { $unwind: "$claims" },
    { $sort: { "claims.createdAt": -1 } },

    {
      $match: {
        $and: [
          { "claims.createdAt": { $gte: startOfMonth } },
          { "claims.createdAt": { $lte: endOfMonth } },
        ],
      },
    },

    {
      $project: {
        _id: 1,
        name: 1,
        claims: 1,
      },
    },
    // {
    //   $lookup: {
    //     from: "distributers",
    //     localField: "disObj",
    //     foreignField: "_id",
    //     as: "beats.distributer",
    //   },
    // },
  ]);

  //   console.log(employeeData);

  return {
    props: {
      claimsData: Jsonify(claimsData),
      eid: index,
      employee: Jsonify(employeeData),
    },
  };
}

export default function Claim({ claimsData, eid, employee }) {
  const color = "dark";
  const router = useRouter();
  const [preview, setPreview] = useState(null);
  const [claims, setClaims] = useState(claimsData);
  const [sEid, setSEid] = useState(null);
  const previewRef = useRef(null);
  const [pimg, setImg] = useState(null);
  const [data, setData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment().format("YYYY-MM"));
  let [googlemap, setgooglemap] = useState(null);
  let googlemap1 = useRef(null);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showRemark, setShowRemark] = useState(false);
  const [remarkDataIndex, setRemarkIndex] = useState(null);
  const [beats, setBeats] = useState([]);
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
  const handlePreview = (item) => {
    // console.log(lat);
    //let signInInfo = data;
    // console.log(item?.beats.travelTime.startCoordinates.latitude);
    setPreview(item);
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
      .then(({ data }) => setClaims(data.employee))
      .catch((e) => console.log(e));
  };
  const handleStatusChange = (item, e) => {
    const r = confirm("Are you sure you want to change the status?");

    if (!r) return false;

    const formData = {
      id: eid,
      claimId: item.claims._id,
      status: e.target.value,
    };
    // console.log(formData);
    axios
      .put(`/api/supervisor/employee/claim/claimStatusUpdate`, formData)
      .then(({ data }) => {
        handleThisMonthClaimFilter("thisYear");
      })
      .catch((e) => console.log(e));
  };
  const handleGetExpensesImages = (date, index) => {
    setRemarkIndex(index);
    setLoadingIndex(index);
    setIsLoading(true);
    axios
      .post(`/api/supervisor/employee/claim/getClaimExpenses`, {
        eid: eid,
        date: date,
      })
      .then(({ data }) => {
        setIsLoading(false);
        setBeats(data.employee);
        setShowRemark(!showRemark);
        console.log(data.employee);
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
              <Link href={`/supervisor/employee/${employee?._id}`}>
                Work Management
              </Link>
            </li>
            <li className="pr-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>

            <li className="pr-2 text-[16px]  text-[#ffffff] capitalize">
              <a href={`/supervisor/employee/${employee?._id}`}>
                {employee.name}
              </a>
            </li>
            <li className="pr-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>
            <li className="pr-2 text-[16px]  text-[#ffffff] capitalize">
              <a>Claims</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="mb-5">
        <button
          onClick={() => {
            handleThisMonthClaimFilter("thisYear"),
              setSelectedDate(moment().startOf("year").format("YYYY-MM"));
          }}
        >
          <a className="bg-[#193f6b] ml-3 mb-5  px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
            This Year
          </a>
        </button>
        <button
          onClick={() => {
            handleThisMonthClaimFilter("lastYear"),
              setSelectedDate(
                moment().subtract(1, "Y").startOf("year").format("YYYY-MM")
              );
          }}
        >
          <a className="bg-[#193f6b] ml-3 mb-5  px-4 py-2 text-[#ffffff] text-base font-semibold rounded-[5px]   ">
            Last Year
          </a>
        </button>

        <span className="ml-5 mb-5 mt-5 ">
          <input
            type="month"
            name="select Year"
            className="bg-gray-200 p-1 border-2 border-[#193f6b] mt-5"
            value={selectedDate}
            onChange={(e) => {
              handleThisMonthClaimFilter(e.target.value),
                setSelectedDate(e.target.value);
            }}
          />
        </span>

        <div className="mt-5 px-4">
          {/* <p className="text-2xl space-x-2">
            <span className="font-semibold">Total Distance Travelled:</span>
            <span>
              {employee.reduce(
                (a, v) => (a = a + parseFloat(v.beats.distance)),
                0
              )}
            </span>
          </p> */}
          <p className="text-2xl space-x-2">
            <span className="font-semibold">Total Claims:</span>
            <span>{claims.length}</span>
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
                Created At
              </th>

              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-slate-50 text-slate-500 border-slate-100"
                    : "bg-slate-600 text-slate-200 border-slate-500")
                }
              >
                Updated At
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
                Change Status
              </th>
              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-slate-50 text-slate-500 border-slate-100"
                    : "bg-slate-600 text-slate-200 border-slate-500")
                }
              >
                Expenses Beats
              </th>
            </tr>
          </thead>
          <tbody>
            {claims.map((item, index) => (
              <>
                <tr key={item.claims._id}>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <a>
                      <i className="fas fa-calendar text-orange-500 mr-2"></i>
                      {moment(item.claims.claimDate).format("DD,MMM YYYY")}
                    </a>
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                    <i className="fas fa-clock text-orange-500 mr-2"></i>
                    {moment(item.claims.createdAt).format("hh:mm A")}
                  </td>

                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    <i className="fas fa-clock text-orange-500 mr-2"></i>
                    {moment(item.claims.updatedAt).format("hh:mm A")}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    {item.claims.status}
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    <FormControl sx={{ minWidth: 80, marginTop: 1 }}>
                      <InputLabel id="demo-simple-select-label">
                        Status
                      </InputLabel>
                      <Select
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={item.claims.status}
                        label="status"
                        onChange={(e) => {
                          handleStatusChange(item, e);
                        }}
                      >
                        <MenuItem value={"Pending"}>Pending</MenuItem>

                        <MenuItem value={"Paid"}>Paid</MenuItem>
                      </Select>
                    </FormControl>
                  </td>
                  <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                    <button
                      className="bg-red-500 p-2 ml-1 rounded-sm text-white"
                      // onClick={() => {
                      //   setShowRemark(!showRemark), setRemarkIndex(index);
                      // }}
                      onClick={() => {
                        showRemark
                          ? (setBeats([]), setShowRemark(false))
                          : handleGetExpensesImages(
                              item.claims.claimDate,
                              index
                            );
                      }}
                    >
                      {isLoading && loadingIndex === index ? (
                        <CircularProgress color="inherit" />
                      ) : showRemark && remarkDataIndex == index ? (
                        "Close"
                      ) : (
                        "View"
                      )}
                    </button>
                  </td>
                </tr>
                {showRemark && index == remarkDataIndex && (
                  <>
                    <tr>
                      <td colSpan={6}>
                        <div className="p-1 bg-slate-500 w-full">
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
                                  Distributor
                                </th>
                                <th
                                  className={
                                    "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                                    (color === "light"
                                      ? "bg-slate-50 text-slate-500 border-slate-100"
                                      : "bg-slate-600 text-slate-200 border-slate-500")
                                  }
                                >
                                  Expenses Images
                                </th>
                              </tr>
                            </thead>
                            {beats
                              .slice(0)
                              .reverse()
                              .map((ite, index) => (
                                <tbody>
                                  <tr>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-white text-xs whitespace-nowrap p-4">
                                      <i className="fas fa-calendar text-orange-500 mr-2"></i>
                                      {moment(ite.beats.createdAt).format(
                                        "Do, MMM YYYY"
                                      )}
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-white text-xs whitespace-nowrap p-4">
                                      <i className="fas fa-clock text-orange-500 mr-2"></i>
                                      <b>Start Time - </b>{" "}
                                      {moment(
                                        ite.beats.travelTime.startTime
                                      ).format("Do, MMM YYYY hh:mm A")}{" "}
                                      <br></br>
                                      <b>End Time - </b>{" "}
                                      {moment(
                                        ite.beats.travelTime.endTime
                                      ).format("Do, MMM YYYY hh:mm A")}{" "}
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-white text-xs whitespace-nowrap p-4">
                                      <i className="fas fa-map text-orange-500 mr-2"></i>
                                      {ite.beats.distance + "KM"}
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-white text-xs whitespace-nowrap p-4">
                                      <i className="fas fa-map text-orange-500 mr-2"></i>
                                      {ite.beats.orderStatus.status}
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-white text-xs whitespace-nowrap p-4">
                                      <i className="fas fa-user text-orange-500 mr-2"></i>
                                      {ite.beats.distributer[0].name}
                                    </td>
                                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                                      <button
                                        className="bg-red-500 p-2 ml-1 rounded-sm text-white"
                                        // onClick={() => {
                                        //   setShowRemark(!showRemark), setRemarkIndex(index);
                                        // }}
                                        onClick={() => {
                                          handlePreview(ite.beats);
                                          console.log(ite);
                                        }}
                                      >
                                        View Images
                                      </button>
                                    </td>
                                  </tr>
                                </tbody>
                              ))}
                          </table>
                        </div>
                      </td>
                    </tr>
                  </>
                )}
              </>
            ))}
            {claims.length === 0 && (
              <tr>
                <td colSpan={6} className="bg-slate-500 p-2">
                  <p className="text-center text-white">No Records Found</p>
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
                <i className="fa fa-user"></i> {preview?.beat}
              </p>

              {/* {console.log()} */}

              <div className="mt-5">
                <p> Beat - {preview?.beat}</p>
                <p> Distance - {preview?.distance}</p>

                <p> Beat Status - {preview?.status}</p>
                <p>
                  {" "}
                  Order Status - {preview?.orderStatus.status}{" "}
                  {/* {pimg?.travelTime.startCoordinates.longitude} */}
                </p>
                <p></p>
                <p>
                  {moment(preview?.createdAt).format("DD MMM, YYYY hh:mm:ss A")}
                </p>
                <div className="m-4 flex">
                  <button
                    onClick={() =>
                      handleMap(
                        preview?.travelTime.startCoordinates.longitude,
                        preview?.travelTime.startCoordinates.latitude
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
                        preview?.travelTime.endCoordinates.longitude,
                        preview?.travelTime.endCoordinates.latitude
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
              <b>Expenses Images :-</b>
              <div className="m-3">
                {!preview?.expenses
                  ? ""
                  : preview?.expenses.map((item) => (
                      <div className="mt-2">
                        <a href={item} target="_blank">
                          <Image
                            src={item}
                            className="img-fluid border clickable-image"
                            alt="..."
                            width={100}
                            height={100}
                            quality={60}
                            placeholder={rgbDataURL(2, 129, 210)}
                            layout="responsive"
                          />
                        </a>
                      </div>
                    ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
