import { memo, useEffect, useState } from "react";
import styles from "../css/reservationform.module.css";
import { RxCross1 } from "react-icons/rx";
import { useParams } from "react-router";
import { useGlobalMessageContext } from "../../Globalmessage/components/globalmessage";
import api from "../../axios/axios";
import GuestCard from "./guestCard";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;
const guestTypeEnum = ["normal", "vip", "corporate", "blacklisted"];
const idTypeEnum = ["citizenship", "passport", "liscense", "national_Id"];

let Input = ({
  type = "text",
  placeholder = "N/A",
  required = false,
  value = "",
  label = "",
  Name = "",
  errors = {},
  children,
  setData = () => {},
}) => {
  let [inpvalue, setInpValue] = useState({
    isRequired: required,
    value: value,
  });
  useEffect(() => {
    setData((prev) => ({
      ...prev,
      [Name]: inpvalue,
    }));
  }, [inpvalue]);

  return (
    <div className={styles.forminputholder}>
      <div className={styles.forminputlabelandreqtag}>
        <div className={styles.formlabel}>{label}</div>
        <div className={styles.requiredTag}>*</div>
      </div>
      <div className={styles.inperror}>{errors[Name]}</div>
      {type != "select" && (
        <input
          type={type}
          placeholder={placeholder}
          required={required}
          value={inpvalue.value}
          name={Name}
          onChange={(e) => {
            setInpValue((prev) => ({
              ...prev,
              value: e.target.value,
            }));
          }}
        />
      )}
      {type == "select" && (
        <select
          required={required}
          value={inpvalue.value}
          name={Name}
          onChange={(e) => {
            setInpValue((prev) => ({
              ...prev,
              value: e.target.value,
            }));
          }}
        >
          {children}
        </select>
      )}
    </div>
  );
};

