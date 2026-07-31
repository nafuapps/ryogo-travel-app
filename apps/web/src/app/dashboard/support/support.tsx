import { getTranslations } from "next-intl/server"
import { PageWrapper } from "@/components/page/pageWrappers"
import { FAQWrapper, FAQItem } from "@/components/flows/landing/faqWrapper"
import SupportCategoryCard from "@/components/flows/support/supportCategoryCard"
import { RyogoH3, RyogoSmall } from "@/components/typography"
import {
  Play,
  User,
  Car,
  Tickets,
  IdCard,
  BadgeIndianRupee,
  ChartLine,
  Target,
  Users,
  Video,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"

export default async function SupportPageComponent({
  isOwner,
}: {
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.Support")

  return (
    <PageWrapper id="DashboardSupportPage" disableScrollInMobile>
      <RyogoH3 weight="font-bold" className="mx-auto text-center mt-4 lg:mt-5">
        {t("Title")}
      </RyogoH3>
      <RyogoSmall color="light" className="mx-auto text-center mb-4 lg:mb-5">
        {t("Description")}
      </RyogoSmall>
      <div className="grid gap-5 lg:gap-6 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3">
        <SupportCategoryCard
          title={t("Started.Title")}
          description={t("Started.Description")}
          icon={Play}
          link={"/dashboard/support/help-started"}
        />
        <SupportCategoryCard
          title={t("Account.Title")}
          description={t("Account.Description")}
          icon={User}
          link={"/dashboard/support/help-account"}
        />
        <SupportCategoryCard
          title={t("Bookings.Title")}
          description={t("Bookings.Description")}
          icon={Tickets}
          link={"/dashboard/support/help-bookings"}
        />
        <SupportCategoryCard
          title={t("Vehicles.Title")}
          description={t("Vehicles.Description")}
          icon={Car}
          link={"/dashboard/support/help-vehicles"}
        />
        <SupportCategoryCard
          title={t("Drivers.Title")}
          description={t("Drivers.Description")}
          icon={IdCard}
          link={"/dashboard/support/help-drivers"}
        />
        <SupportCategoryCard
          title={t("Customers.Title")}
          description={t("Customers.Description")}
          icon={BadgeIndianRupee}
          link={"/dashboard/support/help-customers"}
        />
        {isOwner && (
          <SupportCategoryCard
            title={t("Users.Title")}
            description={t("Users.Description")}
            icon={Users}
            link={"/dashboard/support/help-users"}
          />
        )}
        {isOwner && (
          <SupportCategoryCard
            title={t("Analytics.Title")}
            description={t("Analytics.Description")}
            icon={ChartLine}
            link={"/dashboard/support/help-analytics"}
          />
        )}
        <SupportCategoryCard
          title={t("Missions.Title")}
          description={t("Missions.Description")}
          icon={Target}
          link={"/dashboard/support/help-missions"}
        />
        <SupportCategoryCard
          title={t("Videos.Title")}
          description={t("Videos.Description")}
          icon={Video}
          link={"/dashboard/support/help-videos"}
        />
      </div>
      <Separator />
      <RyogoH3 weight="font-bold" className="mx-auto text-center mt-4 lg:mt-5">
        {t("FAQs.Title")}
      </RyogoH3>
      <RyogoSmall color="light" className="mx-auto text-center mb-4 lg:mb-5">
        {t("FAQs.Description")}
      </RyogoSmall>
      <FAQWrapper>
        <FAQItem
          question={t("FAQs.Q1.Question")}
          answer={t("FAQs.Q1.Answer")}
        />
        <FAQItem
          question={t("FAQs.Q2.Question")}
          answer={t("FAQs.Q2.Answer")}
        />
        <FAQItem
          question={t("FAQs.Q3.Question")}
          answer={t("FAQs.Q3.Answer")}
        />
      </FAQWrapper>
    </PageWrapper>
  )
}
