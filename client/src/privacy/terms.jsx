// Terms.jsx
import styles from "./privacy.module.css";
import { FaFileContract } from "react-icons/fa";

export default function Terms() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.header}>
          <FaFileContract className={styles.icon} />
          <div>
            <h1>Terms of Service</h1>
            <p className={styles.subtitle}>
              These terms govern your use of SkillOra. Please read them
              carefully.
            </p>
          </div>
        </div>

        <p className={styles.updated}>Last updated: April 2026</p>

        <div className={styles.card}>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing or using SkillOra, you agree to be bound by these
            terms.
          </p>
        </div>

        <div className={styles.card}>
          <h2>2. User Responsibilities</h2>
          <p>
            You are responsible for maintaining account security and for all
            activities under your account.
          </p>
        </div>

        <div className={styles.card}>
          <h2>3. Prohibited Use</h2>
          <p>
            You agree not to misuse the platform or engage in illegal
            activities.
          </p>
        </div>

        <div className={styles.card}>
          <h2>4. Termination</h2>
          <p>
            We reserve the right to suspend or terminate accounts that violate
            our policies.
          </p>
        </div>

        <div className={styles.card}>
          <h2>5. Contact</h2>
          <p>For support, contact support@skillora.com</p>
        </div>
      </div>
    </div>
  );
}

