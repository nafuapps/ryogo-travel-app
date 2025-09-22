//Login password page
'use client'

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { H2, H5, P } from "@/components/typography";
import Link from 'next/link';
import { redirect, RedirectType } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

// TODO: Add a feature to show the user had recently reset password
// TODO: Add a feature to show user's basic details (Name, Role, Agency)
/* 
    TODO: If multiple accounts found, show them and allow user to chooose one and enter password
*/

const phoneRegex = z.string().length(10).regex(/^[0-9]+$/);

export default function LoginPasswordPage() {
  const searchParams = useSearchParams();
  const phoneNumber = searchParams.get('phone');


  if (phoneNumber == null || phoneRegex.parse(phoneNumber) != phoneNumber) {
    redirect('/login', RedirectType.replace);
  }

  const t = useTranslations('Auth.LoginPage.Step2');
  const formSchema = z.object({
    password: z.string().min(8, t('Error1'))
  })

  type FormFields = z.infer<typeof formSchema>

  // For managing form data and validation
  const methods = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
    },
  },
  )

  //Submit actions
  const onSubmit = (data: FormFields) => {
    console.log({ data });
    // TODO: Match phone and password in the DB
    if (data.password == "12345678" && phoneNumber == "1234567890") {
      //Login user
      console.log("Login success:", data);
      //Redirect to dashboard
      redirect("/home", RedirectType.replace)
    } else {
      // Show error
      methods.setError("password", { type: "manual", message: t("APIError") });
    }

  };

  return <div id="LoginPasswordPage" className="gap-4 w-full h-full">
    <Form {...methods}>
      <form id="LoginPasswordForm" onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col justify-between  h-full">
        <H2>{t("PageTitle")}</H2>
        <P>{phoneNumber}</P>
        <FormField
          control={methods.control}
          name={"password"}
          render={({ field }) => (
            <FormItem>
              <FormLabel><H5>{t("Input.Title")}</H5></FormLabel>
              <FormControl>
                <Input type='password' placeholder={t("Input.Placeholder")} {...field} />
              </FormControl>
              <FormDescription>
                {t("Input.Description")}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div id="LoginPasswordActions" className='flex flex-col gap-4 w-full'>
          <Button variant={"default"} size={"lg"} disabled={methods.formState.isSubmitting}>
            {methods.formState.isSubmitting && <Loader2Icon className='animate-spin' />}
            {methods.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          </Button>
          <Button variant={'link'}> <Link href={`/forgot-password?phone=${phoneNumber}`}>{t("ForgotCTA")} </Link></Button>

        </div>
      </form>
    </Form>
  </div>
}
