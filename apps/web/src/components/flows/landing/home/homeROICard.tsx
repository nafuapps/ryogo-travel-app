import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { RyogoH1, RyogoP } from "@/components/typography"
import { VERCEL_BLOB_STORAGE_URL } from "@ryogo-travel-app/api/apiConfig"
import { ChevronRight } from "lucide-react"
import { getTranslations } from "next-intl/server"
import Image from "next/image"
import Link from "next/link"

export default async function HomeROICard() {
  const t = await getTranslations("Landing.Home.ROICard")
  return (
    <LandingSectionWrapper id="roiCard" shrink>
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="light" className="text-center max-w-4xl">
          {t("Subtitle")}
        </RyogoP>
        <div className="w-full max-w-3xl aspect-4/3 rounded-xl overflow-hidden relative">
          <Image
            className="object-cover rounded-md md:transition-transform md:duration-300 md:hover:scale-103"
            loading="eager"
            src={VERCEL_BLOB_STORAGE_URL + "/home/roi.png"}
            alt={t("Title")}
            fill
            sizes="768px"
          />
        </div>
        <Link href="/pricing#roi" prefetch={false}>
          <RyogoDefaultButton
            size="lg"
            label={t("PrimaryCTA")}
            className="w-full md:w-auto"
          >
            <RyogoIcon icon={ChevronRight} size="sm" color="white" thick />
          </RyogoDefaultButton>
        </Link>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}
