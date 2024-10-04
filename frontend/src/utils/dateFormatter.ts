export const getTime = (date?: Date | number[]): number => {
  if (Array.isArray(date)) {
    // Convert array [year, month, day] to Date object
    return new Date(date[0], date[1] - 1, date[2]).getTime();
  }
  if (date instanceof Date) {
    return date.getTime();
  }
  return 0;
};

export function formatExpirationDateString(
  date: string | Date | number[] | undefined
): string {
  if (!date) {
    return " No expiration date";
  }

  if (Array.isArray(date) && date.length === 3) {
    const [year, month, day] = date;
    const parsedDate = new Date(year, month - 1, day); // Month is 0-indexed in JavaScript
    return parsedDate.toLocaleDateString();
  }

  if (typeof date === "string") {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      return "Invalid date";
    }
    return parsedDate.toLocaleDateString();
  }

  if (date instanceof Date) {
    return date.toLocaleDateString();
  }

  return "Invalid date";
}
