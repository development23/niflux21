import React from "react";
import { createPopper } from "@popperjs/core";
import { signOut, useSession } from "next-auth/react";
import { useEffect } from "react";

const UserDropdown = ({ vendor }) => {
  // dropdown props
  const [dropdownPopoverShow, setDropdownPopoverShow] = React.useState(false);
  const btnDropdownRef = React.createRef();
  const popoverDropdownRef = React.createRef();
  const openDropdownPopover = () => {
    createPopper(btnDropdownRef.current, popoverDropdownRef.current, {
      placement: "bottom-start",
    });
    setDropdownPopoverShow(true);
  };
  const closeDropdownPopover = () => {
    setDropdownPopoverShow(false);
  };

  const session = useSession();

  useEffect(() => {}, [session]);
  // console.log(vendor);
  return (
    <>
      <a
        className="text-blueGray-500 block"
        href="#pablo"
        ref={btnDropdownRef}
        onClick={(e) => {
          e.preventDefault();
          dropdownPopoverShow ? closeDropdownPopover() : openDropdownPopover();
        }}
      >
        <div className="items-center flex">
          <span className="w-10 h-10 text-3xl text-white bg-[#fff] inline-flex items-center justify-center rounded-full">
            <img src={vendor?.profile_image} />
          </span>
        </div>
      </a>
      <div
        ref={popoverDropdownRef}
        className={
          (dropdownPopoverShow ? "block " : "hidden ") +
          "bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48"
        }
      >
        <a
          className={
            "text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700"
          }
          href="#pablo"
          onClick={(e) => e.preventDefault()}
        >
          <button onClick={() => signOut("vendor-login")}>Sign Out</button>
        </a>
      </div>
    </>
  );
};

export default UserDropdown;
