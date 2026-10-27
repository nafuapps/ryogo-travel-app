import { RyogoDefaultButton } from "@/components/buttons/ryogoButtons"
import { RyogoEnclosedIcon } from "@/components/icons/ryogoIcon"
import {
  FormContentWrapper,
  FormWrapper,
  StickyActionWrapper,
} from "@/components/page/pageWrappers"
import { RyogoH4, RyogoSmall } from "@/components/typography"
import { Check } from "lucide-react"
import { useTranslations } from "next-intl"
import Link from "next/link"
import { useForm } from "react-hook-form"

export function AddVehicleFinish() {
  const t = useTranslations("Onboarding.AddVehiclePage.Finish")
  const form = useForm()

  return (
    <FormWrapper id="AddVehicleFinishForm" form={form} justifyCenter>
      <FormContentWrapper
        asCard={false}
        className="grow justify-center items-center"
      >
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
          <RyogoDefaultButton
            label={t("PrimaryCTA")}
            size={"lg"}
            className="w-full"
          />
        </Link>
      </StickyActionWrapper>
    </FormWrapper>
  )
}
