import React from "react";
import Link from "next/link";
import Image from "next/image";

// components

// import CardLineChart from "components/Cards/CardLineChart.js";
// import CardBarChart from "components/Cards/CardBarChart.js";
// import CardPageVisits from "components/Cards/CardPageVisits.js";
// import CardSocialTraffic from "components/Cards/CardSocialTraffic.js";

// layout for page

// import AdminModel from "models/admin";

export default function Dashboard() {
  return (
    <>
      <section className="flex flex-wrap">
        <div className="w-full overflow-hidden xl:w-1/4">
          <Link href="property">
            <div className={`   text-center`}>
              <Image
                src={require("../../../public/images/dashboard/property.png")}
              />
              <h2> Property Management </h2>
            </div>
          </Link>
        </div>

        <div className="w-full overflow-hidden    xl:w-1/4">
          <Link href="/admin/vendor/add-vendor">
            <div className={`   text-center`}>
              <Image
                src={require("../../../public/images/dashboard/vendor.png")}
              />
              <h2> Profile Management </h2>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}
