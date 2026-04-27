import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Ticket, ChefHat, Bed, X, Sparkles, Clock, Users, Star, Plus, Minus, CheckCircle2, ShieldCheck, ChevronDown } from "lucide-react";
import { useTheme } from "./Theme";
import { Rev, Chars } from "./UI";

// Original functional components
import DateSingle from "../DateSingle";
import TimeSlotsPicker from "../TimeSlotsPicker";
import Counter from "../Counter";
import { createEventOrder } from "../../utils/api";

const asNumber = (value) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const getSlotId = (slot) => (
  asNumber(slot) ??
  asNumber(slot?.eventSlotId) ??
  asNumber(slot?.event_slot_id) ??
  asNumber(slot?.slotId) ??
  asNumber(slot?.slot_id) ??
  asNumber(slot?.id)
);

const getSlotLabel = (slot, index = 0) => (
  (typeof slot === "string" || typeof slot === "number" ? String(slot) : "") ||
  slot?.slotName ||
  slot?.slot_name ||
  slot?.name ||
  slot?.title ||
  slot?.label ||
  slot?.startTime ||
  slot?.slotStartTime ||
  slot?.time ||
  `Slot ${index + 1}`
);

const getSlotAccessKeys = (slot, index = 0) => {
  const rawIds = slot && typeof slot === "object"
    ? [
        slot.eventSlotId,
        slot.event_slot_id,
        slot.slotId,
        slot.slot_id,
        slot.id,
      ]
    : [slot];
  const ids = rawIds
    .map((value) => asNumber(value))
    .filter((value) => value != null);
  const label = String(getSlotLabel(slot, index) || "").trim().toLowerCase();
  return [
    ...ids.map((id) => `id:${id}`),
    label ? `label:${label}` : null,
  ].filter(Boolean);
};

const getTicketId = (ticket) => (
  asNumber(ticket?.ticketTypeId) ??
  asNumber(ticket?.ticket_type_id) ??
  asNumber(ticket?.typeId) ??
  asNumber(ticket?.id)
);

const getTicketName = (ticket, index = 0) => (
  ticket?.name ||
  ticket?.ticketTypeName ||
  ticket?.typeName ||
  ticket?.title ||
  ticket?.ticketName ||
  `Ticket ${index + 1}`
);

const getTicketPrice = (ticket, fallback = 0) => (
  asNumber(ticket?.price) ??
  asNumber(ticket?.ticketTypePrice) ??
  asNumber(ticket?.typePrice) ??
  asNumber(ticket?.ticketPrice) ??
  asNumber(ticket?.individualPrice) ??
  asNumber(ticket?.amount) ??
  asNumber(ticket?.basePrice) ??
  fallback
);

const getTicketSlotRestrictions = (ticket) => {
  const sources = [
    ticket?.applicableSlots,
    ticket?.applicable_slots,
    ticket?.eventSlots,
    ticket?.event_slots,
    ticket?.allowedSlots,
    ticket?.allowed_slots,
    ticket?.slotIds,
    ticket?.slot_ids,
    ticket?.slots,
  ];
  const source = sources.find((item) => Array.isArray(item) && item.length > 0);
  return source || [];
};

const getDateKey = (value) => {
  if (!value) return "";
  if (typeof value?.format === "function") return value.format("YYYY-MM-DD");
  if (typeof value === "string") {
    const match = value.match(/\d{4}-\d{2}-\d{2}/);
    if (match) return match[0];
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toISOString().slice(0, 10);
};

const addDateRangeKeys = (keys, startValue, endValue) => {
  const startKey = getDateKey(startValue);
  const endKey = getDateKey(endValue || startValue);
  if (!startKey) return;

  const start = new Date(`${startKey}T00:00:00`);
  const end = new Date(`${endKey}T00:00:00`);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    keys.add(startKey);
    return;
  }

  const current = start <= end ? start : end;
  const last = start <= end ? end : start;
  while (current <= last) {
    keys.add(current.toISOString().slice(0, 10));
    current.setDate(current.getDate() + 1);
  }
};

