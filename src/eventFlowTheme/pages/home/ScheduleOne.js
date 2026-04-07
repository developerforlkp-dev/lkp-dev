"use client";
import React, { useEffect, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import GuestPicker from '../../../components/GuestPicker';
import { createEventOrder, getEventDetails } from '../../../utils/api';

const formatTimeLabel = (timeValue) => {
    if (!timeValue) return '';
    const [hoursRaw, minutesRaw = '00'] = String(timeValue).split(':');
    const hours = Number(hoursRaw);
    const minutes = Number(minutesRaw);

    if (!Number.isFinite(hours) || !Number.isFinite(minutes)) {
        return String(timeValue);
    }

    const suffix = hours >= 12 ? 'PM' : 'AM';
    const normalizedHours = hours % 12 || 12;
    return `${normalizedHours}:${String(minutes).padStart(2, '0')} ${suffix}`;
};

const formatLongDate = (dateValue) => {
    const parsed = new Date(dateValue);
    if (Number.isNaN(parsed.getTime())) return dateValue;
    return parsed.toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
};

const getNumericPrice = (price) => {
    const num = parseFloat(price);
    return Number.isFinite(num) ? num : 0;
};

const asNumber = (value) => {
    const num = typeof value === 'number' ? value : Number(value);
    return Number.isFinite(num) ? num : null;
};

const getSlotIdentifier = (slot, fallbackIndex = '') => {
    if (slot && typeof slot === 'object') {
        return String(slot.slotId || slot.id || slot.eventSlotId || fallbackIndex);
    }

    if (typeof slot === 'number' || typeof slot === 'string') {
        return String(slot);
    }

    return String(fallbackIndex);
};

const ScheduleOne = () => {
    const history = useHistory();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const eventId = queryParams.get('id') || '3';

    const [ticketTypes, setTicketTypes] = useState([]);
    const [eventInfo, setEventInfo] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('');
    const [openGuestPickerFor, setOpenGuestPickerFor] = useState(null);
    const [readyToConfirmFor, setReadyToConfirmFor] = useState(null);
    const [bookingTicketKey, setBookingTicketKey] = useState(null);
    const [selectedGuests, setSelectedGuests] = useState({
        adults: 1,
        children: 0,
        infants: 0,
        pets: 0,
    });

    useEffect(() => {
        let mounted = true;

        const fetchEventData = async () => {
            try {
                const data = await getEventDetails(eventId);
                if (!mounted) return;
                setEventInfo(data);
                setTicketTypes(Array.isArray(data?.ticketTypes) ? data.ticketTypes : []);
            } catch (err) {
                console.error('Failed to fetch event for schedule:', err);
                if (mounted) {
                    setTicketTypes([]);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchEventData();
        return () => {
            mounted = false;
        };
    }, [eventId]);

    const getSlotSource = (ticket) => {
        if (Array.isArray(ticket?.applicableSlots) && ticket.applicableSlots.length > 0) {
            return ticket.applicableSlots;
        }

        const eventSlots = Array.isArray(eventInfo?.slots) ? eventInfo.slots : [];
        const ticketSlotIds = new Set(
            [
                ...(Array.isArray(ticket?.slotIds) ? ticket.slotIds : []),
                ...(Array.isArray(ticket?.slots) ? ticket.slots : []),
            ]
                .map((slot, index) => getSlotIdentifier(slot, index))
                .filter(Boolean)
        );

        if (ticketSlotIds.size > 0 && eventSlots.length > 0) {
            return eventSlots.filter((slot, index) => ticketSlotIds.has(getSlotIdentifier(slot, index)));
        }

        if (Array.isArray(ticket?.slots) && ticket.slots.length > 0) {
            return ticket.slots;
        }

        if (eventSlots.length > 0) {
            return eventSlots;
        }

        return [];
    };

    const getAvailableSlots = (ticket) => {
        const slotSource = getSlotSource(ticket);

        if (slotSource.length > 0) {
            return slotSource
                .map((slot) => {
                    if (typeof slot === 'number') return slot;
                    if (typeof slot === 'string') {
                        const parsed = Number(slot);
                        return Number.isFinite(parsed) ? parsed : null;
                    }
                    if (slot && typeof slot === 'object') {
                        return (
                            slot.availableTickets ??
                            slot.available_slots ??
                            slot.availableSlots ??
                            slot.remainingTickets ??
                            slot.remainingCapacity ??
                            slot.capacity ??
                            slot.totalTickets ??
                            null
                        );
                    }
                    return null;
                })
                .filter((count) => count != null);
        }

        if (ticket?.totalTickets != null) {
            return [ticket.totalTickets];
        }

        return [];
    };

    const getSlotDetails = (ticket) => {
        return getSlotSource(ticket)
            .map((slot, index) => {
                if (!slot || typeof slot !== 'object') {
                    if (typeof slot === 'string' && Number.isNaN(Number(slot))) {
                        return {
                            id: `slot-${index}`,
                            name: slot,
                            timeLabel: '',
                            dateValue: null,
                        };
                    }
                    return null;
                }

                const startTime = slot.startTime || slot.slotStartTime || slot.time || '';
                const endTime = slot.endTime || slot.slotEndTime || '';

                return {
                    id: String(slot.slotId || slot.id || slot.eventSlotId || index),
                    name: slot.slotName || slot.name || slot.title || slot.slot_name || slot.label || `Slot ${index + 1}`,
                    timeLabel: [formatTimeLabel(startTime), formatTimeLabel(endTime)].filter(Boolean).join(' - '),
                    dateValue: slot.slotStartDate || slot.slotDate || slot.date || slot.eventDate || null,
                };
            })
            .filter(Boolean);
    };

    const getTicketKey = (ticket, index) => String(ticket?.ticketTypeId || ticket?.id || ticket?.name || index);

    const getCustomerDetailsForBooking = () => {
        const userInfoRaw = localStorage.getItem('userInfo');
        const userInfo = userInfoRaw ? JSON.parse(userInfoRaw) : {};

        return {
            firstName: userInfo?.firstName || localStorage.getItem('firstName') || '',
            lastName: userInfo?.lastName || localStorage.getItem('lastName') || '',
            email: userInfo?.email || localStorage.getItem('email') || '',
            phone:
                userInfo?.customerPhone ||
                userInfo?.phoneNumber ||
                userInfo?.phone ||
                localStorage.getItem('phone') ||
                localStorage.getItem('phoneNumber') ||
                '',
        };
    };

    const hasValidJwtToken = () => {
        const raw = localStorage.getItem('jwtToken');
        const token = typeof raw === 'string' ? raw.trim() : '';
        return !!token && token !== 'undefined' && token !== 'null' && token !== 'NaN';
    };

    const formatPrice = (price) => {
        if (price == null || price === '') return null;
        const num = parseFloat(price);
        if (Number.isNaN(num)) return price;
        return `₹${num.toLocaleString('en-IN')}`;
    };

    const scheduleTabs = useMemo(() => {
        const uniqueDates = [];
        const seenDates = new Set();

        const addDate = (dateValue) => {
            if (!dateValue || seenDates.has(dateValue)) return;
            seenDates.add(dateValue);
            uniqueDates.push(dateValue);
        };

        const startDate = eventInfo?.startDate;
        const endDate = eventInfo?.endDate || eventInfo?.startDate;

        if (startDate) {
            const current = new Date(startDate);
            const end = new Date(endDate);
            if (!Number.isNaN(current.getTime()) && !Number.isNaN(end.getTime())) {
                while (current <= end) {
                    addDate(current.toISOString().slice(0, 10));
                    current.setDate(current.getDate() + 1);
                }
            } else {
                addDate(startDate);
            }
        }

        const slotSource = [
            ...(Array.isArray(eventInfo?.slots) ? eventInfo.slots : []),
            ...ticketTypes.flatMap((ticket) => (Array.isArray(ticket?.applicableSlots) ? ticket.applicableSlots : [])),
        ];

        slotSource.forEach((slot) => {
            if (slot && typeof slot === 'object') {
                addDate(slot.slotStartDate || slot.slotDate || slot.date || slot.eventDate);
            }
        });

        return uniqueDates.map((dateValue, index) => ({
            id: `day-${index + 1}`,
            title: `Day ${String(index + 1).padStart(2, '0')}`,
            dateValue,
            label: formatLongDate(dateValue),
        }));
    }, [eventInfo, ticketTypes]);

    useEffect(() => {
        if (scheduleTabs.length > 0 && !scheduleTabs.some((tab) => tab.id === activeTab)) {
            setActiveTab(scheduleTabs[0].id);
        }
    }, [activeTab, scheduleTabs]);

    const activeScheduleTab = scheduleTabs.find((tab) => tab.id === activeTab) || scheduleTabs[0] || null;
    const totalGuests = selectedGuests.adults + selectedGuests.children;
    const guestCountLabel = totalGuests === 1 ? '1 guest' : `${totalGuests} guests`;

    const handleScheduleBooking = async (ticket, slotDetail, bookingDate, ticketKey) => {
        if (totalGuests < 1 || bookingTicketKey) return;

        if (!hasValidJwtToken()) {
            alert('Please log in to continue with booking.');
            return;
        }

        const eventIdNum = asNumber(eventInfo?.eventId ?? eventInfo?.event_id ?? eventInfo?.id ?? eventId) ?? 0;
        const eventSlotIdNum = asNumber(slotDetail?.id);
        const ticketTypeId = asNumber(ticket?.ticketTypeId ?? ticket?.ticket_type_id ?? ticket?.typeId ?? ticket?.id) ?? 0;
        const quantity = totalGuests;
        const pricePerTicket = getNumericPrice(ticket?.price);
        const ticketTypeName = ticket?.name || ticket?.ticketTypeName || 'General Admission';
        const customerDetails = getCustomerDetailsForBooking();

        if (!eventSlotIdNum || eventSlotIdNum <= 0) {
            alert('Unable to continue: no valid slot is available for this ticket on the selected day.');
            return;
        }

        const payload = {
            eventId: eventIdNum,
            eventSlotId: eventSlotIdNum,
            bookingDate: bookingDate || eventInfo?.startDate,
            numberOfGuests: quantity,
            customerDetails,
            tickets: [
                {
                    ticketTypeId,
                    ticketTypeName,
                    quantity,
                    pricePerTicket: Number(pricePerTicket.toFixed(2)),
                },
            ],
            appliedDiscountCode: null,
            notes: null,
        };

        try {
            setBookingTicketKey(ticketKey);

            const res = await createEventOrder(payload);
            const order = res?.order || res;
            const payment =
                res?.payment ||
                res?.data?.payment ||
                res?.order?.payment ||
                order?.payment ||
                null;

            const orderId = order?.orderId || order?.id || res?.orderId || res?.id;
            const razorpayOrderId =
                payment?.razorpayOrderId ||
                order?.razorpayOrderId ||
                res?.razorpayOrderId ||
                order?.razorpay_order_id ||
                res?.razorpay_order_id;
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
                localStorage.getItem('lastRazorpayKeyId') ||
                'rzp_test_RaBjdu0Ed3p1gN';

            if (!orderId || !razorpayOrderId || !razorpayKeyId) {
                throw new Error('Missing payment information from event order response.');
            }

            localStorage.setItem('lastRazorpayKeyId', razorpayKeyId);

            const currency = payment?.currency || eventInfo?.currency || 'INR';
            const totalAmount = quantity * pricePerTicket;
            const amountInPaise = payment?.amount || Math.round(totalAmount * 100);

            const bookingDataForCheckout = {
                eventId: eventIdNum,
                eventSlotId: eventSlotIdNum,
                listingTitle: eventInfo?.title || 'Event Booking',
                listingImage: eventInfo?.coverImageUrl || eventInfo?.coverImage || eventInfo?.gallery?.[0] || null,
                returnTo: `${location.pathname}${location.search}`,
                bookingSummary: {
                    date: formatLongDate(bookingDate || eventInfo?.startDate),
                    time: slotDetail?.timeLabel || formatTimeLabel(eventInfo?.startTime),
                    guestCount: quantity,
                },
                guests: selectedGuests,
                priceDetails: {
                    pricePerPerson: pricePerTicket,
                    totalPrice: totalAmount,
                },
                receipt: [
                    {
                        title: `${currency} ${pricePerTicket.toFixed(2)} x ${quantity} ${quantity === 1 ? 'ticket' : 'tickets'}`,
                        content: `${currency} ${totalAmount.toFixed(2)}`,
                    },
                    {
                        title: 'Total',
                        content: `${currency} ${totalAmount.toFixed(2)}`,
                    },
                ],
                currency,
                finalTotal: totalAmount,
                ticketType: ticketTypeName,
                ticketTypeId,
            };

            const paymentData = {
                orderId,
                razorpayOrderId,
                razorpayKeyId,
                amount: amountInPaise,
                currency,
                paymentMethod: 'razorpay',
                eventId: eventIdNum,
                eventSlotId: eventSlotIdNum,
                discount: payment?.discount || res?.discount || 0,
                finalAmount: payment?.finalAmount || amountInPaise,
            };

            localStorage.setItem('pendingBooking', JSON.stringify(bookingDataForCheckout));
            localStorage.setItem('pendingPayment', JSON.stringify(paymentData));
            localStorage.setItem('pendingOrderId', String(orderId));
            localStorage.removeItem('razorpayPaymentSuccess');
            localStorage.removeItem('paymentFailed');

            history.replace('/experience-checkout', {
                bookingData: bookingDataForCheckout,
                paymentData,
            });
        } catch (error) {
            console.error('Failed to create event order from schedule:', error?.response?.data || error?.message || error);
            alert(error?.response?.data?.message || error?.response?.data?.error || 'Unable to continue to payment. Please try again.');
        } finally {
            setBookingTicketKey(null);
        }
    };

    return (
        <section id="th-event" className="schedule-one">
            <div className="container">
                <div className="schedule-one__inner">
                    <div className="schedule-one__top">
                        <div className="section-title text-left">
                            <div className="section-title__tagline-box">
                                <span className="section-title__tagline">Event Schedule</span>
                            </div>
                            <h2 className="section-title__title">Follow event schedule</h2>
                        </div>

                        {scheduleTabs.length > 0 && (
                            <div className="schedule-one__main-tab-box schedule-one__main-tab-box--top tabs-box">
                                <ul className="tab-buttons schedule-one__tab-buttons--scroll clearfix list-unstyled">
                                    {scheduleTabs.map((tab) => (
                                        <li
                                            key={tab.id}
                                            className={`tab-btn ${activeTab === tab.id ? 'active-btn' : ''}`}
                                            onClick={() => setActiveTab(tab.id)}
                                        >
                                            <h3>{tab.title}</h3>
                                            <p>{tab.label}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {loading ? (
                        <p style={{ color: '#aaa', padding: '20px 0' }}>Loading ticket types...</p>
                    ) : ticketTypes.length === 0 ? (
                        <p style={{ color: '#aaa', padding: '20px 0' }}>No ticket types available.</p>
                    ) : (
                        <div className="schedule-one__main-tab-box tabs-box">
                            <div className="tabs-content">
                                {(scheduleTabs.length > 0 ? scheduleTabs : [{ id: 'default-day', dateValue: eventInfo?.startDate, label: eventInfo?.startDate }]).map((tab) => (
                                    <div
                                        key={tab.id}
                                        className={`tab ${activeTab === tab.id || (!activeTab && tab.id === 'default-day') ? 'active-tab' : ''}`}
                                        id={tab.id}
                                    >
                                        <div className="schedule-one__tab-content-box">
                                            {ticketTypes.map((ticket, index) => {
                                                const unitPrice = getNumericPrice(ticket?.price);
                                                const totalPrice = Math.max(1, totalGuests) * unitPrice;
                                                const price = formatPrice(totalPrice);
                                                const perGuestPrice = formatPrice(unitPrice);
                                                const ticketKey = getTicketKey(ticket, index);
                                                const isPickerOpen = openGuestPickerFor === ticketKey;
                                                const isReadyToConfirm = readyToConfirmFor === ticketKey;
                                                const isBookingCurrentTicket = bookingTicketKey === ticketKey;
                                                const slotDetails = getSlotDetails(ticket);
                                                const availableSlots = getAvailableSlots(ticket);
                                                const selectedDateValue = tab.dateValue || activeScheduleTab?.dateValue || eventInfo?.startDate;
                                                const filteredSlotDetails = slotDetails.filter((slot) => {
                                                    if (!selectedDateValue) return true;
                                                    return !slot.dateValue || slot.dateValue === selectedDateValue;
                                                });

                                                if (slotDetails.length > 0 && filteredSlotDetails.length === 0) {
                                                    return null;
                                                }

                                                const visibleSlotDetails = filteredSlotDetails;
                                                const slotSummary = visibleSlotDetails.length > 0
                                                    ? visibleSlotDetails
                                                        .map((slot) => (slot.timeLabel ? `${slot.name} (${slot.timeLabel})` : slot.name))
                                                        .join(', ')
                                                    : 'Slots unavailable';
                                                const primarySlotTime = visibleSlotDetails[0]?.timeLabel || formatTimeLabel(eventInfo?.startTime);
                                                const displayDate = selectedDateValue;

                                                return (
                                                    <div
                                                        className={`schedule-one__single${isPickerOpen ? ' schedule-one__single--active' : ''}`}
                                                        key={ticketKey}
                                                    >
                                                        <div className="schedule-one__left">
                                                            <h3 className="schedule-one__title">
                                                                <strong>{ticket?.name}</strong>
                                                            </h3>
                                                            <p className="schedule-one__text">
                                                                {price && (
                                                                    <span style={{ fontWeight: 700, color: '#fff', display: 'block', marginBottom: 4 }}>
                                                                        {price}
                                                                    </span>
                                                                )}
                                                                {perGuestPrice && (
                                                                    <span style={{ display: 'block', fontSize: 12, color: '#aaa', marginBottom: 2 }}>
                                                                        {perGuestPrice} per guest
                                                                    </span>
                                                                )}
                                                                <span style={{ display: 'block', fontSize: 13, color: ticket?.isActive ? '#a0e0a0' : '#e09090' }}>
                                                                    {ticket?.isActive ? '● Active' : '● Inactive'}
                                                                </span>
                                                                <span style={{ display: 'block', marginTop: 6, color: '#ccc' }}>
                                                                    {availableSlots.length > 0
                                                                        ? availableSlots.length === 1
                                                                            ? `${availableSlots[0]} slots available`
                                                                            : availableSlots.map((slot, slotIndex) => `Slot ${slotIndex + 1}: ${slot} available`).join(' · ')
                                                                        : 'Slots unavailable'}
                                                                </span>
                                                                {visibleSlotDetails.length > 0 && (
                                                                    <span style={{ display: 'block', marginTop: 4, fontSize: 12, color: '#aaa' }}>
                                                                        Slots: {slotSummary}
                                                                    </span>
                                                                )}
                                                                <span className={`schedule-one__guest-count${isReadyToConfirm ? ' schedule-one__guest-count--active' : ''}`}>
                                                                    Guests: {guestCountLabel}
                                                                </span>
                                                                {ticket?.maxPerBooking && (
                                                                    <span style={{ display: 'block', marginTop: 4, fontSize: 12, color: '#aaa' }}>
                                                                        Max {ticket.maxPerBooking} per booking
                                                                    </span>
                                                                )}
                                                            </p>
                                                        </div>
                                                        <div className="schedule-one__address-and-btn-box">
                                                            <ul className="list-unstyled schedule-one__address">
                                                                {displayDate && (
                                                                    <li>
                                                                        <div className="icon">
                                                                            <span className="icon-clock"></span>
                                                                        </div>
                                                                        <div className="text">
                                                                            <p>{primarySlotTime ? `${primarySlotTime} · ${displayDate}` : displayDate}</p>
                                                                        </div>
                                                                    </li>
                                                                )}
                                                                {eventInfo?.venueFullAddress && (
                                                                    <li>
                                                                        <div className="icon">
                                                                            <span className="icon-pin"></span>
                                                                        </div>
                                                                        <div className="text">
                                                                            <p>{eventInfo.venueFullAddress}</p>
                                                                        </div>
                                                                    </li>
                                                                )}
                                                            </ul>
                                                            <div className="schedule-one__btn-box">
                                                                <button
                                                                    type="button"
                                                                    className="schedule-one__guest-selector"
                                                                    onClick={() => {
                                                                        setReadyToConfirmFor(ticketKey);
                                                                        setOpenGuestPickerFor(ticketKey);
                                                                    }}
                                                                >
                                                                    <span className="schedule-one__guest-selector-label">Guests</span>
                                                                </button>
                                                                <button
                                                                    type="button"
                                                                    className="schedule-one__btn thm-btn schedule-one__book-trigger"
                                                                    onMouseDown={(event) => {
                                                                        event.stopPropagation();
                                                                    }}
                                                                    onClick={() => {
                                                                        if (isReadyToConfirm) {
                                                                            handleScheduleBooking(ticket, visibleSlotDetails[0], displayDate, ticketKey);
                                                                            return;
                                                                        }
                                                                        setReadyToConfirmFor(ticketKey);
                                                                        setOpenGuestPickerFor(ticketKey);
                                                                    }}
                                                                    disabled={isBookingCurrentTicket}
                                                                >
                                                                    {isBookingCurrentTicket ? 'Processing...' : isReadyToConfirm ? 'Confirm' : 'Buy Ticket'}
                                                                    <span className="icon-arrow-right"></span>
                                                                </button>
                                                                {isPickerOpen && (
                                                                    <div
                                                                        className="schedule-one__guest-picker-wrap"
                                                                        onMouseDown={(event) => {
                                                                            event.stopPropagation();
                                                                        }}
                                                                    >
                                                                        <GuestPicker
                                                                            visible={true}
                                                                            className="schedule-one__guest-picker"
                                                                            onClose={() => setOpenGuestPickerFor(null)}
                                                                            onGuestChange={(guestData) => setSelectedGuests(guestData)}
                                                                            initialGuests={selectedGuests}
                                                                            maxGuests={ticket?.maxPerBooking || eventInfo?.totalCapacity || undefined}
                                                                            allowPets={false}
                                                                            childrenAllowed={true}
                                                                            infantsAllowed={true}
                                                                            adultsLabel="Guests"
                                                                        />
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {readyToConfirmFor && totalGuests < 1 && (
                        <div className="schedule-one__selection-note">Please select at least 1 guest to continue.</div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ScheduleOne;
