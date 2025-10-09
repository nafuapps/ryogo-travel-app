import { PGrey } from "@/components/typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { NewBookingFormDataType } from "./newBookingCommon";

type NewBookingStep2Props = {
  onNext: () => void;
  onPrev: () => void;
  newBookingFormData: NewBookingFormDataType;
  setNewBookingFormData: React.Dispatch<
    React.SetStateAction<NewBookingFormDataType>
  >;
};
export default function NewBookingStep2(props: NewBookingStep2Props) {
  const t = useTranslations("Dashboard.NewBooking.Form.Step2");
  const [sourceId, setSourceId] = useState<string | null>(null);
  const [destinationId, setDestinationId] = useState<string | null>(null);

  const step2Schema = z.object({
    //Trip
    tripSourceLocation: z.string(),
    tripDestinationLocation: z.string(),
    tripStartDate: z.string(),
    tripEndDate: z.string(),
    tripType: z.enum(["One Way", "Round Trip", "Multi Day Tour"]),
    tripPassengers: z.number(),
    tripNeedsAC: z.boolean(),
  });

  type Step2Type = z.infer<typeof step2Schema>;

  //Form init
  const form = useForm<Step2Type>({
    resolver: zodResolver(step2Schema),
    defaultValues: {},
  });

  //Form submit
  function onSubmit(values: Step2Type) {
    // Do something with the form values.
    console.log(values);
  }

  return (
    <div id="TripSection">
      <PGrey>{t("Title")}</PGrey>
      <div id="routeSelection"></div>
      <div id="dateSelection"></div>
      <div id="typeSelection"></div>
      <div id="passengerPreference"></div>
    </div>
  );
}
