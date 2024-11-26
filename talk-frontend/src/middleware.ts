import { handleGetUser } from "@/lib/server/auth";
import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  const user = await handleGetUser();

  // Redirect to signin if user is not authenticated
  if (!user && !request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/auth/signin", request.url));
  }

  // Redirect to home if user is authenticated
  if (user && request.nextUrl.pathname.startsWith("/auth")) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.redirect(new URL("/home", request.url));
}

export const config = {
  matcher: "/((?!.*\\..*|_next).*)",
};
