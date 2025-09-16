//Forgot password page
'use client'

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { H2, H5, H5Grey } from "@/components/typography";
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';


export default function ForgotPasswordPage() {

  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get('phone');

  const t = useTranslations('Auth.ForgotPasswordPage.Step1');
  const formSchema = z.object({
    phoneNumber: z.string().length(10, t('Error1')).regex(/^[0-9]+$/, t('Error2'))
  })

  type FormFields = z.infer<typeof formSchema>

  const router = useRouter();

  const methods = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: phoneNumber ?? "",
    },
  },
  )

  //Submit actions
  const onSubmit = (data: FormFields) => {
    console.log({ data });
    // TODO: Find phone number in DB
    if (data.phoneNumber == "1234567890") {
      // If found, go to password page
      router.push("/forgot-password/confirm-email?phone=" + data.phoneNumber)

    } else {
      // else, Show error
      methods.setError("phoneNumber", { type: "manual", message: t("APIError") });
    }
  };

  return <div id="ForgotPasswordPage" className="gap-4 w-full h-full">
    <Form {...methods}>
      <form id="ForgotPasswordForm" onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col justify-between  h-full">
        <H2>{t("PageTitle")}</H2>
        <div>
          <H5Grey>{t("Info")}</H5Grey>
          <FormField
            control={methods.control}
            name={"phoneNumber"}
            render={({ field }) => (
              <FormItem>
                <FormLabel><H5>{t("Input.Title")}</H5></FormLabel>
                <FormControl>
                  <Input type='tel' placeholder={t("Input.Placeholder")} {...field} />
                </FormControl>
                <FormDescription>
                  {t("Input.Description")}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div id="LoginActions" className='flex flex-col gap-4 w-full'>
          <Button variant={"default"} size={"lg"} disabled={methods.formState.isSubmitting}>
            {methods.formState.isSubmitting && <Loader2Icon className='animate-spin' />}
            {methods.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          </Button>
        </div>
      </form>
    </Form>
  </div>
}