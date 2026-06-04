import React from "react";
import cn from "classnames";
import styles from "./Main.module.sass";
import Panel from "../../../components/Panel";
import Location from "../../../components/Location";
import DateRange from "../../../components/DateRange";
import Guests from "../../../components/Guests";

const Main = ({ items, value, setValue }) => {
  const handleClick = (value) => {
    setValue(value);
  };

  return (
    <div className={cn("section-mb80", styles.section)}>
      <div className={styles.bg}>
        <img src="" alt="Flight" />
      </div>
      <div className={cn("container", styles.container)}>
        <Panel
          className={styles.panel}
          classBody={styles.body}
          classButtonSearch={styles.search}
          onSearch={() => console.log("Search")}
        >
          <div className={styles.controls}>
            <div className={styles.nav}>
              {items.map((x, index) => (
                <button
                  className={cn(styles.link, {
                    [styles.active]: x.title === value,
                  })}
                  onClick={() => handleClick(x.title)}
                  key={index}
                >
                  {x.title}
                </button>
              ))}
            </div>
            <Guests className={styles.guests} title="1 guest" />
          </div>
          <div className={styles.row}>
            <Location
              className={styles.location}
              icon="marker"
              placeholder="Flying from"
              small
              bodyDown
            />
            <Location
              className={styles.location}
              icon="location"
              placeholder="Flying to"
              small
              bodyDown
            />
            <DateRange
              className={styles.date}
              icon="calendar"
              startDatePlaceholderText="Departure"
              endDatePlaceholderText="Return"
              displayFormat="MMM DD, YYYY"
              small
              bodyDown
            />
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default Main;

