import RyogoHeader from "./ryogoHeader"
import { getTranslations } from "next-intl/server"

export default async function TrackHeader({ pathName }: { pathName: string }) {
  const t = await getTranslations("Track.Header")

  const titleKey = ("Title." + pathName || "Title./track") as Parameters<
    typeof t
  >[0]
  const title = t(titleKey)

  return <RyogoHeader title={title} withoutSidebar />
}
