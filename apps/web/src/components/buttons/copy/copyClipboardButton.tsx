"use client"

import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { CheckCheck, Copy } from "lucide-react"
import { useEffect, useState } from "react"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"

export default function CopyClipboardButton({ label }: { label?: string }) {
  const [isCopied, setIsCopied] = useState(false)

  //Ping for 1 second
  useEffect(() => {
    if (isCopied) {
      setTimeout(() => {
        setIsCopied(false)
      }, 1000)
    }
  }, [isCopied])

  function handleCopy() {
    setIsCopied(true)
    navigator.clipboard.writeText(label ?? window.location.href)
  }

  return (
    //Animate the copy button
    <RyogoOutlineButton onClick={() => handleCopy()}>
      <RyogoIcon
        icon={isCopied ? CheckCheck : Copy}
        size="sm"
        color={isCopied ? "green" : "slate"}
        className={` ${isCopied ? "animate-ping scale-75" : ""}`}
      />
    </RyogoOutlineButton>
  )
}
