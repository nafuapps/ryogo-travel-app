//Existing Account page

import z from "zod";
import { Button } from "@/components/ui/button";
import { CaptionGrey, H2, P } from "@/components/typography";
import Link from "next/link";
import { redirect, RedirectType } from "next/navigation";
import { getTranslations } from "next-intl/server";

/*
  1. Get user details from DB using phone number
  2. If no account found, redirect to onboarding
  3. If 1 account found, show account details and nudge user to login (but also an extra option to create account)
  4. If more than 1 account found, show a list and nudge to login (with callout to contact support for creating account)
*/

const phoneRegex = z
  .string()
  .length(10)
  .regex(/^[0-9]+$/);

export default async function SignupExistingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const phoneNumber = await params["phone"];

  // If phone number not legible, redirect back to signup page
  if (
    phoneNumber == undefined ||
    phoneNumber == null ||
    phoneRegex.parse(phoneNumber) != phoneNumber
  ) {
    redirect("/signup", RedirectType.replace);
  }

  // TODO: Get data from DB

  /* Case 1 - No account*/
  // const data: ExistingAccountType[] = []

  /* Case 2 - One account*/
  const data = [
    {
      phoneNumber: "1234567890",
      agencyName: "Test Agency",
      userRole: "OWNER",
    },
  ];

  /* Case 3 - Many accounts*/
  // const data = [{
  //   phoneNumber: "1234567890",
  //   agencyName: "Test Agency 1",
  //   userRole: "OWNER"
  // },
  // {
  //   phoneNumber: "1234567890",
  //   agencyName: "Test Agency 2",
  //   userRole: "AGENT"
  // }
  // ]

  //Case 1 - no account, redirect to onboarding
  if (!data) {
    redirect("/onboarding");
  }

  const t = await getTranslations("Auth.SignupPage.Step2");

  return (
    <div
      id="SignupExistingPage"
      className="gap-4 w-full h-full flex flex-col justify-between"
    >
      <H2>{t("PageTitle")}</H2>
      <P>{data.length > 1 ? t("InfoMany") : t("Info1")}</P>
      {data.length > 0 && data.map((item, index) => (
        <ExistingAccount key={index} item={item} />
      ))}
      <div id="SignupExistingActions" className="flex flex-col gap-4 w-full">
        <Button variant={"default"} size={"lg"}>
          <Link href={"/login/password?phone=" + phoneNumber}>
            {t("PrimaryCTA")}
          </Link>
        </Button>
        {data.length > 1 ? (
          <>
            <Button variant={"secondary"} size={"lg"}>
              <Link href="mailto:nafuapps@gmail.com">
                {t("SecondaryCTAMany")}
              </Link>
            </Button>
            <CaptionGrey> {t("Description")}</CaptionGrey>
          </>
        ) : (
          <Button variant={"secondary"} size={"lg"}>
            <Link href={"/onboarding?phone=" + phoneNumber}>
              {t("SecondaryCTA1")}
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}

interface ExistingAccountType {
  item: {
    phoneNumber: string;
    agencyName: string;
    userRole: string;
  }
}

export function ExistingAccount({ item }: ExistingAccountType) {
  if (!item) return <></>
  return (
    <div>
      <P>{item!.phoneNumber}</P>
      <P>{item!.agencyName}</P>
      <P>{item!.userRole}</P>
    </div>
  );
}
