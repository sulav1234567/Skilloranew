import { memo } from 'react';
import styles from "../css/reservationform.module.css"
import { RxCross1 } from "react-icons/rx";

const CreateReservationform = () => {
  return (
   <div className={styles.reservationformcontainer}>
    <div className={styles.reservationform}>
        <div className={styles.reservationformheader}>
            <div className={styles.titleandsubtitle}>
                <div className={styles.title}>
                    Create Reservation
                </div>
                <div className={styles.subtitle}>
                    Fill Up This Form To Create The Reservation
                </div>
            </div>
            <div className={styles.exitbtn}>
               <RxCross1/>
            </div>
        </div>

    </div>

   </div>
  );
};

export default CreateReservationform;