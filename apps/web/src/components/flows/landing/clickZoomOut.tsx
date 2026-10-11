"use client"

import { useState } from "react"

export function ClickZoomOut({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const [clicked, setClicked] = useState(false)

  return (
    <div
      onClick={() => setClicked(true)}
      className={`${className ?? ""} ${clicked && "animate-zoom-out motion-reduce:animate-none"}`}
    >
      {children}
    </div>
  )
}
