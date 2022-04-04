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
import Supervisor from "models/Supervisor";
import dbConnect, { Jsonify } from "middleware/database";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { IconButton } from "@mui/material";
import { useRouter } from "next/router";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const supervisorSchema = Yup.object().shape({
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
  pincode: Yup.string().required("Pincode is required."),
  workingCity: Yup.string().required("Area City is required."),
  workingState: Yup.string().required("Area State is required."),
  workingPincode: Yup.string().required("Area Pincode is required."),
  designation: Yup.string().required("Designation is required."),
  supervisorCode: Yup.string().required("Supervisor Code is required."),
  aadharNo: Yup.string().required("Aadhar Number is required."),
});

export async function getServerSideProps({ query }) {
  await dbConnect();
  const { key } = query;
  const supervisor = await Supervisor.findById(key);
  return {
    props: {
      supervisor: Jsonify(supervisor),
    },
  };
}

export default function EditSupervisor({ supervisor }) {
  const [states, setStates] = useState(null);
  const [cities, setCities] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [isProfilePhotoUpdating, setProfilePhotoUpdating] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(supervisor?.profile_image);
  const router = useRouter();
  const [customCity, setCustomCity] = useState(false);
  const [copyCities, setCopyCities] = useState(null);
  const [workingCity, setWorkingCity] = useState([]);

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

        const index = data.findIndex((x) => x.name === supervisor.state);

        const wIndex = data.findIndex(
          (x) => x.name === supervisor.workingState
        );
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
            setCopyCities(data);
          })
          .catch((err) => console.log(err));

        axios
          .get(
            `https://api.countrystatecity.in/v1/countries/IN/states/${data[wIndex].iso2}/cities`,
            {
              headers: {
                "X-CSCAPI-KEY":
                  "UDZYZHZ0eFJvTGdxdUdkTTVCcnlvdnQxemZuNHRBMVlObzhIdkZ1SQ==",
              },
            }
          )
          .then(({ data }) => {
            setWorkingCity(data);
            console.log;
            setIsReady(true);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  }, []);

  const handleSupervisorSubmission = (values, { setFieldError, resetForm }) => {
    setIsReady(false);
    axios
      .put(`/api/admin/supervisor`, values)
      .then(({ data }) => {
        console.log(data);
        setOpen(true);
        setIsReady(true);
        router.reload();
      })
      .catch((err) => {
        // console.log(err.response.data);
        if (err.response.data.error.code === 11000) {
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
    formData.append("folder", "nims/supervisor");
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
          .put("/api/admin/supervisor", {
            _id: supervisor?._id,
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
              <Link href="/admin/supervisor"> Supervisor Management </Link>
            </li>

            <li className="pr-2 pt-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>

            <li className="pr-2 text-[18px] pt-1  text-[#ffffff]">
              <p>Edit supervisors | {supervisor.name}</p>
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
              Supervisor Saved successfully.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Close</Button>
          </DialogActions>
        </Dialog>

        <h1 className="text-2xl bg-[#efefef] mb-4  pt-4 pb-4 text-[#353435] px-[20px] font-bold tracking-widest text-center capitalize">
          Edit {supervisor.name}
        </h1>
        {isReady ? (
          <div className="flex flex-wrap -mx-4 overflow-hidden">
            <div className="my-4 px-4 w-full overflow-hidden lg:w-4/6">
              <Formik
                enableReinitialize
                initialValues={{
                  name: supervisor?.name,
                  email: supervisor?.email,
                  phone: supervisor.phone,
                  state: supervisor?.state,
                  city: supervisor?.city,
                  address: supervisor?.address,
                  _id: supervisor?._id,
                  dob: supervisor?.dob,
                  department: supervisor?.department,
                  pincode: supervisor?.pincode,
                  workingCity: supervisor?.workingCity,
                  workingState: supervisor?.workingState,
                  workingPincode: supervisor?.workingPincode,
                  designation: supervisor?.designation,
                  aadharNo: supervisor?.aadharNo,
                  supervisorCode: supervisor?.supervisorCode,
                }}
                onSubmit={handleSupervisorSubmission}
                validationSchema={supervisorSchema}
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
                          label="supervisor's Name"
                          variant="standard"
                          type="text"
                          name="name"
                          placeholder="Enter supervisor's Full Name"
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

                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
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
                              .then(({ data }) => {
                                setCities(data), setCopyCities(data);
                              })
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
                          error={
                            errors.pincode && touched.pincode ? true : false
                          }
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
                              .then(({ data }) => setWorkingCity(data))
                              .catch((err) => console.log(err.response.data));
                          }}
                          onBlur={handleBlur("workingState")}
                          fullWidth
                          error={
                            errors.workingState && touched.workingState
                              ? true
                              : false
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
                            errors.workingCity && touched.workingCity
                              ? true
                              : false
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
                          type="text"
                          name="workingPincode"
                          placeholder="Choose a area Pincode for Supervisor"
                          // autoComplete="off"
                          onChange={handleChange("workingPincode")}
                          onBlur={handleBlur("workingPincode")}
                          value={values.workingPincode}
                          required
                          className="w-full py-1 my-2"
                          error={
                            errors.workingPincode && touched.workingPincode
                              ? true
                              : false
                          }
                          inputProps={{ maxLength: 6 }}
                        />
                      </div>
                      {errors.workingPincode && touched.workingPincode ? (
                        <p className="text-red-800">{errors.workingPincode}</p>
                      ) : null}
                    </div>

                    <div className="my-4 px-4 w-full overflow-hidden text-center mt-8 md:w-3/3">
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className="inline-flex px-5 py-3 text-white bg-[#d86c07] hover:bg-purple-700 focus:bg-purple-700  rounded-md shadow mb-3"
                      >
                        Save Supervisor
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
