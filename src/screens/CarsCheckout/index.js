import React from "react";
import cn from "classnames";
import styles from "./CarsCheckout.module.sass";
import Control from "../../components/Control";
import ConfirmAndPay from "../../components/ConfirmAndPay";
import PriceDetails from "../../components/PriceDetails";

const breadcrumbs = [
  {
    title: "Cars",
    url: "/#",
  },
  {
    title: "Confirm and pay",
  },
];

const items = [
  {
    title: "May 15, 2021",
    category: "Date",
    icon: "calendar",
  },
];

const table = [
  {
    title: "$500 x 3 days",
    value: "$1500",
  },
  {
    title: "10% campaign discount",
    value: "-$150",
  },
  {
    title: "1 child seat",
    value: "$50",
  },
  {
    title: "Service fee",
    value: "$110",
  },
  {
    title: "Total (USD)",
    value: "$1460",
  },
];

const Checkout = () => {
  return (
    <div className={cn("section-mb80", styles.section)}>
      <div className={cn("container", styles.container)}>
        <Control
          className={styles.control}
          urlHome="/"
          breadcrumbs={breadcrumbs}
        />
        <div className={styles.wrapper}>
          <ConfirmAndPay
            className={styles.confirm}
            title="BMW i1 – 2021"
            buttonUrl="/cars-checkout-complete"
          />
          <PriceDetails
            className={styles.price}
            image=""
            title="BMW i1 – 2021"
            items={items}
            table={table}
          />
        </div>
      </div>
    </div>
  );
};

export default Checkout;

