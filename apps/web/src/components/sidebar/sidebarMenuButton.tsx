import { PGrey } from "@/components/typography";
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
};

export const menuButtonClassName =
  "flex flex-row gap-3 items-center justify-start rounded-lg hover:bg-slate-200 w-full px-2 py-2";

export function MenuButton(props: MenuButtonProps) {
  return (
    <Link href={props.url}>
      <Tooltip disableHoverableContent>
        <TooltipTrigger className="w-full">
          <div className={menuButtonClassName}>
            <props.icon className="size-8 stroke-1 aspect-square text-slate-400" />
            {props.open && <PGrey>{props.title}</PGrey>}
          </div>
        </TooltipTrigger>
        {!props.open && <TooltipContent>{props.title}</TooltipContent>}
      </Tooltip>
    </Link>
  );
}
