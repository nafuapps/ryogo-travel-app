"use client"
import { YouTubeEmbed } from "@next/third-parties/google"

export function YTVideo({ id }: { id: string }) {
  return (
    <YouTubeEmbed videoid={id} height={400} width={600} params="controls=0" />
  )
}
