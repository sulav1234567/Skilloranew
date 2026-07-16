import { useState } from "react";
import CreateReservationform from "../../components/reservationforms";
import styles from "../../css/reservation.module.css";
import { IoAddOutline } from "react-icons/io5";
import api from "../../../axios/axios";
import { useNavigate, useParams } from "react-router";
import { useGlobalMessageContext } from "../../../Globalmessage/components/globalmessage";
import { useEffect } from "react";
import { LuCalendarDays } from "react-icons/lu";
import { IoMdArrowRoundUp } from "react-icons/io";
import { IoCheckmarkCircleOutline } from "react-icons/io5";
import { IoMdTime } from "react-icons/io";
import { FaRegTimesCircle } from "react-icons/fa";
import { LuBedDouble } from "react-icons/lu";
import { IoIosArrowRoundForward } from "react-icons/io";
import { RxPeople } from "react-icons/rx";
import { formatDate } from "../../../Adminpannel/components/dateformatter";
import SkeletonLoader from "../../../loader/loaders";
import { BsThreeDotsVertical } from "react-icons/bs";
import { useConfirmationMessageContext } from "../../../forms/components/confirmationmessage";

const CheckInCard = ({
  children,
  value = "",
  label = "",
  backgroundcolor = "",
}) => {
  return (
    <div className={styles.reservationcard}>
      <div className={styles.svgsholder}>
        <div
          className={styles.iconholder}
          style={{ backgroundColor: backgroundcolor }}
        >
          {children}
        </div>

        <div className={styles.secondiconholder}>
          <IoMdArrowRoundUp />
        </div>
      </div>

      <div className={styles.cardvalue}>{value}</div>
      <div className={styles.cardname}>{label}</div>
    </div>
  );
};

const TableRow = ({
  reservation = "",
  guestname = "",
  guestemail = "",
  rooms = [],
  checkindate="",
  checkoutdate="",
  pax="",
  total="",
  status="",
  id="",
  activeid="N/A",
  setactiveid=()=>{},
  fetch=()=>{}
}) => {
  let {showMessages}=useGlobalMessageContext()
  let {hotelid}=useParams()
  let [loading,setLoading]=useState(false)
  let { setConfirmationMessageData, clearMessage } =useConfirmationMessageContext();
  let navigate=useNavigate()

  let UpdateReservation=async(value)=>{

    if(loading){
      return;
    }
    let trimmedValue= value.trim()
    const allowedStatuses = ["cancelled", "no_show", "confirmed"];
    
    if(!allowedStatuses.includes(trimmedValue)){
      setactiveid(null)
      clearMessage()
      return showMessages("Invalid Action","reject");
    }

    if(!hotelid){
      returnsetactiveid(null)
      clearMessage()
      return showMessages("Invalid hotelid","reject");
    }

    if(!id || id!=activeid){
      returnsetactiveid(null)
      clearMessage()
      return showMessages("Forbidden action","reject");

    }

    try{
      let formData = new FormData()
      formData.append("reservationid",id);
      formData.append("status",trimmedValue)


      setConfirmationMessageData((prev)=>({
        ...prev,
        loading:true
      }))

      let res = await api.put(`/reservation/updatereservationstatus/${hotelid}`,formData)
      if(res.status===201){
       showMessages(res.data?.message,"success");

      }
      


    }
    catch(err){
      if(err){
        showMessages(err?.response?.data.message||"Internal server error","reject")
      }

    }
    finally{
      fetch();
      clearMessage();
      setactiveid(null)
      setLoading(false)
    }
  }
  return (
    <tr>
      <td onClick={()=>{
       navigate(`/services/${hotelid}/frontoffice/reservation/ir/${id}`)

      }}>{reservation}</td>
      <td>
        <div className={styles.guestholder}>
          <div className={styles.guestname}>{guestname}</div>
          <div className={styles.guestemail}>{guestemail}</div>
        </div>
      </td>
      <td>
        <div className={styles.roomsholder}>
          {rooms.map((room, ind) => {
            return (
              <div className={styles.rooms} key={ind}>
                <div className={styles.roomname}>
                  <div className={styles.roomnamesvg}>
                    <LuBedDouble />
                  </div>
                  Room-{room?.roomNumber}
                </div>
                <div className={styles.roomcategory}>
                  {room?.category?.name}
                </div>
              </div>
            );
          })}
        </div>
      </td>

      <td>
        <div className={styles.checkinandcheckout}>
          <div className={styles.checkindate}>{formatDate(checkindate)}</div>
          <div className={styles.checkoutdate}>
            <div className={styles.checkouticon}>
              <IoIosArrowRoundForward />
            </div>
            <div className={styles.checkoutvalue}>{formatDate(checkoutdate)} . {(new Date(checkoutdate) - new Date(checkindate))/(1000*60*60*24)}n</div>
          </div>
        </div>
      </td>
      <td>
        <div className={styles.paxholder}>
          <div className={styles.paxicon}>
            <RxPeople />
          </div>
          <div className={styles.paxvalue}>{pax}</div>
        </div>
      </td>
      <td>Rs. {total}</td>
      <td>
        <div className={`${styles.status} ${styles[status]}`}>{status}</div>
      </td>
      <td>
        <div className={styles.actionbtn} onClick={(e)=>{
          e.stopPropagation()
          setactiveid(id)
        }}>
          <BsThreeDotsVertical/>

          {id == activeid && (
             <div className={styles.actionbtnholder} onMouseOver={(e)=>{
              e.stopPropagation()
             }
             }
             onClick={(e)=>{
              e.stopPropagation()
             }}
             >
            <div className={styles.actionButton} onClick={()=>{
              setConfirmationMessageData({
                show:true,
                message:"Are You Sure To Mark This Reservation As Confirm?",
                okFunction:()=>{UpdateReservation("confirmed")},
                loading:false
              })
            }}>
              Mark Confirm
              
            </div>
            <div className={styles.actionButton}
            onClick={()=>{
              setConfirmationMessageData({
                show:true,
                message:"Are You Sure To Mark This Reservation As no-show?",
                okFunction:()=>{UpdateReservation("no_show")},
                loading:false
              })
            }}
            >
              No Show
              
              
            </div>
            <div className={`${styles.actionButton} ${styles.cancelbtn}`}
            onClick={()=>{
              setConfirmationMessageData({
                show:true,
                message:"Are You Sure To Mark This Reservation As Cancelled?",
                okFunction:()=>{UpdateReservation("cancelled")},
                loading:false
              })
            }}>
              Cancel
              
            </div>
            
          </div>

          )}
         
          
          
        </div>
      </td>
    </tr>
  );
};

