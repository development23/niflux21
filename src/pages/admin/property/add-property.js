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
import moment from "moment";
import { useRouter } from "next/router";
import { useState } from "react";
import { useEffect } from "react";
import * as Yup from "yup";
import Link from "next/link";
import { furnishingStatus, tagsArray } from "config/tags";

const FILE_SIZE = 1000000;
const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];

const propertySchema = Yup.object().shape({
  name: Yup.string().required("Name is required."),
  address: Yup.string().required("Address is required."),
  state: Yup.string().required("State is required."),
  city: Yup.string().required("City is required."),
  vid: Yup.string().required("Vender id is required."),
  rera: Yup.string().required("Rera is required."),
  price: Yup.string().required("Price is required."),
  overview: Yup.string().required("Overview is required."),
  description: Yup.string().required("Description is required."),
  amenities: Yup.string().required("Amenities are required."),
  location: Yup.string().required("Location is required."),
  slug: Yup.string().required("Slug is required."),
  banner: Yup.mixed()
    .required("A file is required")
    .test(
      "fileSize",
      "Banner size must be less than 1 MB",
      (value) => value && value.size <= FILE_SIZE
    )
    .test(
      "fileFormat",
      "Unsupported Format",
      (value) => value && SUPPORTED_FORMATS.includes(value.type)
    ),
  thumbnail: Yup.mixed()
    .required("A file is required")
    .test(
      "fileSize",
      "Thumbnail size must be less than 1 MB",
      (value) => value && value.size <= FILE_SIZE
    )
    .test(
      "fileFormat",
      "Unsupported Format",
      (value) => value && SUPPORTED_FORMATS.includes(value.type)
    ),
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
  const { vendor } = query;
  return {
    props: {
      vendor: vendor,
    },
  };
}

export default function AddProperty({ vendor }) {
  const [states, setStates] = useState(null);
  const [cities, setCities] = useState(null);
  const [bannerUrl, setBannerUrl] = useState(null);
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [slug, setSlug] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const router = useRouter();

  const [tags, setTags] = useState(tagsArray);

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

  const handlePropertySubmission = async (
    values,
    { setFieldError, resetForm }
  ) => {
    values.colony = values.colony.toLowerCase();
    setIsReady(true);
    const filesToUpload = [values.banner, values.thumbnail];

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
        values.banner = res[0];
        values.thumbnail = res[1];
        axios
          .post("/api/admin/property", values)
          .then(({ data }) => {
            alert("Property added successfully.");
            resetForm({});
            setIsReady(false);
            router.replace(`/admin/property/${data.record.slug}`);
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
              <Link href="/admin/vendor"> Vendor Management </Link>
            </li>
            <li className="pr-2 pt-2">
              <i className="fas fa-chevron-right text-[14px] text-[#ffffff]"></i>
            </li>

            <li className="pr-2 text-[18px] pt-1  text-[#ffffff]">
              Add Property
            </li>
          </ul>
        </div>
      </div>

      <div className="bg-white px-4 pt-4 pb-10 rounded shadow-sm relative">
        {isReady && (
          <div className="fixed top-0 left-0 w-full h-full z-50 bg-white bg-opacity-60 flex justify-center items-center overflow-hidden">
            <CircularProgress />
          </div>
        )}

        <h1 className="text-2xl font-bold tracking-widest">Add New Property</h1>
        <Formik
          initialValues={{
            name: "",
            state: "",
            city: "",
            address: "",
            vid: vendor,
            rera: "",
            price: "",
            overview: "",
            description: "",
            amenities: "",
            location: "",
            slug: "",
            banner: "",
            thumbnail: "",
            type: "",
            area: "",
            bhk: "",
            status: "",
            tags: [],
            colony: "",
            furnishing: "",
            constructionQuality: "",
          }}
          onSubmit={handlePropertySubmission}
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
            <div className="block sm:flex space-x-3">
              <div className="flex flex-wrap -mx-4 overflow-hidden w-full border-b-2 sm:border-r-2">
                <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
                  <div className="form-group space-y-2">
                    <Input
                      label="Property Name"
                      variant="standard"
                      type="text"
                      name="name"
                      placeholder="Enter Property Name"
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
                <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
                  <div className="form-group space-y-2">
                    <Input
                      label="Generated Slug"
                      variant="standard"
                      name="slug"
                      placeholder="Generated Slug"
                      // autoComplete="off"
                      onChange={handleChange("slug")}
                      onBlur={handleBlur("slug")}
                      value={values.slug}
                      className="w-full py-1 my-2"
                      // disabled
                      // multiline
                      error={errors.slug && touched.slug ? true : false}
                    />
                  </div>
                  {errors.slug && touched.slug ? (
                    <p className="text-red-800">{errors.slug}</p>
                  ) : null}
                </div>
                <div className=" px-4 w-full overflow-hidden">
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
                      className="w-full py-1 "
                      error={errors.address && touched.address ? true : false}
                      multiline
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
                        errors.furnishing && touched.furnishing ? true : false
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

                <div className="mt-8 mb-4 px-4 w-full overflow-hidden md:w-1/2">
                  <div className="form-group space-y-2">
                    <Select
                      label=" Select State "
                      labelId="demo-simple-select-standard-label"
                      id="demo-simple-select-standard"
                      value={values.state}
                      label="Select State"
                      onChange={(e) => {
                        const state = e.target.value;
                        setFieldValue("state", state);

                        const index = states.findIndex((x) => x.name === state);
                        console.log(index);

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
                <div className="mt-8 mb-4 px-4 w-full overflow-hidden md:w-1/2">
                  <div className="form-group space-y-2">
                    <Select
                      label="Select City"
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
                  {errors.constructionQuality && touched.constructionQuality ? (
                    <p className="text-red-800">{errors.constructionQuality}</p>
                  ) : null}
                </div>

                <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
                  <div className="form-group space-y-2">
                    <Select
                      label="Select Property Type"
                      id="demo-simple-select-standard"
                      value={values.type}
                      onChange={handleChange("type")}
                      onBlur={handleBlur("type")}
                      fullWidth
                      error={errors.type && touched.type ? true : false}
                      placeholder="Enter Vendor's Mobile Number"
                      variant="standard"
                      displayEmpty
                    >
                      <MenuItem value="">
                        <em>Select Property Type</em>
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
                    <Select
                      labelId="Select Property Status"
                      id="demo-simple-select-standard"
                      value={values.status}
                      onChange={handleChange("status")}
                      onBlur={handleBlur("status")}
                      fullWidth
                      error={errors.status && touched.status ? true : false}
                      variant="standard"
                      displayEmpty
                    >
                      <MenuItem value="">
                        <em>Select Property Status</em>
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

                <div className="my-8 px-4 w-full overflow-hidden md:w-1/2">
                  <div className="form-group space-y-2">
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
                        <em>Select Bedroom(BHK)</em>
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

                <div className="mt-1 px-4 w-full overflow-hidden md:w-1/2">
                  <div className="form-group space-y-2">
                    <Input
                      label="Enter property area in SQ/Ft."
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

                <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
                  <div className="form-group space-y-2">
                    <InputLabel id="demo-simple-select-label" required>
                      Banner Image
                    </InputLabel>
                    <Input
                      type="file"
                      onChange={(images) =>
                        setFieldValue("banner", images.currentTarget.files[0])
                      }
                      onBlur={handleBlur("banner")}
                      className="w-full py-1 my-2"
                      required
                      disabled={bannerUrl ? true : false}
                      error={errors.banner && touched.banner ? true : false}
                    />
                  </div>

                  {errors.banner && touched.banner ? (
                    <p className="text-red-800">{errors.banner}</p>
                  ) : null}
                </div>
                <div className="my-4 px-4 w-full overflow-hidden md:w-1/2">
                  <div className="form-group space-y-2">
                    <InputLabel id="demo-simple-select-label" required>
                      Thumbnail Image
                    </InputLabel>
                    <Input
                      type="file"
                      onChange={(images) =>
                        setFieldValue(
                          "thumbnail",
                          images.currentTarget.files[0]
                        )
                      }
                      onBlur={handleBlur("thumbnail")}
                      className="w-full py-1 my-2"
                      required
                      disabled={thumbnailUrl ? true : false}
                      error={
                        errors.thumbnail && touched.thumbnail ? true : false
                      }
                    />
                  </div>

                  {errors.thumbnail && touched.thumbnail ? (
                    <p className="text-red-800">{errors.thumbnail}</p>
                  ) : null}
                </div>
                <div className=" px-4 mt-2 w-full overflow-hidden md:w-full">
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
                      error={errors.overview && touched.overview ? true : false}
                    />
                  </div>
                  {errors.overview && touched.overview ? (
                    <p className="text-red-800">{errors.overview}</p>
                  ) : null}
                </div>

                <div className=" mt-4  px-4 w-full overflow-hidden md:w-full">
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
                        errors.description && touched.description ? true : false
                      }
                    />
                  </div>
                  {errors.description && touched.description ? (
                    <p className="text-red-800">{errors.description}</p>
                  ) : null}
                </div>
                <div className=" mt-4  px-4 w-full overflow-hidden md:w-full">
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
                        errors.amenities && touched.amenities ? true : false
                      }
                    />
                  </div>
                  {errors.amenities && touched.amenities ? (
                    <p className="text-red-800">{errors.amenities}</p>
                  ) : null}
                </div>
                <div className=" mt-4  px-4 w-full overflow-hidden md:w-full">
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
                      error={errors.location && touched.location ? true : false}
                    />
                  </div>
                  {errors.location && touched.location ? (
                    <p className="text-red-800">{errors.location}</p>
                  ) : null}
                </div>

                <div className="mt-6 mb-2 px-4 w-full overflow-hidden md:w-full">
                  <h2 className="tracking-wider mb-4 text-xl font-bold">
                    Add Property Tags
                  </h2>
                  <div>
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
                                />
                              }
                              label={item}
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

                <div className="my-4 px-4 w-full overflow-hidden md:w-3/3 text-center mt-6 ">
                  <button
                    onClick={handleSubmit}
                    className="inline-flex px-5 py-3 text-white bg-[#d86c07] hover:bg-purple-700 focus:bg-purple-700 rounded-md shadow mb-3 text-xl"
                  >
                    Add Property
                  </button>
                </div>
              </div>
            </div>
          )}
        </Formik>
      </div>
    </>
  );
}
