import React from "react";
import "./global.css";
import Router from "next/router";
import LinearProgress from "@mui/material/LinearProgress";
import { SessionProvider } from "next-auth/react";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { RecoilRoot } from "recoil";
import Admin from "layouts/Admin";
import SuperVisor from "layouts/SuperVisor";
// import { use } from "next-auth/react";

export default function App({
  Component,
  pageProps: { session, ...pageProps },
  router,
}) {
  const [isReady, setIsReady] = React.useState(true);
  // ()=> const session = getSession();

  Router.events.on("routeChangeStart", (url) => {
    setIsReady(false);
  });
  Router.events.on("routeChangeComplete", (url) => {
    // console.log("Routing Done..");
    setIsReady(true);
  });

  if (router.pathname.includes("/admin")) {
    return (
      <SessionProvider session={session}>
        <Admin session={session}>
          {!isReady && (
            <div>
              <div className="fixed w-full bottom-0 z-auto">
                <LinearProgress color="secondary" />
              </div>
              <div className="fixed w-full top-0 z-50">
                <LinearProgress color="secondary" />
              </div>
            </div>
          )}
          <Component {...pageProps} />
        </Admin>
      </SessionProvider>
    );
  } else if (
    router.pathname.includes("/vendor") &&
    !router.pathname.includes("/auth")
  ) {
    return (
      <SessionProvider session={session}>
        {!isReady && (
          <div>
            <div className="fixed w-full bottom-0 z-50">
              <LinearProgress color="secondary" />
            </div>
            <div className="fixed w-full top-0 z-50">
              <LinearProgress color="secondary" />
            </div>
          </div>
        )}
        <Component {...pageProps} />
      </SessionProvider>
    );
  } else if (
    router.pathname.includes("/supervisor") &&
    !router.pathname.includes("/auth")
  ) {
    return (
      <SessionProvider session={session}>
        <SuperVisor session={session}>
          {!isReady && (
            <div>
              <div className="fixed w-full bottom-0 z-auto">
                <LinearProgress color="secondary" />
              </div>
              <div className="fixed w-full top-0 z-50">
                <LinearProgress color="secondary" />
              </div>
            </div>
          )}
          <Component {...pageProps} />
        </SuperVisor>
      </SessionProvider>
    );
  }

  return (
    <SessionProvider>
      <RecoilRoot>
        {!isReady && (
          <div>
            <div className="fixed w-full bottom-0 z-50">
              <LinearProgress color="secondary" />
            </div>
            <div className="fixed w-full top-0 z-50">
              <LinearProgress color="secondary" />
            </div>
          </div>
        )}
        <Component {...pageProps} />
      </RecoilRoot>
    </SessionProvider>
  );
}
