import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import moment from "moment";
import { useRouter } from "next/router";
import Image from "next/image";

import dbConnect, { Jsonify } from "middleware/database";
import EmployeeModel from "models/Employee";
import { rgbDataURL } from "util/ColorDataUrl";
import {
  CircularProgress,
  Collapse,
  FormControl,
  IconButton,
  InputLabel,
  List,
  MenuItem,
  Select,
  Zoom,
} from "@mui/material";
import axios from "axios";
import { Loader } from "@googlemaps/js-api-loader";
import * as Yup from "yup";
import { Formik } from "formik";

export async function getServerSideProps({ query }) {
  const { employee, page } = query;

  await dbConnect();
  const employeeData = await EmployeeModel.findOne({ _id: employee });

  return {
    props: {
      employeeData: Jsonify(employeeData),
    },
  };
}
const remarkSchema = Yup.object().shape({
  remark: Yup.string().required("Remark is required"),
});
export default function Employee({ employeeData }) {
  const color = "dark";
  const router = useRouter();
  const [preview, setPreview] = useState(null);
  const [sEid, setSEid] = useState(null);
  const previewRef = useRef(null);
  const [pimg, setImg] = useState(null);
  const [data, setData] = useState(null);
  let [googlemap, setgooglemap] = useState(null);
  let googlemap1 = useRef(null);
  const [loadingIndex, setLoadingIndex] = useState(0);
  const [employee, setEmployee] = useState(employeeData);
  const [isEmployeeUpdating, setIsEmployeeUpdating] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showRemark, setShowRemark] = useState(false);
  const [remarkDataIndex, setRemarkIndex] = useState(null);
  const [addRemark, setAddRemark] = useState(false);

  useEffect(() => {
    console.log("here");
    if (!isEmployeeUpdating)
      axios
        .get(`/api/supervisor/employee/byId?key=${employee._id}`)
        .then(({ data }) => setEmployee(data.employee))
        .catch((e) => console.log(e));
  }, [isEmployeeUpdating]);

  const handlePreview = (distributer, item) => {
    // console.log(lat);
    //let signInInfo = data;
    setImg(item);
    setPreview(distributer);
    setSEid(distributer._id);
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

  const handleStatusChange = (item, e) => {
    const r = confirm("Are you sure you want to change the status?");

    if (!r) return false;

    setIsLoading(true);
    setIsEmployeeUpdating(true);
    const formData = {
      id: employee._id,
      beatId: item._id,
      status: e.target.value,
    };
    // console.log(formData);
    axios
      .put(`/api/supervisor/employee/beatStatusUpdate`, formData)
      .then(({ data }) => {
        setIsEmployeeUpdating(false), setIsLoading(false);
      })
      .catch((e) => console.log(e));
  };

  const handleWorkSearch = ({ target }) => {};

  const handleRemarkSubmission = (values, { resetForm, setStatus }) => {
    const r = confirm("Are you sure you want to submit the remark?");

    if (!r) return false;

    setIsEmployeeUpdating(true);

    axios
      .post(`/api/supervisor/employee/addBeatRemark`, values)
      .then(({ data }) => {
        setIsEmployeeUpdating(false);
        // setStatus("success");
        resetForm({});
        alert("Remark added successfully");
      })
      .catch((e) => console.log(e.response));
    // console.log(values);
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
              <b> Work Management </b>
            </li>
            <li className="pr-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>

            <li className="pr-2 text-[16px]  text-[#ffffff] capitalize">
              <a href="/supervisor/all-employee"> {employee.name} Work </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="block w-full overflow-x-auto">
        {/* Projects table */}
        <input type="text" onChange={handleWorkSearch} />
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
              <th
                className={
                  "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                  (color === "light"
                    ? "bg-slate-50 text-slate-500 border-slate-100"
                    : "bg-slate-600 text-slate-200 border-slate-500")
                }
              >
                remark
              </th>
            </tr>
          </thead>
          {/* {console.log(employee.beats.slice(0).reverse())} */}
          <tbody>
            {employee.beats
              .slice(0)
              .reverse()
              .map((item, index) => (
                <>
                  <tr key={item._id}>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <button onClick={() => handlePreview(employee, item)}>
                        <a>
                          <i className="fas fa-user text-orange-500 mr-2"></i>
                          {item.beat}
                        </a>
                      </button>
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                      <i className="fas fa-map text-orange-500 mr-2"></i>
                      {item.distance}
                    </td>

                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      {!item.sitePhoto ? (
                        "Not Available"
                      ) : (
                        <Image
                          src={item.sitePhoto}
                          className="img-fluid border clickable-image"
                          alt="..."
                          width={10}
                          height={10}
                          quality={60}
                          placeholder={rgbDataURL(2, 129, 210)}
                          layout="responsive"
                          onClick={() => handlePreview(employee, item)}
                        />
                      )}
                    </td>

                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      {item.siteStatus}
                    </td>
                    <td className="border-t-0 px-6 align-middle items-center border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      <FormControl sx={{ minWidth: 80 }}>
                        <InputLabel id="demo-simple-select-label">
                          Status
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={item.status}
                          label="status"
                          onChange={(e) => {
                            handleStatusChange(item, e);
                          }}
                        >
                          <MenuItem value={"Reviewed"}>Reviewed</MenuItem>
                          <MenuItem value={"sdfsdf"}>sdfsdf</MenuItem>
                          <MenuItem value={"Remarked"}>Remarked</MenuItem>
                        </Select>
                      </FormControl>

                      {/* <button
                      className="bg-red-500 p-2 ml-1 rounded-sm text-white"
                      onClick={() => {
                        handleStatusChange(item), setLoadingIndex(index);
                      }}
                    >
                      {isLoading && loadingIndex === index ? (
                        <CircularProgress color="inherit" />
                      ) : (
                        "Change Status"
                      )}
                    </button> */}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      {item.orderStatus.status}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      <b>Start Time - </b>{" "}
                      {moment(item.travelTime.startTime).format(
                        "Do, MMM YY hh:mm a"
                      )}{" "}
                      <br></br>
                      <b>End Time - </b>{" "}
                      {moment(item.travelTime.endTime).format(
                        "Do, MMM YY hh:mm a"
                      )}{" "}
                      <br></br>
                      <b>Start Coordinate - </b>{" "}
                      {item.travelTime.startCoordinates.longitude} /{" "}
                      {item.travelTime.startCoordinates.latitude} <br></br>
                      <b> End Coordinate - </b>{" "}
                      {item.travelTime.endCoordinates.longitude} /{" "}
                      {item.travelTime.endCoordinates.latitude}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      {moment(item.createdAt).format("Do, MMM YY hh:mm a")}
                    </td>
                    <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                      <button
                        className="bg-red-500 p-2 ml-1 rounded-sm text-white"
                        onClick={() => {
                          setShowRemark(!showRemark), setRemarkIndex(index);
                        }}
                      >
                        {isLoading && loadingIndex === index ? (
                          <CircularProgress color="inherit" />
                        ) : showRemark ? (
                          "Close"
                        ) : (
                          "Remark"
                        )}
                      </button>

                      {/* {item.remarks.map((remark, index) => (
                      <b>{remark.remark}</b>
                    ))} */}
                    </td>
                  </tr>

                  {showRemark && index == remarkDataIndex && (
                    <>
                      <tr>
                        <td colSpan="10">
                          {/* <Zoom in={true}> */}
                          <Formik
                            // enableReinitialize
                            initialValues={{
                              remark: "",
                              beatId: item._id,
                              eid: employee._id,
                            }}
                            onSubmit={handleRemarkSubmission}
                            validationSchema={remarkSchema}
                          >
                            {({
                              handleChange,
                              handleBlur,
                              handleSubmit,
                              values,
                              errors,
                              touched,
                              setFieldValue,
                              status,
                            }) => (
                              <div className="bg-gray-300 w-full p-4 ">
                                {/* {console.log(status)}
                                {status && <p>{status}</p>} */}
                                <>
                                  <input
                                    type="text"
                                    className="w-1/2  p-2 rounded-md"
                                    placeholder="Remark"
                                    aria-multiline="true"
                                    onChange={handleChange("remark")}
                                    value={values.remark}
                                    onBlur={handleBlur("remark")}
                                  />
                                  {errors.remark && touched.remark ? (
                                    <p className="text-red-800">
                                      {errors.remark}
                                    </p>
                                  ) : null}
                                </>
                                <div>
                                  <button
                                    type={"submit"}
                                    className="bg-red-500 mt-2 p-2 rounded-md text-white"
                                    onClick={handleSubmit}
                                  >
                                    {isLoading && loadingIndex === index ? (
                                      <CircularProgress color="inherit" />
                                    ) : (
                                      "Add"
                                    )}
                                  </button>
                                </div>
                              </div>
                            )}
                          </Formik>
                          {/* </Zoom> */}
                        </td>
                      </tr>
                      <tr>
                        <td colSpan={10}>
                          <Zoom in={true}>
                            <div>
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
                                      Remark
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
                                  </tr>
                                </thead>
                                {item.remarks
                                  .slice(0)
                                  .reverse()
                                  .map((remark, index) => (
                                    <tbody>
                                      <tr>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                          <i className="fas fa-map text-orange-500 mr-2"></i>
                                          {moment(remark.createdAt).format(
                                            "Do, MMM YY hh:mm a"
                                          )}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                          <i className="fas fa-map text-orange-500 mr-2"></i>
                                          {remark.remark
                                            ? remark.remark
                                            : "No Record"}
                                        </td>
                                        <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                                          <i className="fas fa-map text-orange-500 mr-2"></i>
                                          {moment(remark.updatedAt).format(
                                            "Do, MMM YY hh:mm a"
                                          )}
                                        </td>
                                      </tr>
                                    </tbody>
                                  ))}
                              </table>
                            </div>
                          </Zoom>
                        </td>
                      </tr>
                    </>
                  )}
                </>
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
                <p> Beat - {pimg?.beat}</p>
                <p> Distance - {pimg?.distance}</p>
                <p> Site Status - {pimg?.siteStatus}</p>
                <p> Beat Status - {pimg?.status}</p>
                <p> Order Status - {pimg?.orderStatus.status}</p>
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
