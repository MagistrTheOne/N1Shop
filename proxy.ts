import { NextRequest, NextResponse } from "next/server";
import { getAuth, hasNeonAuthConfig } from "@/lib/auth/server";

export default function proxy(request: NextRequest) {
  if (!hasNeonAuthConfig()) return NextResponse.redirect(new URL("/login", request.url));
  return getAuth().middleware({ loginUrl: "/login" })(request);
}

export const config = { matcher: ["/account/:path*", "/cart/:path*"] };
