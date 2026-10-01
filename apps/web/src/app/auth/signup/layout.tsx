import {
  AuthMainWrapper,
  AuthSideWrapper,
} from "@/components/flows/auth/authWrappers"

export default async function SignupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <AuthMainWrapper src={"/signupBG.png"}>{children}</AuthMainWrapper>
      <AuthSideWrapper src={"/signupBG.png"} alt="Signup Page Cover Image" />
    </>
  )
}
