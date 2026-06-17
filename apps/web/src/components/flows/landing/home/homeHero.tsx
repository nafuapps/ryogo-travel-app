import { RyogoH1, RyogoP, RyogoSmall } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { ChevronRight, Video } from "lucide-react"
import Image from "next/image"
import { RyogoIcon } from "@/components/icons/ryogoIcon"

export default async function HomeHeroSection() {
  const t = await getTranslations("Landing.Home.Hero")
  return (
    <section id="hero" className="h-lvh p-3 md:p-4 lg:p-5 items-center">
      <div className="max-w-6xl relative w-full h-full gap-6 md:gap-8 px-5 md:px-10 lg:px-16 py-24 md:py-32 flex flex-col items-center mx-auto text-center rounded-lg bg-linear-to-b from-sky-400 to-sky-50">
        <div className="flex flex-col items-center gap-1 lg:gap-2">
          <RyogoH1 weight="font-bold" color="dark">
            {t("Title1")}
          </RyogoH1>
          <RyogoH1 color="white" weight="font-bold">
            {t("Title2")}
          </RyogoH1>
        </div>
        <RyogoP color="brand" weight="font-medium" extraClassName="max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
          <Link href="/auth/signup">
            <Button size="lg" variant="brand" className="w-full md:w-auto">
              <RyogoSmall color="white" weight="font-medium">
                {t("PrimaryCTA")}
              </RyogoSmall>
              <RyogoIcon icon={ChevronRight} color="white" size="sm" thick />
            </Button>
          </Link>
          {/* // TODO: Demo video */}
          <Link href="/features">
            <Button
              size="lg"
              variant="white"
              className="w-full gap-1 lg:gap-2 md:w-auto"
            >
              <RyogoSmall color="brand" weight="font-medium">
                {t("SecondaryCTA")}
              </RyogoSmall>
              <RyogoIcon icon={Video} color="brand" size="sm" thick />
            </Button>
          </Link>
        </div>
        <div className="absolute bg-white bottom-0 left-8 lg:left-10 w-1/3 max-w-40 aspect-9/16 rounded-t-2xl overflow-hidden">
          <Image
            className="object-cover"
            loading="eager"
            src="/signupBG.png"
            alt=""
            fill
            sizes="160px"
          />
        </div>
        <div className="hidden lg:block absolute bg-white bottom-0 m-auto w-2/3 max-w-xl aspect-video rounded-t-2xl overflow-hidden">
          <Image
            className="object-cover"
            loading="eager"
            src="/forgotPasswordBG.png"
            alt=""
            fill
            sizes="576px"
          />
        </div>
        <div className="absolute bg-white bottom-0 right-8 lg:right-10 w-1/3 max-w-40 aspect-9/16 rounded-t-2xl overflow-hidden">
          <Image
            className="object-cover"
            loading="eager"
            src="/loginBG.png"
            alt=""
            fill
            sizes="160px"
          />
        </div>
      </div>
    </section>
  )
}
