import {
  buttonClassName,
  headerClassName,
  headerIconClassName,
  headerLeftClassName,
  headerRightClassName,
  tooltipClassName,
} from "@/components/header/headerCommon";
import { H4, SmallGrey } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LucideTarget } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function RiderHeader() {
  const t = useTranslations("Rider.Header");
  const pathname = usePathname();

  const titleKey = ("Title." + pathname || "Title./rider") as Parameters<
    typeof t
  >[0];

  return (
    <div id="RiderHeader" className={headerClassName}>
      <div id="HeaderLeft" className={headerLeftClassName}>
        <SidebarTrigger />
        <H4>{t(titleKey)}</H4>
      </div>
      <div id="HeaderRight" className={headerRightClassName}>
        <Link href="/rider/myActions">
          <Tooltip disableHoverableContent>
            <TooltipTrigger asChild>
              <Button variant="outline" size={"lg"}>
                <span className={buttonClassName}>
                  <SmallGrey>{t("ActionCenter")}</SmallGrey>
                </span>
                <LucideTarget className={headerIconClassName} />
              </Button>
            </TooltipTrigger>
            <TooltipContent className={tooltipClassName}>
              {t("ActionCenter")}
            </TooltipContent>
          </Tooltip>
        </Link>
      </div>
    </div>
  );
}
