//Existing Account page
import { Metadata } from "next";
import { PhoneRegex } from "../../components/regex";
import { redirect, RedirectType } from "next/navigation";
import SignupExistingComponent from "./signupExisting";

export const metadata: Metadata = {
  title: "Signup Existing Accounts Page",
  description: "Signup Existing Accounts page for RyoGo Travel App",
};

export default async function SignupExistingPage({
  params,
}: {
  params: Promise<{ phone: string }>;
}) {
  const { phone } = await params;

  // If phone number not legible, redirect back to signup page
  if (!PhoneRegex.safeParse(phone).success) {
    redirect("/auth/signup", RedirectType.replace);
  }

  return <SignupExistingComponent phone={phone} />;
}
