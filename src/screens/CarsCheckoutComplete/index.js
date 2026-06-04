import React from "react";
import cn from "classnames";
import styles from "./CarsCheckoutComplete.module.sass";
import Control from "../../components/Control";
import CheckoutSlider from "./CheckoutSlider";
import CheckoutComplete from "../../components/CheckoutComplete";

const breadcrumbs = [
  {
    title: "Home",
    url: "/#",
  },
  {
    title: "Confirm and pay",
    url: "/#",
  },
  {
    title: "Checkout completed",
  },
];

const gallery = [
  {
    src: "",
    srcSet: "",
  },
  {
    src: "",
    srcSet: "",
  },
  {
    src: "",
    srcSet: "",
  },
];

const options = [
  {
    title: "Booking code:",
    content: "UI8_150989",
    icon: "hand-cart",
  },
  {
    title: "Date:",
    content: "30 Apr, 2021",
    icon: "calendar",
  },
  {
    title: "Total:",
    content: "$833",
    icon: "receipt",
  },
  {
    title: "Payment method:",
    content: "Credit card",
    icon: "wallet",
  },
];

const items = [
  {
    title: "Dates",
    content: "May 15 - 22, 2021",
  },
  {
    title: "Guests",
    content: "2 guest",
  },
];

const CarsCheckoutComplete = () => {
  return (
    <div className={cn("section-mb80", styles.section)}>
      <div className={cn("container", styles.container)}>
        <Control
          className={styles.control}
          urlHome="/cars"
          breadcrumbs={breadcrumbs}
        />
        <div className={styles.row}>
          <div className={styles.col}>
            <CheckoutSlider className={styles.slider} gallery={gallery} />
          </div>
          <div className={styles.col}>
            <CheckoutComplete
              className={styles.complete}
              title="Spectacular views of Queensadastown"
              options={options}
              items={items}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarsCheckoutComplete;

