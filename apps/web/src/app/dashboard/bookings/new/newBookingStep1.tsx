import { PGrey } from "@/components/typography";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { NewBookingFormDataType } from "./newBookingCommon";

type NewBookingStep1Props = {
  onNext: () => void;
  newBookingFormData: NewBookingFormDataType;
  setNewBookingFormData: React.Dispatch<
    React.SetStateAction<NewBookingFormDataType>
  >;
};
export default function NewBookingStep1(props: NewBookingStep1Props) {
  const t = useTranslations("Dashboard.NewBooking.Form.Step1");
  const [customerId, setCustomerId] = useState<string | null>(null);

  const step1Schema = z.object({
    //Customer
    customerPhone: z.string().nonoptional(),
    newCustomerName: z.string().refine((s) => {
      if (!customerId && s == "") return true;
    }, "Name is required"),
    newCustomerLocation: z.string().refine((s) => {
      if (!customerId && s == "") return true;
    }, "Name is required"),
  });

  type Step1Type = z.infer<typeof step1Schema>;

  //Form init
  const form = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
    defaultValues: {},
  });

  //Form submit
  function onSubmit(values: Step1Type) {
    // Do something with the form values.
    console.log(values);
  }

  return (
    <div id="CustomerSection" className="flex flex-col ">
      <PGrey>{t("Title")}</PGrey>
      <div id="findCustomer"></div>
      <div id="newCustomer"></div>
    </div>
  );
}
