import { H1, H1Light, P, SmallBrand, SmallLight } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import Image from "next/image"
import { ChevronRight, Video } from "lucide-react"

export default async function HomeHeroSection() {
  const t = await getTranslations("Landing.Home.Hero")
  return (
    <section className="h-lvh p-3 md:p-4 lg:p-5">
      <div className="max-w-7xl relative w-full h-full gap-6 md:gap-8 px-5 md:px-10 lg:px-30 pt-24 md:pt-32 lg:pt-40 flex flex-col items-center mx-auto text-center rounded-lg bg-linear-to-b from-sky-600 to-sky-200">
        <div className="flex flex-col items-center gap-1 lg:gap-2">
          <H1>{t("Title1")}</H1>
          <H1Light>{t("Title2")}</H1Light>
        </div>
        <P>{t("Subtitle")}</P>
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
          <Link href="/auth/signup">
            <Button size="lg" variant="brand" className="w-full md:w-auto">
              <SmallLight>{t("PrimaryCTA")}</SmallLight>
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
              <SmallBrand>{t("SecondaryCTA")}</SmallBrand>
              <Video className="text-sky-700 size-6 lg:size-7" />
            </Button>
          </Link>
        </div>
        {/* // TODO: Add Hero Images */}
        <div className="absolute bg-white bottom-0 left-8 w-1/3 max-w-40 aspect-9/16 rounded-t-2xl overflow-hidden">
          {/* <Image
            className="object-cover"
            loading="eager"
            src="/signup.png"
            alt=""
            fill
            sizes=""
          /> */}
        </div>
        <div className="absolute bg-white bottom-0 right-8 w-1/3 max-w-40 aspect-9/16 rounded-t-2xl overflow-hidden">
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
