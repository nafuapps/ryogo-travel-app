import {
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { JSX } from "react"

type BookingAlertDialogType = {
  title: string
  desc: string
  noCTA: string
  labelChild: JSX.Element
  children: React.ReactNode
}
export default function BookingAlertDialog(props: BookingAlertDialogType) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{props.labelChild}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{props.title}</AlertDialogTitle>
          <AlertDialogDescription>{props.desc}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{props.noCTA}</AlertDialogCancel>
          <AlertDialogAction asChild>{props.children}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