const normalizeEventSlots = (slots = [], fallbackPrice = 0) => (
  Array.isArray(slots) ? slots
    .map((slot, index) => {
      if (!slot) return null;
      const source = typeof slot === "string" ? { slotName: slot } : slot;
      if (source.is_active === false || source.isActive === false) return null;
      const id = getSlotId(source);
      return {
        ...source,
        id: id ?? source.id ?? source.slotId ?? `slot-${index}`,
        eventSlotId: id,
        slotName: getSlotLabel(source, index),
        startTime: source.startTime || source.time || source.slotTime || "",
        endTime: source.endTime || "",
        pricePerPerson: source.pricePerPerson ?? source.price ?? fallbackPrice
      };
    })
    .filter(Boolean) : []
);

export function BookingSystem({ listing, type = "experience", selectedAddOns = [], triggerLabel = "Reserve Now", reserveLabel = "Reserve Experience" }) {
  const history = useHistory();
  const { tokens: { A, AH, BG, FG, M, S, B, AL, W } } = useTheme();
  const [show, setShow] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  
  // Real State management
  const [startDate, setStartDate] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [guests, setGuests] = useState({ adults: 1, children: 0, infants: 0 });
  const totalGuests = guests.adults + guests.children;
  const [showTimePicker, setShowTimePicker] = useState(false);
  const isEventBooking = type === "event";
  const eventTickets = useMemo(() => {
    if (!isEventBooking) return [];
    if (Array.isArray(listing?.ticketTypes)) return listing.ticketTypes;
    if (Array.isArray(listing?.tickets)) return listing.tickets;
    if (Array.isArray(listing?.ticketTiers)) return listing.ticketTiers;
    return [];
  }, [isEventBooking, listing?.ticketTypes, listing?.tickets, listing?.ticketTiers]);
  const [selectedTicketTypeId, setSelectedTicketTypeId] = useState("");
  const [selectedEventSlotIds, setSelectedEventSlotIds] = useState([]);
  const selectedEventSlotId = selectedEventSlotIds[0] || "";
  const selectedTicket = useMemo(() => (
    eventTickets.find(ticket => String(ticket.id ?? ticket.ticketTypeId ?? ticket.typeId) === String(selectedTicketTypeId)) || eventTickets[0] || null
  ), [eventTickets, selectedTicketTypeId]);
  const eventFallbackSlots = useMemo(() => (
    listing?.eventSlots || listing?.slots || listing?.timeSlots || []
  ), [listing?.eventSlots, listing?.slots, listing?.timeSlots]);
  const ticketApplicableSlots = useMemo(() => {
    return getTicketSlotRestrictions(selectedTicket);
  }, [selectedTicket]);
  const ticketNameRestriction = useMemo(() => {
    const name = String(getTicketName(selectedTicket) || "").toLowerCase();
    if (name.includes("vip")) return "all";
    if (name.includes("evening")) return "evening";
    if (name.includes("general") || name.includes("morning")) return "morning";
    return "";
  }, [selectedTicket]);
  const canSelectMultipleEventSlots = ticketNameRestriction === "all";
  const ticketHasSlotRestrictions = ticketApplicableSlots.length > 0 || Boolean(ticketNameRestriction);
  const allEventSlotSource = useMemo(() => (
    eventFallbackSlots.length > 0 ? eventFallbackSlots : ticketApplicableSlots
  ), [eventFallbackSlots, ticketApplicableSlots]);
  const eventPrice = getTicketPrice(selectedTicket, asNumber(listing?.ticketPrice) ?? asNumber(listing?.price) ?? asNumber(listing?.basePrice) ?? 0);
  const eventSlots = useMemo(() => (
    normalizeEventSlots(allEventSlotSource, eventPrice)
  ), [allEventSlotSource, eventPrice]);
  const accessibleSlotKeys = useMemo(() => {
    if (!ticketHasSlotRestrictions) return null;
    const keys = new Set();
    ticketApplicableSlots.forEach((slot, index) => {
      getSlotAccessKeys(slot, index).forEach(key => keys.add(key));
    });
    return keys;
  }, [ticketApplicableSlots, ticketHasSlotRestrictions]);
  const isEventSlotAccessible = useCallback((slot, index = 0) => {
    if (!ticketHasSlotRestrictions) return true;
    if (ticketNameRestriction === "all") return true;
    if (accessibleSlotKeys && accessibleSlotKeys.size > 0 && getSlotAccessKeys(slot, index).some(key => accessibleSlotKeys.has(key))) {
      return true;
    }
    if (ticketNameRestriction) {
      const slotLabel = String(getSlotLabel(slot, index) || "").toLowerCase();
      return slotLabel.includes(ticketNameRestriction);
    }
    return false;
  }, [accessibleSlotKeys, ticketHasSlotRestrictions, ticketNameRestriction]);
  const selectedEventSlot = useMemo(() => (
    eventSlots.find((slot, index) => String(slot.eventSlotId ?? slot.id) === String(selectedEventSlotId) && isEventSlotAccessible(slot, index)) || null
  ), [eventSlots, selectedEventSlotId, isEventSlotAccessible]);
  const selectedEventSlots = useMemo(() => (
    eventSlots.filter((slot, index) => selectedEventSlotIds.includes(String(slot.eventSlotId ?? slot.id)) && isEventSlotAccessible(slot, index))
  ), [eventSlots, selectedEventSlotIds, isEventSlotAccessible]);
  const eventAvailableDateKeys = useMemo(() => {
    if (!isEventBooking) return new Set();
    const keys = new Set();

    eventSlots.forEach((slot, index) => {
      if (!isEventSlotAccessible(slot, index)) return;
      addDateRangeKeys(
        keys,
        slot.slotStartDate || slot.slotDate || slot.date || slot.eventDate || slot.startDate,
        slot.slotEndDate || slot.endDate || slot.end_date
      );
    });

    addDateRangeKeys(
      keys,
      listing?.startDate || listing?.eventStartDate || listing?.bookingStartDate,
      listing?.endDate || listing?.eventEndDate || listing?.bookingEndDate || listing?.startDate
    );

    return keys;
  }, [eventSlots, isEventBooking, isEventSlotAccessible, listing?.bookingEndDate, listing?.bookingStartDate, listing?.endDate, listing?.eventEndDate, listing?.eventStartDate, listing?.startDate]);
  const isEventDateHighlighted = useCallback((day) => (
    isEventBooking && eventAvailableDateKeys.has(getDateKey(day))
  ), [eventAvailableDateKeys, isEventBooking]);

  const listingId = listing?.listingId;

  useEffect(() => {
    if (!isEventBooking || selectedTicketTypeId || eventTickets.length === 0) return;
    const firstTicket = eventTickets[0];
    setSelectedTicketTypeId(String(firstTicket.id ?? firstTicket.ticketTypeId ?? firstTicket.typeId ?? "ticket-0"));
  }, [eventTickets, isEventBooking, selectedTicketTypeId]);

  useEffect(() => {
    if (!isEventBooking) return;
    const validSelectedSlots = eventSlots.filter((slot, index) => (
      selectedEventSlotIds.includes(String(slot.eventSlotId ?? slot.id)) && isEventSlotAccessible(slot, index)
    ));
    if (validSelectedSlots.length > 0) {
      const nextSelection = canSelectMultipleEventSlots
        ? validSelectedSlots.map((slot) => String(slot.eventSlotId ?? slot.id))
        : [String(validSelectedSlots[0].eventSlotId ?? validSelectedSlots[0].id)];
      if (nextSelection.join("|") !== selectedEventSlotIds.join("|")) {
        setSelectedEventSlotIds(nextSelection);
      }
      setStartTime(validSelectedSlots.map((slot) => slot.slotName).join(", "));
      return;
    }
    const firstSlot = eventSlots.find((slot, index) => isEventSlotAccessible(slot, index));
    setSelectedEventSlotIds(firstSlot ? [String(firstSlot.eventSlotId ?? firstSlot.id)] : []);
    setStartTime(firstSlot ? firstSlot.slotName : null);
  }, [canSelectMultipleEventSlots, eventSlots, isEventBooking, selectedEventSlotIds, isEventSlotAccessible]);

  // Calculate addon total
  const addOnsTotal = selectedAddOns.reduce((sum, item) => {
    const addon = item.addon || item;
    return sum + (parseFloat(addon.price) || 0);
  }, 0);

  // Extract time slots from listing
  const timeSlots = listing?.timeSlots || [];
  
  // Extract proper price depending on whether a time slot is selected
  const selectedSlotData = timeSlots.find(s => s.slotName === startTime || s.startTime === startTime) || timeSlots[0];
  const extractedPrice = isEventBooking ? eventPrice : selectedSlotData?.pricePerPerson 
    || listing?.timeSlots?.[0]?.pricePerPerson
    || listing?.pricing?.basePrice
    || listing?.basePrice
    || listing?.price 
    || listing?.b2cPrice 
    || "0";
  
  const data = {
    price: extractedPrice,
    unit: isEventBooking ? "ticket" : (type === "stay" ? "night" : "person"),
    icon: type === "stay" ? Bed : (type === "food" ? ChefHat : Ticket)
  };

  const baseTotal = parseFloat(data.price || 0) * totalGuests;
  const finalTotal = baseTotal + addOnsTotal;

  const handleReserve = async () => {
    if (!startDate) return;

    if (isEventBooking) {
      if (!selectedTicket || selectedEventSlots.length === 0 || totalGuests < 1 || bookingLoading) return;

      const dateStr = startDate.format("YYYY-MM-DD");
      const eventIdNum = asNumber(listing?.eventId ?? listing?.event_id ?? listing?.id ?? listing?.listingId) ?? 0;
      const eventSlotIdNum = getSlotId(selectedEventSlot);
      const eventSlotIds = selectedEventSlots.map((slot) => getSlotId(slot)).filter(Boolean);
      const ticketTypeId = getTicketId(selectedTicket);
      const ticketTypeName = getTicketName(selectedTicket);
      const pricePerTicket = asNumber(data.price) ?? 0;
      const customerDetails = (() => {
        const userInfoRaw = localStorage.getItem("userInfo");
        const userInfo = userInfoRaw ? JSON.parse(userInfoRaw) : {};
        return {
          firstName: userInfo?.firstName || localStorage.getItem("firstName") || "",
          lastName: userInfo?.lastName || localStorage.getItem("lastName") || "",
          email: userInfo?.email || localStorage.getItem("email") || "",
          phone: userInfo?.customerPhone || userInfo?.phoneNumber || userInfo?.phone || localStorage.getItem("phone") || localStorage.getItem("phoneNumber") || "",
        };
      })();

      if (!eventIdNum || !eventSlotIdNum || !ticketTypeId) {
        alert("Unable to book: event ticket or slot information is missing.");
        return;
      }

      const payload = {
        eventId: eventIdNum,
        eventSlotId: eventSlotIdNum,
        eventSlotIds,
        bookingDate: dateStr,
        numberOfGuests: totalGuests,
        customerDetails,
        tickets: [{
          ticketTypeId,
          ticketTypeName,
          quantity: totalGuests,
          pricePerTicket: Number(pricePerTicket.toFixed(2)),
        }],
        appliedDiscountCode: null,
        notes: null,
      };

      try {
        setBookingLoading(true);
        const res = await createEventOrder(payload);
        const order = res?.order || res;
        const payment = res?.payment || res?.data?.payment || res?.order?.payment || order?.payment || null;
        const orderId = order?.orderId || order?.id || res?.orderId || res?.id;
        const razorpayOrderId = payment?.razorpayOrderId || order?.razorpayOrderId || res?.razorpayOrderId || order?.razorpay_order_id || res?.razorpay_order_id;
        const currency = listing?.currency || payment?.currency || "INR";
        const amountInPaise = payment?.amount || Math.round(finalTotal * 100);
        const getCachedRazorpayKey = () => {
          try {
            const cachedPayment = localStorage.getItem("lastRazorpayKeyId");
            if (cachedPayment) return cachedPayment;
            const pendingPayment = localStorage.getItem("pendingPayment");
            if (pendingPayment) return JSON.parse(pendingPayment)?.razorpayKeyId;
          } catch (e) {
            console.warn("Could not get cached Razorpay key:", e);
          }
          return null;
        };
        const razorpayKeyId =
          payment?.razorpayKeyId ||
          payment?.razorpay_key_id ||
          payment?.keyId ||
          order?.razorpayKeyId ||
          res?.razorpayKeyId ||
          order?.razorpay_key_id ||
          res?.razorpay_key_id ||
          order?.razorpayKey ||
          res?.razorpayKey ||
          order?.keyId ||
          res?.keyId ||
          process.env.REACT_APP_RAZORPAY_KEY_ID ||
          getCachedRazorpayKey() ||
          "rzp_test_RaBjdu0Ed3p1gN";

        if (razorpayKeyId) {
          try { localStorage.setItem("lastRazorpayKeyId", razorpayKeyId); } catch (e) {}
        }

        const bookingData = {
          eventId: eventIdNum,
          eventSlotId: eventSlotIdNum,
          eventSlotIds,
          listingTitle: listing?.title || "Event Booking",
          listingImage: listing?.coverPhotoUrl || listing?.listingMedia?.[0]?.url || "",
          returnTo: `/event-details?id=${eventIdNum}`,
          bookingSummary: {
            date: dateStr,
            time: selectedEventSlots.map((slot) => slot.startTime || slot.slotName).filter(Boolean).join(", "),
            guestCount: totalGuests,
          },
          guests,
          priceDetails: {
            pricePerPerson: pricePerTicket,
            totalPrice: finalTotal,
          },
          receipt: [
            {
              title: `${currency} ${pricePerTicket.toFixed(2)} x ${totalGuests} ${totalGuests === 1 ? "ticket" : "tickets"}`,
              content: `${currency} ${finalTotal.toFixed(2)}`,
            },
            {
              title: "Total",
              content: `${currency} ${finalTotal.toFixed(2)}`,
            },
          ],
          currency,
          finalTotal,
          ticketType: ticketTypeName,
          ticketTypeId,
          selectedSlot: selectedEventSlot,
          selectedSlots: selectedEventSlots,
        };

        const paymentData = {
          orderId,
          razorpayOrderId,
          razorpayKeyId,
          amount: amountInPaise,
          currency: payment?.currency || currency,
          paymentMethod: "razorpay",
          eventId: eventIdNum,
          eventSlotId: eventSlotIdNum,
          eventSlotIds,
          discount: payment?.discount || res?.discount || 0,
          finalAmount: payment?.finalAmount || amountInPaise,
        };

        localStorage.setItem("pendingBooking", JSON.stringify(bookingData));
        localStorage.setItem("pendingPayment", JSON.stringify(paymentData));
        if (orderId) localStorage.setItem("pendingOrderId", String(orderId));
        localStorage.removeItem("razorpayPaymentSuccess");
        localStorage.removeItem("paymentFailed");

        history.replace("/experience-checkout", {
          bookingData,
          paymentData,
        });
      } catch (e) {
        console.error("Event booking failed:", e?.response?.data || e?.message || e);
        alert(e?.response?.data?.message || e?.response?.data?.error || e?.message || "Booking failed. Please try again.");
      } finally {
        setBookingLoading(false);
      }
      return;
    }
    
    const dateStr = startDate.format("YYYY-MM-DD");
    let url = `/experience-checkout?listingId=${listingId}&startDate=${dateStr}&guests=${totalGuests}`;
    if (startTime) url += `&startTime=${startTime}`;

    const guestsObj = { ...guests, guests: totalGuests };
    const addOnQuantities = {};
    const receipt = [];
    
    receipt.push({
      title: `₹${data.price} x ${totalGuests} ${data.unit}${totalGuests > 1 ? 's' : ''}`,
      content: `₹${baseTotal}`,
      kind: "base",
      showInCheckout: true
    });
    
    selectedAddOns.forEach(item => {
      const addon = item.addon || item;
      const id = addon.addonId || addon.id;
      addOnQuantities[id] = 1;
      receipt.push({
        title: addon.title || "Add-on",
        content: `₹${addon.price || 0}`,
        kind: "addon",
        showInCheckout: false
      });
    });

    receipt.push({
      title: "Total",
      content: `₹${finalTotal}`,
      kind: "total",
      showInCheckout: true
    });
    
    const bookingData = {
      listingId: listingId,
      listingTitle: listing?.title || listing?.name || "Experience",
      listingImage: listing?.coverPhotoUrl || listing?.listingMedia?.[0]?.url || "",
      hostName: listing?.host?.firstName ? `${listing?.host?.firstName} ${listing?.host?.lastName || ""}`.trim() : "Host",
      hostAvatar: listing?.host?.profilePhotoUrl || "/images/content/avatar.jpg",
      selectedDate: dateStr,
      selectedTimeSlot: startTime,
      guests: guestsObj,
      selectedAddOns: selectedAddOns.map(a => (a.addon?.addonId || a.addonId || a.id)),
      addOnQuantities: addOnQuantities,
      receipt: receipt,
      finalTotal: finalTotal,
      pricing: {
        currency: "INR",
        basePrice: baseTotal,
        addonsTotal: addOnsTotal,
        subtotal: baseTotal + addOnsTotal,
        discount: 0,
        tax: 0,
        total: finalTotal,
        guestCount: totalGuests,
        pricePerPerson: parseFloat(extractedPrice || 0)
      },
      bookingSummary: {
        date: dateStr,
        time: startTime,
        guestCount: totalGuests,
        billableGuestCount: totalGuests
      }
    };
    
    // Pass selected addons and full bookingData to the checkout page
    history.push({
      pathname: "/experience-checkout",
      search: url.split("?")[1] ? "?" + url.split("?")[1] : "",
      state: { 
        addOns: selectedAddOns.map(item => item.addon || item),
        bookingData: bookingData
      }
    });
  };

  const IconComp = data.icon;
  const canReserve = isEventBooking
    ? Boolean(startDate && selectedTicket && selectedEventSlots.length > 0 && getSlotId(selectedEventSlots[0]) && totalGuests >= 1 && !bookingLoading)
    : Boolean(startDate && startTime);

  return (
    <>
      <style>{`
        .SingleDatePicker_picker,
        .SingleDatePickerPortal,
        .DateRangePicker_picker,
        .DateRangePickerPortal,
        .ReactDatesPortal {
          z-index: 99999 !important;
        }
      `}</style>
      {/* Floating Trigger */}
      <motion.button
        onClick={() => setShow(true)}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        style={{
          position: "fixed",
          bottom: 30,
          right: 30,
          background: A,
          color: "#FFF",
          padding: "12px 24px",
          borderRadius: 100,
          display: "flex",
          alignItems: "center",
          gap: 10,
          boxShadow: "0 15px 35px rgba(0,0,0,0.2)",
          border: "none",
          cursor: "pointer",
          zIndex: 1000,
          fontWeight: 600,
          fontSize: 14
        }}
      >
        <IconComp size={18} />
        {triggerLabel}
      </motion.button>

      <AnimatePresence>
        {show && (
          <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShow(false)}
              style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.6)", backdropFilter: "blur(10px)" }} 
            />
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              style={{
                position: "relative",
                width: "95%",
                maxWidth: 850,
                background: BG,
                borderRadius: 32,
                boxShadow: "0 40px 120px rgba(0,0,0,0.5)",
                border: `1px solid ${B}`,
                overflow: "hidden"
              }}
            >
              {/* Header */}
              <div style={{ padding: "32px 40px", borderBottom: `1px solid ${B}88`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ fontSize: 14, fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.2em", color: A, marginBottom: 8 }}>Reserve Your Experience</h2>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                    <span style={{ fontSize: 32, fontWeight: 800, color: FG }}>₹{data.price}</span>
                    <span style={{ fontSize: 14, color: M, fontWeight: 500 }}>per {data.unit}</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, justifyContent: "flex-end" }}>
                      <Star size={14} fill={A} color={A} />
                      <span style={{ fontSize: 16, fontWeight: 700, color: FG }}>4.9</span>
                    </div>
                    <p style={{ fontSize: 12, color: M, marginTop: 2 }}>124 verified reviews</p>
                  </div>
                  <button onClick={() => setShow(false)} style={{ background: S, border: `1px solid ${B}`, padding: 12, borderRadius: 100, cursor: "pointer", color: FG, display: "flex", alignItems: "center", justifyContent: "center", transition: "0.3s" }}>
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Main Content - 2 Columns */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr", gap: 1, background: B }}>
                {/* Left Column: Date & Ticket */}
                <div style={{ padding: "40px", background: BG, display: "flex", flexDirection: "column", gap: 32 }}>
                  <div>
                    <div style={{ fontSize: 11, color: A, fontWeight: 800, textTransform: "uppercase", marginBottom: 16, letterSpacing: "0.1em" }}>01. Select Date</div>
                    <div style={{ background: S, borderRadius: 16, padding: "8px", border: `1px solid ${B}` }}>
                      <DateSingle 
                        withPortal={true}
                        date={startDate}
                        onDateChange={(date) => setStartDate(date)}
                        placeholder="Pick a date"
                        id="jui-booking-date"
                        plain
                        isDayHighlighted={isEventBooking ? isEventDateHighlighted : undefined}
                      />
                    </div>
                  </div>

                  {isEventBooking && (
                    <div>
                      <div style={{ fontSize: 11, color: A, fontWeight: 800, textTransform: "uppercase", marginBottom: 16, letterSpacing: "0.1em" }}>02. Ticket Type</div>
                      {eventTickets.length > 0 ? (
                        <div style={{ position: "relative" }}>
                          <select
                            value={selectedTicketTypeId}
                            onChange={(e) => {
                              setSelectedTicketTypeId(e.target.value);
                              setSelectedEventSlotIds([]);
                              setStartTime(null);
                            }}
                            style={{
                              width: "100%",
                              appearance: "none",
                              padding: "16px 20px",
                              borderRadius: 16,
                              border: `1px solid ${B}`,
                              background: S,
                              color: FG,
                              cursor: "pointer",
                              fontSize: 14,
                              fontWeight: 600,
                              outline: "none"
                            }}
                          >
                            {eventTickets.map((ticket, index) => {
                              const ticketId = String(ticket.id ?? ticket.ticketTypeId ?? ticket.typeId ?? `ticket-${index}`);
                              return (
                                <option key={ticketId} value={ticketId}>
                                  {getTicketName(ticket, index)} - ₹{getTicketPrice(ticket, 0)}
                                </option>
                              );
                            })}
                          </select>
                          <ChevronDown size={18} color={M} style={{ position: "absolute", right: 20, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
                        </div>
                      ) : (
                        <div style={{ padding: "16px", background: S, borderRadius: 16, fontSize: 13, color: M }}>No ticket types available.</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Column: Slots & Guests */}
                <div style={{ padding: "40px", background: S, display: "flex", flexDirection: "column", gap: 32 }}>
                  <div>
                    <div style={{ fontSize: 11, color: A, fontWeight: 800, textTransform: "uppercase", marginBottom: 16, letterSpacing: "0.1em" }}>{isEventBooking ? "03. Choose Slot" : "02. Select Time"}</div>
                    
                    {isEventBooking ? (
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                        {eventSlots.length > 0 ? eventSlots.map((slot, index) => {
                          const slotId = String(slot.eventSlotId ?? slot.id);
                          const isDisabled = !isEventSlotAccessible(slot, index);
                          const isSelected = selectedEventSlotIds.includes(slotId);
                          return (
                            <button
                              key={slotId}
                              disabled={isDisabled}
                              onClick={() => {
                                if (isDisabled) return;
                                if (canSelectMultipleEventSlots) {
                                  setSelectedEventSlotIds(cur => cur.includes(slotId) ? cur.filter(id => id !== slotId) : [...cur, slotId]);
                                } else {
                                  setSelectedEventSlotIds([slotId]);
                                  setStartTime(slot.slotName);
                                }
                              }}
                              style={{
                                padding: "14px",
                                borderRadius: 16,
                                border: `1.5px solid ${isSelected ? A : B}`,
                                background: isSelected ? AL : BG,
                                color: isSelected ? A : FG,
                                fontSize: 13,
                                fontWeight: 700,
                                cursor: isDisabled ? "not-allowed" : "pointer",
                                opacity: isDisabled ? 0.4 : 1,
                                textAlign: "center",
                                transition: "0.2s"
                              }}
                            >
                              {slot.slotName}
                              {slot.endTime && <span style={{ display: "block", fontSize: 10, opacity: 0.7, marginTop: 2 }}>{slot.endTime}</span>}
                            </button>
                          );
                        }) : <div style={{ gridColumn: "span 2", padding: "20px", textAlign: "center", color: M }}>No slots available</div>}
                      </div>
                    ) : (
                      <div style={{ position: "relative" }}>
                        <div 
                          onClick={() => setShowTimePicker(!showTimePicker)}
                          style={{ padding: "16px 20px", background: BG, border: `1px solid ${B}`, borderRadius: 16, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                        >
                          <span style={{ fontSize: 14, fontWeight: 600, color: startTime ? FG : M }}>{startTime || "Select Time"}</span>
                          <ChevronDown size={18} color={M} />
                        </div>
                        {showTimePicker && (
                          <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, zIndex: 100, background: BG, border: `1px solid ${B}`, borderRadius: 16, boxShadow: "0 10px 30px rgba(0,0,0,0.1)", padding: "8px" }}>
                            <TimeSlotsPicker 
                              visible={true}
                              onClose={() => setShowTimePicker(false)}
                              onTimeSelect={(t) => { setStartTime(t); setShowTimePicker(false); }}
                              selectedTime={startTime}
                              timeSlots={timeSlots}
                              selectedDate={startDate}
                              plain
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div>
                    <div style={{ fontSize: 11, color: A, fontWeight: 800, textTransform: "uppercase", marginBottom: 16, letterSpacing: "0.1em" }}>{isEventBooking ? "04. Guests" : "03. Guests"}</div>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: BG, border: `1px solid ${B}`, borderRadius: 16 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: FG }}>Adults</span>
                        <Counter value={guests.adults} setValue={(v) => setGuests(p => ({ ...p, adults: v }))} min={1} />
                      </div>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: BG, border: `1px solid ${B}`, borderRadius: 16 }}>
                        <span style={{ fontSize: 14, fontWeight: 600, color: FG }}>Children</span>
                        <Counter value={guests.children} setValue={(v) => setGuests(p => ({ ...p, children: v }))} min={0} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Button */}
              <div style={{ padding: "32px 40px", background: BG, borderTop: `1px solid ${B}88`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <span style={{ fontSize: 11, color: M, textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 600 }}>Total amount</span>
                  <span style={{ fontSize: 24, fontWeight: 800, color: FG }}>₹{finalTotal}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!canReserve || bookingLoading}
                  onClick={handleReserve}
                  style={{
                    padding: "18px 48px",
                    background: canReserve ? A : B,
                    color: "#FFF",
                    borderRadius: 16,
                    border: "none",
                    fontSize: 16,
                    fontWeight: 800,
                    cursor: canReserve ? "pointer" : "not-allowed",
                    boxShadow: canReserve ? `0 10px 30px ${A}44` : "none",
                    transition: "0.3s"
                  }}
                >
                  {bookingLoading ? "Processing..." : reserveLabel}
                </motion.button>
              </div>
              
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "0 40px 32px", color: M, fontSize: 12, background: BG }}>
                <ShieldCheck size={14} />
                <span>Secure payment processed by Little Known Planet</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
