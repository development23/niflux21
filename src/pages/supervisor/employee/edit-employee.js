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
import Employee from "models/Employee";
import dbConnect, { Jsonify } from "middleware/database";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { IconButton } from "@mui/material";
import { useRouter } from "next/router";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const FILE_SIZE = 160 * 1024;
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg"];

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
  department: Yup.string().required("Department is required."),
  dob: Yup.string().required("DOB is Required."),
  designation: Yup.string().required("Designation is required."),
  employeeCode: Yup.string().required("Employee Code is required."),
  aadharNo: Yup.string().required("Aadhar Number is required."),
  gender: Yup.string().required("Gender is required."),
  bloodGroup: Yup.string().required("Blood Group is required."),
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
  // aadharFront: Yup.object().shape({
  //   text: Yup.string().required("A text is required"),
  //   file: Yup.mixed()
  //     .required("A file is required")
  //     .test(
  //       "fileSize",
  //       "File too large",
  //       (value) => value && value.size <= FILE_SIZE
  //     )
  //     .test(
  //       "fileFormat",
  //       "Unsupported Format",
  //       (value) => value && SUPPORTED_FORMATS.includes(value.type)
  //     ),
  // }),
  // aadharBack: Yup.object().shape({
  //   text: Yup.string().required("A text is required"),
  //   file: Yup.mixed()
  //     .required("A file is required")
  //     .test(
  //       "fileSize",
  //       "File too large",
  //       (value) => value && value.size <= FILE_SIZE
  //     )
  //     .test(
  //       "fileFormat",
  //       "Unsupported Format",
  //       (value) => value && SUPPORTED_FORMATS.includes(value.type)
  //     ),
  // }),
});

export async function getServerSideProps({ query }) {
  await dbConnect();
  const { key } = query;
  const employee = await Employee.findById(key);
  return {
    props: {
      employee: Jsonify(employee),
    },
  };
}

