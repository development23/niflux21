import React from "react";

// components

import SuperVisorNavbar from "components/Navbars/SuperVisorNavbar.js";
import Sidebar from "components/Sidebar/SuperVisorSidebar.js";
import HeaderStats from "components/Headers/HeaderStats.js";
import FooterAdmin from "components/Footers/FooterAdmin.js";

export default function SuperVisor({ children }) {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <SuperVisorNavbar />
        {/* Header */}
        {/* <HeaderStats /> */}
        <div className="px-4 md:px-10 mx-auto w-full pt-5 bg-gray-100 ">
          {children}
          <FooterAdmin />
        </div>
      </div>
    </>
  );
}
