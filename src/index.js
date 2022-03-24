import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
//css
import styles from "./styles.module.css";

//slider
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

//material ui
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
//icons
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ScreenSearchDesktopIcon from "@mui/icons-material/ScreenSearchDesktop";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import FavoriteIcon from "@mui/icons-material/Favorite";
import StarIcon from "@mui/icons-material/Star";
import CreditCardOffIcon from "@mui/icons-material/CreditCardOff";
import BookmarkAddIcon from "@mui/icons-material/BookmarkAdd";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import dbConnect, { Jsonify } from "middleware/database";
import Property from "models/Property";
import { rgbDataURL } from "util/ColorDataUrl";

import { useRecoilState } from "recoil";
import { searchQueryState } from "atoms/searchQuery";
import { Formik } from "formik";
import { useRouter } from "next/router";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export async function getServerSideProps() {
  // const { page } = query;
  // const limit = 2;
  await dbConnect();
  const propertiesCount = await Property.count();
  const properties = await Property.find({})
    .limit(5)
    .sort({ createdAt: "desc" })
    // .skip(page ? (page - 1) * limit : 0)
    .exec();

  return {
    props: {
      properties: Jsonify(properties),
      propertiesCount: propertiesCount,
      // limit: limit,
    },
  };
}

export default function Home({ properties }) {
  const router = useRouter();
  const [value, setValue] = useState(0);
  const [imageIndex, setImageIndex] = useState(0);
  const propertySliderRef = useRef(null);
  const amentySliderRef = useRef(null);
  const ratedSliderRef = useRef(null);
  const testimonialSliderRef = useRef(null);
  const commericalSliderRef = useRef(null);
  const [searchQuery, setSearchQuery] = useRecoilState(searchQueryState);

  const settingsProperty = {
    className: "slider variable-width",
    // dots: true,
    centerMode: true,
    speed: 5000,
    autoplay: true,
    infinite: true,
    centerPadding: 0,
    slidesToShow: 4,
    speed: 500,
    arrows: false,
    initialSlide: 0,
    swipeToSlide: true,
    beforeChange: (current, next) => setImageIndex(next),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const propertys = [
    {
      id: 1,
      image: require("../../public/images/home/pro/1.jpg"),
      name: "Property 1",
    },
    {
      id: 2,
      image: require("../../public/images/home/pro/2.jpg"),
      name: "Property 2",
    },
    {
      id: 3,
      image: require("../../public/images/home/pro/3.jpg"),
      name: "Property 2",
    },
    {
      id: 4,
      image: require("../../public/images/home/pro/4.jpg"),
      name: "Property 2",
    },
    {
      id: 5,
      image: require("../../public/images/home/pro/1.jpg"),
      name: "Property 2",
    },
  ];

  const settingsAmenty = {
    className: "slider variable-width",
    // dots: true,
    centerMode: true,
    speed: 5000,
    autoplay: true,
    infinite: true,
    centerPadding: 0,
    slidesToShow: 4,
    speed: 500,
    arrows: false,
    initialSlide: 0,
    swipeToSlide: true,
    beforeChange: (current, next) => setImageIndex(next),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const amentys = [
    {
      id: 1,
      image: require("../../public/images/home/amen/1.jpg"),
      name: "Buy a home",
    },
    {
      id: 2,
      image: require("../../public/images/home/amen/2.jpg"),
      name: "Buy a commercial space",
    },
    {
      id: 3,
      image: require("../../public/images/home/amen/1.jpg"),
      name: "Ready To Move",
    },
    {
      id: 4,
      image: require("../../public/images/home/amen/2.jpg"),
      name: "Budget homes",
    },
    {
      id: 5,
      image: require("../../public/images/home/amen/1.jpg"),
      name: "Buy a home",
    },
  ];

  const allproperty = [
    {
      id: 1,
      image: require("../../public/images/home/other/manglam.jpg"),
      logo: require("../../public/images/home/other/manglamlogo.jpg"),
      name: "Manglam Group",
      experience: "50+",
      project: "30",
      location: "Jaipur",
      info: "#",
    },
    {
      id: 1,
      image: require("../../public/images/home/other/mahima.jpg"),
      logo: require("../../public/images/home/other/mahimalogo.jpg"),
      name: "Mahima Group",
      experience: "50+",
      project: "50+",
      location: "Jaipur",
      info: "#",
    },
    {
      id: 2,
      image: require("../../public/images/home/other/shivgyan.jpg"),
      logo: require("../../public/images/home/other/shivgyanlogo.jpg"),
      name: "Shivgyan Developers",
      experience: "20+",
      project: "11",
      location: "Jaipur",
      info: "#",
    },
    {
      id: 3,
      image: require("../../public/images/home/other/ravisurya.jpg"),
      logo: require("../../public/images/home/other/ravisuryalogo.jpg"),
      name: "Ravi Surya Group",
      experience: "20+",
      project: "11",
      location: "Jaipur",
      info: "#",
    },
    {
      id: 4,
      image: require("../../public/images/home/other/triveni.jpg"),
      logo: require("../../public/images/home/other/trivenilogo.jpg"),
      name: "Triveni Group",
      experience: "20+",
      project: "11",
      location: "Jaipur",
      info: "#",
    },
    {
      id: 5,
      image: require("../../public/images/home/other/roodraksh.jpg"),
      logo: require("../../public/images/home/other/roodrakshlogo.jpg"),
      name: "Roodraksh Infratech",
      experience: "20+",
      project: "11",
      location: "Jaipur",
      info: "#",
    },
  ];

  const settingsRated = {
    className: "slider variable-width",
    // dots: true,
    centerMode: true,
    speed: 5000,
    autoplay: true,
    infinite: true,
    centerPadding: 0,
    slidesToShow: 3,
    speed: 500,
    arrows: false,
    initialSlide: 0,
    swipeToSlide: true,
    beforeChange: (current, next) => setImageIndex(next),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  const settingsTestimonials = {
    className: "slider variable-width",
    // dots: true,
    centerMode: true,
    speed: 5000,
    autoplay: true,
    infinite: true,
    centerPadding: 0,
    slidesToShow: 3,
    speed: 500,
    arrows: false,
    initialSlide: 0,
    swipeToSlide: true,
    beforeChange: (current, next) => setImageIndex(next),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const testimonials = [
    {
      id: 1,
      image: require("../../public/images/home/test/1.jpg"),
      name: "Ashok Nagar",
      details:
        "There are many variations of passages of Lorem Ipsum, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. ",
    },
    {
      id: 2,
      image: require("../../public/images/home/test/1.jpg"),
      name: "Ashok Nagar",
      details:
        "There are many variations of passages of Lorem Ipsum, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. ",
    },
    {
      id: 3,
      image: require("../../public/images/home/test/1.jpg"),
      name: "Ashok Nagar",
      details:
        "There are many variations of passages of Lorem Ipsum, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. ",
    },
    {
      id: 4,
      image: require("../../public/images/home/test/1.jpg"),
      name: "Ashok Nagar",
      details:
        "There are many variations of passages of Lorem Ipsum, but the majority have suffered alteration in some form, by injected humour, or randomised words which don't look even slightly believable. ",
    },
  ];

  const settingsCommerical = {
    className: "slider variable-width",
    dots: true,
    centerMode: true,
    speed: 5000,
    autoplay: false,
    infinite: true,
    centerPadding: 0,
    slidesToShow: 1,
    speed: 500,
    arrows: false,
    initialSlide: 0,
    swipeToSlide: true,
    beforeChange: (current, next) => setImageIndex(next),
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  const commericals = [
    {
      id: 1,
      image: require("../../public/images/home/com/1.png"),
      name: " Mahima's Triniti",
      location: "Swej Farm, New Sanganer Rd, Jaipur, Rajasthan 302019",
      type: "Shop",
      rs: "40.50 Lac onwards",
    },
    {
      id: 2,
      image: require("../../public/images/home/com/1.png"),
      name: " Mahima's Triniti",
      location: "Swej Farm, New Sanganer Rd, Jaipur, Rajasthan 302019",
      type: "Shop",
      rs: "40.50 Lac onwards",
    },
    {
      id: 3,
      image: require("../../public/images/home/com/1.png"),
      name: " Mahima's Triniti",
      location: "Swej Farm, New Sanganer Rd, Jaipur, Rajasthan 302019",
      type: "Shop",
      rs: "40.50 Lac onwards",
    },
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleSearchQuerySubmission = (values) => {
    setSearchQuery(values);
    router.push("/search");
  };

  return (
    <div>
      <div className={` ${styles.banners} relative  `}>
        <div className={`${styles.mobhide} `}>
          <Image
            src={require("../../public/images/home/banner.png")}
            alt="Portal"
            className={`w-full mt-1 absolute`}
          />
        </div>
        <div className={`${styles.deskhide} `}>
          <Image
            src={require("../../public/images/home/mobbanner.png")}
            alt="Portal"
            className={`w-full mt-1 absolute`}
          />
        </div>
        <div className="flex md:mt-36 mt-4  flex-wrap overflow-hidden ">
          <div className="w-full text-center absolute z-1   bottom-[#fof] bottom-[6%] md:bottom-1/4 justify-content items-center justify-center">
            <h2 className="text-[#fff] text-[20px] md:text-3xl font-bold mb-6">
              COMPARE THE PROPERTIES IN YOUR LOCATION
            </h2>
            <h6 className="text-[#fff] text-xl font-medium mb-4  font-Poppins">
              Find homes and get detailed insight anytime, anywhere
            </h6>

            <div className="flex flex-wrap overflow-hidden  pl-4 mt-10 md:px-[260px]">
              <div className="w-full text-center   items-center justify-center">
                <Box sx={{ width: "100%" }}>
                  <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                    <Tabs
                      orientation="horizontal"
                      variant="scrollable"
                      value={value}
                      onChange={handleChange}
                      aria-label="horizontal tabs example"
                      sx={{ borderRight: 1, borderColor: "divider" }}
                    >
                      <Tab
                        label="Flats"
                        {...a11yProps(0)}
                        className={` ${styles.depbord}`}
                        style={{
                          backgroundColor:
                            value === 0 ? "#000000c9" : "#fffcfc",
                        }}
                      />
                      <Tab
                        label="Villa"
                        {...a11yProps(1)}
                        className={` ${styles.depbord}`}
                        style={{
                          backgroundColor:
                            value === 1 ? "#000000c9" : "#fffcfc",
                        }}
                      />
                      <Tab
                        label="Residential"
                        {...a11yProps(2)}
                        className={` ${styles.depbord}`}
                        style={{
                          backgroundColor:
                            value === 2 ? "#000000c9" : "#fffcfc",
                        }}
                      />
                    </Tabs>
                  </Box>
                  <TabPanel value={value} index={0} className={styles.mts}>
                    <div className="bg-[#000000c9] rounded-[5px] pl-[20px] pr-[20px] pt-[20px] pb-[10px]">
                      <Formik
                        initialValues={{
                          location: "",
                          query: "",
                          tags: ["2 Bhk", "4 Bhk"],
                        }}
                        onSubmit={handleSearchQuerySubmission}
                        // validationSchema={vendorSchema}
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
                          <div className="flex flex-wrap overflow-hidden lg:-mx-4 md:-mx-4">
                            <div className="my-1 px-3 w-full overflow-hidden lg:my-6   md:my-4  md:w-1/5">
                              <input
                                type="text"
                                placeholder="Location"
                                name="name"
                                className="w-full mb-3 rounded-[4px] bg-white color-[#000] px-[10px] py-[10px]"
                                value={values.location}
                                onChange={handleChange("location")}
                                onBlur={handleBlur("location")}
                                required
                              />
                            </div>
                            <div className="my-1 px-3 w-full overflow-hidden lg:my-6  md:my-4   md:w-3/5">
                              <input
                                type="email"
                                placeholder="Search for locality, landmark, project, or builder"
                                name="email"
                                className="w-full mb-3 rounded-[4px] bg-white color-[#000] px-[10px] py-[10px]"
                                value={values.query}
                                onChange={handleChange("query")}
                                onBlur={handleBlur("query")}
                                required
                              />
                            </div>
                            <div className="my-1 px-3 w-full overflow-hidden lg:my-6   md:my-4  md:w-1/5">
                              <button
                                size="medium"
                                variant="contained"
                                className="w-full mb-3 rounded-[4px] rounded-[3px] text-white px-[10px] py-[10px] bg-[#CF4A05] hover:bg-[#003dd9]"
                                type="submit"
                                onClick={handleSubmit}
                              >
                                <SearchIcon /> Search
                              </button>
                            </div>

                            <div className="my-0 px-3 mt-[-20px] w-full overflow-hidden mb-2 lg:px-6 md:mt-[-5px] mb-0 md:px-4 md:w-full">
                              <Accordion>
                                <AccordionSummary
                                  expandIcon={<ExpandMoreIcon />}
                                  aria-controls="panel1a-content"
                                  id="panel1a-header"
                                  className="bg-[#151212]"
                                >
                                  <p
                                    className={`flex flex-wrap  justify-items-end justify-end items-end w-full`}
                                  >
                                    <span className="text-gray-200 pb-2">
                                      Advanced Search <KeyboardArrowDownIcon />
                                    </span>
                                  </p>
                                </AccordionSummary>
                                <AccordionDetails>
                                  <ul className="flex flex-wrap">
                                    <li>
                                      <FormControlLabel
                                        control={<Checkbox defaultChecked />}
                                        label="Amenties 1"
                                      />
                                    </li>
                                    <li>
                                      <FormControlLabel
                                        control={<Checkbox />}
                                        label="Amenties 2"
                                      />
                                    </li>
                                    <li>
                                      <FormControlLabel
                                        control={<Checkbox />}
                                        label="Amenties 3"
                                      />
                                    </li>
                                    <li>
                                      <FormControlLabel
                                        control={<Checkbox />}
                                        label="Amenties 4"
                                      />
                                    </li>
                                    <li>
                                      <FormControlLabel
                                        control={<Checkbox />}
                                        label="Amenties 5 "
                                      />
                                    </li>
                                  </ul>
                                </AccordionDetails>
                              </Accordion>
                            </div>
                          </div>
                        )}
                      </Formik>
                    </div>
                  </TabPanel>
                  <TabPanel value={value} index={1} className={styles.mts}>
                    <div className="bg-[#000000c9] rounded-[5px] pl-[20px] pr-[20px] pt-[20px] pb-[10px]">
                      <form>
                        <div className="flex flex-wrap overflow-hidden lg:-mx-4 md:-mx-4">
                          <div className="my-1 px-3 w-full overflow-hidden lg:my-6   md:my-4  md:w-1/5">
                            <input
                              type="text"
                              placeholder="Location"
                              name="name"
                              className="w-full mb-3 rounded-[4px] bg-white color-[#000] px-[10px] py-[10px]"
                              required
                            />
                          </div>
                          <div className="my-1 px-3 w-full overflow-hidden lg:my-6  md:my-4   md:w-3/5">
                            <input
                              type="email"
                              placeholder="Search for locality, landmark, project, or builder"
                              name="email"
                              className="w-full mb-3 rounded-[4px] bg-white color-[#000] px-[10px] py-[10px]"
                              required
                            />
                          </div>
                          <div className="my-1 px-3 w-full overflow-hidden lg:my-6   md:my-4  md:w-1/5">
                            <button
                              size="medium"
                              variant="contained"
                              className="w-full mb-3 rounded-[4px] rounded-[3px] text-white px-[10px] py-[10px] bg-[#CF4A05] hover:bg-[#003dd9]"
                            >
                              <SearchIcon /> Search
                            </button>
                          </div>

                          <div className="my-0 px-3 mt-[-20px] w-full overflow-hidden mb-2 lg:px-6 md:mt-[-5px] mb-0 md:px-4 md:w-full">
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                className="bg-[#151212]"
                              >
                                <p
                                  className={`flex flex-wrap  justify-items-end justify-end items-end w-full`}
                                >
                                  <span className="text-gray-200 pb-2">
                                    Advanced Search <KeyboardArrowDownIcon />
                                  </span>
                                </p>
                              </AccordionSummary>
                              <AccordionDetails>
                                <ul className="flex flex-wrap">
                                  <li>
                                    <FormControlLabel
                                      control={<Checkbox defaultChecked />}
                                      label="Amenties 1"
                                    />
                                  </li>
                                  <li>
                                    <FormControlLabel
                                      control={<Checkbox />}
                                      label="Amenties 2"
                                    />
                                  </li>
                                  <li>
                                    <FormControlLabel
                                      control={<Checkbox />}
                                      label="Amenties 3"
                                    />
                                  </li>
                                  <li>
                                    <FormControlLabel
                                      control={<Checkbox />}
                                      label="Amenties 4"
                                    />
                                  </li>
                                  <li>
                                    <FormControlLabel
                                      control={<Checkbox />}
                                      label="Amenties 5 "
                                    />
                                  </li>
                                </ul>
                              </AccordionDetails>
                            </Accordion>
                          </div>
                        </div>
                      </form>
                    </div>
                  </TabPanel>
                  <TabPanel value={value} index={2} className={styles.mts}>
                    <div className="bg-[#000000c9] rounded-[5px] pl-[20px] pr-[20px] pt-[20px] pb-[10px]">
                      <form>
                        <div className="flex flex-wrap overflow-hidden lg:-mx-4 md:-mx-4">
                          <div className="my-1 px-3 w-full overflow-hidden lg:my-6   md:my-4  md:w-1/5">
                            <input
                              type="text"
                              placeholder="Location"
                              name="name"
                              className="w-full mb-3 rounded-[4px] bg-white color-[#000] px-[10px] py-[10px]"
                              required
                            />
                          </div>
                          <div className="my-1 px-3 w-full overflow-hidden lg:my-6  md:my-4   md:w-3/5">
                            <input
                              type="email"
                              placeholder="Search for locality, landmark, project, or builder"
                              name="email"
                              className="w-full mb-3 rounded-[4px] bg-white color-[#000] px-[10px] py-[10px]"
                              required
                            />
                          </div>
                          <div className="my-1 px-3 w-full overflow-hidden lg:my-6   md:my-4  md:w-1/5">
                            <button
                              size="medium"
                              variant="contained"
                              className="w-full mb-3 rounded-[4px] rounded-[3px] text-white px-[10px] py-[10px] bg-[#CF4A05] hover:bg-[#003dd9]"
                            >
                              <SearchIcon /> Search
                            </button>
                          </div>

                          <div className="my-0 px-3 mt-[-20px] w-full overflow-hidden mb-2 lg:px-6 md:mt-[-5px] mb-0 md:px-4 md:w-full">
                            <Accordion>
                              <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                className="bg-[#151212]"
                              >
                                <p
                                  className={`flex flex-wrap  justify-items-end justify-end items-end w-full`}
                                >
                                  <span className="text-gray-200 pb-2">
                                    Advanced Search <KeyboardArrowDownIcon />
                                  </span>
                                </p>
                              </AccordionSummary>
                              <AccordionDetails>
                                <ul className="flex flex-wrap">
                                  <li>
                                    <FormControlLabel
                                      control={<Checkbox defaultChecked />}
                                      label="Amenties 1"
                                    />
                                  </li>
                                  <li>
                                    <FormControlLabel
                                      control={<Checkbox />}
                                      label="Amenties 2"
                                    />
                                  </li>
                                  <li>
                                    <FormControlLabel
                                      control={<Checkbox />}
                                      label="Amenties 3"
                                    />
                                  </li>
                                  <li>
                                    <FormControlLabel
                                      control={<Checkbox />}
                                      label="Amenties 4"
                                    />
                                  </li>
                                  <li>
                                    <FormControlLabel
                                      control={<Checkbox />}
                                      label="Amenties 5 "
                                    />
                                  </li>
                                </ul>
                              </AccordionDetails>
                            </Accordion>
                          </div>
                        </div>
                      </form>
                    </div>
                  </TabPanel>
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={` overflow-hidden relative top:[50%]`}>
        <div className="absolute w-full h-full bg-[#e5e5e5]">
          <Image
            src={require("../../public/images/home/background/bg.png")}
            alt="Portal"
            className={`w-full mt-1`}
            objectFit="fill"
          />
        </div>

        <div className="relative pt-20 pb-16 pl-4 md:px-32">
          <div className={styles.head}>
            <h2> Real Estate in Popular Indian Cities </h2>
          </div>

          <div className="container">
            <div className="mt-10 pl-6 md:pl-0">
              <Slider {...settingsProperty} ref={propertySliderRef}>
                {propertys.map((item, index) => (
                  <div key={index}>
                    <div className="pr-12">
                      <div
                        className={` ${styles.propertyitem} ${styles.radius}`}
                      >
                        <div className={styles.imagu}>
                          <figure>
                            <Image
                              src={item.image}
                              alt="portal"
                              objectFit="cover"
                              layout="responsive"
                            />
                          </figure>
                        </div>
                        <div className={styles.content}>
                          <h3>
                            <a href=""> {item.name} </a>
                          </h3>
                          <a href={item.links}> View Property </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>

              <div className={`flex space-x-4  ${styles.button1}`}>
                <IconButton
                  className={`text-black`}
                  onClick={() => propertySliderRef?.current?.slickPrev()}
                >
                  <ChevronLeftIcon
                    className="text-black"
                    style={{ fontSize: 40 }}
                  />
                </IconButton>
              </div>
              <div className={`flex space-x-4  ${styles.button2}`}>
                <IconButton
                  className={``}
                  onClick={() => propertySliderRef?.current?.slickNext()}
                >
                  <ChevronRightIcon
                    className="text-black"
                    style={{ fontSize: 40 }}
                  />
                </IconButton>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-4 md:px-32 pl-4 md:pl-26">
        <div className={styles.head}>
          <h2> Properties with 5 Star Amenities </h2>
        </div>
        <div className="container mt-16">
          <div className="mt-10 pl-4 relative">
            <Slider {...settingsAmenty} ref={amentySliderRef}>
              {amentys.map((item, index) => (
                <div key={index}>
                  <div className="md:pr-12">
                    <div className={` ${styles.amentyitem}`}>
                      <figure className={` ${styles.radius} `}>
                        <Image src={item.image} alt="portal" />
                      </figure>

                      <h3 className="text-[#000] text-[18px] md:text-[16px] mt-2 font-bold mb-6 text-center font-Montserrat">
                        <a href=""> {item.name} </a>
                      </h3>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>

            <div className={`flex space-x-4  ${styles.buttonen1}`}>
              <IconButton
                className={`text-black`}
                onClick={() => amentySliderRef?.current?.slickPrev()}
              >
                <ChevronLeftIcon
                  className="text-black"
                  style={{ fontSize: 30 }}
                />
              </IconButton>
            </div>
            <div className={`flex space-x-4  ${styles.buttonen2}`}>
              <IconButton
                className={``}
                onClick={() => amentySliderRef?.current?.slickNext()}
              >
                <ChevronRightIcon
                  className="text-black"
                  style={{ fontSize: 30 }}
                />
              </IconButton>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-8 md:pt-20 pb-2   md:px-32">
        <div className={` ${styles.head} pl-4`}>
          <h2> Highest Rated Residential Projects </h2>
        </div>
        <div className="flex flex-wrap overflow-hidden md:-mx-6 pl-4 pr-4">
          <div className="w-full overflow-hidden md:my-6 md:px-6 md:w-8/12">
            <div className="md:mr-32">
              <p className="text-[#000] text-sm font-semibold mt-6 md:mt-2  mb-6 font-Poppins">
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
                The point of using Lorem Ipsum is that it has a more-or-less
                normal distribution of letters, as opposed to using 'Content
                here, content here', making it look
              </p>
            </div>
          </div>

          <div className="w-full overflow-hidden   md:my-6 md:px-6 md:w-4/12">
            <button
              size="medium"
              variant="contained"
              className="md:ml-16 ml-0 px-3 py-4 text-sm text-[#fff] mt-2 md:mt-4  capitalize font-normal rounded-md  bg-[#CF4A05] hover:bg-[#000]"
            >
              Check Out All Listings
            </button>
          </div>
        </div>

        <div className="container mt-14    md:mt-4">
          <div className="mt-2 ml-4  mb-4 mr-8 relative">
            <Slider {...settingsRated} ref={ratedSliderRef}>
              {properties.map((item, index) => (
                <div key={index}>
                  <div
                    className={`  ${styles.rated} md:ml-[10px] md:mr-[10px] `}
                  >
                    <figure className={` ${styles.ratedims} `}>
                      <Image
                        src={item.thumbnail}
                        className="hue-300 rounded-[20px]"
                        alt={item.name}
                        // height={200}
                        quality={60}
                        placeholder={rgbDataURL(2, 129, 210)}
                        layout="fill"
                      />
                    </figure>

                    <div className="flex absolute top-2 w-full">
                      <div className="flex justify-between w-full">
                        <div className="">
                          <figure className={styles.ratedlogo}>
                            <CameraAltIcon /> 10
                          </figure>
                        </div>

                        <div>
                          <div className="pr-2 pt-2 space-x-3">
                            <FavoriteIcon className="text-[#CF4A05] bg-[#fff]  px-1 rounded-md" />
                            <CompareArrowsIcon className="text-[#CF4A05] bg-[#fff]  px-1  rounded-md " />

                            {/* <h2 className="ml-44 md:ml-20 pl-3 text-base text-[#fff] text-center  font-medium ">
                              <span className=" bg-[#CF4A05] px-2  py-1  rounded-md">
                                Compare
                              </span>
                            </h2> */}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div
                      className={` ${styles.ratedmain} flex py-4 flex-wrap pl-3 pr-4 overflow-hidden  relative md:-mx-6 `}
                    >
                      <div className="w-full overflow-hidden md:mt-2 md:px-2 md:w-3/4">
                        <h2 className="text-[#000] text-[16px] font-extrabold  font-Poppins capitalize tracking-wider line-clamp-1">
                          {item.name}
                        </h2>
                      </div>

                      <div className="w-full overflow-hidden md:mt-2 md:w-1/4">
                        <h2 className="text-[background: #333333;] text-[10px] text-right mt-[3px] font-extrabold  font-Poppins">
                          {item.bhk}
                        </h2>
                      </div>

                      <div className="w-full overflow-hidden md:mb-1 md:px-2 md:w-full flex items-center">
                        <h2 className="text-sm text-[#000]  -ml-[8px]  font-medium ">
                          <LocationOnIcon className="text-[#CF4A05] mr-1 text-xl" />
                          {item.city}, {item.state}
                        </h2>
                      </div>

                      <div className="w-full overflow-hidden md:my-2 md:px-2 md:w-1/2">
                        <h2 className="text-[#000] text-sm font-extrabold  font-Poppins">
                          {item.type}
                        </h2>
                      </div>
                      <div className="w-full overflow-hidden text-right  md:w-1/2">
                        <Link
                          href={{
                            pathname: "property/[slug]",
                            query: {
                              slug: item.slug,
                            },
                          }}
                        >
                          <button
                            size="medium"
                            variant="contained"
                            className=" text-[#fff]  text-sm capitalize font-normal px-2 py-2 rounded-md  bg-[#CF4A05] hover:bg-[#000]"
                          >
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>

            <div className={`flex space-x-4  ${styles.buttong1}`}>
              <IconButton
                className={`text-black`}
                onClick={() => ratedSliderRef?.current?.slickPrev()}
              >
                <ChevronLeftIcon
                  className="text-black"
                  style={{ fontSize: 40 }}
                />
              </IconButton>
            </div>
            <div className={`flex space-x-4  ${styles.buttong2}`}>
              <IconButton
                className={``}
                onClick={() => ratedSliderRef?.current?.slickNext()}
              >
                <ChevronRightIcon
                  className="text-black"
                  style={{ fontSize: 40 }}
                />
              </IconButton>
            </div>
          </div>
        </div>
      </div>

      <div className="  md:pt-10 pb-4   pl-4 pr-4 md:px-32">
        <div className={styles.head}>
          <h2> Top Builders </h2>
        </div>
        <div className="flex flex-wrap mb-2 overflow-hidden md:-mx-6">
          <div className="w-full overflow-hidden md:my-6 md:px-6 md:w-9/12">
            <div className="md:mr-32">
              <p className="text-[#000] text-base font-semibold mt-2  mb-6 font-Poppins">
                It is a long established fact that a reader will be distracted
                by the readable content of a page when looking at its layout.
                The point of using Lorem Ipsum is that it has a more-or-less
                normal distribution of letters, as opposed to using 'Content
                here, content here', making it look
              </p>
            </div>
          </div>

          <div className="w-full overflow-hidden  md:my-6 md:px-6 md:w-3/12">
            <button
              size="medium"
              variant="contained"
              className="md:ml-16  px-6 py-4 mt-4 text-base text-[#fff] rounded-md text-base capitalize font-normal   bg-[#CF4A05] hover:bg-[#000]"
            >
              See All Projects
            </button>
          </div>
        </div>

        <div className="flex flex-wrap overflow-hidden md:-mx-6">
          {allproperty.map((item, index) => (
            <div key={index} className=" overflow-hidden  md:px-6 md:w-1/3">
              <div className={styles.all}>
                <figure className={` ${styles.allims} `}>
                  <Image src={item.image} alt="portal" />
                </figure>
                <div className={styles.allcon}>
                  <div className="flex flex-wrap  overflow-hidden md:-mx-6 pb-4 md:pb-0 ">
                    <div className="md:w-1/2 overflow-hidden md:my-4 md:px-6 md:w-1/2">
                      <figure className={styles.alllogo}>
                        <Image src={item.logo} alt="portal" />
                      </figure>
                    </div>
                    <div className="md:w-1/2 overflow-hidden md:my-6  mt-2 ml-32 md:ml-0  md:w-1/2  ">
                      <h2 className="text-[#000]  text-[18px] md:text-[14px] font-semibold  font-Montserrat">
                        {item.name}
                      </h2>
                    </div>

                    <div className="md:w-1/2 text-center overflow-hidden mr-4 md:mr-0 pb-4  md:pb-0 mt-4 md:mt-2 md:px-6 md:w-1/2">
                      <h2 className="text-[#000]  text-md font-extrabold  font-Poppins">
                        {item.experience}
                      </h2>
                      <h6 className="text-[#383838] text-[14px]  md:text-[12px] font-semibold font-Poppins">
                        Years Of Experience
                      </h6>
                    </div>

                    <div className="md:w-1/2 text-center pl-4 pb-4 md:pb-0 overflow-hidden mt-4  md:mt-2 md:px-6 md:w-1/2">
                      <h2 className="text-[#000] text-md font-extrabold  font-Poppins">
                        {item.project}
                      </h2>
                      <h6 className="text-[#383838]  text-[14px]  md:text-[12px] font-semibold font-Poppins">
                        Number Of Projects
                      </h6>
                    </div>

                    <div className=" md:w-1/2 overflow-hidden md:my-6 md:mt-6 md:px-6 md:w-1/2">
                      <h2 className="pl-3 text-[20px] md:text-[16px] mr-10 md:mr-0 text-[#000]   font-medium ">
                        <LocationOnIcon className="text-[#CF4A05] " />
                        {item.location}
                      </h2>
                    </div>

                    <div className="md:w-1/2 text-center overflow-hidden md:my-6   ml-12  md:ml-0  md:w-1/2">
                      <Link href={item.info}>
                        <button
                          size="medium"
                          variant="contained"
                          className="text-[14px] text-[#fff] px-2 py-2 rounded-md text-base capitalize font-normal   bg-[#CF4A05] hover:bg-[#000]"
                        >
                          View Details
                        </button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`  ${styles.bgorg} mt-6 md:mb-24 pt-1 md:pt-6 pb-20 md:pb-12`}
      >
        <div className="mt-12 relative">
          <Slider {...settingsCommerical} ref={commericalSliderRef}>
            {commericals.map((item, index) => (
              <div key={index}>
                <div className="flex flex-wrap overflow-hidden md:-mx-5 px-10 md:px-20 py-10">
                  <div className="w-full overflow-hidden md:my-5 md:px-10 md:w-1/2">
                    <figure>
                      <Image src={item.image} alt="Portal" />
                    </figure>
                  </div>

                  <div
                    className={` ${styles.hrcom} w-full mt-6 overflow-hidden md:my-5 md:px-10 md:w-1/2`}
                  >
                    <div className={styles.head}>
                      <h2> Highest Rated Commercial Spaces </h2>
                    </div>
                    <div className="mt-6">
                      <span>
                        <Stack spacing={1}>
                          <Rating
                            name="size-large"
                            defaultValue={5}
                            size="large"
                          />
                        </Stack>
                      </span>

                      <h2 className="text-[#222222] text-[21px] font-bold mb-1 mt-6 title-font font-bold font-[Montserrat]">
                        {item.name}
                      </h2>
                      <h4 className="text-[15px] text-[#333333]   mt-5  font-semibold ">
                        <LocationOnIcon className="text-[#CF4A05] mr-1" />
                        {item.location}
                      </h4>
                      <p className="text-[15px] text-[#333333]   mt-5 ml-8">
                        <strong className="font-extrabold "> Type : </strong>
                        <span className="font-medium "> {item.type} </span>
                      </p>

                      <p className="text-[15px] text-[#333333]   font-semibold mt-5 ml-8">
                        {item.rs}
                      </p>

                      <button className="ml-8  px-6 py-3  text-sm text-[#fff] mt-8  capitalize font-normal   bg-[#222222] hover:bg-[#CF4A05]">
                        View Details
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          <div className={`flex space-x-4  ${styles.buttonc1}`}>
            <IconButton
              className={`text-black`}
              onClick={() => commericalSliderRef?.current?.slickPrev()}
            >
              <ChevronLeftIcon
                className="text-black"
                style={{ fontSize: 30 }}
              />
            </IconButton>
          </div>
          <div className={`flex space-x-4  ${styles.buttonc2}`}>
            <IconButton
              className={``}
              onClick={() => commericalSliderRef?.current?.slickNext()}
            >
              <ChevronRightIcon
                className="text-black"
                style={{ fontSize: 30 }}
              />
            </IconButton>
          </div>
        </div>
      </div>

      <div className="pt-20 pb-10 md:px-32 pl-8  bg-[#F6F6F6]">
        <div className={styles.head}>
          <h2> Why Use Property Check Karo? </h2>
        </div>

        <div className="flex flex-wrap mt-4 md:mt-12 overflow-hidden pb-24 md:pb-10">
          <div className="w-full md:w-1/2 pl-2">
            <ul className={styles.why}>
              <li>
                <span>
                  <StarIcon />
                </span>
                <strong> Reviewed and Rated by actual customers </strong>
              </li>

              <li>
                <span>
                  <CompareArrowsIcon />
                </span>
                <strong> Exhaustive comparison of Amenities </strong>
              </li>

              <li>
                <span>
                  <ScreenSearchDesktopIcon />
                </span>
                <strong> Easy Search and Custom Filtering </strong>
              </li>

              <li>
                <span>
                  <CreditCardOffIcon />
                </span>
                <strong> No paid featuring </strong>
              </li>

              <li>
                <span>
                  <BookmarkAddIcon />
                </span>
                <strong> Direct booking for a Site Visit </strong>
              </li>
            </ul>
          </div>

          <div className="w-full md:w-1/2 md:px-6 mr-8 md:mr-0 relative">
            <figure className="mt-6">
              <Image
                src={require("../../public/images/home/why/big.jpg")}
                alt="Portal"
                className={`w-full`}
              />
            </figure>
            <div className={` ${styles.btp} absolute  `}>
              <Image
                src={require("../../public/images/home/why/small.png")}
                alt="Portal"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="pt-20 pl-4 pr-4 pb-4 md:px-32">
        <div className={styles.head}>
          <h2> What Our Clients Say </h2>
        </div>

        <div className="mt-12 relative mb-32">
          <Slider {...settingsTestimonials} ref={testimonialSliderRef}>
            {testimonials.map((item, index) => (
              <div key={index}>
                <div className="h-full bg-white-100 border-[1px] border-[#C8C8C8] rounded-md  ml-[10px] mr-[10px] mb-10 p-4 rounded">
                  <div className="flex flex-wrap">
                    <div className="w-9/12">
                      <a className="inline-flex items-center">
                        <Image
                          src={item.image}
                          alt="Portal"
                          className={`w-12 h-12 rounded-full flex-shrink-0 object-cover object-center`}
                        />
                        <span className="flex-grow flex flex-col pl-4">
                          <span className="text-[#000] text-[18px] font-bold mb-1 title-font font-bold ">
                            {item.name}
                          </span>
                          <span className="text-gray-500 text-sm">
                            <Stack spacing={1}>
                              <Rating
                                name="size-large"
                                defaultValue={4}
                                size="large"
                              />
                            </Stack>
                          </span>
                        </span>
                      </a>
                    </div>

                    <div className="text-right w-3/12 -mt-4 -mr-3">
                      <figure>
                        <Image
                          src={require("../../public/images/home/background/left.png")}
                          alt="Portal"
                          className={`w-12 h-12 rounded-full flex-shrink-0 object-cover object-center`}
                        />
                      </figure>
                    </div>
                    <p className="leading-relaxed   mt-2 pl-1  text-[#000] text-[12px] font-bold mb-1  ">
                      {item.details}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </Slider>

          <div className={`flex space-x-4  ${styles.buttong1}`}>
            <IconButton
              className={`text-black`}
              onClick={() => testimonialSliderRef?.current?.slickPrev()}
            >
              <ChevronLeftIcon
                className="text-black"
                style={{ fontSize: 40 }}
              />
            </IconButton>
          </div>
          <div className={`flex space-x-4  ${styles.buttong2}`}>
            <IconButton
              className={``}
              onClick={() => testimonialSliderRef?.current?.slickNext()}
            >
              <ChevronRightIcon
                className="text-black"
                style={{ fontSize: 40 }}
              />
            </IconButton>
          </div>
        </div>
      </div>
    </div>
  );
}
