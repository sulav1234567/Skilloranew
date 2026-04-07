import styles from "../css/landingpage.module.css"
import logo from "../../assets/image.svg";

const Topnavbar = () => {
  return (
     <div className={styles.topnavbar}>
            <div className={styles.topnavbarlogoholder}>
              <div className={styles.topnavbarlogo}>
                <img src={logo} alt="logo" />
              </div>
              <div className={styles.topnavbarlogotext}>SkillOra</div>
            </div>
    
            <div className={styles.loginandsignupbtnholder}>
              <div className={styles.primarybtn}>Login</div>
              <div className={styles.secondarybtn}>Get Started</div>
            </div>
          </div>
  );
};

export default Topnavbar;