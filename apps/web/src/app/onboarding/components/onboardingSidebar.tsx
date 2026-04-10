import {
  Caption,
  CaptionGrey,
  H3Grey,
  H5,
  PBold,
  PGrey,
} from "@/components/typography"
import { Sidebar, useSidebar } from "@/components/ui/sidebar"
import { LucideCheck } from "lucide-react"
import { useTranslations } from "next-intl"
import RyoGoLogo from "@/components/logo"

export default function OnboardingSidebar({
  currentProcess,
}: {
  currentProcess: number
}) {
  const t = useTranslations("Onboarding.Sidebar")
  const { isMobile } = useSidebar()

  const items = [
    {
      title: t("Step1.Title"),
      description: t("Step1.Description"),
    },
    {
      title: t("Step2.Title"),
      description: t("Step2.Description"),
    },
    {
      title: t("Step3.Title"),
      description: t("Step3.Description"),
    },
    {
      title: t("Step4.Title"),
      description: t("Step4.Description"),
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
            currentProcess > index
              ? "bg-slate-950  text-slate-50 shadow"
              : currentProcess === index
                ? "bg-white text-slate-950 border-2 border-slate-950 shadow"
                : "bg-slate-100 text-slate-400"
          } flex shrink-0 justify-center items-center size-8 lg:size-10`}
                >
                  <H5>
                    {currentProcess > index ? (
                      <LucideCheck className="size-4 lg:size-5" />
                    ) : (
                      index + 1
                    )}
                  </H5>
                </div>
                {index < 3 && (
                  <div className="w-0.5 h-8 bg-slate-200 rounded-full"></div>
                )}
              </div>
              <div className="flex flex-col items-start">
                {currentProcess >= index ? (
                  <PBold>{item.title}</PBold>
                ) : (
                  <PGrey>{item.title}</PGrey>
                )}
                {currentProcess >= index ? (
                  <Caption>{item.description}</Caption>
                ) : (
                  <CaptionGrey>{item.description}</CaptionGrey>
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
