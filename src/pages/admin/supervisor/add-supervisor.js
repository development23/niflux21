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

const SupervisorSchema = Yup.object().shape({
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
  password: Yup.string().min(8, "too short").required("Password is required."),
  slug: Yup.string().required("Slug is required."),
  department: Yup.string().required("Department is required."),
  dob: Yup.string().required("DOB is Required."),
  pincode: Yup.string().required("Pincode is required."),
  workingCity: Yup.string().required("Area City is required."),
  workingState: Yup.string().required("Area State is required."),
  workingPincode: Yup.string().required("Area Pincode is required."),
  designation: Yup.string().required("Designation is required."),
  supervisorCode: Yup.string().required("Supervisor Code is required."),
  aadharNo: Yup.string().required("Aadhar Number is required."),
});

export default function AddSupervisor() {
  const [states, setStates] = useState(null);
  const [cities, setCities] = useState(null);
  const [workingCity, setWorkingCity] = useState(null);

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
      .then(({ data }) => setStates(data))
      .catch((err) => console.log(err.response.data));
  }, []);

  const handleSupervisorSubmission = (values, { setFieldError, resetForm }) => {
    var bcrypt = require("bcryptjs");
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(values.password, salt, function (err, hash) {
        values.password = hash;
        axios
          .post(`/api/admin/supervisor`, values)
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
              <Link href="/admin/dashboard"> Home </Link>
            </li>
            <li className="pr-2 pt-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>

            <li className="pr-2 text-[18px] pt-1  text-[#ffffff]">
              <Link href="/admin/Supervisor"> Supervisor Management </Link>
            </li>

            <li className="pr-2 pt-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>

            <li className="pr-2 text-[18px] pt-1  text-[#ffffff]">
              <Link href="/admin/Supervisor/add-supervisor">
                Add Supervisors
              </Link>
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
              Supervisor added successfully.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>

        <h1 className="text-2xl bg-[#efefef] mb-4  pt-4 pb-4 text-[#353435] px-[20px] font-bold tracking-widest text-center">
          Add Supervisor
        </h1>

        <Formik
          initialValues={{
            name: "",
            email: "",
            phone: "",
            state: "",
            city: "",
            address: "",
            password: "",
            slug: "",
            department: "",
            dob: "",
            pincode: "",
            workingCity: "",
            workingState: "",
            workingPincode: "",
            designation: "",
            aadharNo: "",
            supervisorCode: "",
          }}
          onSubmit={handleSupervisorSubmission}
          validationSchema={SupervisorSchema}
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
              <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
                <div className="form-group space-y-2">
                  <Input
                    label="Supervisor's Name"
                    variant="standard"
                    type="text"
                    name="name"
                    placeholder="Enter Supervisor's Full Name"
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
                    label="Supervisor's Slug"
                    variant="standard"
                    type="text"
                    name="slug"
                    placeholder="Enter Supervisor's Slug"
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
                    label="Supervisor's Email"
                    variant="standard"
                    type="email"
                    name="email"
                    placeholder="Enter Supervisor's Email Address"
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
                    label="Supervisor's Mobile Number"
                    variant="standard"
                    type="tel"
                    name="phone"
                    placeholder="Enter Supervisor's Mobile Number"
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
                    label="Supervisor's Account Password"
                    variant="standard"
                    type="password"
                    name="password"
                    placeholder="Choose a password for Supervisor"
                    // autoComplete="off"
                    onChange={handleChange("password")}
                    onBlur={handleBlur("password")}
                    value={values.password}
                    required
                    className="w-full py-1 my-2"
                    error={errors.password && touched.password ? true : false}
                  />
                </div>
                {errors.password && touched.password ? (
                  <p className="text-red-800">{errors.password}</p>
                ) : null}
              </div>

              <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
                <div className="form-group space-y-2">
                  <Input
                    label="Supervisor's Department"
                    variant="standard"
                    type="text"
                    name="department"
                    placeholder="Choose a department for Supervisor"
                    // autoComplete="off"
                    onChange={handleChange("department")}
                    onBlur={handleBlur("department")}
                    value={values.department}
                    required
                    className="w-full py-1 my-2"
                    error={
                      errors.department && touched.department ? true : false
                    }
                  />
                </div>
                {errors.department && touched.department ? (
                  <p className="text-red-800">{errors.department}</p>
                ) : null}
              </div>

              <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
                <div className="form-group space-y-2">
                  <Input
                    label="Supervisor's Designation"
                    variant="standard"
                    type="text"
                    name="designation"
                    placeholder="Choose a Designation for Supervisor"
                    // autoComplete="off"
                    onChange={handleChange("designation")}
                    onBlur={handleBlur("designation")}
                    value={values.designation}
                    required
                    className="w-full py-1 my-2"
                    error={
                      errors.designation && touched.designation ? true : false
                    }
                  />
                </div>
                {errors.designation && touched.designation ? (
                  <p className="text-red-800">{errors.designation}</p>
                ) : null}
              </div>

              <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
                <div className="form-group space-y-2">
                  <Input
                    label="Supervisor's Aadhar Number"
                    variant="standard"
                    type="tel"
                    name="aadharNo"
                    placeholder="Choose a Aadhar Number for Supervisor"
                    // autoComplete="off"
                    onChange={handleChange("aadharNo")}
                    onBlur={handleBlur("aadharNo")}
                    value={values.aadharNo}
                    required
                    className="w-full py-1 my-2"
                    error={errors.aadharNo && touched.aadharNo ? true : false}
                    inputProps={{ maxLength: 12 }}
                  />
                </div>
                {errors.aadharNo && touched.aadharNo ? (
                  <p className="text-red-800">{errors.aadharNo}</p>
                ) : null}
              </div>

              <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
                <div className="form-group space-y-2">
                  <label>Supervisor's Code</label>
                  <Input
                    // label="Supervisor's DOB"
                    variant="standard"
                    type="text"
                    name="supervisorCode"
                    placeholder="Choose a Code for Supervisor"
                    // autoComplete="off"
                    onChange={handleChange("supervisorCode")}
                    onBlur={handleBlur("supervisorCode")}
                    value={values.supervisorCode}
                    required
                    className="w-full py-1 my-2"
                    error={
                      errors.supervisorCode && touched.supervisorCode
                        ? true
                        : false
                    }
                  />
                </div>
                {errors.supervisorCode && touched.supervisorCode ? (
                  <p className="text-red-800">{errors.supervisorCode}</p>
                ) : null}
              </div>

              <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
                <div className="form-group space-y-2">
                  <label>Supervisor's DOB</label>
                  <Input
                    // label="Supervisor's DOB"
                    variant="standard"
                    type="date"
                    name="dob"
                    placeholder="Choose a DOB for Supervisor"
                    // autoComplete="off"
                    onChange={handleChange("dob")}
                    onBlur={handleBlur("dob")}
                    value={values.dob}
                    required
                    className="w-full py-1 my-2"
                    error={errors.dob && touched.dob ? true : false}
                  />
                </div>
                {errors.dob && touched.dob ? (
                  <p className="text-red-800">{errors.dob}</p>
                ) : null}
              </div>

              <div className="my-4 px-4 w-full overflow-hidden md:w-full">
                <div className="form-group space-y-2">
                  <Input
                    label="Supervisor's Address"
                    variant="standard"
                    type="text"
                    name="address"
                    placeholder="Supervisor's Address"
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
                        .then(({ data }) => setCities(data))
                        .catch((err) => console.log(err.response.data));
                    }}
                    onBlur={handleBlur("state")}
                    fullWidth
                    error={errors.state && touched.state ? true : false}
                    placeholder="Enter Supervisor's Mobile Number"
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
                    placeholder="Enter Supervisor's Mobile Number"
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
                    label="Supervisor's Pincode"
                    variant="standard"
                    type="text"
                    name="pincode"
                    placeholder="Choose a Pincode for Supervisor"
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

              <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
                <div className="form-group space-y-2">
                  <InputLabel id="demo-simple-select-label">
                    Select Job State (Selected {values.workingState})
                  </InputLabel>
                  {/* {console.log(values.state)} */}
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={values.workingState}
                    label="Select Job State"
                    onChange={(e) => {
                      const state = e.target.value;
                      setFieldValue("workingState", state);

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
                        .then(({ data }) => setWorkingCity(data))
                        .catch((err) => console.log(err.response.data));
                    }}
                    onBlur={handleBlur("workingState")}
                    fullWidth
                    error={
                      errors.workingState && touched.workingState ? true : false
                    }
                    placeholder="Enter Supervisor's Mobile Number"
                    variant="standard"
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Select Job State</em>
                    </MenuItem>
                    {states != null &&
                      states.map((item, index) => (
                        <MenuItem value={item.name} key={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </Select>
                </div>
                {errors.workingState && touched.workingState ? (
                  <p className="text-red-800">{errors.workingState}</p>
                ) : null}
              </div>
              <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
                <div className="form-group space-y-2">
                  <InputLabel id="demo-simple-select-label">
                    Select Job City
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={values.workingCity}
                    label="Select Job City"
                    onChange={handleChange("workingCity")}
                    onBlur={handleBlur("workingCity")}
                    fullWidth
                    error={
                      errors.workingCity && touched.workingCity ? true : false
                    }
                    placeholder="Enter Supervisor's Mobile Number"
                    variant="standard"
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Select City</em>
                    </MenuItem>
                    {workingCity != null &&
                      workingCity.map((item, index) => (
                        <MenuItem value={item.name} key={item.id}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </Select>
                </div>
                {errors.workingCity && touched.workingCity ? (
                  <p className="text-red-800">{errors.workingCity}</p>
                ) : null}
              </div>

              <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
                <div className="form-group space-y-2">
                  <Input
                    label="Supervisor's Area Pincode"
                    variant="standard"
                    type="tel"
                    name="workingPincode"
                    placeholder="Choose a area Pincode for Supervisor"
                    // autoComplete="off"
                    onChange={handleChange("workingPincode")}
                    onBlur={handleBlur("workingPincode")}
                    value={values.workingPincode}
                    required
                    className="w-full py-1 my-2"
                    inputProps={{ maxLength: 6 }}
                    error={
                      errors.workingPincode && touched.workingPincode
                        ? true
                        : false
                    }
                  />
                </div>
                {errors.workingPincode && touched.workingPincode ? (
                  <p className="text-red-800">{errors.workingPincode}</p>
                ) : null}
              </div>

              <div className="my-4 px-4 w-full overflow-hidden text-center mt-8 md:w-3/3">
                <button
                  onClick={handleSubmit}
                  className="inline-flex px-5 py-3 text-white bg-[#d86c07] hover:bg-purple-700 focus:bg-purple-700  rounded-md shadow mb-3"
                >
                  Add Supervisor
                </button>
              </div>
            </div>
          )}
        </Formik>
      </div>
    </>
  );
}
