import { useTranslations } from "next-intl";
import { UseFormSetValue, useWatch } from "react-hook-form";
import {
  NewBookingFindDriversType,
  NewBookingFormDataType,
  getOverlapScore,
  getDriverStatusScore,
  Step3Type,
  NoOverlapScore,
  tileFooterClassName,
  tileGreenIconClassName,
  tileHeaderClassName,
  tileLeftClassName,
  tileRedIconClassName,
  tileRightClassName,
  tileStatusClassName,
  BadTotalScore,
  BestTotalScore,
  GoodTotalScore,
  MediumTotalScore,
  getExpiryScore,
} from "./newBookingCommon";
import { PBold, H3, Caption, Small } from "@/components/typography";
import { DriverTileTag } from "./newBookingTileTag";
import { LucideTicketX, LucideCalendarX, LucideCheck } from "lucide-react";

type DriverTileProps = {
  driverData: NewBookingFindDriversType[number];
  newBookingFormData: NewBookingFormDataType;
  setValue: UseFormSetValue<Step3Type>;
};
export default function DriverTile({
  driverData,
  newBookingFormData,
  setValue,
}: DriverTileProps) {
  const assignedDriverIdWatch = useWatch({
    name: "assignedDriverId",
  });
  const t = useTranslations("Dashboard.NewBooking.Form.Step3.Driver");

  const bookingOverLapScores = driverData.assignedBookings.map((booking) => {
    return getOverlapScore(
      new Date(booking.startDate),
      new Date(booking.endDate),
      newBookingFormData.tripStartDate,
      newBookingFormData.tripEndDate
    );
  });

  const leaveOverLapScores = driverData.driverLeaves.map((leave) => {
    return getOverlapScore(
      new Date(leave.startDate),
      new Date(leave.endDate),
      newBookingFormData.tripStartDate,
      newBookingFormData.tripEndDate
    );
  });

  const isBooked = bookingOverLapScores.some(
    (score) => score != NoOverlapScore
  );

  const isOnLeave = leaveOverLapScores.some((score) => score != NoOverlapScore);

  const bookingScore =
    bookingOverLapScores.length == 0
      ? 100
      : bookingOverLapScores.reduce((a, b) => a + b, 0) /
        bookingOverLapScores.length;

  const leaveScore =
    leaveOverLapScores.length == 0
      ? 100
      : leaveOverLapScores.reduce((a, b) => a + b, 0) /
        leaveOverLapScores.length;

  const statusScore = getDriverStatusScore(driverData.status);

  const licenseScore = getExpiryScore(
    newBookingFormData.tripEndDate,
    new Date(driverData.licenseExpiresOn!)
  );

  //Score weightage: 40% booking, 30% leave, 20% status, 10 % license expiry
  const totalScore =
    bookingScore * 0.4 +
    leaveScore * 0.3 +
    statusScore * 0.2 +
    licenseScore * 0.1;

  return (
    <div
      className={`flex flex-row justify-between items-start gap-2 lg:gap-3 rounded-lg p-3 lg:p-4 border ${
        assignedDriverIdWatch == driverData.id
          ? "border-slate-200 bg-slate-200"
          : "border-slate-100 hover:bg-slate-100"
      }`}
      onClick={() => setValue("assignedDriverId", driverData.id)}
    >
      <div id="left" className={tileLeftClassName}>
        <div id="header" className={tileHeaderClassName}>
          <PBold>{driverData.name}</PBold>
          <Small>{driverData.phone}</Small>
        </div>
        <div id="footer" className={tileFooterClassName}>
          <DriverTileTag vehicles={driverData.canDriveVehicleTypes} />
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
          ) : isOnLeave ? (
            <LucideCalendarX className={tileRedIconClassName} />
          ) : (
            <LucideCheck className={tileGreenIconClassName} />
          )}
          <Caption>
            {isBooked ? t("Booked") : isOnLeave ? t("Leave") : t("Available")}
          </Caption>
        </div>
      </div>
    </div>
  );
}
