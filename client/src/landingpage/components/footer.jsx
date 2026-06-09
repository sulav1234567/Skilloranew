import { useNavigate } from "react-router";
import styles from "../css/footer.module.css";
import {
  FaFacebookF,
  FaTwitter,
  FaLinkedinIn,
  FaInstagram,
  FaYoutube,
} from "react-icons/fa";

const Footer = () => {
  let navigate=useNavigate()
  return (
    <div className={styles.footerContainer}>
      <div className={styles.footerContent}>
        
        {/* LEFT SECTION */}
        <div className={styles.brandSection}>
          <div className={styles.brandName}>Skillora Hotels</div>
          <div className={styles.brandDescription}>
            Helping hotels, lodges, resorts, and guest houses manage
            reservations, guests, rooms, billing, and daily operations with ease.
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
            <div className={styles.link}>Hotel Features</div>
            <div className={styles.link}>Pricing</div>
            <div className={styles.link}>Security</div>
            <div className={styles.link}>Integrations</div>
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
            <div className={styles.link}>Setup Guide</div>
            <div className={styles.link}>Hotel Operations Guide</div>
            <div className={styles.link}>Case Studies</div>
            <div className={styles.link}>Community</div>
          </div>

          <div className={styles.linkColumn}>
            <div className={styles.columnTitle}>Legal</div>
            <div className={styles.link} onClick={()=>{
              navigate("/privacy")

            }}>Privacy Policy</div>
            <div className={styles.link} onClick={()=>{
              navigate("/terms")
            }}>Terms of Service</div>
            <div className={styles.link}>Cookie Policy</div>
            <div className={styles.link}>Data Protection</div>
            <div className={styles.link}>Accessibility</div>
          </div>

        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className={styles.footerBottom}>
        <div className={styles.copyright}>
          © 2026 Skillora Hotels. All rights reserved. Created By Sulav Khatiwada
        </div>

        <div className={styles.bottomLinks}>
          <div className={styles.bottomLink}>System Status</div>
          <div className={styles.bottomLink}>Updates</div>
          <div className={styles.bottomLink}>Hotel Partners</div>
        </div>
      </div>
    </div>
  );
};

export default Footer;