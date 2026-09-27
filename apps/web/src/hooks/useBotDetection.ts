import { useEffect, useState } from "react"

//To check if the form was submitted within 2s
const CHECK_BOT_MILLISECONDS = 2000

export const useBotDetection = () => {
  const [isBot, setIsBot] = useState(false)

  const startTime = new Date().getTime()

  //Reset bot to false after 3 seconds
  useEffect(() => {
    if (!isBot) return

    const timer = window.setTimeout(() => {
      setIsBot(false)
    }, 3000)

    return () => window.clearTimeout(timer)
  }, [isBot])

  //Function to check for bot activity based on form submit time
  function checkBotActivity() {
    const submitTime = new Date().getTime()
    if (submitTime - startTime < CHECK_BOT_MILLISECONDS) {
      setIsBot(true)
      return true
    }
    return false
  }

  return { checkBotActivity, isBot }
}
