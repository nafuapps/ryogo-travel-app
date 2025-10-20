import { Caption, Small } from "@/components/typography";
import { LucideProps } from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { bigTileIconClassName, tileIconClassName } from "./newBookingCommon";

type IconTextTagProps = {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  text: string;
};
export function IconTextTag(props: IconTextTagProps) {
  return (
    <div className="flex flex-row gap-1 lg:gap-1.5 items-center">
      <props.icon className={tileIconClassName} />
      <Caption>{props.text}</Caption>
    </div>
  );
}

export function BigIconTextTag(props: IconTextTagProps) {
  return (
    <div className="flex flex-row gap-2 lg:gap-3 items-center">
      <props.icon className={bigTileIconClassName} />
      <Small>{props.text}</Small>
    </div>
  );
}

type IconsTagProps = {
  icons: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >[];
};
export function IconsTag(props: IconsTagProps) {
  return (
    <div className="flex flex-row gap-1 lg:gap-1.5 items-center">
      {props.icons.map((Icon, index) => {
        return <Icon key={index} className={tileIconClassName} />;
      })}
    </div>
  );
}
