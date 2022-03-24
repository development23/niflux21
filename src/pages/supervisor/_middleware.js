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

  let url = req.nextUrl.clone();

  url.pathname = "/auth/supervisor/signin";

  if (token && token.type === "supervisor") {
    return NextResponse.next();
  } else {
    //return NextResponse.rewrite(url);
    return NextResponse.redirect(url);
  }
}
