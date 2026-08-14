import { useState } from "react";
import { RxCross1, RxCross2, RxPeople } from "react-icons/rx";
import styles from "../../../css/inhouse css/inhousedetailview.module.css";
import { useNavigate, useParams } from "react-router";
import { useGlobalMessageContext } from "../../../../Globalmessage/components/globalmessage";
import api from "../../../../axios/axios";
import { useEffect } from "react";
import {
  MdErrorOutline,
  MdHistory,
  MdOutlineSource,
  MdPayments,
} from "react-icons/md";
import { LuBedDouble, LuClock5, LuPhone } from "react-icons/lu";
import { formatDate } from "../../../../Adminpannel/components/dateformatter";
import {
  ContactCard,
  DetailCard,
  PaymentForm,
  TransactionForm,
} from "../../../components/inhouseComponents/inhousedetailview.components";
import { GoDotFill } from "react-icons/go";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import SkeletonReservationDetailpage from "../../../components/skeletonpageforreservationindidetail";
import { NameInitials } from "../../../../leftnavbar/leftnavbar";
import { GrTransaction } from "react-icons/gr";
import {
  IoAddOutline,
  IoChevronDown,
  IoChevronUp,
  IoDocumentsOutline,
  IoLocationOutline,
  IoMailOutline,
  IoAdd
} from "react-icons/io5";
import { formatFileSize } from "../../../../utilits/utilits";
import SkeletonLoader from "../../../../loader/loaders";
import { BiExpandAlt, BiWallet } from "react-icons/bi";


let HugeImageViewer = ({ url = null, onExit = () => {} }) => {
  return (
    <div className={styles.imageholderbig}>
      <div
        className={styles.exitbtn}
        onClick={() => {
          onExit();
        }}
      >
        <RxCross1 />
      </div>

      <img src={url} alt="" />
    </div>
  );
};
const GuestDocumentsHolder = ({ documents = [] }) => {
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState(false);
  let [bigImage, setBigImage] = useState(false);
  let [imageUrl, setImageUrl] = useState(null);

  return (
    <div className={styles.guestDocumentHolder}>
      {documents.map((document) => {
        return (
          <div className={styles.documentimageholder} key={document._id}>
            <div className={styles.imagemetadata}>
              <div className={styles.imagenameanddate}>
                <div className={styles.imagename}>
                  {document.originalname.split(".")[0]}
                </div>
              </div>
              <div className={styles.othermetadata}>
                <div className={styles.documenttypeandsize}>
                  {formatFileSize(document.size)} .
                  {document.mimetype.split("/")[1]}
                </div>
                <div className={styles.imageulploaditiondate}>
                  {formatDate(document.createdAt)}
                </div>
              </div>
            </div>
            <div
              className={styles.documentimage}
              onClick={(e) => {
                e.stopPropagation();

                if (!loading && !error) {
                  setImageUrl(
                    `${import.meta.env.VITE_BASE_URL}/stream/hotel/${document.hotel}/media/${document._id}`,
                  );
                  setBigImage(true);
                }
              }}
            >
              {loading && !error && (
                <SkeletonLoader
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "0",
                    height: "100%",
                    width: "100%",
                  }}
                />
              )}
              {!loading && error && (
                <div className={styles.imageerror}>
                  <MdErrorOutline />
                </div>
              )}
              {!loading && !error && (
                <div className={styles.expandingiconholder}>
                  <BiExpandAlt />
                </div>
              )}

              <img
                src={`${import.meta.env.VITE_BASE_URL}/stream/hotel/${document.hotel}/media/${document._id}`}
                alt=""
                onLoad={() => {
                  setLoading(false);
                }}
                onError={() => {
                  setError(true);
                  setLoading(false);
                }}
              />
            </div>
          </div>
        );
      })}
      {bigImage && (
        <HugeImageViewer
          url={imageUrl}
          onExit={() => {
            setBigImage(false);
            setImageUrl(null);
          }}
        />
      )}
    </div>
  );
};

