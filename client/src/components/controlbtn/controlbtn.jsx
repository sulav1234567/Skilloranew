
import styles from "./controlbtn.module.css"
const Controlbtn = () => {
  return (
    <>
    <div className={styles.controlbtnholder}>
      <div className={styles.headingandsubheading}>
        <div className={styles.heading}>Department</div>
        <div className={styles.subheading}>
          manage your all departments here
        </div>
      </div>
        <div className={`${styles.controlbtn} ${styles.controlbtnprimary}`}>Add Department</div>
    </div>
    </>
  );
};

export default Controlbtn;