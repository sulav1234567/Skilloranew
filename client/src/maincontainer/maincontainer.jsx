import styles from "./maincontainer.module.css"

const Maincontainer = ({children}) => {
  return (
    <div className={styles.maincontainer}>
      {children}
    </div>
  );
};

export default Maincontainer;