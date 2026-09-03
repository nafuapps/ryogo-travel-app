import { RyogoCaption, RyogoP } from "@/components/typography"
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

export default function RyogoAlertDialog({
  title,
  noCTA,
  labelChild,
  children,
  desc,
}: {
  title: string
  noCTA: string
  labelChild: React.ReactNode
  children: React.ReactNode
  desc?: string
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{labelChild}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            <RyogoP weight="font-bold">{title}</RyogoP>
          </AlertDialogTitle>
          {desc && (
            <AlertDialogDescription>
              <RyogoCaption color="light">{desc}</RyogoCaption>
            </AlertDialogDescription>
          )}
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>
            <RyogoCaption color="slate">{noCTA}</RyogoCaption>
          </AlertDialogCancel>
          <AlertDialogAction asChild>{children}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
