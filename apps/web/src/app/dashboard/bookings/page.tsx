//All Bookings page

import { mainClassName } from "@/components/page/pageCommons";
import BookingsPageComponent from "./bookings";
import DashboardHeader from "../components/extra/dashboardHeader";

export default function BookingsPage() {
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/bookings"} />
      <BookingsPageComponent />;
    </div>
  );
}
