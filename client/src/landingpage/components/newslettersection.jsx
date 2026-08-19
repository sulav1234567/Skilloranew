import styles from "../css/newsletter.module.css";
import { FaArrowRight } from "react-icons/fa";

const Newsletter = () => {
  return (
    <div className={styles.newsletterContainer}>
      <div className={styles.newsletterWrapper}>
        
        {/* LEFT CONTENT */}
        <div className={styles.leftSection}>
          <div className={styles.heading}>
            Stay Updated with SkilSoora Hotels
          </div>

          <div className={styles.subText}>
            Subscribe to our newsletter and get the latest hotel management
            tips, feature updates, and business insights delivered directly to
            your inbox.
          </div>

          {/* INPUT + BUTTON */}
          <div className={styles.subscribeBox}>
            <input
              type="email"
              placeholder="Enter your email"
              className={styles.inputField}
            />

            <div className={styles.subscribeButton}>
              Subscribe <FaArrowRight />
            </div>
          </div>

          <div className={styles.bottomNote}>
            No spam • Unsubscribe anytime
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <div className={styles.rightSection}></div>
      </div>
    </div>
  );
};

export default Newsletter;