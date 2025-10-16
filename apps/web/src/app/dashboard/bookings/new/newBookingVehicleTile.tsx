import { PBold, Small, H3, Caption } from "@/components/typography";
import { VehicleTypesEnum } from "@ryogo-travel-app/db/schema";
import {
  LucideCar,
  LucideBus,
  LucideTruck,
  LucideMotorbike,
  LucideArmchair,
  LucideAirVent,
  LucideTicketX,
  LucideWrench,
  LucideCheck,
  LucideTractor,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { UseFormSetValue, useWatch } from "react-hook-form";
import {
  NewBookingFindVehiclesType,
  NewBookingFormDataType,
  getOverlapScore,
  NoOverlapScore,
  getCapacityScore,
  getVehicleStatusScore,
  Step3Type,
  tileLeftClassName,
  tileHeaderClassName,
  tileFooterClassName,
  tileStatusClassName,
  tileRightClassName,
  tileRedIconClassName,
  tileGreenIconClassName,
  getExpiryScore,
  getOdometerScore,
  BadTotalScore,
  MediumTotalScore,
  GoodTotalScore,
  BestTotalScore,
} from "./newBookingCommon";
import { VehicleTileTag } from "./newBookingTileTag";

type VehicleTileProps = {
  vehicleData: NewBookingFindVehiclesType[number];
  newBookingFormData: NewBookingFormDataType;
  setValue: UseFormSetValue<Step3Type>;
};
export default function VehicleTile({
  vehicleData,
  newBookingFormData,
  setValue,
}: VehicleTileProps) {
  const assignedVehicleIdWatch = useWatch({
    name: "assignedVehicleId",
  });
  const t = useTranslations("Dashboard.NewBooking.Form.Step3.Vehicle");

  const bookingOverLapScores = vehicleData.assignedBookings.map((booking) => {
    return getOverlapScore(
      new Date(booking.startDate),
      new Date(booking.endDate),
      newBookingFormData.tripStartDate,
      newBookingFormData.tripEndDate
    );
  });
  const repairOverLapScores = vehicleData.vehicleRepairs.map((repair) => {
    return getOverlapScore(
      new Date(repair.startDate),
      new Date(repair.endDate),
      newBookingFormData.tripStartDate,
      newBookingFormData.tripEndDate
    );
  });

  const isBooked = bookingOverLapScores.some(
    (score) => score != NoOverlapScore
  );

  const isRepairScheduled = repairOverLapScores.some(
    (score) => score != NoOverlapScore
  );

  const bookingScore =
    bookingOverLapScores.length == 0
      ? 100
      : bookingOverLapScores.reduce((a, b) => a + b, 0) /
        bookingOverLapScores.length;

  const repairScore =
    repairOverLapScores.length == 0
      ? 100
      : repairOverLapScores.reduce((a, b) => a + b, 0) /
        repairOverLapScores.length;

  const capacityScore = getCapacityScore(
    vehicleData.capacity,
    newBookingFormData.tripPassengers
  );

  const statusScore = getVehicleStatusScore(vehicleData.status);

  const insuranceScore = getExpiryScore(
    newBookingFormData.tripEndDate,
    new Date(vehicleData.insuranceExpiresOn!)
  );
  const pucScore = getExpiryScore(
    newBookingFormData.tripEndDate,
    new Date(vehicleData.pucExpiresOn!)
  );
  const odometerScore = getOdometerScore(vehicleData.odometerReading);

  const acScore = vehicleData.hasAC == newBookingFormData.tripNeedsAC ? 4 : 1;

  //Score weightage: 30% booking, 20% repair, 15% capacity, 10% status, 10% ac, 5% insurance expiry, 5% puc expiry, 5% odometer
  const totalScore =
    bookingScore * 0.3 +
    repairScore * 0.2 +
    capacityScore * 0.15 +
    statusScore * 0.1 +
    acScore * 0.1 +
    insuranceScore * 0.05 +
    pucScore * 0.05 +
    odometerScore * 0.05;

  return (
    <div
      className={`flex flex-row justify-between items-start gap-2 lg:gap-3 rounded-lg p-3 lg:p-4 border ${
        assignedVehicleIdWatch == vehicleData.id
          ? "border-slate-200 bg-slate-200"
          : "border-slate-100 hover:bg-slate-100"
      }`}
      onClick={() => setValue("assignedVehicleId", vehicleData.id)}
    >
      <div id="left" className={tileLeftClassName}>
        <div id="header" className={tileHeaderClassName}>
          <div id="number">
            <PBold>{vehicleData.vehicleNumber}</PBold>
          </div>
          <div id="mmv" className={tileHeaderClassName}>
            <Small>{vehicleData.brand + " " + vehicleData.model}</Small>
            <VehicleTileTag
              icon={
                vehicleData.type == VehicleTypesEnum.CAR
                  ? LucideCar
                  : vehicleData.type == VehicleTypesEnum.BUS
                  ? LucideBus
                  : vehicleData.type == VehicleTypesEnum.TRUCK
                  ? LucideTruck
                  : vehicleData.type == VehicleTypesEnum.BIKE
                  ? LucideMotorbike
                  : LucideTractor
              }
              text={vehicleData.color}
            />
          </div>
        </div>
        <div id="footer" className={tileFooterClassName}>
          <VehicleTileTag
            icon={LucideArmchair}
            text={
              vehicleData.capacity + t("Seats", { count: vehicleData.capacity })
            }
          />
          {vehicleData.hasAC && (
            <VehicleTileTag icon={LucideAirVent} text={t("AC")} />
          )}
        </div>
      </div>
      <div id="right" className={tileRightClassName}>
        <div
          id="score"
          className={`flex flex-col rounded-lg items-center justify-center gap-1 lg:gap-1.5 py-3 px-4 lg:py-4 lg:px-5 ${
            totalScore < BadTotalScore
              ? "bg-red-200"
              : totalScore < MediumTotalScore
              ? "bg-orange-200"
              : totalScore < GoodTotalScore
              ? "bg-yellow-200"
              : totalScore < BestTotalScore
              ? "bg-green-200"
              : "bg-cyan-300"
          }`}
        >
          <Caption>{t("Score")}</Caption>
          <H3>{totalScore.toFixed(0)}</H3>
        </div>
        <div id="status" className={tileStatusClassName}>
          {isBooked ? (
            <LucideTicketX className={tileRedIconClassName} />
          ) : isRepairScheduled ? (
            <LucideWrench className={tileRedIconClassName} />
          ) : (
            <LucideCheck className={tileGreenIconClassName} />
          )}
          <Caption>
            {isBooked
              ? t("Booked")
              : isRepairScheduled
              ? t("RepairScheduled")
              : t("Available")}
          </Caption>
        </div>
      </div>
    </div>
  );
}
