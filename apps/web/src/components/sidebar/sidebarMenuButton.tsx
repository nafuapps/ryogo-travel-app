import { P } from "@/components/typography";
import {
  TooltipContent,
  TooltipTrigger,
  Tooltip,
} from "@/components/ui/tooltip";
import { LucideProps } from "lucide-react";
import Link from "next/link";
import { ForwardRefExoticComponent, RefAttributes } from "react";

import { UrlObject } from "url";

type MenuButtonProps = {
  title: string;
  url: UrlObject | __next_route_internal_types__.RouteImpl<URL>;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  open: boolean;
  active?: boolean;
};

export const menuButtonClassName =
  "flex flex-row gap-3 items-center justify-start rounded-lg bg-slate-50 hover:bg-slate-200 text-slate-600 w-full px-2 py-2";

export const activeMenuButtonClassName =
  "flex flex-row gap-3 items-center justify-start rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-100 w-full px-2 py-2";

export const iconClassName = "size-8 stroke-1 aspect-square text-slate-500";
export const activeIconClassName =
  "size-8 aspect-square text-slate-100 stroke-1";

export function MenuButton(props: MenuButtonProps) {
  return (
    <Link href={props.url}>
      <Tooltip disableHoverableContent>
        <TooltipTrigger className="w-full">
          <div
            className={
              props.active ? activeMenuButtonClassName : menuButtonClassName
            }
          >
            <props.icon
              className={props.active ? activeIconClassName : iconClassName}
            />
            {props.open && <P>{props.title}</P>}
          </div>
        </TooltipTrigger>
        {!props.open && <TooltipContent>{props.title}</TooltipContent>}
      </Tooltip>
    </Link>
  );
}
