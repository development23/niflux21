import Link from "next/link";
import moment from "moment";
import { useRouter } from "next/router";
import Image from "next/image";

import dbConnect, { Jsonify } from "middleware/database";
import DistributerModel from "models/Distributer";
import Paginate from "components/Common/Paginate";
import Property from "models/Property";
import { rgbDataURL } from "util/ColorDataUrl";
import { IconButton } from "@mui/material";
import axios from "axios";

export async function getServerSideProps({ query }) {
  const { distributer, page } = query;
  // console.log(distributer);
  const limit = 10;

  await dbConnect();
  const distributerData = await DistributerModel.findOne({ _id: distributer });

  const propertyCount = await Property.find({ vid: distributer }).count();
  const properties = await Property.find({ vid: distributer })
    .limit(limit)
    .sort({ createdAt: "desc" })
    .skip(page ? (page - 1) * limit : 0)
    .exec();

  return {
    props: {
      distributer: Jsonify(distributerData),
      propertyCount: propertyCount,
      properties: Jsonify(properties),
      limit: limit,
    },
  };
}

export default function Distributer({
  distributer,
  propertyCount,
  properties,
  limit,
}) {
  const color = "dark";
  const router = useRouter();

  const handleDistributerDeletion = (distributerId) => {
    const r = confirm(
      "Are your sure you want to delete this distributer. With this all the property of this distributer will be deleted too?"
    );
    if (!r) return;

    axios
      .delete(`/api/admin/distributer?distributer=${distributerId}`)
      .then(({ data }) => {
        console.log(data);
        router.replace("/admin/distributer");
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
              <Link href="/admin/distributer"> Distributor Management </Link>
            </li>
            <li className="pr-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>
            )
            <li className="pr-2 text-[16px]  text-[#ffffff]">
              <a href="/admin/distributer"> {distributer.name} </a>
            </li>
          </ul>
          <ul className="flex justify-end ">
            <li className="pr-2 text-[16px] bg-[#fefefe] text-[#313131] font-semibold pl-4  pr-5 py-2 rounded-3xl ">
              <Link
                href={{
                  pathname: "/admin/property/add-property",
                  query: { distributer: distributer._id },
                }}
              >
                <a> Add Distributor</a>
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
                  <span className="capitalize">{distributer.name} Details</span>
                </h2>
              </div>

              <IconButton
                aria-label="delete"
                onClick={() =>
                  router.push("edit-distributer?key=" + distributer._id)
                }
              >
                <i className="fa fa-pen text-red-400" />
              </IconButton>

              <IconButton
                aria-label="delete"
                onClick={() => handleDistributerDeletion(distributer._id)}
              >
                <i className="fa fa-trash text-red-400" />
              </IconButton>
            </div>
          </div>
          <div className="block w-full  ">
            <div className="px-2 py-3 bg-slate-600 rounded pl-4 text-white shadow   backdrop-blur-[5px] space-y-1">
              <div className="flex flex-wrap overflow-hidden xl:-mx-4">
                <div className="w-full overflow-hidden xl:my-2 xl:px-4 xl:w-full">
                  <p className="text-[18px] ">
                    Name :{" "}
                    <span className="text-[18px] "> {distributer?.name} </span>
                  </p>
                </div>

                <div className="w-full overflow-hidden xl:my-2 xl:px-4 xl:w-1/2">
                  <p className="text-[17px] ">
                    Mobile No :{" "}
                    <span className="text-[16px] ">
                      {" "}
                      +91-{distributer?.phone}{" "}
                    </span>
                  </p>
                </div>

                <div className="w-full overflow-hidden xl:my-2 xl:px-4 xl:w-1/2">
                  <p className="text-[17px] ">
                    Email :{" "}
                    <span className="text-[16px] "> {distributer?.email} </span>
                  </p>
                </div>

                <div className="w-full overflow-hidden xl:my-2 xl:px-4 xl:w-1/2">
                  <p className="text-[17px] ">
                    City :{" "}
                    <span className="text-[16px] "> {distributer?.city} </span>
                  </p>
                </div>

                <div className="w-full overflow-hidden xl:my-2 xl:px-4 xl:w-1/2">
                  <p className="text-[17px] ">
                    State :{" "}
                    <span className="text-[16px] "> {distributer?.state} </span>
                  </p>
                </div>

                <div className="w-full overflow-hidden xl:my-2 xl:px-4 xl:w-full">
                  <p className="text-[17px] ">
                    Address :{" "}
                    <span className="text-[16px] ">
                      {" "}
                      {distributer?.address}{" "}
                    </span>
                  </p>
                </div>

                <div className="w-full overflow-hidden xl:my-2 xl:px-4 xl:w-full">
                  <p className="text-[17px] ">
                    Created at :
                    <span className="text-[16px] ">
                      {" "}
                      {moment(distributer?.createdAt).format(
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

      <section className="mt-5">
        <div
          className={
            "relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded " +
            (color === "light" ? "bg-white" : "bg-slate-700 text-white")
          }
        >
          {/* <div className="rounded-t mb-0 px-4 py-3 border-0">
            <div className="flex flex-wrap items-center">
              <div className="relative w-full px-4 max-w-full text-center flex-grow flex-1">
                <h2
                  className={
                    "font-semibold text-lg tracking-widest " +
                    (color === "light" ? "text-slate-700" : "text-white")
                  }
                >
                  Properties of{" "}
                  <span className="capitalize">{distributer.name}</span>
                </h2>
              </div>
            </div>
          </div> */}
          <div className="block w-full overflow-x-auto">
            {/* <table className="items-center w-full bg-transparent border-collapse">
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
            </table> */}

            {/* <Paginate
              page={router.query.page}
              limit={limit}
              count={propertyCount}
              link="/admin/distributer"
            /> */}
          </div>
        </div>
      </section>
    </>
  );
}
