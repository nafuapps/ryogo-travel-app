import { H2, H2Brand, Small } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Video } from "lucide-react"

export default async function HeroSection() {
  const t = await getTranslations("Landing.Home.Hero")
  return (
    <section className="h-dvh p-3 md:p-4 lg:p-5">
      <div className="max-w-7xl relative w-full h-11/12 gap-6 md:gap-8 px-6 md:px-10 lg:px-40 pt-16 md:pt-24 lg:pt-32 flex flex-col items-center justify-start mx-auto text-center rounded-lg bg-linear-to-b from-sky-100 to-sky-500">
        <div className="flex flex-col items-center gap-1 lg:gap-2">
          <H2>{t("Title1")}</H2>
          <H2Brand>{t("Title2")}</H2Brand>
        </div>
        <Small>{t("Subtitle")}</Small>
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
          <Link href="/auth/signup">
            <Button size="lg" variant="brand" className="w-full md:w-auto">
              {t("PrimaryCTA")}
              <ChevronRight className="text-white size-5 lg:size-6" />
            </Button>
          </Link>
          {/* // TODO: Demo video */}
          <Link href="/features">
            <Button
              size="lg"
              variant="white"
              className="w-full gap-1 lg:gap-2 md:w-auto"
            >
              {t("SecondaryCTA")}
              <Video className="text-sky-700 size-6 lg:size-7" />
            </Button>
          </Link>
        </div>
        {/* // TODO: Add Hero Images */}
        <div className="absolute bg-white bottom-0 left-8 w-40 aspect-9/16 rounded-t-2xl overflow-hidden">
          {/* <Image
            className="object-cover"
            loading="eager"
            src="/signup.png"
            alt=""
            fill
            sizes=""
          /> */}
        </div>
        <div className="absolute bg-white bottom-0 right-8 w-40 aspect-9/16 rounded-t-2xl overflow-hidden">
          {/* <Image
            className="object-cover"
            loading="eager"
            src="/login.png"
            alt=""
            fill
            sizes=""
          /> */}
        </div>
      </div>
    </section>
  )
}
