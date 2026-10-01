import {
  AuthMainWrapper,
  AuthSideWrapper,
} from "@/components/flows/auth/authWrappers"

export default async function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AuthSideWrapper src={"/loginBG.png"} alt="Login Page Cover Image" />
      <AuthMainWrapper src={"/loginBG.png"}>{children}</AuthMainWrapper>
    </>
  )
}
