import { useTranslations } from "next-intl"

export default function GetDriverInviteMessage(
  driverPhone: string,
  driverName: string,
  agencyName: string,
  emailId: string,
) {
  const t = useTranslations("Dashboard.Whatsapp")
  const inviteLink = `${window.location.origin}/auth/login`
  const message = t("DriverInvite", {
    driverName: driverName,
    agencyName: agencyName,
    emailId: emailId,
    inviteLink: inviteLink,
  })
  return `https://wa.me/91${driverPhone}/?text=${encodeURIComponent(message)}`
}
