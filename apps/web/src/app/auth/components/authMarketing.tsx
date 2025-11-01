'use client';

import { PGrey } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthMarketing() {
  const t = useTranslations("Auth.Sidebar");
  const pathname = usePathname();

  const isSignup = pathname.startsWith("/auth/signup");

  return (
    <div
      id="AuthMarketingSection"
      className="md:flex md:w-1/2 md:flex-col items-center justify-center md:px-8 lg:px-10 md:py-10 lg:py-12 md:h-full md:gap-8 lg:gap-10 md:bg-slate-50 hidden"
    >
      {/* TODO: Add logo */}
      <Skeleton className="md:flex md:w-72 md:h-14 lg:w-80 lg:h-16 md:bg-slate-300" />
      <PGrey>{isSignup ? t("TitleSignup") : t("TitleLogin")}</PGrey>
      <Button variant="outline" size="lg">
        <Link href={isSignup ? "/auth/login" : "/auth/signup"}>
          {isSignup ? t("CTASignup") : t("CTALogin")}
        </Link>
      </Button>
    </div>
  );
}
