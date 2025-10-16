import { CaptionGrey, H4, H5, Small, SmallGrey } from "@/components/typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { NewBookingFormDataType } from "./newBookingCommon";
import NewBookingStepsTracker from "./newBookingStepsTracker";
import {
  DashboardInput,
  DashboardSelect,
} from "@/components/form/dashboardFormFields";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { apiClient } from "@ryogo-travel-app/api/client/apiClient";
import { NewBookingFindCustomerAPIResponseType } from "@ryogo-travel-app/api/types/customer.types";
import stateCityData from "@/lib/states_cities.json";
import { LucideInfo, LucideUserCheck } from "lucide-react";
import { PhoneRegex } from "@/lib/regex";
import { Alert } from "@/components/ui/alert";

type NewBookingStep1Props = {
  onNext: () => void;
  newBookingFormData: NewBookingFormDataType;
  setNewBookingFormData: React.Dispatch<
    React.SetStateAction<NewBookingFormDataType>
  >;
  agencyId: string;
};
export default function NewBookingStep1(props: NewBookingStep1Props) {
  const t = useTranslations("Dashboard.NewBooking.Form.Step1");
  const [existingCustomer, setExistingCustomer] =
    useState<NewBookingFindCustomerAPIResponseType>(null);
  const [customerNotFound, setCustomerNotFound] = useState<string | null>(
    props.newBookingFormData.customerName ? "" : null
  );

  const step1Schema = z.object({
    //Customer
    customerPhone: PhoneRegex,
    newCustomerName: z
      .string()
      .refine((s) => {
        return existingCustomer || s.length > 5;
      }, t("Field2.Error1"))
      .optional(),
    newCustomerState: z
      .string()
      .refine((s) => {
        return existingCustomer || s != "";
      }, t("Field3.Error1"))
      .optional(),
    newCustomerCity: z
      .string()
      .refine((s) => {
        return existingCustomer || s != "";
      }, t("Field4.Error1"))
      .optional(),
  });

  type Step1Type = z.infer<typeof step1Schema>;

  //Form init
  const form = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      customerPhone: props.newBookingFormData.customerPhone,
      newCustomerName: props.newBookingFormData.customerName,
      newCustomerState: props.newBookingFormData.customerLocationState,
      newCustomerCity: props.newBookingFormData.customerLocationCity,
    },
  });

  //Form submit
  function onSubmit(values: Step1Type) {
    props.setNewBookingFormData({
      ...props.newBookingFormData,
      customerPhone: values.customerPhone,
      customerId: existingCustomer?.id,
      customerName: values.newCustomerName,
      customerLocationState: values.newCustomerState,
      customerLocationCity: values.newCustomerCity,
    });
    props.onNext();
  }

  //Find customer
  const findCustomer = async () => {
    if (!PhoneRegex.safeParse(form.getValues("customerPhone")).success) {
      form.setError("customerPhone", {
        type: "manual",
        message: t("Field1.Error1"),
      });
      return;
    }
    const existingCustomer =
      await apiClient<NewBookingFindCustomerAPIResponseType>(
        `/api/new-booking/find-customer?phone=${form.getValues(
          "customerPhone"
        )}&agencyId=${props.agencyId}`,
        { method: "GET" }
      );
    setExistingCustomer(existingCustomer);
    if (!existingCustomer) {
      setCustomerNotFound(t("CustomerNotFound"));
    } else {
      setCustomerNotFound(null);
    }
  };

  const data: Record<string, string[]> = stateCityData;
  const selectedState = form.watch("newCustomerState");
  const cityOptions = selectedState ? data[selectedState] : [];
  const setValue = form.setValue;

  const isFirstRender = useRef(true);

  useEffect(() => {
    // Skip on the initial render of the component
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    setValue("newCustomerCity", ""); // Reset the city dropdown's value when the state dropdown changes
  }, [selectedState, setValue]);

  return (
    <div id="CustomerSection" className="flex flex-col gap-5 lg:gap-6">
      <div id="CustomerHeader" className="flex flex-col gap-2 lg:gap-3">
        <div className="flex flex-row justify-between items-end gap-2 lg:gap-3">
          <H4>{t("Title")}</H4>
          <CaptionGrey>{t("Subtitle")}</CaptionGrey>
        </div>
        <NewBookingStepsTracker total={4} current={0} />
        <SmallGrey>{t("Description")}</SmallGrey>
      </div>
      <Form {...form}>
        <form
          id="Step1Form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-4 lg:gap-5 "
        >
          <div id="FindCustomer" className="flex flex-col gap-3 lg:gap-4">
            <DashboardInput
              name="customerPhone"
              label={t("Field1.Title")}
              placeholder={t("Field1.Placeholder")}
              type="tel"
            />
            <Button
              variant={
                existingCustomer || customerNotFound ? "outline" : "default"
              }
              size={"lg"}
              type="button"
              onClick={findCustomer}
              className="flex flex-row justify-center items-center gap-4 w-full"
            >
              {t("FindCTA")}
            </Button>
            {existingCustomer && (
              <div
                id="ExistingCustomer"
                className="flex flex-row gap-3 lg:gap-4 bg-white border border-slate-100 rounded-lg p-3 lg:p-4"
              >
                <div className="flex rounded-full size-10 lg:size-12 bg-slate-100 justify-center items-center">
                  <LucideUserCheck className="text-slate-500 stroke-1 size-6 lg:size-7" />
                </div>
                <div className="flex flex-col gap-0.5 lg:gap-1 items-start">
                  <H5>{existingCustomer.name}</H5>
                  <SmallGrey>{existingCustomer.remarks}</SmallGrey>
                  <CaptionGrey>{existingCustomer.location}</CaptionGrey>
                </div>
              </div>
            )}
          </div>
          {customerNotFound && (
            <div id="NewCustomer" className="flex flex-col gap-3 lg:gap-4">
              <Alert>
                <LucideInfo className="size-8 lg:size-10 text-amber-300" />
                <Small>{t("CustomerNotFound")}</Small>
              </Alert>
              <DashboardInput
                name={"newCustomerName"}
                type="text"
                label={t("Field2.Title")}
                placeholder={t("Field2.Placeholder")}
              />
              <DashboardSelect
                name={"newCustomerState"}
                register={form.register("newCustomerState")}
                title={t("Field3.Title")}
                array={Object.keys(data)}
                placeholder={t("Field3.Title")}
              />
              <DashboardSelect
                name={"newCustomerCity"}
                register={form.register("newCustomerCity")}
                title={t("Field4.Title")}
                array={cityOptions}
                placeholder={t("Field4.Title")}
              />
            </div>
          )}
          {(existingCustomer || customerNotFound) && (
            <Button
              variant={"default"}
              size={"lg"}
              type="submit"
              disabled={form.formState.isSubmitting}
            >
              {form.formState.isSubmitting && <Spinner />}
              {form.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
            </Button>
          )}
        </form>
      </Form>
    </div>
  );
}
