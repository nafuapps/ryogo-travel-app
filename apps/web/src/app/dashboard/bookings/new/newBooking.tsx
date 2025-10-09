import { pageClassName } from "@/components/page/pageCommons";
import NewBookingForm from "./newBookingForm";

export default async function NewBookingPageComponent() {
  //Get agency Data (for commission rate)
  //Get vehicle Data with their bookings and repairs (for available vehicles and rate per km)
  //Get driver Data with theri bookings and leaves (for available drivers and allowance per day)

  //Get locations (for source and destination) - from json or db?
  //Get distance (from existing routes or Google Maps API?)

  return (
    <div id="NewBookingPage" className={pageClassName}>
      <NewBookingForm />
    </div>
  );
}
