import React, { useState } from "react";
import ApplicationForm from "./ApplicationForm";
import OTPVerificationModal from "./OTPVerificationModal";
import ApplicationSuccess from "./ApplicationSuccess";

const ExploreHosting = () => {
  const [step, setStep] = useState("form"); // "form", "otp", "success"
  const [sessionId, setSessionId] = useState(null);
  const [submittedData, setSubmittedData] = useState(null);

  const handleOTPSent = (newSessionId, formData) => {
    setSessionId(newSessionId);
    setSubmittedData(formData);
    setStep("otp");
  };

  const handleOTPVerified = () => {
    setStep("success");
  };

  const handleCloseOTP = () => {
    setStep("form");
  };

  const handleReset = () => {
    setStep("form");
    setSessionId(null);
    setSubmittedData(null);
  };

  return (
    <div>
      {step === "form" && (
        <ApplicationForm onOTPSent={handleOTPSent} />
      )}
      
      {step === "otp" && (
        <>
          <ApplicationForm onOTPSent={handleOTPSent} /> 
          <OTPVerificationModal 
            sessionId={sessionId} 
            onClose={handleCloseOTP} 
            onSuccess={handleOTPVerified} 
          />
        </>
      )}

      {step === "success" && (
        <ApplicationSuccess 
          submittedData={submittedData} 
          onReset={handleReset} 
        />
      )}
    </div>
  );
};

export default ExploreHosting;
