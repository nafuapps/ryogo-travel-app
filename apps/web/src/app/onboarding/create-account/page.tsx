//(Onboarding) Add agency and owner page

import { Metadata } from "next";
import CreateAccountPageComponent from "./createAccount";
import { getCurrentUser } from "@/lib/auth";
import { redirect, RedirectType } from "next/navigation";

export const metadata: Metadata = {
  title: "Create Account Page | RyoGo",
  description: "Create Account page for RyoGo Travel App",
};
export default async function CreateAccountPage() {
  const user = await getCurrentUser();

  // Redirect to private route if the user is authenticated
  if (user?.userId) {
    if (user.userRole == "driver") {
      redirect("/rider", RedirectType.replace);
    }
    redirect("/dashboard", RedirectType.replace);
  }
  return <CreateAccountPageComponent />;
}
