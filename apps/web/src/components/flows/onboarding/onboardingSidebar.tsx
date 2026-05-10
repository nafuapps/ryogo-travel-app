import { RyogoH3, RyogoH4, RyogoP, RyogoCaption } from "@/components/typography"
import { Sidebar, useSidebar } from "@/components/ui/sidebar"
import { Check } from "lucide-react"
import { useTranslations } from "next-intl"
import RyoGoLogo from "@/components/logo"
import {
  AddAgentTotalSteps,
  AddDriverTotalSteps,
  AddVehicleTotalSteps,
  CreateAccountTotalSteps,
  VerifyAccountTotalSteps,
} from "./onboardingSteps"
import { RyogoIcon } from "@/components/icons/ryogoIcon"

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
        <RyogoH3 color="slate">{t("Heading")}</RyogoH3>
        <div
          id="OnboardingSidebarSteps"
          className="flex flex-col gap-2 lg:gap-3"
        >
          {items.map((item, index) => (
            <div key={index} className="flex flex-row gap-2 md:gap-3">
              <div className={`flex flex-col gap-2 md:gap-3 items-center`}>
                <div
                  className={`rounded-full
          ${
            currentProcess > index || (currentProcess === index && isLastStep)
              ? "bg-sky-950 shadow"
              : currentProcess === index
                ? "bg-white border border-sky-700 shadow"
                : "bg-slate-100"
          } flex shrink-0 justify-center items-center size-8 lg:size-10`}
                >
                  {currentProcess > index ||
                  (currentProcess === index && isLastStep) ? (
                    <RyogoIcon icon={Check} size="sm" />
                  ) : currentProcess === index ? (
                    <RyogoH4 color="brand">{index + 1}</RyogoH4>
                  ) : (
                    <RyogoH4 color="light">{index + 1}</RyogoH4>
                  )}
                </div>
                {index < items.length - 1 && (
                  <div
                    className={`w-0.5 h-10 ${currentProcess > index ? "bg-sky-700" : "bg-slate-200"} rounded-full`}
                  ></div>
                )}
              </div>
              <div className="flex flex-col">
                {currentProcess > index ? (
                  <RyogoP>{item.title}</RyogoP>
                ) : currentProcess === index ? (
                  <RyogoP color="brand">{item.title}</RyogoP>
                ) : (
                  <RyogoP color="slate">{item.title}</RyogoP>
                )}
                {currentProcess >= index ? (
                  <RyogoCaption color="slate">{item.description}</RyogoCaption>
                ) : (
                  <RyogoCaption color="light">{item.description}</RyogoCaption>
                )}
                {currentProcess >= index ? (
                  <RyogoCaption color="slate">{item.steps}</RyogoCaption>
                ) : (
                  <RyogoCaption color="light">{item.steps}</RyogoCaption>
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
