import { getToken } from "next-auth/jwt";

import { NextResponse } from "next/server";

export async function middleware(req) {
  // const { pathname } = req.nextUrl;

  // console.log(token);

  const token = await getToken({
    req,
    secret: process.env.SECRET,
    secureCookie:
      process.env.NEXTAUTH_URL?.startsWith("https://") ??
      !!process.env.VERCEL_URL,
  });

  // console.log(NextResponse);

  if (token && token?.type === "admin") {
    return NextResponse.next();
  } else if (!token || token?.type != "admin") {
    return NextResponse.json({ code: 401, message: "Unauthorized Request." });
  } else {
    return NextResponse.json({ code: 401, message: "Unauthorized Request." });
  }
}
