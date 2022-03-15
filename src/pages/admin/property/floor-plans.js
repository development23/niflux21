import { useState, useEffect } from "react";
import dbConnect, { Jsonify } from "middleware/database";
import * as Yup from "yup";
import { Formik } from "formik";
import {
  Button,
  CircularProgress,
  InputLabel,
  TextField as Input,
} from "@mui/material";

import Property from "models/Property";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/router";
import moment from "moment";

const FILE_SIZE = 1000000;
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

const floorSchema = Yup.object().shape({
  planName: Yup.string().required("Plan Name is required."),
  price: Yup.string()
    .required("Price is required.")
    .min(3, "Price is Too short."),
  area: Yup.string().required("Area is required.").min(1, "Area is Too short."),
  image: Yup.mixed()
    .required("A file is required")
    .test(
      "fileSize",
      "File size must be less than 1 MB",
      (value) => value && value.size <= FILE_SIZE
    )
    .test(
      "fileFormat",
      "Unsupported Format",
      (value) => value && SUPPORTED_FORMATS.includes(value.type)
    ),
  description: Yup.string().required("Description is required."),
});

const editFloorSchema = Yup.object().shape({
  planName: Yup.string().required("Plan Name is required."),
  price: Yup.string()
    .required("Price is required.")
    .min(3, "Price is Too short."),
  area: Yup.string().required("Area is required.").min(1, "Area is Too short."),
  image: Yup.mixed()
    .nullable(true)
    .test(
      "fileSize",
      "File size must be less than 1 MB",
      (value) => (value && value.size <= FILE_SIZE) || !value
    )
    .test(
      "fileFormat",
      "Unsupported Format",
      (value) => (value && SUPPORTED_FORMATS.includes(value.type)) || !value
    ),
  description: Yup.string().required("Description is required."),
});

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

