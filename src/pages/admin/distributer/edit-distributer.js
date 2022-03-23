import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputLabel,
  MenuItem,
  Select,
  TextField as Input,
} from "@mui/material";
import axios from "axios";
import { Formik } from "formik";
// import dbConnect from "middleware/database";
import { useState } from "react";
import { useEffect } from "react";
import * as Yup from "yup";
import Link from "next/link";
import moment from "moment";
import Distributer from "models/Distributer";
import dbConnect, { Jsonify } from "middleware/database";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { IconButton } from "@mui/material";
import { useRouter } from "next/router";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const distributerSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .min(10, "too short")
    .max(10, "too long")
    .required("Phone number is required."),
  name: Yup.string().required("Name is required."),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required."),
  address: Yup.string().required("Address is required."),
  state: Yup.string().required("State is required."),
  city: Yup.string().required("City is required."),
  slug: Yup.string().required("Slug is required."),
  category: Yup.string().required("Department is required."),
  category: Yup.string().required("Category is required."),
  longitude: Yup.string().required("Longitude is required."),
  latitude: Yup.string().required("Latitude is required."),
  pincode: Yup.string().required("Pincode is required."),
  gst: Yup.string().required("Gst number is required."),
  pan: Yup.string().required("Pan number is required."),
});

export async function getServerSideProps({ query }) {
  await dbConnect();
  const { key } = query;
  const distributer = await Distributer.findById(key);
  return {
    props: {
      distributer: Jsonify(distributer),
    },
  };
}

