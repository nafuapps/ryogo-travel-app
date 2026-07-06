import {
  RyogoP,
  RyogoH1,
  RyogoSmall,
  RyogoH4,
  RyogoCaption,
} from "@/components/typography"
import { getTranslations } from "next-intl/server"
import {
  LandingContentWrapper,
  LandingSectionWrapper,
} from "@/components/flows/landing/landingWrappers"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { CheckCircle, Mail, Phone } from "lucide-react"
import QueryForm from "./queryForm"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SUPPORT_EMAIL, SUPPORT_HELPLINE_NUMBER } from "@/lib/uiConfig"

export default async function ResourcesSupportSection() {
  const t = await getTranslations("Landing.Resources.Support")
  return (
    <LandingSectionWrapper id="support" className="bg-slate-50">
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="slate" className="max-w-4xl text-center">
          {t("Subtitle")}
        </RyogoP>
        <div className="flex flex-col md:flex-row gap-6 md:gap-8 w-full">
          <HelpBlock />
          <QueryForm />
        </div>
      </LandingContentWrapper>
    </LandingSectionWrapper>
  )
}

async function HelpBlock() {
  const t = await getTranslations("Landing.Resources.Support.HelpBlock")
  return (
    <div className="flex flex-col gap-5 md:gap-6 w-full bg-linear-to-b from-slate-950 to-slate-700 p-6 lg:p-8 rounded-lg">
      <RyogoH4 color="white" weight="font-bold">
        {t("Title")}
      </RyogoH4>
      <RyogoCaption color="light">{t("Description")}</RyogoCaption>
      <HelpItem label={t("Help1")} />
      <HelpItem label={t("Help2")} />
      <HelpItem label={t("Help3")} />
      <HelpItem label={t("Help4")} />
      <Link href={`tel:${SUPPORT_HELPLINE_NUMBER}`} className="w-full">
        <Button size="lg" variant="white" className="w-full">
          <RyogoIcon icon={Phone} size="sm" color="slate" thick />
          <RyogoSmall color="slate">{t("CallCTA")}</RyogoSmall>
        </Button>
      </Link>
      <Link href={`mailto:${SUPPORT_EMAIL}`} className="w-full">
        <Button size="lg" variant="outline" className="w-full">
          <RyogoIcon icon={Mail} size="sm" color="white" thick />
          <RyogoSmall color="white">{t("EmailCTA")}</RyogoSmall>
        </Button>
      </Link>
      <RyogoCaption color="light">{t("Disclaimer")}</RyogoCaption>
    </div>
  )
}

function HelpItem({ label }: { label: string }) {
  return (
    <div className="flex gap-1 md:gap-1.5 items-center">
      <RyogoIcon icon={CheckCircle} size="sm" color="white" thick />
      <RyogoSmall color="white">{label}</RyogoSmall>
    </div>
  )
}