export default function EditEmployee({ employee }) {
  const [states, setStates] = useState(null);
  const [cities, setCities] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isProfilePhotoUpdating, setProfilePhotoUpdating] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(employee?.profile_image);
  const router = useRouter();
  const allBloodGroups = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];
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

        const index = data.findIndex((x) => x.name === employee.state);
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

  const handleEmployeeSubmission = (values, { setFieldError, resetForm }) => {
    setIsReady(false);
    values.name = values.name.toLowerCase();
    values.email = values.email.toLowerCase();
    values.aadharImages = {
      front: values.aadharFront,
      back: values.aadharBack,
    };
    axios
      .put(`/api/supervisor/employee`, values)
      .then(({ data }) => {
        console.log(data);
        router.replace(router.asPath);
        setOpen(true);
        setIsReady(true);
      })
      .catch((err) => {
        // console.log(err.response.data);
        if (err.response?.data?.error?.code === 11000) {
          setFieldError(
            Object.keys(err.response.data.error.keyValue)[0],
            `Record with this ${
              Object.keys(err.response.data.error.keyValue)[0]
            } already exists.`
          );
        } else {
          console.log(err.response?.data);
        }
        setIsReady(true);
      });
  };

  const handleProfilePhotoUpdate = ({ target }) => {
    setProfilePhotoUpdating(true);
    const formData = new FormData();
    formData.append("file", target.files[0]);
    formData.append("folder", "nims/employee");
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
          .put("/api/supervisor/employee", {
            _id: employee?._id,
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
  const handlePicUpload = (target) => {
    const formData = new FormData();
    formData.append("file", target.files[0]);
    formData.append("folder", "nims/employee");
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
        return fileURL;
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
              <Link href="/supervisor/all-employee"> Employee Management </Link>
            </li>

            <li className="pr-2 pt-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>

            <li className="pr-2 text-[18px] pt-1  text-[#ffffff]">
              <p>Edit employees | {employee.name}</p>
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
              Employee Saved successfully.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>

        <h1 className="text-2xl bg-[#efefef] mb-4  pt-4 pb-4 text-[#353435] px-[20px] font-bold tracking-widest text-center">
          Edit {employee.name}
        </h1>
        {isReady ? (
          <div className="flex flex-wrap -mx-4 overflow-hidden">
            <div className="my-4 px-4 w-full overflow-hidden lg:w-4/6">
              <Formik
                enableReinitialize
                initialValues={{
                  name: employee?.name,
                  email: employee?.email,
                  phone: employee.phone,
                  state: employee?.state,
                  city: employee?.city,
                  address: employee?.address,
                  _id: employee?._id,
                  dob: employee?.dob,
                  department: employee?.department,
                  designation: employee?.designation,
                  aadharNo: employee?.aadharNo,
                  gender: employee?.gender,
                  employeeCode: employee?.employeeCode,
                  bloodGroup: employee?.bloodGroup,
                  aadharFront: employee?.aadharImages.front,
                  aadharBack: employee?.aadharImages.back,
                  emergencyNo2: employee?.emergencyNo2,
                  emergencyNo1: employee?.emergencyNo1,
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

                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
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

                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
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
                            errors.department && touched.department
                              ? true
                              : false
                          }
                        />
                      </div>
                      {errors.department && touched.department ? (
                        <p className="text-red-800">{errors.department}</p>
                      ) : null}
                    </div>

                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
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
                            errors.designation && touched.designation
                              ? true
                              : false
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
                          error={
                            errors.aadharNo && touched.aadharNo ? true : false
                          }
                          inputProps={{ maxLength: 12 }}
                        />
                      </div>
                      {errors.aadharNo && touched.aadharNo ? (
                        <p className="text-red-800">{errors.aadharNo}</p>
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
                            errors.employeeCode && touched.employeeCode
                              ? true
                              : false
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
                          placeholder="Enter Employee's Mobile Number"
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
                          placeholder="Enter Employee's Mobile Number"
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
                        <InputLabel id="demo-simple-select-label">
                          Select Blood Group
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={values.bloodGroup}
                          label="Select Blood Group"
                          onChange={handleChange("bloodGroup")}
                          onBlur={handleBlur("  bloodGroup")}
                          fullWidth
                          error={
                            errors.bloodGroup && touched.bloodGroup
                              ? true
                              : false
                          }
                          placeholder="Enter Employee's Blood Group"
                          variant="standard"
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>Select Blood Group</em>
                          </MenuItem>
                          {allBloodGroups.map((item, index) => (
                            <MenuItem value={item} key={index}>
                              {item}
                            </MenuItem>
                          ))}
                        </Select>
                      </div>
                      {errors.bloodGroup && touched.bloodGroup ? (
                        <p className="text-red-800">{errors.bloodGroup}</p>
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
                            errors.emergencyNo1 && touched.emergencyNo1
                              ? true
                              : false
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
                            errors.emergencyNo2 && touched.emergencyNo2
                              ? true
                              : false
                          }
                        />
                      </div>
                      {errors.emergencyNo2 && touched.emergencyNo2 ? (
                        <p className="text-red-800">{errors.emergencyNo2}</p>
                      ) : null}
                    </div>

                    <div className=" relative  px-4 md:w-1/2 mt-5">
                      <label>Employee's Aadhar Front Images</label>
                      <img
                        src={values.aadharFront}
                        className="hue-300 h-50 mt-3 w-full"
                        alt="..."
                        quality={60}
                        height={110}
                        width={200}
                        // placeholder={rgbDataURL(2, 129, 210)}
                        layout="responsive"
                      />
                      <label htmlFor="icon-button-file1">
                        <Input
                          accept="image/*"
                          id="icon-button-file1"
                          type="file"
                          className="hidden"
                          onChange={async ({ target }) => {
                            const url = await handlePicUpload(target);
                            setFieldValue("aadharFront", url);
                          }}
                          style={{ display: "none" }}
                        />
                        <Button
                          color="primary"
                          aria-label="upload picture"
                          component="span"
                          className="rounded-none absolute bottom-0 bg-black w-full bg-opacity-30 text-center backdrop-blur-[5px] text-slate-100 text-sm py-2 shadow tracking-widest font-bold"
                        >
                          <PhotoCamera />
                          <span className="pl-2"> Change Front Image</span>
                        </Button>
                      </label>
                    </div>
                    {errors.aadharFront && touched.aadharFront ? (
                      <p className="text-red-800">{errors.aadharFront}</p>
                    ) : null}
                    <div className="relative  px-4 md:w-1/2 mt-5">
                      <label>Employee's Aadhar Back Images</label>
                      <img
                        src={values.aadharBack}
                        className="hue-300 mt-3 h-50 w-full"
                        alt="..."
                        quality={60}
                        height={110}
                        width={200}
                        // placeholder={rgbDataURL(2, 129, 210)}
                        layout="responsive"
                      />
                      <label htmlFor="icon-button-file2">
                        <Input
                          accept="image/*"
                          id="icon-button-file2"
                          type="file"
                          className="hidden"
                          onChange={async ({ target }) => {
                            // console.log("SDfsdf");
                            const url = await handlePicUpload(target);
                            setFieldValue("aadharBack", url);
                            // console.log(url);
                          }}
                          style={{ display: "none" }}
                        />
                        <Button
                          color="primary"
                          aria-label="upload picture"
                          component="span"
                          className="rounded-none absolute bottom-0 bg-black w-full bg-opacity-30 text-center backdrop-blur-[5px] text-slate-100 text-sm py-2 shadow tracking-widest font-bold"
                        >
                          <PhotoCamera />
                          <span className="pl-2"> Change Back Image</span>
                        </Button>
                      </label>
                    </div>
                    {errors.aadharBack && touched.aadharBack ? (
                      <p className="text-red-800">{errors.aadharBack}</p>
                    ) : null}
                    <div className="my-4 px-4 w-full overflow-hidden text-center mt-8 md:w-3/3">
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className="inline-flex px-5 py-3 text-white bg-[#d86c07] hover:bg-purple-700 focus:bg-purple-700  rounded-md shadow mb-3"
                      >
                        Save Employee
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
                  <Button
                    color="primary"
                    aria-label="upload picture"
                    component="span"
                    className="rounded-none absolute bottom-0 bg-black w-full bg-opacity-30 text-center backdrop-blur-[5px] text-slate-100 text-sm py-2 shadow tracking-widest font-bold"
                  >
                    <PhotoCamera />
                    <span className="pl-2"> Change Banner Image</span>
                  </Button>
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
