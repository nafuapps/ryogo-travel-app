import { RyogoH1, RyogoP, RyogoSmall } from "@/components/typography"
import { Button } from "@/components/ui/button"
import { getTranslations } from "next-intl/server"
import Link from "next/link"
import { ChevronRight, Video } from "lucide-react"
import Image from "next/image"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import { RyogoDialogVideo } from "@/components/video/ryogoVideo"

export default async function HomeHeroSection() {
  const t = await getTranslations("Landing.Home.Hero")
  return (
    <LandingSectionWrapper id="hero" hero>
      <LandingContentWrapper
        justifyStart
        className="h-full px-5 sm:px-8 md:px-10 pt-24 md:pt-32 rounded-lg bg-linear-to-b from-sky-400 to-sky-50"
      >
        <div className="flex flex-col items-center gap-1 lg:gap-2">
          <RyogoH1 weight="font-bold" color="dark" className="text-center">
            {t("Title1")}
          </RyogoH1>
          <RyogoH1 color="white" weight="font-bold" className="text-center">
            {t("Title2")}
          </RyogoH1>
        </div>
        <RyogoP
          color="brand"
          weight="font-medium"
          className="max-w-4xl text-center"
        >
          {t("Subtitle")}
        </RyogoP>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <Link href="/auth/signup">
            <Button size="lg" variant="brand" className="w-full md:w-auto">
              <RyogoSmall color="white" weight="font-medium">
                {t("PrimaryCTA")}
              </RyogoSmall>
              <RyogoIcon icon={ChevronRight} color="white" size="sm" thick />
            </Button>
          </Link>
          {/* // TODO: Demo video source */}
          <RyogoDialogVideo
            src="https://www.youtube.com/embed/1MobY_vR7-g"
            title="RyoGo Demo video"
            className="w-full aspect-video"
          >
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
          </RyogoDialogVideo>
        </div>
        <div className="flex items-end mt-auto gap-8 justify-center w-full">
          <div className="bg-white w-full max-w-44 hidden lg:block relative aspect-9/16 rounded-t-2xl overflow-hidden">
            <Image
              className="object-cover"
              loading="eager"
              src="/signupBG.png"
              alt=""
              fill
              sizes="176px"
            />
          </div>
          <div className="bg-white max-w-md sm:max-w-2xl relative w-full aspect-square sm:aspect-video rounded-t-2xl overflow-hidden">
            <Image
              className="object-cover"
              loading="eager"
              src="/forgotPasswordBG.png"
              alt=""
              fill
              sizes="(max-width: 640px) 448px,672px"
            />
          </div>
          <div className="bg-white w-full max-w-44 hidden lg:block relative aspect-9/16 rounded-t-2xl overflow-hidden">
            <Image
              className="object-cover"
              loading="eager"
              src="/loginBG.png"
              alt=""
              fill
              sizes="176px"
            />
          </div>
        </div>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
