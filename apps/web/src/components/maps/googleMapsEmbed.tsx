import { getLang } from "@/lib/utils"
import { getLocale } from "next-intl/server"
import { RyogoPill } from "@/components/pills/ryogoPills"
import moment from "moment"
import { SectionColWrapper } from "../page/pageWrappers"

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!

export async function GoogleMapsEmbedPlaceComponent({
  latLong,
  time,
  zoom,
}: {
  latLong: string
  time: Date | null
  zoom?: string
}) {
  const locale = await getLocale()

  return (
    <SectionColWrapper className="relative items-center">
      <iframe
        src={`https://www.google.com/maps/embed/v1/place?key=${API_KEY}&q=${latLong}&zoom=${zoom ?? "12"}&language=${getLang(locale)}`}
        className="w-full aspect-video relative rounded-md"
      ></iframe>
      {time && (
        <RyogoPill
          label={moment(time).fromNow()}
          bgColor={"white"}
          className="top-2 lg:top-3 right-2 lg:right-3 z-10 absolute"
        />
      )}
    </SectionColWrapper>
  )
}

export async function GoogleMapsEmbedDirectionsComponent({
  source,
  destination,
  zoom,
}: {
  source: string
  destination: string
  zoom?: string
}) {
  const locale = await getLocale()
  return (
    <iframe
      src={`https://www.google.com/maps/embed/v1/directions?key=${API_KEY}&origin=${source}&destination=${destination}&zoom=${zoom ?? "10"}&language=${getLang(locale)}`}
    />
  )
}
