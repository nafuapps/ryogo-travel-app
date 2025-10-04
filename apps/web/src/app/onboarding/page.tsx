//Onboarding home page

import { H2, H4, P, PGrey, Small } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { LucideFootprints, LucideListCheck } from "lucide-react";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Onboarding Page | RyoGo",
  description: "Onboarding page for RyoGo Travel App",
};

export default async function OnboardingHomePage() {
  const t = await getTranslations("Onboarding.HomePage");
  return (
    <div
      id="OnboardingHomePage"
      className="bg-white w-full h-full overflow-y-scroll no-scrollbar flex flex-col justify-between items-center px-6 md:px-10 lg:p-16 py-10 md:py-12 gap-8 lg:gap-10"
    >
      <div
        id="OnboardingHomeHeader"
        className="flex flex-col w-full items-center text-center"
      >
        {/* TODO: Logo*/}
        <H2>{t("Header.Title")}</H2>
        <P>{t("Header.Description")}</P>
      </div>
      <div
        id="OnboardingHomeBody"
        className="flex flex-col md:flex-row w-full h-full gap-8 md:gap-12"
      >
        <div
          id="OnboardingHomeSteps"
          className="border-slate-200 border rounded-lg p-6 md:p-8 w-full md:w-1/2 flex flex-col gap-2 md:gap-3"
        >
          <div className="flex flex-row gap-3 md:gap-4 justify-start items-center">
            <div className="bg-slate-100 rounded-full w-10 h-10 md:w-12 md:h-12 flex justify-center items-center">
              <LucideFootprints className="w-5 h-5 md:w-7 md:h-7" />
            </div>
            <H4>{t("BodySteps.Title")}</H4>
          </div>
          <PGrey>{t("BodySteps.Description")}</PGrey>
          <ol className="flex flex-col gap-2 md:gap-3">
            <li>
              <Small>{t("BodySteps.Step1")}</Small>
            </li>
            <li>
              <Small>{t("BodySteps.Step2")}</Small>
            </li>
            <li>
              <Small>{t("BodySteps.Step3")}</Small>
            </li>
            <li>
              <Small>{t("BodySteps.Step4")}</Small>
            </li>
          </ol>
        </div>
        <div
          id="OnboardingHomeChecklist"
          className="border-slate-200 border rounded-lg p-6 md:p-8 w-full md:w-1/2 flex flex-col gap-2 md:gap-3"
        >
          <div className="flex flex-row gap-3 md:gap-4 justify-start items-center">
            <div className="bg-slate-100 rounded-full w-10 h-10 md:w-12 md:h-12 flex justify-center items-center">
              <LucideListCheck className="w-5 h-5 md:w-7 md:h-7" />
            </div>
            <H4>{t("BodyChecklist.Title")}</H4>
          </div>
          <PGrey>{t("BodyChecklist.Description")}</PGrey>
          <ul className="flex flex-col gap-2 md:gap-3">
            <li className="flex gap-2 md:gap-3 items-center">
              <Checkbox />
              <Small>{t("BodyChecklist.Item1")}</Small>
            </li>
            <li className="flex gap-2 md:gap-3 items-center">
              <Checkbox />
              <Small>{t("BodyChecklist.Item2")}</Small>
            </li>
            <li className="flex gap-2 md:gap-3 items-center">
              <Checkbox />
              <Small>{t("BodyChecklist.Item3")}</Small>
            </li>
            <li className="flex gap-2 md:gap-3 items-center">
              <Checkbox />
              <Small>{t("BodyChecklist.Item4")}</Small>
            </li>
          </ul>
        </div>
      </div>
      <div id="OnboardingHomeFooter" className="w-full md:w-1/2">
        <Button variant={"default"} size={"lg"} className="w-full">
          <Link href="/onboarding/create-account">
            {t("Footer.PrimaryCTA")}
          </Link>
        </Button>
      </div>
    </div>
  );
}
