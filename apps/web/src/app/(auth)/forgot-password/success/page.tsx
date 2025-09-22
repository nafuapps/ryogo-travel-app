//Confirm Email page

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { H2, H5 } from "@/components/typography";

export default function ForgotPasswordSuccessPage() {
  const t = useTranslations('Auth.ForgotPasswordPage.Step3');

  return <div id="PasswordSuccessPage" className="gap-4 w-full h-full flex flex-col justify-between ">
    <H2>{t("PageTitle")}</H2>
    <H5>{t("Info")}</H5>
    <div id="PasswordSuccessActions" className='flex flex-col gap-4 w-full'>
      <Button variant={"default"} size={"lg"}>
        {t("PrimaryCTA")}
      </Button>
    </div>
  </div>
}
