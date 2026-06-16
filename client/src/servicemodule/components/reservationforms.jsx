import { memo, useEffect, useState } from "react";
import styles from "../css/reservationform.module.css";
import { RxCross1 } from "react-icons/rx";

let Input = ({
  type = "text",
  placeholder = "N/A",
  required = false,
  value = "",
  label="",
  setData = () => {},
}) => {
  let [inpvalue, setInpValue] = useState({
    isRequired:required,
    value:value
  });
  useEffect(() => {
    setData(inpvalue);
  }, [inpvalue]);

  return (
    <div className={styles.forminputholder}>
      <div className={styles.forminputlabelandreqtag}>
        <div className={styles.formlabel}>{label}</div>
        <div className={styles.requiredTag}>*</div>
      </div>
      <input
        type={type}
        placeholder={placeholder}
        required={required}
        value={inpvalue.value}
        onChange={(e) => {
          setInpValue((prev)=>({
            ...prev,
            value:e.target.value
          }));
        }}
      />
    </div>
  );
};

const CreateReservationform = () => {
  let [formLevel, setFormLevel] = useState(1);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",

    checkInDate: "",
    checkInTime: "",
    checkOutDate: "",
    adults: "",
    children: "",
    totalPax: "",
    numberOfNights: "",
    purposeOfStay: "",

    roomCategory: "",
    numberOfRooms: "",
    roomPreference: "",
    specialRequest: "",

    reservationCharge: "",
    paymentMethod: "",
    paidAmount: "",
    paymentReference: "",
    paymentStatus: "Pending",
    reservationStatus: "Pending",
  });

  let HandlePageChange = (type) => {
    if (!type && formLevel < 1) return;
    if (type === "back" && formLevel > 1) {
      setFormLevel(formLevel - 1);
    } else if (type === "next" && formLevel < 4) setFormLevel(formLevel + 1);
  };

  return (
    <div className={styles.reservationformcontainer}>
      <div className={styles.reservationform}>
        <div className={styles.reservationformheader}>
          <div className={styles.titleandsubtitle}>
            <div className={styles.title}>Create Reservation</div>
            <div className={styles.subtitle}>
              Fill Up This Form To Create The Reservation
            </div>
          </div>
          <div
            className={styles.exitbtn}
            onClick={() => {
              if (formLevel < 4) {
                setFormLevel(formLevel + 1);
              } else if (formLevel > 0) {
                setFormLevel(formLevel - 1);
              }
            }}
          >
            <RxCross1 />
          </div>
        </div>
        <div className={styles.progressbar}>
          <div
            className={styles.progresscolor}
            style={{
              width: `${(formLevel / 4) * 100}%`,
            }}
          ></div>
        </div>

        <div className={styles.formcontainer}>
          <div className={styles.form}>
            <div className={styles.formtitleholder}>
              <div className={styles.formtitleform}>Basic Information</div>
              <div className={styles.subtitleform}>
                Fill Up This Form To Enter The Basic Info
              </div>
            </div>

            <div className={styles.formrow}>
              <Input type="text" placeholder="Enter First Name" label="First Name:" required setData={(value)=>{
                console.log(value)

              }} />
              <Input type="text" placeholder="Enter Last Name" label="Last Name:" required />
            </div>
             <div className={styles.formrow}>
              <Input type="text" placeholder="98xxxxxxxx" label="Contact Number:" required />
              <Input type="email" placeholder="youremail@gmail.com" label="Email Address:" required />
            </div>
          </div>
        </div>

        <div className={styles.bottombuttonsholder}>
          <div
            className={`${styles.formbtn} ${styles.backbtn} ${formLevel > 1 ? `${styles.formbackbtnenable}` : `${styles.formbackbtndisable}`}`}
            onClick={() => {
              HandlePageChange("back");
            }}
          >
            Back
          </div>
          <div
            className={`${styles.formbtn} ${styles.formsubmitbtn}`}
            onClick={() => {
              HandlePageChange("next");
            }}
          >
            {formLevel < 4 ? "Next" : "Create Reservation"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CreateReservationform);
