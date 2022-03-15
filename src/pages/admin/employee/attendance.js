import { useEffect, useRef } from "react";

import dbConnect, { Jsonify } from "middleware/database";
import moment from "moment";
import Employee from "models/Employee";
// import Script from "next/script";
import { Loader } from "@googlemaps/js-api-loader";
import { signIn } from "next-auth/react";
import { signOut } from "next-auth/react";
import Link from "next/link";

export async function getServerSideProps({ query }) {
  const { eid } = query;
  dbConnect();

  const employee = await Employee.findOne(
    { _id: eid }
    // { attendance: { $slice: [0, 3] } }
  ).exec();

  const emps = await Employee.find({ eid: employee._id }).exec();

  return {
    props: {
      employee: Jsonify(employee.attendance.reverse()),
      emps: Jsonify(employee),
    },
  };
}

export default function Attendance({ employee, emps }) {
  const source = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBpF6UO18TuzqIXwWlpZzQ9FJvV74xCmK8&callback=initMap`;

  const googlemap = useRef(null);
  useEffect(() => {
    const loader = new Loader({
      apiKey: "AIzaSyB9ygemBdxoSP5rjjOKCeUH8nLO-qGMVRY",
      version: "weekly",
    });
    let map;
    loader.load().then(() => {
      const google = window.google;
      map = new google.maps.Map(googlemap.current, {
        center: { lat: 26.9085329, lng: 75.7824042 },
        zoom: 18,
        fullscreenControl: true, // remove the top-right button
        mapTypeControl: true, // remove the top-left buttons
        streetViewControl: false, // remove the pegman
        zoomControl: true,
        mapId: 1,
      });

      new google.maps.Marker({
        position: { lat: 26.9085329, lng: 75.7824042 },
        map,
        title: "Hello World!",
      });
    });
  }, []);
  const color = "dark";
  return (
    <div>
      {/* <Script strategy="beforeInteractive" src={source}></Script> */}

      <div id="__next">
        <div id="map" ref={googlemap} style={{ height: 500, width: 800 }}></div>
      </div>

      <div className="mb-5  overflow-x-auto">
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
                <p>{emps.name}</p>
              </li>

              <li className="pr-2 pt-1">
                <i className="fas fa-chevron-right text-[13px] text-[#ffffff]"></i>
              </li>
              <li className="pr-2 text-[16px] pt-1  capitalize text-[#ffffff]">
                <p> Attendance </p>
              </li>
            </ul>
          </div>
        </div>

        <div className="block  ">
          <table className="items-center w-full bg-transparent border-collapse">
            <tbody>
              <tr>
                <th
                  className={
                    "px-6 align-middle border-2 border-[#475569] py-3 text-base uppercase  whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-slate-50 text-slate-500 border-slate-100"
                      : "bg-slate-600 text-slate-200 border-slate-500")
                  }
                >
                  SignIn Time
                </th>
                <th
                  className={
                    "px-6 align-middle border-2 border-[#475569] py-3 text-base uppercase  whitespace-nowrap font-semibold text-left " +
                    (color === "light"
                      ? "bg-slate-50 text-slate-500 border-slate-100"
                      : "bg-slate-600 text-slate-200 border-slate-500")
                  }
                >
                  SignOut Time
                </th>
              </tr>
            </tbody>
            <tbody className="mx-3">
              {employee.map((item, index) => (
                <tr key={index} className="bg-slate-200">
                  <th className="  border-2 border-[#475569] text-xs whitespace-nowrap p-4 text-left capitalize">
                    <span
                      className={
                        "font-bold capitalize" +
                        +(color === "light" ? "text-slate-600" : "text-white")
                      }
                    >
                      {moment(`${item.date} ${item.signIn}`).format(
                        "Do, MMMM YYYY, hh:mm a"
                      )}
                    </span>
                  </th>
                  <th className="  border-2 border-[#475569] text-xs whitespace-nowrap p-4 text-left capitalize">
                    <span
                      className={
                        "  font-bold capitalize" +
                        +(color === "light" ? "text-slate-600" : "text-white")
                      }
                    >
                      {moment(`${item.date} ${item.signOut}`).format(
                        "Do, MMMM YYYY, hh:mm a"
                      )}
                    </span>
                  </th>
                </tr>
              ))}
            </tbody>
          </table>

          {/* <Paginate
              page={router.query.page}
              limit={limit}
              count={propertyCount}
              link="/admin/employee"
            /> */}
        </div>

        {/* <div className="flex flex-wrap overflow-hidden">
          <div>
            {moment(`${item.date} ${item.signIn}`).format(
              "MMMM Do YYYY hh:mm a"
            )}
          </div>
          <div>
            {moment(`${item.date} ${item.signOut}`).format(
              "MMMM Do YYYY hh:mm a"
            )}
          </div>
          </div> */}
      </div>
    </div>
  );
}
