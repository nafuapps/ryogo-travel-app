//(Onboarding) Add driver page

import { getCurrentUser } from "@/lib/auth";
import { redirect, RedirectType } from "next/navigation";
import AddDriverComponent from "./addDriver";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Add Driver Page | RyoGo",
  description: "Add Driver page for RyoGo Travel App",
};

export default async function AddDriverPage() {
  const currentUser = await getCurrentUser();
  //If no user logged in, go to login page
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace);
  }
  //If user already onboarded, go to dashboard
  if (currentUser.status !== "new") {
    redirect("/dashboard", RedirectType.replace);
  }
  //If not owner, go to change password page
  if (currentUser.userRole !== "owner") {
    redirect("/onboarding/change-password", RedirectType.replace);
  }

  return (
    <AddDriverComponent
      agencyId={currentUser.agencyId}
      userId={currentUser.userId}
      userStatus={currentUser.status}
    />
  );
}
