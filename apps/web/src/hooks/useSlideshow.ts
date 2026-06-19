import { SLIDESHOW_TIMER_MS } from "@/lib/uiConfig"
import { useEffect, useState } from "react"

export function useSlideshow(length: number) {
  const [activeIndex, setActiveIndex] = useState(0)

  const [timeLeft, setTimeLeft] = useState(SLIDESHOW_TIMER_MS)

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setTimeLeft(SLIDESHOW_TIMER_MS)
    }, 0)
    return () => clearTimeout(timeoutId)
  }, [activeIndex])

  useEffect(() => {
    if (timeLeft <= 0) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveIndex((prev) => (prev + 1) % length)
      return
    }

    // Setup interval to tick down every 50ms
    const timerId = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 50)
    }, 50)

    // Clear interval on component unmount or re-render
    return () => clearInterval(timerId)
  }, [timeLeft, length])

  return { activeIndex, timeLeft, setActiveIndex }
}
