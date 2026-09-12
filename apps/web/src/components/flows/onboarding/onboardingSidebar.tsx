"use client"

import {
  RyogoH4,
  RyogoP,
  RyogoSmall,
  RyogoCaption,
  RyogoTiny,
} from "@/components/typography"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar"
import { Check } from "lucide-react"
import { useTranslations } from "next-intl"
import RyoGoLogo from "@/components/logo"
import { RyogoIcon } from "@/components/icons/ryogoIcon"
import { logoutAction } from "@/app/actions/users/logoutAction"
import { useTransition } from "react"
import { RyogoOutlineButton } from "@/components/buttons/ryogoButtons"
import {
  CreateAccountTotalSteps,
  VerifyAccountTotalSteps,
  AddVehicleTotalSteps,
  AddDriverTotalSteps,
  AddAgentTotalSteps,
} from "@/lib/uiConfig"
import {
  SectionColWrapper,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"

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
    <Sidebar
      side="right"
      collapsible={isMobile ? "offcanvas" : "none"}
      mobileWidth="281px"
      className="h-full bg-slate-50 dark:bg-slate-950"
    >
      <SidebarHeader className="px-6 md:px-8 pt-8 md:pt-10">
        <RyogoH4 weight="font-bold" color="light">
          {t("Heading")}
        </RyogoH4>
      </SidebarHeader>
      <SidebarContent className="px-6 md:px-8 py-8 md:py-10">
        {currentProcess !== undefined && (
          <div
            id="OnboardingSidebarSteps"
            className="flex flex-col gap-2 md:gap-3"
          >
            {items.map((item, index) => (
              <SectionRowWrapper key={index} justifyStart>
                <SectionColWrapper center>
                  <div
                    className={`rounded-lg
                      ${
                        currentProcess > index ||
                        (currentProcess === index && isLastStep)
                          ? "bg-slate-950 dark:bg-white shadow"
                          : currentProcess === index
                            ? "bg-white  dark:bg-slate-950 border border-sky-700 dark:border-sky-300 shadow"
                            : "bg-slate-300  dark:bg-slate-700"
                      } flex shrink-0 justify-center items-center size-9 md:size-10`}
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
                      className={`w-0.5 h-14 md:h-12 ${currentProcess > index ? "bg-sky-700 dark:bg-sky-300" : "bg-slate-300  dark:bg-slate-700"} rounded-full`}
                    ></div>
                  )}
                </SectionColWrapper>
                <SectionColWrapper small>
                  <RyogoSmall
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
                  </RyogoSmall>
                  <RyogoCaption
                    color={currentProcess >= index ? "slate" : "light"}
                  >
                    {item.description}
                  </RyogoCaption>
                  <RyogoTiny color={"light"} weight="font-bold">
                    {item.steps}
                  </RyogoTiny>
                </SectionColWrapper>
              </SectionRowWrapper>
            ))}
          </div>
        )}
      </SidebarContent>
      <SidebarFooter className="px-6 md:px-8 pb-8 md:pb-10">
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
      </SidebarFooter>
    </Sidebar>
  )
}
