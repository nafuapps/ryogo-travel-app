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

export default function RyogoAlertDialog(props: {
  title: string
  noCTA: string
  labelChild: React.ReactNode
  children: React.ReactNode
  desc?: string
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{props.labelChild}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{props.title}</AlertDialogTitle>
          {props.desc && (
            <AlertDialogDescription>{props.desc}</AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{props.noCTA}</AlertDialogCancel>
          <AlertDialogAction asChild>{props.children}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
