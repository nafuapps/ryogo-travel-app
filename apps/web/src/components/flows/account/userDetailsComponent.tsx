import moment from "moment"
import { getTranslations } from "next-intl/server"
import {
  DetailsBorderWrapper,
  DetailsContentWrapper,
  DetailsLineItem,
  SectionRowWrapper,
} from "@/components/page/pageWrappers"
import { UserRolesEnum } from "@ryogo-travel-app/db/schema"
import { RyogoCaption } from "@/components/typography"

export default async function UserDetailsComponent({
  phone,
  email,
  createdAt,
  role,
  isAdmin,
}: {
  phone: string
  email: string
  createdAt: Date
  role: UserRolesEnum
  isAdmin?: boolean
}) {
  const t = await getTranslations("Dashboard.Account")
  return (
    <DetailsBorderWrapper>
      <DetailsContentWrapper>
        <DetailsLineItem label={t("Phone")} value={phone} />
        <DetailsLineItem label={t("Email")} value={email} />
        <DetailsLineItem
          label={t("Joined")}
          value={moment(createdAt).format("DD MMM YYYY")}
        />
        <DetailsLineItem label={t("Role")} value={role.toUpperCase()} />
        {isAdmin && (
          <SectionRowWrapper className="mt-auto rounded-sm bg-slate-100 dark:bg-slate-700 p-1.5 lg:p-2 items-center justify-center">
            <RyogoCaption color="light">{t("Admin")}</RyogoCaption>
          </SectionRowWrapper>
        )}
      </DetailsContentWrapper>
    </DetailsBorderWrapper>
  )
}
