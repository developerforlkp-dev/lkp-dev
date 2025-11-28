import React from "react";
import cn from "classnames";
import styles from "./Services.module.sass";
import Slider from "react-slick";
import Icon from "../../../../../components/Icon";

const services = [
  {
    title: "Food",
    content:
      "Delicious picnic lunch. Please let us know if you have any dietary requirem...",
    icon: "pizza-slice",
    color: "rgba(0, 151, 178, 0.1)",
  },
  {
    title: "Drinks",
    content:
      "Delicious picnic lunch. Please let us know if you have any dietary requirem...",
    icon: "glass",
    color: "rgba(0, 151, 178, 0.1)",
  },
  {
    title: "Food",
    content:
      "Delicious picnic lunch. Please let us know if you have any dietary requirem...",
    icon: "pizza-slice",
    color: "rgba(0, 151, 178, 0.1)",
  },
  {
    title: "Drinks",
    content:
      "Delicious picnic lunch. Please let us know if you have any dietary requirem...",
    icon: "glass",
    color: "rgba(0, 151, 178, 0.1)",
  },
];

const SlickArrow = ({ currentSlide, slideCount, children, ...props }) => (
  <button {...props}>{children}</button>
);

const Live = ({ className }) => {
  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    nextArrow: (
      <SlickArrow>
        <Icon name="arrow-next" size="14" />
      </SlickArrow>
    ),
    prevArrow: (
      <SlickArrow>
        <Icon name="arrow-prev" size="14" />
      </SlickArrow>
    ),
  };

  return (
    <div className={cn(className, styles.services)}>
      <div className={styles.wrapper}>
        <Slider className="services-slider" {...settings}>
          {services.map((x, index) => (
            <div className={styles.slide} key={index}>
              <div className={styles.item} style={{ backgroundColor: x.color }}>
                <div className={styles.icon}>
                  <Icon name={x.icon} size="32" />
                </div>
                <div className={styles.title}>{x.title}</div>
                <div className={styles.text}>{x.content}</div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default Live;
