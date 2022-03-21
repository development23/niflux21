import React from "react";
import Link from "next/link";
import Image from "next/image";

import SuperVisor from "layouts/SuperVisor.js";

import { signOut } from "next-auth/react";

export default function Dashboard() {
  return (
    <>
      <section className="flex flex-wrap  ">
        <div className="w-full overflow-hidden    xl:w-1/4">
          <Link href="#">
            <div className={`text-center`}>
              <Image
                src={require("../../../public/images/dashboard/vendor.png")}
              />
              <h2> Management </h2>
            </div>
          </Link>
        </div>
      </section>
    </>
  );
}

Dashboard.layout = SuperVisor;

{
  /* export default function Dashboard() {
  return (
    <div className="mt-64 mb-64">
      <button onClick={() => signOut("user-login")}>sign out supervisor</button>
    </div>
  );
} */
}
