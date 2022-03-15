import { IconButton } from "@mui/material";
import { comparePropertyState } from "atoms/compareAtom";
import Link from "next/link";
import { useState } from "react";
import { useRecoilState } from "recoil";

export default function CompareFlyOut() {
  const [showCompareList, setShowCompareList] = useState(true);

  const [compareProperty, setCompareProperty] =
    useRecoilState(comparePropertyState);

  const propertyRemoveFromCompare = (property) => {
    setCompareProperty(compareProperty.filter((p) => p._id !== property));
  };

  return (
    <>
      <div>
        {compareProperty.length > 0 && (
          <div
            className={`fixed z-50     bottom-[52px] md:bottom-[50px] w-80 right-0   ${
              showCompareList ? "translate-x-0" : "translate-x-[100%]"
            } transition-all duration-500 ease-in-out`}
          >
            <div className="absolute top-[4px] left-[-50px]">
              <i
                className={`fa fa-${
                  showCompareList ? "times" : "bars"
                } p-4 text-white text-xl bg-[#143d64d2]  hover:bg-black rounded-md mr-2  cursor-pointer`}
                onClick={() => setShowCompareList(!showCompareList)}
              ></i>
            </div>
            {compareProperty.map((item, index) => (
              <div key={index} className="mb-2">
                <div className="flex justify-between bg-[#143d64d2] hover:bg-[#a15d3ed8] bg-opacity-80  backdrop-blur-[5px]  rounded-lg shadow-lg px-3 py-4 items-center mb-2 space-x-3">
                  <h2 className="text-white line-clamp-1  font-semibold shadow-none capitalize">
                    {item.name}
                  </h2>
                  <IconButton
                    size="small"
                    onClick={() => propertyRemoveFromCompare(item._id)}
                  >
                    <i className="fa fa-trash text-red-600"></i>
                  </IconButton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {compareProperty.length >= 2 && (
        <Link href="compare-properties">
          <a className="fixed bottom-0 left-0 z-10 w-full rounded bg-orange-800 px-5 text-center text-white text-xl tracking-widest uppercase py-3 shadow-lg font-bold bg-opacity-80 backdrop-blur-[5px] cursor-pointer hover:bg-[#143d64d2] ">
            Compare Now
          </a>
        </Link>
      )}
    </>
  );
}
