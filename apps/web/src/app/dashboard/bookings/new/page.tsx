//Bookings/new page

import { mainClassName } from "@/components/page/pageCommons";
import NewBookingPageComponent from "./newBooking";
import DashboardHeader from "../../components/extra/dashboardHeader";

export default function NewBookingPage() {
  return (
    <div className={mainClassName}>
      <DashboardHeader pathName={"/dashboard/bookings/new"} />
      <NewBookingPageComponent />
    </div>
  );
}
