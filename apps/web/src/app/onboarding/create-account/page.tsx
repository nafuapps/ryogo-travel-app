//(Onboarding) Add agency and owner page

import { Metadata } from "next";
import CreateAccountComponent from "./createAccount";

export const metadata: Metadata = {
  title: "Create Account Page | RyoGo",
  description: "Create Account page for RyoGo Travel App",
};
export default function CreateAccountPage() {
  return <CreateAccountComponent />;
}
