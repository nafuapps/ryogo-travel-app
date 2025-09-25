//Existing Account page

import z from "zod";
import { Button } from "@/components/ui/button";
import { CaptionGrey, H2, P } from "@/components/typography";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { AccountCard } from "../../components/accountCard";

/*
  1. Get user details from DB using phone number
  2. If no account found, redirect to onboarding
  3. If no owner account found, show account details and nudge user to login (but also an extra option to create account)
  4. If some owner account found, show a list and nudge to login (with callout to contact support for creating account)
*/

const phoneRegex = z
  .string()
  .length(10)
  .regex(/^[0-9]+$/);

export default async function SignupExistingPage({
  params,
}: {
  params: Promise<{ phone: string }>;
}) {
  const { phone } = await params;

  // If phone number not legible, redirect back to signup page
  if (!phoneRegex.safeParse(phone).success) {
    redirect("/auth/signup", RedirectType.replace);
  }
  // //Get data from DB
  // const accounts = await userServices.findUserAccountsByPhone(phone);
  // console.log(accounts);
  // if (accounts.length < 1) {
  //   redirect("/onboarding", RedirectType.replace);
  // }

  /* Case 1 - No owner account*/
  const accounts = [
    {
      phone: "1122334455",
      id: "U1111111",
      name: "ABCD",
      agencyId: "A1234",
      userRole: "agent",
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
  ];

  const hasOwnerAccount = accounts.some(
    (p) => p.userRole.toString().toLowerCase() === "owner"
  );

  const t = await getTranslations("Auth.SignupPage.Step2");

  return (
    <div
      id="SignupExistingPage"
      className="gap-4 w-full h-full flex flex-col justify-between"
    >
      <H2>{t("PageTitle")}</H2>
      <div className="flex flex-col gap-3 lg:gap-4 p-1 overflow-y-scroll">
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
          <Button variant={"secondary"} size={"lg"}>
            <Link href={"/onboarding"}>{t("SecondaryCTANo")}</Link>
          </Button>
        )}
      </div>
    </div>
  );
}
