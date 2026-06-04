import React from "react";
import cn from "classnames";
import styles from "./Services.module.sass";
import Item from "./Item";

const services = [
  {
    image: "",
    title: "1+M reviewers",
    content:
      "We realize ideas from simple to complex, everything becomes easy to use and reach the most potential customers.",
  },
  {
    image: "",
    title: "24/7 customer service",
    content:
      "We realize ideas from simple to complex, everything becomes easy to use and reach the most potential customers.",
  },
  {
    image: "",
    title: "Free cancellation",
    content:
      "We realize ideas from simple to complex, everything becomes easy to use and reach the most potential customers.",
  },
];

const Services = () => {
  return (
    <div className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.head}>
          <div className={cn("stage", styles.stage)}>
            A creative agency that lead and inspire
          </div>
          <h2 className={cn("h2", styles.title)}>Amazing Services</h2>
          <button className={cn("button", styles.button)}>Contact Us</button>
        </div>
        <div className={styles.list}>
          {services.map((x, index) => (
            <Item className={styles.item} item={x} key={index} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Services;

