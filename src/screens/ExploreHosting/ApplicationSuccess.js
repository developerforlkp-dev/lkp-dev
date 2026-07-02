import React from "react";
import cn from "classnames";
import { useHistory } from "react-router-dom";
import styles from "./ExploreHosting.module.sass";

const businessInterestsOptions = [
  { id: 1, label: "Event" },
  { id: 2, label: "Experience" },
  { id: 3, label: "Food" },
  { id: 4, label: "Nearby Places" },
  { id: 5, label: "Stay" }
];

const ApplicationSuccess = ({ submittedData, onReset }) => {
  const history = useHistory();

  const handleDone = () => {
    if (onReset) onReset();
    history.push("/");
  };

  const getInterestLabels = () => {
    if (!submittedData?.interestIds) return "None";
    return submittedData.interestIds
      .map(id => businessInterestsOptions.find(o => o.id === id)?.label)
      .filter(Boolean)
      .join(", ");
  };

  return (
    <div className={styles.successContainer}>
      <div className={styles.successIcon}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
        </svg>
      </div>
      <h2>Onboarding Application Submitted</h2>
      <p style={{marginTop: 12, color: "#777E90"}}>
        Thank you for your interest! Your application to become a host has been successfully submitted. We will review your details and get back to you shortly.
      </p>

      {submittedData && (
        <div className={styles.detailsCard}>
          <div className={styles.detailGroup}>
            <div className={styles.detailTitle}>Personal Info</div>
            <div className={styles.detailText}>{submittedData.firstName} {submittedData.lastName}</div>
            <div className={styles.detailText}>{submittedData.accountType} {submittedData.companyName ? `(${submittedData.companyName})` : ''}</div>
          </div>
          
          <div className={styles.detailGroup}>
            <div className={styles.detailTitle}>Contact Info</div>
            <div className={styles.detailText}>{submittedData.phoneNumber}</div>
            <div className={styles.detailText}>{submittedData.email}</div>
            {submittedData.altEmail && <div className={styles.detailText}>{submittedData.altEmail}</div>}
          </div>

          <div className={styles.detailGroup}>
            <div className={styles.detailTitle}>Location Info</div>
            <div className={styles.detailText}>{submittedData.address}</div>
            <div className={styles.detailText}>{submittedData.district}, {submittedData.state} {submittedData.pincode}</div>
            <div className={styles.detailText}>Coordinates: {submittedData.latitude}, {submittedData.longitude}</div>
          </div>

          <div className={styles.detailGroup}>
            <div className={styles.detailTitle}>Registered Business Interests</div>
            <div className={styles.detailText}>{getInterestLabels()}</div>
          </div>
        </div>
      )}

      <button className={cn("button", styles.modalBtn)} onClick={handleDone}>
        Done & Reset Registry Form
      </button>
    </div>
  );
};

export default ApplicationSuccess;
