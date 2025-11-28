import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import cn from "classnames";
import styles from "./LoginModal.module.sass";
import Icon from "../Icon";
import { sendPhoneOTP, verifyPhoneOTP } from "../../utils/api";

const LoginModal = ({ visible, onClose, onGoogleLogin, onPhoneLogin }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]); // 6-digit OTP
  const [activeInput, setActiveInput] = useState(0);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [step, setStep] = useState("phone"); // "phone", "otp"
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const countryCode = "+91";

  // Reset form when modal closes
  useEffect(() => {
    if (!visible) {
      setPhoneNumber("");
      setOtp(["", "", "", "", "", ""]);
      setFirstName("");
      setLastName("");
      setStep("phone");
      setActiveInput(0);
      setError("");
      setLoading(false);
    }
  }, [visible]);

  // Auto-focus first OTP input when OTP step is shown
  useEffect(() => {
    if (step === "otp" && visible) {
      const firstInput = document.getElementById(`otp-0`);
      if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
      }
    }
  }, [step, visible]);

  // Handle OTP input change
  const handleOtpChange = (index, value) => {
    if (value.length > 1) {
      // Handle paste
      const pasteValue = value.replace(/\D/g, "").slice(0, 6);
      const newOtp = [...otp];
      pasteValue.split("").forEach((char, i) => {
        if (index + i < 6) {
          newOtp[index + i] = char;
        }
      });
      setOtp(newOtp);
      const nextIndex = Math.min(index + pasteValue.length, 5);
      setActiveInput(nextIndex);
      const nextInput = document.getElementById(`otp-${nextIndex}`);
      if (nextInput) nextInput.focus();
    } else {
      // Single character input
      const newOtp = [...otp];
      newOtp[index] = value.replace(/\D/g, "");
      setOtp(newOtp);
      if (value && index < 5) {
        setActiveInput(index + 1);
        const nextInput = document.getElementById(`otp-${index + 1}`);
        if (nextInput) nextInput.focus();
      }
    }
  };

  // Handle OTP key down (backspace, arrow keys)
  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      setActiveInput(index - 1);
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    } else if (e.key === "ArrowLeft" && index > 0) {
      setActiveInput(index - 1);
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    } else if (e.key === "ArrowRight" && index < 5) {
      setActiveInput(index + 1);
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }
  };

  // Render Google Sign-In button when modal is visible
  useEffect(() => {
    if (visible && window.google && window.google.accounts && window.google.accounts.id) {
      const buttonContainer = document.getElementById("google-signin-button");
      if (buttonContainer && !buttonContainer.hasChildNodes()) {
        window.google.accounts.id.renderButton(buttonContainer, {
          theme: "outline",
          size: "large",
          width: "100%",
          text: "signin_with",
        });
      }
    }
  }, [visible]);

  const handleGoogleLogin = () => {
    if (onGoogleLogin) {
      onGoogleLogin();
    } else {
      // Fallback: redirect to Google OAuth
      window.location.href = "/auth/google";
    }
  };

  // Send OTP when phone number is submitted
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!phoneNumber || phoneNumber.trim() === "") {
      setError("Please enter a valid phone number");
      return;
    }

    setLoading(true);
    try {
      await sendPhoneOTP(phoneNumber.trim(), countryCode);
      setStep("otp");
      setError("");
      setOtp(["", "", "", "", "", ""]);
      setActiveInput(0);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify OTP when OTP is submitted
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    const otpString = otp.join("");
    if (otpString.length !== 6) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      const response = await verifyPhoneOTP(
        phoneNumber.trim(),
        otpString,
        countryCode,
        firstName.trim(),
        lastName.trim()
      );
      
      // Store JWT token if provided in response
      // Check multiple possible response structures
      const token = 
        response.token || 
        response.jwtToken || 
        response.accessToken ||
        response.data?.token ||
        response.data?.jwtToken ||
        response.data?.accessToken;
      
      if (token) {
        localStorage.setItem("jwtToken", token);
        console.log("✅ JWT token stored in localStorage");
      } else {
        console.warn("⚠️ No JWT token found in response:", response);
      }
      
      // Store phone number and user info in localStorage
      const userInfo = {
        phone: phoneNumber.trim(),
        phoneNumber: phoneNumber.trim(),
        customerPhone: countryCode + phoneNumber.trim(),
        firstName: firstName.trim() || "",
        lastName: lastName.trim() || "",
        name: firstName.trim() + (lastName.trim() ? " " + lastName.trim() : ""),
        ...(response.user || response.data?.user || {})
      };
      localStorage.setItem("userInfo", JSON.stringify(userInfo));
      console.log("✅ User info stored in localStorage:", userInfo);
      
      // Call parent's onPhoneLogin callback if provided
      if (onPhoneLogin) {
        onPhoneLogin(phoneNumber, response);
      }
      
      // Close modal
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Go back to phone input
  const handleBackToPhone = () => {
    setStep("phone");
    setOtp(["", "", "", "", "", ""]);
    setActiveInput(0);
    setError("");
  };

  if (!visible) return null;

  return createPortal(
    <div className={styles.modal}>
      <div className={styles.content}>
        <button className={styles.close} onClick={onClose}>
          <Icon name="close" size="24" />
        </button>
        
        <div className={styles.login}>
          {/* Step 1: Phone Number Input */}
          {step === "phone" && (
            <div className={styles.item}>
              <div className={cn("h3", styles.title)}>Sign up on Fleet</div>
              <div className={styles.info}>Use Your OpenID to Sign up</div>
              <div className={styles.btns}>
                <button 
                  type="button"
                  className={cn("button", styles.button)}
                  onClick={handleGoogleLogin}
                >
                  <Icon name="google" size="16" />
                  <span>Google</span>
                </button>
                <button type="button" className={cn("button-black", styles.button)}>
                  <Icon name="apple" size="16" />
                  <span>Apple</span>
                </button>
              </div>
              <div className={styles.note}>Or continue with phone number</div>
              <form onSubmit={handlePhoneSubmit} className={styles.form}>
                <div className={styles.phoneInput}>
                  <div className={styles.countryCode}>
                    <img
                      src="/images/flags/in.svg"
                      alt="India"
                      className={styles.flag}
                    />
                    <span className={styles.countryCodeText}>+91</span>
                  </div>
                  <input
                    type="tel"
                    className={styles.input}
                    placeholder="Enter your phone number"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ""))}
                    disabled={loading}
                    required
                  />
                  <button 
                    type="submit" 
                    className={styles.btn}
                    disabled={loading || !phoneNumber.trim()}
                  >
                    <Icon name="arrow-next" size="14" />
                  </button>
                </div>
                {error && <div className={styles.error}>{error}</div>}
              </form>
              <div className={styles.foot}>
                Already have an account?{" "}
                <button type="button" className={styles.link} onClick={onClose}>
                  Login
                </button>
              </div>
            </div>
          )}

          {/* Step 2: OTP Verification */}
          {step === "otp" && (
            <div className={styles.item}>
              <div className={cn("h3", styles.title)}>Enter your security code</div>
              <div className={styles.info}>We texted your code to +91 {phoneNumber}</div>
              <form onSubmit={handleOtpSubmit} className={styles.form}>
                <div className={styles.code}>
                  {otp.map((digit, index) => (
                    <div key={index} className={styles.number}>
                      <input
                        id={`otp-${index}`}
                        type="tel"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(index, e)}
                        onFocus={() => setActiveInput(index)}
                        disabled={loading}
                        autoFocus={index === 0}
                        required
                      />
                    </div>
                  ))}
                </div>
                <div className={styles.nameFields}>
                  <input
                    type="text"
                    className={styles.nameInput}
                    placeholder="First Name (Optional)"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    disabled={loading}
                  />
                  <input
                    type="text"
                    className={styles.nameInput}
                    placeholder="Last Name (Optional)"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    disabled={loading}
                  />
                </div>
                {error && <div className={styles.error}>{error}</div>}
                <button 
                  type="submit" 
                  className={cn("button", styles.button)}
                  disabled={loading || otp.join("").length !== 6}
                >
                  {loading ? "Verifying..." : "Continue"}
                </button>
              </form>
              <div className={styles.foot}>
                <button
                  type="button"
                  className={styles.password}
                  onClick={handleBackToPhone}
                  disabled={loading}
                >
                  Back to phone number
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default LoginModal;

