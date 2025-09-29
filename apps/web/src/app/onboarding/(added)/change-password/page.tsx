//New agent loggin in for the first time or existing user resetting password

import { getCurrentUser } from "@/lib/auth";
import ChangePasswordComponent from "./changePassword";
import { redirect, RedirectType } from "next/navigation";

export default async function ChangePasswordPage() {
  const currentUser = await getCurrentUser();
  //If no user logged in, go to login page
  if (!currentUser) {
    redirect("/auth/login", RedirectType.replace);
  }

  //Owner
  if (currentUser.userRole === "owner") {
    if (currentUser.status == "new") {
      //If new owner, go to vehicle onboarding
      redirect("/onboarding/add-vehicle", RedirectType.replace);
    }
    //Else, go to dashboard
    // redirect("/dashboard", RedirectType.replace);
  }

  //Not owner, old user
  // if (currentUser.status !== "new") {
  //   if (currentUser.userRole == "driver") {
  //     //If driver, go to rider
  //     redirect("/rider", RedirectType.replace);
  //   } else {
  //     //If driver, go to dashboard
  //     redirect("/dashboard", RedirectType.replace);
  //   }
  // }

  return (
    <ChangePasswordComponent
      userId={currentUser.userId}
      role={currentUser.userRole}
    />
  );
}
