import { getToken } from "next-auth/jwt";

import { NextResponse } from "next/server";

export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // console.log(token);

  const token = await getToken({
    req,
    secret: process.env.SECRET,
    secureCookie:
      process.env.NEXTAUTH_URL?.startsWith("https://") ??
      !!process.env.VERCEL_URL,
  });

  //  http://localhost:3000/auth/super/signin

  let url = req.nextUrl.clone();

  // console.log("hi");
  // console.log(url.NextURL);

  url.pathname = "/auth/super/signin";

  // url.pathname = "/dest";
  // return NextResponse.rewrite(url);
  // return NextResponse.redirect("/auth/super/signin");

  if (token && token?.type === "admin") {
    return NextResponse.next();
  } else if (!token || token?.type != "admin") {
    return NextResponse.rewrite(url);
  } else {
    return NextResponse.rewrite(url);
  }
}
