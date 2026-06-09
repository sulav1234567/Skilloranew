
import styles from "../css/landingpage.module.css";
import heroimage from "../../assets/hotelimage.webp";
import { GiGraduateCap } from "react-icons/gi";
const Mainherosection = () => {
  return (
      <div className={styles.heroSection}>
        <div className={`${styles.herochild} ${styles.heroleft}`}>
            <div className={styles.herolefttag}>
                <div className={styles.tagglow}></div>
                <div className={styles.tagtext}>Trusted by hotels, lodges, and resorts</div>
            </div>
          <div className={styles.herochildmaintext}>
            Simplify Your Hotel Management
          </div>

          <div className={styles.herochilddiscriptivetext}>
            Skillora helps hotels manage reservations, guests, rooms, payments, and daily operations from one powerful and easy-to-use platform.
          </div>
        <div className={styles.herobtnsholder}>
            <div className={styles.secondarybtn}>Start free trial</div>
            <div className={styles.primarybtn}>Book Demo</div>
        </div>
        </div>

        <div className={`${styles.herochild} ${styles.heroright}`}>
          <div className={styles.herorightimage}>
            <img src={heroimage} alt="heroimage" />
          </div>

          <div className={styles.herorighttag}>
            <div className={styles.herotagicon}>
                <GiGraduateCap/>
                
            </div>
            <div className={styles.herorightagtext}>
                <div className={styles.herorighttagprimarytext}>

                500+
                </div>
                <div className={styles.herorighttagsecondarytext}>

                Hotel Operations Managed
                </div>
                
                </div>
          </div>
        </div>
      </div>
  );
};

export default Mainherosection;