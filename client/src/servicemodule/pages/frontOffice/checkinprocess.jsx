import { useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useGlobalMessageContext } from "../../../Globalmessage/components/globalmessage";
import api from "../../../axios/axios";
import styles from "../../css/checkindetailview.module.css";
import { formatDate } from "../../../Adminpannel/components/dateformatter";
import { LuClock5, LuPhone } from "react-icons/lu";
import { MdErrorOutline, MdOutlineSource } from "react-icons/md";
import { FaArrowLeftLong, FaArrowRightLong, FaLeaf } from "react-icons/fa6";
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
import { FaPeopleRoof } from "react-icons/fa6";
import SkeletonReservationDetailpage from "../../components/skeletonpageforreservationindidetail";
import {
  DetailCard,
  ContactCard,
  TransactionForm,
  ActionBtn,
  GuestCard,
} from "../../components/checkinprocess.components";
import { HiOutlineDocumentCheck } from "react-icons/hi2";
import { BsCheck } from "react-icons/bs";
import { emailRegex, phoneRegex } from "../../../Adminpannel/components/regex";
import { formatFileSize } from "../../../utilits/utilits";
import SkeletonLoader from "../../../loader/loaders";

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

const CheckinProcess = () => {
  let [reservation, setReservation] = useState(null);
  let [loading, setLoading] = useState(false);
  let[uploadingLoading,setUploadingLoading]=useState(false)
  let { hotelid, reservationid } = useParams();
  let navigate = useNavigate();
  let { showMessages } = useGlobalMessageContext();
  let { setConfirmationMessageData, clearMessage } =
    useConfirmationMessageContext();
  let [primaryGuest, setPrimaryGuest] = useState({});
  let [consentSelectBtn, setConsentSelectBtn] = useState(false);
  let consentText = `I confirm that I have carefully reviewed the guest’s information, identification documents, reservation details, room assignment, payment information, and all other details entered during the check-in process.

To the best of my knowledge, the information entered is complete, accurate, and based on the documents and information provided by the guest.

Also the remaining amount to be paid will automatically be transferred to the folio of the primary guest.

I understand that entering false, incomplete, altered, or misleading information may result in disciplinary action and, where applicable, legal action according to hotel policy and applicable law.

By completing this check-in, I accept responsibility for verifying and accurately recording the provided information.`;
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
        `/checkin/getreservation?hotelid=${hotelid}&reservationid=${reservationid}`,
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

  let CreateReservation = async () => {
    if (uploadingLoading|| !hotelid || !reservationid) {
      return;
    }
    let {
      files,
      isprimary,
      guest,
      inputdata,
      selectBtn,
      maxfilesize,
      maxfile,
      accept,
      searchStatus,
      requiredfiles,
      setfileError,
      setinputError,
    } = primaryGuest["primary"];
    let {
      guestaddress,
      guestemail,
      guestname,
      guestphone,
      guesttype,
      idnumber,
      idtype,
      nationality,
    } = inputdata;
    let idTypeEnum = ["citizenship", "passport", "license", "national_id"];
    let guestTypeEnum = ["normal", "vip", "corporate", "blacklisted"];
    

    const cleanedAddress = guestaddress?.value?.trim() || "";
    const cleanedEmail = guestemail?.value?.trim().toLowerCase() || "";
    const isValidEmail = cleanedEmail ? emailRegex.test(cleanedEmail) : false;
    const cleanedPhone = guestphone?.value?.trim() || "";
    const isValidPhone = phoneRegex.test(cleanedPhone) || false;
    const cleanedName = guestname?.value?.trim() || "";
    const isValidName = cleanedName.length > 0;
    const cleanedGuestType = guesttype?.value?.trim() || null;
    const isValidGuestType = cleanedGuestType
      ? guestTypeEnum.includes(cleanedGuestType)
      : false;
    const cleanedIdNumber = idnumber?.value?.trim() || null;
    const cleanedIdType = idtype?.value?.trim() || null;
    const isValidIdType = cleanedIdType
      ? idTypeEnum.includes(cleanedIdType)
      : false;
    const cleanedNationality = nationality?.value?.trim() || null;

    const isValidFiles =
      Array.isArray(files) &&
      files.length >= Number(requiredfiles) &&
      files.every((file) => {
        const acceptedMainType = accept.trim().split("/")[0];
        const currentMainType = file.type?.split("/")[0];

        return acceptedMainType === currentMainType;
      });

    

    if (!searchStatus) {
      showMessages("Search the Guest First", "reject");
      return;
    }

    if (!isValidFiles) {
      setfileError("Please Upload the Valid And Required Files");
      showMessages("File Error", "reject");
      return;
    }
    let error = {};

    const Data = new FormData();

    if (searchStatus && guest) {
      if (!guest._id) {
        error = {
          ...error,
          guestid: "Guestid not found",
        };
      }

      if (typeof isprimary != "boolean") {
        error = {
          ...error,
          isprimary: "Invalid Is Primary",
        };
      }
      Data.append("guestid", guest._id);
      Data.append("isprimary", isprimary);
      Data.append("hasconsented", consentSelectBtn);
      Data.append("consenttext", consentText);
      files.forEach((file) => {
        Data.append("Document", file);
      });
    } else if (searchStatus && !guest) {
      if (!isValidEmail) {
        error = {
          ...error,
          guestemail: "Invalid email",
        };
      }

      if (!isValidPhone) {
        error = {
          ...error,
          guestphone: "Invalid Phone Number",
        };
      }

      if (!isValidName) {
        error = {
          ...error,
          guestname: "Invalid guest name",
        };
      }
      if (!cleanedAddress) {
        error = {
          ...error,
          guestaddress: "Invalid address",
        };
      }

      if (!isValidName) {
        error = {
          ...error,
          guestname: "Invalid Phone Number",
        };
      }

      if (!isValidGuestType) {
        error = {
          ...error,
          guesttype: "Invalid guest type",
        };
      }

      if (!cleanedIdNumber) {
        error = {
          ...error,
          idnumber: "Invalid id number",
        };
      }

      if (!isValidIdType) {
        error = {
          ...error,
          idtype: "Invalid id type",
        };
      }

      if (!cleanedNationality) {
        error = {
          ...error,
          nationality: "Invalid id nationality",
        };
      }

      setinputError(error);
      Data.append("isprimary", isprimary);
      Data.append("hasconsented", consentSelectBtn);
      Data.append("consenttext", consentText);
      Data.append("guestname", guestname?.value?.trim());
      Data.append("guestemail", cleanedEmail);
      Data.append("guestphone", cleanedPhone);
      Data.append("guestaddress", cleanedAddress);
      Data.append("guesttype", cleanedGuestType);
      Data.append("guestidtype", cleanedIdType);
      Data.append("guestidnumber", cleanedIdNumber);
      Data.append("guestnationality", cleanedNationality);

      files.forEach((file) => {
        Data.append("Document", file);
      });
    } else {
      showMessages("Error Occured");
      return
    }
    if (Object.keys(error).length === 0) {
      try {
        setUploadingLoading(true);

        let res = await api.post(
          `/checkin/create/${hotelid}/${reservationid}`,
          Data,
        );

        if (res.status === 201) {
          showMessages(res.data.message, "success");
        }
      } catch (err) {
        if (err) {
          console.log(err);
          showMessages(
            err?.response?.data?.message || "internal server error",
            "reject",
          );
        }
      } finally {
        setUploadingLoading(false);
      }
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
                    <FaPeopleRoof />
                  </div>
                  <div className={styles.infocardheading}>
                    Staying Guests Information{" "}
                  </div>
                </div>
                <GuestCard
                  guest={reservation.guest}
                  isprimary
                  guestType="Primary Guest:"
                  setGuestData={setPrimaryGuest}
                  index={"primary"}
                />
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

              <div className={styles.infocard}>
                <div className={styles.infocardhead}>
                  <div className={styles.infoheadicon}>
                    <HiOutlineDocumentCheck />
                  </div>
                  <div className={styles.infocardheading}>Consent Screen</div>
                </div>

                <div className={styles.primaryGuestSelection}>
                  <div
                    className={`${styles.selectionbtn} ${consentSelectBtn ? styles.selectionbtnactive : styles.selectionbtninactive}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      setConsentSelectBtn(!consentSelectBtn);
                    }}
                  >
                    {consentSelectBtn ? <BsCheck /> : ""}
                  </div>
                  <div className={styles.selectiontext}>
                    <pre>{consentText}</pre>
                  </div>
                </div>

                <div
                  className={`${styles.checkinbutton} ${consentSelectBtn && !uploadingLoading ? styles.checkinactivebutton : styles.checkininactivebutton}`}
                  onClick={() => {
                    if(!uploadingLoading && consentSelectBtn){
                      CreateReservation()
                    }
                  }}
                >
                  {uploadingLoading ? <div className={styles.loader}></div> : "Check In"}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default CheckinProcess;
