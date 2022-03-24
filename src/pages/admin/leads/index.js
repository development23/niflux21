import { useEffect, useState, useRef } from "react";
import Paginate from "components/Common/Paginate";
import moment from "moment";
import Link from "next/link";
import { useRouter } from "next/router";
import { TextField } from "@mui/material";

import axios from "axios";
import { IconButton } from "@mui/material";

export async function getServerSideProps({ query }) {
  const limit = 10;
  return {
    props: {
      limit: limit,
    },
  };
}

export default function LeadsManagement({ limit }) {
  const color = "dark";
  const router = useRouter();
  const [leads, setLeads] = useState([]);
  const [leadsCount, setLeadsCount] = useState(0);
  const [preview, setPreview] = useState(null);
  const [search, setSearch] = useState("");
  const previewRef = useRef(null);

  useOutsideAlerter(previewRef);

  useEffect(() => {
    axios
      .get(
        `/api/admin/leads?limit=${limit}&page=${router.query.page}&search=${search}`
      )
      .then(({ data }) => {
        setLeads(data.leads);
        setLeadsCount(data.leadsCount);
      })
      .catch((err) => console.log(err));
  }, [router.query.page, search]);

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

  return (
    <>
      <div className="">
        <div className="px-2 py-3 bg-slate-600 rounded pl-4 text-white shadow mb-5 backdrop-blur-[5px] space-y-1">
          <ul className="flex justify-start ">
            <li className="pr-2 text-[16px] text-[#ffffff]">
              <Link href="/admin/dashboard"> Home </Link>{" "}
            </li>
            <li className="pr-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>

            <li className="pr-2 text-[16px]  text-[#ffffff]">
              <Link href="/admin/property"> Leads Management </Link>
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
                    Leads
                  </h2>
                </div>
              </div>
            </div>
            <div className="bg-white px-4 py-2">
              <TextField
                label="Search Leads"
                variant="standard"
                placeholder="Search Leads"
                // autoComplete="off"
                onChange={({ target }) => setSearch(target.value)}
                onBlur={({ target }) => setSearch(target.value)}
                value={search}
                className="w-full py-1 my-2"
                // disabled
                // multiline
                // error={errors.slug && touched.slug ? true : false}
              />
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
                      Email
                    </th>

                    <th
                      className={
                        "px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left " +
                        (color === "light"
                          ? "bg-slate-50 text-slate-500 border-slate-100"
                          : "bg-slate-600 text-slate-200 border-slate-500")
                      }
                    >
                      Phone
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
                  {leads.map((item, index) => (
                    <tr key={item._id}>
                      <th className="border-t-0 pr-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left capitalize">
                        <span
                          className={
                            "ml-3 font-bold capitalize" +
                            +(color === "light"
                              ? "text-slate-600"
                              : "text-white")
                          }
                        >
                          <Link
                            href={{
                              pathname: "/admin/property/[property]",
                              query: { property: item.slug },
                            }}
                          >
                            <a className="flex items-center space-x-2">
                              <span>{item.name}</span>
                            </a>
                          </Link>
                        </span>
                      </th>
                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <i className="fas fa-envelope mr-2"></i> {item.email}
                      </td>

                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <i className="fas fa-phone-alt mr-2"></i> {item.phone}
                      </td>

                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4">
                        <div className="flex items-center">
                          <i
                            className={`fas fa-circle ${
                              item.isTouched ? "text-green-500" : "text-red-500"
                            } mr-2`}
                          ></i>
                          {item.isTouched ? "Seen" : "Unseen"}
                        </div>
                      </td>

                      <td className="border-t-0 px-6 align-middle border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                        {moment(item.createdAt).format("Do, MMM YY hh:mm a")}
                      </td>
                      <td className="border-t-0 px-6 border-l-0 border-r-0 text-xs whitespace-nowrap p-4 text-left">
                        <IconButton onClick={() => setPreview(item)}>
                          <a className="flex space-x-2 text-2xl">
                            <i className="fa fa-eye text-slate-300" />
                          </a>
                        </IconButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <Paginate
                page={router.query.page}
                limit={limit}
                count={leadsCount}
                link="/admin/leads"
              />
            </div>
          </div>
        </section>
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
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
