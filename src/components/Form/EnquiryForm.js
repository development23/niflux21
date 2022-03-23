import React, { useEffect } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useSession } from "next-auth/react";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

const phoneSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(phoneRegExp, "Phone number is not valid")
    .min(10, "to short")
    .max(10, "to long")
    .required("Phone number is required."),
  name: Yup.string().required("Name is required."),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required."),
  message: Yup.string().required("Message is required"),
});

export default function EnquiryForm({ vid, pid, vName, pName }) {
  const session = useSession();
  useEffect(() => {}, [session]);
  const submitLead = (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    axios
      .post("/api/common/lead", values)
      .then(({ data }) => {
        console.log(data);
        setSubmitting(false);
        alert("Lead Submitted Successfully.");
        resetForm({
          name: "",
          email: "",
          phone: "",
          message: "",
        });
      })
      .catch((err) => {
        console.log(err);
        setSubmitting(false);
      });
  };
  return (
    <div>
      <Formik
        enableReinitialize
        initialValues={{
          name: (session.status = "authenticated" ? session.data?.name : ""),
          phone: (session.status = "authenticated" ? session.data?.phone : ""),
          email: (session.status = "authenticated" ? session.data?.email : ""),
          message: "",
          vid,
          pid,
          vName,
          pName,
        }}
        validationSchema={phoneSchema}
        onSubmit={submitLead}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          values,
          errors,
          touched,
          isSubmitting,
          setSubmitting,
        }) => (
          <div className="mt-8">
            <div className="my-4">
              <div className="form-group space-y-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Full Name"
                  // autoComplete="off"
                  onChange={handleChange("name")}
                  onBlur={handleBlur("name")}
                  value={values.name}
                  className="w-full mb-1 rounded-[4px] bg-white placeholder:text-[#1a1a1a]  px-[10px] py-[10px]"
                  required
                />
              </div>
              {errors.phone && touched.name ? (
                <p className="text-[#df8d8d] mt-1 mb-3">{errors.name}</p>
              ) : null}
            </div>

            <div className="my-4">
              <div className="form-group space-y-4">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  autoComplete="off"
                  onChange={handleChange("email")}
                  onBlur={handleBlur("email")}
                  value={values.email}
                  required
                  className="w-full mb-1 rounded-[4px] bg-white placeholder:text-[#1a1a1a]  px-[10px] py-[10px]"
                />
              </div>
              {errors.phone && touched.email ? (
                <p className="text-[#df8d8d] mt-1 mb-3">{errors.email}</p>
              ) : null}
            </div>

            <div className="my-4">
              <div className="form-group space-y-4">
                <input
                  type="tel"
                  name="phone"
                  placeholder="Enter Phone"
                  autoComplete="off"
                  onChange={handleChange("phone")}
                  onBlur={handleBlur("phone")}
                  value={values.phone}
                  required
                  maxLength="10"
                  className="w-full mb-1 rounded-[4px] bg-white placeholder:text-[#1a1a1a] px-[10px] py-[10px]"
                />
              </div>
              {errors.phone && touched.phone ? (
                <p className="text-[#df8d8d] mt-1 mb-3">{errors.phone}</p>
              ) : null}
            </div>

            <div className="my-4">
              <div className="form-group space-y-4">
                <textarea
                  type="text"
                  name="message"
                  placeholder="Enter Your Messsage"
                  // autoComplete="off"
                  onChange={handleChange("message")}
                  onBlur={handleBlur("message")}
                  value={values.message}
                  className="w-full mb-1 rounded-[4px] bg-white placeholder:text-[#1a1a1a]  px-[10px] py-[10px]"
                  required
                  row="4"
                ></textarea>
              </div>
              {errors.message && touched.message ? (
                <p className="text-[#df8d8d] mt-1 mb-3">{errors.message}</p>
              ) : null}
            </div>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleSubmit}
                className="w-full mb-3 rounded-[4px] text-white px-[10px] py-[10px] bg-[#CF4A05] hover:bg-[#003dd9]"
                disabled={isSubmitting}
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </Formik>
    </div>
  );
}
