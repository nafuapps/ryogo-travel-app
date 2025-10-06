//Signup page

import { Metadata } from "next";
import SignupPageComponent from "./signup";

export const metadata: Metadata = {
  title: "Signup Page | RyoGo",
  description: "Signup page for RyoGo Travel App",
};
export default function SignupPage() {
  return <SignupPageComponent />;
}
