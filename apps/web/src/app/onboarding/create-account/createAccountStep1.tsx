import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { Dispatch, SetStateAction } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { OnboardingInput } from "../components/onboardingFields";
import { OnboardingStepForm, OnboardingStepContent, OnboardingStepActions, OnboardingStepPrimaryAction } from "../components/onboardingSteps";
import { CreateAccountFinalDataType } from "../components/finalDataTypes";
import { Form } from "@/components/ui/form";

export function CreateAccountStep1(props: {
  onNext: () => void,
  finalData: CreateAccountFinalDataType,
  updateFinalData: Dispatch<SetStateAction<CreateAccountFinalDataType>>
}) {
  const t = useTranslations('Onboarding.CreateAccountPage.Step1');
  const step1Schema = z.object({
    agencyName: z.string().min(5, t("Field1.Error1")).max(30, t('Field1.Error2')),
    ownerName: z.string().min(5, t("Field2.Error1")).max(30, t('Field2.Error2')),
    ownerPhone: z.string().length(10, t('Field3.Error1')),
    ownerEmail: z.email(t('Field4.Error1')).max(60, t('Field4.Error2')),
  })
  type Step1Type = z.infer<typeof step1Schema>
  const formData = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      agencyName: props.finalData.agencyName,
      ownerName: props.finalData.ownerName,
      ownerPhone: props.finalData.ownerPhone,
      ownerEmail: props.finalData.ownerEmail,
    }
  });

  //Submit actions
  const onSubmit = (data: Step1Type) => {
    props.updateFinalData({ ...props.finalData, agencyName: data.agencyName, ownerName: data.ownerName, ownerPhone: data.ownerPhone, ownerEmail: data.ownerEmail });
    props.onNext();
  };

  return <Form {...formData}>
    <OnboardingStepForm formId="Step1Form" submit={formData.handleSubmit(onSubmit)}>
      <OnboardingStepContent contentId="Step1Content">
        <OnboardingInput name={"agencyName"} type="text" label={t("Field1.Title")} placeholder={t("Field1.Placeholder")} description={t("Field1.Description")} />
        <OnboardingInput name={"ownerName"} type="text" label={t("Field2.Title")} placeholder={t("Field2.Placeholder")} description={t("Field2.Description")} />
        <OnboardingInput name={"ownerPhone"} type="tel" label={t("Field3.Title")} placeholder={t("Field3.Placeholder")} description={t("Field3.Description")} />
        <OnboardingInput name={"ownerEmail"} type="email" label={t("Field4.Title")} placeholder={t("Field4.Placeholder")} description={t("Field4.Description")} />
      </OnboardingStepContent>
      <OnboardingStepActions actionsId='Step1Actions'>
        <OnboardingStepPrimaryAction disabled={formData.formState.isSubmitting}>
          {formData.formState.isSubmitting && <Loader2Icon className='animate-spin' />}
          {formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
        </OnboardingStepPrimaryAction>
      </OnboardingStepActions>
    </OnboardingStepForm>
  </Form>
}