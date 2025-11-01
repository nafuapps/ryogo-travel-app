import { NextRequest } from "next/server";

export default async function proxy(req: NextRequest) {
}

// Routes Middleware should not run on
export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
