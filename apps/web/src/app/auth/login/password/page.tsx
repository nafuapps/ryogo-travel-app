//Login password page
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
import { H2, H5 } from "@/components/typography";
import Link from "next/link";
import { redirect, RedirectType, useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { apiClient } from "@/lib/apiClient";
import { LoginPasswordResponseAPIType } from "@ryogo-travel-app/api/types/user.types";

// TODO: Add a feature to show the user had recently reset password

const userRegex = z.string().length(8).startsWith("U");
const phoneRegex = z
  .string()
  .length(10)
  .regex(/^[0-9]+$/);

export default function LoginPasswordPage() {
  const searchParams = useSearchParams();
  const userId = searchParams.get("user");
  const phoneNumber = searchParams.get("phone");

  if (
    !userRegex.safeParse(userId).success ||
    !phoneRegex.safeParse(phoneNumber).success
  ) {
    redirect("/auth/login", RedirectType.replace);
  }

  const t = useTranslations("Auth.LoginPage.Step3");
  const formSchema = z.object({
    password: z.string().min(8, t("Error1")),
  });

  type FormFields = z.infer<typeof formSchema>;

  const router = useRouter();

  // For managing form data and validation
  const methods = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  });

  //Submit actions
  const onSubmit = async (data: FormFields) => {
    console.log({ data });
    const loginResponse = await apiClient<LoginPasswordResponseAPIType>(
      "/api/auth/login/password",
      {
        method: "POST",
        body: JSON.stringify({ userId: userId, password: data.password }),
      }
    );
    if (loginResponse.isLoginSuccess) {
      //Login user
      console.log("Login success:", data);
      //Redirect to dashboard
      redirect("/dashboard/home", RedirectType.replace);
    } else {
      // Show error
      methods.setError("password", { type: "manual", message: t("APIError") });
    }
  };

  return (
    <div id="LoginPasswordPage" className="gap-4 w-full h-full">
      <Form {...methods}>
        <form
          id="LoginPasswordForm"
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex flex-col justify-between  h-full"
        >
          <H2>{t("PageTitle")}</H2>
          <FormField
            control={methods.control}
            name={"password"}
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <H5>{t("Input.Title")}</H5>
                </FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder={t("Input.Placeholder")}
                    {...field}
                  />
                </FormControl>
                <FormDescription>{t("Input.Description")}</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div id="LoginPasswordActions" className="flex flex-col gap-4 w-full">
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
            <Button variant={"link"}>
              <Link
                href={`/auth/forgot-password/confirm-email?user=${userId}&phone=${phoneNumber}`}
              >
                {t("ForgotCTA")}
              </Link>
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
