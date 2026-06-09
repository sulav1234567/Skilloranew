import { memo, useState } from 'react';
import styles from "../css/reservationform.module.css"
import { RxCross1 } from "react-icons/rx";

const CreateReservationform = () => {
    let[formLevel,setFormLevel]=useState(1)

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
        reservationStatus: "Pending"
    })

    const calculateNights = (checkInDate, checkOutDate) => {
        if (!checkInDate || !checkOutDate) return "";

        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);

        const difference = checkOut - checkIn;
        const nights = difference / (1000 * 60 * 60 * 24);

        return nights > 0 ? nights : "";
    }

    const handleChange = (e) => {
        const { name, value } = e.target;

        let updatedData = {
            ...formData,
            [name]: value
        }

        if (name === "adults" || name === "children") {
            const adults = name === "adults" ? Number(value) : Number(formData.adults);
            const children = name === "children" ? Number(value) : Number(formData.children);

            updatedData.totalPax = adults + children || "";
        }

        if (name === "checkInDate" || name === "checkOutDate") {
            const checkInDate = name === "checkInDate" ? value : formData.checkInDate;
            const checkOutDate = name === "checkOutDate" ? value : formData.checkOutDate;

            updatedData.numberOfNights = calculateNights(checkInDate, checkOutDate);
        }

        setFormData(updatedData);
    }

    const nextForm = () => {
        if (formLevel < 4) {
            setFormLevel(formLevel + 1)
        }
    }

    const prevForm = () => {
        if (formLevel > 1) {
            setFormLevel(formLevel - 1)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Reservation Data:", formData);
    }

  return (
   <div className={styles.reservationformcontainer}>
    <div className={styles.reservationform}>
        <div className={styles.reservationformheader}>
            <div className={styles.titleandsubtitle}>
                <div className={styles.title}>
                    Create Reservation
                </div>
                <div className={styles.subtitle}>
                    Fill Up This Form To Create The Reservation
                </div>
            </div>
            <div className={styles.exitbtn} onClick={()=>{
                if(formLevel<4){
                    setFormLevel(formLevel+1)
                }
                else if(formLevel>0){
                    setFormLevel(formLevel-1)
                }
            }}>
               <RxCross1/>
            </div>
        </div>
        <div className={styles.progressbar}>
            <div className={styles.progresscolor} style={{
                width:`${(formLevel/4)*100}%`
            }}></div>
        </div>

        <form className={styles.formbody} onSubmit={handleSubmit}>
            <div className={styles.stepheader}>
                <div className={`${styles.stepitem} ${formLevel >= 1 ? styles.active : ""}`}>
                    Guest Info
                </div>
                <div className={`${styles.stepitem} ${formLevel >= 2 ? styles.active : ""}`}>
                    Stay Details
                </div>
                <div className={`${styles.stepitem} ${formLevel >= 3 ? styles.active : ""}`}>
                    Room Details
                </div>
                <div className={`${styles.stepitem} ${formLevel >= 4 ? styles.active : ""}`}>
                    Payment
                </div>
            </div>

            <div className={styles.formcontent}>
                {formLevel === 1 && (
                    <div className={styles.formsection}>
                        <div className={styles.sectiontitle}>Guest Information</div>
                        <div className={styles.sectionsubtitle}>
                            Enter guest details to search or create a guest profile.
                        </div>

                        <div className={styles.inputgrid}>
                            <div className={styles.inputgroup}>
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    placeholder="Enter first name"
                                />
                            </div>

                            <div className={styles.inputgroup}>
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    placeholder="Enter last name"
                                />
                            </div>

                            <div className={styles.inputgroup}>
                                <label>Email Address</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter email address"
                                />
                            </div>

                            <div className={styles.inputgroup}>
                                <label>Phone Number</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={formData.phoneNumber}
                                    onChange={handleChange}
                                    placeholder="Enter phone number"
                                />
                            </div>
                        </div>
                    </div>
                )}

                {formLevel === 2 && (
                    <div className={styles.formsection}>
                        <div className={styles.sectiontitle}>Reservation Stay Details</div>
                        <div className={styles.sectionsubtitle}>
                            Add check-in, check-out, pax, and purpose of stay.
                        </div>

                        <div className={styles.inputgrid}>
                            <div className={styles.inputgroup}>
                                <label>Check-in Date</label>
                                <input
                                    type="date"
                                    name="checkInDate"
                                    value={formData.checkInDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.inputgroup}>
                                <label>Check-in Time</label>
                                <input
                                    type="time"
                                    name="checkInTime"
                                    value={formData.checkInTime}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.inputgroup}>
                                <label>Check-out Date</label>
                                <input
                                    type="date"
                                    name="checkOutDate"
                                    value={formData.checkOutDate}
                                    onChange={handleChange}
                                />
                            </div>

                            <div className={styles.inputgroup}>
                                <label>Number Of Nights</label>
                                <input
                                    type="number"
                                    name="numberOfNights"
                                    value={formData.numberOfNights}
                                    onChange={handleChange}
                                    placeholder="Auto calculated"
                                />
                            </div>

                            <div className={styles.inputgroup}>
                                <label>Adults</label>
                                <input
                                    type="number"
                                    name="adults"
                                    value={formData.adults}
                                    onChange={handleChange}
                                    placeholder="Number of adults"
                                />
                            </div>

                            <div className={styles.inputgroup}>
                                <label>Children</label>
                                <input
                                    type="number"
                                    name="children"
                                    value={formData.children}
                                    onChange={handleChange}
                                    placeholder="Number of children"
                                />
                            </div>

                            <div className={styles.inputgroup}>
                                <label>Total Pax</label>
                                <input
                                    type="number"
                                    name="totalPax"
                                    value={formData.totalPax}
                                    onChange={handleChange}
                                    placeholder="Auto calculated"
                                />
                            </div>

                            <div className={styles.inputgroup}>
                                <label>Purpose Of Stay</label>
                                <select
                                    name="purposeOfStay"
                                    value={formData.purposeOfStay}
                                    onChange={handleChange}
                                >
                                    <option value="">Select purpose</option>
                                    <option value="Business">Business</option>
                                    <option value="Leisure">Leisure</option>
                                    <option value="Family">Family</option>
                                    <option value="Conference">Conference</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                        </div>
                    </div>
                )}

                {formLevel === 3 && (
                    <div className={styles.formsection}>
                        <div className={styles.sectiontitle}>Room Information</div>
                        <div className={styles.sectionsubtitle}>
                            Select room category, number of rooms, and guest preferences.
                        </div>

                        <div className={styles.inputgrid}>
                            <div className={styles.inputgroup}>
                                <label>Room Category</label>
                                <select
                                    name="roomCategory"
                                    value={formData.roomCategory}
                                    onChange={handleChange}
                                >
                                    <option value="">Select room category</option>
                                    <option value="Standard Room">Standard Room</option>
                                    <option value="Deluxe Room">Deluxe Room</option>
                                    <option value="Suite Room">Suite Room</option>
                                    <option value="Family Room">Family Room</option>
                                </select>
                            </div>

                            <div className={styles.inputgroup}>
                                <label>Number Of Rooms</label>
                                <input
                                    type="number"
                                    name="numberOfRooms"
                                    value={formData.numberOfRooms}
                                    onChange={handleChange}
                                    placeholder="Enter number of rooms"
                                />
                            </div>

                            <div className={styles.inputgroup}>
                                <label>Room Preference</label>
                                <select
                                    name="roomPreference"
                                    value={formData.roomPreference}
                                    onChange={handleChange}
                                >
                                    <option value="">Select preference</option>
                                    <option value="Any Available Room">Any Available Room</option>
                                    <option value="Near Elevator">Near Elevator</option>
                                    <option value="High Floor">High Floor</option>
                                    <option value="Low Floor">Low Floor</option>
                                    <option value="Quiet Room">Quiet Room</option>
                                </select>
                            </div>

                            <div className={styles.inputgroup}>
                                <label>Reservation Status</label>
                                <input
                                    type="text"
                                    name="reservationStatus"
                                    value={formData.reservationStatus}
                                    onChange={handleChange}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className={styles.fullinputgroup}>
                            <label>Special Request</label>
                            <textarea
                                name="specialRequest"
                                value={formData.specialRequest}
                                onChange={handleChange}
                                placeholder="Write guest special request if any..."
                            ></textarea>
                        </div>
                    </div>
                )}

                {formLevel === 4 && (
                    <div className={styles.formsection}>
                        <div className={styles.sectiontitle}>Payment Information</div>
                        <div className={styles.sectionsubtitle}>
                            Add reservation charge and payment details. Reservation will be pending by default.
                        </div>

                        <div className={styles.inputgrid}>
                            <div className={styles.inputgroup}>
                                <label>Reservation Charge</label>
                                <input
                                    type="number"
                                    name="reservationCharge"
                                    value={formData.reservationCharge}
                                    onChange={handleChange}
                                    placeholder="Enter reservation charge"
                                />
                            </div>

                            <div className={styles.inputgroup}>
                                <label>Payment Method</label>
                                <select
                                    name="paymentMethod"
                                    value={formData.paymentMethod}
                                    onChange={handleChange}
                                >
                                    <option value="">Select payment method</option>
                                    <option value="Cash">Cash</option>
                                    <option value="eSewa">eSewa</option>
                                    <option value="Khalti">Khalti</option>
                                    <option value="Bank Transfer">Bank Transfer</option>
                                    <option value="Card">Card</option>
                                </select>
                            </div>

                            <div className={styles.inputgroup}>
                                <label>Paid Amount</label>
                                <input
                                    type="number"
                                    name="paidAmount"
                                    value={formData.paidAmount}
                                    onChange={handleChange}
                                    placeholder="Enter paid amount"
                                />
                            </div>

                            <div className={styles.inputgroup}>
                                <label>Payment Reference</label>
                                <input
                                    type="text"
                                    name="paymentReference"
                                    value={formData.paymentReference}
                                    onChange={handleChange}
                                    placeholder="Transaction ID / Reference"
                                />
                            </div>

                            <div className={styles.inputgroup}>
                                <label>Payment Status</label>
                                <input
                                    type="text"
                                    name="paymentStatus"
                                    value={formData.paymentStatus}
                                    onChange={handleChange}
                                    readOnly
                                />
                            </div>

                            <div className={styles.inputgroup}>
                                <label>Final Reservation Status</label>
                                <input
                                    type="text"
                                    name="reservationStatus"
                                    value={formData.reservationStatus}
                                    onChange={handleChange}
                                    readOnly
                                />
                            </div>
                        </div>

                        <div className={styles.summarybox}>
                            <div className={styles.summarytitle}>Reservation Summary</div>

                            <div className={styles.summaryrow}>
                                <span>Guest</span>
                                <p>{formData.firstName || "-"} {formData.lastName || ""}</p>
                            </div>

                            <div className={styles.summaryrow}>
                                <span>Stay</span>
                                <p>{formData.checkInDate || "-"} to {formData.checkOutDate || "-"}</p>
                            </div>

                            <div className={styles.summaryrow}>
                                <span>Total Pax</span>
                                <p>{formData.totalPax || "-"}</p>
                            </div>

                            <div className={styles.summaryrow}>
                                <span>Rooms</span>
                                <p>{formData.numberOfRooms || "-"} {formData.roomCategory || ""}</p>
                            </div>

                            <div className={styles.summaryrow}>
                                <span>Status</span>
                                <p>{formData.reservationStatus}</p>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className={styles.formfooter}>
                <button
                    type="button"
                    className={styles.backbtn}
                    onClick={prevForm}
                    disabled={formLevel === 1}
                >
                    Back
                </button>

                {formLevel < 4 ? (
                    <button
                        type="button"
                        className={styles.nextbtn}
                        onClick={nextForm}
                    >
                        Continue
                    </button>
                ) : (
                    <button
                        type="submit"
                        className={styles.nextbtn}
                    >
                        Create Reservation
                    </button>
                )}
            </div>
        </form>

    </div>

   </div>
  );
};

export default memo(CreateReservationform);