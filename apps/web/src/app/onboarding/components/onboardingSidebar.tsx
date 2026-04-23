import {
  Caption,
  CaptionGrey,
  H3Grey,
  H5Brand,
  H5Grey,
  P,
  PBrand,
  PGrey,
} from "@/components/typography"
import { Sidebar, useSidebar } from "@/components/ui/sidebar"
import { LucideCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import RyoGoLogo from "@/components/logo"
import {
  AddAgentTotalSteps,
  AddDriverTotalSteps,
  AddVehicleTotalSteps,
  CreateAccountTotalSteps,
  VerifyAccountTotalSteps,
} from "./onboardingSteps"

export default function OnboardingSidebar({
  currentProcess,
  isLastStep,
}: {
  currentProcess: number
  isLastStep: boolean
}) {
  const t = useTranslations("Onboarding.Sidebar")
  const { isMobile } = useSidebar()

  const items = [
    {
      title: t("Step1.Title"),
      description: t("Step1.Description"),
      steps: t("NumberSteps", { number: CreateAccountTotalSteps }),
    },
    {
      title: t("Step2.Title"),
      description: t("Step2.Description"),
      steps: t("NumberSteps", { number: VerifyAccountTotalSteps }),
    },
    {
      title: t("Step3.Title"),
      description: t("Step3.Description"),
      steps: t("NumberSteps", { number: AddVehicleTotalSteps }),
    },
    {
      title: t("Step4.Title"),
      description: t("Step4.Description"),
      steps: t("NumberSteps", { number: AddDriverTotalSteps }),
    },
    {
      title: t("Step5.Title"),
      description: t("Step5.Description"),
      steps: t("NumberSteps", { number: AddAgentTotalSteps }),
    },
  ]
  return (
    <Sidebar side="right" collapsible={isMobile ? "offcanvas" : "none"}>
      <div
        id="OnboardingSidebarSection"
        className="w-full flex px-8 py-10 md:px-10 md:py-12 h-full flex-col gap-8 lg:gap-10 bg-slate-50"
      >
        <H3Grey>{t("Heading")}</H3Grey>
        <div
          id="OnboardingSidebarSteps"
          className="flex flex-col items-start gap-2 lg:gap-3"
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-row gap-2 md:gap-3 items-start"
            >
              <div className={`flex flex-col gap-2 md:gap-3 items-center`}>
                <div
                  className={`rounded-full
          ${
            currentProcess > index || (currentProcess === index && isLastStep)
              ? "bg-sky-950 shadow"
              : currentProcess === index
                ? "bg-white border-2 border-sky-700 shadow"
                : "bg-slate-100"
          } flex shrink-0 justify-center items-center size-8 lg:size-10`}
                >
                  {currentProcess > index ||
                  (currentProcess === index && isLastStep) ? (
                    <LucideCheck className="size-4 lg:size-5 text-sky-50" />
                  ) : currentProcess === index ? (
                    <H5Brand>{index + 1}</H5Brand>
                  ) : (
                    <H5Grey>{index + 1}</H5Grey>
                  )}
                </div>
                {index < items.length - 1 && (
                  <div
                    className={`w-0.5 h-10 ${currentProcess > index ? "bg-sky-700" : "bg-slate-200"} rounded-full`}
                  ></div>
                )}
              </div>
              <div className="flex flex-col items-start">
                {currentProcess > index ? (
                  <P>{item.title}</P>
                ) : currentProcess === index ? (
                  <PBrand>{item.title}</PBrand>
                ) : (
                  <PGrey>{item.title}</PGrey>
                )}
                {currentProcess >= index ? (
                  <Caption>{item.description}</Caption>
                ) : (
                  <CaptionGrey>{item.description}</CaptionGrey>
                )}
                {currentProcess >= index ? (
                  <Caption>{item.steps}</Caption>
                ) : (
                  <CaptionGrey>{item.steps}</CaptionGrey>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-auto flex">
          <RyoGoLogo />
        </div>
      </div>
    </Sidebar>
  )
}
