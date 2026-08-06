import { RyogoCaption } from "@/components/typography"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableRow,
} from "@/components/ui/table"

export function SupportTableWrapper({
  children,
  label,
}: {
  children: React.ReactNode
  label?: string
}) {
  return (
    <div className="flex flex-col gap-2 lg:gap-3 rounded-lg border p-3 lg:p-4">
      <Table>
        {label && (
          <TableCaption>
            <RyogoCaption color="light" className="text-center">
              {label}
            </RyogoCaption>
          </TableCaption>
        )}
        <TableBody>{children}</TableBody>
      </Table>
    </div>
  )
}

export function SupportTableStatusRow({
  children,
  desc,
}: {
  children: React.ReactNode
  desc: string
}) {
  return (
    <TableRow>
      <TableCell>{children}</TableCell>
      <TableCell>
        <RyogoCaption color="slate" className="text-wrap">
          {desc}
        </RyogoCaption>
      </TableCell>
    </TableRow>
  )
}
export function SupportTableTextRow({
  label,
  desc,
}: {
  label: string
  desc: string
}) {
  return (
    <TableRow>
      <TableCell>
        <RyogoCaption color="slate" weight="font-bold">
          {label}
        </RyogoCaption>
      </TableCell>
      <TableCell>
        <RyogoCaption color="slate" className="text-wrap">
          {desc}
        </RyogoCaption>
      </TableCell>
    </TableRow>
  )
}
