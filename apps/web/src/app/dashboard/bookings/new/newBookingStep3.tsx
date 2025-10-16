import { H4, PBold, SmallGrey, Caption } from "@/components/typography";
import { DriverRegex, VehicleRegex } from "@/lib/regex";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  NewBookingFindDriversType,
  NewBookingFindVehiclesType,
  NewBookingFormDataType,
} from "./newBookingCommon";
import NewBookingStepsTracker from "./newBookingStepsTracker";
import { Form } from "@/components/ui/form";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "@/components/ui/button";
import VehicleTile from "./newBookingVehicleTile";
import DriverTile from "./newBookingDriverTile";

type NewBookingStep3Props = {
  onNext: () => void;
  onPrev: () => void;
  newBookingFormData: NewBookingFormDataType;
  setNewBookingFormData: React.Dispatch<
    React.SetStateAction<NewBookingFormDataType>
  >;
  vehicles: NewBookingFindVehiclesType;
  drivers: NewBookingFindDriversType;
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
    defaultValues: {
      assignedDriverId: props.newBookingFormData.assignedDriverId,
      assignedVehicleId: props.newBookingFormData.assignedVehicleId,
    },
  });

  //Form submit
  function onSubmit(values: Step3Type) {
    props.setNewBookingFormData({
      ...props.newBookingFormData,
      assignedDriverId: values.assignedDriverId,
      assignedVehicleId: values.assignedVehicleId,
    });
    props.onNext();
  }

  return (
    <div id="AssignmentSection" className="flex flex-col gap-5 lg:gap-6">
      <div id="AssignmentHeader" className="flex flex-col gap-2 lg:gap-3">
        <div className="flex flex-row justify-between items-end gap-2 lg:gap-3">
          <H4>{t("Title")}</H4>
          <Caption>{t("Subtitle")}</Caption>
        </div>
        <NewBookingStepsTracker total={4} current={2} />
        <SmallGrey>{t("Description")}</SmallGrey>
      </div>
      <Form {...form}>
        <form
          id="Step3Form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 lg:gap-5 "
        >
          <PBold>{t("Vehicle.Title")}</PBold>
          <div
            id="vehicleAssignment"
            className="grid grid-cols-1 xl:grid-cols-2 gap-2 lg:gap-3"
          >
            {props.vehicles
              .sort(
                (a, b) => a.assignedBookings.length - b.assignedBookings.length
              )
              .map((vehicle, index) => (
                <VehicleTile
                  key={index}
                  vehicleData={vehicle}
                  newBookingFormData={props.newBookingFormData}
                  setValue={form.setValue}
                />
              ))}
          </div>
          <PBold>{t("Driver.Title")}</PBold>
          <div
            id="driverAssignment"
            className="grid grid-cols-1 xl:grid-cols-2 gap-2 lg:gap-3"
          >
            {props.drivers.map((driver, index) => (
              <DriverTile
                key={index}
                driverData={driver}
                newBookingFormData={props.newBookingFormData}
                setValue={form.setValue}
              />
            ))}
          </div>
          <Button
            variant={"default"}
            size={"lg"}
            type="submit"
            disabled={form.formState.isSubmitting}
          >
            {form.formState.isSubmitting && <Spinner />}
            {form.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          </Button>
          <Button
            variant={"outline"}
            size={"lg"}
            type="button"
            onClick={props.onPrev}
            disabled={form.formState.isSubmitting}
          >
            {t("Back")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
