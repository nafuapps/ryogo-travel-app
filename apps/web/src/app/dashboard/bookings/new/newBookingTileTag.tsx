import { Caption } from "@/components/typography";
import {
  LucideBus,
  LucideCar,
  LucideMotorbike,
  LucideProps,
  LucideTruck,
} from "lucide-react";
import { ForwardRefExoticComponent, RefAttributes } from "react";
import { tileIconClassName } from "./newBookingCommon";
import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema";

type VehicleTileTagProps = {
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  text: string;
};
export function VehicleTileTag(props: VehicleTileTagProps) {
  return (
    <div className="flex flex-row gap-1 lg:gap-1.5 items-center">
      <props.icon className={tileIconClassName} />
      <Caption>{props.text}</Caption>
    </div>
  );
}

type DriverTileTagProps = {
  vehicles: VehicleTypesEnum[];
};
export function DriverTileTag(props: DriverTileTagProps) {
  const icons: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >[] = [];

  if (props.vehicles.includes(VehicleTypesEnum.BIKE)) {
    icons.push(LucideMotorbike);
  }
  if (props.vehicles.includes(VehicleTypesEnum.CAR)) {
    icons.push(LucideCar);
  }
  if (props.vehicles.includes(VehicleTypesEnum.BUS)) {
    icons.push(LucideBus);
  }
  if (props.vehicles.includes(VehicleTypesEnum.TRUCK)) {
    icons.push(LucideTruck);
  }

  return (
    <div className="flex flex-row gap-1 lg:gap-1.5 items-center">
      {icons.map((Icon, index) => {
        return <Icon key={index} className={tileIconClassName} />;
      })}
    </div>
  );
}