const CreateReservationform = () => {
  let [formLevel, setFormLevel] = useState(1);
  let [loading, setLoading] = useState(false);
  let [errors, setErrors] = useState({});
  let [formData, setFormData] = useState({});
  let [guest, setGuest] = useState(null);
  let { hotelid } = useParams();
  let { showMessages } = useGlobalMessageContext();
  let btnNames = {
    L1: "Search",
    L2: guest ? "Next" : "Create Guest",
    L3: "Next",
    L4: "Create Reservation",
  };

  let HandlePageChange = (type) => {
    if ((!type && formLevel < 1) || loading) return;
    if (type === "back" && formLevel > 1) {
      setFormLevel(formLevel - 1);
    } else if (type === "next" && formLevel < 4) setFormLevel(formLevel + 1);
  };

  let SearchGuest = async () => {
    setLoading(true);
    if (!hotelid) {
      showMessages("Hotelid not found", "reject");
      return;
    }
    let error = {};
    let { email, firstname, lastname, contactnumber } = formData;

    if ((!email?.value || !emailRegex.test(email.value)) && email.isRequired) {
      error = {
        ...error,
        email: "Email is not valid",
      };
    }
    if (!firstname?.value && firstname.isRequired) {
      error = {
        ...error,
        firstname: "Do not leave this field empty",
      };
    }

    if (!lastname?.value && lastname.isRequired) {
      error = {
        ...error,
        lastname: "Do not leave this field empty",
      };
    }

    if (
      (!contactnumber.value || !phoneRegex.test(contactnumber.value)) &&
      contactnumber.isRequired
    ) {
      error = {
        ...error,
        contactnumber: "Contact Number is not valid",
      };
    }
    if (Object.keys(error).length === 0) {
      try {
        let form = new FormData();
        form.append("email", email.value);
        form.append("firstName", firstname.value);
        form.append("lastName", lastname.value);
        form.append("phonenumber", contactnumber.value);

        let res = await api.post(`/guest/search/${hotelid}`, form);

        if (res?.status === 200) {
          setGuest(res?.data.guest);
          console.log(res?.data.guest);
        }

        if (res?.status === 404) {
          setGuest(null)
          showMessages(res?.data.message, "reject");
        }
      } catch (err) {
        if (err) {
          setGuest(null)
          showMessages(err?.response?.data.message, "reject");
        }
      } finally {
        HandlePageChange("next");
      }
    }
    setErrors(error);
    setLoading(false);
  };

  let CreateGuest = async () => {
    if(guest) {HandlePageChange("next"); return}
    setLoading(true);
    if (!hotelid) {
      showMessages("Hotelid not found", "reject");
      return;
    }
    let error = {};
    let { email, firstname, lastname, contactnumber,nationality,address,idType,idNumber,guestType,note } = formData;

    if ((!email?.value || !emailRegex.test(email.value)) && email.isRequired) {
      error = {
        ...error,
        email: "Email is not valid",
      };
    }
    if (!firstname?.value && firstname.isRequired) {
      error = {
        ...error,
        firstname: "Do not leave this field empty",
      };
    }

    if (!lastname?.value && lastname.isRequired) {
      error = {
        ...error,
        lastname: "Do not leave this field empty",
      };
    }

    if(!nationality?.value && nationality.isRequired){
      error = {
        ...error,
        nationality: "Do not leave this field empty",
      };

    }
    if(!address?.value && address.isRequired){
      error = {
        ...error,
        address: "Do not leave this field empty",
      };

    }
    if(!idType?.value || !idTypeEnum.includes(idType.value) && idType.isRequired){
       error = {
        ...error,
        idType: "Invalid value",
      };


    }
    if(!idNumber?.value  && idNumber.isRequired){
       error = {
        ...error,
        idNumber: "Do not leave this field empty",
      };


    }

    if(!guestType?.value || !guestTypeEnum.includes(guestType.value) && guestType.isRequired){
       error = {
        ...error,
        guestType: "Invalid value",
      };


    }

    if (
      (!contactnumber.value || !phoneRegex.test(contactnumber.value)) &&
      contactnumber.isRequired
    ) {
      error = {
        ...error,
        contactnumber: "Contact Number is not valid",
      };
    }
    if (Object.keys(error).length === 0) {
      try {
        let form = new FormData();
        form.append("email", email.value);
        form.append("firstName", firstname.value);
        form.append("lastName", lastname.value);
        form.append("phonenumber", contactnumber.value);
        form.append("nationality", nationality.value);
        form.append("address", address.value);
        form.append("idType", idType.value);
        form.append("idNumber", idNumber.value);
        form.append("guestType", guestType.value);
        form.append("note", note.value);

        let res = await api.post(`/guest/create/${hotelid}`, form);

        if (res?.status === 201) {
          setGuest(res?.data.guest);
         showMessages(res?.data.message,"success")
        }

        if (res?.status === 404) {
          setGuest(null)
          showMessages(res?.data.message, "reject");
        }

        if (res?.status === 409) {
         setGuest(res?.data.guest)
        }
      } catch (err) {
        if (err) {
          setGuest(null)
          showMessages(err?.response?.data.message, "reject");
        }
      } finally {
        HandlePageChange("next");
      }
    }
    setErrors(error);
    setLoading(false);
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
          {formLevel === 1 && (
            <div className={styles.form}>
              <div className={styles.formtitleholder}>
                <div className={styles.formtitleform}>Basic Information</div>
                <div className={styles.subtitleform}>
                  Fill Up This Form To Enter The Basic Info
                </div>
              </div>

              <div className={styles.formrow}>
                <Input
                  type="text"
                  placeholder="Enter First Name"
                  label="First Name:"
                  required
                  Name="firstname"
                  setData={setFormData}
                  errors={errors}
                  value={formData.firstname?.value}
                />
                <Input
                  type="text"
                  placeholder="Enter Last Name"
                  label="Last Name:"
                  Name="lastname"
                  setData={setFormData}
                  required
                  errors={errors}
                  value={formData.lastname?.value}
                />
              </div>
              <div className={styles.formrow}>
                <Input
                  type="text"
                  placeholder="98xxxxxxxx"
                  label="Contact Number:"
                  Name="contactnumber"
                  setData={setFormData}
                  required
                  errors={errors}
                  value={formData.contactnumber?.value}
                />
                <Input
                  type="email"
                  placeholder="youremail@gmail.com"
                  label="Email Address:"
                  Name="email"
                  setData={setFormData}
                  required
                  errors={errors}
                  value={formData.email?.value}
                />
              </div>
            </div>
          )}
          {formLevel === 2 && (
            <div className={styles.form}>
              <div className={styles.formtitleholder}>
                <div className={styles.formtitleform}>Guest Information</div>
                <div className={styles.subtitleform}>
                  Fill Up This Form to complete guest information
                </div>
              </div>

              {guest && <GuestCard guest={guest} />}

              {!guest && (
                <>
                  <div className={styles.formrow}>
                    <Input
                      label="Nationality:"
                      placeholder="eg. Nepali"
                      Name="nationality"
                      setData={setFormData}
                      errors={errors}
                      required
                      type="text"
                      value={formData?.nationality?.value}
                    />
                    <Input
                      label="Address:"
                      placeholder="eg. Biratnagar 12, koshi province, Nepal"
                      Name="address"
                      setData={setFormData}
                      errors={errors}
                      required
                      type="text"
                      value={formData?.address?.value}
                    />
                  </div>

                  <div className={styles.formrow}>
                    <Input
                      label="Id Type:"
                      Name="idType"
                      setData={setFormData}
                      errors={errors}
                      required
                      type="select"
                      value={formData?.idType?.value || idTypeEnum[0]}
                    >
                      {idTypeEnum.map((value, ind) => (
                        <option value={value}>{value.toLocaleUpperCase()}</option>
                      ))}
                    </Input>
                    <Input
                      label="Id Number:"
                      placeholder="eg.18xhjk0809"
                      Name="idNumber"
                      setData={setFormData}
                      errors={errors}
                      required
                      type="text"
                      value={formData?.idNumber?.value}
                    />
                  </div>

                  <div className={styles.formrow}>
                    <Input
                      label="Guest Type:"
                      Name="guestType"
                      setData={setFormData}
                      errors={errors}
                      required
                      type="select"
                      value={formData?.guestType?.value || guestTypeEnum[0]}
                    >
                      {guestTypeEnum.map((value, index) => (
                        <option value={value}>
                          {value.toLocaleUpperCase()}
                        </option>
                      ))}
                    </Input>
                    <Input
                      label="Note:"
                      placeholder="eg.Window side room prefered"
                      Name="note"
                      setData={setFormData}
                      errors={errors}
                      required
                      type="text"
                      value={formData?.note?.value}
                    />
                  </div>
                </>
              )}
            </div>
          )}
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
            className={`${styles.formbtn} ${loading ? styles.submitbtnloading : styles.formsubmitbtn}`}
            onClick={() => {
              if (formLevel == 1 && !loading) {
                SearchGuest();
              }
              if(formLevel == 2 && !loading){
                CreateGuest()
              }
            }}
          >
            {loading ? (
              <div className={styles.loader}></div>
            ) : (
              btnNames[`L${formLevel}`]
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default memo(CreateReservationform);
