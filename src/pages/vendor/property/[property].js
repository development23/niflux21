import dbConnect, { Jsonify } from "middleware/database";
import Property from "models/Property";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { rgbDataURL } from "util/ColorDataUrl";
import { IconButton } from "@mui/material";

export async function getServerSideProps({ query }) {
  const { property } = query;
  await dbConnect();
  const propertyData = await Property.findOne({ slug: property });

  return {
    props: {
      property: Jsonify(propertyData),
    },
  };
}
export default function PropertyDetails({ property }) {
  const router = useRouter();
  return (
    <div>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-3 shadow-sm z-10">
          <div className="text-center flex justify-between">
            <div>
              <h6 className="text-slate-700 text-xl font-bold tracking-widest text-left">
                {property?.name}
              </h6>
              <p className="text-left text-slate-600">
                <i className="fa fa-map-marker-alt"></i> {property.city},{" "}
                {property.state}
              </p>
            </div>
            <div className="flex space-x-3">
              <div className="mt-5">
                <Link
                  href={`/vendor/property/edit-property?key=${property._id}`}
                >
                  <a className="pr-2 text-[16px] bg-[#000] text-[#fff] font-semibold pl-4 pr-5 py-2 rounded-3xl ">
                    Edit Property
                  </a>
                </Link>
              </div>
              <div className="mt-5">
                <Link
                  href={`/vendor/property/property-images?property=${property._id}`}
                >
                  <a className="pr-2 text-[16px] bg-[#000] text-[#fff] font-semibold pl-4 pr-5 py-2 rounded-3xl ">
                    Add More Images
                  </a>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="flex-auto bg-gray-50">
          <div className="w-full h-[300px] sm:h-[400px] relative">
            <Image
              src={property.banner}
              className="hue-300"
              alt="..."
              quality={60}
              placeholder={rgbDataURL(2, 129, 210)}
              layout="fill"
            />
            <div className="absolute bottom-0 w-full py-4 bg-black bg-opacity-20 backdrop-blur-[5px] text-white px-4">
              <div className="flex justify-between">
                <h4 className="tracking-wider font-medium text-2xl">
                  Overview
                </h4>
                {/* <div className="flex space-x-3 text-xl">
                  <button title="reviews">
                    <i className="fa fa-heart text-red-500 hover:text-2xl transition-all duration-75"></i>
                  </button>
                  <button
                    onClick={() =>
                      router.push(
                        `/admin/property/edit-property?key=${property._id}`
                      )
                    }
                    title="Edit Property"
                  >
                    <i className="fa fa-pen-square text-white hover:text-2xl transition-all duration-75"></i>
                  </button>
                  <button title="Change Status">
                    <i className="fa fa-toggle-on text-green-400 hover:text-2xl transition-all duration-75"></i>
                  </button>
                </div> */}
              </div>
              <p className="text-slate-300 line-clamp-3">{property.overview}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
