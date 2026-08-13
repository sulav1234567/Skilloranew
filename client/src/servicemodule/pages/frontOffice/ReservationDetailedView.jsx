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
import { RxCross1, RxPeople } from "react-icons/rx";
import { BiExpandAlt, BiWallet } from "react-icons/bi";
import { NameInitials } from "../../../leftnavbar/leftnavbar";
import {
  IoDocumentsOutline,
  IoLocationOutline,
  IoMailOutline,
} from "react-icons/io5";
import { TbNotebook } from "react-icons/tb";
import { LuEyeOff } from "react-icons/lu";
import { CgLogIn } from "react-icons/cg";
import { TbCancel } from "react-icons/tb";
import { MdPayments } from "react-icons/md";
import { GrTransaction } from "react-icons/gr";
import { useConfirmationMessageContext } from "../../../forms/components/confirmationmessage";
import { GoDotFill } from "react-icons/go";
import { MdHistory } from "react-icons/md";
import { Input } from "../../components/reservationforms";
import SkeletonReservationDetailpage from "../../components/skeletonpageforreservationindidetail";
import { formatFileSize } from "../../../utilits/utilits";
import { MdErrorOutline } from "react-icons/md";
import SkeletonLoader from "../../../loader/loaders";
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

const ContactCard = ({ icon, name = "", value = "" }) => {
  return (
    <div className={styles.contactcard}>
      <div className={styles.contactcardicon}>{icon}</div>

      <div className={styles.contactcardinfo}>
        <div className={styles.contactcardname}>{name}</div>

        <div className={styles.contactcardvalue}>{value}</div>
      </div>
    </div>
  );
};

