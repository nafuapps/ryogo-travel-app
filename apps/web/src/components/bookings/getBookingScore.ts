const FullOverlapScore = 10
const PartialOverlapScore = 25
const TouchingOverlapScore = 75
export const NoOverlapScore = 100
export function getOverlapScore(
  otherStart: Date,
  otherEnd: Date,
  newBookingStart: Date,
  newBookingEnd: Date,
): number {
  //Full Overlap
  if (otherStart <= newBookingStart && otherEnd >= newBookingEnd) {
    return FullOverlapScore
  }
  //Partial overlap
  if (
    (otherStart <= newBookingStart && newBookingStart <= otherEnd) ||
    (otherStart <= newBookingEnd && newBookingEnd <= otherEnd)
  ) {
    return PartialOverlapScore
  }
  //Touching
  if (otherEnd === newBookingStart || otherStart === newBookingEnd) {
    return TouchingOverlapScore
  }
  //No overlap
  return NoOverlapScore
}

const NoExpiryDateScore = 10
const ExpiredScore = 10
const SoonExpiringScore = 50
const OKExpiryScore = 100
export function getExpiryScore(
  newBookingEndDate: Date,
  expiryDate: Date | null,
) {
  if (!expiryDate) {
    return NoExpiryDateScore
  }
  //Expired already or null
  if (expiryDate < new Date()) {
    return ExpiredScore
  }
  if (expiryDate <= newBookingEndDate) {
    //Expiring soon
    return SoonExpiringScore
  }
  //OK
  return OKExpiryScore
}
