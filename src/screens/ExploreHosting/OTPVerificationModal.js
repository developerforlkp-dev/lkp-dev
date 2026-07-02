import React, { useState, useRef, useEffect } from "react";
import cn from "classnames";
import styles from "./ExploreHosting.module.sass";
import Icon from "../../components/Icon";
import { verifyHostingOTP, resendHostingOTP } from "../../utils/api";

const OTPVerificationModal = ({ sessionId, onClose, onSuccess }) => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  
  const otpFocusTimeoutRef = useRef(null);

  useEffect(() => {
    // Auto-focus first input
    otpFocusTimeoutRef.current = setTimeout(() => {
      const firstInput = document.getElementById(`hosting-otp-0`);
      if (firstInput) firstInput.focus();
    }, 100);

    return () => {
      if (otpFocusTimeoutRef.current) clearTimeout(otpFocusTimeoutRef.current);
    };
  }, []);

  const handleOtpChange = (index, value) => {
    setError(""); // Clear error on typing
    
    // Handle paste
    if (value.length > 1) {
      const pastedData = value.replace(/\D/g, "").slice(0, 6).split("");
      const newOtp = [...otp];
      for (let i = 0; i < pastedData.length; i++) {
        if (index + i < 6) {
          newOtp[index + i] = pastedData[i];
        }
      }
      setOtp(newOtp);
      
      const nextIndex = Math.min(index + pastedData.length, 5);
      const nextInput = document.getElementById(`hosting-otp-${nextIndex}`);
      if (nextInput) nextInput.focus();
    } else {
      // Handle single character
      const newOtp = [...otp];
      newOtp[index] = value.replace(/\D/g, "");
      setOtp(newOtp);

      if (value && index < 5) {
        const nextInput = document.getElementById(`hosting-otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`hosting-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  const handleVerify = async () => {
    const otpString = otp.join("");
    if (otpString.length < 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setIsVerifying(true);
    setError("");
    try {
      await verifyHostingOTP(sessionId, otpString);
      onSuccess();
    } catch (err) {
      let msg = "Invalid OTP. Please try again.";
      if (err.response?.data?.message) {
         msg = err.response.data.message;
      }
      if (msg.toLowerCase().includes("expired")) {
         msg = "Your OTP has expired. Please request a new code.";
      }
      setError(msg);
      setOtp(["", "", "", "", "", ""]);
      document.getElementById(`hosting-otp-0`)?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    setError("");
    setOtp(["", "", "", "", "", ""]);
    try {
      await resendHostingOTP(sessionId);
      // Optional: show a success toast here
    } catch (err) {
      setError("Failed to resend OTP. Please try again.");
    } finally {
      setIsResending(false);
      document.getElementById(`hosting-otp-0`)?.focus();
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modal}>
        <button className={styles.modalClose} onClick={onClose}>
          <Icon name="close" size="24" />
        </button>
        <h2 className={styles.modalTitle}>Identity Verification Required</h2>
        <p className={styles.modalSubtitle}>To finalize registration, please enter the verification code sent to your WhatsApp and Email.</p>
        
        <div className={styles.otpContainer}>
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`hosting-otp-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              className={styles.otpInput}
              autoComplete="one-time-code"
            />
          ))}
        </div>
        
        {error && <div className={styles.error} style={{textAlign: 'center', marginBottom: '16px'}}>{error}</div>}

        <div className={styles.resendText}>
          Didn't receive the code? 
          <button onClick={handleResend} disabled={isResending || isVerifying}>
            {isResending ? "Sending..." : "Resend"}
          </button>
        </div>

        <button 
          className={cn("button", styles.modalBtn)} 
          onClick={handleVerify}
          disabled={isVerifying || otp.join("").length < 6}
        >
          {isVerifying ? "Verifying..." : "Verify Code"}
        </button>
        <button 
          className={cn("button-stroke", styles.modalBtn)} 
          onClick={onClose}
          style={{marginTop: '12px'}}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default OTPVerificationModal;
