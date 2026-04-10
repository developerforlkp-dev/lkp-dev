import React, { useState, useEffect } from "react";
import cn from "classnames";
import styles from "./PersonalInfo.module.sass";
import { Link } from "react-router-dom";
import TextInput from "../../../components/TextInput";
import Icon from "../../../components/Icon";
import { getCustomerProfile } from "../../../utils/api";

const PersonalInfo = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state — seeded from API
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [isPhoneVerified, setIsPhoneVerified] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const customer = await getCustomerProfile();
        if (customer) {
          setFirstName(customer.firstName || "");
          setLastName(customer.lastName || "");
          setEmail(customer.email || "");
          setPhone(customer.phone || "");
          setCountryCode(customer.countryCode || "");
          setIsPhoneVerified(customer.isPhoneVerified || false);
          setIsEmailVerified(customer.isEmailVerified || false);
          setAvatarUrl(customer.avatarUrl || "");
        }
      } catch (err) {
        console.error("❌ Failed to load personal info:", err);
        setError("Could not load your profile. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleClear = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setCountryCode("");
  };

  if (loading) {
    return (
      <div className={styles.section} style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: 200 }}>
        <div style={{ opacity: 0.5 }}>Loading your profile…</div>
      </div>
    );
  }

  return (
    <form className={styles.section} onSubmit={(e) => e.preventDefault()}>
      <div className={styles.head}>
        <div className={cn("h2", styles.title)}>Personal info</div>
        <Link
          className={cn("button-stroke button-small", styles.button)}
          to="/profile"
        >
          View profile
        </Link>
      </div>

      {error && (
        <div style={{ color: "#e55", marginBottom: 16, fontSize: 14 }}>{error}</div>
      )}

      <div className={styles.list}>
        <div className={styles.item}>
          <div className={styles.category}>Account info</div>
          <div className={styles.fieldset}>
            <div className={styles.row}>
              <div className={styles.col}>
                <TextInput
                  className={styles.field}
                  label="First Name"
                  name="first-name"
                  type="text"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                />
              </div>
              <div className={styles.col}>
                <TextInput
                  className={styles.field}
                  label="Last Name"
                  name="last-name"
                  type="text"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.col}>
                {/* Phone with verification badge */}
                <div style={{ position: "relative" }}>
                  <TextInput
                    className={styles.field}
                    label={
                      isPhoneVerified
                        ? "Phone ✓ Verified"
                        : "Phone (Unverified)"
                    }
                    name="phone"
                    type="tel"
                    placeholder="Phone number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className={styles.col}>
                <TextInput
                  className={styles.field}
                  label="Country Code"
                  name="country-code"
                  type="text"
                  placeholder="+91"
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                />
              </div>
            </div>

            <div className={styles.row}>
              <div className={styles.col}>
                {/* Email with verification badge */}
                <TextInput
                  className={styles.field}
                  label={
                    isEmailVerified
                      ? "Email ✓ Verified"
                      : "Email (Unverified)"
                  }
                  name="email"
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Verification status badges */}
            <div style={{ display: "flex", gap: 12, marginTop: 8, marginBottom: 16, flexWrap: "wrap" }}>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  background: isPhoneVerified ? "#e6f9f0" : "#fff3e0",
                  color: isPhoneVerified ? "#1a7a45" : "#b45309",
                  border: `1px solid ${isPhoneVerified ? "#a7f3d0" : "#fcd34d"}`,
                }}
              >
                <Icon name={isPhoneVerified ? "tick" : "close"} size="12" />
                Phone {isPhoneVerified ? "Verified" : "Not Verified"}
              </div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "4px 12px",
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  background: isEmailVerified ? "#e6f9f0" : "#fff3e0",
                  color: isEmailVerified ? "#1a7a45" : "#b45309",
                  border: `1px solid ${isEmailVerified ? "#a7f3d0" : "#fcd34d"}`,
                }}
              >
                <Icon name={isEmailVerified ? "tick" : "close"} size="12" />
                Email {isEmailVerified ? "Verified" : "Not Verified"}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.controls}>
        <button type="submit" className={cn("button", styles.button)}>Update profile</button>
        <button type="button" className={styles.clear} onClick={handleClear}>
          <Icon name="close" size="16" />
          Clear all
        </button>
      </div>
    </form>
  );
};

export default PersonalInfo;
