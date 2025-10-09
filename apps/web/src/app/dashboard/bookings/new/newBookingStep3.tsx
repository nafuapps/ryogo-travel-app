import { PGrey } from "@/components/typography";
import { DriverRegex, VehicleRegex } from "@/lib/regex";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import z from "zod";
import { NewBookingFormDataType } from "./newBookingCommon";

type NewBookingStep3Props = {
  onNext: () => void;
  onPrev: () => void;
  newBookingFormData: NewBookingFormDataType;
  setNewBookingFormData: React.Dispatch<
    React.SetStateAction<NewBookingFormDataType>
  >;
};
export default function NewBookingStep3(props: NewBookingStep3Props) {
  const t = useTranslations("Dashboard.NewBooking.Form.Step3");

  const step3Schema = z.object({
    //Assignment
    assignedDriverId: DriverRegex,
    assignedVehicleId: VehicleRegex,
  });

  type Step3Type = z.infer<typeof step3Schema>;

  //Form init
  const form = useForm<Step3Type>({
    resolver: zodResolver(step3Schema),
    defaultValues: {},
  });

  //Form submit
  function onSubmit(values: Step3Type) {
    // Do something with the form values.
    console.log(values);
  }

  return (
    <div id="AssignmentSection">
      <PGrey>{t("Title")}</PGrey>
      <div id="vehicleAssignment"></div>
      <div id="driverAssignment"></div>
    </div>
  );
}
