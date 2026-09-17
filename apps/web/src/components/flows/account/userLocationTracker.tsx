"use client"

import { locateUserAction } from "@/app/actions/users/locateUserAction"
import { useLocation } from "@/hooks/useLocation"
import { LOCATE_USER_MINUTES } from "@ryogo-travel-app/api/apiConfig"
import { differenceInMinutes } from "date-fns"
import { useEffect } from "react"

export default function UserLocationTracker({
  userId,
  agencyId,
  locatedAt,
}: {
  userId: string
  agencyId: string
  locatedAt: Date | null
}) {
  const location = useLocation()

  useEffect(() => {
    async function updateLocation() {
      if (
        location.latitude &&
        location.longitude &&
        (!locatedAt ||
          differenceInMinutes(new Date(), locatedAt) > LOCATE_USER_MINUTES)
      ) {
        await locateUserAction(
          userId,
          agencyId,
          location.latitude,
          location.longitude,
        )
      }
    }
    updateLocation()
  }, [location])

  return null
}
