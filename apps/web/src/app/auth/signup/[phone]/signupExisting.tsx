//Existing Account page
"use client";

import { Button } from "@/components/ui/button";
import { CaptionGrey, H2, P } from "@/components/typography";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { AccountCard } from "@/app/auth/components/accountCard";
import { apiClient } from "@ryogo-travel-app/api/client/apiClient";
import { SignupExistingAPIResponseType } from "@ryogo-travel-app/api/types/user.types";
import { redirect, RedirectType } from "next/navigation";
import { useEffect, useState } from "react";

/*
  1. Get user details from DB using phone number
  2. If no account found, redirect to onboarding
  3. If no owner account found, show account details and nudge user to login (but also an extra option to create account)
  4. If some owner account found, show a list and nudge to login (with callout to contact support for creating account)
*/
export async function fetchAccounts(phone: string) {
  const fetchedAccounts = await apiClient<SignupExistingAPIResponseType>(
    `/api/auth/signup/existing/${phone}`,
    {
      method: "GET",
    }
  );
  //If no account found, take directly to onboarding
  if (fetchedAccounts.length < 1) {
    redirect("/onboarding", RedirectType.replace);
  } else {
    return fetchedAccounts;
  }
}

type SignupExistingComponentProps = {
  phone: string;
};
export default function SignupExistingComponent(
  props: SignupExistingComponentProps
) {
  const phone = props.phone;
  const [accounts, setAccounts] = useState<SignupExistingAPIResponseType>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedAccounts = await fetchAccounts(phone);
      setAccounts(fetchedAccounts);
    };
    fetchData();
  }, [phone]);

  const hasOwnerAccount = accounts.some(
    (p) => p.userRole.toString().toLowerCase() === "owner"
  );

  const t = useTranslations("Auth.SignupPage.Step2");

  return (
    <div
      id="SignupExistingPage"
      className="gap-4 w-full h-full flex flex-col justify-between"
    >
      <H2>{t("PageTitle")}</H2>
      <div className="flex flex-col gap-3 lg:gap-4 p-1 overflow-y-scroll no-scrollbar">
        <P>{hasOwnerAccount ? t("InfoYes") : t("InfoNo")}</P>
        {accounts.length > 0 &&
          accounts.map((item, index) => (
            <AccountCard
              key={index}
              agencyName={item.agency.businessName}
              name={item.name}
              phone={item.phone}
              userId={item.id}
              userRole={item.userRole}
            />
          ))}
      </div>
      <div id="SignupExistingActions" className="flex flex-col gap-4 w-full">
        {hasOwnerAccount ? (
          <>
            <Button variant={"secondary"} size={"lg"}>
              <Link href="mailto:nafuapps@gmail.com">
                {t("SecondaryCTAYes")}
              </Link>
            </Button>
            <CaptionGrey> {t("Description")}</CaptionGrey>
          </>
        ) : (
          <Button
            variant={"secondary"}
            size={"lg"}
            disabled={accounts.length < 1}
          >
            <Link href={"/onboarding"}>{t("SecondaryCTANo")}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
