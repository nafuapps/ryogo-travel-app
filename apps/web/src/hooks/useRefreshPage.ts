import { SEND_REFRESH_TIMEOUT_MINUTES } from "@/lib/uiConfig"
import { differenceInMinutes } from "date-fns"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export const useRefreshPage = (time: Date | null) => {
  const router = useRouter()

  const minutesSince = time ? differenceInMinutes(new Date(), time) : 999999
  const canSend = minutesSince > SEND_REFRESH_TIMEOUT_MINUTES

  const refreshMinutes = canSend
    ? SEND_REFRESH_TIMEOUT_MINUTES
    : SEND_REFRESH_TIMEOUT_MINUTES - minutesSince

  //Refresh page every X minutes to check if the send quote timer is up
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh()
    }, refreshMinutes * 60000)
    return () => clearInterval(interval) // Cleanup on unmount
  }, [router])

  return { canSend, refreshMinutes }
}
