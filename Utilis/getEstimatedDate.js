function addWeekdays(dateString, daysToAdd) {
  const [day, month, year] = dateString.split("/").map(Number);
  let date = new Date(year, month - 1, day);

  let addedDays = 0;
  while (addedDays < daysToAdd) {
    date.setDate(date.getDate() + 1);
    const dayOfWeek = date.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) {
      // Skip Sundays and Saturdays
      addedDays++;
    }
  }

  return date;
}

function convertToFullDate(input) {
  const [datePart] = input.split("&");
  const trimmedDate = datePart.trim().replace(/-/g, "/"); // Replace hyphens with slashes
  return `${trimmedDate}/2025`;
}

function formatReadableDate(date) {
  const options = { day: "numeric", month: "short" };
  return date.toLocaleDateString("en-US", options);
}

function getEstimatedDate(packageConnectedDataTime, service, destination) {
  if (!packageConnectedDataTime) return "-";
  const estimatedDays =
    service === "Express"
      ? { start: 3, end: 4 }
      : service === "Economy"
      ? { start: 5, end: 7 }
      : service === "Duty Free" && destination === "United Kingdom"
      ? { start: 10, end: 14 }
      : service === "Duty Free"
      ? { start: 10, end: 14 }
      : null;

  if (!estimatedDays) return "-";

  const baseDate = convertToFullDate(packageConnectedDataTime);
  const startDate = addWeekdays(baseDate, estimatedDays.start);
  const endDate = addWeekdays(baseDate, estimatedDays.end);

  const formattedStart = formatReadableDate(startDate);

  const formattedEnd = formatReadableDate(endDate);
  const year = endDate.getFullYear();

  return `${formattedStart} – ${formattedEnd}, ${year}`;
}

export default {
  getEstimatedDate: getEstimatedDate,
};