export default function FloorPlan({ property }) {
  const [isReady, setIsReady] = useState(false);
  const [floorPlanToEdit, setFloorPlanToEdit] = useState(null);
  const router = useRouter();

  const handleFloorPlanSubmission = async (
    values,
    { setFieldError, resetForm }
  ) => {
    setIsReady(true);
    const filesToUpload = [values.image];

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
        values.image = res[0];
        axios
          .post("/api/admin/floorPlan", {
            _id: property._id,
            floorPlan: values,
          })
          .then(({ data }) => {
            alert("Property added successfully.");
            resetForm({});
            router.replace(router.asPath);
            setIsReady(false);
            console.log(data);
          })
          .catch((err) => {
            if (err.response.data.error?.code === 11000) {
              // console.log(Object.keys(err.response.data.error.keyValue)[0]);
              setFieldError(
                Object.keys(err.response.data.error.keyValue)[0],
                `Record with this ${
                  Object.keys(err.response.data.error.keyValue)[0]
                } already exists.`
              );
              setIsReady(false);
            } else {
              console.log(err.response.data.error.errors.name);
              setFieldError(
                err.response.data.error.errors.name.path,
                err.response.data.error.errors.name.message
              );
              setIsReady(false);
            }
          });
      })
      .catch((e) => {
        console.log(e);
        setIsReady(false);
      });
  };

  const handleEditFloorPlanSubmission = (values, { resetForm }) => {
    setIsReady(true);
    const filesToUpload = [values.image];
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
        .catch((e) => {});
    });

    axios
      .all(uploaders)
      .then((res) => {
        values.image = res[0] || floorPlanToEdit.image;
        axios
          .put("/api/admin/floorPlan", {
            _id: property._id,
            fid: floorPlanToEdit._id,
            floorPlan: values,
          })
          .then(({ data }) => {
            alert("Property added successfully.");
            resetForm({});
            router.replace(router.asPath);
            setIsReady(false);
            setFloorPlanToEdit(null);
            console.log(data);
          })
          .catch((err) => {
            if (err.response.data.error?.code === 11000) {
              // console.log(Object.keys(err.response.data.error.keyValue)[0]);
              setFieldError(
                Object.keys(err.response.data.error.keyValue)[0],
                `Record with this ${
                  Object.keys(err.response.data.error.keyValue)[0]
                } already exists.`
              );
              setIsReady(false);
            } else {
              console.log(err.response.data.error.errors.name);
              setFieldError(
                err.response.data.error.errors.name.path,
                err.response.data.error.errors.name.message
              );
              setIsReady(false);
            }
          });
      })
      .catch((e) => {
        console.log(e);
        setIsReady(false);
      });
  };

  const handleFloorPlanDeletion = (floorPlan) => {
    const r = confirm("Are you sure you want to delete this floor plan?");

    if (!r) return;

    setIsReady(true);
    axios
      .delete(`/api/admin/floorPlan?fid=${floorPlan}&pid=${property._id}`)
      .then(({ data }) => {
        router.replace(router.asPath);
        setIsReady(false);
      })
      .catch((err) => {
        console.log(err);
        setIsReady(false);
      });
  };

  return (
    <>
      <div
        className={`px-2 py-3 bg-slate-600 rounded pl-4 text-white shadow mb-5 backdrop-blur-[5px] space-y-1 ${
          floorPlanToEdit && "overflow-y-hidden"
        }`}
      >
        <div className="justify-between flex">
          <ul className="flex justify-start ">
            <li className="pr-2 text-[18px] pt-1 text-[#ffffff]">
              <Link href="/admin/dashboard"> Home </Link>
            </li>
            <li className="pr-2 pt-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>

            <li className="pr-2 text-[18px] pt-1  text-[#ffffff]">
              <Link href="/admin/property"> Property Management </Link>
            </li>

            <li className="pr-2 pt-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>

            <li className="pr-2 text-[18px] pt-1  text-[#ffffff]">
              <button onClick={() => router.back()}>
                <a>{property?.name}</a>
              </button>
            </li>

            <li className="pr-2 pt-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>
            <li className="pr-2 text-[18px] pt-1  text-[#ffffff]">
              Add Floor Plan
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white px-4 pt-4 pb-10 rounded shadow-sm">
        {isReady && (
          <div className="fixed top-0 left-0 w-full h-full z-50 bg-white bg-opacity-60 flex justify-center items-center overflow-hidden">
            <CircularProgress />
          </div>
        )}

        <h1 className="text-2xl bg-[#efefef] mb-4  pt-4 pb-4 text-[#353435] px-[20px] font-bold tracking-widest text-center">
          Add Floor Plans {property.name}
        </h1>

        <Formik
          initialValues={{
            planName: "",
            description: "",
            price: "",
            area: "",
            image: "",
          }}
          onSubmit={handleFloorPlanSubmission}
          validationSchema={floorSchema}
        >
          {({
            handleChange,
            handleBlur,
            handleSubmit,
            values,
            errors,
            touched,
            setFieldValue,
          }) => (
            <div className="flex flex-wrap -mx-4 overflow-hidden">
              <div className="my-4 px-4 w-full overflow-hidden md:w-1/4">
                <div className="form-group space-y-2">
                  <Input
                    label="Floor Plans's Name"
                    variant="standard"
                    type="text"
                    name="planName"
                    placeholder="Enter Plan's Name"
                    // autoComplete="off"
                    onChange={handleChange("planName")}
                    onBlur={handleBlur("planName")}
                    value={values.planName}
                    required
                    className="w-full py-1 my-2"
                    error={errors.planName && touched.planName ? true : false}
                  />
                </div>
                {errors.planName && touched.planName ? (
                  <p className="text-red-800">{errors.planName}</p>
                ) : null}
              </div>

              <div className="my-4 px-4 w-full overflow-hidden md:w-1/4">
                <div className="form-group space-y-2">
                  <Input
                    label="Floor Plans's Area"
                    variant="standard"
                    type="text"
                    name="area"
                    placeholder="Enter Plan's Area"
                    // autoComplete="off"
                    onChange={handleChange("area")}
                    onBlur={handleBlur("area")}
                    value={values.area}
                    required
                    className="w-full py-1 my-2"
                    error={errors.area && touched.area ? true : false}
                  />
                </div>
                {errors.area && touched.area ? (
                  <p className="text-red-800">{errors.area}</p>
                ) : null}
              </div>

              <div className="my-4 px-4 w-full overflow-hidden md:w-1/4">
                <div className="form-group space-y-2">
                  <Input
                    label="Floor Plans's Price"
                    variant="standard"
                    type="text"
                    name="price"
                    placeholder="Enter Plan's Price"
                    // autoComplete="off"
                    onChange={handleChange("price")}
                    onBlur={handleBlur("price")}
                    value={values.price}
                    required
                    className="w-full py-1 my-2"
                    error={errors.price && touched.price ? true : false}
                  />
                </div>
                {errors.price && touched.price ? (
                  <p className="text-red-800">{errors.price}</p>
                ) : null}
              </div>

              <div className="my-4 px-4 w-full overflow-hidden md:w-1/4">
                <div className="form-group space-y-2">
                  <InputLabel id="demo-simple-select-label" required>
                    Plan Image
                  </InputLabel>
                  <Input
                    type="file"
                    onChange={(images) =>
                      setFieldValue("image", images.currentTarget.files[0])
                    }
                    onBlur={handleBlur}
                    className="w-full py-1 my-2"
                    required
                    // disabled={bannerUrl ? true : false}
                    variant="standard"
                    error={errors.image && touched.image ? true : false}
                  />
                </div>
                {errors.image && touched.image ? (
                  <p className="text-red-800">{errors.image}</p>
                ) : null}
              </div>

              <div className=" px-4 mt-2 w-full overflow-hidden md:w-full">
                <div className="form-group space-y-2">
                  <Input
                    label="Overview"
                    variant="standard"
                    type="text"
                    name="description"
                    placeholder="Overview"
                    // autoComplete="off"
                    onChange={handleChange("description")}
                    onBlur={handleBlur("description")}
                    value={values.description}
                    required
                    multiline
                    className="w-full py-1 my-2"
                    error={
                      errors.description && touched.description ? true : false
                    }
                  />
                </div>
                {errors.description && touched.description ? (
                  <p className="text-red-800">{errors.description}</p>
                ) : null}
              </div>

              <div className="my-4 px-4 w-full overflow-hidden text-center mt-8 md:w-3/3">
                <button
                  type="submit"
                  onClick={handleSubmit}
                  className="inline-flex px-5 py-3 text-white bg-[#d86c07] hover:bg-purple-700 focus:bg-purple-700  rounded-md shadow mb-3"
                >
                  Save Plan
                </button>
              </div>
            </div>
          )}
        </Formik>
      </div>
      <div className="bg-white px-4 pt-4 pb-10 rounded shadow-sm mt-5">
        <div className="px-4 space-y-5">
          <div className="flex flex-wrap -mx-4 overflow-hidden text-center">
            {property.floorPlan.map((plan, index) => (
              <div
                className="my-4 px-4 w-full overflow-hidden md:w-1/3"
                key={index}
              >
                <img src={plan.image} />
                <p>{plan.planName}</p>
                <div className="space-x-5">
                  <button
                    onClick={() => handleFloorPlanDeletion(plan._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg cursor-pointer focus-within:bg-red-900"
                  >
                    Delete Floor
                  </button>

                  <button
                    onClick={() => setFloorPlanToEdit(plan)}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg cursor-pointer focus-within:bg-blue-900"
                  >
                    Edit Floor
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div
            className={`fixed top-[-20px] right-0 w-full h-screen bg-white bg-opacity-80 backdrop-blur-[5px] ${
              floorPlanToEdit
                ? "translate-y-[0px] opacity-100 z-50"
                : "translate-y-[800px] opacity-0 z-[-1]"
            } } transition-all duration-500 transition-ease-in-out px-6 py-4 shadow-xl rounded-lg overflow-hidden`}
          >
            <div className="flex justify-end font-bold tacking-wider">
              <button onClick={() => setFloorPlanToEdit(null)}>
                <i className="fa fa-times"></i> Close
              </button>
            </div>
            {floorPlanToEdit && (
              <Formik
                initialValues={{
                  planName: floorPlanToEdit.planName,
                  description: floorPlanToEdit.description,
                  price: floorPlanToEdit.price,
                  area: floorPlanToEdit.area,
                  image: null,
                }}
                onSubmit={handleEditFloorPlanSubmission}
                validationSchema={editFloorSchema}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  touched,
                  setFieldValue,
                }) => (
                  <div className="flex flex-wrap -mx-4 overflow-hidden">
                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
                      <div className="form-group space-y-2">
                        <Input
                          label="Floor Plans's Name"
                          variant="standard"
                          type="text"
                          name="planName"
                          placeholder="Enter Plan's Name"
                          // autoComplete="off"
                          onChange={handleChange("planName")}
                          onBlur={handleBlur("planName")}
                          value={values.planName}
                          required
                          className="w-full py-1 my-2"
                          error={
                            errors.planName && touched.planName ? true : false
                          }
                        />
                      </div>
                      {errors.planName && touched.planName ? (
                        <p className="text-red-800">{errors.planName}</p>
                      ) : null}
                    </div>

                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
                      <div className="form-group space-y-2">
                        <Input
                          label="Floor Plans's Area"
                          variant="standard"
                          type="text"
                          name="area"
                          placeholder="Enter Plan's Area"
                          // autoComplete="off"
                          onChange={handleChange("area")}
                          onBlur={handleBlur("area")}
                          value={values.area}
                          required
                          className="w-full py-1 my-2"
                          error={errors.area && touched.area ? true : false}
                        />
                      </div>
                      {errors.area && touched.area ? (
                        <p className="text-red-800">{errors.area}</p>
                      ) : null}
                    </div>

                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
                      <div className="form-group space-y-2">
                        <Input
                          label="Floor Plans's Price"
                          variant="standard"
                          type="text"
                          name="price"
                          placeholder="Enter Plan's Price"
                          // autoComplete="off"
                          onChange={handleChange("price")}
                          onBlur={handleBlur("price")}
                          value={values.price}
                          required
                          className="w-full py-1 my-2"
                          error={errors.price && touched.price ? true : false}
                        />
                      </div>
                      {errors.price && touched.price ? (
                        <p className="text-red-800">{errors.price}</p>
                      ) : null}
                    </div>

                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
                      <div className="form-group space-y-2">
                        <InputLabel id="demo-simple-select-label" required>
                          Plan Image
                        </InputLabel>
                        <Input
                          type="file"
                          onChange={(images) =>
                            setFieldValue(
                              "image",
                              images.currentTarget.files[0]
                            )
                          }
                          onBlur={handleBlur}
                          className="w-full py-1 my-2"
                          required
                          // disabled={bannerUrl ? true : false}
                          variant="standard"
                          error={errors.image && touched.image ? true : false}
                        />
                      </div>
                      {errors.image && touched.image ? (
                        <p className="text-red-800">{errors.image}</p>
                      ) : null}
                    </div>

                    <div className=" px-4 mt-2 w-full overflow-hidden md:w-full">
                      <div className="form-group space-y-2">
                        <Input
                          label="Overview"
                          variant="standard"
                          type="text"
                          name="description"
                          placeholder="Overview"
                          // autoComplete="off"
                          onChange={handleChange("description")}
                          onBlur={handleBlur("description")}
                          value={values.description}
                          required
                          multiline
                          className="w-full py-1 my-2"
                          error={
                            errors.description && touched.description
                              ? true
                              : false
                          }
                        />
                      </div>
                      {errors.description && touched.description ? (
                        <p className="text-red-800">{errors.description}</p>
                      ) : null}
                    </div>

                    <div className="my-4 px-4 w-full overflow-hidden text-center mt-8 md:w-3/3">
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className="inline-flex px-5 py-3 text-white bg-[#d86c07] hover:bg-purple-700 focus:bg-purple-700  rounded-md shadow mb-3"
                      >
                        Save Plan
                      </button>
                    </div>
                  </div>
                )}
              </Formik>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
