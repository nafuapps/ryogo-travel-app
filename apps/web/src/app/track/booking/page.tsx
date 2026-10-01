import { Metadata } from "next"
import { pageDescription, pageTitle } from "@/components/page/pageCommons"
import TrackBookingPageComponent from "./trackBooking"
import TrackHeader from "@/components/header/trackHeader"
import { MainWrapper } from "@/components/page/pageWrappers"

export const metadata: Metadata = {
  title: `Track Booking - ${pageTitle}`,
  description: pageDescription,
}

export default async function TrackBookingPage() {
  return (
    <MainWrapper>
      <TrackHeader pathName={"/track/booking"} />
      <TrackBookingPageComponent />
    </MainWrapper>
  )
}
