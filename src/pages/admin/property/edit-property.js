import Link from "next/link";
import dbConnect, { Jsonify } from "middleware/database";
import Property from "models/Property";
import IconButton from "@mui/material/IconButton";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { rgbDataURL } from "util/ColorDataUrl";
import {
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  TextField as Input,
} from "@mui/material";
import axios from "axios";
import { Formik } from "formik";

import { useState } from "react";
import { useEffect } from "react";
import * as Yup from "yup";
import moment from "moment";
import { furnishingStatus, tagsArray } from "config/tags";

const propertySchema = Yup.object().shape({
  name: Yup.string().required("Name is required."),
  address: Yup.string().required("Address is required."),
  state: Yup.string().required("State is required."),
  city: Yup.string().required("City is required."),
  vid: Yup.string().required("Vender id is required."),
  rera: Yup.string().required("Rera is required."),
  price: Yup.string().required("Price is required."),
  overview: Yup.string()
    .required("Overview is required.")
    .min(100, "Overview must be at least 100 characters."),
  description: Yup.string()
    .required("Description is required.")
    .min(200, "Overview must be at least 200 characters."),
  amenities: Yup.string().required("Amenities are required."),
  location: Yup.string().required("Location is required."),
  area: Yup.string().required("Property area is required."),
  type: Yup.string().required("Property type is required."),
  bhk: Yup.string().required("Property bedroom details is required."),
  status: Yup.string().required("Property status is required."),
  tags: Yup.array()
    .required("Property tags is required.")
    .min(1, "Please select at least one tag"),
  colony: Yup.string().required("Colony is required."),
  furnishing: Yup.string().required("Furnishing status is required."),
  constructionQuality: Yup.string().required(
    "Construction Quality is required."
  ),
});

export async function getServerSideProps({ query }) {
  await dbConnect();
  const { key } = query;
  const property = await Property.findById(key);
  return {
    props: {
      property: Jsonify(property),
    },
  };
}

