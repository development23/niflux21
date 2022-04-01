import React from "react";
import Link from "next/link";
import Image from "next/image";
// components

import CardLineChart from "components/Cards/CardLineChart.js";
import CardBarChart from "components/Cards/CardBarChart.js";
import CardPageVisits from "components/Cards/CardPageVisits.js";
import CardSocialTraffic from "components/Cards/CardSocialTraffic.js";

// layout for page

import Admin from "layouts/Admin.js";

// import AdminModel from "models/admin";

export default function Dashboard() {
  return (
    <>
      <section className="flex flex-wrap  ">
        {/* <div className="w-full overflow-hidden sm:w-1/4 cursor-pointer">
          <Link href="/admin/vendor/add-vendor">
            <div className={`text-center`}>
              <Image
                src={require("../../../public/images/dashboard/vendor.png")}
              />
              <h2> Add Vendor </h2>
            </div>
          </Link>
        </div> */}
        <div className="w-full overflow-hidden sm:w-1/4 cursor-pointer">
          <Link href="/admin/distributer/add-distributer">
            <div className={`text-center`}>
              <Image
                src={require("../../../public/images/dashboard/vendor.png")}
              />
              <h2> Add Distributor </h2>
            </div>
          </Link>
        </div>

        <div className="w-full overflow-hidden sm:w-1/4 cursor-pointer">
          <Link href="/admin/supervisor/add-supervisor">
            <div className={`text-center`}>
              <Image
                src={require("../../../public/images/dashboard/property.png")}
              />
              <h2> Add Supervisor </h2>
            </div>
          </Link>
        </div>
        <div className="w-full overflow-hidden    sm:w-1/4">
          <Link href="/admin/employee/add-employee">
            <div className={`text-center`}>
              <Image
                src={require("../../../public/images/dashboard/vendor.png")}
              />
              <h2> Add Employees </h2>
            </div>
          </Link>
        </div>
        {/* <div className="w-full overflow-hidden    sm:w-1/4">
          <Link href="/admin/vendor/add-vendor">
            <div className={`text-center`}>
              <Image
                src={require("../../../public/images/dashboard/property.png")}
              />
              <h2> Property Management </h2>
            </div>
          </Link>
        </div> */}
      </section>
    </>
  );
}

Dashboard.layout = Admin;
