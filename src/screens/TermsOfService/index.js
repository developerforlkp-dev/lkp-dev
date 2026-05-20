import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Page from "../../components/Page";
import { useTheme } from "../../components/JUI/Theme";

const accordionData = [
  {
    title: "Basic Terminology",
    content: "These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity, and Little Known Planet. By accessing our services, you agree that you have read, understood, and agreed to be bound by all of these Terms and Conditions."
  },
  {
    title: "Eligibility",
    content: "You must be at least 18 years of age to use our services. By using our services, you represent and warrant that you meet all eligibility requirements. We reserve the right to refuse service, terminate accounts, or cancel bookings in our sole discretion."
  },
  {
    title: "Pricing & Payments",
    content: "All prices are subject to change without notice. We reserve the right at any time to modify or discontinue the Service without notice. Payments are processed securely, and you agree to provide current, complete, and accurate purchase and account information for all purchases made via our site."
  },
  {
    title: "Cancellation Policy",
    content: "Cancellations must be made within the stipulated timeframe outlined in your specific booking confirmation. Late cancellations may be subject to a fee up to the total cost of the reservation. Please review your specific itinerary for detailed cancellation terms."
  },
  {
    title: "Booking Policies",
    content: "All bookings are subject to availability and confirmation. Little Known Planet reserves the right to correct any errors, inaccuracies, or omissions, and to change or update information or cancel bookings if any information in the Service is inaccurate at any time without prior notice."
  },
  {
    title: "User Responsibilities",
    content: "Users are expected to conduct themselves respectfully and adhere to all local laws and regulations during their stay or experience. Any damage to properties or disruption of services caused by the user will be the sole responsibility and liability of the user."
  },
  {
    title: "Refund Policy",
    content: "Refunds are processed in accordance with the cancellation policy of your specific booking. Approved refunds will be credited back to the original method of payment within 5-10 business days."
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

const TermsOfService = () => {
  const { tokens, theme } = useTheme();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <Page>
      <Helmet>
        <title>Terms & Conditions | Little Known Planet</title>
        <meta name="description" content="Review the Terms and Conditions for using Little Known Planet services." />
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
              Terms & Conditions
            </h1>
            <p style={{ fontSize: "1.1rem", color: tokens.M, maxWidth: "600px", margin: "0 auto", lineHeight: 1.6 }}>
              Please read these terms carefully before using our services.
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

export default TermsOfService;
