import { useEffect, useState } from "react"

export const useBotDetection = (checkTimeInMs: number = 1000) => {
  const [isBot, setIsBot] = useState(false)

  const startTime = new Date().getTime()

  //Reset bot to false after 10 seconds
  useEffect(() => {
    if (!isBot) return

    const timer = window.setTimeout(() => {
      setIsBot(false)
    }, 10000)

    return () => window.clearTimeout(timer)
  }, [isBot])

  //Function to check for bot activity based on form submit time
  function checkBotActivity() {
    //Check if the form was submitted too quickly
    const submitTime = new Date().getTime()
    if (submitTime - startTime < checkTimeInMs) {
      setIsBot(true)
      return true
    }
    return false
  }

  return { checkBotActivity, isBot }
}
