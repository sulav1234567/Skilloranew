import styles from "../css/landingpage.module.css";

const InfoSection = () => {
  return (
    <div className={styles.infoSection}>
      <div className={styles.infoContainer}>
        <div className={styles.infoHeader}>
          <div className={styles.infoBadge}>About SkillOra Hotels</div>

          <div className={styles.infoTitle}>
            What does SkillOra Hotels do?
          </div>

          <div className={styles.infoDescription}>
            SkillOra Hotels is a hotel management platform designed for hotel
            owners, managers, front office teams, and staff members.
          </div>
        </div>

        <div className={styles.infoMainBox}>
          <div className={styles.infoTextBlock}>
            <div className={styles.infoText}>
              It helps hotels organize bookings, manage guest information, track
              room availability, handle payments, generate bills, and manage
              daily hotel operations from a single powerful system.
            </div>

            <div className={styles.infoText}>
              The application allows hotel teams to reduce manual paperwork,
              improve reservation handling, manage guest records securely, and
              keep hotel operations organized in one place.
            </div>
          </div>

          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoCardTitle}>For Hotels</div>
              <div className={styles.infoCardText}>
                Manage rooms, reservations, guests, payments, invoices, and
                operational records.
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoCardTitle}>For Staff</div>
              <div className={styles.infoCardText}>
                Front office and hotel staff can quickly check guest details,
                bookings, room status, and payment information.
              </div>
            </div>

            <div className={styles.infoCard}>
              <div className={styles.infoCardTitle}>Secure Login</div>
              <div className={styles.infoCardText}>
                SkillOra Hotels uses Google Sign-In only to help users securely
                create an account or log in.
              </div>
            </div>
          </div>
        </div>

        <div className={styles.googleInfoBox}>
          <div className={styles.googleInfoTitle}>
            How SkillOra Hotels uses Google Sign-In
          </div>

          <div className={styles.googleInfoText}>
            When a user signs in with Google, SkillOra Hotels may access basic
            profile information such as the user's name, email address, and
            profile picture.
          </div>

          <div className={styles.googleInfoText}>
            This information is used only for authentication, account creation,
            and displaying the user profile inside the application.
          </div>

          <div className={styles.googleInfoText}>
            SkillOra Hotels does not access Gmail, Google Drive, Google
            Calendar, or any other private Google data.
          </div>

          <div className={styles.infoPolicyRow}>
            <div>Read our</div>

            <div
              className={styles.infoPolicyLink}
              onClick={() => (window.location.href = "/privacy-policy")}
            >
              Privacy Policy
            </div>

            <div>and</div>

            <div
              className={styles.infoPolicyLink}
              onClick={() => (window.location.href = "/terms")}
            >
              Terms of Service
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InfoSection;