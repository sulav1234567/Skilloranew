
import styles from "../css/landingpage.module.css";
import heroimage from "../../assets/heroimage.jpg";
import { GiGraduateCap } from "react-icons/gi";
const Mainherosection = () => {
  return (
      <div className={styles.heroSection}>
        <div className={`${styles.herochild} ${styles.heroleft}`}>
            <div className={styles.herolefttag}>
                <div className={styles.tagglow}></div>
                <div className={styles.tagtext}>Trusted by 10,000+ educators worldwide</div>
            </div>
          <div className={styles.herochildmaintext}>
            Transform Your Learning Experience
          </div>

          <div className={styles.herochilddiscriptivetext}>
            Skillora empowers educators and learners with a powerful, intuitive platform that makes online learning engaging, efficient, and accessible for everyone.
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

                2500+
                </div>
                <div className={styles.herorighttagsecondarytext}>

                Expert Instructors
                </div>
                
                </div>
          </div>
        </div>
      </div>
  );
};

export default Mainherosection;