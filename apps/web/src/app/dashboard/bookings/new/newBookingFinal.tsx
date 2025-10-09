import { PGrey } from "@/components/typography";
import { useTranslations } from "next-intl";
import z from "zod";
import { NewBookingFormDataType } from "./newBookingCommon";

type NewBookingFinalProps = {
  onPrev: () => void;
  newBookingFormData: NewBookingFormDataType;
};
export default function NewBookingFinal(props: NewBookingFinalProps) {
  const t = useTranslations("Dashboard.NewBooking.Form.Final");

  return (
    <div id="FinalSection">
      <PGrey>{t("Title")}</PGrey>
      <div id="finalRate"></div>
      <div id="finalAllowance"></div>
      <div id="finalCommission"></div>
      <div id="finalPrice"></div>
    </div>
  );
}
