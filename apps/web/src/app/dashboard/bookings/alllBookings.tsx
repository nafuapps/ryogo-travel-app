import { pageClassName } from "@/components/page/pageCommons";
import { getTranslations } from "next-intl/server";
import BookingsSwitchComponent from "../components/bookingsSwitchComponent";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs";
import { H5 } from "@/components/typography";

const tabClassName = `flex flex-row px-2 lg:px-3 py-1.5 lg:py-2 rounded data-[state=inactive]:border-slate-200 data-[state=inactive]:hover:bg-slate-200 data-[state=active]:bg-white data-[state=active]:border-white data-[state=active]:shadow`;

export default async function AllBookingsComponent() {
  const t = await getTranslations("Dashboard.Bookings");

  return (
    <div id="AllBookingsPage" className={pageClassName}>
      <div id="BookingsTabs" className="flex flex-row flex-wrap gap-3 lg:gap-4">
        <Tabs
          defaultValue="Ongoing"
          className=" bg-slate-200 rounded p-1 mg:p-1.5"
        >
          <TabsList className="flex flex-row gap-2 lg:gap-3 items-center">
            <TabsTrigger value="Ongoing" className={tabClassName}>
              {t("Switches.Ongoing")}
              <div className="flex rounded bg-slate-200 px-2 py-1 lg:px-3 lg:py-2">
                <H5>{7}</H5>
              </div>
            </TabsTrigger>
            <TabsTrigger value="Upcoming" className={tabClassName}>
              {t("Switches.Upcoming")}
            </TabsTrigger>
            <TabsTrigger value="Completed" className={tabClassName}>
              {t("Switches.Completed")}
            </TabsTrigger>
            <TabsTrigger value="Open" className={tabClassName}>
              {t("Switches.Open")}
            </TabsTrigger>
          </TabsList>
          <TabsContent value="Ongoing"></TabsContent>
          <TabsContent value="Upcoming"></TabsContent>
          <TabsContent value="Completed"></TabsContent>
          <TabsContent value="Open"></TabsContent>
        </Tabs>
        {/* <BookingsSwitchComponent
          title={t("Switches.Ongoing")}
          number={7}
          isActive
        />
        <BookingsSwitchComponent title={t("Switches.Completed")} number={8} />
        <BookingsSwitchComponent title={t("Switches.Upcoming")} number={7} />
        <BookingsSwitchComponent title={t("Switches.Open")} number={8} /> */}
      </div>
    </div>
  );
}
