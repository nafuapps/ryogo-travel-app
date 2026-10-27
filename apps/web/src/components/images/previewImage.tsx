"use client"

import { RyogoImage } from "@/components/images/ryogoImage"
import { useEffect } from "react"

export default function PreviewImage({ file }: { file: File }) {
  const url = URL.createObjectURL(file)

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(url)
    }
  }, [url])

  return <RyogoImage src={url} alt={file.name} imageSize="sm" />
}
