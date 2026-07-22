const longDateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "short",
  day: "numeric",
  timeZone: "UTC",
});

export function formatIsoDate(value: string) {
  return longDateFormatter.format(new Date(`${value}T00:00:00Z`));
}

export function daysUntil(value: string) {
  const deadline = new Date(`${value}T23:59:59Z`).getTime();
  return Math.ceil((deadline - Date.now()) / 86_400_000);
}

const monthAbbreviations = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

export function formatDecimalYear(value: number, lowerBound = false) {
  const year = Math.floor(value);
  const month = Math.min(12, Math.max(1, Math.floor((value - year) * 12) + 1));
  return `${monthAbbreviations[month - 1]} ${year}${lowerBound ? "+" : ""}`;
}

const decimalLabelPattern = /^\d{4}(\.\d+)?\+?$/;

export function displayQuantileLabel(quantile: { value: number; label: string; lower_bound?: boolean }) {
  if (decimalLabelPattern.test(quantile.label)) {
    return formatDecimalYear(quantile.value, quantile.lower_bound ?? quantile.label.endsWith("+"));
  }
  return `${quantile.label}${quantile.lower_bound && !quantile.label.includes("+") && !quantile.label.startsWith(">") ? "+" : ""}`;
}

export function formatCountdown(value: string) {
  const days = daysUntil(value);
  if (days === 0) return "Due today";
  if (days < 0) return `${Math.abs(days)} days past deadline`;
  if (days < 45) return `${days} days remaining`;
  const months = Math.round(days / 30.44);
  if (months < 24) return `${months} months remaining`;
  return `${(days / 365.25).toFixed(1)} years remaining`;
}
