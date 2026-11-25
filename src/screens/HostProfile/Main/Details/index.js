import React from "react";
import cn from "classnames";
import styles from "./Details.module.sass";
import Icon from "../../../../components/Icon";

const Details = ({ className, host, businessInterests }) => {
  const hostBio = typeof host?.bio === "string" ? host.bio.trim() : "";

  const formattedInterests = Array.isArray(businessInterests)
    ? businessInterests
        .map((item) => (typeof item === "string" ? item : item?.name || item?.businessInterestName || item?.code || ""))
        .filter(Boolean)
    : [];

  if (!hostBio && formattedInterests.length === 0) return null;

  return (
    <section className={cn(className, styles.details)} aria-labelledby="about-host-heading">
      <h2 className={styles.title} id="about-host-heading">About Host</h2>
      <div className={styles.layout}>
        {hostBio && <p className={styles.content}>{hostBio}</p>}
        {formattedInterests.length > 0 && (
          <dl className={styles.options}>
            <dt className={styles.category}>
              <Icon name="route" size="20" />
              Interests
            </dt>
            <dd className={styles.text}>
              <ul className={styles.interests}>
                {formattedInterests.map((interest, index) => (
                  <li key={index}>{interest}</li>
                ))}
              </ul>
            </dd>
          </dl>
        )}
      </div>
    </section>
  );
};

export default Details;
