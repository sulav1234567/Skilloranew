import { memo, useEffect, useState } from "react";
import styles from "../css/reservationform.module.css";
import { RxCross1 } from "react-icons/rx";
import { data, useParams } from "react-router";
import { useGlobalMessageContext } from "../../Globalmessage/components/globalmessage";
import { GoPeople, GoStack } from "react-icons/go";
import { LuTag } from "react-icons/lu";
import { RxPeople } from "react-icons/rx";
import api from "../../axios/axios";
import { formatDate } from "../../Adminpannel/components/dateformatter";
import GuestCard from "./guestCard";
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^[0-9]{10}$/;
const guestTypeEnum = ["normal", "vip", "corporate", "blacklisted"];
const idTypeEnum = ["citizenship", "passport", "liscense", "national_Id"];
let sourceEnum = ["direct", "website", "phone", "walk_in", "ota", "other"];

export let Input = ({
  type = "text",
  placeholder = "N/A",
  required = false,
  value = "",
  label = "",
  Name = "",
  errors = {},
  children,
  readonly = false,
  changes = false,
  setData = () => {},
}) => {
  const handleChange = (e) => {
    setData((prev) => ({
      ...prev,
      [Name]: {
        isRequired: required,
        value: e.target.value,
      },
    }));
  };

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      [Name]: {
        isRequired: required,
        value: value,
      },
    }));
  }, [changes]);

  return (
    <div className={styles.forminputholder}>
      <div className={styles.forminputlabelandreqtag}>
        <div className={styles.formlabel}>{label}</div>
        {required && <div className={styles.requiredTag}>*</div>}
      </div>

      <div className={styles.inperror}>{errors[Name]}</div>

      {type !== "select" && (
        <input
          readOnly={readonly}
          type={type}
          placeholder={placeholder}
          required={required}
          value={value ?? ""}
          name={Name}
          onChange={handleChange}
        />
      )}

      {type === "select" && (
        <select
          required={required}
          value={value ?? ""}
          name={Name}
          onChange={handleChange}
        >
          {children}
        </select>
      )}
    </div>
  );
};

