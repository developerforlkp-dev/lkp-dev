import React, { useState, useEffect } from "react";
import cn from "classnames";
import styles from "./Header.module.sass";
import { Link, NavLink } from "react-router-dom";
import Image from "../Image";
import Notification from "./Notification";
import User from "./User";
import Icon from "../Icon";
import Modal from "../Modal";
import Login from "../Login";
import useDarkMode from "use-dark-mode";

const items = [
  {
    menu: [
      { title: "Bookings", icon: "home", url: "/bookings" },
    ],
  },
];

const Header = ({ separatorHeader, wide, notAuthorized, hideOnMobile }) => {
  const [visibleNav, setVisibleNav] = useState(false);
  const [visible, setVisible] = useState(false);
  const darkMode = useDarkMode(false);

  const isAuthenticated = () => {
    if (typeof window === "undefined") return false;
    return !!localStorage.getItem("jwtToken");
  };

  const shouldShowLogin = notAuthorized || !isAuthenticated();

  // Grab first name for the greeting card
  const userName =
    (typeof window !== "undefined" && localStorage.getItem("firstName")) ||
    "Traveler";

  // Lock body scroll when drawer is open (mobile UX)
  useEffect(() => {
    document.body.style.overflow = visibleNav ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [visibleNav]);

  // Logout — mirrors User/index.js logic exactly
  const handleMobileLogout = (e) => {
    e.preventDefault();
    ["jwtToken", "userInfo", "firstName", "lastName", "email"].forEach((k) =>
      localStorage.removeItem(k)
    );
    setVisibleNav(false);
    window.location.href = "/";
  };

  const closeDrawer = () => setVisibleNav(false);

  return (
    <>
      <div
        className={cn(
          styles.header,
          { [styles.headerBorder]: separatorHeader },
          { [styles.wide]: wide },
          { [styles.hideOnMobile]: hideOnMobile }
        )}
      >
        {/* ── Translucent backdrop — closes drawer on tap ── */}
        <div
          className={cn(styles.drawerBackdrop, { [styles.active]: visibleNav })}
          onClick={closeDrawer}
          aria-hidden="true"
        />

        <div className={cn("container", styles.container)}>
          <Link className={styles.logo} to="/">
            <Image
              className={styles.pic}
              src="/images/littleplanet-logo.svg"
              srcDark="/images/littleplanet-logo.svg"
              alt="FleetHome"
            />
          </Link>

          {/* ─────────── Premium Mobile Drawer ─────────── */}
          <div className={cn(styles.wrapper, { [styles.active]: visibleNav })}>

            {/* Top bar: brand */}
            <div className={styles.drawerTopBar}>
              <Link className={styles.drawerBrand} to="/" onClick={closeDrawer}>
                <Image
                  src="/images/littleplanet-logo.svg"
                  srcDark="/images/littleplanet-logo.svg"
                  alt="LKP"
                />
              </Link>
            </div>

            {/* Profile greeting card */}
            <div className={styles.drawerProfile}>
              <div className={styles.drawerProfileAvatar}>
                <Icon name="user" size="20" />
              </div>
              <div className={styles.drawerProfileText}>
                <div className={styles.drawerProfileName}>
                  {shouldShowLogin ? "Welcome" : `Hello, ${userName}`}
                </div>
                <div className={styles.drawerProfileRole}>
                  {shouldShowLogin ? "Sign in to explore" : "Premium Explorer"}
                </div>
              </div>
            </div>

            {/* Primary navigation */}
            <nav className={styles.drawerNav}>
              <NavLink
                className={styles.drawerNavItem}
                to="/bookings"
                activeClassName={styles.drawerNavActive}
                onClick={closeDrawer}
              >
                <span className={styles.drawerNavIcon}>
                  <Icon name="home" size="18" />
                </span>
                <span className={styles.drawerNavLabel}>Bookings</span>
                <Icon name="arrow-next" size="12" className={styles.drawerNavArrow} />
              </NavLink>

              {!shouldShowLogin && (
                <NavLink
                  className={styles.drawerNavItem}
                  to="/account-settings"
                  activeClassName={styles.drawerNavActive}
                  onClick={closeDrawer}
                >
                  <span className={styles.drawerNavIcon}>
                    <Icon name="user" size="18" />
                  </span>
                  <span className={styles.drawerNavLabel}>Account</span>
                  <Icon name="arrow-next" size="12" className={styles.drawerNavArrow} />
                </NavLink>
              )}
            </nav>

            {/* Push footer to bottom */}
            <div className={styles.drawerSpacer} />

            {/* Theme toggle row */}
            <button
              type="button"
              className={styles.drawerThemeRow}
              onClick={darkMode.toggle}
              aria-label={darkMode.value ? "Switch to light mode" : "Switch to dark mode"}
            >
              <span className={styles.drawerNavIcon}>
                <Icon name={darkMode.value ? "sun" : "moon"} size="18" />
              </span>
              <span className={styles.drawerNavLabel}>
                {darkMode.value ? "Light Mode" : "Dark Mode"}
              </span>
              <div className={cn(styles.drawerTogglePill, { [styles.on]: darkMode.value })}>
                <div className={styles.drawerToggleDot} />
              </div>
            </button>

            {/* Footer: Sign In / Log Out */}
            <div className={styles.drawerFooter}>
              {shouldShowLogin ? (
                <button
                  className={styles.drawerSignInBtn}
                  onClick={() => {
                    closeDrawer();
                    setVisible(true);
                  }}
                >
                  Sign In
                </button>
              ) : (
                <button
                  className={styles.drawerLogoutBtn}
                  onClick={handleMobileLogout}
                >
                  Log Out
                </button>
              )}
            </div>
          </div>
          {/* ─────────── End Premium Mobile Drawer ─────────── */}

          {/* Theme toggle — visible in header bar */}
          <button
            type="button"
            className={styles.themeToggle}
            onClick={darkMode.toggle}
            aria-label={darkMode.value ? "Switch to light mode" : "Switch to dark mode"}
            title={darkMode.value ? "Light mode" : "Dark mode"}
          >
            <Icon name={darkMode.value ? "sun" : "moon"} size="24" />
          </button>

          {/* Bookings text link — desktop only */}
          {!shouldShowLogin && (
            <NavLink
              className={cn(styles.link, styles.bookingsLink)}
              to="/bookings"
              activeClassName={styles.active}
            >
              Bookings
            </NavLink>
          )}

          <Notification className={styles.notification} />

          {/* User/Login icon — desktop only (drawer handles mobile) */}
          <span className={styles.desktopUserOnly}>
            {shouldShowLogin ? (
              <button className={styles.login} onClick={() => setVisible(true)}>
                <Icon name="user" size="24" />
              </button>
            ) : (
              <User className={styles.user} items={items} />
            )}
          </span>

          <button
            className={cn(styles.burger, { [styles.active]: visibleNav })}
            onClick={() => setVisibleNav(!visibleNav)}
          />
        </div>
      </div>

      <Modal visible={visible} onClose={() => setVisible(false)}>
        <Login onClose={() => setVisible(false)} />
      </Modal>
    </>
  );
};

export default Header;
