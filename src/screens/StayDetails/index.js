import React, { useEffect, useMemo, useState } from "react";
import moment from "moment";
import { useLocation } from "react-router-dom";
import {
  BedDouble,
  CalendarDays,
  ChevronRight,
  Check,
  CircleCheck,
  Clock3,
  Globe,
  Grid2x2,
  Heart,
  Info,
  List,
  Mail,
  MapPin,
  Phone,
  Share2,
  Shield,
  Star,
  Users,
} from "lucide-react";
import cn from "classnames";
import DateSingle from "../../components/DateSingle";
import GuestPicker from "../../components/GuestPicker";
import {
  createStayBooking,
  fallbackStayDetails,
  fetchRoomAvailability,
  fetchStayDetails,
  normalizeStayDetails,
} from "./stayDetailsData";
import styles from "./StayDetails.module.sass";

const ImageGallery = ({ gallery, title }) => {
  const [featured, ...supporting] = gallery;

  return (
    <section className={styles.gallery}>
      <div className={cn(styles.galleryCard, styles.galleryCardFeatured)}>
        <img src={featured.src} alt={featured.alt || title} className={styles.galleryImage} />
      </div>
      <div className={styles.galleryGrid}>
        {supporting.map((image) => (
          <div className={styles.galleryCard} key={image.src}>
            <img src={image.src} alt={image.alt || title} className={styles.galleryImage} />
          </div>
        ))}
      </div>
    </section>
  );
};

const formatGuestLabel = (guests) => {
  const total = (guests.adults || 0) + (guests.children || 0);
  if (total === 0) return "Add guests";
  if (total === 1) return "1 Guest";
  return `${total} Guests`;
};

const formatDateForApi = (date) => (moment.isMoment(date) ? date.format("YYYY-MM-DD") : "");

const getCachedGuestDetails = () => {
  try {
    const userInfo = JSON.parse(localStorage.getItem("userInfo") || "{}");
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    const customerData = JSON.parse(localStorage.getItem("customerData") || "{}");

    const customerName =
      userInfo.firstName ||
      userData.firstName ||
      customerData.firstName ||
      localStorage.getItem("firstName") ||
      "guest";

    const customerEmail =
      userInfo.email ||
      userData.email ||
      customerData.email ||
      localStorage.getItem("email") ||
      "guest@gmail.com";

    const customerPhone =
      userInfo.customerPhone ||
      userInfo.phoneNumber ||
      userInfo.phone ||
      customerData.customerPhone ||
      customerData.phoneNumber ||
      userData.phoneNumber ||
      localStorage.getItem("customerPhone") ||
      localStorage.getItem("phoneNumber") ||
      localStorage.getItem("phone") ||
      "";

    return {
      customerName: customerName || "guest",
      customerEmail: customerEmail || "guest@gmail.com",
      customerPhone,
    };
  } catch (error) {
    return {
      customerName: "guest",
      customerEmail: "guest@gmail.com",
      customerPhone:
        localStorage.getItem("customerPhone") ||
        localStorage.getItem("phoneNumber") ||
        localStorage.getItem("phone") ||
        "",
    };
  }
};

const RoomCountPicker = ({ visible, maxRooms, value, onSelect, onClose }) => {
  if (!visible) return null;

  return (
    <div className={styles.roomPicker}>
      <div className={styles.roomPickerHeader}>
        <span>ROOMS</span>
        <button type="button" className={styles.roomPickerClose} onClick={onClose}>
          Close
        </button>
      </div>
      <div className={styles.roomPickerList}>
        {Array.from({ length: Math.max(1, maxRooms) }, (_, index) => index + 1).map((count) => (
          <button
            key={count}
            type="button"
            className={cn(styles.roomPickerItem, {
              [styles.roomPickerItemActive]: value === count,
            })}
            onClick={() => {
              onSelect(count);
              onClose();
            }}
          >
            {count} room{count > 1 ? "s" : ""}
          </button>
        ))}
      </div>
    </div>
  );
};

