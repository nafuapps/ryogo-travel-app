"use client"

import { useEffect, useState } from "react"
import { RyogoWhiteButton } from "@/components/buttons/ryogoButtons"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { Download } from "lucide-react"
import { toast } from "sonner"

type InstallPromptEvent = Event & {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>
}

export default function InstallPWAButton({ label }: { label: string }) {
  const [installPrompt, setInstallPrompt] = useState<InstallPromptEvent | null>(
    null,
  )

  useEffect(() => {
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault()
      setInstallPrompt(event as InstallPromptEvent)
    }

    const handleAppInstalled = () => {
      setInstallPrompt(null)
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt)
    window.addEventListener("appinstalled", handleAppInstalled)

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      )
      window.removeEventListener("appinstalled", handleAppInstalled)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!installPrompt) {
      const userAgent = navigator.userAgent
      const isFirefox = /Firefox|FxiOS/i.test(userAgent)
      const isAndroid = /Android/i.test(userAgent)
      const isIOS = /iPhone|iPad|iPod/i.test(userAgent)

      if (isFirefox && isAndroid) {
        toast.info("Open the Firefox menu and tap Install.")
      } else if (isFirefox && isIOS) {
        toast.info("Open the Share menu and choose Add to Home Screen.")
      } else if (isFirefox) {
        toast.info(
          "Firefox on desktop does not support installing PWAs. Open this site in Chrome or Edge to install it.",
        )
      } else {
        toast.info(
          "The install prompt is unavailable. Check your browser menu for an Install or Add to Home Screen option.",
        )
      }
      return
    }

    setInstallPrompt(null)

    try {
      await installPrompt.prompt()
      await installPrompt.userChoice
    } catch (error) {
      console.error("Unable to show the PWA install prompt.", error)
    }
  }

  if (!installPrompt) return null

  return (
    <RyogoWhiteButton size="lg" label={label} onClick={handleInstallClick}>
      <RyogoIcon icon={Download} size="xs" color="slate" thick />
    </RyogoWhiteButton>
  )
}
