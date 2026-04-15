
import styles from "./privacy.module.css";
import { FaShieldAlt } from "react-icons/fa";

export default function Privacy() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <FaShieldAlt className={styles.icon} />
          <div>
            <h1>Privacy Policy</h1>
            <p className={styles.subtitle}>
              Your privacy matters. This policy explains how SkillOra collects,
              uses, and protects your data.
            </p>
          </div>
        </div>

        <p className={styles.updated}>Last updated: April 2026</p>

        <div className={styles.card}>
          <h2>1. Information We Collect</h2>
          <p>
            We collect personal information such as your name, email address,
            and account activity. This helps us provide a better and more
            personalized experience.
          </p>
        </div>

        <div className={styles.card}>
          <h2>2. How We Use Your Information</h2>
          <p>
            Your data is used to operate and improve our services, authenticate
            users, and enhance platform security.
          </p>
        </div>

        <div className={styles.card}>
          <h2>3. Data Protection</h2>
          <p>
            We implement strong security practices including encryption and
            secure storage to protect your information.
          </p>
        </div>

        <div className={styles.card}>
          <h2>4. Third-Party Services</h2>
          <p>
            We may use trusted third-party services (like authentication
            providers) to enhance functionality.
          </p>
        </div>

        <div className={styles.card}>
          <h2>5. Contact Us</h2>
          <p>
            If you have any questions, contact us at support@skillora.com
          </p>
        </div>
      </div>
    </div>
  );
}
