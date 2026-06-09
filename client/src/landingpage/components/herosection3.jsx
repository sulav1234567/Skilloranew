import styles from "../css/herosection3.module.css"
import image1 from "../../assets/hero3image1.jpeg"
import image2 from "../../assets/hero3image2.jpeg"
import { FaCheck } from "react-icons/fa6";

const CardPoint=({text})=>{
    return  <div className={styles.cardpoints}>
                        <div className={styles.cardpointsicon}>
                            <FaCheck/>

                        </div>
                        <div className={styles.cardpointstext}>
                            {text}
                        </div>
                    </div>
}

const Herosection3 = () => {
  return (
    <div className={styles.herosection3}>
        <div className={styles.herosection3heading}>Built for Every Hotel Operation</div>
        <div className={styles.herosection3subheading}>Whether you run a hotel, lodge, resort, or guest house, Skillora adapts to your daily management needs.</div>

        <div className={styles.herosection3cardsholder}>
            <div className={styles.herosection3card}>
                <div className={styles.cardimage}>
                    <img src={image1} alt="" />
                </div>

                <div className={styles.cardtitle}>For Front Office Teams</div>

                <div className={styles.cardpointsholder}>
                   <CardPoint text={"Manage reservations and walk-in guests easily"}/>
                   <CardPoint text={"Handle check-ins and check-outs faster"}/>
                   <CardPoint text={"Assign rooms based on availability"}/>
                   <CardPoint text={"Access guest details and stay history quickly"}/>
                   
                </div>
            </div>
            <div className={styles.herosection3card}>
                <div className={styles.cardimage}>
                    <img src={image2} alt="" />
                </div>

                <div className={styles.cardtitle}>For Hotel Management</div>

                <div className={styles.cardpointsholder}>
                   <CardPoint text={"Track occupancy, revenue, and bookings"}/>
                   <CardPoint text={"Manage rooms, staff roles, and permissions"}/>
                   <CardPoint text={"Generate invoices and monitor payments"}/>
                   <CardPoint text={"Improve daily operations and reduce manual work"}/>
                   
                </div>
            </div>

            

        </div>

    </div>
  );
};

export default Herosection3;