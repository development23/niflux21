import { LinearProgress } from "@mui/material";
import axios from "axios";
import dbConnect, { Jsonify } from "middleware/database";
import Property from "models/Property";
import moment from "moment";
import Image from "next/image";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

export async function getServerSideProps({ query }) {
  const { property } = query;
  dbConnect();
  const propertyData = await Property.findOne({ _id: property });

  return {
    props: {
      property: Jsonify(propertyData),
    },
  };
}

export default function Images({ property }) {
  const [images, setImages] = useState([]);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [isImageDeleting, setIsImageDeleting] = useState(false);

  const onDrop = useCallback((acceptedFiles) => {
    // console.log(typeof acceptedFiles);

    setImages((prevImages) => [...prevImages, ...acceptedFiles]);
  }, []);
  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const removeImage = (index) => {
    setIsImageDeleting(true);
    setImages(images.filter((image, i) => i !== index));
    setIsImageDeleting(false);
  };

  const handleImagesStore = () => {
    const filesToUpload = images;
    setIsImageUploading(true);

    const uploaders = filesToUpload.map((file) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "uploads"); // Replace the preset name with your own
      formData.append("api_key", "774621217843223"); // Replace API key with your own Cloudinary key
      formData.append("timestamp", moment());
      return axios
        .post(
          "https://api.cloudinary.com/v1_1/aladinn-digital-solutions/image/upload",
          formData,
          { headers: { "X-Requested-With": "XMLHttpRequest" } }
        )
        .then((response) => {
          const data = response.data;
          const fileURL = data.secure_url;
          return fileURL;
        })
        .catch((e) => console.log(e));
    });

    axios
      .all(uploaders)
      .then((res) => {
        axios
          .put("/api/admin/property", {
            _id: property._id,
            images: [...property.images, ...res],
          })
          .then(({ data }) => {
            console.log(data);
            alert("Images Saved successfully.");
            // resetForm({});
            property.images = [...property.images, ...res];
            setImages([]);
            setIsImageUploading(false);
            // setIsReady(false);
          })
          .catch((err) => {
            // if (err.response.data.error?.code === 11000) {
            //   // console.log(Object.keys(err.response.data.error.keyValue)[0]);
            //   setFieldError(
            //     Object.keys(err.response.data.error.keyValue)[0],
            //     `Record with this ${
            //       Object.keys(err.response.data.error.keyValue)[0]
            //     } already exists.`
            //   );
            // } else {
            //   console.log(err.response.data.error.errors.name);
            //   setFieldError(
            //     err.response.data.error.errors.name.path,
            //     err.response.data.error.errors.name.message
            //   );
            // }
            console.log(err);
            setIsImageUploading(false);
          });
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const removeFromDatabaseImage = (index) => {
    const r = confirm("Are you sure you want to delete this image?");

    if (!r) return;

    setIsImageDeleting(true);
    const images = property.images.filter((image, i) => i !== index);

    axios
      .put("/api/admin/property", {
        _id: property._id,
        images: [...images],
      })
      .then(({ data }) => {
        alert("Image Deleted successfully.");
        property.images = [...images];
        setIsImageDeleting(false);
      })
      .catch((err) => {
        console.log(err);
        setIsImageDeleting(false);
      });
  };

  return (
    <>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-1 shadow-lg rounded-lg bg-slate-100 border-0">
        {isImageUploading && (
          <div className="">
            <LinearProgress color="info" />
          </div>
        )}

        <div className="rounded-t bg-white mb-0 px-6 py-3 shadow-sm z-10">
          <div className="text-center flex justify-between">
            <div>
              <h6 className="text-slate-700 text-xl font-bold tracking-widest text-left">
                Add More Images {property.name}
              </h6>
            </div>
            {images.length > 0 && (
              <div className="mt-1">
                <button
                  className="text-[16px] bg-[#000] text-[#fff] font-semibold pl-4 pr-5 py-2 rounded-3xl"
                  onClick={handleImagesStore}
                >
                  Save
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-100 border-0">
        <div className="rounded-t bg-white mb-0 px-6 py-3 shadow-sm z-10">
          <div className="flex flex-wrap -mx-3 overflow-hidden">
            {images.map((image, index) => (
              <div
                className="my-3 px-3 w-full overflow-hidden md:w-1/2 lg:w-1/4 xl:w-1/4 h-[200px] items-center mb-3 relative overflow-visible"
                key={index}
              >
                <img src={URL.createObjectURL(image)} className="w-full px-2" />
                <div
                  onClick={() => removeImage(index)}
                  className="absolute z-20 top-[-10px] right-2 bg-red-500 text-white h-8 w-8 rounded-full flex justify-center items-center hover:bg-red-600"
                >
                  <button>
                    <i className="fa fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div className="py-5 justify-center items-center w-full flex flex-col">
              <i className="fa fa-plus text-[180px] text-slate-300 mb-4"></i>
              <p>Drag 'n' drop some files here, or click to select files</p>
            </div>
          </div>
        </div>
      </div>

      <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-slate-100 border-0">
        {isImageDeleting && (
          <div className="">
            <LinearProgress color="error" />
          </div>
        )}

        <div className="rounded-t bg-white mb-0 px-6 py-3 shadow-sm z-10">
          <div className="flex flex-wrap -mx-3 overflow-hidden">
            {property.images.map((image, index) => (
              <div
                className="my-3 px-3 w-full  md:w-1/2 lg:w-1/4 xl:w-1/4 h-[200px] items-center mb-3 relative overflow-visible"
                key={index}
              >
                <img src={image} className="w-full px-2" alt={property.name} />
                <div
                  onClick={() => removeFromDatabaseImage(index)}
                  className="absolute z-20 top-[-10px] right-2 bg-red-500 text-white h-8 w-8 rounded-full flex justify-center items-center hover:bg-red-600"
                >
                  <button>
                    <i className="fa fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
