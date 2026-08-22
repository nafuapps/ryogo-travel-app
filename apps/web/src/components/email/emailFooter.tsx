import {
  RyogoLogoSrc,
  SUPPORT_EMAIL,
  SUPPORT_HELPLINE_NUMBER,
} from "@/lib/uiConfig"

export default function EmailFooter() {
  return (
    <>
      <p>
        For any issues, contact our support team at {SUPPORT_EMAIL} or call us
        at {SUPPORT_HELPLINE_NUMBER}
      </p>
      <small>
        This is an automatically generated email. Please do not reply.
      </small>
      <br />
      <br />
      <img src={RyogoLogoSrc} alt="RyoGo Logo" height={"80px"} />
    </>
  )
}
