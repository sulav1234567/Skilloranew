import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGlobalMessageContext } from "../../../Globalmessage/components/globalmessage";
import api from "../../../axios/axios";
import styles from "../../css/reservationDetailedView.module.css";
import { formatDate } from "../../../Adminpannel/components/dateformatter";
import { LuClock5, LuPhone } from "react-icons/lu";
import { MdOutlineSource } from "react-icons/md";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import { LuBedDouble } from "react-icons/lu";
import { RxPeople } from "react-icons/rx";
import { BiWallet } from "react-icons/bi";
import { NameInitials } from "../../../leftnavbar/leftnavbar";
import { IoLocationOutline, IoMailOutline } from "react-icons/io5";
import { TbNotebook } from "react-icons/tb";
const DetailCard = ({ icon, heading = "", value = "", secondValue = "" }) => {
  return (
    <div className={styles.detailcard}>
      <div className={styles.detailcardheader}>
        <div className={styles.detailcardicon}>{icon}</div>
        <div className={styles.dcheading}>{heading}</div>
      </div>
      <div className={styles.dcvalue}>{value}</div>
      <div className={styles.dctime}>{secondValue}</div>
    </div>
  );
};

const ContactCard = ({icon,name="",value=""})=>{
    return (
         <div className={styles.contactcard}>
                    <div className={styles.contactcardicon}>
                        {icon}
                      
                    </div>

                    <div className={styles.contactcardinfo}>
                        <div className={styles.contactcardname}>
                            {name}
                          
                        </div>

                        <div className={styles.contactcardvalue}>
                            {value}
                          
                        </div>
                      
                    </div>
                  
                </div>
    )
}

