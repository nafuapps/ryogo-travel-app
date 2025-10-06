//Confirm Email page
"use client";

import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { H2, H5, PGrey } from "@/components/typography";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { apiClient } from "@ryogo-travel-app/api/client/apiClient";
import { ResetPasswordAPIResponseType } from "@ryogo-travel-app/api/types/user.types";

type ConfirmEmailPageComponentProps = {
  userId: string;
};
export default function ConfirmEmailPageComponent(
  props: ConfirmEmailPageComponentProps
) {
  const userId = props.userId;

  const t = useTranslations("Auth.ForgotPasswordPage.Step2");
  const formSchema = z.object({
    email: z.email(t("Error1")),
  });

  type FormFields = z.infer<typeof formSchema>;

  const router = useRouter();
  // For managing form data and validation
  const methods = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  //Submit actions
  const onSubmit = async (data: FormFields) => {
    // Try Reset password
    const resetSuccess = await apiClient<ResetPasswordAPIResponseType>(
      "/api/auth/reset",
      {
        method: "POST",
        body: JSON.stringify({ userId: userId, email: data.email }),
      }
    );
    if (resetSuccess.id) {
      //Redirect to success page
      router.replace("/auth/forgot-password/success");
    } else {
      // Show error
      methods.setError("email", { type: "manual", message: t("APIError") });
    }
  };

  return (
    <div id="ConfirmEmailPage" className="gap-4 w-full h-full">
      <Form {...methods}>
        <form
          id="ConfirmEmailForm"
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col justify-between  h-full"
        >
          <H2>{t("PageTitle")}</H2>
          <FormField
            control={methods.control}
            name={"email"}
            render={({ field }) => (
              <FormItem>
                <PGrey>{t("Info")}</PGrey>
                <FormLabel>
                  <H5>{t("Input.Title")}</H5>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder={t("Input.Placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t("Input.Description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div id="ConfirmEmailActions" className="flex flex-col gap-4 w-full">
            <Button
              variant={"default"}
              size={"lg"}
              disabled={methods.formState.isSubmitting}
            >
              {methods.formState.isSubmitting && (
                <Loader2Icon className="animate-spin" />
              )}
              {methods.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
            </Button>
            <Button
              variant={"secondary"}
              type="button"
              onClick={() => {
                router.back();
              }}
            >
              {t("Back")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