const ActionBtn = ({
  icon,
  value = "",
  onclick = () => {},
  classname = "",
}) => {
  return (
    <div
      className={`${styles.actionbtn} ${styles[classname]}`}
      onClick={onclick}
    >
      <div className={styles.actionbtnicon}>{icon}</div>

      <div className={styles.actionbtntext}>{value}</div>
    </div>
  );
};
const TransactionForm = ({
  guestid = null,
  folioid = null,
  fetch = () => {},
}) => {
  //{ amount, paymentmode, modeid, remarks,guestid,hotelid }
  let [transactionData, setTransactionData] = useState(null);
  let [changes, setChanges] = useState(false);
  let [loading, setLoading] = useState(false);
  let { hotelid } = useParams();
  let { showMessages } = useGlobalMessageContext();
  let [errors, setErrors] = useState({});
  let { setConfirmationMessageData, clearMessage } =
    useConfirmationMessageContext();

  let modepayment = [
    "cash",
    "esewa",
    "bank",
    "fonepay",
    "card",
    "khalti",
    "upi",
  ];

  let CreateTransaction = async () => {
    if (loading) {
      return;
    }

    if (!guestid || !folioid || !hotelid) {
      showMessages("Ids Are Required");
    }
    setLoading(true);
    try {
      let { amount, paymentmode, modeid, remarks } = transactionData;

      let error = {};

      if (!amount.value || Number(amount.value) <= 0) {
        error = {
          ...error,
          amount: "Invalid amount",
        };
      }

      if (
        !paymentmode.value ||
        !modepayment.includes(paymentmode.value.trim())
      ) {
        error = {
          ...error,
          paymentmode: "Invalid Payment Mode",
        };
      }

      if (paymentmode.value != "cash" && !modeid.value) {
        error = {
          ...error,
          modeid: "Mode Id Required",
        };
      }

      if (!remarks.value) {
        error = {
          ...error,
          remarks: "Remarks Required",
        };
      }
      if (Object.keys(error).length > 0) {
        setErrors(error);
        return;
      }

      let formData = new FormData();
      formData.append("amount", amount.value);
      formData.append("paymentmode", paymentmode.value);
      formData.append("modeid", modeid.value);
      formData.append("remarks", remarks.value);
      formData.append("hotelid", hotelid);
      formData.append("guestid", guestid);
      let res = await api.post(`/transaction/create/${folioid}`, formData);

      if (res.status === 201) {
        showMessages(res.data.message, "success");
        setTransactionData(null);
        setChanges(!changes);
        fetch();
      }
    } catch (err) {
      if (err) {
        showMessages(
          err.response?.data.message ||
            err.response?.message ||
            "Internal server error",
          "reject",
        );
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Input
        label="Amount:"
        required
        placeholder="0.00"
        setData={setTransactionData}
        value={transactionData?.amount?.value}
        Name="amount"
        changes={changes}
        type="number"
        errors={errors}
      />

      <div className={styles.inputrow}>
        <Input
          label="Payment Mode:"
          required
          placeholder="0.00"
          setData={setTransactionData}
          value={transactionData?.paymentmode?.value}
          type="select"
          Name="paymentmode"
          changes={changes}
          errors={errors}
        >
          <option value="">---select one--</option>
          {modepayment.map((pm, ind) => {
            return (
              <option value={pm.trim()} key={ind}>
                {pm.trim().toUpperCase()}
              </option>
            );
          })}
        </Input>
        <Input
          label="Mode Id:"
          required={
            transactionData && transactionData.paymentmode.value != "cash"
          }
          placeholder="98xxxxxxxxxx"
          setData={setTransactionData}
          value={transactionData?.modeid?.value}
          Name="modeid"
          changes={changes}
          errors={errors}
        />
      </div>

      <Input
        label="Remarks:"
        required
        placeholder="This payment is for the reservation"
        setData={setTransactionData}
        value={transactionData?.remarks?.value}
        Name="remarks"
        changes={changes}
        errors={errors}
      />

      <div
        className={`${styles.createtransactionbtn} ${loading ? styles.loadingbtn : styles.activebtn}`}
        onClick={() => {
          CreateTransaction();
        }}
      >
        {loading ? <div className={styles.loader}></div> : "Create Transaction"}
      </div>
    </>
  );
};

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
const ReservationDetailedView = () => {
  let [reservation, setReservation] = useState(null);
  let [loading, setLoading] = useState(false);
  let { hotelid, reservationid } = useParams();
  let navigate = useNavigate();
  let { showMessages } = useGlobalMessageContext();
  let { setConfirmationMessageData, clearMessage } =
    useConfirmationMessageContext();

  let UpdateReservation = async (value) => {
    if (loading) {
      return;
    }
    let trimmedValue = value.trim();
    const allowedStatuses = ["cancelled", "no_show", "confirmed"];

    if (!allowedStatuses.includes(trimmedValue)) {
      setactiveid(null);
      clearMessage();
      return showMessages("Invalid Action", "reject");
    }

    if (!hotelid || !reservationid) {
      returnsetactiveid(null);
      clearMessage();
      return showMessages("Invalid hotelid", "reject");
    }

    try {
      let formData = new FormData();
      formData.append("reservationid", reservationid);
      formData.append("status", trimmedValue);

      setConfirmationMessageData((prev) => ({
        ...prev,
        loading: true,
      }));

      let res = await api.put(
        `/reservation/updatereservationstatus/${hotelid}`,
        formData,
      );
      if (res.status === 201) {
        showMessages(res.data?.message, "success");
      }
    } catch (err) {
      if (err) {
        showMessages(
          err?.response?.data.message || "Internal server error",
          "reject",
        );
      }
    } finally {
      FetchReservation();
      clearMessage();
      setLoading(false);
    }
  };

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
      if (err) {
        showMessages(
          err.response?.data.message || "Internal server error",
          "reject",
        );
        setTimeout(() => {
          return navigate(-1, { replace: true });
        }, 500);
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
      {loading && <SkeletonReservationDetailpage />}
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
            <div className={styles.rsvbtnholder}>
              <ActionBtn
                icon={<CgLogIn />}
                value="Checkin"
                classname={
                  reservation.status == "confirmed"
                    ? "primaryactionbtn"
                    : "inactivebtn"
                }
                onclick={() => {
                  if (loading || reservation.status !== "confirmed") {
                    return;
                  }
                }}
              />
              <ActionBtn
                icon={<LuEyeOff />}
                value="No Show"
                classname={
                  reservation.status == "confirmed" ||
                  reservation.status == "pending"
                    ? "no_show"
                    : "inactivebtn"
                }
                onclick={() => {
                  if (
                    reservation.status == "confirmed" ||
                    reservation.status == "pending"
                  ) {
                    setConfirmationMessageData({
                      show: true,
                      message:
                        "Are You Sure To Mark This Reservation As no_show?",
                      okFunction: () => {
                        UpdateReservation("no_show");
                      },
                      loading: false,
                    });
                  }
                }}
              />
              <ActionBtn
                icon={<TbCancel />}
                value="Cancel"
                classname={
                  reservation.status == "confirmed" ||
                  reservation.status == "pending"
                    ? "cancelled"
                    : "inactivebtn"
                }
                onclick={() => {
                  if (
                    reservation.status == "confirmed" ||
                    reservation.status == "pending"
                  ) {
                    setConfirmationMessageData({
                      show: true,
                      message:
                        "Are You Sure To Mark This Reservation As cancelled?",
                      okFunction: () => {
                        UpdateReservation("cancelled");
                      },
                      loading: false,
                    });
                  }
                }}
              />
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
                  <ContactCard
                    icon={<IoMailOutline />}
                    name="email"
                    value={reservation.guest.email}
                  />
                  <ContactCard
                    icon={<LuPhone />}
                    name="phone"
                    value={reservation.guest.phone}
                  />
                  <ContactCard
                    icon={<IoLocationOutline />}
                    name="Address"
                    value={reservation.guest.address}
                  />
                </div>

                {reservation?.guest?.documents?.length > 0 && (
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
                        documents={reservation.guest.documents}
                      />
                    </div>
                  </>
                )}
              </div>

              <div className={styles.infocard}>
                <div className={styles.infocardhead}>
                  <div className={styles.infoheadicon}>
                    <TbNotebook />
                  </div>
                  <div className={styles.infocardheading}>Notes </div>
                </div>

                <div className={styles.notecontent}>
                  {reservation.specialRequests != "N/A"
                    ? reservation.specialRequests
                    : "Note is not Uploaded"}
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
                  <div className={styles.paymentrow}>
                    <div className={styles.paymenttitle}>
                      Room Rate x{" "}
                      {(new Date(reservation.checkOut) -
                        new Date(reservation.checkIn)) /
                        (1000 * 60 * 60 * 24)}
                    </div>
                    <div className={styles.paymentValuenormal}>
                      Rs.{" "}
                      {reservation.payments
                        .filter((payment) => payment.payableModel === "Room")
                        .reduce((total, payment) => {
                          return total + payment.amountToPay;
                        }, 0)}
                    </div>
                  </div>

                  <div className={styles.paymentrow}>
                    <div className={styles.paymenttitlelight}>Taxes & Fees</div>
                    <div className={styles.paymentValuelight}>Included</div>
                  </div>
                  <div className={styles.frdivider} />

                  <div className={styles.paymentrow}>
                    <div className={styles.paymenttitle}>Reservation Fee</div>
                    <div className={styles.paymentValuelight}>
                      Rs.{" "}
                      {reservation.payments
                        .filter(
                          (payment) => payment.payableModel === "Reservation",
                        )
                        .reduce((total, payment) => {
                          return total + payment.amountToPay;
                        }, 0)}
                    </div>
                  </div>

                  <div className={styles.paymentrow}>
                    <div className={styles.paymenttitle}>Total</div>
                    <div className={styles.paymentValueBold}>
                      Rs. {reservation.openFolio.totalAmount}
                    </div>
                  </div>

                  <div className={styles.paymentrow}>
                    <div className={styles.paymenttitle}>Paid</div>
                    <div className={styles.paymentValuelight}>
                      {reservation.openFolio.amountPaid}
                    </div>
                  </div>
                  <div className={styles.frdivider} />
                  <div className={styles.paymentrow}>
                    <div className={styles.paymenttitle}>Due</div>
                    <div className={styles.paymentValueBold}>
                      Rs.{" "}
                      {Number(reservation.openFolio.totalAmount) -
                        Number(reservation.openFolio.amountPaid)}
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
                </div>

                {reservation.payments.map((payment, ind) => {
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
                })}
              </div>
              {Number(reservation.openFolio.totalAmount) -
                Number(reservation.openFolio.amountPaid) !=
                0 && reservation.openFolio.status==="open" &&  (
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
                    guestid={reservation.guest._id}
                    folioid={reservation.openFolio._id}
                    fetch={FetchReservation}
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
                  {reservation.openFolio.transactions.length == 0 && (
                    <div className={styles.emptymessage}>
                      No Transactions Available
                    </div>
                  )}
                  {reservation.openFolio.transactions.length > 0 &&
                    reservation.openFolio.transactions.map(
                      (transaction, ind) => {
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
                      },
                    )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ReservationDetailedView;