let SkeletonLoaderTR=()=>{
  return(
    <tr>
      <td><SkeletonLoader style={{height:"15px",width:"calc(100% - 15px)"}}/></td>
      <td>
        <div className={styles.guestholder}>
          <div className={styles.guestname}><SkeletonLoader style={{height:"15px",width:"calc(100% - 15px)"}}/></div>
          <div className={styles.guestemail}><SkeletonLoader style={{height:"10px",width:"calc(100% - 15px)"}}/></div>
        </div>
      </td>
      <td>
        <div className={styles.roomsholder}>
              <div className={styles.rooms}>
                <div className={styles.roomname}>
                  
                 <SkeletonLoader style={{height:"15px",width:"calc(100% - 15px)"}}/>
                </div>
                <div className={styles.roomcategory}>
                  <SkeletonLoader style={{height:"10px",width:"calc(100% - 15px)"}}/>
                </div>
              </div>
         
        </div>
      </td>

      <td>
        <div className={styles.checkinandcheckout}>
          <div className={styles.checkindate}><SkeletonLoader style={{height:"15px",width:"calc(100% - 15px)"}}/></div>
          <div className={styles.checkoutdate}>
            <SkeletonLoader style={{height:"10px",width:"calc(100% - 15px)"}}/>
          </div>
        </div>
      </td>
      <td>
        <div className={styles.paxholder}>
         <SkeletonLoader style={{height:"20px",width:"40px"}}/>
        </div>
      </td>
      <td><SkeletonLoader style={{height:"15px",width:"calc(100% - 15px)"}}/></td>
      <td>
        <SkeletonLoader style={{height:"15px",width:"calc(100% - 15px)",borderRadius:"9999px"}}/>
      </td>
      <td>
        <div className={styles.actionsholder}>
          
        </div>
      </td>
    </tr>

  )
}
const CheckIn= () => {
  let [reservationForm, setReservationForm] = useState(false);
  let [reservations, setReservations] = useState(null);
  let [loading, setLoading] = useState(false);
  let { showMessages } = useGlobalMessageContext();
  let { hotelid } = useParams();
  let [activeid,setActiveId]=useState(null)

  let fetchReservations = async () => {
    if (loading) {
      return;
    }
    setLoading(true);

    if (!hotelid) {
      setLoading(false);
      showMessages("Hotel id not found", "reject");
      return;
    }

    try {
      let res = await api.get(`/reservation/getallreservations/${hotelid}`);

      if (res.status === 200) {
        setReservations(res.data.reservations);
        console.log(res.data.reservations);
      }
    } catch (err) {
      if (err) {
        showMessages(
          err.response?.message || "Internal server error",
          "reject",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);
  return (
   
    <>
   
        <div className={styles.reservationcreationdiv}>
          <div className={styles.headingandsubheading}>
            <div className={styles.heading}>Check In</div>
            <div className={styles.subheading}>
             Process guest arrivals — verify identity, assign room, collect balance and hand over keys.
            </div>
          </div>

          <div
            className={styles.reservationcreatebtn}
            onClick={() => {
              setReservationForm(true);
            }}
          >
            <div className={styles.btnsvg}>
              <IoAddOutline />
            </div>

            <div className={styles.btnsubheading}>Create</div>
          </div>
        </div>
        <div className={styles.reservationcardsholder}>
          <CheckInCard
            value={reservations ? reservations.length : "0"}
            label="Total Reservations"
            backgroundcolor="rgb(243, 245, 255)"
          >
            <LuCalendarDays color="rgb(0, 20, 238)" />
          </CheckInCard>
          <CheckInCard
            label="Confirmed"
            value={
              reservations
                ? reservations.filter((rev) => rev.status === "confirmed")
                    .length
                : "0"
            }
            backgroundcolor="rgb(217, 255, 204)"
          >
            <IoCheckmarkCircleOutline color="rgb(14, 121, 4)" />
          </CheckInCard>
          <CheckInCard
            label="Pending"
            value={
              reservations
                ? reservations.filter((rev) => rev.status === "pending").length
                : "0"
            }
            backgroundcolor="rgb(255, 240, 228)"
          >
            <IoMdTime color="rgb(241, 109, 0)" />
          </CheckInCard>
          <CheckInCard
            backgroundcolor="rgb(240, 240, 240)"
            label="Cancelled"
            value={
              reservations
                ? reservations.filter((rev) => rev.status === "cancelled")
                    .length
                : "0"
            }
          >
            <FaRegTimesCircle color="rgb(103, 103, 103)" />
          </CheckInCard>
        </div>

        <div className={styles.reservationstable} onClick={()=>{
          setActiveId(null)
        }}>
          <table>
            <thead>
              <tr>
                <th>Reservation</th>
                <th>Guest</th>
                <th>Rooms</th>
                <th>Stay</th>
                <th>Pax</th>
                <th>Total</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && !reservations &&(
                <>
                <SkeletonLoaderTR/>
                <SkeletonLoaderTR/>
                <SkeletonLoaderTR/>
                <SkeletonLoaderTR/>
                </>
              )}
             {!loading && reservations && reservations.map((resv,ind)=>{
              return (
                <TableRow
                reservation={resv.confirmationCode}
                guestname={`${resv.guest.firstName} ${resv.guest.lastName}`}
                guestemail={resv.guest.email}
                rooms={resv.rooms}
                checkindate={resv.checkIn}
                checkoutdate={resv.checkOut}
                pax={Number(resv.adults) + Number(resv.children)}
                total={resv.payment.totalAmount}
                status={resv.status}
                id={resv._id}
                activeid={activeid}
                setactiveid={setActiveId}
                key={resv._id}
                fetch={fetchReservations}
                
                />

              )
             })}
            </tbody>
            
            {!loading && Array.isArray(reservations) && reservations.length==0 && (
              <tfoot>
              <tr>
                  <td colSpan={8}>
                    <div className={styles.foottext}>

                      
                    Reservations Not Found
                    </div>
                    </td>
              </tr>
            </tfoot>

            )}

          </table>
        </div>
     

      {reservationForm && (
        <CreateReservationform
          onexit={() => {
            setReservationForm(false);
          }}
          fetch={fetchReservations}
        />
      )}
       </>
   
  );
};

export default CheckIn;
