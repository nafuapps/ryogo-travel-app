import { SEND_REFRESH_TIMEOUT_MINUTES } from "@/lib/uiConfig"
import { differenceInMinutes } from "date-fns"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export const useRefreshPage = (
  time: Date | null,
  timeoutMinutes: number = SEND_REFRESH_TIMEOUT_MINUTES,
) => {
  const router = useRouter()

  const minutesSince = time ? differenceInMinutes(new Date(), time) : 999999
  const canSend = minutesSince > timeoutMinutes

  const refreshMinutes = canSend
    ? timeoutMinutes
    : timeoutMinutes - minutesSince

  //Refresh page every X minutes to check if the send quote timer is up
  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh()
    }, refreshMinutes * 60000)
    return () => clearInterval(interval) // Cleanup on unmount
  }, [router])

  return { canSend, refreshMinutes }
}
