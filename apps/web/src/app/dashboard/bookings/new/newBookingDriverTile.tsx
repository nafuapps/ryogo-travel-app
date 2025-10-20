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
  tileHeaderLeftClassName,
  tileLeftClassName,
  tileRedIconClassName,
  tileRightClassName,
  tileStatusClassName,
  getExpiryScore,
  getAllowanceScore,
  getCanDriveScore,
  getRyogoScoreClassName,
  getTileClassName,
  getDriverTotalScore,
  getCanDriveIcons,
} from "./newBookingCommon";
import { PBold, H2, Caption, Small } from "@/components/typography";
import { IconsTag, IconTextTag } from "./newBookingTileTag";
import {
  LucideTicketX,
  LucideCalendarX,
  LucideCheck,
  LucideBadgeIndianRupee,
  LucidePhone,
} from "lucide-react";

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
    driverData.licenseExpiresOn
  );

  const allowanceScore = getAllowanceScore(driverData.defaultAllowancePerDay);

  const canDriveScore = getCanDriveScore(
    driverData.canDriveVehicleTypes,
    newBookingFormData.tripPassengers
  );

  const totalScore = getDriverTotalScore({
    bookingScore,
    leaveScore,
    statusScore,
    licenseScore,
    allowanceScore,
    canDriveScore,
  });

  return (
    <div
      className={getTileClassName(assignedDriverIdWatch == driverData.id)}
      onClick={() =>
        setValue(
          "assignedDriverId",
          assignedDriverIdWatch == driverData.id ? undefined : driverData.id
        )
      }
    >
      <div id="left" className={tileLeftClassName}>
        <div id="header" className={tileHeaderLeftClassName}>
          <PBold>{driverData.name}</PBold>
          <Small>{driverData.address}</Small>
          <IconTextTag icon={LucidePhone} text={driverData.phone} />
        </div>
        <div id="footer" className={tileFooterClassName}>
          <IconTextTag
            icon={LucideBadgeIndianRupee}
            text={driverData.defaultAllowancePerDay.toString() + t("PerDay")}
          />
          <IconsTag icons={getCanDriveIcons(driverData.canDriveVehicleTypes)} />
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
