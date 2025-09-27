//Signup page

import { Metadata } from "next";
import SignupComponent from "./signup";

export const metadata: Metadata = {
  title: "Signup Page",
  description: "Signup page for RyoGo Travel App",
};
export default function SignupPage() {
  return <SignupComponent />;
}
