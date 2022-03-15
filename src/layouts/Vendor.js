import React from "react";

// components

import AdminNavbar from "components/vendor/Navbars/AdminNavbar.js";
import Sidebar from "components/vendor/Sidebar/Sidebar.js";

import FooterAdmin from "components/vendor/Footers/FooterAdmin.js";

export default function Vendor({ children }) {
  return (
    <>
      <Sidebar />
      <div className="relative md:ml-64 bg-blueGray-100">
        <AdminNavbar />
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
