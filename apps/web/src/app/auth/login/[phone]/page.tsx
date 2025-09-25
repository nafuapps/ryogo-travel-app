import { H2, P } from "@/components/typography";
import { userServices } from "@ryogo-travel-app/api/services/user.services";
import { getTranslations } from "next-intl/server";
import { redirect, RedirectType } from "next/navigation";
import z from "zod";
import { AccountCard } from "../../components/accountCard";
import { BackButton } from "../../components/backButton";

const phoneRegex = z
  .string()
  .length(10)
  .regex(/^[0-9]+$/);

export default async function LoginAccountsPage({
  params,
}: {
  params: Promise<{ phone: string }>;
}) {
  const { phone } = await params;
  if (!phoneRegex.safeParse(phone).success) {
    redirect("/auth/login", RedirectType.replace);
  }
  // const accounts = await userServices.findUserAccountsByPhone(phone);
  // console.log(accounts);
  // if (accounts.length < 1) {
  //   redirect("/auth/login", RedirectType.replace);
  // }
  const t = await getTranslations("Auth.LoginPage.Step2");

  const accounts = [
    {
      phone: "1122334455",
      id: "U1111111",
      name: "ABCD",
      agencyId: "A1234",
      userRole: "owner",
      agency: {
        businessName: "Agency1",
      },
    },
    {
      phone: "1122334455",
      id: "U2222222",
      name: "XYZ",
      agencyId: "A2222",
      userRole: "driver",
      agency: {
        businessName: "Agency2",
      },
    },
    {
      phone: "1122334455",
      id: "U3333333",
      name: "PQRS",
      agencyId: "A2222",
      userRole: "agent",
      agency: {
        businessName: "Agency3",
      },
    },
  ];

  return (
    <div
      id="LoginAccountsPage"
      className="gap-4 flex flex-col justify-between w-full h-full"
    >
      <H2>{t("PageTitle")}</H2>
      <div className="flex flex-col gap-3 lg:gap-4 p-1 overflow-y-scroll">
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
