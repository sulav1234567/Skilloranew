import CreateReservationform from "../../components/reservationforms";
import "../../css/contentholder.css"
import styles from "../../css/reservation.module.css"
const Reservation = () => {
  return (
    <div className={"maincontainer"}>
        <div className={"topnavbar"}>
            
        </div>
        <div className={"contentholder"}>
          reservation
        </div>
        <CreateReservationform/>
    </div>
  );
};

export default Reservation;