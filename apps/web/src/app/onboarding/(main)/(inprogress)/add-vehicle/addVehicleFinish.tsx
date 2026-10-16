import { RyogoH4, RyogoSmall } from "@/components/typography"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import {
  FormContentWrapper,
  FormWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { Check } from "lucide-react"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import { useForm } from "react-hook-form"

export function AddVehicleFinish() {
  const t = useTranslations("Onboarding.AddVehiclePage.Finish")
  const form = useForm()

  return (
    <FormWrapper id="AddVehicleFinishForm" form={form} justifyCenter>
      <FormContentWrapper asCard={false}>
        <RyogoEnclosedIcon
          icon={Check}
          size="md"
          color="white"
          bgColor="black"
          circular
          className="animate-caret-blink"
        />
        <RyogoH4 className="text-center">{t("Title")}</RyogoH4>
        <RyogoSmall color="light" className="text-center">
          {t("Subtitle")}
        </RyogoSmall>
      </FormContentWrapper>
      <StickyActionWrapper bgTransparent>
        <RyogoSmall className="text-center">{t("Description1")}</RyogoSmall>
        <Link href="/onboarding/add-driver" className="w-full">
          <RyogoDefaultButton label={t("PrimaryCTA")} size={"lg"} />
        </Link>
      </StickyActionWrapper>
    </FormWrapper>
  )
}
