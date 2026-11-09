type CheckInItem = {
  CheckIn?: { Date?: string; Time?: string; Timestamp?: string } | '';
};

const checkInDate = (item: CheckInItem) => {
  const ts = item.CheckIn ? item.CheckIn.Timestamp : undefined;
  const date = ts ? new Date(ts) : null;
  return date && !isNaN(date.getTime()) ? date : null;
};

export const sortByCheckIn = (a: CheckInItem, b: CheckInItem) =>
  (checkInDate(a)?.getTime() ?? 0) - (checkInDate(b)?.getTime() ?? 0);

export const formatCheckInDate = (item: CheckInItem) => {
  const date = checkInDate(item);
  if (!date) return item.CheckIn ? (item.CheckIn.Date ?? '') : '';
  return date.toLocaleDateString('en-US', {
    timeZone: 'America/Detroit',
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  });
};

export const formatCheckInTime = (item: CheckInItem) => {
  const date = checkInDate(item);
  if (!date) return item.CheckIn ? (item.CheckIn.Time ?? '') : '';
  return date.toLocaleTimeString('en-US', {
    timeZone: 'America/Detroit',
    hour: 'numeric',
    minute: '2-digit',
  });
};
