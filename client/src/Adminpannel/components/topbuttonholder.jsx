
import styles from "../css/buttons.module.css"
const Topbuttonholder = ({heading="",subheading="",children}) => {
  return (
    <div className={styles.topbtnsholder}>
           <div className={styles.headingandsubheading}>
             <div className={styles.heading}>
               {heading}
             </div>
             <div className={styles.subheading}>
               {subheading}
             </div>
           </div>
   
           <div className={styles.buttonholder}>

            {children}

           </div>
         </div>
  );
};

export const Button = ({classname="",onclick=()=>{},name=""})=>{
    return(
<button className={styles[classname]} onClick={onclick}>{name}</button>
    )
}

export default Topbuttonholder;