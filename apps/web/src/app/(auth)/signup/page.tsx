//Signup page
'use client'

import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { H2, H5 } from "@/components/typography";
import { useRouter } from 'next/navigation';
import { Loader2Icon } from 'lucide-react';


export default function SignupPage() {

  const t = useTranslations('Auth.SignupPage.Step1');
  const formSchema = z.object({
    phoneNumber: z.string().length(10, t('Error1')).regex(/^[0-9]+$/, t('Error2'))
  })

  type FormFields = z.infer<typeof formSchema>

  const router = useRouter();

  const methods = useForm<FormFields>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phoneNumber: "",
    },
  },
  )

  //Submit actions
  const onSubmit = (data: FormFields) => {
    // TODO: Find phone number in DB
    if (data.phoneNumber == "1234567890") {
      // If found, go to existing account page
      router.push("/signup/existing?phone=" + data.phoneNumber)
    } else {
      // else, go to onboarding
      router.push("/onboarding")
    }
  };

  return <div id="SignupPage" className="gap-4 w-full h-full">
    <Form {...methods}>
      <form id="SignupForm" onSubmit={methods.handleSubmit(onSubmit)} className="flex flex-col justify-between  h-full">
        <H2>{t("PageTitle")}</H2>
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
        <div id="SignupActions" className='flex flex-col gap-4 w-full'>
          <Button variant={"default"} size={"lg"} disabled={methods.formState.isSubmitting}>
            {methods.formState.isSubmitting && <Loader2Icon className='animate-spin' />}
            {methods.formState.isSubmitting ? t("Loading") : t("PrimaryCTA")}
          </Button>
        </div>
      </form>
    </Form>
  </div>
}
