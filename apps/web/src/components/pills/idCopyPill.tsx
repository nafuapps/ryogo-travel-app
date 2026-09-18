"use client"

import { useEffect, useState } from "react"
import { RyogoCaption } from "@/components/typography"
import { CheckCheck, Copy } from "lucide-react"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { useTranslations } from "next-intl"

export default function IdCopyPill({ id }: { id: string }) {
  const t = useTranslations("IdCopyPill")
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
    navigator.clipboard.writeText(id)
  }

  return (
    <div
      onClick={() => handleCopy()}
      className={`${isCopied ? "animate-ping scale-50" : ""} border shadow-sm rounded-full shrink-0 gap-1.5 lg:gap-2 px-3 py-1.5 lg:px-4 lg:py-2 w-28 lg:w-32 flex items-center justify-center cursor-pointer bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800`}
    >
      <RyogoCaption color={isCopied ? "light" : "light"}>
        {isCopied ? t("Copied") : id}
      </RyogoCaption>
      <RyogoIcon
        icon={isCopied ? CheckCheck : Copy}
        size="xs"
        color={isCopied ? "green" : "light"}
        //Animate the copy button
      />
    </div>
  )
}
