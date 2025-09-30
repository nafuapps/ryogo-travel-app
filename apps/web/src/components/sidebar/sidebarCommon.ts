import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { UrlObject } from "url";

export type MenuItemType = {
  title: string;
  url: UrlObject | __next_route_internal_types__.RouteImpl<URL>;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  onlyOwner?: boolean;
}[];