const InhouseDetailedView = () => {
  let [checkin, setCheckIn] = useState(null);
  let [loading, setLoading] = useState(false);
  let { hotelid, inhousecode } = useParams();
  let [addPaymentForm, setAddPaymentForm] = useState(false);
  let [paymentLimit, setPaymentLimit] = useState(2);
  let [transactionLimit, setTransactionLimit] = useState(2);
  let { showMessages } = useGlobalMessageContext();
  let navigate = useNavigate();
  let FetchCheckin = async () => {
    if (loading) {
      return;
    }

    if (!hotelid || !inhousecode) {
      showMessages("Invalid Parameters", "reject");
      navigate(-1, { replace: true });
      return;
    }
    setLoading(true);
    try {
      let res = await api.get(
        `/inhouse/getindividualinhousecheckin/${hotelid}/${inhousecode}`,
      );

      if (res.status === 200) {
        console.log(res.data);
        setCheckIn(res.data.checkin);
      }
    } catch (err) {
      if (err.response) {
        showMessages(err.response?.data?.message, "reject");

        return;
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchCheckin();
  }, []);

  return (
    <>
      {loading && !checkin && <SkeletonReservationDetailpage />}
      {checkin && (
        <>
          <div className={styles.reservationsummary}>
            <div className={styles.resvinfoholder}>
              <div className={styles.GuestNameAndStatus}>
                <div className={styles.guestname}>
                  <div className={styles.bookedByTag}>Primary Guest: </div>
                  <div className={styles.name}>
                    {checkin?.primaryGuest.firstName}{" "}
                    {checkin?.primaryGuest.lastName}
                  </div>
                </div>
                <div className={`${styles.status} ${styles[checkin?.status]}`}>
                  {checkin?.status}
                </div>
              </div>

              <div className={styles.otherdetails}>
                <div className={styles.odcard}>
                  <div className={styles.odvalcode}>{checkin?.checkinCode}</div>
                </div>

                <div className={styles.odcard}>
                  <div className={styles.odicon}>
                    <LuClock5 />
                  </div>
                  <div className={styles.odval}>
                    Checked In At : {formatDate(checkin?.createdAt)}
                  </div>
                </div>

                <div className={styles.odcard}>
                  <div className={styles.odicon}>
                    <MdOutlineSource />
                  </div>
                  <div className={styles.odval}>N/A</div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.summarymainholder}>
            <div className={styles.infocardholder}>
              <div className={styles.infocard}>
                <div className={styles.infocardhead}>
                  <div className={styles.infocardheading}>Stay Summary</div>
                </div>

                <div className={styles.detailsholder}>
                  <DetailCard
                    icon={<FaArrowRightLong />}
                    heading="Check In"
                    value={formatDate(checkin.actualCheckinDate)}
                    secondValue=""
                  />
                  <DetailCard
                    icon={<FaArrowLeftLong />}
                    heading="Expected Check Out"
                    value={formatDate(checkin.expectedCheckoutDate)}
                    secondValue="After 2:00 PM"
                  />
                  <DetailCard
                    icon={<LuBedDouble />}
                    heading="Room"
                    value={checkin.rooms.length}
                    secondValue={checkin.rooms.map((room, ind) => {
                      return `R${room.roomNumber}${ind + 1 != checkin.rooms.length ? "," : ""} `;
                    })}
                  />
                  <DetailCard
                    icon={<RxPeople />}
                    heading="Guests"
                    value={`${1 + checkin.otherGuests.length} Pax`}
                    secondValue={`${Math.round(
                      (new Date(checkin.expectedCheckoutDate) -
                        new Date(checkin.actualCheckinDate)) /
                        (1000 * 60 * 60 * 24),
                    )} nights`}
                  />
                </div>
              </div>
              <div className={styles.infocard} style={{ gap: "0px" }}>
                <div className={styles.infocardhead}>
                  <div className={styles.infoheadicon}>
                    <RxPeople />
                  </div>
                  <div className={styles.infocardheading}>
                    Guest Information
                  </div>
                </div>

                <div className={styles.guestinfoholder}>
                  <div className={styles.guestProfilePic}>
                    {NameInitials(
                      `${checkin.reservation.guest.firstName} ${checkin.reservation.guest.lastName}`,
                    )}
                  </div>

                  <div className={styles.nameholder}>
                    <div className={styles.guestname}>
                      {checkin.reservation.guest.firstName}{" "}
                      {checkin.reservation.guest.lastName}
                    </div>

                    <div className={styles.guesttag}>
                      {checkin.primaryGuest?._id.toString().trim() ===
                      checkin.reservation.guest?._id.toString().trim()
                        ? "Booking and Primary Guest"
                        : "Booking Guest"}
                    </div>
                  </div>
                </div>
                <div className={styles.frdivider} />

                <div className={styles.guestcontacinfo}>
                  <ContactCard
                    icon={<IoMailOutline />}
                    name="email"
                    value={checkin.reservation.guest.email}
                  />
                  <ContactCard
                    icon={<LuPhone />}
                    name="phone"
                    value={checkin.reservation.guest.phone}
                  />
                  <ContactCard
                    icon={<IoLocationOutline />}
                    name="Address"
                    value={checkin.reservation.guest.address}
                  />
                </div>
                {checkin.reservation?.guest?.documents?.length > 0 && (
                  <>
                    <div className={styles.frdivider} />

                    <div className={styles.guestdocumentholder}>
                      <div className={styles.infocardhead}>
                        <div className={styles.infoheadicon}>
                          <IoDocumentsOutline />
                        </div>
                        <div className={styles.infocardheading}>Documents:</div>
                      </div>
                      <GuestDocumentsHolder
                        documents={checkin.reservation.guest.documents}
                      />
                    </div>
                  </>
                )}
              </div>

              {checkin.primaryGuest._id.toString().trim() !=
                checkin.reservation.guest._id.toString().trim() && (
                <div className={styles.infocard} style={{ gap: "0px" }}>
                  <div className={styles.infocardhead}>
                    <div className={styles.infoheadicon}>
                      <RxPeople />
                    </div>
                    <div className={styles.infocardheading}>Primary Guest</div>
                  </div>

                  <div className={styles.guestinfoholder}>
                    <div className={styles.guestProfilePic}>
                      {NameInitials(
                        `${checkin.primaryGuest.firstName} ${checkin.primaryGuest.lastName}`,
                      )}
                    </div>

                    <div className={styles.nameholder}>
                      <div className={styles.guestname}>
                        {checkin.primaryGuest.firstName}{" "}
                        {checkin.primaryGuest.lastName}
                      </div>

                      <div className={styles.guesttag}>
                        {checkin.primaryGuest?._id.toString().trim() ===
                        checkin.reservation.guest?._id.toString().trim()
                          ? "Booking and Primary Guest"
                          : "Primary Guest"}
                      </div>
                    </div>
                  </div>
                  <div className={styles.frdivider} />

                  <div className={styles.guestcontacinfo}>
                    <ContactCard
                      icon={<IoMailOutline />}
                      name="email"
                      value={checkin.primaryGuest.email}
                    />
                    <ContactCard
                      icon={<LuPhone />}
                      name="phone"
                      value={checkin.primaryGuest.phone}
                    />
                    <ContactCard
                      icon={<IoLocationOutline />}
                      name="Address"
                      value={checkin.primaryGuest.address}
                    />
                  </div>
                  {checkin.primaryGuest.documents?.length > 0 && (
                    <>
                      <div className={styles.frdivider} />

                      <div className={styles.guestdocumentholder}>
                        <div className={styles.infocardhead}>
                          <div className={styles.infoheadicon}>
                            <IoDocumentsOutline />
                          </div>
                          <div className={styles.infocardheading}>
                            Documents:
                          </div>
                        </div>
                        <GuestDocumentsHolder
                          documents={checkin.primaryGuest.documents}
                        />
                      </div>
                    </>
                  )}
                </div>
              )}


              <div className={styles.infocard} style={{ gap: "0px" }}>
                  <div className={styles.infocardhead}>
                    <div className={styles.infoheadicon}>
                      <RxPeople />
                    </div>
                    <div className={styles.infocardheading}>Staying Guests</div>
                  </div>


                  {checkin.otherGuests.length>0 && checkin.otherGuests.map((guest)=>{

                    return (
                      <>
                       <div className={styles.guestinfoholder}>
                    <div className={styles.guestProfilePic}>
                      {NameInitials(
                        `${guest.firstName} ${guest.lastName}`,
                      )}
                    </div>

                    <div className={styles.nameholder}>
                      <div className={styles.guestname}>
                        {guest.firstName}{" "}
                        {guest.lastName}
                      </div>

                      <div className={styles.guesttag}>
                        Staying Guest
                      </div>
                    </div>
                  </div>
                  <div className={styles.frdivider} />

                  <div className={styles.guestcontacinfo}>
                    <ContactCard
                      icon={<IoMailOutline />}
                      name="email"
                      value={guest.email}
                    />
                    <ContactCard
                      icon={<LuPhone />}
                      name="phone"
                      value={guest.phone}
                    />
                    <ContactCard
                      icon={<IoLocationOutline />}
                      name="Address"
                      value={guest.address}
                    />
                  </div>
                  {guest.documents?.length > 0 && (
                    <>
                      <div className={styles.frdivider} />

                      <div className={styles.guestdocumentholder}>
                        <div className={styles.infocardhead}>
                          <div className={styles.infoheadicon}>
                            <IoDocumentsOutline />
                          </div>
                          <div className={styles.infocardheading}>
                            Documents:
                          </div>
                        </div>
                        <GuestDocumentsHolder
                          documents={guest.documents}
                        />
                      </div>
                    </>
                  )}
                      
                      </>
                    )
                  })}

                  <div className={styles.addMoreGuestbtnHolder}>

                    <div className={styles.addmoreicon}>
                      <IoAddOutline/>

                      
                    </div>

                    <div className={styles.addmorebtn}>
                      Add
                      
                    </div>
                    
                  </div>

                 
                </div>
             
            </div>

            <div className={styles.infocardholder}>
              <div className={styles.infocard}>
                <div className={styles.infocardhead}>
                  <div className={styles.infoheadicon}>
                    <BiWallet />
                  </div>
                  <div className={styles.infocardheading}>Payment Summary</div>
                </div>

                <div className={styles.paymentholder}>
                  {checkin.payments.map((payment, ind) => {
                    return (
                      <div className={styles.paymentrow}>
                        <div className={styles.paymenttitle}>
                          {payment.paymentName}
                        </div>
                        <div className={styles.paymentValuenormal}>
                          Rs. {payment.amountToPay}
                        </div>
                      </div>
                    );
                  })}

                  <div className={styles.paymentrow}>
                    <div className={styles.paymenttitlelight}>Taxes & Fees</div>
                    <div className={styles.paymentValuelight}>Included</div>
                  </div>
                  <div className={styles.frdivider} />

                  <div className={styles.paymentrow}>
                    <div className={styles.paymenttitle}>Total</div>
                    <div className={styles.paymentValueBold}>
                      Rs. {checkin.openFolio.totalAmount}
                    </div>
                  </div>

                  <div className={styles.paymentrow}>
                    <div className={styles.paymenttitle}>Paid</div>
                    <div className={styles.paymentValuelight}>
                      {checkin.openFolio.amountPaid}
                    </div>
                  </div>
                  <div className={styles.frdivider} />
                  <div className={styles.paymentrow}>
                    <div className={styles.paymenttitle}>Due</div>
                    <div className={styles.paymentValueBold}>
                      Rs.{" "}
                      {Number(checkin.openFolio.totalAmount) -
                        Number(checkin.openFolio.amountPaid)}
                    </div>
                  </div>
                </div>
              </div>

              <div className={styles.infocard}>
                <div className={styles.infocardhead}>
                  <div className={styles.infoheadicon}>
                    <MdPayments />
                  </div>
                  <div className={styles.infocardheading}>Recorded Payment</div>

                  <div
                    className={styles.addinfocardbtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      setAddPaymentForm(!addPaymentForm);
                    }}
                  >
                    {!addPaymentForm ? <IoAdd /> : <RxCross2 />}
                  </div>
                </div>

                {addPaymentForm && (
                  <PaymentForm
                    guestid={checkin.primaryGuest._id}
                    folioid={checkin.openFolio._id}
                    checkinId={checkin._id}
                    fetch={FetchCheckin}
                  />
                )}

                {checkin.payments.map((payment, ind) => {
                  if (ind < paymentLimit) {
                    return (
                      <div className={styles.paymentrecords} key={ind}>
                        <div className={styles.paymentrecordsymbol}>
                          <GoDotFill />
                        </div>

                        <div className={styles.otherinfo}>
                          <div className={styles.paymentrecordname}>
                            {payment.paymentName}
                          </div>

                          <div className={styles.paymentReason}>
                            {payment.paymentFor}
                          </div>
                          <div className={styles.pricedetails}>
                            <div className={styles.amt}>
                              Rs. {payment.amountToPay}
                            </div>
                            <div className={styles.statofpayment}>
                              {payment.paymentType}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }
                })}

                <div
                  className={styles.seemoreicon}
                  onClick={(e) => {
                    e.stopPropagation();

                    {
                      checkin.payments.length < paymentLimit
                        ? setPaymentLimit(2)
                        : setPaymentLimit(paymentLimit + 2);
                    }
                  }}
                >
                  {checkin.payments.length < paymentLimit
                    ? "See Less"
                    : "See More"}
                  {checkin.payments.length < paymentLimit ? (
                    <IoChevronUp />
                  ) : (
                    <IoChevronDown />
                  )}
                </div>
              </div>
              {Number(checkin.openFolio.totalAmount) -
                Number(checkin.openFolio.amountPaid) !=
                0 && (
                <div className={styles.infocard}>
                  <div className={styles.infocardhead}>
                    <div className={styles.infoheadicon}>
                      <GrTransaction />
                    </div>
                    <div className={styles.infocardheading}>
                      Create Transaction
                    </div>
                  </div>
                  <TransactionForm
                    guestid={checkin.primaryGuest._id}
                    folioid={checkin.openFolio._id}
                    fetch={FetchCheckin}
                  />
                </div>
              )}

              <div className={styles.infocard}>
                <div className={styles.infocardhead}>
                  <div className={styles.infoheadicon}>
                    <MdHistory />
                  </div>
                  <div className={styles.infocardheading}>
                    Transaction History
                  </div>
                </div>

                <div className={styles.historycardwrapper}>
                  {checkin.openFolio.transactions.length == 0 && (
                    <div className={styles.emptymessage}>
                      No Transactions Available
                    </div>
                  )}
                  {checkin.openFolio.transactions.length > 0 && (
                    <>
                      {checkin.openFolio.transactions.map(
                        (transaction, ind) => {

                          if(ind < transactionLimit){
                          return (
                            <div className={styles.transactionscard}>
                              <div className={styles.transactioniddiv}>
                                <div className={styles.topwrapper}>
                                  {transaction.transactionId}
                                  <div className={styles.successid}>
                                    {transaction.status.slice(0, 7)}
                                  </div>
                                </div>

                                <div className={styles.transactiondate}>
                                  {transaction.createdAt
                                    ? `${formatDate(transaction.createdAt)}`
                                    : ""}
                                </div>
                              </div>

                              <div className={styles.paymenthistry}>
                                Rs. {transaction.amount}
                              </div>
                              <div className={styles.paymentmodeandmodeid}>
                                <div className={styles.paymentmode}>
                                  {transaction.modeOfPayment}
                                </div>
                                <div className={styles.modeid}>
                                  {transaction.paymentModeId}
                                </div>
                              </div>

                              <div className={styles.remarks}>
                                {transaction.remarks}
                              </div>
                            </div>
                          );
                        }
                        },
                      )}
                    </>
                  )}
                </div>

                {checkin.openFolio.transactions.length > 0 && (
                    <div
                        className={styles.seemoreicon}
                        onClick={(e) => {
                          e.stopPropagation();

                          {
                            checkin.openFolio.transactions.length <
                            transactionLimit
                              ? setTransactionLimit(2)
                              : setTransactionLimit(transactionLimit + 2);
                          }
                        }}
                      >
                        {checkin.openFolio.transactions.length <
                        transactionLimit
                          ? "See Less"
                          : "See More"}
                        {checkin.openFolio.transactions.length <
                        transactionLimit ? (
                          <IoChevronUp />
                        ) : (
                          <IoChevronDown />
                        )}
                      </div>

                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default InhouseDetailedView;