export default function EditProperty({ property }) {
  const [states, setStates] = useState(null);
  const [cities, setCities] = useState(null);
  const [bannerUrl, setBannerUrl] = useState(property.banner);
  const [thumbnailUrl, setThumbnailUrl] = useState(property.thumbnail);
  const [isBannerUpdating, setIsBannerUpdating] = useState(false);
  const [isThumbnailUpdating, setIsThumbnailUpdating] = useState(false);
  const [isReady, setIsReady] = useState(false);

  const [tags, setTags] = useState(tagsArray);

  const [isFormReady, setIsFormReady] = useState(true);

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

        const index = data.findIndex((x) => x.name === property.state);
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

  const handlePropertyUpdate = async (values, { setFieldError, resetForm }) => {
    values.colony = values.colony.toLowerCase();
    setIsFormReady(false);
    axios
      .put("/api/admin/property", values)
      .then(({ data }) => {
        alert("Property edited successfully.");
        setIsFormReady(true);
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
          setIsFormReady(true);
        } else {
          console.log(err.response.data);
          setIsFormReady(true);
        }
      });
  };

  const handleBannerUpdate = ({ target }) => {
    setIsBannerUpdating(true);
    const formData = new FormData();
    formData.append("file", target.files[0]);
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
        setBannerUrl(fileURL);
        axios
          .put("/api/admin/property", {
            _id: property._id,
            banner: fileURL,
          })
          .then(({ data }) => {
            alert("Property edited successfully.");
            setIsBannerUpdating(false);
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
              setIsBannerUpdating(false);
            } else {
              console.log(err.response.data);
              setIsBannerUpdating(false);
            }
          });
      })
      .catch((e) => console.log(e));
  };

  const handleThumbnailUpdate = ({ target }) => {
    setIsThumbnailUpdating(true);
    const formData = new FormData();
    formData.append("file", target.files[0]);
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
        setThumbnailUrl(fileURL);
        axios
          .put("/api/admin/property", {
            _id: property._id,
            thumbnail: fileURL,
          })
          .then(({ data }) => {
            alert("Property edited successfully.");
            setIsThumbnailUpdating(false);
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
              setIsThumbnailUpdating(false);
            } else {
              console.log(err.response.data);
              setIsThumbnailUpdating(false);
            }
          });
      })
      .catch((e) => console.log(e));
    // console.log("here");
  };

  return (
    <>
      <div className="px-2 py-3 bg-slate-600 rounded pl-4 text-white shadow mb-5 backdrop-blur-[5px] space-y-1">
        <ul className="flex justify-start ">
          <li className="pr-2 text-[16px] text-[#ffffff]">
            <Link href="/admin/dashboard"> Home </Link>{" "}
          </li>
          <li className="pr-2">
            <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
          </li>

          <li className="pr-2 text-[16px]  text-[#ffffff]">
            <Link href="/admin/property"> Property Management </Link>
          </li>
          <li className="pr-2">
            <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
          </li>
          <li className="pr-2 text-[16px]  text-[#ffffff]">Edit Property</li>
        </ul>
      </div>

      <div className="block sm:flex space-x-3">
        <div className="bg-white px-4 pt-6  pb-10 rounded shadow-sm relative w-full sm:w-4/6">
          {isReady ? (
            <div>
              {!isFormReady && (
                <div className="fixed top-0 left-0 w-full h-full z-50 bg-white bg-opacity-60 flex justify-center items-center overflow-hidden">
                  <CircularProgress />
                </div>
              )}

              <h1 className="text-2xl pb-4 font-bold tracking-widest capitalize">
                Edit Property - ({property.name})
              </h1>
              <Formik
                initialValues={{
                  _id: property._id,
                  name: property.name,
                  state: property.state,
                  city: property.city,
                  address: property.address,
                  vid: property.vid,
                  rera: property.rera,
                  price: property.price,
                  overview: property.overview,
                  description: property.description,
                  amenities: property.amenities,
                  location: property.location,
                  type: property.type,
                  area: property.area,
                  bhk: property.bhk,
                  status: property.status,
                  tags: property.tags,
                  colony: property.colony,
                  furnishing: property.furnishing,
                  constructionQuality: property.constructionQuality,
                }}
                onSubmit={handlePropertyUpdate}
                validationSchema={propertySchema}
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
                    <div className="my-4 px-4 w-full overflow-hidden md:w-full">
                      <div className="form-group space-y-2">
                        <Input
                          label="Property Name"
                          variant="standard"
                          type="text"
                          name="name"
                          placeholder="Enter Property Name"
                          // autoComplete="off"
                          onChange={handleChange("name")}
                          onBlur={handleBlur("name")}
                          //   setFieldValue={}
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
                    <div className="my-4 px-4 w-full overflow-hidden md:w-full">
                      <div className="form-group space-y-2">
                        <Input
                          label="Property Address"
                          variant="standard"
                          type="text"
                          name="address"
                          placeholder="Property Address"
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
                          label="Property Locality"
                          variant="standard"
                          type="text"
                          name="colony"
                          placeholder="Property Locality"
                          // autoComplete="off"
                          onChange={handleChange("colony")}
                          onBlur={handleBlur("colony")}
                          value={values.colony}
                          required
                          className="w-full py-1 my-2"
                          error={errors.colony && touched.colony ? true : false}
                          // multiline
                          // row="4"
                        />
                      </div>
                      {errors.colony && touched.colony ? (
                        <p className="text-red-800">{errors.colony}</p>
                      ) : null}
                    </div>

                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
                      <div className="form-group space-y-2">
                        <InputLabel id="demo-simple-select-label">
                          Select Furnishing Status
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={values.furnishing}
                          label="Select Furnishing Status"
                          onChange={handleChange("furnishing")}
                          onBlur={handleBlur("furnishing")}
                          fullWidth
                          error={
                            errors.furnishing && touched.furnishing
                              ? true
                              : false
                          }
                          placeholder="Enter Vendor's Mobile Number"
                          variant="standard"
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>Select Furnishing Status</em>
                          </MenuItem>
                          {furnishingStatus.map((status, index) => (
                            <MenuItem value={status} key={index}>
                              {status}
                            </MenuItem>
                          ))}
                        </Select>
                      </div>
                      {errors.furnishing && touched.furnishing ? (
                        <p className="text-red-800">{errors.furnishing}</p>
                      ) : null}
                    </div>

                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
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
                          placeholder="Select State"
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
                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
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
                          placeholder="Enter Vendor's Mobile Number"
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
                          label="Rera"
                          variant="standard"
                          type="text"
                          name="rera"
                          placeholder="Enter Rera"
                          // autoComplete="off"
                          onChange={handleChange("rera")}
                          onBlur={handleBlur("rera")}
                          value={values.rera}
                          required
                          className="w-full py-1 my-2"
                          error={errors.rera && touched.rera ? true : false}
                        />
                      </div>
                      {errors.rera && touched.rera ? (
                        <p className="text-red-800">{errors.rera}</p>
                      ) : null}
                    </div>

                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
                      <div className="form-group space-y-2">
                        <Input
                          label="Price"
                          variant="standard"
                          type="text"
                          name="price"
                          placeholder="Enter Price"
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

                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/3">
                      <div className="form-group space-y-2">
                        <Input
                          label="Construction Quality (Separated by comma)"
                          variant="standard"
                          type="text"
                          name="constructionQuality"
                          placeholder="Enter Construction Quality"
                          // autoComplete="off"
                          onChange={handleChange("constructionQuality")}
                          onBlur={handleBlur("constructionQuality")}
                          value={values.constructionQuality}
                          required
                          className="w-full py-1 my-2"
                          error={
                            errors.constructionQuality &&
                            touched.constructionQuality
                              ? true
                              : false
                          }
                        />
                      </div>
                      {errors.constructionQuality &&
                      touched.constructionQuality ? (
                        <p className="text-red-800">
                          {errors.constructionQuality}
                        </p>
                      ) : null}
                    </div>

                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
                      <div className="form-group space-y-2">
                        <InputLabel id="demo-simple-select-label">
                          Select Property Type
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={values.type}
                          label="Select Type"
                          onChange={handleChange("type")}
                          onBlur={handleBlur("type")}
                          fullWidth
                          error={errors.type && touched.type ? true : false}
                          placeholder="Enter Vendor's Mobile Number"
                          variant="standard"
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>Select Type</em>
                          </MenuItem>
                          <MenuItem value="Residential">Residential</MenuItem>
                          <MenuItem value="Commercial">Commercial</MenuItem>
                          <MenuItem value="Rent">Rent</MenuItem>
                          <MenuItem value="Residential/Commercial">
                            Residential/Commercial
                          </MenuItem>
                        </Select>
                      </div>
                      {errors.type && touched.type ? (
                        <p className="text-red-800">{errors.type}</p>
                      ) : null}
                    </div>

                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
                      <div className="form-group space-y-2">
                        <InputLabel id="demo-simple-select-label">
                          Select Property Status
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={values.status}
                          label="Select Status"
                          onChange={handleChange("status")}
                          onBlur={handleBlur("status")}
                          fullWidth
                          error={errors.status && touched.status ? true : false}
                          variant="standard"
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>Select Status</em>
                          </MenuItem>
                          <MenuItem value="Under Construction">
                            Under Construction
                          </MenuItem>
                          <MenuItem value="Developed">Developed</MenuItem>
                        </Select>
                      </div>
                      {errors.status && touched.status ? (
                        <p className="text-red-800">{errors.status}</p>
                      ) : null}
                    </div>

                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
                      <div className="form-group space-y-2">
                        <InputLabel id="demo-simple-select-label">
                          Select Bedroom(BHK)
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-standard-label"
                          id="demo-simple-select-standard"
                          value={values.bhk}
                          label="Select Bedroom(BHK)"
                          onChange={handleChange("bhk")}
                          onBlur={handleBlur("bhk")}
                          fullWidth
                          error={errors.bhk && touched.bhk ? true : false}
                          variant="standard"
                          displayEmpty
                        >
                          <MenuItem value="">
                            <em>Select Bedroom(bhk)</em>
                          </MenuItem>
                          <MenuItem value="1 Bhk">1 Bhk</MenuItem>
                          <MenuItem value="2 Bhk">2 Bhk</MenuItem>
                          <MenuItem value="3 Bhk">3 Bhk</MenuItem>
                          <MenuItem value="4 Bhk">4 Bhk</MenuItem>
                          <MenuItem value="Villa">Villa</MenuItem>
                        </Select>
                      </div>
                      {errors.bhk && touched.bhk ? (
                        <p className="text-red-800">{errors.bhk}</p>
                      ) : null}
                    </div>

                    <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
                      <div className="form-group space-y-2">
                        <InputLabel id="demo-simple-select-label">
                          Property Area*
                        </InputLabel>
                        <Input
                          variant="standard"
                          type="teaxt"
                          name="area"
                          placeholder="Enter property area in SQ/Ft."
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

                    <div className="space-y-4 w-full">
                      <div className=" px-4 w-full overflow-hidden md:w-full">
                        <div className="form-group space-y-2">
                          <Input
                            label="Overview"
                            variant="standard"
                            type="text"
                            name="overview"
                            placeholder="Overview"
                            // autoComplete="off"
                            onChange={handleChange("overview")}
                            onBlur={handleBlur("overview")}
                            value={values.overview}
                            required
                            multiline
                            className="w-full py-1 my-2"
                            error={
                              errors.overview && touched.overview ? true : false
                            }
                            maxLength={200}
                          />
                        </div>
                        {errors.overview && touched.overview ? (
                          <p className="text-red-800">{errors.overview}</p>
                        ) : null}
                      </div>

                      <div className=" px-4 w-full overflow-hidden md:w-full">
                        <div className="form-group space-y-2">
                          <Input
                            label="Description"
                            variant="standard"
                            type="text"
                            name="description"
                            placeholder="Description"
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
                            maxLength="500"
                          />
                        </div>
                        {errors.description && touched.description ? (
                          <p className="text-red-800">{errors.description}</p>
                        ) : null}
                      </div>

                      <div className=" px-4 w-full overflow-hidden md:w-full">
                        <div className="form-group space-y-2">
                          <Input
                            label="Amenities(Comma-separated)"
                            variant="standard"
                            type="text"
                            name="amenities"
                            placeholder="Amenities"
                            // autoComplete="off"
                            onChange={handleChange("amenities")}
                            onBlur={handleBlur("amenities")}
                            value={values.amenities}
                            required
                            multiline
                            className="w-full py-1 my-2"
                            error={
                              errors.amenities && touched.amenities
                                ? true
                                : false
                            }
                          />
                        </div>
                        {errors.amenities && touched.amenities ? (
                          <p className="text-red-800">{errors.amenities}</p>
                        ) : null}
                      </div>
                      <div className=" px-4 w-full overflow-hidden md:w-full">
                        <div className="form-group space-y-2">
                          <Input
                            label="Location Map"
                            variant="standard"
                            type="text"
                            name="location"
                            placeholder="Location"
                            // autoComplete="off"
                            onChange={handleChange("location")}
                            onBlur={handleBlur("location")}
                            value={values.location}
                            required
                            multiline
                            className="w-full py-1 my-2"
                            error={
                              errors.location && touched.location ? true : false
                            }
                          />
                        </div>
                        {errors.location && touched.location ? (
                          <p className="text-red-800">{errors.location}</p>
                        ) : null}
                      </div>

                      <div className=" px-4 w-full overflow-hidden md:w-full">
                        <FormGroup>
                          {(values.type === "Residential" ||
                            values.type === "Rent" ||
                            values.type === "Residential/Commercial") && (
                            <div>
                              {tags[0].props.map((item, index) => (
                                <FormControlLabel
                                  key={index}
                                  control={
                                    <Checkbox
                                      value={item}
                                      name="tags"
                                      inputProps={{ name: "tags" }}
                                      onChange={handleChange("tags")}
                                      defaultChecked={values.tags.includes(
                                        item
                                      )}
                                    />
                                  }
                                  label={item}
                                  name="tags"
                                />
                              ))}
                            </div>
                          )}
                          {(values.type === "Commercial" ||
                            values.type === "Residential/Commercial") && (
                            <div>
                              {tags[1].props.map((item, index) => (
                                <FormControlLabel
                                  key={index}
                                  control={
                                    <Checkbox
                                      onChange={handleChange("tags")}
                                      name="tags"
                                      value={item}
                                      inputProps={{ name: "tags" }}
                                      onChange={handleChange("tags")}
                                      defaultChecked={values.tags.includes(
                                        item
                                      )}
                                    />
                                  }
                                  label={item}
                                  name="tags"
                                />
                              ))}
                            </div>
                          )}
                        </FormGroup>

                        {errors.tags && touched.tags ? (
                          <p className="text-red-800">{errors.tags}</p>
                        ) : null}
                      </div>
                    </div>

                    <div className="my-4 px-4 w-full overflow-hidden text-center mt-8 md:w-3/3">
                      <button
                        type="submit"
                        onClick={handleSubmit}
                        className="inline-flex px-5 py-3 text-white bg-[#d86c07] hover:bg-purple-700 focus:bg-purple-700 rounded-md shadow mb-3 text-xl"
                      >
                        Save Property
                      </button>
                    </div>
                  </div>
                )}
              </Formik>
            </div>
          ) : (
            <div className="fixed top-0 left-0 w-full h-full z-50 bg-white bg-opacity-60 flex justify-center items-center overflow-hidden">
              <CircularProgress />
            </div>
          )}
        </div>

        <div className="bg-white px-4 py-10 rounded shadow-sm relative w-full lg:w-2/6">
          <div className="w-full relative">
            <h2 className="text-xl font-bold tracking-wider uppercase mb-3">
              Feature Images
            </h2>

            {isBannerUpdating && (
              <div className="absolute top-0 left-0 w-full h-full z-50 bg-white bg-opacity-60 flex justify-center items-center overflow-hidden">
                <CircularProgress />
              </div>
            )}

            <img
              src={bannerUrl}
              className="hue-300 h-50 w-full"
              alt="..."
              quality={60}
              height={110}
              width={200}
              placeholder={rgbDataURL(2, 129, 210)}
              layout="responsive"
            />
            <label htmlFor="icon-button-file">
              <Input
                accept="image/*"
                id="icon-button-file"
                type="file"
                className="hidden"
                onChange={handleBannerUpdate}
                style={{ display: "none" }}
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
                className="rounded-none absolute bottom-0 bg-black w-full bg-opacity-30 text-center backdrop-blur-[5px] text-slate-100 text-sm py-2 shadow tracking-widest font-bold"
              >
                <PhotoCamera />{" "}
                <span className="pl-2"> Change Banner Image</span>
              </IconButton>
            </label>
          </div>
          <div className="w-full relative  mt-5">
            {isThumbnailUpdating && (
              <div className="absolute top-0 left-0 w-full h-full z-50 bg-white bg-opacity-60 flex justify-center items-center overflow-hidden">
                <CircularProgress />
              </div>
            )}

            <img
              src={thumbnailUrl}
              className="hue-300 h-50 w-full"
              alt="..."
              quality={60}
              height={110}
              width={200}
              placeholder={rgbDataURL(2, 129, 210)}
              layout="responsive"
            />
            <label htmlFor="icon-button-thumbnail">
              <Input
                accept="image/*"
                id="icon-button-thumbnail"
                type="file"
                className="hidden"
                onChange={handleThumbnailUpdate}
                style={{ display: "none" }}
              />
              <IconButton
                color="primary"
                aria-label="upload picture"
                component="span"
                className="rounded-none absolute bottom-0 bg-black w-full bg-opacity-30 text-center backdrop-blur-[5px] text-slate-100 text-sm py-2 shadow tracking-widest font-bold"
              >
                <PhotoCamera />{" "}
                <span className="pl-2"> Change Thumbnail Image</span>
              </IconButton>
            </label>
          </div>
        </div>
      </div>
    </>
  );
}
