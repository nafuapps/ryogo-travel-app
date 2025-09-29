import { H3Grey, H5, H5Grey, SmallGrey } from "@/components/typography";
import { Sidebar, useSidebar } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { LucideCheck } from "lucide-react";
import { useTranslations } from "next-intl";

export default function OnboardingSidebar({
  currentProcess,
}: {
  currentProcess: number;
}) {
  const t = useTranslations("Onboarding.Sidebar");
  const { isMobile } = useSidebar();

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
  ];
  // TODO: Add Logo
  return (
    <Sidebar side="right" collapsible={isMobile ? "offcanvas" : "none"}>
      <div
        id="OnboardingSidebarSection"
        className="w-full flex px-8 py-10 md:p-12 lg:p-16 h-full flex-col gap-8 lg:gap-10 bg-slate-50"
      >
        {/* TODO: Add Logo */}
        <Skeleton className="w-72 h-14 lg:w-80 lg:h-16 bg-slate-200" />
        <H3Grey>{t("Heading")}</H3Grey>
        <div
          id="OnboardingSidebarSteps"
          className="flex flex-col items-start gap-6 lg:gap-8"
        >
          {items.map((item, index) => (
            <div
              key={index}
              className="flex flex-row gap-3 md:gap-4 items-start"
            >
              <div
                className={`rounded-full border-4 
          ${
            currentProcess > index
              ? "bg-slate-950 border-slate-950"
              : currentProcess === index
              ? "bg-white border-slate-950"
              : "bg-white border-slate-300 text-slate-400"
          } flex shrink-0 justify-center items-center w-10 h-10 lg:w-12 lg:h-12`}
              >
                <H5>
                  {currentProcess > index ? (
                    <LucideCheck className="w-5 h-5 lg:w-7 lg:h-7 text-white" />
                  ) : (
                    index + 1
                  )}
                </H5>
              </div>
              <div className="flex flex-col items-start">
                {currentProcess >= index ? (
                  <H5>{item.title}</H5>
                ) : (
                  <H5Grey>{item.title}</H5Grey>
                )}
                <SmallGrey>{item.description}</SmallGrey>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Sidebar>
  );
}
