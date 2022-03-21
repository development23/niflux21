import { getToken } from "next-auth/jwt";

import { NextResponse } from "next/server";

export async function middleware(req) {
  // console.log("middleware");
  const token = await getToken({
    req,
    secret: process.env.SECRET,
    secureCookie:
      process.env.NEXTAUTH_URL?.startsWith("https://") ??
      !!process.env.VERCEL_URL,
  });
  // console.log(token);

  const { pathname } = req.nextUrl;
  // console.log(token);
  if (token && token?.type === "vendor") {
    return NextResponse.redirect("/vendor/dashboard");
  } else if (!token && pathname === "/auth/signin") {
    return NextResponse.next();
  } else {
    return NextResponse.next();
  }
}
