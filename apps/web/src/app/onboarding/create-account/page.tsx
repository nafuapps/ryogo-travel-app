//(Onboarding) Add agency and owner page

import { Metadata } from "next";
import CreateAccountPageComponent from "./createAccount";

export const metadata: Metadata = {
  title: "Create Account Page | RyoGo",
  description: "Create Account page for RyoGo Travel App",
};
export default function CreateAccountPage() {
  return <CreateAccountPageComponent />;
}
