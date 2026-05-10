import { useTranslations } from "next-intl"

export default function GetAgentInviteMessage(
  agentPhone: string,
  agentName: string,
  agencyName: string,
  emailId: string,
) {
  const t = useTranslations("Dashboard.Whatsapp")
  const inviteLink = `${window.location.origin}/auth/login`
  const message = t("AgentInvite", {
    agentName: agentName,
    agencyName: agencyName,
    emailId: emailId,
    inviteLink: inviteLink,
  })
  return `https://wa.me/91${agentPhone}/?text=${encodeURIComponent(message)}`
}