export default function EditDistributer({ distributer }) {
  const [states, setStates] = useState(null);
  const [cities, setCities] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isProfilePhotoUpdating, setProfilePhotoUpdating] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(distributer?.profile_image);
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    axios
      .get("https://api.countrystatecity.in/v1/countries/IN/states", {
        headers: {
          "X-CSCAPI-KEY":
            "UDZYZHZ0eFJvTGdxdUdkTTVCcnlvdnQxemZuNHRBMVlObzhIdkZ1SQ==",
        },
      })
      .then(({ data }) => {
        setStates(data);

        const index = data.findIndex((x) => x.name === distributer.state);
        // console.log(index);

        axios
          .get(
            `https://api.countrystatecity.in/v1/countries/IN/states/${data[index].iso2}/cities`,
            {
              headers: {
                "X-CSCAPI-KEY":
                  "UDZYZHZ0eFJvTGdxdUdkTTVCcnlvdnQxemZuNHRBMVlObzhIdkZ1SQ==",
              },
            }
          )
          .then(({ data }) => {
            setCities(data);
            setIsReady(true);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDistributerSubmission = (
    values,
    { setFieldError, resetForm }
  ) => {
    setIsReady(false);
    values.name = values.name.toLowerCase();
    values.email = values.email.toLowerCase();

    values = {
      ...values,
      coordinates: {
        longitude: values.longitude,
        latitude: values.latitude,
      },
    };

    axios
      .put(`/api/admin/distributer`, values)
      .then(({ data }) => {
        console.log(data);
        setOpen(true);
        setIsReady(true);
        router.reload();
      })
      .catch((err) => {
        // console.log(err.response.data);
        if (err.response.data.error?.code === 11000) {
          setFieldError(
            Object.keys(err.response.data.error.keyValue)[0],
            `Record with this ${
              Object.keys(err.response.data.error.keyValue)[0]
            } already exists.`
          );
        } else {
          console.log(err.response.data);
        }
        setIsReady(true);
      });
  };

  const handleProfilePhotoUpdate = ({ target }) => {
    setProfilePhotoUpdating(true);
    const formData = new FormData();
    formData.append("file", target.files[0]);
    formData.append("folder", "nims/distributer");
    formData.append("upload_preset", "usjumoixNIMS"); // Replace the preset name with your own
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
        setProfilePhoto(fileURL);
        axios
          .put("/api/admin/distributer", {
            _id: distributer?._id,
            profile_image: fileURL,
          })
          .then(({ data }) => {
            alert("Property edited successfully.");
            setProfilePhotoUpdating(false);
          })
          .catch((err) => {
            console.log(Error);
            if (err.response.data.error?.code === 11000) {
              console.log(Object.keys(err.response.data.error.keyValue)[0]);
              setFieldError(
                Object.keys(err.response.data.error.keyValue)[0],
                `Record with this ${
                  Object.keys(err.response.data.error.keyValue)[0]
                } already exists.`
              );
              setProfilePhotoUpdating(false);
            } else {
              console.log(err.response.data);
              setProfilePhotoUpdating(false);
            }
          });
      })
      .catch((e) => console.log(e));
  };

  return (
    <>
      <div className="px-2 py-3 bg-slate-600 rounded pl-4 text-white shadow mb-5 backdrop-blur-[5px] space-y-1">
        <div className="justify-between flex">
          <ul className="flex justify-start ">
            <li className="pr-2 text-[18px] pt-1 text-[#ffffff]">
              <Link href="/admin/dashboard"> Home </Link>
            </li>
            <li className="pr-2 pt-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>

            <li className="pr-2 text-[18px] pt-1  text-[#ffffff]">
              <Link href="/admin/distributer"> Distributer Management </Link>
            </li>

            <li className="pr-2 pt-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>

            <li className="pr-2 text-[18px] pt-1  text-[#ffffff]">
              <p>Edit Distributer | {distributer.name}</p>
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white px-4 pt-4 pb-10 rounded shadow-sm">
        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Success"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Distributer Saved successfully.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>

        <h1 className="text-2xl bg-[#efefef] mb-4  pt-4 pb-4 text-[#353435] px-[20px] font-bold tracking-widest text-center">
          Edit {distributer.name}
        </h1>
        {isReady ? (
          <div className="flex flex-wrap -mx-4 overflow-hidden">
            <div className="my-4 px-4 w-full overflow-hidden lg:w-4/6">
              <Formik
                initialValues={{
                  name: distributer?.name,
                  email: distributer?.email,
                  phone: distributer?.phone,
                  state: distributer?.state,
                  city: distributer?.city,
                  address: distributer?.address,
                  // password: "distributer#123",
                  slug: distributer?.slug,
                  category: distributer?.category,
                  longitude: distributer?.coordinates.longitude,
                  latitude: distributer?.coordinates.latitude,
                  pincode: distributer?.pincode,
                  gst: distributer?.gst,
                  pan: distributer?.pan,
                  _id: distributer?._id,
                }}
                onSubmit={handleDistributerSubmission}
                validationSchema={distributerSchema}
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
                    {/* {console.log(errors)} */}
                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
                      <div className="form-group space-y-2">
                        <Input
                          label="Distributer's Name"
                          variant="standard"
                          type="text"
                          name="name"
                          placeholder="Enter Distributer's Full Name"
                          // autoComplete="off"
                          onChange={({ target }) => {
                            const name = target.value;
                            setFieldValue("name", name);
                            setFieldValue(
                              "slug",
                              name
                                .toLowerCase()
                                .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
                                .replace(/\s+/g, "-") // collapse whitespace and replace by -
                                .replace(/-+/g, "-") // collapse dashes
                                .replace(/^-+/, "") // trim - from start of text
                                .replace(/-+$/, "")
                            );
                          }}
                          onBlur={handleBlur("name")}
                          value={values.name}
                          required
                          className="w-full py-1 my-2"
                          error={errors.name && touched.name ? true : false}
                        />
                      </div>
                      {errors.name && touched.name ? (
                        <p className="text-red-800">{errors.name}</p>
                      ) : null}
                    </div>

                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
                      <div className="form-group space-y-2">
                        <Input
                          label="Distributer's Slug"
                          variant="standard"
                          type="text"
                          name="slug"
                          placeholder="Enter Distributer's Slug"
                          // autoComplete="off"
                          onChange={handleChange("slug")}
                          onBlur={handleBlur("slug")}
                          value={values.slug}
                          required
                          className="w-full py-1 my-2"
                          error={errors.slug && touched.slug ? true : false}
                        />
                      </div>
                      {errors.slug && touched.slug ? (
                        <p className="text-red-800">{errors.slug}</p>
                      ) : null}
                    </div>

                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
                      <div className="form-group space-y-2">
                        <Input
                          label="Distributer's Email"
                          variant="standard"
                          type="email"
                          name="email"
                          placeholder="Enter Distributer's Email Address"
                          // autoComplete="off"
                          onChange={handleChange("email")}
                          onBlur={handleBlur("email")}
                          value={values.email}
                          required
                          className="w-full py-1 my-2"
                          error={errors.email && touched.email ? true : false}
                        />
                      </div>
                      {errors.email && touched.email ? (
                        <p className="text-red-800">{errors.email}</p>
                      ) : null}
                    </div>

                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
                      <div className="form-group space-y-2">
                        <Input
                          label="Distributer's Mobile Number"
                          variant="standard"
                          type="tel"
                          name="phone"
                          placeholder="Enter Distributer's Mobile Number"
                          // autoComplete="off"
                          onChange={handleChange("phone")}
                          onBlur={handleBlur("phone")}
                          value={values.phone}
                          required
                          className="w-full py-1 my-2"
                          error={errors.phone && touched.phone ? true : false}
                          inputProps={{ maxLength: 10 }}
                        />
                      </div>
                      {errors.phone && touched.phone ? (
                        <p className="text-red-800">{errors.phone}</p>
                      ) : null}
                    </div>

                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
                      <div className="form-group space-y-2">
                        <Input
                          label="Distributer's Category"
                          variant="standard"
                          type="text"
                          name="category"
                          placeholder="Choose a Category for Distributer"
                          // autoComplete="off"
                          onChange={handleChange("category")}
                          onBlur={handleBlur("category")}
                          value={values.category}
                          required
                          className="w-full py-1 my-2"
                          error={
                            errors.category && touched.category ? true : false
                          }
                        />
                      </div>
                      {errors.category && touched.category ? (
                        <p className="text-red-800">{errors.category}</p>
                      ) : null}
                    </div>

                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
                      <div className="form-group space-y-2">
                        <InputLabel id="demo-simple-select-label">
                          Select State (Selected {values.state})
                        </InputLabel>
                        {/* {console.log(values.state)} */}
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={values.state}
                          label="Select State"
                          onChange={(e) => {
                            const state = e.target.value;
                            setFieldValue("state", state);

                            const index = states.findIndex(
                              (x) => x.name === state
                            );
                            // console.log(index);

                            axios
                              .get(
                                `https://api.countrystatecity.in/v1/countries/IN/states/${states[index].iso2}/cities`,
                                {
                                  headers: {
                                    "X-CSCAPI-KEY":
                                      "UDZYZHZ0eFJvTGdxdUdkTTVCcnlvdnQxemZuNHRBMVlObzhIdkZ1SQ==",
                                  },
                                }
                              )
                              .then(({ data }) => setCities(data))
                              .catch((err) => console.log(err.response.data));
                          }}
                          onBlur={handleBlur("state")}
                          fullWidth
                          error={errors.state && touched.state ? true : false}
                          placeholder="Enter Distributer's Mobile Number"
                          variant="standard"
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>Select State</em>
                          </MenuItem>
                          {states != null &&
                            states.map((item, index) => (
                              <MenuItem value={item.name} key={item.id}>
                                {item.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </div>
                      {errors.state && touched.state ? (
                        <p className="text-red-800">{errors.state}</p>
                      ) : null}
                    </div>
                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
                      <div className="form-group space-y-2">
                        <InputLabel id="demo-simple-select-label">
                          Select City
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={values.city}
                          label="Select City"
                          onChange={handleChange("city")}
                          onBlur={handleBlur("city")}
                          fullWidth
                          error={errors.city && touched.city ? true : false}
                          placeholder="Enter Distributer's Mobile Number"
                          variant="standard"
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>Select City</em>
                          </MenuItem>
                          {cities != null &&
                            cities.map((item, index) => (
                              <MenuItem value={item.name} key={item.id}>
                                {item.name}
                              </MenuItem>
                            ))}
                        </Select>
                      </div>
                      {errors.city && touched.city ? (
                        <p className="text-red-800">{errors.city}</p>
                      ) : null}
                    </div>

                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
                      <div className="form-group space-y-2">
                        <Input
                          label="Distributer's Pincode"
                          variant="standard"
                          type="tel"
                          name="pincode"
                          placeholder="Enter Distributer's Pincode"
                          // autoComplete="off"
                          onChange={handleChange("pincode")}
                          onBlur={handleBlur("pincode")}
                          value={values.pincode}
                          required
                          className="w-full py-1 my-2"
                          error={
                            errors.pincode && touched.pincode ? true : false
                          }
                          inputProps={{ maxLength: 10 }}
                        />
                      </div>
                      {errors.pincode && touched.pincode ? (
                        <p className="text-red-800">{errors.pincode}</p>
                      ) : null}
                    </div>

                    <div className="my-4 px-4 w-full overflow-hidden md:w-full">
                      <div className="form-group space-y-2">
                        <Input
                          label="Distributer's Address"
                          variant="standard"
                          type="text"
                          name="address"
                          placeholder="Distributer's Address"
                          // autoComplete="off"
                          onChange={handleChange("address")}
                          onBlur={handleBlur("address")}
                          value={values.address}
                          required
                          className="w-full py-1 my-2"
                          error={
                            errors.address && touched.address ? true : false
                          }
                          multiline
                          row="4"
                        />
                      </div>
                      {errors.address && touched.address ? (
                        <p className="text-red-800">{errors.address}</p>
                      ) : null}
                    </div>

                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
                      <div className="form-group space-y-2">
                        <Input
                          label="Distributer's GST"
                          variant="standard"
                          type="text"
                          name="gst"
                          placeholder="Enter Distributer's GST"
                          // autoComplete="off"
                          onChange={handleChange("gst")}
                          onBlur={handleBlur("gst")}
                          value={values.gst}
                          required
                          className="w-full py-1 my-2"
                          error={errors.gst && touched.gst ? true : false}
                          // inputProps={{ maxLength: 10 }}
                        />
                      </div>
                      {errors.gst && touched.gst ? (
                        <p className="text-red-800">{errors.gst}</p>
                      ) : null}
                    </div>

                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
                      <div className="form-group space-y-2">
                        <Input
                          label="Distributer's PAN Number"
                          variant="standard"
                          type="text"
                          name="pan"
                          placeholder="Enter Distributer's PAN Number"
                          // autoComplete="off"
                          onChange={handleChange("pan")}
                          onBlur={handleBlur("pan")}
                          value={values.pan}
                          required
                          className="w-full py-1 my-2"
                          error={errors.pan && touched.pan ? true : false}
                          // inputProps={{ maxLength: 10 }}
                        />
                      </div>
                      {errors.pan && touched.pan ? (
                        <p className="text-red-800">{errors.pan}</p>
                      ) : null}
                    </div>

                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
                      <div className="form-group space-y-2">
                        <Input
                          label="Distributer's Location Longitude"
                          variant="standard"
                          type="text"
                          name="longitude"
                          placeholder="Enter Distributer's Location Longitude"
                          // autoComplete="off"
                          onChange={handleChange("longitude")}
                          onBlur={handleBlur("longitude")}
                          value={values.longitude}
                          required
                          className="w-full py-1 my-2"
                          error={
                            errors.longitude && touched.longitude ? true : false
                          }
                          inputProps={{ maxLength: 10 }}
                        />
                      </div>
                      {errors.longitude && touched.longitude ? (
                        <p className="text-red-800">{errors.longitude}</p>
                      ) : null}
                    </div>

                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
                      <div className="form-group space-y-2">
                        <Input
                          label="Distributer's Location Latitude"
                          variant="standard"
                          type="text"
                          name="latitude"
                          placeholder="Enter Distributer's Location Latitude"
                          // autoComplete="off"
                          onChange={handleChange("latitude")}
                          onBlur={handleBlur("latitude")}
                          value={values.latitude}
                          required
                          className="w-full py-1 my-2"
                          error={
                            errors.latitude && touched.latitude ? true : false
                          }
                          inputProps={{ maxLength: 10 }}
                        />
                      </div>
                      {errors.latitude && touched.latitude ? (
                        <p className="text-red-800">{errors.latitude}</p>
                      ) : null}
                    </div>
                    <div className="my-4 px-4 w-full overflow-hidden text-center mt-8 md:w-3/3">
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className="inline-flex px-5 py-3 text-white bg-[#d86c07] hover:bg-purple-700 focus:bg-purple-700  rounded-md shadow mb-3"
                      >
                        Save distributer
                      </button>
                    </div>
                  </div>
                )}
              </Formik>
            </div>

            <div className="my-4 px-4 w-full overflow-hidden lg:w-2/6">
              <h2 className="text-xl font-bold tracking-wider uppercase mb-3">
                Feature Images
              </h2>
              <div className="w-full relative  mt-5">
                {isProfilePhotoUpdating && (
                  <div className="absolute top-0 left-0 w-full h-full z-50 bg-white bg-opacity-60 flex justify-center items-center overflow-hidden">
                    <CircularProgress />
                  </div>
                )}

                <img
                  src={profilePhoto}
                  className="hue-300 h-50 w-full"
                  alt="..."
                  quality={60}
                  height={110}
                  width={200}
                  // placeholder={rgbDataURL(2, 129, 210)}
                  layout="responsive"
                />
                <label htmlFor="icon-button-file">
                  <Input
                    accept="image/*"
                    id="icon-button-file"
                    type="file"
                    className="hidden"
                    onChange={handleProfilePhotoUpdate}
                    style={{ display: "none" }}
                  />
                  <IconButton
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    className="rounded-none absolute bottom-0 bg-black w-full bg-opacity-30 text-center backdrop-blur-[5px] text-slate-100 text-sm py-2 shadow tracking-widest font-bold"
                  >
                    <PhotoCamera />
                    <span className="pl-2"> Change Banner Image</span>
                  </IconButton>
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="fixed top-0 left-0 w-full h-full z-50 bg-white bg-opacity-60 flex justify-center items-center overflow-hidden">
            <CircularProgress />
          </div>
        )}
      </div>
    </>
  );
}
