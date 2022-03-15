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
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const userSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .min(10, "too short")
    .max(10, "too long")
    .required("Phone number is required."),
  name: Yup.string().required("Name is required."),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required."),
  password: Yup.string().min(8, "too short").required("Password is required."),
});

export default function Register() {
  const router = useRouter();
  const handleUserSubmission = (values, { setFieldError, resetForm }) => {
    const credentials = { username: values.email, password: values.password };
    // console.log(credentials);
    values.name = values.name.toLowerCase();
    values.email = values.email.toLowerCase();
    var bcrypt = require("bcryptjs");
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(values.password, salt, function (err, hash) {
        values.password = hash;
        axios
          .post(`/api/common/user`, values)
          .then(({ data }) => {
            signIn("user-login", {
              username: credentials.username,
              password: credentials.password,
              redirect: false,
            })
              .then((res) => {
                console.log(res);
                if (res.error) {
                  setFieldError("email", "Invalid Credentials");
                } else {
                  console.log(res);
                  router.push("/user/dashboard");
                }
              })
              .catch((error) => {
                console.log(error);
              });

            // resetForm({});
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
          });
      });
    });
  };

  return (
    <div className="h-screen flex justify-center items-center px-4 md:px-20 mt-20">
      <Formik
        initialValues={{
          name: "",
          email: "",
          phone: "",
          password: "",
        }}
        onSubmit={handleUserSubmission}
        validationSchema={userSchema}
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
                  label="Your Name"
                  variant="standard"
                  type="text"
                  name="name"
                  placeholder="Enter Your Full Name"
                  // autoComplete="off"
                  onChange={handleChange("name")}
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

            <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
              <div className="form-group space-y-2">
                <Input
                  label="Your Email"
                  variant="standard"
                  type="email"
                  name="email"
                  placeholder="Enter Your Email Address"
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
                  label="Your Mobile Number"
                  variant="standard"
                  type="tel"
                  name="phone"
                  placeholder="Enter Your Mobile Number"
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
                  label="Your Account Password"
                  variant="standard"
                  type="password"
                  name="password"
                  placeholder="Choose a password"
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

            <div className="my-4 px-4 w-full overflow-hidden text-center mt-8 md:w-3/3">
              <button
                onClick={handleSubmit}
                className="inline-flex px-5 py-3 text-white bg-[#d86c07] hover:bg-purple-700 focus:bg-purple-700  rounded-md shadow mb-3"
              >
                Register
              </button>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}
