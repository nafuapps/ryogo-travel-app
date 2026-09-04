"use client"

import {
  RyogoH4,
  RyogoP,
  RyogoCaption,
  RyogoSmall,
} from "@/components/typography"
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
import { logoutAction } from "@/app/actions/users/logoutAction"
import { useTransition } from "react"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"

export default function OnboardingSidebar({
  currentProcess,
  isLastStep,
  showLogout,
}: {
  currentProcess?: number
  isLastStep?: boolean
  showLogout?: boolean
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
  const [isPending, startTransition] = useTransition()

  async function logoutUser() {
    startTransition(async () => {
      await logoutAction()
    })
  }
  return (
    <Sidebar side="right" collapsible={isMobile ? "offcanvas" : "none"}>
      <div
        id="OnboardingSidebarSection"
        className="w-full flex px-8 py-10 md:px-10 md:py-12 h-full flex-col gap-8 lg:gap-10 bg-slate-50  dark:bg-slate-950"
      >
        <RyogoH4 weight="font-bold" color="light">
          {t("Heading")}
        </RyogoH4>
        {currentProcess !== undefined && (
          <div
            id="OnboardingSidebarSteps"
            className="flex flex-col gap-2 lg:gap-3"
          >
            {items.map((item, index) => (
              <div key={index} className="flex flex-row gap-2 md:gap-3">
                <div className={`flex flex-col gap-2 md:gap-3 items-center`}>
                  <div
                    className={`rounded-lg
          ${
            currentProcess > index || (currentProcess === index && isLastStep)
              ? "bg-slate-950 dark:bg-white shadow"
              : currentProcess === index
                ? "bg-white  dark:bg-slate-950 border border-sky-700 dark:border-sky-300 shadow"
                : "bg-slate-300  dark:bg-slate-700"
          } flex shrink-0 justify-center items-center size-9 lg:size-10`}
                  >
                    {currentProcess > index ||
                    (currentProcess === index && isLastStep) ? (
                      <RyogoIcon icon={Check} size="sm" color="white" />
                    ) : (
                      <RyogoP
                        weight="font-bold"
                        color={currentProcess === index ? "brand" : "light"}
                      >
                        {index + 1}
                      </RyogoP>
                    )}
                  </div>
                  {index < items.length - 1 && (
                    <div
                      className={`w-0.5 h-14 lg:h-12 ${currentProcess > index ? "bg-sky-700 dark:bg-sky-300" : "bg-slate-300  dark:bg-slate-700"} rounded-full`}
                    ></div>
                  )}
                </div>
                <div className="flex flex-col gap-1 lg:gap-1.5">
                  <RyogoP
                    weight={"font-bold"}
                    color={
                      currentProcess > index
                        ? "dark"
                        : currentProcess === index
                          ? "brand"
                          : "light"
                    }
                  >
                    {item.title}
                  </RyogoP>
                  <RyogoSmall
                    color={currentProcess >= index ? "slate" : "light"}
                  >
                    {item.description}
                  </RyogoSmall>
                  <RyogoCaption color={"light"} weight="font-bold">
                    {item.steps}
                  </RyogoCaption>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-auto flex flex-col gap-3 md:gap-4">
          {showLogout && (
            <RyogoOutlineButton
              onClick={logoutUser}
              label={t("Logout")}
              labelColor="light"
              disabled={isPending}
              className="md:self-start"
            ></RyogoOutlineButton>
          )}
          <RyoGoLogo />
        </div>
      </div>
    </Sidebar>
  )
}
