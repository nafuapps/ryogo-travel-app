import { PGrey } from "@/components/typography";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getTranslations } from "next-intl/server";
import { headers } from "next/headers";
import Link from "next/link";

export default async function AuthMarketing() {
  const t = await getTranslations("Auth.Sidebar");
  const headersList = await headers();
  const pathname = headersList.get("x-next-pathname") as string;

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
