import { CaptionGrey, H4, SmallGrey } from "@/components/typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import z from "zod";
import {
  newBookingFormClassName,
  NewBookingFormDataType,
  newBookingHeaderClassName,
  newBookingHeaderLineClassName,
  newBookingSectionClassName,
  NewBookingTotalSteps,
} from "./newBookingCommon";
import NewBookingStepsTracker from "./newBookingStepsTracker";
import { Form } from "@/components/ui/form";
import { DashboardInput } from "@/components/form/dashboardFormFields";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useCallback, useEffect } from "react";
import { apiClient } from "@ryogo-travel-app/api/client/apiClient";
import { NewBookingGetRouteAPIResponseType } from "@ryogo-travel-app/api/types/route.types";
import NewBookingTripInfo from "./newBookingTripInfo";

const getRoute = async (data: NewBookingFormDataType) => {
  const route = await apiClient<NewBookingGetRouteAPIResponseType>(
    `/api/new-booking/get-route?sourceCity=${data.tripSourceLocationCity}&sourceState=${data.tripSourceLocationState}&destinationCity=${data.tripDestinationLocationCity}&destinationState=${data.tripDestinationLocationState}`,
    {
      method: "GET",
    }
  );
  return route;
};

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
    selectedRatePerKm: z.coerce
      .number<number>(t("Field1.Error1"))
      .min(1, t("Field1.Error2"))
      .max(50, t("Field1.Error3"))
      .positive(t("Field1.Error4"))
      .multipleOf(1, t("Field1.Error5")),
    selectedAllowancePerDay: z.coerce
      .number<number>(t("Field2.Error1"))
      .min(0, t("Field2.Error2"))
      .max(10000, t("Field2.Error3"))
      .nonnegative(t("Field2.Error4"))
      .multipleOf(1, t("Field2.Error5")),
    selectedAcChargePerDay: z.coerce
      .number<number>(t("Field3.Error1"))
      .min(0, t("Field3.Error2"))
      .max(10000, t("Field3.Error3"))
      .nonnegative(t("Field3.Error4"))
      .multipleOf(1, t("Field3.Error5"))
      .optional(),
    selectedCommissionRate: z.coerce
      .number<number>(t("Field4.Error1"))
      .min(0, t("Field4.Error2"))
      .max(100, t("Field4.Error3"))
      .nonnegative(t("Field4.Error4"))
      .multipleOf(1, t("Field4.Error5")),
    selectedDistance: z.coerce
      .number<number>(t("Field5.Error1"))
      .min(1, t("Field5.Error2"))
      .max(3000, t("Field5.Error3"))
      .positive(t("Field5.Error4"))
      .multipleOf(1, t("Field5.Error5")),
  });

  type Step4Type = z.infer<typeof step4Schema>;

  //Form init
  const form = useForm<Step4Type>({
    resolver: zodResolver(step4Schema),
    defaultValues: {
      selectedRatePerKm: props.newBookingFormData.selectedRatePerKm,
      selectedAllowancePerDay: props.newBookingFormData.selectedAllowancePerDay,
      selectedAcChargePerDay: props.newBookingFormData.selectedAcChargePerDay,
      selectedCommissionRate: props.newBookingFormData.selectedCommissionRate,
      selectedDistance: props.newBookingFormData.selectedDistance,
    },
  });

  const setValue = form.setValue;
  const fetchData = useCallback(async () => {
    if (!props.newBookingFormData.routeId) {
      getRoute(props.newBookingFormData).then((res) => {
        if (res) {
          props.setNewBookingFormData({
            ...props.newBookingFormData,
            routeId: res.id,
            sourceId: res.sourceId,
            destinationId: res.destinationId,
            selectedDistance: res.distance,
          });
          setValue("selectedDistance", res.distance);
        }
      });
    }
  }, [props, setValue]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  //Form submit
  function onSubmit(values: Step4Type) {
    props.setNewBookingFormData({
      ...props.newBookingFormData,
      selectedRatePerKm: values.selectedRatePerKm,
      selectedAllowancePerDay: values.selectedAllowancePerDay,
      selectedAcChargePerDay: values.selectedAcChargePerDay,
      selectedCommissionRate: values.selectedCommissionRate,
      selectedDistance: values.selectedDistance,
    });
    props.onNext();
  }

  return (
    <div id="CostSection" className={newBookingSectionClassName}>
      <div id="CostHeader" className={newBookingHeaderClassName}>
        <div className={newBookingHeaderLineClassName}>
          <H4>{t("Title")}</H4>
          <CaptionGrey>{t("Subtitle")}</CaptionGrey>
        </div>
        <NewBookingStepsTracker total={NewBookingTotalSteps} current={3} />
        <SmallGrey>{t("Description")}</SmallGrey>
      </div>
      <Form {...form}>
        <form
          id="Step4Form"
          onSubmit={form.handleSubmit(onSubmit)}
          className={newBookingFormClassName}
        >
          <NewBookingTripInfo {...props.newBookingFormData} />
          <DashboardInput
            name="selectedDistance"
            label={t("Field5.Title")}
            placeholder={t("Field5.Placeholder")}
            description={t("Field5.Description")}
            type="tel"
            disabled={props.newBookingFormData.routeId ? true : false}
          />
          <DashboardInput
            name="selectedRatePerKm"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
            type="tel"
          />
          <DashboardInput
            name="selectedAllowancePerDay"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description")}
            type="tel"
          />
          <DashboardInput
            name="selectedAcChargePerDay"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
            type="tel"
            disabled={props.newBookingFormData.tripNeedsAC === false}
          />
          <DashboardInput
            name="selectedCommissionRate"
            label={t("Field4.Title")}
            placeholder={t("Field4.Placeholder")}
            description={t("Field4.Description")}
            type="tel"
          />
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
