import React from "react";
import cn from "classnames";
import styles from "./Main.module.sass";
import Control from "../../../components/Control";
import { Link } from "react-router-dom";
const breadcrumbs = [
  {
    title: "Home",
    url: "/",
  },
  {
    title: "Wishlists",
  },
];

const Main = () => {
  return (
    <div className={cn("section", styles.section)}>
      <div className={cn("container", styles.container)}>
        <Control
          className={styles.control}
          urlHome="/"
          breadcrumbs={breadcrumbs}
        />
        <div className={styles.emptyWrapper} style={{ textAlign: "center", padding: "80px 0", maxWidth: "400px", margin: "0 auto" }}>
          <div style={{ fontSize: "64px", marginBottom: "24px" }}>❤️</div>
          <h1 className={cn("h2", styles.title)} style={{ marginBottom: "16px" }}>Your Wishlist is Empty</h1>
          <p style={{ marginBottom: "32px", fontSize: "16px", color: "var(--n4)", lineHeight: "1.5" }}>
            Looks like you haven't added anything to your wishlist yet. Discover our amazing experiences and start adding!
          </p>
          <Link to="/experiences" className={cn("button", styles.button)} style={{ width: "100%" }}>
            Explore Experiences
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Main;
