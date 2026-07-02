import React, { useState } from "react";
import cn from "classnames";
import styles from "./ExploreHosting.module.sass";
import { submitHostingApplication } from "../../utils/api";

const initialFormState = {
  firstName: "",
  lastName: "",
  accountType: "Individual",
  companyName: "",
  phoneNumber: "",
  altPhoneNumber: "",
  email: "",
  altEmail: "",
  address: "",
  pincode: "",
  location: "",
  country: "",
  state: "",
  district: "",
  latitude: "",
  longitude: "",
  interestIds: [],
};

const businessInterestsOptions = [
  { id: 1, label: "Event" },
  { id: 2, label: "Experience" },
  { id: 3, label: "Food" },
  { id: 4, label: "Nearby Places" },
  { id: 5, label: "Stay" }
];

const ApplicationForm = ({ onOTPSent }) => {
  const [formData, setFormData] = useState(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // clear error
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleInterestChange = (id) => {
    setFormData(prev => {
      const isSelected = prev.interestIds.includes(id);
      return {
        ...prev,
        interestIds: isSelected 
          ? prev.interestIds.filter(i => i !== id)
          : [...prev.interestIds, id]
      };
    });
  };

  const handleReset = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName) newErrors.firstName = "First Name is required";
    if (!formData.lastName) newErrors.lastName = "Last Name is required";
    if (!formData.accountType) newErrors.accountType = "Account Type is required";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Phone Number is required";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.address) newErrors.address = "Address is required";
    if (!formData.pincode) newErrors.pincode = "Pincode is required";
    if (!formData.location) newErrors.location = "Location is required";
    if (!formData.country) newErrors.country = "Country is required";
    if (!formData.state) newErrors.state = "State is required";
    if (!formData.district) newErrors.district = "District is required";
    if (!formData.latitude) newErrors.latitude = "Latitude is required";
    if (!formData.longitude) newErrors.longitude = "Longitude is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const response = await submitHostingApplication(formData);
      // Assuming response contains sessionId
      onOTPSent(response.sessionId || response.data?.sessionId, formData);
    } catch (err) {
      console.error(err);
      alert("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className={styles.container} onSubmit={handleSubmit}>
      <div className={styles.header}>
        <h1>Become a Host</h1>
        <p>Join our community of hosts and start sharing your space or experience.</p>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Personal Information</div>
        <div className={styles.row}>
          <div className={styles.col}>
            <label className={styles.label}>First Name *</label>
            <input className={styles.input} name="firstName" value={formData.firstName} onChange={handleChange} placeholder="First Name" />
            {errors.firstName && <span className={styles.error}>{errors.firstName}</span>}
          </div>
          <div className={styles.col}>
            <label className={styles.label}>Last Name *</label>
            <input className={styles.input} name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Last Name" />
            {errors.lastName && <span className={styles.error}>{errors.lastName}</span>}
          </div>
          <div className={styles.col}>
            <label className={styles.label}>Account Type *</label>
            <select className={styles.select} name="accountType" value={formData.accountType} onChange={handleChange}>
              <option value="Individual">Individual</option>
              <option value="Company">Company</option>
            </select>
            {errors.accountType && <span className={styles.error}>{errors.accountType}</span>}
          </div>
          {formData.accountType === "Company" && (
            <div className={styles.col}>
              <label className={styles.label}>Company Name</label>
              <input className={styles.input} name="companyName" value={formData.companyName} onChange={handleChange} placeholder="Company Name" />
            </div>
          )}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Contact Information</div>
        <div className={styles.row}>
          <div className={styles.col}>
            <label className={styles.label}>Phone Number *</label>
            <input className={styles.input} name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} placeholder="Phone Number" />
            {errors.phoneNumber && <span className={styles.error}>{errors.phoneNumber}</span>}
          </div>
          <div className={styles.col}>
            <label className={styles.label}>Alternate Phone Number</label>
            <input className={styles.input} name="altPhoneNumber" value={formData.altPhoneNumber} onChange={handleChange} placeholder="Alternate Phone" />
          </div>
          <div className={styles.col}>
            <label className={styles.label}>Email *</label>
            <input className={styles.input} name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email Address" />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>
          <div className={styles.col}>
            <label className={styles.label}>Alternate Email</label>
            <input className={styles.input} name="altEmail" type="email" value={formData.altEmail} onChange={handleChange} placeholder="Alternate Email" />
          </div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Business Interest Selection</div>
        <div className={styles.checkboxList}>
          {businessInterestsOptions.map(interest => (
            <label key={interest.id} className={styles.checkboxItem}>
              <input 
                type="checkbox" 
                checked={formData.interestIds.includes(interest.id)}
                onChange={() => handleInterestChange(interest.id)}
              />
              <span>{interest.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>Location Information</div>
        <div className={styles.row}>
          <div className={styles.fullCol}>
            <label className={styles.label}>Address *</label>
            <input className={styles.input} name="address" value={formData.address} onChange={handleChange} placeholder="Street Address" />
            {errors.address && <span className={styles.error}>{errors.address}</span>}
          </div>
          <div className={styles.col}>
            <label className={styles.label}>Pincode *</label>
            <input className={styles.input} name="pincode" value={formData.pincode} onChange={handleChange} placeholder="Pincode" />
            {errors.pincode && <span className={styles.error}>{errors.pincode}</span>}
          </div>
          <div className={styles.col}>
            <label className={styles.label}>Location *</label>
            <input className={styles.input} name="location" value={formData.location} onChange={handleChange} placeholder="Location / City" />
            {errors.location && <span className={styles.error}>{errors.location}</span>}
          </div>
          <div className={styles.col}>
            <label className={styles.label}>State *</label>
            <input className={styles.input} name="state" value={formData.state} onChange={handleChange} placeholder="State" />
            {errors.state && <span className={styles.error}>{errors.state}</span>}
          </div>
          <div className={styles.col}>
            <label className={styles.label}>District *</label>
            <input className={styles.input} name="district" value={formData.district} onChange={handleChange} placeholder="District" />
            {errors.district && <span className={styles.error}>{errors.district}</span>}
          </div>
          <div className={styles.col}>
            <label className={styles.label}>Country *</label>
            <input className={styles.input} name="country" value={formData.country} onChange={handleChange} placeholder="Country" />
            {errors.country && <span className={styles.error}>{errors.country}</span>}
          </div>
          <div className={styles.col}>
            <label className={styles.label}>Latitude *</label>
            <input className={styles.input} name="latitude" value={formData.latitude} onChange={handleChange} placeholder="e.g. 8.4004" />
            {errors.latitude && <span className={styles.error}>{errors.latitude}</span>}
          </div>
          <div className={styles.col}>
            <label className={styles.label}>Longitude *</label>
            <input className={styles.input} name="longitude" value={formData.longitude} onChange={handleChange} placeholder="e.g. 76.9784" />
            {errors.longitude && <span className={styles.error}>{errors.longitude}</span>}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button type="button" className={cn("button-stroke", styles.resetBtn)} onClick={handleReset} disabled={isSubmitting}>
          Reset Form
        </button>
        <button type="submit" className={cn("button", styles.submitBtn)} disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </button>
      </div>
    </form>
  );
};

export default ApplicationForm;