const BookingCard = ({
  details,
  checkInDate,
  checkOutDate,
  guests,
  showGuestPicker,
  setShowGuestPicker,
  setCheckInDate,
  setCheckOutDate,
  setGuests,
  onAvailability,
  onBookNow,
  isSubmitting,
  isRoomBased,
  selectedRoom,
}) => (
  <aside className={styles.sidebarCard}>
    <div className={styles.bookingHeader}>
      <div>
        <span className={styles.priceValue}>Rs.{details.price}</span>
        <span className={styles.priceSuffix}> / night</span>
      </div>
      <div className={styles.ratingPill}>
        <Star size={14} fill="currentColor" />
        <span>{details.rating}</span>
      </div>
    </div>

    <div className={styles.bookingGrid}>
      <div className={styles.field}>
        <span>CHECK-IN</span>
        <div className={styles.dateField}>
          <DateSingle
            className={styles.datePicker}
            placeholder="Add date"
            displayFormat="MMM DD, YYYY"
            date={checkInDate}
            onDateChange={setCheckInDate}
            id="stay-details-check-in"
            plain
          />
          <CalendarDays size={14} className={styles.fieldIcon} />
        </div>
      </div>

      <div className={styles.field}>
        <span>CHECK-OUT</span>
        <div className={styles.dateField}>
          <DateSingle
            className={styles.datePicker}
            placeholder="Add date"
            displayFormat="MMM DD, YYYY"
            date={checkOutDate}
            onDateChange={setCheckOutDate}
            id="stay-details-check-out"
            plain
          />
          <CalendarDays size={14} className={styles.fieldIcon} />
        </div>
      </div>

      <div className={cn(styles.field, styles.fieldWide, styles.guestFieldWrap)}>
        <span>GUESTS</span>
        <button
          type="button"
          className={styles.fieldButton}
          onClick={() => setShowGuestPicker(!showGuestPicker)}
        >
          <span>{formatGuestLabel(guests)}</span>
          <span className={styles.fieldButtonIcon}>
            <Users size={14} />
          </span>
        </button>
        <div className={styles.guestPickerWrap}>
          <GuestPicker
            visible={showGuestPicker}
            onClose={() => setShowGuestPicker(false)}
            onGuestChange={setGuests}
            initialGuests={guests}
            className={styles.guestPickerPopover}
          />
        </div>
      </div>
    </div>

    <button type="button" className={styles.availabilityButton} onClick={isRoomBased && selectedRoom ? onBookNow : onAvailability} disabled={isSubmitting}>
      {isSubmitting ? "Processing..." : isRoomBased && selectedRoom ? "Book Now" : "Check Availability"}
    </button>
    <p className={styles.helperText}>You won't be charged yet</p>
  </aside>
);

const ContactCard = ({ manager }) => (
  <aside className={styles.sidebarCard}>
    <h3 className={styles.contactTitle}>Contact Property</h3>
    <div className={styles.managerRow}>
      <div className={styles.managerBadge}>{manager.initials}</div>
      <div>
        <p className={styles.managerMeta}>{manager.role}</p>
        <p className={styles.managerName}>{manager.name}</p>
      </div>
    </div>

    <button type="button" className={styles.contactAction}>
      <Phone size={16} />
      <span>{manager.phone}</span>
    </button>
    <button type="button" className={styles.contactAction}>
      <Mail size={16} />
      <span>{manager.email}</span>
    </button>
    <button type="button" className={styles.contactAction}>
      <Globe size={16} />
      <span>{manager.website}</span>
    </button>
  </aside>
);

