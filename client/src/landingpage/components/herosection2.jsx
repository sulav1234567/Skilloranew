
import styles from "../css/herosection2.module.css"
import { FaCalendarCheck, FaUsers, FaChartLine, FaFileInvoiceDollar } from "react-icons/fa";
import { MdBedroomParent, MdSecurity } from "react-icons/md";
const cardDetail = [
    {
        title:"Smart Reservation Management",
        subtitle:"Manage bookings, check-ins, check-outs, cancellations, and room availability from one simple dashboard.",
        icon:<FaCalendarCheck/>
    },
    {
        title:"Guest Profile Management",
        subtitle:"Store guest details, contact information, stay history, preferences, and documents for faster service.",
        icon:<FaUsers/>
    },
    {
        title:"Business Analytics",
        subtitle:"Track occupancy, revenue, reservations, payments, and hotel performance with clear insights.",
        icon:<FaChartLine/>
    },
    {
        title:"Room & Front Office Operations",
        subtitle:"Handle room assignments, housekeeping status, walk-in guests, and daily front office activities smoothly.",
        icon:<MdBedroomParent/>
    },
    {
        title:"Billing & Invoicing",
        subtitle:"Create folios, manage payments, generate invoices, and keep guest billing organized and accurate.",
        icon:<FaFileInvoiceDollar/>
    },
    {
        title:"Secure Hotel Management",
        subtitle:"Protect hotel, guest, and payment data with secure access control and role-based permissions.",
        icon:<MdSecurity/>
    },
]

const HeroSection2Card=({detail})=>{
    return (
        <div className={styles.herosection2card}>
            <div className={styles.cardicon}>
                {detail.icon}
            </div>
            <div className={styles.cardtitle}>
                {detail.title}
            </div>
            <div className={styles.cardsubtitle}>
                {detail.subtitle}
            </div>
        </div>
        
    )
}
const Herosection2 = () => {
  return (
   <div className={styles.herosection2}>
    <div className={styles.mainheader}>
        Everything Your Hotel Needs to Operate Smarter

    </div>

    <div className={styles.secondaryheading}>
        Powerful features designed to manage reservations, guests, rooms, billing, and daily hotel operations with ease.
    </div>


    <div className={styles.herosection2CardsHolder}>
       {cardDetail.map((detail,index)=>{
        return <HeroSection2Card detail={detail} key={index}/>
       })}

    </div>

   </div>
  );
};

export default Herosection2;