import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Page from "../../components/Page";
import { useTheme } from "../../components/JUI/Theme";

const accordionData = [
  {
    title: "Information Collection",
    content: "We collect personal information that you voluntarily provide to us when you register on the Services, express an interest in obtaining information about us or our products and Services, when you participate in activities on the Services, or otherwise when you contact us."
  },
  {
    title: "Cookies & Tracking",
    content: "We may use cookies and similar tracking technologies (like web beacons and pixels) to access or store information. Specific information about how we use such technologies and how you can refuse certain cookies is set out in our Cookie Notice."
  },
  {
    title: "Payment Information",
    content: "We may collect data necessary to process your payment if you make purchases, such as your payment instrument number (such as a credit card number), and the security code associated with your payment instrument. All payment data is stored by our payment processor."
  },
  {
    title: "Data Usage",
    content: "We process your information for purposes based on legitimate business interests, the fulfillment of our contract with you, compliance with our legal obligations, and/or your consent. We use the information we collect or receive to facilitate account creation, authentication, and booking management."
  },
  {
    title: "Third Party Sharing",
    content: "We may share your data with third-party vendors, service providers, contractors, or agents who perform services for us or on our behalf and require access to such information to do that work. This includes payment processing, data analysis, email delivery, hosting services, and customer service."
  },
  {
    title: "Security",
    content: "We have implemented appropriate technical and organizational security measures designed to protect the security of any personal information we process. However, despite our safeguards and efforts to secure your information, no electronic transmission over the Internet or information storage technology can be guaranteed to be 100% secure."
  },
  {
    title: "User Rights",
    content: "Depending on your location, you may have the right to request access to the personal information we collect from you, change that information, or delete it in some circumstances. To request to review, update, or delete your personal information, please submit a request to our support team."
  }
];

const AccordionItem = ({ item, isOpen, onClick, themeTokens }) => {
  const { FG, M, B, A } = themeTokens;
  return (
    <div style={{ borderBottom: `1px solid ${B}`, overflow: "hidden" }}>
      <button
        onClick={onClick}
        style={{
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "32px 0",
          background: "none",
          border: "none",
          cursor: "pointer",
          textAlign: "left",
          outline: "none"
        }}
      >
        <span style={{ fontSize: "clamp(1.1rem, 2vw, 1.5rem)", fontWeight: 500, color: isOpen ? A : FG, transition: "color 0.3s ease" }}>
          {item.title}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", color: M }}
        >
          <ChevronDown size={24} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={{ paddingBottom: "32px", color: M, fontSize: "1.1rem", lineHeight: 1.8, maxWidth: "800px" }}>
              {item.content}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const PrivacyPolicy = () => {
  const { tokens, theme } = useTheme();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Page>
      <Helmet>
        <title>Privacy Policy | Little Known Planet</title>
        <meta name="description" content="Review the Privacy Policy for using Little Known Planet services." />
      </Helmet>
      
      <div style={{ background: tokens.BG, minHeight: "100vh", paddingTop: "140px", paddingBottom: "100px", color: tokens.FG }}>
        <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px" }}>
          
          <div style={{ textAlign: "center", marginBottom: "80px" }}>
            <h1 className="font-display" style={{ 
              fontSize: "clamp(3rem, 6vw, 5rem)", 
              fontWeight: 700, 
              color: tokens.FG, 
              letterSpacing: "-0.02em",
              marginBottom: "24px"
            }}>
              Privacy Policy
            </h1>
            <p style={{ fontSize: "1.1rem", color: tokens.M, maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
              How we collect, use, and protect your information.
              Last updated: May 2026.
            </p>
          </div>

          <div style={{ borderTop: `1px solid ${tokens.B}` }}>
            {accordionData.map((item, index) => (
              <AccordionItem
                key={index}
                item={item}
                isOpen={openIndex === index}
                onClick={() => setOpenIndex(index === openIndex ? -1 : index)}
                themeTokens={tokens}
              />
            ))}
          </div>

        </div>
      </div>
    </Page>
  );
};

export default PrivacyPolicy;
