//Login Accounts page
import { Metadata } from "next";
import LoginAccountsComponent from "./loginAccounts";
import { PhoneRegex } from "../../components/regex";
import { redirect, RedirectType } from "next/navigation";

export const metadata: Metadata = {
  title: "Login Accounts Page",
  description: "Login Accounts page for RyoGo Travel App",
};

export default async function LoginAccountsPage({
  params,
}: {
  params: Promise<{ phone: string }>;
}) {
  const { phone } = await params;
  if (!PhoneRegex.safeParse(phone).success) {
    redirect("/auth/login", RedirectType.replace);
  }

  return <LoginAccountsComponent phone={phone} />;
}
