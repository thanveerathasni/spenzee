export const formatCurrency = (
  value: number,
): string =>
  new Intl.NumberFormat(
    "en-IN",
    {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    },
  ).format(value);

export const formatDate = (
  value?: string,
): string =>
  value
    ? new Intl.DateTimeFormat(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      },
    ).format(new Date(value))
    : "—";
