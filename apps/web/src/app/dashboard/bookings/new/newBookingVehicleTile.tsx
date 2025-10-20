import { PBold, Small, H2, Caption } from "@/components/typography";
import {
  LucideArmchair,
  LucideAirVent,
  LucideTicketX,
  LucideWrench,
  LucideCheck,
  LucideBadgeIndianRupee,
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
  tileHeaderLeftClassName,
  tileFooterClassName,
  tileStatusClassName,
  tileRightClassName,
  tileRedIconClassName,
  tileGreenIconClassName,
  getExpiryScore,
  getOdometerScore,
  getRatePerKmScore,
  getRyogoScoreClassName,
  getTileClassName,
  getVehicleTypeIcon,
  getVehicleTotalScore,
} from "./newBookingCommon";
import { IconTextTag } from "./newBookingTileTag";

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
    vehicleData.insuranceExpiresOn
  );
  const pucScore = getExpiryScore(
    newBookingFormData.tripEndDate,
    vehicleData.pucExpiresOn
  );
  const odometerScore = getOdometerScore(vehicleData.odometerReading);

  const ratePerKmScore = getRatePerKmScore(vehicleData.defaultRatePerKm);

  const acScore = vehicleData.hasAC == newBookingFormData.tripNeedsAC ? 4 : 1;

  const totalScore = getVehicleTotalScore({
    bookingScore,
    repairScore,
    capacityScore,
    statusScore,
    acScore,
    insuranceScore,
    pucScore,
    odometerScore,
    ratePerKmScore,
  });

  return (
    <div
      className={getTileClassName(assignedVehicleIdWatch == vehicleData.id)}
      onClick={() =>
        setValue(
          "assignedVehicleId",
          assignedVehicleIdWatch == vehicleData.id ? undefined : vehicleData.id
        )
      }
    >
      <div id="left" className={tileLeftClassName}>
        <div id="header" className={tileHeaderLeftClassName}>
          <div id="number">
            <PBold>{vehicleData.vehicleNumber}</PBold>
          </div>
          <div id="mmv" className={tileHeaderLeftClassName}>
            <Small>{vehicleData.brand + " " + vehicleData.model}</Small>
            <IconTextTag
              icon={getVehicleTypeIcon(vehicleData.type)}
              text={vehicleData.color}
            />
          </div>
        </div>
        <div id="footer" className={tileFooterClassName}>
          <IconTextTag
            icon={LucideBadgeIndianRupee}
            text={vehicleData.defaultRatePerKm.toString() + t("PerKm")}
          />
          <IconTextTag
            icon={LucideArmchair}
            text={
              vehicleData.capacity + t("Seats", { count: vehicleData.capacity })
            }
          />
          {vehicleData.hasAC && (
            <IconTextTag icon={LucideAirVent} text={t("AC")} />
          )}
        </div>
      </div>
      <div id="right" className={tileRightClassName}>
        <div id="score" className={getRyogoScoreClassName(totalScore)}>
          <Caption>{t("Score")}</Caption>
          <H2>{totalScore.toFixed(0)}</H2>
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
