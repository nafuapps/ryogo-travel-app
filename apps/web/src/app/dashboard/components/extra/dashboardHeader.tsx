"use client";

import {
  headerButtonClassName,
  headerClassName,
  headerIconClassName,
  headerLeftClassName,
  headerRightClassName,
  headerTooltipClassName,
} from "@/components/header/headerCommon";
import { H4, SmallGrey } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucidePlus, LucideTarget } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function DashboardHeader() {
  const t = useTranslations("Dashboard.Header");
  const pathname = usePathname();

  const titleKey = ("Title." + pathname || "Title./dashboard") as Parameters<
    typeof t
  >[0];

  return (
    <div id="DashboardHeader" className={headerClassName}>
      <div id="HeaderLeft" className={headerLeftClassName}>
        <SidebarTrigger />
        <H4>{t(titleKey)}</H4>
      </div>
      <div id="HeaderRight" className={headerRightClassName}>
        <Link href="/dashboard/bookings/new">
          <Tooltip disableHoverableContent>
            <TooltipTrigger asChild>
              <Button variant="outline" size={"lg"}>
                <LucidePlus className={headerIconClassName} />
                <span className={headerButtonClassName}>
                  <SmallGrey>{t("NewBooking")}</SmallGrey>
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent className={headerTooltipClassName}>
              {t("NewBooking")}
            </TooltipContent>
          </Tooltip>
        </Link>
        <Link href="/dashboard/action-center">
          <Tooltip disableHoverableContent>
            <TooltipTrigger asChild>
              <Button variant="outline" size={"lg"}>
                <span className={headerButtonClassName}>
                  <SmallGrey>{t("ActionCenter")}</SmallGrey>
                </span>
                <LucideTarget className={headerIconClassName} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className={headerTooltipClassName}>
              {t("ActionCenter")}
            </TooltipContent>
          </Tooltip>
        </Link>
      </div>
    </div>
  );
}
