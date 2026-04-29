import React, { useState, useEffect, useMemo } from "react";
import { useHistory } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Calendar, Users, Bed, X, Star, ShieldCheck, ChevronDown, Plus, Minus, Info } from "lucide-react";
import moment from "moment";
import { useTheme } from "../../components/JUI/Theme";
import { createStayOrder } from "../../utils/api";
import Counter from "../../components/Counter";
// We'll use a simple date range picker or just two DateSingles for premium look
import DateSingle from "../../components/DateSingle";

const formatPrice = (price) => {
  return Number(price).toLocaleString("en-IN", {
    maximumFractionDigits: 0,
    minimumFractionDigits: 0,
  });
};

const StayBookingSystem = ({
  stay,
  checkInDate,
  setCheckInDate,
  checkOutDate,
  setCheckOutDate,
  guests,
  setGuests,
  selectedRoomId,
  selectedMealPlan,
  roomsCount,
  onRoomsCountChange
}) => {
  const history = useHistory();
  const { tokens: { A, AH, BG, FG, M, S, B, AL, W } } = useTheme();
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const selectedRoom = useMemo(() => {
    if (!stay || !selectedRoomId) return null;
    const rooms = stay.rooms || stay.roomTypes || stay.room_types || [];
    return rooms.find(r => String(r.roomId || r.id) === String(selectedRoomId));
  }, [stay, selectedRoomId]);

  const nightsCount = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 0;
    return Math.max(1, moment(checkOutDate).diff(moment(checkInDate), "days"));
  }, [checkInDate, checkOutDate]);

  // Price Calculation Logic with Discount Tiers and Occupancy Rules
  const pricing = useMemo(() => {
    if (!stay) return { perNight: 0, subtotal: 0, discount: 0, warning: null, isOver: false };
    
    // Occupancy Limits Definition
    let baseAdultsLimit = 0;
    let baseChildrenLimit = 0;
    let extraAdultsLimit = 0;
    let extraChildrenLimit = 0;
    let basePrice = 0;
    let extraAdultPrice = parseFloat(stay.extraAdultPrice || 0);
    let extraChildPrice = parseFloat(stay.extraChildPrice || 0);

    // 0. Seasonal Pricing Logic
    const activeSeason = checkInDate ? (stay.seasonalPeriods || []).find(p => 
      moment(checkInDate).isSameOrAfter(p.startDate, 'day') &&
      moment(checkInDate).isSameOrBefore(p.endDate, 'day')
    ) : null;
    const seasonId = activeSeason?.tempId || activeSeason?.id || activeSeason?.seasonalPeriodId;

    if (selectedRoom) {
      baseAdultsLimit = selectedRoom.maxAdults || 1;
      baseChildrenLimit = selectedRoom.maxChildren || 0;
      extraAdultsLimit = selectedRoom.maxExtraAdultsAllowed || selectedRoom.maxExtraBeds || 0;
      extraChildrenLimit = selectedRoom.maxExtraChildrenAllowed || 0;
      basePrice = parseFloat(selectedRoom.epPrice || selectedRoom.b2cPrice || selectedRoom.price || 0);
      
      const mealPlan = selectedMealPlan || "EP";
      if (selectedMealPlan) {
        const mealKey = { EP: "epPrice", BB: "bbPrice", CP: "cpPrice", MAP: "mapPrice", AP: "apPrice" }[selectedMealPlan];
        basePrice = parseFloat(selectedRoom[mealKey] || basePrice);
      }
      
      if (selectedRoom.extraAdultPrice) extraAdultPrice = parseFloat(selectedRoom.extraAdultPrice);
      if (selectedRoom.extraChildPrice) extraChildPrice = parseFloat(selectedRoom.extraChildPrice);

      // Apply Room Seasonal Pricing
      if (seasonId) {
        const roomSeasonData = (selectedRoom.seasonalPricing || {})[seasonId] || selectedRoom[seasonId];
        const mealSeasonData = (selectedRoom.mealPlanSeasonalPricing || {})[seasonId]?.[mealPlan];
        
        if (mealSeasonData) {
          basePrice = parseFloat(mealSeasonData.hikePrice || mealSeasonData.price || basePrice);
        } else if (roomSeasonData) {
          basePrice = parseFloat(roomSeasonData.hikePrice || roomSeasonData.price || basePrice);
        }

        if (roomSeasonData) {
          if (roomSeasonData.extraAdultPrice) extraAdultPrice = parseFloat(roomSeasonData.extraAdultPrice);
          if (roomSeasonData.extraChildPrice) extraChildPrice = parseFloat(roomSeasonData.extraChildPrice);
        }
      }
    } else {
      baseAdultsLimit = stay.maxAdults || stay.maxGuests || 1;
      baseChildrenLimit = stay.maxChildren || 0;
      extraAdultsLimit = stay.maxExtraAdultsAllowed || stay.maxExtraBeds || 0;
      extraChildrenLimit = stay.maxExtraChildrenAllowed || 0;
      basePrice = parseFloat(stay.fullPropertyB2cPrice || stay.b2cPrice || stay.price || 0);
      
      // Use property-specific extra prices
      extraAdultPrice = parseFloat(stay.fullPropertyExtraAdultPrice || stay.extraAdultPrice || 0);
      extraChildPrice = parseFloat(stay.fullPropertyExtraChildPrice || stay.extraChildPrice || 0);

      // Apply Property Seasonal Pricing
      if (seasonId) {
        const propSeasonData = (stay.propertySeasonalPricing || {})[seasonId] || stay[seasonId];
        if (propSeasonData) {
          basePrice = parseFloat(propSeasonData.fullPropertyHikePrice || propSeasonData.hikePrice || propSeasonData.fullPropertyB2cPrice || basePrice);
          extraAdultPrice = parseFloat(propSeasonData.fullPropertyExtraAdultPrice || propSeasonData.extraAdultPrice || extraAdultPrice);
          extraChildPrice = parseFloat(propSeasonData.fullPropertyExtraChildPrice || propSeasonData.extraChildPrice || extraChildPrice);
        }
      }
    }

    const currentAdults = guests?.adults || 1;
    const currentChildren = guests?.children || 0;
    const totalGuests = currentAdults + currentChildren;
    
    // Occupancy & Stay Warnings
    let warning = null;
    let isOver = false;
    
    // 1. Check Maximum Stay Limit
    const maxNights = stay.maximumStayNights || 0;
    if (maxNights > 0 && nightsCount > maxNights) {
      isOver = true;
      warning = `Maximum stay allowed is ${maxNights} nights. Please adjust your dates.`;
    }
    
    // 2. Check Capacity
    if (!isOver) {
      const isProperty = !selectedRoom;
      const typeLabel = isProperty ? "Property" : "Room";

      if (currentAdults > (baseAdultsLimit + extraAdultsLimit)) {
        isOver = true;
        warning = `${typeLabel} adult capacity reached (${baseAdultsLimit + extraAdultsLimit} max).`;
      } else if (currentChildren > (baseChildrenLimit + extraChildrenLimit)) {
        isOver = true;
        warning = `${typeLabel} children capacity reached (${baseChildrenLimit + extraChildrenLimit} max).`;
      } else if (currentAdults > baseAdultsLimit || currentChildren > baseChildrenLimit) {
        const exA = Math.max(0, currentAdults - baseAdultsLimit);
        const exC = Math.max(0, currentChildren - baseChildrenLimit);
        warning = `Base occupants reached. +${exA + exC} extra guest(s) will incur additional charges.`;
      }
    }

    // Extra guest calculation
    const extraAdultsCount = Math.max(0, currentAdults - baseAdultsLimit);
    const extraChildrenCount = Math.max(0, currentChildren - baseChildrenLimit);

    const extraTotal = (extraAdultsCount * extraAdultPrice) + (extraChildrenCount * extraChildPrice);
    const originalPerNight = basePrice + extraTotal;
    
    // Discount Tiers Calculation
    let appliedDiscountPercent = 0;
    if (nightsCount > 0 && Array.isArray(stay.discountTiers)) {
      const tier = stay.discountTiers.find(t => nightsCount >= (t.minimumDays || 0) && nightsCount <= (t.maximumDays || 999));
      if (tier) {
        appliedDiscountPercent = parseFloat(tier.discountPercentage || 0);
      }
    }

    const discountedPerNight = originalPerNight * (1 - (appliedDiscountPercent / 100));
    const preTaxSubtotal = discountedPerNight * Math.max(1, nightsCount) * (selectedRoom ? roomsCount : 1);
    const discountAmount = (originalPerNight * Math.max(1, nightsCount) * (selectedRoom ? roomsCount : 1)) - preTaxSubtotal;

    // Taxes and Fees (Calculated but not shown in modal total per user request)
    const gst = preTaxSubtotal * 0.18; // 18% GST
    const serviceFee = preTaxSubtotal * 0.02; // 2% Service Fee
    const finalTotalWithTax = preTaxSubtotal + gst + serviceFee;

    return {
      perNight: discountedPerNight,
      originalPerNight,
      subtotal: preTaxSubtotal, // Modal shows pre-tax total
      finalTotal: finalTotalWithTax, // Passed to confirm and pay
      basePrice,
      extraTotal,
      nightsCount,
      roomsCount,
      discount: discountAmount,
      discountPercent: appliedDiscountPercent,
      warning,
      isOver,
      extraAdultPrice,
      extraChildPrice,
      gst,
      serviceFee
    };
  }, [stay, selectedRoom, selectedMealPlan, guests, nightsCount, roomsCount]);

  const handleReserve = async () => {
    if (!checkInDate || !checkOutDate) {
      alert("Please select your stay dates.");
      return;
    }

    if (!checkOutDate.isAfter(checkInDate, 'day')) {
      alert("Check-out date must be after Check-in date.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        stayId: Number(stay.stayId || stay.id),
        checkInDate: checkInDate.format("YYYY-MM-DD"),
        checkOutDate: checkOutDate.format("YYYY-MM-DD"),
        numberOfGuests: (guests.adults || 1) + (guests.children || 0),
        amount: pricing.finalTotal, // Use final total with tax
        paymentMethod: "razorpay",
        rooms: selectedRoom ? [{
          roomId: selectedRoom.roomId || selectedRoom.id,
          roomsBooked: roomsCount,
          adults: guests.adults || 1,
          children: guests.children || 0,
          mealPlanCode: selectedMealPlan || "EP"
        }] : []
      };

      const response = await createStayOrder(payload);
      
      // Save local storage for checkout
      const paymentResponse = response?.payment || response;
      localStorage.setItem("pendingPayment", JSON.stringify({
        paymentMethod: "razorpay",
        razorpayOrderId: paymentResponse.razorpayOrderId,
        razorpayKeyId: paymentResponse.razorpayKeyId,
        amount: Math.round(pricing.finalTotal * 100), // Use final total with tax
        currency: paymentResponse.currency || "INR"
      }));

      const receipt = [
        { title: `Base Stay (${pricing.nightsCount} nights)`, content: `₹${formatPrice(pricing.originalPerNight * pricing.nightsCount * pricing.roomsCount)}` }
      ];

      if (pricing.extraTotal > 0) {
        receipt.push({ title: "Extra Guests Fee", content: `₹${formatPrice(pricing.extraTotal * pricing.nightsCount * pricing.roomsCount)}` });
      }

      if (pricing.discount > 0) {
        receipt.push({ title: `Discount (${pricing.discountPercent}%)`, content: `- ₹${formatPrice(pricing.discount)}` });
      }

      // Add Taxes only to the final receipt for Confirm and Pay page
      receipt.push({ title: "GST (18%)", content: `₹${formatPrice(pricing.gst)}` });
      receipt.push({ title: "Service Fee (2%)", content: `₹${formatPrice(pricing.serviceFee)}` });
      receipt.push({ title: "Total", content: `₹${formatPrice(pricing.finalTotal)}` });

      const bookingData = {
        stayId: payload.stayId,
        listingTitle: stay.propertyName || stay.title || "Stay",
        listingImage: stay.coverPhotoUrl || stay.coverImageUrl || "",
        isStay: true,
        checkInDate: checkInDate.format("MMM DD, YYYY"),
        checkOutDate: checkOutDate.format("MMM DD, YYYY"),
        roomType: selectedRoom ? (selectedRoom.roomName || selectedRoom.name) : "Full Property",
        roomsBooked: roomsCount,
        guests: guests,
        receipt: receipt
      };
      localStorage.setItem("pendingBooking", JSON.stringify(bookingData));

      history.push("/checkout");
    } catch (err) {
      console.error(err);
      alert("Booking failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
        .DateInput_input {
          font-size: 14px !important;
          padding: 0 !important;
          height: auto !important;
          line-height: 1 !important;
          font-weight: 700 !important;
          background: transparent !important;
          color: ${FG} !important;
        }
        .DateInput {
          width: 100% !important;
          background: transparent !important;
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
          bottom: 40,
          right: 40,
          background: A,
          color: "#FFF",
          padding: "18px 36px",
          borderRadius: 100,
          display: "flex",
          alignItems: "center",
          gap: 12,
          boxShadow: "0 24px 48px rgba(0,0,0,0.25)",
          border: "none",
          cursor: "pointer",
          zIndex: 1000,
          fontWeight: 700,
          fontSize: 16,
          letterSpacing: "0.02em"
        }}
      >
        <Bed size={20} />
        Reserve
      </motion.button>

      <AnimatePresence>
        {show && (
          <div style={{ position: "fixed", inset: 0, zIndex: 2000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShow(false)}
              style={{ position: "absolute", inset: 0, background: "rgba(8,8,8,0.7)", backdropFilter: "blur(12px)" }} 
            />
            
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 30 }}
              style={{
                position: "relative",
                width: "100%",
                maxWidth: 480,
                background: BG,
                borderRadius: 32,
                boxShadow: "0 40px 120px rgba(0,0,0,0.5)",
                border: `1px solid ${B}`,
                overflow: "hidden"
              }}
            >
              {/* Header */}
              <div style={{ padding: "40px 40px 24px", borderBottom: `1px solid ${B}` }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <h3 className="font-display" style={{ fontSize: 28, fontWeight: 700, color: FG, marginBottom: 8 }}>Reserve Stay</h3>
                    <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                      <span style={{ fontSize: 24, fontWeight: 700, color: A }}>₹{formatPrice(pricing.perNight)}</span>
                      {pricing.discount > 0 && (
                        <span style={{ fontSize: 16, color: M, textDecoration: "line-through", opacity: 0.6 }}>₹{formatPrice(pricing.originalPerNight)}</span>
                      )}
                      <span style={{ fontSize: 14, color: M }}>/ night</span>
                    </div>
                  </div>
                  <button onClick={() => setShow(false)} style={{ background: S, border: "none", padding: 10, borderRadius: "50%", cursor: "pointer", color: FG }}>
                    <X size={20} />
                  </button>
                </div>
              </div>

              {/* Body */}
              <div style={{ padding: 40 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, background: B, border: `1px solid ${B}`, borderRadius: 20, overflow: "hidden" }}>
                  {/* Check In */}
                  <div style={{ background: S, padding: "20px 24px" }}>
                    <p style={{ fontSize: 10, fontWeight: 800, color: M, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Check-in</p>
                    <DateSingle 
                      date={checkInDate}
                      onDateChange={(date) => {
                        setCheckInDate(date);
                        // If new check-in is same or after current check-out, clear check-out
                        if (checkOutDate && date && !checkOutDate.isAfter(date, 'day')) {
                          setCheckOutDate(null);
                        }
                      }}
                      placeholder="Add date"
                      plain
                      withPortal
                      displayFormat="DD/MM/YYYY"
                    />
                  </div>
                  {/* Check Out */}
                  <div style={{ background: S, padding: "20px 24px" }}>
                    <p style={{ fontSize: 10, fontWeight: 800, color: M, textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 8 }}>Check-out</p>
                    <DateSingle 
                      date={checkOutDate}
                      onDateChange={setCheckOutDate}
                      placeholder="Add date"
                      plain
                      withPortal
                      displayFormat="DD/MM/YYYY"
                      isOutsideRange={(day) => {
                        const today = moment().startOf('day');
                        if (checkInDate) {
                          // Disable check-in day and everything before it
                          return !day.isAfter(checkInDate, 'day');
                        }
                        return day.isBefore(today, 'day');
                      }}
                    />
                  </div>
                  {/* Guests */}
                  <div style={{ gridColumn: "span 2", background: S, padding: "24px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: FG }}>Adults</p>
                        <p style={{ fontSize: 12, color: M }}>Age 13+</p>
                      </div>
                      <Counter value={guests.adults} setValue={(v) => setGuests(prev => ({...prev, adults: v}))} min={1} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <div>
                        <p style={{ fontSize: 14, fontWeight: 700, color: FG }}>Children</p>
                        <p style={{ fontSize: 12, color: M }}>Ages 2–12</p>
                      </div>
                      <Counter value={guests.children} setValue={(v) => setGuests(prev => ({...prev, children: v}))} min={0} />
                    </div>
                  </div>
                </div>

                {/* Selected Room Info */}
                {selectedRoom && (
                  <div style={{ marginTop: 32, padding: 24, background: AL, borderRadius: 20, border: `1px solid ${A}33` }}>
                    <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
                      <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: A, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF" }}>
                          <Bed size={24} />
                        </div>
                        <div>
                          <p style={{ fontSize: 15, fontWeight: 700, color: FG }}>{selectedRoom.roomName || selectedRoom.name}</p>
                          <p style={{ fontSize: 13, color: M }}>{selectedMealPlan || "EP"}</p>
                        </div>
                      </div>
                      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                        <p style={{ fontSize: 10, fontWeight: 800, color: M, textTransform: "uppercase", letterSpacing: "0.1em" }}>Rooms</p>
                        <Counter value={roomsCount} setValue={onRoomsCountChange} min={1} max={selectedRoom.availableRooms || 10} />
                      </div>
                    </div>
                  </div>
                )}

                {/* Warnings & Messages */}
                {pricing.warning && (
                  <div style={{ 
                    marginTop: 24, padding: "16px 20px", borderRadius: 16, 
                    background: pricing.isOver ? "#FFF5F5" : AL, 
                    border: `1px solid ${pricing.isOver ? "#FEB2B2" : A + '33'}`,
                    display: "flex", gap: 12, alignItems: "flex-start"
                  }}>
                    <Info size={18} color={pricing.isOver ? "#F56565" : A} style={{ marginTop: 2 }} />
                    <p style={{ fontSize: 13, color: pricing.isOver ? "#C53030" : FG, lineHeight: 1.5, fontWeight: 500 }}>
                      {pricing.warning}
                    </p>
                  </div>
                )}

                {/* Price Summary */}
                {nightsCount > 0 && (
                  <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: M, fontSize: 15 }}>
                      <span>Base Price × {nightsCount} nights</span>
                      <span>₹{formatPrice(pricing.originalPerNight * nightsCount * roomsCount)}</span>
                    </div>
                    
                    {pricing.extraTotal > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", color: M, fontSize: 15 }}>
                        <span>Extra Guests Fee</span>
                        <span>₹{formatPrice(pricing.extraTotal * nightsCount * roomsCount)}</span>
                      </div>
                    )}

                    {pricing.discount > 0 && (
                      <div style={{ display: "flex", justifyContent: "space-between", color: "#10B981", fontSize: 15, fontWeight: 600 }}>
                        <span>Discount ({pricing.discountPercent}%)</span>
                        <span>- ₹{formatPrice(pricing.discount)}</span>
                      </div>
                    )}

                    {roomsCount > 1 && (
                      <div style={{ display: "flex", justifyContent: "space-between", color: M, fontSize: 15 }}>
                        <span>Room Quantity</span>
                        <span>× {roomsCount}</span>
                      </div>
                    )}

                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 20, borderTop: `1px dashed ${B}` }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: FG }}>Total</span>
                      <span style={{ fontSize: 20, fontWeight: 800, color: A }}>₹{formatPrice(pricing.subtotal)}</span>
                    </div>
                  </div>
                )}

                {(() => {
                  const isPropertyBased = stay?.bookingScope === "Property-Based";
                  const isDisabled = loading || !checkInDate || !checkOutDate || (!isPropertyBased && !selectedRoomId) || pricing.isOver;
                  const buttonText = loading ? "Processing..." : (pricing.isOver ? "Capacity Exceeded" : ((isPropertyBased || selectedRoomId) ? "Reserve" : "Select a Room First"));

                  return (
                    <motion.button
                      whileHover={{ scale: isDisabled ? 1 : 1.02 }}
                      whileTap={{ scale: isDisabled ? 1 : 0.98 }}
                      onClick={handleReserve}
                      disabled={isDisabled}
                      style={{
                        width: "100%",
                        background: isDisabled ? M : A,
                        color: "#FFF",
                        padding: "20px",
                        borderRadius: 16,
                        border: "none",
                        fontSize: 16,
                        fontWeight: 700,
                        cursor: isDisabled ? "not-allowed" : "pointer",
                        marginTop: 32,
                        boxShadow: isDisabled ? "none" : `0 12px 24px ${A}33`
                      }}
                    >
                      {buttonText}
                    </motion.button>
                  );
                })()}

                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 24, color: M, fontSize: 13 }}>
                  <ShieldCheck size={16} />
                  <span>Secure & Private Booking</span>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default StayBookingSystem;
