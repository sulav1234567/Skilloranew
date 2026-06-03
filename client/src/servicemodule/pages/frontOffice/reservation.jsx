import CreateReservationform from "../../components/reservationforms";
import styles from "../../css/reservation.module.css"
const Reservation = () => {
  return (
    <div className={styles.maincontainer}>
        <div className={styles.topnavbar}>
            
        </div>
        <div className={styles.contentholder}>
          reservation
        </div>
        <CreateReservationform/>
    </div>
  );
};

export default Reservation;