import {
  SESSION_COOKIE_NAME,
  SESSION_COOKIE_REFRESH_MINUTES,
} from "@ryogo-travel-app/api/apiConfig"
import { NextRequest, NextResponse } from "next/server"
import {
  decrypt,
  SessionPayloadType,
  updateWebSessionFromDB,
} from "./lib/session"
import { differenceInMinutes } from "date-fns"
import { UserStatusEnum } from "@ryogo-travel-app/db/schema"

export default async function proxy(request: NextRequest) {
  const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME)
  const response = NextResponse.next()

  if (!sessionCookie) {
    return response
  }

  const payload = (await decrypt(sessionCookie.value)) as
    | SessionPayloadType
    | undefined
  if (!payload) {
    return response
  }

  //Update session cookie every X minutes
  if (
    differenceInMinutes(new Date(), payload.updatedAt) >=
    SESSION_COOKIE_REFRESH_MINUTES
  ) {
    const newSessionCookie = await updateWebSessionFromDB(payload)
    if (!newSessionCookie) {
      return response
    }

    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: newSessionCookie,
    })
  }

  //Check for session expiry or suspended user
  if (
    payload.expiresAt < new Date() ||
    payload.status === UserStatusEnum.SUSPENDED
  ) {
    response.cookies.delete({
      name: SESSION_COOKIE_NAME,
    })
  }
  return response
}

export const config = {
  matcher: [
    // Proxy should run on
    "/dashboard",
    "/dashboard/:path",
    "/rider",
    "/rider/:path",
    // Proxy should NOT run on
    "/((?!api|_next/static|_next/image|.*\\.png$).*)",
  ],
}
