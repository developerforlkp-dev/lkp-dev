import React from "react";
import cn from "classnames";
import styles from "./ProfileUser.module.sass";
import Icon from "../../components/Icon";
import Profile from "../../components/Profile";
import Reviews from "../../components/Reviews";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader";
import { getCustomerProfile } from "../../utils/api";
import Background from "./Background";
import Details from "./Details";
import { useState, useEffect } from "react";

const parametersUser = [
  {
    title: "Indentity verified",
    icon: "tick",
  },
  {
    title: "256 reviews",
    icon: "star-outline",
  },
];

const socials = [
  {
    title: "twitter",
    url: "https://twitter.com/ui8",
  },
  {
    title: "instagram",
    url: "https://www.instagram.com/ui8net/",
  },
  {
    title: "facebook",
    url: "https://www.facebook.com/ui8.net/",
  },
];

const avatars = [
  "/images/content/avatar-variant-1.jpg",
  "/images/content/avatar-variant-2.jpg",
  "/images/content/avatar-variant-3.jpg",
  "/images/content/avatar-variant-4.jpg",
  "/images/content/avatar-variant-5.jpg",
];

const ProfileUser = () => {
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await getCustomerProfile();
        if (data && data.customer) {
          setUser(data.customer);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className={styles.loaderWrapper} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <Loader />
      </div>
    );
  }

  const userSocials = user ? [
    { title: "instagram", url: user.instagram || "" },
    { title: "facebook", url: user.facebook || "" },
    { title: "linkedin", url: user.linkedin || "" },
    { title: "twitter", url: user.twitter || "" },
  ].filter(s => s.url) : [];

  const displayName = user 
    ? [user.firstName, user.lastName].filter(Boolean).join(" ") || "User"
    : "Kohaku Tora";

  return (
    <>
      <div className={styles.section}>
        <Background className={styles.background} />
        <div className={styles.body}>
          <div className={cn("container", styles.container)}>
            <Profile
              className={styles.profile}
              parametersUser={parametersUser}
              socials={userSocials.length > 0 ? userSocials : socials}
              buttonText="Message"
            >
              <div className={cn(styles.avatar, styles.big)}>
                <img src={user?.avatarUrl || "/images/content/avatar-girl.jpg"} alt="Avatar" />
              </div>
              <button
                className={styles.update}
                onClick={() => setVisible(true)}
              >
                <Icon name="pencil" size="20" />
                Update avatar
              </button>
              <div className={cn("h4", styles.man)}>{displayName}</div>
            </Profile>
            <div className={styles.wrapper}>
              <Details className={styles.details} />
              <Reviews className={styles.reviews} />
            </div>
          </div>
        </div>
      </div>
      <Modal
        visible={visible}
        onClose={() => setVisible(false)}
        outerClassName={styles.outer}
      >
        <div className={styles.file}>
          <input className={styles.load} type="file" />
          <div className={styles.icon}>
            <Icon name="upload-file" size="48" />
          </div>
          <div className={styles.format}>Drag and drop your photo here</div>
          <div className={styles.note}>or click to browse</div>
        </div>
        <div className={styles.gallery}>
          <div className={styles.info}>Use Fleet’s default photos</div>
          <div className={styles.list}>
            {avatars.map((x, index) => (
              <div className={styles.avatar} key={index}>
                <img src={x} alt="Avatar" />
              </div>
            ))}
          </div>
        </div>
      </Modal>
    </>
  );
};

export default ProfileUser;
