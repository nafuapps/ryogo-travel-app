"use client";

import { H2, P } from "@/components/typography";
import { AccountCard } from "@/app/auth/components/accountCard";
import { BackButton } from "@/app/auth/components/backButton";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { apiClient } from "@ryogo-travel-app/api/client/apiClient";
import { LoginAccountsAPIResponseType } from "@ryogo-travel-app/api/types/user.types";
import { redirect, RedirectType } from "next/navigation";

export async function fetchAccounts(phone: string) {
  const fetchedAccounts = await apiClient<LoginAccountsAPIResponseType>(
    `/api/auth/login/accounts/${phone}`,
    {
      method: "GET",
    }
  );
  //If no account found, take to onboarding
  if (fetchedAccounts.length < 1) {
    redirect("/onboarding", RedirectType.replace);
  } else {
    return fetchedAccounts;
  }
}

type LoginAccountsComponentProps = {
  phone: string;
};
export default function LoginAccountsComponent(
  props: LoginAccountsComponentProps
) {
  const phone = props.phone;
  const [accounts, setAccounts] = useState<LoginAccountsAPIResponseType>([]);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedAccounts = await fetchAccounts(phone);
      setAccounts(fetchedAccounts);
    };
    fetchData();
  }, [phone]);

  const t = useTranslations("Auth.LoginPage.Step2");

  return (
    <div
      id="LoginAccountsPage"
      className="gap-4 flex flex-col justify-between w-full h-full"
    >
      <H2>{t("PageTitle")}</H2>
      <div className="flex flex-col gap-3 lg:gap-4 p-1 overflow-y-scroll no-scrollbar">
        <P>{t("Info")}</P>
        {accounts.map((account) => (
          <AccountCard
            key={account.id}
            phone={account.phone}
            name={account.name}
            userId={account.id}
            userRole={account.userRole}
            agencyName={account.agency.businessName}
          />
        ))}
      </div>
      <div id="LoginAccountsActions" className="flex flex-col gap-4 w-full">
        <BackButton label={t("SecondaryCTA")} />
      </div>
    </div>
  );
}
