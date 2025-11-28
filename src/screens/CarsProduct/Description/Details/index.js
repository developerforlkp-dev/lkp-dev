import React from "react";
import cn from "classnames";
import styles from "./Details.module.sass";
import Icon from "../../../../components/Icon";

const options = [
  {
    title: "Put your car feature",
    icon: "stopwatch",
    color: "#0097B2",
  },
  {
    title: "Put your car feature",
    icon: "car",
    color: "#0097B2",
  },
  {
    title: "Up to 6 people",
    icon: "user",
    color: "#0097B2",
  },
  {
    title: "Put your car feature",
    icon: "candlesticks",
    color: "#0097B2",
  },
];

const Details = ({ className }) => {
  return (
    <div className={cn(className, styles.details)}>
      <h4 className={cn("h4", styles.title)}>Car details</h4>
      <div className={styles.profile}>
        <span>Car owner</span>
        <div className={styles.avatar}>
          <img src="/images/content/avatar.jpg" alt="Avatar" />
        </div>
        <div className={styles.name}>Colleen Jast</div>
      </div>
      <div className={styles.options}>
        {options.map((x, index) => (
          <div className={styles.option} key={index}>
            <div className={styles.icon} style={{ borderColor: x.color }}>
              <Icon name={x.icon} size="24" />
            </div>
            <div className={styles.text}>{x.title}</div>
          </div>
        ))}
      </div>
      <div className={styles.group}>
        <div className={styles.box}>
          <div className={styles.content}>
            <h4>Activity</h4>
            <p>
              The best 16 passenger small group, intimate and unique, Milford
              Sound tour.
            </p>
            <p>
              Travel in unparalleled style and comfort in a premium Mercedes van
              equipped with large panoramic windows, leather reclining seats,
              quirky on board videos, free wifi and complimentary bottled water.
            </p>
            <p>From your accommodation enjoy the stunning scenic drive.</p>
          </div>
          <button className={cn("button-stroke button-small", styles.button)}>
            Show more
          </button>
        </div>
        <div className={styles.box}>
          <div className={styles.content}>
            <h4>Full protection</h4>
            <p>
              The best 16 passenger small group, intimate and unique, Milford
              Sound tour. Travel in unparalleled style and comfort in a premium
              Mercedes.
            </p>
          </div>
          <button className={cn("button-stroke button-small", styles.button)}>
            Show more
          </button>
        </div>
      </div>
    </div>
  );
};

export default Details;
