import React, { useState } from "react";
import cn from "classnames";
import styles from "./SearchSummaryBar.module.sass";
import Dropdown from "../../Dropdown";
import Icon from "../../Icon";

const SearchSummaryBar = ({
  location,
  dateRange,
  guests,
  onModifySearch,
  className,
}) => {
  return (
    <div className={cn(styles.searchSummary, className)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.content}>
          <div className={styles.chip}>
            <Icon name="location" size="16" />
            <span>{location}</span>
          </div>
          
          <div className={styles.chip}>
            <Icon name="calendar" size="16" />
            <span>{dateRange}</span>
          </div>
          
          <div className={styles.chip}>
            <Icon name="user" size="16" />
            <span>{guests}</span>
          </div>
          
          <button
            className={cn("button-stroke button-small", styles.modifyButton)}
            onClick={onModifySearch}
          >
            Modify Search
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchSummaryBar;

