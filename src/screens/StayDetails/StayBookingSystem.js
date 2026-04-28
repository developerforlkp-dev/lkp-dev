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
  roomsCount
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

  // Price Calculation Logic mirroring StayProduct.js
  const pricing = useMemo(() => {
    if (!stay) return { base: 0, extra: 0, total: 0 };
    
    let basePrice = 0;
    let extraAdultPrice = 0;
    let extraChildPrice = 0;
    let maxAdults = stay.maxAdults || 0;
    let maxChildren = stay.maxChildren || 0;

    if (selectedRoom) {
      // Room-based logic
      const mealPlan = selectedMealPlan || "EP";
      const mealKey = { EP: "epPrice", BB: "bbPrice", CP: "cpPrice", MAP: "mapPrice", AP: "apPrice" }[mealPlan];
      basePrice = parseFloat(selectedRoom[mealKey] || selectedRoom.b2cPrice || selectedRoom.price || 0);
      extraAdultPrice = parseFloat(selectedRoom.extraAdultPrice || stay.extraAdultPrice || 0);
      extraChildPrice = parseFloat(selectedRoom.extraChildPrice || stay.extraChildPrice || 0);
      maxAdults = selectedRoom.maxAdults || 0;
      maxChildren = selectedRoom.maxChildren || 0;
    } else {
      // Property-based fallback
      basePrice = parseFloat(stay.fullPropertyB2cPrice || stay.b2cPrice || stay.price || 0);
      extraAdultPrice = parseFloat(stay.fullPropertyExtraAdultPrice || stay.extraAdultPrice || 0);
      extraChildPrice = parseFloat(stay.fullPropertyExtraChildPrice || stay.extraChildPrice || 0);
    }

    const extraAdults = Math.max(0, (guests?.adults || 1) - maxAdults);
    const extraChildren = Math.max(0, (guests?.children || 0) - maxChildren);
    const extraTotal = (extraAdults * extraAdultPrice) + (extraChildren * extraChildPrice);
    
    const perNight = basePrice + extraTotal;
    const subtotal = perNight * Math.max(1, nightsCount) * (selectedRoom ? roomsCount : 1);

    return {
      perNight,
      subtotal,
      basePrice,
      extraTotal,
      nightsCount,
      roomsCount
    };
  }, [stay, selectedRoom, selectedMealPlan, guests, nightsCount, roomsCount]);

  const handleReserve = async () => {
    if (!checkInDate || !checkOutDate) {
      alert("Please select your stay dates.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        stayId: Number(stay.stayId || stay.id),
        checkInDate: checkInDate.format("YYYY-MM-DD"),
        checkOutDate: checkOutDate.format("YYYY-MM-DD"),
        numberOfGuests: (guests.adults || 1) + (guests.children || 0),
        amount: pricing.subtotal,
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
        amount: Math.round(pricing.subtotal * 100),
        currency: paymentResponse.currency || "INR"
      }));

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
        receipt: [
          { title: "Stay total", content: `₹${formatPrice(pricing.subtotal)}` }
        ]
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
                    <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                      <span style={{ fontSize: 24, fontWeight: 700, color: A }}>₹{formatPrice(pricing.perNight)}</span>
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
                      onDateChange={setCheckInDate}
                      placeholder="Add date"
                      plain
                      withPortal
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
                    <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                      <div style={{ width: 48, height: 48, borderRadius: 12, background: A, display: "flex", alignItems: "center", justifyContent: "center", color: "#FFF" }}>
                        <Bed size={24} />
                      </div>
                      <div>
                        <p style={{ fontSize: 15, fontWeight: 700, color: FG }}>{selectedRoom.roomName || selectedRoom.name}</p>
                        <p style={{ fontSize: 13, color: M }}>{roomsCount} Room{roomsCount > 1 ? 's' : ''} · {selectedMealPlan || "EP"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Price Summary */}
                {nightsCount > 0 && (
                  <div style={{ marginTop: 32, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", color: M, fontSize: 15 }}>
                      <span>₹{formatPrice(pricing.perNight)} × {nightsCount} nights</span>
                      <span>₹{formatPrice(pricing.perNight * nightsCount)}</span>
                    </div>
                    {roomsCount > 1 && (
                      <div style={{ display: "flex", justifyContent: "space-between", color: M, fontSize: 15 }}>
                        <span>Quantity × {roomsCount}</span>
                        <span>—</span>
                      </div>
                    )}
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, paddingTop: 20, borderTop: `1px dashed ${B}` }}>
                      <span style={{ fontSize: 18, fontWeight: 700, color: FG }}>Total</span>
                      <span style={{ fontSize: 20, fontWeight: 800, color: A }}>₹{formatPrice(pricing.subtotal)}</span>
                    </div>
                  </div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReserve}
                  disabled={loading || !checkInDate || !checkOutDate || !selectedRoomId}
                  style={{
                    width: "100%",
                    background: (!checkInDate || !checkOutDate || !selectedRoomId) ? M : A,
                    color: "#FFF",
                    padding: "20px",
                    borderRadius: 16,
                    border: "none",
                    fontSize: 16,
                    fontWeight: 700,
                    cursor: (loading || !checkInDate || !checkOutDate || !selectedRoomId) ? "not-allowed" : "pointer",
                    marginTop: 32,
                    boxShadow: `0 12px 24px ${A}33`
                  }}
                >
                  {loading ? "Processing..." : (selectedRoomId ? "Reserve" : "Select a Room First")}
                </motion.button>

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
