import React, { useState } from "react";
import cn from "classnames";
import styles from "./Planning.module.sass";
import Image from "../Image";
import Form from "../Form";

const gallery = [
  {
    src: "",
    srcSet: "",
    srcDark: "",
    srcSetDark: "",
  },
  {
    src: "",
    srcSet: "",
    srcDark: "",
    srcSetDark: "",
  },
  {
    src: "",
    srcSet: "",
    srcDark: "",
    srcSetDark: "",
  },
];

const Planning = ({ classSection, title }) => {
  const [phone, setPhone] = useState("");

  const handleSubmit = (e) => {
    alert();
  };

  return (
    <div className={cn("section", classSection, styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.wrap}>
          <div className={cn("stage", styles.stage)}>
            supercharge your planning powers
          </div>
          <h2 className={cn("h2", styles.title)}>{title}</h2>
          <div className={styles.info}>
            Stacks is a production-ready library of stackable content blocks
            built in React Native.
          </div>
          <Form
            className={styles.form}
            value={phone}
            setValue={setPhone}
            onSubmit={() => handleSubmit()}
            placeholder="Enter your phone number"
            type="tel"
            name="phone"
            icon="arrow-next"
          />
        </div>
        <div className={styles.gallery}>
          {gallery.map((x, index) => (
            <div className={styles.preview} key={index}>
              <Image
                srcSet={`${x.srcSet} 2x`}
                srcSetDark={`${x.srcSetDark} 2x`}
                src={x.src}
                srcDark={x.srcDark}
                alt="Planning"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Planning;

