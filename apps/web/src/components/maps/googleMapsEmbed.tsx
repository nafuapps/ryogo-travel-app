"use client"

import { getLang } from "@/lib/utils"
import { useLocale } from "next-intl"
import { RyogoPill } from "@/components/pills/ryogoPills"
import moment from "moment"

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!

export function GoogleMapsEmbedPlaceComponent({
  latLong,
  time,
  className,
}: {
  latLong: string
  time: Date | null
  className?: string
}) {
  const locale = useLocale()

  return (
    <div className={`flex relative ${className ?? ""}`}>
      <iframe
        src={`https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${latLong}&zoom=12&language=${getLang(locale)}`}
        className="w-full aspect-video relative rounded-md"
      />
      {time && (
        <RyogoPill
          label={moment(time).fromNow()}
          bgColor={"white"}
          className="top-2 lg:top-3 right-2 lg:right-3 absolute"
        />
      )}
    </div>
  )
}

export function GoogleMapsEmbedDirectionsComponent({
  source,
  destination,
  center,
  time,
}: {
  source: string
  destination: string
  center?: string | null
  time: Date | null
}) {
  const locale = useLocale()
  return (
    <div className="flex relative">
      <iframe
        src={`https://www.google.com/maps/embed/v1/directions?key=${API_KEY}&mode=driving&origin=${source}&destination=${destination}${center ? `&center=${center}` : ""}&zoom=6&language=${getLang(locale)}`}
        className="w-full aspect-video relative rounded-md"
      />
      {time && (
        <RyogoPill
          label={moment(time).fromNow()}
          bgColor={"white"}
          className="top-2 lg:top-3 right-2 lg:right-3 absolute"
        />
      )}
    </div>
  )
}
