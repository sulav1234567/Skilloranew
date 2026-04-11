import { GoPersonFill } from "react-icons/go";
import styles from "../css/usernavigation.module.css"

const Usernavigation = ({name=""}) => {
  return (
    <div className={styles.usernavigation}>
        <div className={styles.usericon}>
            <GoPersonFill/>
        </div>
        <div className={styles.username}>
            {name}
        </div>
    </div>
  );
};

export default Usernavigation;