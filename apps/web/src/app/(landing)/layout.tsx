import { getCurrentUser } from "@/lib/auth";
import type { Metadata } from "next";
import { redirect, RedirectType } from "next/navigation";

export const metadata: Metadata = {
  title: "RyoGo Travel Agency App",
  description: "RyoGo is a travel agency app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  // Redirect to private route if the user is authenticated
  if (user?.userId) {
    if (user.userRole == "driver") {
      redirect("/rider", RedirectType.replace);
    }
    redirect("/dashboard", RedirectType.replace);
  }

  return <div id="LandingLayout"></div>;
}
