import { Metadata } from "next"
import SignupPageComponent from "./signup"
import { pageTitle, pageDescription } from "@/components/page/pageCommons"

export const metadata: Metadata = {
  title: `Signup - ${pageTitle}`,
  description: pageDescription,
}

export default async function SignupPage() {
  return <SignupPageComponent />
}
