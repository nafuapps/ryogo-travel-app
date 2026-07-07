import { RyogoP, RyogoH1, RyogoSmall, RyogoH4 } from "@/components/typography"
import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import Image from "next/image"
import RyoGoLogo from "@/components/logo"

export default async function ResourcesAboutSection() {
  const t = await getTranslations("Landing.Resources.About")
  return (
    <LandingSectionWrapper id="about" className="bg-slate-50">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="light" className="max-w-4xl text-center">
          {t("Subtitle")}
        </RyogoP>
        <div className="bg-white relative shadow w-full max-w-4xl rounded-lg p-6 md:p-8 my-3 md:my-4 flex flex-col items-center gap-4 md:gap-6 overflow-hidden">
          <div className="bg-linear-to-b from-sky-900 to-sky-700 rounded-full size-20 md:size-28 lg:size-32 absolute -left-10 -top-10 md:-left-14 md:-top-14 lg:-left-16 lg:-top-16"></div>
          <div className="bg-linear-to-b from-sky-900 to-sky-700 rounded-full size-20 md:size-28 lg:size-32 absolute -right-10 -top-10 md:-right-14 md:-top-14 lg:-right-16 lg:-top-16"></div>
          <div className="bg-linear-to-b from-sky-700 to-sky-500 rounded-full size-20 md:size-28 lg:size-32 absolute -left-10 -bottom-10 md:-left-14 md:-bottom-14 lg:-left-16 lg:-bottom-16"></div>
          <div className="bg-linear-to-b from-sky-700 to-sky-500 rounded-full size-20 md:size-28 lg:size-32 absolute -right-10 -bottom-10 md:-right-14 md:-bottom-14 lg:-right-16 lg:-bottom-16"></div>
          <RyogoH4 weight="font-bold">{t("Mission.Title")}</RyogoH4>
          <RyogoP color="brand" className="text-center">
            {t("Mission.Desc")}
          </RyogoP>
          <div className="w-full grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
            <MissionSuccess
              value={t("Mission.M1.Value")}
              label={t("Mission.M1.Label")}
            />
            <MissionSuccess
              value={t("Mission.M2.Value")}
              label={t("Mission.M2.Label")}
            />
            <MissionSuccess
              value={t("Mission.M3.Value")}
              label={t("Mission.M3.Label")}
            />
          </div>
          <RyoGoLogo />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 my-3 md:my-4 gap-8 lg:gap-10">
          <div className="flex flex-col gap-5 md:gap-6 justify-center items-center md:items-end">
            <RyogoH4 weight="font-bold">{t("Founder.Title")}</RyogoH4>
            <RyogoSmall color="slate" className="text-center md:text-end">
              {t("Founder.Description")}
            </RyogoSmall>
            <div className="flex justify-center gap-2.5 md:gap-3 lg:gap-4">
              <CompanyLogo
                name={t("Founder.Company1")}
                src={"/ola.png"}
                alt={t("Founder.Company1")}
              />
              <CompanyLogo
                name={t("Founder.Company2")}
                src={"/pharmeasy.jpg"}
                alt={t("Founder.Company2")}
              />
              <CompanyLogo
                name={t("Founder.Company3")}
                src={"/parkplus.jpg"}
                alt={t("Founder.Company3")}
              />
            </div>
          </div>
          <div className="mx-auto w-full max-w-md relative rounded-xl aspect-square overflow-hidden">
            {/* //TODO: Add founder image */}
            <Image
              src={"/logoPWA.png"}
              className="object-cover md:transition-transform md:duration-300 md:group-hover:scale-105"
              alt={"Founder"}
              fill
              sizes="448px"
            />
          </div>
        </div>
        <div className="flex flex-col gap-2 lg:gap-3 p-4 md:p-6 my-3 md:my-4  bg-linear-to-b from-slate-950 to-slate-700 shadow w-full max-w-4xl rounded-lg">
          <RyogoH4 color="white" className="text-center">
            {t("Mission.Subtitle")}
          </RyogoH4>
          <RyogoSmall weight="font-bold" color="light" className="text-center">
            {t("Mission.Quote")}
          </RyogoSmall>
        </div>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}

function MissionSuccess({ value, label }: { value: string; label: string }) {
  return (
    <div className="w-full flex flex-col gap-2 md:gap-3 items-center border rounded-lg p-4 md:p-5 lg:p-6">
      <RyogoH1 weight="font-bold">{value}</RyogoH1>
      <RyogoSmall color="slate" className="text-center">
        {label}
      </RyogoSmall>
    </div>
  )
}

function CompanyLogo({
  name,
  src,
  alt,
}: {
  name: string
  src: string
  alt: string
}) {
  return (
    <div className="flex items-center justify-center gap-1 md:gap-2">
      <div className="size-8 md:size-9 lg:size-10 shrink-0 relative rounded overflow-hidden">
        <Image src={src} alt={alt} fill className="object-cover" sizes="64px" />
      </div>
      <RyogoSmall weight="font-bold" color="light">
        {name}
      </RyogoSmall>
    </div>
  )
}
