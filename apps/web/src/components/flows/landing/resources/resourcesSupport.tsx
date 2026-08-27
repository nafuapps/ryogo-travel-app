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
import { SUPPORT_EMAIL, SUPPORT_HELPLINE_NUMBER } from "@/lib/uiConfig"
import {
  RyogoOutlineButton,
  RyogoWhiteButton,
} from "@/components/buttons/ryogoButtons"

export default async function ResourcesSupportSection() {
  const t = await getTranslations("Landing.Resources.Support")
  return (
    <LandingSectionWrapper
      id="support"
      className="bg-slate-50 dark:bg-slate-900"
    >
      <LandingContentWrapper>
        <RyogoH1 weight="font-bold" className="text-center">
          {t("Title")}
        </RyogoH1>
        <RyogoP color="light" className="max-w-4xl text-center">
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
    <div className="flex flex-col gap-5 md:gap-6 w-full bg-linear-to-b from-slate-950 dark:from-white to-slate-700 dark:to-slate-300 p-6 lg:p-8 rounded-lg">
      <RyogoH4 color="white" weight="font-bold">
        {t("Title")}
      </RyogoH4>
      <RyogoCaption color="white">{t("Description")}</RyogoCaption>
      <HelpItem label={t("Help1")} />
      <HelpItem label={t("Help2")} />
      <HelpItem label={t("Help3")} />
      <HelpItem label={t("Help4")} />
      <Link href={`tel:${SUPPORT_HELPLINE_NUMBER}`} className=" mt-auto">
        <RyogoWhiteButton size="lg" label={t("CallCTA")} className="w-full">
          <RyogoIcon icon={Phone} size="sm" color="slate" thick />
        </RyogoWhiteButton>
      </Link>
      <Link href={`mailto:${SUPPORT_EMAIL}`} className="w-full">
        <RyogoOutlineButton
          size="lg"
          label={t("EmailCTA")}
          labelColor="white"
          className="w-full"
        >
          <RyogoIcon icon={Mail} size="sm" color="white" thick />
        </RyogoOutlineButton>
      </Link>
      <RyogoCaption color="light" className="text-center">
        {t("Disclaimer")}
      </RyogoCaption>
    </div>
  )
}

function HelpItem({ label }: { label: string }) {
  return (
    <div className="flex gap-2 md:gap-2.5 items-center">
      <RyogoIcon icon={CheckCircle} size="sm" color="white" thick />
      <RyogoSmall color="white">{label}</RyogoSmall>
    </div>
  )
}
