import React from "react";
import cn from "classnames";
import styles from "./Preview.module.sass";
import Icon from "../../../components/Icon";
import Card from "../../../components/Card";

const item = [
  {
    title: "Entire serviced classy moutain house",
    priceOld: "$356",
    priceActual: "$267",
    categoryText: "superhost",
    rating: "4.8",
    reviews: "12",
    cost: "$200 total",
    src: "",
    srcSet: "",
    url: "/",
    options: [
      {
        title: "Free wifi",
        icon: "modem",
      },
      {
        title: "Breakfast included",
        icon: "burger",
      },
    ],
  },
];

const Preview = ({ className, onClose }) => {
  return (
    <div className={cn(className, styles.preview)}>
      <div className={styles.inner}>
        <button className={styles.close} onClick={onClose}>
          <Icon name="close" size="14" />
        </button>
        <div className={styles.title}>Preview</div>
        {item.map((x, index) => (
          <Card className={styles.card} item={x} key={index} />
        ))}
      </div>
    </div>
  );
};

export default Preview;

