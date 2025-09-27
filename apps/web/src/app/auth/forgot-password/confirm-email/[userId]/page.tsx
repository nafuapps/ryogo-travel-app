//Confirm Email page

import { redirect, RedirectType } from "next/navigation";
import { UserRegex } from "../../../components/regex";
import ConfirmEmailComponent from "./confirmEmail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Confirm Email Page",
  description: "Comfirm Email page for RyoGo Travel App",
};

export default async function ConfirmEmailPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const userId = (await params).userId;

  if (!UserRegex.safeParse(userId).success) {
    redirect("/auth/login", RedirectType.replace);
  }

  return <ConfirmEmailComponent userId={userId} />;
}
