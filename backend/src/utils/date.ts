import { startOfDay, subDays, addDays, format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
const startDate = startOfDay(subDays(new Date(), 6));
const timezone = "Asia/Jakarta";
const formatDateKey = (date: Date) => {
    return format(date, "yyyy-MM-dd");
}

export { addDays, toZonedTime, startDate, timezone, formatDateKey };