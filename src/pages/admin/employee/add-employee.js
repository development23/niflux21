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
import Supervisor from "models/Supervisor";
import dbConnect, { Jsonify } from "middleware/database";
import { useRouter } from "next/router";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const employeeSchema = Yup.object().shape({
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
  supervisor: Yup.string().required("Supervisor is Required."),
  designation: Yup.string().required("Designation is required."),
  employeeCode: Yup.string().required("Employee Code is required."),
  aadharNo: Yup.string().required("Aadhar Number is required."),
  gender: Yup.string().required("Gender is required."),
  emergencyNo1: Yup.string()
    .matches(phoneRegExp, "Emergency number is not valid")
    .min(10, "too short")
    .max(10, "too long")
    .required("Emergency number is required."),
  emergencyNo2: Yup.string()
    .matches(phoneRegExp, "Emergency number is not valid")
    .min(10, "too short")
    .max(10, "too long")
    .required("Emergency number is required."),
  bloodGroup: Yup.string().required("Blood Group is required."),
});

export async function getServerSideProps() {
  dbConnect();
  const supervisors = await Supervisor.find({}).exec();
  return {
    props: {
      supervisors: Jsonify(supervisors),
    },
  };
}

export default function AddEmployee({ supervisors }) {
  const [states, setStates] = useState(null);
  const [cities, setCities] = useState(null);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const allBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
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

  const handleEmployeeSubmission = (values, { setFieldError, resetForm }) => {
    values.name = values.name.toLowerCase();
    values.email = values.email.toLowerCase();
    var bcrypt = require("bcryptjs");
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(values.password, salt, function (err, hash) {
        values.password = hash;
        axios
          .post(`/api/admin/employee`, values)
          .then(({ data }) => {
            setOpen(true);
            resetForm({});
            router.push(`/admin/employee/edit-employee?key=${data.record._id}`);
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
              <Link href="/admin/employee"> Employee Management </Link>
            </li>

            <li className="pr-2 pt-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>

            <li className="pr-2 text-[18px] pt-1  text-[#ffffff]">
              <Link href="/admin/employee/add-employee">Add Employee</Link>
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
              Employee added successfully.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>

        <h1 className="text-2xl bg-[#efefef] mb-4  pt-4 pb-4 text-[#353435] px-[20px] font-bold tracking-widest text-center">
          Add Employee
        </h1>

        <Formik
          // enableReinitialize
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
            dob: moment().subtract(18, "years").format("YYYY-MM-DD"),
            supervisor: "",
            designation: "",
            aadharNo: "",
            employeeCode: "",
            gender: "",
            emergencyNo1: "",
            emergencyNo2: "",
            bloodGroup: "",
          }}
          onSubmit={handleEmployeeSubmission}
          validationSchema={employeeSchema}
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
                    label="Employee's Name"
                    variant="standard"
                    type="text"
                    name="name"
                    placeholder="Enter Employee's Full Name"
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
                    label="Employee's Slug"
                    variant="standard"
                    type="text"
                    name="slug"
                    placeholder="Enter Employee's Slug"
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
                    label="Employee's Email"
                    variant="standard"
                    type="email"
                    name="email"
                    placeholder="Enter Employee's Email Address"
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
                    label="Employee's Mobile Number"
                    variant="standard"
                    type="tel"
                    name="phone"
                    placeholder="Enter Employee's Mobile Number"
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
                    label="Employee's Account Password"
                    variant="standard"
                    type="password"
                    name="password"
                    placeholder="Choose a password for Employee"
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

              <div className="my-4 px-4 w-full overflow-hidden md:w-1/4">
                <div className="form-group space-y-2">
                  <Input
                    label="Employee's Department"
                    variant="standard"
                    type="text"
                    name="department"
                    placeholder="Choose a department for Employee"
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

              <div className="my-4 px-4 w-full overflow-hidden md:w-1/4">
                <div className="form-group space-y-2">
                  <Input
                    label="Employee's Designation"
                    variant="standard"
                    type="text"
                    name="designation"
                    placeholder="Choose a Designation for Employee"
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

              <div className="my-4 px-4 w-full overflow-hidden md:w-1/4">
                <div className="form-group space-y-2">
                  <Input
                    label="Employee's Aadhar Number"
                    variant="standard"
                    type="tel"
                    name="aadharNo"
                    placeholder="Choose a Aadhar Number for Employee"
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

              <div className="my-4 px-4 w-full overflow-hidden md:w-1/4">
                <div className="form-group space-y-2">
                  <InputLabel id="demo-simple-select-label">
                    Select Gender
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={values.gender}
                    label="Select Gender"
                    onChange={handleChange("gender")}
                    onBlur={handleBlur("gender")}
                    fullWidth
                    error={errors.gender && touched.gender ? true : false}
                    // placeholder="Enter Employee's Mobile Number"
                    variant="standard"
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Select Gender</em>
                    </MenuItem>

                    <MenuItem value="Male">Male</MenuItem>

                    <MenuItem value="Female">Female</MenuItem>

                    <MenuItem value="Others">Others</MenuItem>
                  </Select>
                </div>
                {errors.gender && touched.gender ? (
                  <p className="text-red-800">{errors.gender}</p>
                ) : null}
              </div>

              <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
                <div className="form-group space-y-2">
                  <label>Employee's Code</label>
                  <Input
                    // label="Supervisor's DOB"
                    variant="standard"
                    type="text"
                    name="employeeCode"
                    placeholder="Choose a Code for Employee"
                    // autoComplete="off"
                    onChange={handleChange("employeeCode")}
                    onBlur={handleBlur("employeeCode")}
                    value={values.employeeCode}
                    required
                    className="w-full py-1 my-2"
                    error={
                      errors.employeeCode && touched.employeeCode ? true : false
                    }
                  />
                </div>
                {errors.employeeCode && touched.employeeCode ? (
                  <p className="text-red-800">{errors.employeeCode}</p>
                ) : null}
              </div>

              <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
                <div className="form-group space-y-2">
                  <label>Employee's DOB</label>
                  <Input
                    // label="Employee's DOB"
                    variant="standard"
                    type="date"
                    name="dob"
                    inputProps={{
                      max: new Date().toISOString().split("T")[0],
                      min: "1930-01-01",
                    }}
                    placeholder="Choose a DOB for Employee"
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

              <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
                <div className="form-group space-y-2">
                  <InputLabel id="demo-simple-select-label">
                    Select Supervisor
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={values.supervisor}
                    label="Select Supervisor"
                    onChange={handleChange("supervisor")}
                    // onBlur={handleBlur("supervisor")}
                    fullWidth
                    error={
                      errors.supervisor && touched.supervisor ? true : false
                    }
                    // placeholder="Enter Employee's Mobile Number"
                    variant="standard"
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Select Supervisor</em>
                    </MenuItem>
                    {supervisors.map((item, index) => (
                      <MenuItem value={item._id} key={index}>
                        {item.name}
                      </MenuItem>
                    ))}
                  </Select>
                </div>
                {errors.supervisor && touched.supervisor ? (
                  <p className="text-red-800">{errors.supervisor}</p>
                ) : null}
              </div>

              <div className="my-4 px-4 w-full overflow-hidden md:w-full">
                <div className="form-group space-y-2">
                  <Input
                    label="Employee's Address"
                    variant="standard"
                    type="text"
                    name="address"
                    placeholder="Employee's Address"
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
                    placeholder="Enter Employee's Mobile Number"
                    variant="standard"
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Select State</em>
                    </MenuItem>
                    {states != null &&
                      states.map((item, index) => (
                        <MenuItem value={item.name} key={index}>
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
                    placeholder="Enter Employee's Mobile Number"
                    variant="standard"
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Select City</em>
                    </MenuItem>
                    {cities != null &&
                      cities.map((item, index) => (
                        <MenuItem value={item.name} key={index}>
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
                  <InputLabel id="demo-simple-select-label">
                    Select Blood Group
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-standard-label"
                    id="demo-simple-select-standard"
                    value={values.bloodGroup}
                    label="Select Blood Group"
                    onChange={handleChange("bloodGroup")}
                    onBlur={handleBlur("bloodGroup")}
                    fullWidth
                    error={
                      errors.bloodGroup && touched.bloodGroup ? true : false
                    }
                    placeholder="Enter Employee's Blood Group"
                    variant="standard"
                    displayEmpty
                  >
                    <MenuItem value="">
                      <em>Select Blood Group</em>
                    </MenuItem>
                    {allBloodGroups != null &&
                      allBloodGroups.map((item, index) => (
                        <MenuItem value={item} key={index}>
                          {item}
                        </MenuItem>
                      ))}
                  </Select>
                </div>
                {errors.city && touched.city ? (
                  <p className="text-red-800">{errors.city}</p>
                ) : null}
              </div>

              <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
                <div className="form-group space-y-2">
                  <label>Employee's Emergency Number 1</label>
                  <Input
                    // label="Supervisor's DOB"
                    variant="standard"
                    type="tel"
                    name="emergencyNo1"
                    placeholder="Enter Emergency Number 1"
                    // autoComplete="off"
                    onChange={handleChange("emergencyNo1")}
                    onBlur={handleBlur("emergencyNo1")}
                    value={values.emergencyNo1}
                    required
                    className="w-full py-1 my-2"
                    error={
                      errors.emergencyNo1 && touched.emergencyNo1 ? true : false
                    }
                    inputProps={{ maxLength: 10 }}
                  />
                </div>
                {errors.emergencyNo1 && touched.emergencyNo1 ? (
                  <p className="text-red-800">{errors.emergencyNo1}</p>
                ) : null}
              </div>

              <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
                <div className="form-group space-y-2">
                  <label>Employee's Emergency Number 2</label>
                  <Input
                    // label="Supervisor's DOB"
                    variant="standard"
                    type="tel"
                    name="emergencyNo2"
                    inputProps={{ maxLength: 10 }}
                    placeholder="Enter Emergency Number 2"
                    // autoComplete="off"
                    onChange={handleChange("emergencyNo2")}
                    onBlur={handleBlur("emergencyNo2")}
                    value={values.emergencyNo2}
                    required
                    className="w-full py-1 my-2"
                    error={
                      errors.emergencyNo2 && touched.emergencyNo2 ? true : false
                    }
                  />
                </div>
                {errors.emergencyNo2 && touched.emergencyNo2 ? (
                  <p className="text-red-800">{errors.emergencyNo2}</p>
                ) : null}
              </div>

              <div className="my-4 px-4 w-full overflow-hidden text-center mt-8 md:w-3/3">
                <button
                  onClick={handleSubmit}
                  type="submit"
                  className="inline-flex px-5 py-3 text-white bg-[#d86c07] hover:bg-purple-700 focus:bg-purple-700  rounded-md shadow mb-3"
                >
                  Add Employee
                </button>
              </div>
            </div>
          )}
        </Formik>
      </div>
    </>
  );
}
