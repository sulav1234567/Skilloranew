
import styles from "../css/footer.module.css";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  return (
    <div className={styles.footerContainer}>
      <div className={styles.footerContent}>
        
        {/* LEFT SECTION */}
        <div className={styles.brandSection}>
          <div className={styles.brandName}>Skillora</div>
          <div className={styles.brandDescription}>
            Empowering educators and learners worldwide with innovative
            learning management solutions.
          </div>

          <div className={styles.socialIcons}>
            <div className={styles.icon}><FaFacebookF /></div>
            <div className={styles.icon}><FaTwitter /></div>
            <div className={styles.icon}><FaLinkedinIn /></div>
            <div className={styles.icon}><FaInstagram /></div>
            <div className={styles.icon}><FaYoutube /></div>
          </div>
        </div>

        {/* LINKS SECTION */}
        <div className={styles.linksSection}>
          
          <div className={styles.linkColumn}>
            <div className={styles.columnTitle}>Product</div>
            <div className={styles.link}>Features</div>
            <div className={styles.link}>Pricing</div>
            <div className={styles.link}>Security</div>
            <div className={styles.link}>Roadmap</div>
            <div className={styles.link}>API</div>
          </div>

          <div className={styles.linkColumn}>
            <div className={styles.columnTitle}>Company</div>
            <div className={styles.link}>About Us</div>
            <div className={styles.link}>Careers</div>
            <div className={styles.link}>Blog</div>
            <div className={styles.link}>Press Kit</div>
            <div className={styles.link}>Contact</div>
          </div>

          <div className={styles.linkColumn}>
            <div className={styles.columnTitle}>Resources</div>
            <div className={styles.link}>Help Center</div>
            <div className={styles.link}>Documentation</div>
            <div className={styles.link}>Webinars</div>
            <div className={styles.link}>Case Studies</div>
            <div className={styles.link}>Community</div>
          </div>

          <div className={styles.linkColumn}>
            <div className={styles.columnTitle}>Legal</div>
            <div className={styles.link}>Privacy Policy</div>
            <div className={styles.link}>Terms of Service</div>
            <div className={styles.link}>Cookie Policy</div>
            <div className={styles.link}>GDPR</div>
            <div className={styles.link}>Accessibility</div>
          </div>

        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className={styles.footerBottom}>
        <div className={styles.copyright}>
          © 2026 Skillora. All rights reserved.
        </div>

        <div className={styles.bottomLinks}>
          <div className={styles.bottomLink}>Status</div>
          <div className={styles.bottomLink}>Changelog</div>
          <div className={styles.bottomLink}>Partners</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;