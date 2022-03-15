import { getToken } from "next-auth/jwt";

import { NextResponse, NextRequest } from "next/server";

export async function middleware(req, res) {
  // console.log(req.headers);
  if (req.headers.get("x-api-key") === process.env.API_KEY) {
    return NextResponse.next();
  }
  return NextResponse.json({ code: 401, message: "Unauthorized Request." });
}
