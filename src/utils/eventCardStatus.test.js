import { isEventCardClosed } from "./eventCardStatus";

const duringEvent = Date.parse("2026-11-21T06:00:00Z");
const beyporeSummary = {
  eventId: 130,
  isClosed: false,
  ticketSaleEndDate: "2026-12-16T00:30:00.000Z",
};

test("Beypore stays open with either the section summary or the event dates", () => {
  expect(isEventCardClosed({}, beyporeSummary, true, duringEvent)).toBe(false);
  expect(isEventCardClosed({}, {
    ...beyporeSummary,
    startDate: "2026-11-19T00:00:00+05:30",
    endDate: "2026-12-19T23:59:00+05:30",
  }, true, duringEvent)).toBe(false);
});

test("a past start date alone does not close an event", () => {
  expect(isEventCardClosed({ date: "2026-11-19" }, {}, true, duringEvent)).toBe(false);
});

test("an elapsed ticket-sale cutoff closes an event even when its summary says open", () => {
  const afterCutoff = Date.parse("2026-12-16T00:30:01Z");
  expect(isEventCardClosed({}, beyporeSummary, true, afterCutoff)).toBe(true);
});

test("an elapsed event end or an explicit closed status still closes an event", () => {
  expect(isEventCardClosed({}, { eventEndDate: "2026-11-20" }, true, duringEvent)).toBe(true);
  expect(isEventCardClosed({}, { ...beyporeSummary, status: " Closed " }, true, duringEvent)).toBe(true);
});
