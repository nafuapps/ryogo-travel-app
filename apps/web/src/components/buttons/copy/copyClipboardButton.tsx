"use client"

import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { Button } from "@/components/ui/button"
import { CheckCheck, Copy } from "lucide-react"
import { useEffect, useState } from "react"

export default function CopyClipboardButton({ label }: { label?: string }) {
  const [isCopied, setIsCopied] = useState(false)

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
    <Button variant="outline" onClick={() => handleCopy()} size="icon">
      <div className={` ${isCopied ? "animate-ping scale-75" : ""}`}>
        <RyogoIcon
          icon={isCopied ? CheckCheck : Copy}
          size="sm"
          color={isCopied ? "green" : "slate"}
        />
      </div>
    </Button>
  )
}