const RoomCard = ({ room, selectedRoom, onToggleSelect, onRoomsBookedChange, roomPickerOpen, setRoomPickerOpen }) => {
  const isSelected = selectedRoom?.roomId === room.roomId;

  return (
    <article className={styles.roomCard}>
      <div className={styles.roomImageWrap}>
        <span className={styles.roomType}>{room.type}</span>
        <img src={room.image} alt={room.title} className={styles.roomImage} />
      </div>

      <div className={styles.roomContent}>
        <h3 className={styles.roomTitle}>{room.title}</h3>
        <div className={styles.roomMeta}>
          <span>
            <Users size={14} />
            {room.guests}
          </span>
          <span>
            <BedDouble size={14} />
            {room.units}
          </span>
        </div>
        <p className={styles.roomDescription}>{room.description}</p>
        <div className={styles.amenityList}>
          {room.amenities.map((amenity) => (
            <span className={styles.amenityChip} key={amenity}>
              {amenity}
            </span>
          ))}
        </div>
        <div className={styles.roomFooter}>
          <div>
            <span className={styles.roomPriceLabel}>{room.priceLabel || "STARTING FROM"}</span>
            <div className={styles.roomPriceRow}>
              <span className={styles.roomPrice}>Rs.{room.price}</span>
              <span className={styles.roomPriceSuffix}>/ night</span>
            </div>
          </div>

          <div className={styles.roomActionGroup}>
            <button type="button" className={styles.selectButton} onClick={() => onToggleSelect(room)}>
              <span>{isSelected ? "Selected Room" : "Select Room"}</span>
              <ChevronRight size={16} />
            </button>

            {isSelected && (
              <div className={styles.roomPickerWrap}>
                <button
                  type="button"
                  className={styles.roomPickerTrigger}
                  onClick={() => setRoomPickerOpen(!roomPickerOpen)}
                >
                  <span>{selectedRoom.roomsBooked} room{selectedRoom.roomsBooked > 1 ? "s" : ""}</span>
                  <ChevronRight size={14} className={cn(styles.roomPickerChevron, roomPickerOpen && styles.roomPickerChevronOpen)} />
                </button>
                <RoomCountPicker
                  visible={roomPickerOpen}
                  maxRooms={Number(room.availableRooms || 1)}
                  value={selectedRoom.roomsBooked}
                  onSelect={(count) => onRoomsBookedChange(room.roomId, count)}
                  onClose={() => setRoomPickerOpen(false)}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

const AmenitiesPanel = ({ details }) => (
  <section className={cn(styles.sectionBlock, styles.panelSection)}>
    <div className={styles.panelGrid}>
      <div>
        <div className={styles.panelHeading}>
          <Grid2x2 size={22} />
          <h2 className={styles.sectionTitle}>Property Amenities</h2>
        </div>
        <div className={styles.featureGrid}>
          {details.amenities.property.map((item) => (
            <div key={item} className={styles.featureItem}>
              <span className={cn(styles.featureIcon, styles.featureIconGreen)}>
                <Check size={16} />
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className={styles.panelHeading}>
          <List size={22} />
          <h2 className={styles.sectionTitle}>Facilities & Services</h2>
        </div>
        <div className={styles.featureGrid}>
          {details.amenities.services.map((item) => (
            <div key={item} className={styles.featureItem}>
              <span className={cn(styles.featureIcon, styles.featureIconBlue)}>
                <Check size={16} />
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const PoliciesPanel = ({ details }) => (
  <section className={cn(styles.sectionBlock, styles.panelSection)}>
    <div className={styles.policyShell}>
      <div className={styles.policyGrid}>
        <div className={styles.policyBlock}>
          <div className={styles.panelHeading}>
            <Clock3 size={22} />
            <h2 className={styles.sectionTitle}>Check-in / Check-out</h2>
          </div>
          <div className={styles.policyCard}>
            {details.policies.checkin.map((item) => (
              <div key={item.label} className={styles.policyRow}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.policyBlock}>
          <div className={styles.panelHeading}>
            <Shield size={22} />
            <h2 className={styles.sectionTitle}>Cancellation Policy</h2>
          </div>
          <div className={styles.policyCard}>
            <p className={styles.policyText}>{details.policies.cancellation}</p>
          </div>
        </div>
      </div>

      <div className={styles.policyBlock}>
        <div className={styles.panelHeading}>
          <CircleCheck size={22} />
          <h2 className={styles.sectionTitle}>House Rules</h2>
        </div>
        <div className={styles.policyCard}>
          <p className={styles.policyText}>{details.policies.houseRules}</p>
        </div>
      </div>

      <div className={styles.policyBlock}>
        <div className={styles.panelHeading}>
          <Info size={22} />
          <h2 className={styles.sectionTitle}>Arrival Instructions</h2>
        </div>
        <div className={styles.policyCard}>
          <p className={styles.policyText}>{details.policies.arrivalInstructions}</p>
        </div>
      </div>
    </div>
  </section>
);

const StayDetailsPage = () => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(fallbackStayDetails.secondaryTabs[0]);
  const [details, setDetails] = useState(fallbackStayDetails);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [checkInDate, setCheckInDate] = useState(moment());
  const [checkOutDate, setCheckOutDate] = useState(moment().add(1, "day"));
  const [showGuestPicker, setShowGuestPicker] = useState(false);
  const [guests, setGuests] = useState({ adults: 2, children: 0, infants: 0, pets: 0 });
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [roomPickerOpen, setRoomPickerOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stayId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get("id") || "2";
  }, [location.search]);

  const isRoomBased = details.bookingScope === "Room-Based";

  useEffect(() => {
    let mounted = true;

    const loadStay = async () => {
      try {
        setLoading(true);
        setError("");
        const stay = await fetchStayDetails(stayId);
        if (!mounted) return;
        setDetails(normalizeStayDetails(stay));
      } catch (err) {
        if (!mounted) return;
        setError("Unable to load stay details right now.");
        setDetails(fallbackStayDetails);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    loadStay();
    return () => {
      mounted = false;
    };
  }, [stayId]);

  const handleCheckAvailability = async () => {
    if (!isRoomBased) return;
    const checkIn = formatDateForApi(checkInDate);
    const checkOut = formatDateForApi(checkOutDate);
    if (!checkIn || !checkOut) return;

    try {
      setIsSubmitting(true);
      const response = await fetchRoomAvailability(stayId, checkIn, checkOut);
      const availableRooms = (response?.rooms || []).map((room, index) => {
        const mealPlanCode = Object.keys(room.mealPlanPricing || {})[0] || "EP";
        const plan = room.mealPlanPricing?.[mealPlanCode] || {};
        return {
          roomId: room.roomId,
          type: `Room ${index + 1}`,
          title: room.roomName,
          description: details.rooms[index]?.description || fallbackStayDetails.rooms[0].description,
          guests: `Max ${room.maxGuests || room.maxAdults || 2} Guests`,
          units: `${room.availableRooms || room.totalRooms || 1} Units`,
          price: Number(plan.b2cPrice || room.b2cPrice || 0).toLocaleString("en-IN"),
          priceLabel: "AVAILABLE RATE",
          image: details.rooms[index]?.image || fallbackStayDetails.rooms[0].image,
          amenities: details.rooms[index]?.amenities || fallbackStayDetails.rooms[0].amenities,
          availableRooms: Number(room.availableRooms || 1),
          mealPlanCode,
          maxAdults: Number(room.maxAdults || 0),
          maxChildren: Number(room.maxChildren || 0),
          maxGuests: Number(room.maxGuests || room.maxAdults || 2),
        };
      });

      setDetails((prev) => ({
        ...prev,
        rooms: availableRooms.length ? availableRooms : prev.rooms,
      }));
      setSelectedRoom(null);
      setRoomPickerOpen(false);
    } catch (err) {
      window.alert("Unable to check room availability right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleSelectRoom = (room) => {
    setSelectedRoom((prev) =>
      prev?.roomId === room.roomId
        ? null
        : {
            ...room,
            roomsBooked: 1,
          }
    );
    setRoomPickerOpen(false);
  };

  const handleRoomsBookedChange = (roomId, roomsBooked) => {
    setSelectedRoom((prev) => (prev && prev.roomId === roomId ? { ...prev, roomsBooked } : prev));
  };

  const handleBookNow = async () => {
    if (!selectedRoom) return;
    const cachedGuest = getCachedGuestDetails();
    if (!cachedGuest.customerPhone) {
      window.alert("Phone number is not available in cache.");
      return;
    }

    const payload = {
      stayId: Number(details.stayId || stayId),
      checkInDate: formatDateForApi(checkInDate),
      checkOutDate: formatDateForApi(checkOutDate),
      numberOfGuests: (guests.adults || 0) + (guests.children || 0),
      customerName: cachedGuest.customerName,
      customerEmail: cachedGuest.customerEmail,
      customerPhone: cachedGuest.customerPhone,
      specialRequests: "",
      rooms: [
        {
          roomId: Number(selectedRoom.roomId),
          roomsBooked: Number(selectedRoom.roomsBooked || 1),
          adults: Number(guests.adults || 0),
          children: Number(guests.children || 0),
          mealPlanCode: selectedRoom.mealPlanCode || "EP",
          extraBeds: 0,
        },
      ],
    };

    try {
      setIsSubmitting(true);
      await createStayBooking(payload);
      window.alert("Stay booking created successfully.");
    } catch (err) {
      window.alert("Unable to create booking right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.content}>
        <section className={styles.hero}>
          <div className={styles.badges}>
            {details.badges.map((badge, index) => (
              <span
                key={`${badge}-${index}`}
                className={cn(styles.badge, {
                  [styles.badgeAccent]: index === 0,
                  [styles.badgeGold]: index === 2,
                })}
              >
                {index === 2 && <Star size={12} fill="currentColor" />}
                {badge}
              </span>
            ))}
          </div>

          <div className={styles.heroHead}>
            <div>
              <h1 className={styles.title}>{details.title}</h1>
              <p className={styles.location}>
                <MapPin size={16} />
                <span>{details.subtitle}</span>
              </p>
            </div>
            <div className={styles.heroActions}>
              <button type="button" className={styles.actionButton}>
                <Share2 size={16} />
                <span>Share</span>
              </button>
              <button type="button" className={styles.actionButton}>
                <Heart size={16} />
                <span>Save</span>
              </button>
            </div>
          </div>
          {error ? <p className={styles.statusText}>{error}</p> : null}
          {loading ? <p className={styles.statusText}>Loading stay details...</p> : null}
        </section>

        <ImageGallery gallery={details.gallery} title={details.title} />

        <section className={styles.mainGrid}>
          <div className={styles.primaryColumn}>
            <div className={styles.secondaryTabs}>
              {details.secondaryTabs.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  className={cn(styles.secondaryTab, {
                    [styles.secondaryTabActive]: tab === activeTab,
                  })}
                  onClick={() => setActiveTab(tab)}
                >
                  {tab}
                </button>
              ))}
            </div>

            {activeTab === "Overview" && (
              <section className={styles.tabContent}>
                <section className={styles.sectionBlock}>
                  <h2 className={styles.sectionTitle}>About this property</h2>
                  <p className={styles.bodyCopy}>{details.overview}</p>

                  <div className={styles.statsCard}>
                    {details.stats.map((item) => (
                      <div key={item.label}>
                        <p className={styles.statLabel}>{item.label}</p>
                        <p className={styles.statValue}>{item.value}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </section>
            )}
            {activeTab === "Amenities" && <AmenitiesPanel details={details} />}
            {activeTab === "Policies" && <PoliciesPanel details={details} />}

            <section className={styles.sectionBlock}>
              <div className={styles.sectionRow}>
                <div>
                  <h2 className={styles.sectionTitle}>Available Rooms</h2>
                  <p className={styles.sectionSubtitle}>Select your perfect accommodation</p>
                </div>
                <span className={styles.infoBadge}>{details.rooms.length} room types found</span>
              </div>

              <div className={styles.roomList}>
                {details.rooms.map((room) => (
                  <RoomCard
                    key={`${room.roomId}-${room.title}`}
                    room={room}
                    selectedRoom={selectedRoom}
                    onToggleSelect={handleToggleSelectRoom}
                    onRoomsBookedChange={handleRoomsBookedChange}
                    roomPickerOpen={roomPickerOpen && selectedRoom?.roomId === room.roomId}
                    setRoomPickerOpen={setRoomPickerOpen}
                  />
                ))}
              </div>
            </section>

            <section className={styles.sectionBlock}>
              <h2 className={styles.sectionTitle}>Where you'll be</h2>
              <div className={styles.mapCard}>
                <div className={styles.mapLabel}>
                  <h3>{details.title}</h3>
                  <p>{details.subtitle}</p>
                </div>
                <button type="button" className={styles.mapButton}>
                  <MapPin size={16} />
                  <span>View in Google Maps</span>
                </button>
              </div>
            </section>
          </div>

          <div className={styles.sidebar}>
            <BookingCard
              details={details}
              checkInDate={checkInDate}
              checkOutDate={checkOutDate}
              guests={guests}
              showGuestPicker={showGuestPicker}
              setShowGuestPicker={setShowGuestPicker}
              setCheckInDate={setCheckInDate}
              setCheckOutDate={setCheckOutDate}
              setGuests={setGuests}
              onAvailability={handleCheckAvailability}
              onBookNow={handleBookNow}
              isSubmitting={isSubmitting}
              isRoomBased={isRoomBased}
              selectedRoom={selectedRoom}
            />
            <ContactCard manager={details.manager} />
          </div>
        </section>
      </main>
    </div>
  );
};

export default StayDetailsPage;
