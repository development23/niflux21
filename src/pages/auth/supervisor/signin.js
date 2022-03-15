import Head from "next/head";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { Formik } from "formik";
import { getCsrfToken } from "next-auth/react";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";
// import User from "models/User";
const loginSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is Required"),

  password: Yup.string().required("Please Enter password"),
});
export async function getServerSideProps(context) {
  // const result = await User.find({}).exec();
  // console.log(result);
  return {
    props: {
      csrfToken: await getCsrfToken(context),
      // user: JSON.stringify(result),
    },
  };
}
// export async function getServerSideProps() {
//   await dbConnect();

//   // axios
//   //   .post("http://localhost:3000/api/admin/property", {
//   //     name: "test",
//   //     price: "text",
//   //     builder: "find",
//   //     sqft: "3434",
//   //   })
//   //   .then(({ data }) => console.log(data))
//   //   .catch((e) => console.log(e));

//   const result = await User.find({}).exec();
//   // console.log(result);
//   return { props: { user: JSON.stringify(result) } };
// }

export default function Home({ csrfToken }) {
  const [handleClick, setHandleClick] = useState(true);
  const [credentialsError, setCredentialsError] = useState(false);
  const router = useRouter();
  const handleLogin = async (values, { setFieldError }) => {
    // console.log(values);
    signIn("supervisor-login", {
      username: values.email,
      password: values.password,
      redirect: false,
    })
      .then((res) => {
        if (res.error) {
          setFieldError("email", "Invalid Credentials");
        } else {
          console.log(res);
          router.push("/supervisor/dashboard");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };
  const { data: session } = useSession();
  // console.log(session);
  // console.log(credentialsError);
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>SuperVisor Login</title>
        <link rel="icon" href="/tinder.png" />
      </Head>

      <main className="flex flex-row h-100 w-full flex-1  justify-between px-4">
        <div className="w-full lg:w-2/5 h-100 justify-center items-center flex  flex-col py-30">
          <div className="self-center">
            <h1 className="  font-serif text-2xl text-slate-600">
              Welcome to Supervisor!👋
            </h1>
            <h2 className="font-extralight mt-3">
              Please sign-in to your account and start the adventure
            </h2>
            <Formik
              initialValues={{
                email: "",
                password: "",
              }}
              validationSchema={loginSchema}
              onSubmit={handleLogin}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <div>
                  <div className="relative mb-4 mt-3">
                    <label
                      htmlFor="email"
                      className="leading-7  font-extralight text-sm text-gray-600"
                    >
                      Email
                    </label>
                    {credentialsError && <h1>Invalid credentials</h1>}

                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      placeholder="xyz@xyz.com"
                      onChange={handleChange}
                      className="w-full bg-white rounded border border-gray-300 focus:border-red-600 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                    />
                    {errors.email && touched.email ? (
                      <div className="text-red-400 text-sm m-1">
                        {errors.email}
                      </div>
                    ) : null}
                  </div>

                  <div className="relative mb-4">
                    <div className="flex flex-row justify-between items-center">
                      <label
                        htmlFor="password"
                        className="leading-7 font-extralight text-sm text-gray-600"
                      >
                        Password
                      </label>
                      <a
                        href="/forgotPassword"
                        className="text-red-600 font-extralight text-xs"
                      >
                        Forgot Password?
                      </a>
                    </div>
                    <div className="flex justify-between flex-row w-full bg-white rounded border border-gray-300  hover:border-red-600 items-center">
                      <input
                        type={handleClick ? "password" : "text"}
                        id="password"
                        name="password"
                        required
                        onChange={handleChange}
                        placeholder="***"
                        className="w-full text-base rounded outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out "
                      />
                      <div
                        className="password__show mr-1"
                        onClick={() => setHandleClick(!handleClick)}
                      >
                        {handleClick ? (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 "
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </svg>
                        ) : (
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                            />
                          </svg>
                        )}
                      </div>
                    </div>
                    {errors.password && touched.password ? (
                      <h1 className="text-red-400 text-sm m-1">
                        {errors.password}
                      </h1>
                    ) : null}
                  </div>
                  <button
                    className="bg-red-600 w-full p-2 text-white rounded-lg font-extralight hover:drop-shadow-xl hover:shadow-red-800"
                    type="submit"
                    onClick={handleSubmit}
                  >
                    Sign in
                  </button>
                </div>
              )}
            </Formik>
          </div>
        </div>
      </main>

      <footer className="flex items-center justify-center w-full h-24 border-t">
        <a
          className="flex items-center justify-center"
          href="http://aladinntech.com/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by ALDS
        </a>
      </footer>
    </div>
  );
}
