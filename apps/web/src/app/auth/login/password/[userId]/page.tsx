//Login password page

import { Metadata } from "next";
import LoginPasswordComponent from "./loginPassword";
import { UserRegex } from "@/lib/regex";
import { redirect, RedirectType } from "next/navigation";

export const metadata: Metadata = {
  title: "Login Password Page | RyoGo",
  description: "Login Password page for RyoGo Travel App",
};
export default async function LoginPasswordPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const userId = (await params).userId;

  if (!UserRegex.safeParse(userId).success) {
    redirect("/auth/login", RedirectType.replace);
  }
  return <LoginPasswordComponent userId={userId} />;
}
