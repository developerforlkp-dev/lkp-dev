import React, { useState } from "react";
import cn from "classnames";
import styles from "./Sorting.module.sass";
import Dropdown from "../Dropdown";

const Sorting = ({
  className,
  urlHome,
  breadcrumbs,
  navigation,
  title,
  sale,
  details,
  info,
  sorting,
  setSorting,
  sortingOptions,
}) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const categoriesOptions = [];
  navigation.map((x) => categoriesOptions.push(x));
  const [categories, setCategories] = useState(categoriesOptions[0]);

  return (
    <div className={cn(className, styles.sorting)}>
      <div className={cn("container", styles.container)}>
        <div className={styles.foot}>
          <div className={styles.nav}>
            {navigation.map((x, index) => (
              <button
                className={cn(styles.link, {
                  [styles.active]: index === activeIndex,
                })}
                onClick={() => setActiveIndex(index)}
                key={index}
              >
                {x}
              </button>
            ))}
          </div>
          <Dropdown
            className={cn("tablet-show", styles.dropdown)}
            value={categories}
            setValue={setCategories}
            options={categoriesOptions}
          />
          <Dropdown
            className={styles.dropdown}
            value={sorting}
            setValue={setSorting}
            options={sortingOptions}
          />
        </div>
      </div>
    </div>
  );
};

export default Sorting;
