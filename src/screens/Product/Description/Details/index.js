import React from "react";
import cn from "classnames";
import styles from "./Details.module.sass";
import Icon from "../../../../components/Icon";
import Services from "./Services";

const options = [
  {
    title: "12 hours",
    icon: "clock",
    color: "#0097B2",
  },
  {
    title: "Includes food, drinks and tickets",
    icon: "glass",
    color: "#0097B2",
  },
  {
    title: "Up to 10 people",
    icon: "user",
    color: "#0097B2",
  },
  {
    title: "Hosted in English, Vietnamese",
    icon: "at",
    color: "#0097B2",
  },
];

const Details = ({ className }) => {
  return (
    <div className={cn(className, styles.details)}>
      <h4 className={cn("h4", styles.title)}>Amazing Experience</h4>
      <div className={styles.profile}>
        <span>Hosted by</span>
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
              Sound tour. Travel in unparalleled style and comfort in a premium
              Mercedes van equipped with large panoramic windows, leather
              reclining seats, quirky on board videos, free wifi and
              complimentary bottled water. From your accommodation enjoy the
              stunning scenic drive
            </p>
          </div>
          <button className={cn("button-stroke button-small", styles.button)}>
            Show more
          </button>
        </div>
        <div className={styles.box}>
          <div className={cn("h4", styles.title)}>What’s included</div>
          <Services className={styles.services} />
        </div>
      </div>
    </div>
  );
};

export default Details;
