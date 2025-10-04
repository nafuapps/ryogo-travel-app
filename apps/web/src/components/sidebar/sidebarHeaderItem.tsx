import { PBold, CaptionGrey } from "@/components/typography";
import { Skeleton } from "@/components/ui/skeleton";

export const headerButtonClassName =
  "flex flex-row gap-3 items-center justify-start rounded bg-slate-50 text-slate-600 w-full p-1";

export function SidebarHeaderItem(props: {
  open: boolean;
  title: string;
  subtitle: string;
}) {
  return (
    <div className={headerButtonClassName}>
      <Skeleton className="size-10 aspect-square rounded bg-slate-400" />
      {props.open && (
        <div className="flex flex-col gap-0.5 items-start justify-center">
          <PBold>{props.title}</PBold>
          <CaptionGrey>{props.subtitle}</CaptionGrey>
        </div>
      )}
    </div>
  );
}