const CreateReservationform = ({onexit=()=>{},fetch=()=>{}}) => {
  let [formLevel, setFormLevel] = useState(1);
  let [loading, setLoading] = useState(false);
  let [errors, setErrors] = useState({});
  let [formData, setFormData] = useState({});
  let [guest, setGuest] = useState(null);
  let { hotelid } = useParams();
  let { showMessages } = useGlobalMessageContext();
  let [availableRooms, setAvailableRooms] = useState(null);
  let [selectedRooms, setSelectedRooms] = useState([]);
  let btnNames = {
    L1: "Search",
    L2: guest ? "Next" : "Create Guest",
    L3: "Next",
    L4: "Select Rooms",
    L5: "Payment Information",
    L6: "Create Reservation",
  };

  let setToDefault = ()=>{
    setSelectedRooms([])
    setFormData({});
    setGuest(null);
    setFormLevel(1);
    setAvailableRooms(null)
  }
  let HandlePageChange = (type) => {
    if ((!type && formLevel < 1) || loading) return;
    if (type === "back" && formLevel > 1) {
      setFormLevel(formLevel - 1);
    } else if (type === "next" && formLevel < 6) setFormLevel(formLevel + 1);
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
          setGuest(null);
          showMessages(res?.data.message, "reject");
        }
      } catch (err) {
        if (err) {
          setGuest(null);
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
    if (guest) {
      HandlePageChange("next");
      return;
    }
    setLoading(true);
    if (!hotelid) {
      showMessages("Hotelid not found", "reject");
      return;
    }
    let error = {};
    let {
      email,
      firstname,
      lastname,
      contactnumber,
      nationality,
      address,
      idType,
      idNumber,
      guestType,
      note,
    } = formData;

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

    if (!nationality?.value && nationality.isRequired) {
      error = {
        ...error,
        nationality: "Do not leave this field empty",
      };
    }
    if (!address?.value && address.isRequired) {
      error = {
        ...error,
        address: "Do not leave this field empty",
      };
    }
    if (
      !idType?.value ||
      (!idTypeEnum.includes(idType.value) && idType.isRequired)
    ) {
      error = {
        ...error,
        idType: "Invalid value",
      };
    }
    if (!idNumber?.value && idNumber.isRequired) {
      error = {
        ...error,
        idNumber: "Do not leave this field empty",
      };
    }

    if (
      !guestType?.value ||
      (!guestTypeEnum.includes(guestType.value) && guestType.isRequired)
    ) {
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
          showMessages(res?.data.message, "success");
        }

        if (res?.status === 404) {
          setGuest(null);
          showMessages(res?.data.message, "reject");
        }

        if (res?.status === 409) {
          setGuest(res?.data.guest);
        }
      } catch (err) {
        if (err) {
          setGuest(null);
          showMessages(err?.response?.data.message, "reject");
        }
      } finally {
        HandlePageChange("next");
      }
    }
    setErrors(error);
    setLoading(false);
  };

  let ValidateStayInformation = async () => {
    setLoading(true);
    let error = {};
    let {
      checkindate,
      estimatedcheckintime,
      checkoutdate,
      adults,
      children,
      noofnights,
      totalpax,
    } = formData;
    console.log(formData);
    if (!checkindate.value && checkindate.isRequired) {
      error = {
        ...error,
        checkindate: "Fill up this required field",
      };
    }
    if (!estimatedcheckintime.value && estimatedcheckintime.isRequired) {
      error = {
        ...error,
        estimatedcheckintime: "Fill up this required field",
      };
    }
    if (!checkoutdate.value && checkoutdate.isRequired) {
      error = {
        ...error,
        checkoutdate: "Fill up this required field",
      };
    }

    if (
      !adults.value ||
      (isNaN(Number.parseInt(adults.value)) && adults.isRequired)
    ) {
      error = {
        ...error,
        adults: "This must be the number",
      };
    }

    if (
      !children.value ||
      (isNaN(Number.parseInt(children.value)) && children.isRequired)
    ) {
      error = {
        ...error,
        children: "This must be the number",
      };
    }

    if (
      !totalpax.value ||
      isNaN(Number.parseInt(totalpax.value)) ||
      (Number.parseInt(totalpax.value) <= 0 && totalpax.isRequired)
    ) {
      error = {
        ...error,
        totalpax: "Invalid value",
      };
    }

    if (
      !noofnights.value ||
      isNaN(Number.parseInt(noofnights.value)) ||
      (Number.parseInt(noofnights.value) <= 0 && noofnights.isRequired)
    ) {
      error = {
        ...error,
        noofnights: "Invalid Value",
      };
    }
    setErrors(error);

    if (Object.keys(error).length === 0) {
      let Data = new FormData();
      Data.append("checkindate", checkindate.value);
      Data.append("checkoutdate", checkoutdate.value);
      Data.append("estimatedcheckintime", estimatedcheckintime.value);
      Data.append("adults", adults.value);
      Data.append("children", children.value);

      try {
        
        let res = await api.post(
          `/room/getavailableroomsforreservation/${hotelid}`,
          Data,
        );

        if (res?.status === 200) {
          setSelectedRooms([])
          setAvailableRooms(res.data.availableRooms);
          console.log(res.data.availableRooms);
          HandlePageChange("next");
        }
      } catch (err) {
        if (err) {
          showMessages(err.response?.data.message, "reject");
        }
      }
    }
    setLoading(false);
  };

  let ValidateRoomSelection = async () => {
    if (loading) return;

    if (selectedRooms.length > 0) {
      HandlePageChange("next");
    }
  };

  let CreateReservation = async () => {
    if (loading) return;

    setLoading(true);
    let errors = {};
    let {
      checkindate,
      checkoutdate,
      estimatedcheckintime,
      adults,
      children,
      /*level 1 */
      reservationFee,
      source,
      note,
      specialrequest,
    } = formData;


    if(!guest){
      setFormLevel(1)
      showMessages("Guest not found","reject");
      setLoading(false)
      return;

    }

    if (!checkindate || !isValidDate(checkindate.value)) {
      errors = {
        ...errors,
        checkindate: "this date is not valid",
      };
    }

    if (!checkindate || !isValidDate(checkoutdate.value)) {
      errors = {
        ...errors,
        checkoutdate: "This is not a valid date",
      };
    }

    if (!estimatedcheckintime.value) {
      errors = {
        ...errors,
        estimatedcheckintime: "Please Enter the valid time",
      };
    }
  

    let totalpax = Number(adults.value || 0) + Number(children.value || 0);

    if (!totalpax || totalpax === 0) {
      errors = {
        ...errors,
        adults: "Total pax must be greater than 0",
        children: "Total pax must be greater than 0",
      };
    }

    let noofNights = new Date(checkoutdate.value) - new Date(checkindate.value);
    if (!noofNights || noofNights === 0) {
      errors = {
        ...errors,
        checkindate: "Invalid difference",
        checkoutdate: "Invalid Difference",
      };
    }

    let isvalidcheckindate = Date.now() - new Date(checkindate.value) < 0;
    let isvalidcheckoutdate = Date.now() - new Date(checkoutdate.value) < 0;

    if (!isvalidcheckindate) {
      errors = {
        ...errors,
        checkindate: "Invalid checkin date",
      };
    }

    if (!isvalidcheckoutdate) {
      errors = {
        ...errors,
        checkindate: "Invalid checkout date",
      };
    }

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setFormLevel(3);
      setLoading(false);
      return;
    }

    if(selectedRooms.length===0){
      setFormLevel(4)
      showMessages("Select At Least 1 Room","reject");
      setLoading(false)
      return;
    }
 

   
    if(!source || !sourceEnum.includes(source.value)){
      errors={
        ...errors,
        source:"Invalid Source"
      }
    }

   if(!reservationFee || !Number.isInteger(reservationFee))

    if (Object.keys(errors).length > 0) {
      setErrors(errors);
      setFormLevel(5);
      setLoading(false);
      return;
    }


    if(Object.keys(errors).length===0){
      let data = new FormData();
      data.append("guest",guest._id);
      data.append("checkindate",checkindate.value)
      data.append("checkoutdate",checkoutdate.value)
      data.append("estimatedcheckintime",estimatedcheckintime.value)
      data.append("adults",adults.value)
      data.append("children",children.value)
      selectedRooms.forEach((rooms)=>{
        data.append("rooms",rooms._id)
      })

      data.append("reservationfee",reservationFee.value);
      data.append("source",source.value)
      data.append("note",note.value);
      data.append("specialrequest",specialrequest.value)

     try{

      let res=await api.post(`/reservation/create/${hotelid}`,data)
      if(res.status===201){
        showMessages(res?.data.message,"success")
        setToDefault();
        fetch()
        onexit()
      }
     }catch(err){
      if(err){
        showMessages(err?.response?.data.message || "internal server error",'reject')
      }

     }

    }

    setLoading(false)
  };

  



  useEffect(() => {
    const adults = Number(formData.adults?.value || 0);
    const children = Number(formData.children?.value || 0);
    const total = adults + children;

    setFormData((prev) => {
      if (Number(prev.totalpax?.value || 0) === total) {
        return prev;
      }

      return {
        ...prev,
        totalpax: {
          ...prev.totalpax,
          value: total,
        },
      };
    });
  }, [formData.adults?.value, formData.children?.value]);
  const isValidDate = (value) => {
    if (!value) return false;

    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!match) return false;

    const year = Number(match[1]);
    const month = Number(match[2]);
    const day = Number(match[3]);

    const date = new Date(year, month - 1, day);

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  useEffect(() => {
    const checkInValue = formData.checkindate?.value;
    const checkOutValue = formData.checkoutdate?.value;

    if (!isValidDate(checkInValue) || !isValidDate(checkOutValue)) {
      return;
    }

    const checkInDate = new Date(checkInValue);
    const checkOutDate = new Date(checkOutValue);

    const diffMs = checkOutDate - checkInDate;
    const totalNights = diffMs / (1000 * 60 * 60 * 24);

    setFormData((prev) => {
      if (Number(prev.noofnights?.value || 0) === totalNights) {
        return prev;
      }

      return {
        ...prev,
        noofnights: {
          ...prev.noofnights,
          isRequired: true,
          value: totalNights > 0 ? totalNights : 0,
        },
      };
    });
  }, [formData.checkindate?.value, formData.checkoutdate?.value]);
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
          <div className={styles.exitbtn} onClick={()=>{
            setToDefault()
            onexit()
          }}>
            <RxCross1 />
          </div>
        </div>
        <div className={styles.progressbar}>
          <div
            className={styles.progresscolor}
            style={{
              width: `${(formLevel / 6) * 100}%`,
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
                        <option value={value}>
                          {value.toLocaleUpperCase()}
                        </option>
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

          {formLevel === 3 && (
            <div className={styles.form}>
              <div className={styles.formtitleholder}>
                <div className={styles.formtitleform}>Stay Information</div>
                <div className={styles.subtitleform}>
                  Fill up this form to enter the stay information
                </div>
              </div>

              <div className={styles.formrow}>
                <Input
                  type="date"
                  placeholder="checkindate"
                  label="Arrival Date:"
                  required
                  Name="checkindate"
                  setData={setFormData}
                  errors={errors}
                  value={formData.checkindate?.value}
                />
                <Input
                  type="time"
                  placeholder=""
                  label="Estimated Arrival Time:"
                  Name="estimatedcheckintime"
                  setData={setFormData}
                  required
                  errors={errors}
                  value={formData.estimatedcheckintime?.value}
                />
                <Input
                  type="date"
                  placeholder="checkoutdate"
                  label="Departure Date:"
                  required
                  Name="checkoutdate"
                  setData={setFormData}
                  errors={errors}
                  value={formData.checkoutdate?.value}
                />
              </div>
              <div className={styles.formrow}>
                <Input
                  type="text"
                  placeholder="eg. 6"
                  label="Adults:"
                  Name="adults"
                  setData={setFormData}
                  required
                  errors={errors}
                  value={formData.adults?.value}
                />
                <Input
                  type="text"
                  placeholder="eg.3"
                  label="Children:"
                  Name="children"
                  setData={setFormData}
                  required
                  errors={errors}
                  value={formData.children?.value}
                />
              </div>

              <div className={styles.formrow}>
                <Input
                  type="number"
                  placeholder="eg. 6"
                  label="No Of Nights"
                  Name="noofnights"
                  setData={setFormData}
                  required
                  readonly
                  errors={errors}
                  value={formData.noofnights?.value || 0}
                />
                <Input
                  type="number"
                  placeholder="eg.3"
                  label="Total Pax:"
                  Name="totalpax"
                  setData={setFormData}
                  required
                  readonly
                  errors={errors}
                  value={formData.totalpax?.value || 0}
                />
              </div>
            </div>
          )}
          {formLevel === 4 && (
            <div className={styles.form}>
              <div className={styles.formtitleholder}>
                <div className={styles.formtitleform}>Select Rooms</div>
                <div className={styles.subtitleform}>
                  Click The Btn To Select The Room (for{" "}
                  {formData.totalpax.value} pax)
                </div>
              </div>

              {availableRooms?.length === 0 ||
                (!availableRooms && (
                  <div className={styles.emptymessage}>
                    There are no available rooms
                  </div>
                ))}
              {availableRooms && availableRooms.length > 0 && (
                <div className={styles.roomscardholder}>
                  {availableRooms &&
                    availableRooms.map((room) => {
                      return (
                        <div
                          className={`${styles.roomscard} ${selectedRooms.some((r) => String(r._id).trim() === String(room._id).trim()) && styles.selectedroom}`}
                          key={room._id}
                          onClick={() => {
                            setSelectedRooms((prev) => {
                              let isSelected = selectedRooms.some(
                                (r) =>
                                  String(r._id).trim() ===
                                  String(room._id).trim(),
                              );
                              if (isSelected) {
                                return prev.filter(
                                  (val) =>
                                    String(val._id).trim() != String(room._id),
                                );
                              }

                              return [...prev, room];
                            });
                          }}
                        >
                          <div className={styles.roomnameandselectbtn}>
                            <div className={styles.roomname}>
                              Room - {room.roomNumber}
                            </div>
                            <div
                              className={`${styles.selectbtn} ${selectedRooms.some((r) => String(r._id).trim() === String(room._id).trim()) && styles.activeselectbtn}`}
                            ></div>
                          </div>
                          <div className={styles.categoryname}>
                            {room.category.name}
                          </div>

                          <div className={styles.otherDetails}>
                            <div className={styles.roomcarddetail}>
                              <div className={styles.iconroomcard}>
                                <GoStack />
                              </div>
                              <div className={styles.roomcardtext}>Floor:</div>
                              <div className={styles.roomcardvalue}>
                                {room.floor}
                              </div>
                            </div>

                            <div className={styles.roomcarddetail}>
                              <div className={styles.iconroomcard}>
                                <GoPeople />
                              </div>
                              <div className={styles.roomcardtext}>Pax:</div>
                              <div className={styles.roomcardvalue}>
                                {room.pax}
                              </div>
                            </div>

                            <div className={styles.roomcarddetail}>
                              <div className={styles.iconroomcard}>
                                <LuTag />
                              </div>
                              <div className={styles.roomcardtext}>RPN:</div>
                              <div className={styles.roomcardvalue}>
                                Rs {room.effectivePrice}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              )}
            </div>
          )}

          {formLevel === 5 && (
            <div className={styles.form}>
              <div className={styles.formtitleholder}>
                <div className={styles.formtitleform}>Payment Information</div>
                <div className={styles.subtitleform}>
                  Fill up this to enter the payment information
                </div>
              </div>
              <div className={styles.formrow}>
                <Input
                  required
                  placeholder="Reservation Fee"
                  setData={setFormData}
                  Name="reservationFee"
                  label="Reservation Fee:"
                  errors={errors}
                  value={formData.reservationFee?.value || 0}
                />
                 <Input
                  type="select"
                  required
                  placeholder="Source"
                  setData={setFormData}
                  Name="source"
                  label="Source:"
                  errors={errors}
                  value={formData.source?.value || 0}
                >
                  <option value="">--select One--</option>
                  {sourceEnum.map((stat, ind) => {
                    return (
                      <option value={stat.toLowerCase()} key={ind}>
                        {stat}
                      </option>
                    );
                  })}
                </Input>

               
              </div>

            


              <div className={styles.formrow}>
                <Input
                  placeholder="Note"
                  label="Note:"
                  Name="note"
                  setData={setFormData}
                  errors={errors}
                  value={formData.note?.value}
                />
              </div>
              <div className={styles.formrow}>
                <Input
                  placeholder="Special Request"
                  label="Special Request:"
                  Name="specialrequest"
                  setData={setFormData}
                  errors={errors}
                  value={formData.specialrequest?.value}
                />
              </div>
            </div>
          )}
          {formLevel === 6 && (
            <div className={styles.form}>
              <div className={styles.formtitleholder}>
                <div className={styles.formtitleform}>Final Confirmation:</div>
                <div className={styles.subtitleform}>
                  Confirm the details of the reservation
                </div>
              </div>

              <div className={styles.bill}>
                <div className={styles.billtitle}>Reservation Information:</div>

                <div className={styles.billrow}>
                  <div className={styles.billtitle2}>Guest:</div>
                  <div className={styles.billvalue}>
                    {guest?.firstName.toUpperCase()}{" "}
                    {guest?.lastName.toUpperCase()}
                  </div>
                </div>

                <div className={styles.billrow}>
                  <div className={styles.billtitle2}>Guest Id:</div>
                  <div className={styles.billvalue}>{guest?.idNumber}</div>
                </div>
                <div className={styles.billrow}>
                  <div className={styles.billtitle2}>Guest email:</div>
                  <div className={styles.billvalue}>{guest?.email}</div>
                </div>
                <div className={styles.billrow}>
                  <div className={styles.billtitle2}>Guest Contact:</div>
                  <div className={styles.billvalue}>{guest?.phone}</div>
                </div>
                <div className={styles.divider}></div>

                <div className={styles.billrow}>
                  <div className={styles.billtitle2}>Checkin Date:</div>
                  <div className={styles.billvalue}>
                    {formatDate(formData.checkindate?.value)}
                  </div>
                </div>
                <div className={styles.billrow}>
                  <div className={styles.billtitle2}>Checkout Date:</div>
                  <div className={styles.billvalue}>
                    {formatDate(formData.checkoutdate?.value)}
                  </div>
                </div>
                <div className={styles.billrow}>
                  <div className={styles.billtitle2}>
                    Estimated CheckIn time:
                  </div>
                  <div className={styles.billvalue}>
                    {formData.estimatedcheckintime?.value}
                  </div>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.billrow}>
                  <div className={styles.billtitle2}>Adults:</div>
                  <div className={styles.billvalue}>
                    {formData.adults?.value}
                  </div>
                </div>
                <div className={styles.billrow}>
                  <div className={styles.billtitle2}>Children:</div>
                  <div className={styles.billvalue}>
                    {formData.children?.value}
                  </div>
                </div>

                <div className={styles.divider}></div>
                <div className={styles.billrow}>
                  <div className={styles.billtitle2}>Payment Status:</div>
                  <div className={styles.billvalue}>
                    {formData.status?.value}
                  </div>
                </div>

                <div className={styles.billrow}>
                  <div className={styles.billtitle2}>Payment Method:</div>
                  <div className={styles.billvalue}>
                    {formData.method?.value}
                  </div>
                </div>

                <div className={styles.billrow}>
                  <div className={styles.billtitle2}>Online Id:</div>
                  <div className={styles.billvalue}>
                    {formData.onlineid?.value || "--"}
                  </div>
                </div>

                <div className={styles.billrow}>
                  <div className={styles.billtitle2}>Source:</div>
                  <div className={styles.billvalue}>
                    {formData.source?.value}
                  </div>
                </div>

                <div className={styles.billrow}>
                  <div className={styles.billtitle2}>Note:</div>
                  <div className={styles.billvalue}>
                    {formData.note?.value || "N/A"}
                  </div>
                </div>

                <div className={styles.billrow}>
                  <div className={styles.billtitle2}>Special Request:</div>
                  <div className={styles.billvalue}>
                    {formData.specialrequest?.value || "N/A"}
                  </div>
                </div>
              </div>

              <div className={styles.bill}>
                <div className={styles.billtitle}>Invoice</div>

                <div className={styles.billrow}>
                  <div className={styles.billtitle2}>Total Pax:</div>
                  <div className={styles.billvalue}>
                    {formData.totalpax?.value}
                  </div>
                </div>

                <div className={styles.billrow}>
                  <div className={styles.billtitle2}>Selected Rooms:</div>
                  <div className={styles.billvalue}>
                    {selectedRooms?.length} (
                    {selectedRooms.map(
                      (room, ind) =>
                        `${room.roomNumber}${ind != selectedRooms.length - 1 ? ", " : ""}`,
                    )}
                    )
                  </div>
                </div>

                <div className={styles.billrow}>
                  <div className={styles.billtitle2}>Rate Per Night:</div>
                  <div className={styles.billvalue}>
                    {selectedRooms.map(
                      (room, ind) =>
                        `Rs. ${room.effectivePrice}${ind != selectedRooms.length - 1 ? ", " : ""}`,
                    )}
                  </div>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.billrow}>
                  <div className={styles.billtitle2}>Total Nights:</div>
                  <div className={styles.billvalue}>
                    {formData.noofnights?.value}
                  </div>
                </div>

                <div className={styles.billrow}>
                  <div className={styles.billtitle2}>Total RPN:</div>
                  <div className={styles.billvalue}>
                    Rs.
                    {selectedRooms.reduce((total, item) => {
                      return total + Number(item.effectivePrice);
                    }, 0)}
                  </div>
                </div>

                <div className={styles.divider}></div>

                <div className={styles.billrow}>
                  <div className={styles.billtitle2}>Total Amount:</div>
                  <div className={styles.billvalue}>
                    Rs.
                    {formData.noofnights.value *
                      selectedRooms.reduce((total, item) => {
                        return total + Number(item.effectivePrice);
                      }, 0)}
                  </div>
                </div>
                <div className={styles.invoicenote}>
                  Reservation fee will be returned during the checkiIn
                </div>
                <div className={styles.billrow}>
                  <div className={styles.billtitle2}>Reservation Fee:</div>
                  <div className={styles.billvalue}>
                    Rs.
                    {formData.reservationFee?.value || "--"}
                  </div>
                </div>

                <div className={styles.billrow}>
                  <div className={styles.billtitle2}>Advance Amount:</div>
                  <div className={styles.billvalue}>
                    Rs.
                    {formData.advanceAmount?.value || 0}
                  </div>
                </div>

                <div className={styles.divider}></div>
                <div className={styles.billrow}>
                  <div className={styles.billtitle2}>Remaining Amount:</div>
                  <div className={styles.billvalue}>
                    Rs.
                    {formData.noofnights.value *
                      selectedRooms.reduce((total, item) => {
                        return total + Number(item.effectivePrice);
                      }, 0) +
                      (formData.reservationFee
                        ? Number(formData.reservationFee.value)
                        : 0) -
                      (formData.advanceAmount
                        ? Number(formData.advanceAmount.value)
                        : 0)}
                  </div>
                </div>
              </div>
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
              if (formLevel == 2 && !loading) {
                CreateGuest();
              }
              if (formLevel == 3 && !loading) {
                ValidateStayInformation();
              }
              if (formLevel == 4 && !loading) {
                ValidateRoomSelection();
              }
              if (formLevel == 5 && !loading) {
                HandlePageChange("next");
              }
              if (formLevel == 6 && !loading) {
                CreateReservation();
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
