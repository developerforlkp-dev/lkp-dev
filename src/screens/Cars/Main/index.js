import React from "react";
import cn from "classnames";
import { Link } from "react-router-dom";
import styles from "./Main.module.sass";
import Panel from "../../../components/Panel";
import Location from "../../../components/Location";
import DateRange from "../../../components/DateRange";

const Main = () => {
  return (
    <div className={cn("section-mb80", styles.section)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.preview}>
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet=""
            />
            <img src="" alt="Main" />
          </picture>
          <div className={styles.wrap}>
            <h1 className={cn("hero", styles.title)}>Car rentals</h1>
            <div className={cn("info", styles.info)}>
              Find and book a great experience.
            </div>
            <Link className={cn("button", styles.button)} to="/cars-category">
              Start your search
            </Link>
          </div>
        </div>
        <Panel
          className={styles.panel}
          menu
          classBody={styles.body}
          classButtonSearch={styles.search}
          onSearch={() => console.log("Search")}
        >
          <div className={styles.controls}>
            <button
              className={cn(
                "button-stroke button-small",
                styles.active,
                styles.button
              )}
            >
              Return to same location
            </button>
            <button className={cn("button-stroke button-small", styles.button)}>
              Return to same different location
            </button>
          </div>
          <div className={styles.row}>
            <Location
              className={styles.location}
              icon="marker"
              description="Where are you?"
              placeholder="Pickup location"
            />
            <DateRange
              className={styles.date}
              icon="calendar"
              description="Add date"
              startDatePlaceholderText="Departure"
              endDatePlaceholderText="Return"
              displayFormat="ddd, MMM DD"
            />
          </div>
        </Panel>
      </div>
    </div>
  );
};

export default Main;

