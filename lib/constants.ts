export const paymentMethods = [
  "Bank Transfer",
  "Credit Card",
  "Cash",
  "Check",
  "PayPal",
  "Stripe",
];

export const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 0) return "??";
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

export const formatDate = (date: Date | string): string =>
  new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

export const formatDateShort = (date: Date | string): { month: string; day: string } => {
  const d = new Date(date);
  return {
    month: new Intl.DateTimeFormat("en-US", { month: "short" }).format(d),
    day: new Intl.DateTimeFormat("en-US", { day: "numeric" }).format(d),
  };
};

export const formatDateLong = (date: Date | string): string =>
  new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));

export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  const day = formatDate(d);
  const time = new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d);
  return `${day}, ${time}`;
};
