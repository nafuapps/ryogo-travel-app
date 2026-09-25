"use client"

import {
  RyogoH4,
  RyogoP,
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
      className="bg-slate-50 dark:bg-slate-900"
    >
      <SidebarHeader className="px-6 md:px-8 pt-8 md:pt-10">
        <RyogoH4 weight="font-bold" color="light">
          {t("Heading")}
        </RyogoH4>
      </SidebarHeader>
      <SidebarContent className="px-6 md:px-8 py-4 md:py-5">
        {currentProcess !== undefined && (
          <SectionColWrapper>
            {items.map((item, index) => (
              <SectionRowWrapper key={index} className="justify-start">
                <SectionColWrapper small className="items-center">
                  <div
                    className={`rounded-lg
                      ${
                        currentProcess > index
                          ? "bg-slate-900 dark:bg-slate-50"
                          : currentProcess === index
                            ? "bg-white  dark:bg-slate-900 border border-sky-700 dark:border-sky-300"
                            : "bg-slate-300  dark:bg-slate-700"
                      } flex shrink-0 justify-center items-center size-9 md:size-10`}
                  >
                    {currentProcess > index ||
                    (currentProcess === index && isLastStep) ? (
                      <RyogoIcon
                        icon={Check}
                        size="sm"
                        color={currentProcess > index ? "white" : "brand"}
                        thick
                      />
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
                      className={`w-0.5 h-12 md:h-10 ${currentProcess > index ? "bg-sky-700 dark:bg-sky-300" : "bg-slate-300  dark:bg-slate-700"} rounded-full`}
                    ></div>
                  )}
                </SectionColWrapper>
                <SectionColWrapper small>
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
          </SectionColWrapper>
        )}
      </SidebarContent>
      <SidebarFooter className="px-6 md:px-8 pb-8 md:pb-10">
        <SectionColWrapper small>
          {showLogout && (
            <RyogoOutlineButton
              onClick={logoutUser}
              label={t("Logout")}
              labelColor="light"
              disabled={isPending}
              className="md:self-start"
            />
          )}
          <RyoGoLogo />
        </SectionColWrapper>
      </SidebarFooter>
    </Sidebar>
  )
}
