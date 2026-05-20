import styles from '../css/hoteloverview.module.css'
import { useHotelData } from './hoteldetailedviewoutlet';
import { FiPlus } from "react-icons/fi";
import { MdModeEdit } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import { FaStar } from "react-icons/fa";
import { formatDate } from '../components/dateformatter';
import { LuCalendarCheck2 } from "react-icons/lu";

const SeedStar = (star=0)=>{
    
        return ( Array.from({length:star}).map((_,ind)=><div key={ind} className={styles.star}
        style={{transform:`translateX(-${10*ind - (4*ind)}px)`}}
        >
            <FaStar/>
        </div>)
        )

    

}

const CancellationPolicy = ({policy=""})=>{
    return (

        <div className={styles.policypointsholder}>
                    {policy?.split("%sp").map((points,index)=>{
                        return <div className={styles.policypoint} key={index}>
                            <div className={styles.policypointicon}><GoDotFill/></div>
                            <div className={styles.policytext}>{points}</div>
                        </div>
                    })}
                </div>
    )
}

const Hoteloverview = () => {
    let{hotel,FetchHotelData}=useHotelData()
  return (
    <>
    <div className={styles.overviewcontainer}>
        <div className={styles.containerone}>
            <div className={styles.infoeditbtnholder}>
                <div className={styles.infoeditbtn}>
                    <MdModeEdit/>
                </div>
            </div>


            <div className={styles.infomainnameholder}>
                {hotel?.name}

                <div className={styles.orgtype}>
                    {hotel?.category}
                </div>
            </div>


           <div className={styles.simpleinfoholder}>
            <div className={styles.starratingholder} style={{transform:`translateX(-${hotel?.starRating * 4}px)`}}>
                <div className={styles.starsholder} style={{transform:`translateX(${hotel?.starRating * 4}px)`}}>
                    {SeedStar(hotel?.starRating)}
                </div>
                <div className={styles.starratingtext}>{hotel?.starRating} Star{hotel?.starRating>0?"s":""} Hotel</div>
            </div>

            <div className={styles.registration}>
                <div className={styles.regIcon}> <LuCalendarCheck2/></div>
                <div className={styles.regText}>{formatDate(hotel?.createdAt)}</div>
            </div>
           </div>
            <div className={styles.infopointsholder}>
                <div className={styles.infolabel}>Cancellation Policy:</div>
               <CancellationPolicy policy={hotel?.policies.cancellationPolicy}/>
            </div>
            <div className={styles.infoholder}>
                <div className={styles.infolabel}>Discription:</div>
                <div className={styles.infovalue}>{hotel?.description}</div>

            </div>

        </div>
        <div className={styles.containertwo}>
            <div className={styles.hotelimage}>
                <img src={`${import.meta.env.VITE_BASE_URL}/uploads/${hotel?.image.filename}`} alt="" />
            </div>

            <div className={styles.hotelcard}>
                <div className={styles.cardtitle}>
                    Owner Information
                </div>
                  <div className={styles.hotelcardcontent}>
                    {!hotel?.owner && <div className={styles.notfoundcardtext}>Owner Not Assigned!</div>}
                  </div>
                <div className={styles.cardbtn}>
                    <div className={styles.cardbtnicon}><FiPlus/></div>
                    <div className={styles.cardbtntext}>Create Owner</div>
                </div>

            </div>
        </div>
    </div>
     </>
  );
};

export default Hoteloverview;