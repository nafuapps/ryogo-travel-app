//Login  page
import { Metadata } from "next";
import LoginComponent from "./login";

export const metadata: Metadata = {
  title: "Login Page",
  description: "Login page for RyoGo Travel App",
};
export default function LoginPage() {
  return <LoginComponent />;
}
