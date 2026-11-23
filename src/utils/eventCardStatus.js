const isClosedLabel = (value) =>
  typeof value === "string" && value.trim().toLowerCase() === "closed";

export const isEventCardClosed = (item, raw, isEvent, now = Date.now()) => {
  if ([item, raw].some((source) => source.isClosed === true || isClosedLabel(source.badge))) {
    return true;
  }
  if (!isEvent) return false;

  return [item, raw].some((source) =>
    isClosedLabel(source.status) ||
    isClosedLabel(source.eventStatus) ||
    [
      source.ticketSaleEndDate,
      source.ticket_sale_end_date,
      source.saleEndDate,
      source.bookingEndDate,
      source.bookingClosedDate,
      source.eventEndDate,
      source.event_end_date,
      source.endDate,
    ].some((date) => date && new Date(date).getTime() < now)
  );
};
