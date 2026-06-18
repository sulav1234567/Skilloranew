
import { NameInitials } from "../../leftnavbar/leftnavbar";
import { IoLocationSharp } from "react-icons/io5";
import { BiSolidIdCard } from "react-icons/bi";
import { HiMiniArrowsRightLeft } from "react-icons/hi2";
import styles from "../css/reservationform.module.css";
let GuestCard = ({guest={}})=>{

return (<div className={styles.guestCard}>

                <div className={styles.guesttopwrapper}>
                <div className={styles.guestProfile}>
                  {NameInitials(`${guest?.firstName} ${guest?.lastName}`)}
                  
                </div>
                <div className={styles.guestinfo}>
                  <div className={styles.guestname}>
                    {`${guest?.firstName} ${guest?.lastName}`}
                    
                  </div>
                  <div className={styles.guestcontact}>
                    {guest?.email} . {guest?.phone}
                    
                  </div>

                  <div className={styles.location}>
                    <div className={styles.locationicon}>
                      <IoLocationSharp/>
                      
                    </div>
                    <div className={styles.locationtext}>
                      {guest?.address}
                      
                    </div>
                    
                  </div>
                  
                </div>
                  
                </div>

                <div className={styles.guestotherinformation}>
                  <div className={styles.guestheading}>
                   Guest Identity:
                    
                  </div>
                  <div className={styles.guestidinfo}>
                    <div className={styles.idicon}>
                      <BiSolidIdCard/>
                      
                    </div>
                    <div className={styles.idtext}>
                      {guest?.idType} : {guest?.idNumber}
                      
                    </div>
                    
                  </div>

                  <div className={styles.guestidinfo}>
                    <div className={styles.idicon}>
                      <HiMiniArrowsRightLeft/>
                      
                    </div>
                    <div className={styles.idtext}>
                      GuestType: {guest?.guestType}
                      
                    </div>
                    
                  </div>
                  
                </div>
                
                  
               
                
              </div>)
}

export default GuestCard
