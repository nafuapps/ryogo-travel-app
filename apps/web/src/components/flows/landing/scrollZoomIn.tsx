"use client"

import { useEffect, useRef, useState } from "react"

export function ScrollZoomIn({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const elementRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      { threshold: 0, rootMargin: "-10% 0px -10% 0px" },
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={elementRef}
      className={`${className ?? ""} ${isVisible ? "animate-zoom-in motion-reduce:animate-none" : "opacity-0"}`}
    >
      {children}
    </div>
  )
}
