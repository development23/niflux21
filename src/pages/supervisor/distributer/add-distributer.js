import {
  Button,
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

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const types = ["Super Stockist", "Distributer", "Retailer", "Direct Dealer"];
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
  // Distributer: Yup.string().required("Distributer is Required."),
});

// export async function getServerSideProps() {
//   dbConnect();
//   const Distributers = await Distributer.find({}).exec();
//   return {
//     props: {
//       Distributers: Jsonify(Distributers),
//     },
//   };
// }

export default function AddDistributer() {
  const [states, setStates] = useState(null);
  const [cities, setCities] = useState(null);
  const [open, setOpen] = useState(false);
  const [customCity, setCustomCity] = useState(false);
  const [copyCities, setCopyCities] = useState(null);
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
      .then(({ data }) => setStates(data))
      .catch((err) => console.log(err.response.data));
  }, []);

  const handleDistributerSubmission = (
    values,
    { setFieldError, resetForm }
  ) => {
    values.name = values.name.toLowerCase();
    values.email = values.email.toLowerCase();

    values = {
      ...values,
      coordinates: {
        longitude: values.longitude,
        latitude: values.latitude,
      },
    };

    // console.log(values);

    var bcrypt = require("bcryptjs");
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(values.password, salt, function (err, hash) {
        values.password = hash;
        axios
          .post(`/api/supervisor/distributer`, values)
          .then(({ data }) => {
            setOpen(true);
            resetForm({});
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
          });
      });
    });
  };

  return (
    <>
      <div className="px-2 py-3 bg-slate-600 rounded pl-4 text-white shadow mb-5 backdrop-blur-[5px] space-y-1">
        <div className="justify-between flex">
          <ul className="flex justify-start ">
            <li className="pr-2 text-[18px] pt-1 text-[#ffffff]">
              <a href="/supervisor/dashboard"> Home </a>
            </li>
            <li className="pr-2 pt-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>

            <li className="pr-2 text-[18px] pt-1  text-[#ffffff]">
              <a href="/supervisor/distributer"> Distributor Management </a>
            </li>

            <li className="pr-2 pt-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>

            <li className="pr-2 text-[18px] pt-1  text-[#ffffff]">
              <a href="/supervisor/distributer/add-distributer">
                Add Distributor
              </a>
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
              Distributor added successfully.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>

        <h1 className="text-2xl bg-[#efefef] mb-4  pt-4 pb-4 text-[#353435] px-[20px] font-bold tracking-widest text-center">
          Add Distributor
        </h1>

        <Formik
          initialValues={{
            name: "",
            email: "",
            phone: "",
            state: "",
            city: "",
            address: "",
            password: "distributer#123",
            slug: "",
            category: "",
            longitude: "",
            latitude: "",
            pincode: "",
            gst: "",
            pan: "",
            type: "",
            // Distributer: "",
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
                    label="Distributor's Name"
                    variant="standard"
                    type="text"
                    name="name"
                    placeholder="Enter Distributor's Full Name"
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
                    label="Distributor's Slug"
                    variant="standard"
                    type="text"
                    name="slug"
                    placeholder="Enter Distributor's Slug"
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
                    label="Distributor's Email"
                    variant="standard"
                    type="email"
                    name="email"
                    placeholder="Enter Distributor's Email Address"
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

              <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
                <div className="form-group space-y-2">
                  <Input
                    label="Distributor's Mobile Number"
                    variant="standard"
                    type="tel"
                    name="phone"
                    placeholder="Enter Distributor's Mobile Number"
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

              <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
                <div className="form-group space-y-2">
                  <Input
                    label="Distributor's Category"
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
                    error={errors.category && touched.category ? true : false}
                  />
                </div>
                {errors.category && touched.category ? (
                  <p className="text-red-800">{errors.category}</p>
                ) : null}
              </div>
              <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
                <div className="form-group space-y-2">
                  <InputLabel id="demo-simple-select-label">
                    Select Type (Selected {values.type})
                  </InputLabel>
                  {/* {console.log(values.state)} */}
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={values.type}
                    label="Select Type"
                    onChange={handleChange("type")}
                    onBlur={handleBlur("state")}
                    fullWidth
                    error={errors.type && touched.type ? true : false}
                    placeholder="Enter Distributor's Mobile Number"
                    variant="standard"
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Select Type</em>
                    </MenuItem>
                    {types != null &&
                      types.map((item, index) => (
                        <MenuItem value={item} key={item}>
                          {item}
                        </MenuItem>
                      ))}
                  </Select>
                </div>
                {errors.type && touched.type ? (
                  <p className="text-red-800">{errors.type}</p>
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

                      const index = states.findIndex((x) => x.name === state);
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
                        .then(({ data }) => {
                          setCities(data), setCopyCities(data);
                        })
                        .catch((err) => console.log(err.response.data));
                    }}
                    onBlur={handleBlur("state")}
                    fullWidth
                    error={errors.state && touched.state ? true : false}
                    placeholder="Enter Distributor's Mobile Number"
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
                {!customCity && (
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
                      placeholder="Enter Employee's Mobile Number"
                      variant="standard"
                      displayEmpty
                    >
                      <MenuItem value="">
                        <em>Select City</em>
                      </MenuItem>
                      {cities && (
                        <MenuItem onClick={() => setCustomCity(true)}>
                          <em>Add Custom</em>
                        </MenuItem>
                      )}

                      {cities != null &&
                        cities.map((item, index) => (
                          <MenuItem value={item.name} key={index}>
                            {item.name}
                          </MenuItem>
                        ))}
                    </Select>
                  </div>
                )}
                {!customCity && errors.city && touched.city ? (
                  <p className="text-red-800">{errors.city}</p>
                ) : null}
                {customCity && (
                  <div className="form-group flex flex-wrap items-center px-2 space-y-2">
                    <div className="w-3/4">
                      <Input
                        label="Type City"
                        variant="standard"
                        type="text"
                        name="city"
                        placeholder="Type City"
                        autoComplete="off"
                        onChange={handleChange("city")}
                        onBlur={({ target }) => {
                          let text = target.value;

                          const result = cities.includes(
                            (item) => item.name == text
                          );

                          console.log(result);

                          if (!result)
                            setCities([{ name: text }, ...cities]),
                              setFieldValue("city", text);
                        }}
                        // onBlur={handleBlur("city")}
                        value={values.city}
                        required
                        className="w-full py-1 my-2"
                        error={errors.city && touched.city ? true : false}
                        multiline
                        row="4"
                      />
                    </div>
                    <div className="w-1/4">
                      <Button
                        onClick={() => {
                          setCustomCity(false), setCities(copyCities);
                        }}
                      >
                        X
                      </Button>
                    </div>
                    {customCity && errors.city && touched.city ? (
                      <p className="text-red-800">{errors.city}</p>
                    ) : null}
                  </div>
                )}
              </div>

              <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
                <div className="form-group space-y-2">
                  <Input
                    label="Distributor's Pincode"
                    variant="standard"
                    type="tel"
                    name="pincode"
                    placeholder="Enter Distributor's Pincode"
                    // autoComplete="off"
                    onChange={handleChange("pincode")}
                    onBlur={handleBlur("pincode")}
                    value={values.pincode}
                    required
                    className="w-full py-1 my-2"
                    error={errors.pincode && touched.pincode ? true : false}
                    inputProps={{ maxLength: 6 }}
                  />
                </div>
                {errors.pincode && touched.pincode ? (
                  <p className="text-red-800">{errors.pincode}</p>
                ) : null}
              </div>

              <div className="my-4 px-4 w-full overflow-hidden md:w-full">
                <div className="form-group space-y-2">
                  <Input
                    label="Distributor's Address"
                    variant="standard"
                    type="text"
                    name="address"
                    placeholder="Distributor's Address"
                    // autoComplete="off"
                    onChange={handleChange("address")}
                    onBlur={handleBlur("address")}
                    value={values.address}
                    required
                    className="w-full py-1 my-2"
                    error={errors.address && touched.address ? true : false}
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
                    label="Distributor's GST"
                    variant="standard"
                    type="text"
                    name="gst"
                    placeholder="Enter Distributor's GST"
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
                    label="Distributor's PAN Number"
                    variant="standard"
                    type="text"
                    name="pan"
                    placeholder="Enter Distributor's PAN Number"
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
                    label="Distributor's Location Longitude"
                    variant="standard"
                    type="text"
                    name="longitude"
                    placeholder="Enter Distributor's Location Longitude"
                    // autoComplete="off"
                    onChange={handleChange("longitude")}
                    onBlur={handleBlur("longitude")}
                    value={values.longitude}
                    required
                    className="w-full py-1 my-2"
                    error={errors.longitude && touched.longitude ? true : false}
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
                    label="Distributor's Location Latitude"
                    variant="standard"
                    type="text"
                    name="latitude"
                    placeholder="Enter Distributor's Location Latitude"
                    // autoComplete="off"
                    onChange={handleChange("latitude")}
                    onBlur={handleBlur("latitude")}
                    value={values.latitude}
                    required
                    className="w-full py-1 my-2"
                    error={errors.latitude && touched.latitude ? true : false}
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                {errors.latitude && touched.latitude ? (
                  <p className="text-red-800">{errors.latitude}</p>
                ) : null}
              </div>

              <div className="my-4 px-4 w-full overflow-hidden text-center mt-8 md:w-3/3">
                <button
                  onClick={handleSubmit}
                  type="submit"
                  className="inline-flex px-5 py-3 text-white bg-[#d86c07] hover:bg-purple-700 focus:bg-purple-700  rounded-md shadow mb-3"
                >
                  Add Distributor
                </button>
              </div>
            </div>
          )}
        </Formik>
      </div>
    </>
  );
}
