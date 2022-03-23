import { IconButton } from "@mui/material";
import axios from "axios";
import Paginate from "components/Common/Paginate";
import dbConnect, { Jsonify } from "middleware/database";
import Property from "models/Property";
import moment from "moment";
import Image from "next/image";

import Link from "next/link";
import { useRouter } from "next/router";
import { rgbDataURL } from "util/ColorDataUrl";

export async function getServerSideProps({ query }) {
  const { page } = query;
  const limit = 10;
  await dbConnect();
  const propertiesCount = await Property.count();
  const properties = await Property.find({})
    .limit(limit)
    .sort({ createdAt: "desc" })
    .skip(page ? (page - 1) * limit : 0)
    .exec();

  return {
    props: {
      properties: Jsonify(properties),
      propertiesCount: propertiesCount,
      limit: limit,
    },
  };
}

export default function PropertyManagement({
  properties,
  propertiesCount,
  limit,
}) {
  const color = "dark";
  const router = useRouter();

  const handlePropertyDelete = (id) => {
    const r = confirm(
      "Are your sure you want to delete this vendor. With this all the property of this vendor will be deleted too?"
    );
    if (!r) return;

    axios
      .delete(`/api/admin/property?property=${id}`)
      .then(({ data }) => {
        console.log(data);
        router.replace("/admin/property");
      })
      .catch((err) => console.log(err));
  };

  return (
    <>
      <div className="px-2 py-3 bg-slate-600 rounded pl-4 text-white shadow mb-5 backdrop-blur-[5px] space-y-1">
        <ul className="flex justify-start ">
          <li className="pr-2 text-[16px] text-[#ffffff]">
            <Link href="/admin/dashboard"> Home </Link>{" "}
          </li>
          <li className="pr-2">
            <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
          </li>

          <li className="pr-2 text-[16px]  text-[#ffffff]">
            <Link href="/admin/property"> Properties Management </Link>
          </li>
        </ul>
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
                  Listing of Properties
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
                      <div className="flex space-x-2">
                        <Link
                          href={{
                            pathname: "/admin/property/[property]",
                            query: { property: item.slug },
                          }}
                        >
                          <a className="flex items-center space-x-2 text-2xl">
                            <i className="fa fa-eye text-slate-300" />
                          </a>
                        </Link>

                        <Link
                          href={`/admin/property/edit-property?key=${item._id}`}
                        >
                          <a className="flex items-center space-x-2 text-2xl">
                            <i className="fa fa-edit text-slate-300" />
                          </a>
                        </Link>

                        <IconButton
                          title={`Delete ${item.name}`}
                          onClick={() => handlePropertyDelete(item._id)}
                        >
                          <i className="fa fa-trash text-red-500"></i>
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <Paginate
              page={router.query.page}
              limit={limit}
              count={propertiesCount}
              link="/admin/property"
            />
          </div>
        </div>
      </section>
    </>
  );
}
