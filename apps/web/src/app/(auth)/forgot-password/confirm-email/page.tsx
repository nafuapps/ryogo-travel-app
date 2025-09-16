//Confirm Email page
'use client'

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { H2, H5 } from "@/components/typography";
import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';


const phoneRegex = z.string().length(10).regex(/^[0-9]+$/);

export default function ConfirmEmailPage() {
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get('phone');


  if (phoneNumber == null || phoneRegex.parse(phoneNumber) != phoneNumber) {
    redirect('/forgot-password', RedirectType.replace);
  }

  const t = useTranslations('Auth.ForgotPasswordPage.Step2');
  const formSchema = z.object({
    email: z.email(t('Error1'))
  })

  type FormFields = z.infer<typeof formSchema>

  // For managing form data and validation
  const methods = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  },
  )

  //Submit actions
  const onSubmit = (data: FormFields) => {
    console.log({ data });
    // TODO: Match phone and email in the DB
    if (data.email == "ryogo@gmail.com" && phoneNumber == "1234567890") {
      //Reset password 
      console.log("Reset success:", data);
      //Redirect to login
      redirect("/forgot-password/success", RedirectType.replace)
    } else {
      // Show error
      methods.setError("email", { type: "manual", message: t("APIError") });
    }
  };

  return <div id="ConfirmEmailPage" className="gap-4 w-full h-full">
    <Form {...methods}>
      <form id="ConfirmEmailForm" onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col justify-between  h-full">
        <H2>{t("PageTitle")}</H2>
        <FormField
          control={methods.control}
          name={"email"}
          render={({ field }) => (
            <FormItem>
              <FormLabel><H5>{t("Input.Title")}</H5></FormLabel>
              <FormControl>
                <Input type='email' placeholder={t("Input.Placeholder")} {...field} />
              </FormControl>
              <FormDescription>
                {t("Input.Description")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div id="LoginActions" className='flex flex-col gap-4 w-full'>
          <Button variant={"default"} size={"lg"} disabled={methods.formState.isSubmitting}>
            {methods.formState.isSubmitting && <Loader2Icon className='animate-spin' />}
            {methods.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          </Button>
          <Button variant={'secondary'}> <Link href="/forgot-password">{t("Back")} </Link></Button>
        </div>
      </form>
    </Form>
  </div>
}
