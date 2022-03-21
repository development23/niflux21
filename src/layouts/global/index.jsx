import { useEffect } from "react";
import Image from "next/image";
import styles from "./styles.module.css";
import Link from "next/link";

//material ui
import Button from "@mui/material/Button";

// icons
import FacebookIcon from "@mui/icons-material/Facebook";
import TwitterIcon from "@mui/icons-material/Twitter";
import LinkedInIcon from "@mui/icons-material/LinkedIn";
import GoogleIcon from "@mui/icons-material/Google";
import YouTubeIcon from "@mui/icons-material/YouTube";
import ReorderIcon from "@mui/icons-material/Reorder";
import { useSession } from "next-auth/react";

export default function Layout({ children }) {
  const session = useSession();

  useEffect(() => {}, [session]);

  return (
    <>
      <header className="text-gray-600 body-font bg-none md:bg-[#fff] sm:border-b-[2px] sm:border-[#a7a7a7] fixed top-[0px] w-full z-10">
        <div className="bg-[#222222]  md:h-[48px] h-[60px] px-2 md:px-28 text-white">
          <div className="text-right md:px-28">
            <ul
              className={` ${styles.mobhide} flex flex-wrap  justify-items-end justify-end pt-2 items-end `}
            >
              <li className="pr-6 text-base "> Follow us on : </li>
              <li className="pr-4  ">
                <FacebookIcon className="text-xl" />
              </li>
              <li className="pr-4  ">
                <TwitterIcon className="text-xl" />
              </li>
              <li className="pr-4  ">
                <LinkedInIcon className="text-xl" />
              </li>
              <li className="pr-4  ">
                <GoogleIcon className="text-xl" />
              </li>
              <li className="pr-4  ">
                <YouTubeIcon className="text-xl" />
              </li>
            </ul>
          </div>
        </div>
        <div className="container relative mx-auto md:px-28 flex flex-wrap pl-1 pt-1 items-left md:items-center">
          <div>
            <div className="flex items-left md:items-center  mb-4 md:mb-0 z-50 absolute top-[-138%]  sm:top-[-65%]">
              <Link href="/">
                <a>
                  <div className="hidden sm:block">
                    <Image
                      src={require("../../../public/images/header/Logoadmin.jpg")}
                      alt="portal"
                    />
                  </div>
                  <div className={`block sm:hidden z-10`}>
                    <Image
                      src={require("../../../public/images/header/Logomob.jpg")}
                      alt="portal"
                    />
                  </div>
                </a>
              </Link>
            </div>
          </div>
          <nav
            className={`hidden sm:flex md:ml-auto md:mr-auto items-center text-base justify-center w-auto h-20 relative left-[20%]`}
          >
            <a className="mr-7  text-[#000] text-xl font-semibold">For Buyer</a>
            <a className="mr-7  text-[#000] text-xl font-semibold">
              For Builder
            </a>
          </nav>
          <div className="flex ml-auto justify-ceneter items-center">
            <div className="hidden sm:block">
              <button className="mr-7  text-[#fff] text-lg font-semibold bg-[#CF4A05] px-4 py-2 rounded hover:bg-[#000]">
                List Property
              </button>
            </div>
            <div className="z-50  mr-2 md:mr-0 top-[-137%] sm:top[[0px] relative">
              <Link href="/auth/user/register">
                <button className="mr-7  text-[#fff] text-lg font-semibold bg-[#000] px-4 py-2 rounded hover:bg-[#CF4A05]">
                  {session.status === "authenticated"
                    ? "My Account"
                    : "Register"}
                </button>
              </Link>
              <ReorderIcon className=" border-[2px]  border-[#fff] text-[#fff] sm:border-[#000] sm:text-[#000]  h-[40px] w-[40px] rounded-3xl p-1 " />
            </div>
            <div></div>
          </div>
        </div>
      </header>
      {children}
      <footer>
        <div className={styles.footer}>
          <div className="container md:px-20 md:pl-36 pl-12">
            <div
              className={`${styles.bgbox} md:absolute md:-mt-20  flex flex-wrap h-auto overflow-hidden`}
            >
              <div className="md:w-1/4  pb-4 md:pb-0 w-full px-4 pt-6 text-[#fff]  text-[22px] font-[Poppins]">
                <h2> Subscribe Now </h2>
              </div>
              <div className=" md:w-3/4 w-full">
                <form>
                  <div className="flex flex-wrap overflow-hidden  ">
                    <div className="my-1 px-3   overflow-hidden lg:my-6 lg:px-6  xl:my-4 xl:px-4  w-3/4">
                      <input
                        type="text"
                        placeholder="Your Mail Id"
                        name="name"
                        className="w-full mb-3 rounded-[4px] bg-white color-[#000] px-[10px] py-[10px]"
                        required
                      />
                    </div>

                    <div className="my-1 px-1 md:px-3   overflow-hidden lg:my-6 lg:px-6   xl:my-4 xl:px-4  w-1/4">
                      <button
                        size="medium"
                        variant="contained"
                        className="w-full mb-3 rounded-[4px] rounded-[3px] text-white px-[10px] py-[10px] bg-[#222222]"
                      >
                        Submit
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            <div className="flex flex-wrap overflow-hidden">
              <div className="w-full overflow-hidden">
                <p className="text-[#fff]  semi-bold md:mt-[80px]  mt-4 relative ">
                  <span className="mr-2 border-r-2 pr-2   border-slate-100">
                    Home
                  </span>
                  <span className="  mr-2 border-r-2 pr-2  border-slate-100">
                    About Us
                  </span>
                  <span className="  mr-2 border-r-2 pr-2  border-slate-300">
                    Contact Us
                  </span>
                  <span className="  mr-2 border-r-2 pr-2  border-slate-300">
                    Feedback
                  </span>
                  <span className="  mr-2 border-r-2 pr-2  border-slate-300">
                    Complaints
                  </span>
                  <span className="  mr-2 border-r-2 pr-2  border-slate-300">
                    Terms & Conditions
                  </span>
                  <span className=" mr-2 border-r-2 pr-2  border-slate-300">
                    Testimonials
                  </span>
                  <span className="  mr-2 border-r-2 pr-2  border-slate-300">
                    Sitemap
                  </span>
                  <span className=" mr-2 border-r-2 pr-2  border-slate-300">
                    Property Leads
                  </span>
                  <span className="  mr-2 border-r-2 pr-2  border-slate-300">
                    FAQ
                  </span>
                  <span className="  mr-2  border-slate-300 ">
                    Advertise With Us
                  </span>
                </p>
                <p className="text-[#fff] mt-2 text-left md:text-center semi-bold ">
                  {" "}
                  © propertycheckkaro 2021. All rights reserved.{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
