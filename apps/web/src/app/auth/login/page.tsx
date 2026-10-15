import { Metadata } from "next"
import LoginPageComponent from "./login"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"

export const metadata: Metadata = {
  title: `Login - ${pageTitle}`,
  description: pageDescription,
}

export default async function LoginPage() {
  return <LoginPageComponent />
}
