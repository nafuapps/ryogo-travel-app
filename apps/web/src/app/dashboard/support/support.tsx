import { getTranslations } from "next-intl/server"
import { PageWrapper } from "@/components/page/pageWrappers"
import SupportCategoryCard from "@/components/flows/support/supportCategoryCard"
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
  Newspaper,
} from "lucide-react"
import { Separator } from "@/components/ui/separator"
import {
  SupportFAQWrapper,
  SupportFAQItem,
} from "@/components/flows/support/supportFAQWrapper"
import SupportSectionHeader from "@/components/flows/support/supportSectionHeader"

export default async function SupportPageComponent({
  isOwner,
}: {
  isOwner: boolean
}) {
  const t = await getTranslations("Dashboard.Support")

  return (
    <PageWrapper id="DashboardSupportPage" disableScrollInMobile>
      <SupportSectionHeader title={t("Title")} description={t("Description")} />
      <div className="grid gap-5 lg:gap-6 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3">
        <SupportCategoryCard
          title={t("Started.Title")}
          description={t("Started.Description")}
          icon={Play}
          link={"/dashboard/support/help-started"}
          highlight
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
          highlight
        />
        <SupportCategoryCard
          title={t("Blogs.Title")}
          description={t("Blogs.Description")}
          icon={Newspaper}
          link={"/dashboard/support/help-blogs"}
        />
      </div>
      <Separator />
      <SupportSectionHeader
        title={t("FAQs.Title")}
        description={t("FAQs.Description")}
      />
      <SupportFAQWrapper>
        <SupportFAQItem
          question={t("FAQs.Q1.Question")}
          answer={t("FAQs.Q1.Answer")}
        />
        <SupportFAQItem
          question={t("FAQs.Q2.Question")}
          answer={t("FAQs.Q2.Answer")}
        />
        <SupportFAQItem
          question={t("FAQs.Q3.Question")}
          answer={t("FAQs.Q3.Answer")}
        />
      </SupportFAQWrapper>
    </PageWrapper>
  )
}