const ReservationDetailedView = () => {
  let [reservation, setReservation] = useState(null);
  let [loading, setLoading] = useState(false);
  let { hotelid, reservationid } = useParams();
  let navigate = useNavigate();
  let { showMessages } = useGlobalMessageContext();

  let FetchReservation = async () => {
    if (loading) {
      return;
    }

    setLoading(true);
    try {
      if (!hotelid || !reservationid) {
        showMessages("Forbidden, So Redirected", "reject");
        return navigate(-1, { replace: true });
      }

      let res = await api.get(
        `/reservation/getreservation?hotelid=${hotelid}&reservationid=${reservationid}`,
      );

      if (res.status === 200) {
        console.log(res.data.reservation);
        setReservation(res.data.reservation);
      }
    } catch (err) {
      if (err && err.response?.status == 404) {
        showMessages(
          err.response?.data.message || "Internal server error",
          "reject",
        );

        return navigate(-1, { replace: true });
      }
      if (err && err.response?.status !== 404) {
        showMessages(
          err.response?.data.message || "Internal server error",
          "reject",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchReservation();
  }, []);
  return (
    <>
      {loading || (!reservation && <div>loading.......</div>)}
      {!loading && reservation && (
        <>
          <div className={styles.reservationsummary}>
            <div className={styles.resvinfoholder}>
              <div className={styles.GuestNameAndStatus}>
                <div className={styles.guestname}>
                  <div className={styles.bookedByTag}>booked by</div>
                  <div className={styles.name}>
                    {reservation.guest.firstName} {reservation.guest.lastName}
                  </div>
                </div>
                <div
                  className={`${styles.status} ${styles[reservation.status]}`}
                >
                  {reservation.status}
                </div>
              </div>

              <div className={styles.otherdetails}>
                <div className={styles.odcard}>
                  <div className={styles.odvalcode}>
                    {reservation.confirmationCode}
                  </div>
                </div>

                <div className={styles.odcard}>
                  <div className={styles.odicon}>
                    <LuClock5 />
                  </div>
                  <div className={styles.odval}>
                    Booked On: {formatDate(reservation.createdAt)}
                  </div>
                </div>

                <div className={styles.odcard}>
                  <div className={styles.odicon}>
                    <MdOutlineSource />
                  </div>
                  <div className={styles.odval}>{reservation.source}</div>
                </div>
              </div>
            </div>
            <div className={styles.rsvbtnholder}></div>
          </div>
          <div className={styles.summarymainholder}>
            <div className={styles.infocard}>
              <div className={styles.infocardhead}>
                <div className={styles.infocardheading}>Stay Summary</div>
              </div>

              <div className={styles.detailsholder}>
                <DetailCard
                  icon={<FaArrowRightLong />}
                  heading="Check In"
                  value={formatDate(reservation.checkIn)}
                  secondValue="From 12:00 PM"
                />
                <DetailCard
                  icon={<FaArrowLeftLong />}
                  heading="Check Out"
                  value={formatDate(reservation.checkOut)}
                  secondValue="After 2:00 PM"
                />
                <DetailCard
                  icon={<LuBedDouble />}
                  heading="Room"
                  value={reservation.rooms.length}
                  secondValue={reservation.rooms.map((room, ind) => {
                    return `R${room.roomNumber}${ind + 1 != reservation.rooms.length ? "," : ""} `;
                  })}
                />
                <DetailCard
                  icon={<RxPeople />}
                  heading="Guests"
                  value={`${reservation.adults + reservation.children} Pax`}
                  secondValue={`${(new Date(reservation.checkOut) - new Date(reservation.checkIn)) / (1000 * 60 * 60 * 24)} nights`}
                />
              </div>
            </div>
            <div className={styles.infocard}>
              <div className={styles.infocardhead}>
                <div className={styles.infoheadicon}>
                  <BiWallet />
                </div>
                <div className={styles.infocardheading}>Payment Summary</div>
              </div>

              <div className={styles.paymentholder}>
                <div className={styles.paymentrow}>
                  <div className={styles.paymenttitle}>
                    Room Rate x{" "}
                    {(new Date(reservation.checkOut) -
                      new Date(reservation.checkIn)) /
                      (1000 * 60 * 60 * 24)}
                  </div>
                  <div className={styles.paymentValuenormal}>
                    Rs.{" "}
                    {(reservation.rooms.reduce((total, rm) => {
                      return total + rm.category.baseRate;
                    }, 0) *
                      (new Date(reservation.checkOut) -
                        new Date(reservation.checkIn))) /
                      (1000 * 60 * 60 * 24)}
                  </div>
                </div>

                <div className={styles.paymentrow}>
                  <div className={styles.paymenttitlelight}>Taxes & Fees</div>
                  <div className={styles.paymentValuelight}>Included</div>
                </div>
                <div className={styles.frdivider} />

                <div className={styles.paymentrow}>
                  <div className={styles.paymenttitle}>Reservation Fee</div>
                  <div className={styles.paymentValuelight}>Rs. 5000</div>
                </div>

                <div className={styles.paymentrow}>
                  <div className={styles.paymenttitle}>Total</div>
                  <div className={styles.paymentValueBold}>
                    Rs. {reservation.payment.totalAmount}
                  </div>
                </div>

                <div className={styles.paymentrow}>
                  <div className={styles.paymenttitle}>Paid</div>
                  <div className={styles.paymentValuelight}>
                    Rs. {reservation.payment.amountPaid}
                  </div>
                </div>
                <div className={styles.frdivider} />
                <div className={styles.paymentrow}>
                  <div className={styles.paymenttitle}>Due</div>
                  <div className={styles.paymentValueBold}>
                    Rs. {reservation.payment.remainingAmount}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.summarymainholder}>
            <div className={styles.infocard} style={{gap:"0px"}}>
              <div className={styles.infocardhead}>
                <div className={styles.infoheadicon}>
                  <RxPeople />
                </div>
                <div className={styles.infocardheading}>Guest Information</div>
              </div>

              <div className={styles.guestinfoholder}>
                <div className={styles.guestProfilePic}>
                  {NameInitials(
                    `${reservation.guest.firstName} ${reservation.guest.lastName}`,
                  )}
                </div>

                <div className={styles.nameholder}>
                  <div className={styles.guestname}>
                    {reservation.guest.firstName} {reservation.guest.lastName}
                  </div>

                  <div className={styles.guesttag}>Booking Guest</div>
                </div>
              </div>
              <div className={styles.frdivider} />

              <div className={styles.guestcontacinfo}>
                <ContactCard icon={<IoMailOutline/>} name="email" value={reservation.guest.email}/>
                <ContactCard icon={<LuPhone/>} name="phone" value={reservation.guest.phone}/>
                <ContactCard icon={<IoLocationOutline/>} name="Address" value={reservation.guest.address}/>
                
              </div>
            </div>
            <div className={styles.infocard}>
              <div className={styles.infocardhead}>
                <div className={styles.infoheadicon}>
                  <LuBedDouble />
                </div>
                <div className={styles.infocardheading}>Room Summary</div>
              </div>
            </div>
          </div>
          <div className={styles.summarymainholder}>
            <div className={styles.infocard}>
              <div className={styles.infocardhead}>
                <div className={styles.infoheadicon}>
                  <TbNotebook />
                </div>
                <div className={styles.infocardheading}>Notes </div>
              </div>


              <div className={styles.notecontent}>
                {reservation.specialRequests!="N/A" ?reservation.specialRequests :"Note is not Uploaded" }
                
              </div>

              
            </div>

            
            
          </div>
        </>
      )}
    </>
  );
};

export default ReservationDetailedView;
