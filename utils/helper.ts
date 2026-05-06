export const formatDateToLocal = (utcDateString: string) => {
  const date = new Date(utcDateString);

  if (isNaN(date.getTime())) {
    return "Invalid date";
  }

  const day = date.getDate();

  const getOrdinal = (n: number) => {
    if (n > 3 && n < 21) return "th";

    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  const month = date.toLocaleString("en-US", {
    month: "long",
  });

  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");

  const ampm = hours >= 12 ? "pm" : "am";

  hours = hours % 12 || 12;

  return `${day}${getOrdinal(day)} ${month}, ${year} (${hours}:${minutes} ${ampm})`;
};
