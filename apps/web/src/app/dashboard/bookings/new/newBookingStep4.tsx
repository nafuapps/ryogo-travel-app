import { PGrey } from "@/components/typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import z from "zod";
import { NewBookingFormDataType } from "./newBookingCommon";

type NewBookingStep4Props = {
  onNext: () => void;
  onPrev: () => void;
  newBookingFormData: NewBookingFormDataType;
  setNewBookingFormData: React.Dispatch<
    React.SetStateAction<NewBookingFormDataType>
  >;
};
export default function NewBookingStep4(props: NewBookingStep4Props) {
  const t = useTranslations("Dashboard.NewBooking.Form.Step4");

  const step4Schema = z.object({
    //Cost
    selectedRatePerKm: z.number(),
    selectedAllowancePerDay: z.number(),
    selectedAcChargePerDay: z.number(),
    selectedCommissionRate: z.number(),
  });

  type Step4Type = z.infer<typeof step4Schema>;

  //Form init
  const form = useForm<Step4Type>({
    resolver: zodResolver(step4Schema),
    defaultValues: {},
  });

  //Form submit
  function onSubmit(values: Step4Type) {
    // Do something with the form values.
    console.log(values);
  }

  return (
    <div id="CostSection">
      <PGrey>{t("Title")}</PGrey>
      <div id="rateInput"></div>
      <div id="allowanceInput"></div>
      <div id="commissionInput"></div>
    </div>
  );
}
