import React from "react";
import StatusLayout from "../../components/StatusLayout";
import Icon from "../../components/Icon";
import styles from "./ServerError.module.sass";

const ServerError = () => {
  const graphic = (
    <div className={styles.graphic}>
      <div className={styles.iconContainer}>
        <Icon name="monitor" size="64" className={styles.monitorIcon} />
        <div className={styles.errorBadge}>
          <Icon name="close" size="20" className={styles.closeIcon} />
        </div>
      </div>
      <h1 className={styles.huge500}>500</h1>
    </div>
  );

  const description = (
    <>
      Oops! Something went wrong on our end.<br />
      We're experiencing technical difficulties.
    </>
  );

  return (
    <StatusLayout
      graphic={graphic}
      title="Internal Server Error"
      description={description}
      primaryAction={{ label: "Refresh Page", onClick: () => window.location.reload() }}
      secondaryAction={{ label: "Go to Home", to: "/", icon: "home" }}
      supportProps={{ title: "Need Help?", description: "If this keeps happening, our support team is standing by." }}
    >
      <div className={styles.tipsBox}>
        <div className={styles.tipText}>
          <strong>What can you do?</strong>
          <span>Wait a few minutes and try refreshing the page. We are likely already working on a fix!</span>
        </div>
      </div>
    </StatusLayout>
  );
};

export default ServerError;
