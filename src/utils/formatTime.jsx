import { format, getTime, formatDistanceToNow } from "date-fns";

export function fDate(date) {
  if (!date) return "N/A";
  try {
    return format(new Date(date), "dd MMMM yyyy");
  } catch (error) {
    console.error("Invalid date format:", date, error);
    return "Invalid date";
  }
}

export function fDateTime(date) {
  if (!date) return "N/A";
  try {
    return format(new Date(date), "dd MMM yyyy HH:mm");
  } catch (error) {
    console.error("Invalid date format:", date, error);
    return "Invalid date";
  }
}

export function fTimestamp(date) {
  if (!date) return null;
  try {
    return getTime(new Date(date));
  } catch (error) {
    console.error("Invalid date format:", date, error);
    return null;
  }
}

export function fDateTimeSuffix(date) {
  if (!date) return "N/A";
  try {
    return format(new Date(date), "dd/MM/yyyy hh:mm p");
  } catch (error) {
    console.error("Invalid date format:", date, error);
    return "Invalid date";
  }
}

export function fToNow(date) {
  if (!date) return "N/A";
  try {
    return formatDistanceToNow(new Date(date), {
      addSuffix: true,
    });
  } catch (error) {
    console.error("Invalid date format:", date, error);
    return "Invalid date";
  }
}
