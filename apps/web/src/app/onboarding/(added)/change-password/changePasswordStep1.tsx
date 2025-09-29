import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2Icon } from "lucide-react";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import z from "zod";
import { OnboardingInput } from "../../components/onboardingFields";
import {
  OnboardingStepForm,
  OnboardingStepContent,
  OnboardingStepActions,
  OnboardingStepPrimaryAction,
} from "../../components/onboardingSteps";
import { Form } from "@/components/ui/form";
import { apiClient } from "@/lib/apiClient";
import { OnboardingChangePasswordAPIResponseType } from "@ryogo-travel-app/api/types/user.types";
import { redirect, RedirectType } from "next/navigation";
import { toast } from "sonner";

export function ChangePasswordStep1(props: { userId: string; role: string }) {
  const t = useTranslations("Onboarding.ChangePasswordPage.Step1");
  const step1Schema = z
    .object({
      oldPassword: z
        .string()
        .min(8, t("Field1.Error1"))
        .refine((s) => !s.includes(" "), t("Field1.Error2")),
      newPassword: z
        .string()
        .min(8, t("Field1.Error1"))
        .refine((s) => !s.includes(" "), t("Field2.Error2")),
      confirmPassword: z
        .string()
        .min(8, t("Field2.Error1"))
        .refine((s) => !s.includes(" "), t("Field3.Error2")),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("Field3.Error3"),
      path: ["confirmPassword"], // path of error
    });
  type Step1Type = z.infer<typeof step1Schema>;
  const formData = useForm<Step1Type>({
    resolver: zodResolver(step1Schema),
    defaultValues: {
      oldPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  //Submit actions
  const onSubmit = async (data: Step1Type) => {
    //Change password in DB
    const result = await apiClient<OnboardingChangePasswordAPIResponseType>(
      `/api/onboarding/change-password/${props.userId}`,
      {
        method: "POST",
        body: JSON.stringify({
          oldPassword: data.oldPassword,
          newPassword: data.newPassword,
        }),
      }
    );
    if (result.id) {
      //If success, redirect
      toast.success(t("Success"));
      if (props.role === "driver") {
        redirect("/rider", RedirectType.replace);
      } else {
        redirect("/dashboard", RedirectType.replace);
      }
    } else {
      //If failed, show error
      formData.setError("oldPassword", {
        type: "manual",
        message: t("APIError"),
      });
      // formData.reset();
    }
  };

  return (
    <Form {...formData}>
      <OnboardingStepForm
        formId="Step1Form"
        submit={formData.handleSubmit(onSubmit)}
      >
        <OnboardingStepContent contentId="Step4Content">
          <OnboardingInput
            name={"oldPassword"}
            type="password"
            label={t("Field1.Title")}
            placeholder={t("Field1.Placeholder")}
            description={t("Field1.Description")}
          />
          <OnboardingInput
            name={"newPassword"}
            type="password"
            label={t("Field2.Title")}
            placeholder={t("Field2.Placeholder")}
            description={t("Field2.Description")}
          />
          <OnboardingInput
            name={"confirmPassword"}
            type="password"
            label={t("Field3.Title")}
            placeholder={t("Field3.Placeholder")}
            description={t("Field3.Description")}
          />
        </OnboardingStepContent>
        <OnboardingStepActions actionsId="Step1Actions">
          <OnboardingStepPrimaryAction
            disabled={formData.formState.isSubmitting}
          >
            {formData.formState.isSubmitting && (
              <Loader2Icon className="animate-spin" />
            )}
            {formData.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          </OnboardingStepPrimaryAction>
        </OnboardingStepActions>
      </OnboardingStepForm>
    </Form>
  );
}
