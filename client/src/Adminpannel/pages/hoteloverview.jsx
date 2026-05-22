import styles from "../css/hoteloverview.module.css";
import { useHotelData } from "./hoteldetailedviewoutlet";
import { FiPlus } from "react-icons/fi";
import { MdModeEdit } from "react-icons/md";
import { GoDotFill } from "react-icons/go";
import { FaStar } from "react-icons/fa";
import { formatDate } from "../components/dateformatter";
import { LuCalendarCheck2 } from "react-icons/lu";
import { FaPhone } from "react-icons/fa6";
import { MdEmail } from "react-icons/md";
import { BsGlobe } from "react-icons/bs";
import GoogleMap from "../../maps/googlemap";
import { FaLocationDot } from "react-icons/fa6";
import { useEffect } from "react";
import api from "../../axios/axios";
import { useState } from "react";
import { GrCircleAlert } from "react-icons/gr";
import { IoIosCheckmarkCircleOutline } from "react-icons/io";;
import { emailRegex } from "../components/regex";

const SearchPlace = () => {
  const [ownervalue, setOwnerValue] = useState("");
  const [ownerStat, setOwnerStat] = useState(false);
  const [isFirst, setIsFirst] = useState(true);
  const [loading, setLoading] = useState(false);

  const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/;

  const fetchUser = async () => {
    if (!emailRegex.test(ownervalue)) {
      setOwnerStat(false);
      setIsFirst(false);
      return;
    }

    try {
      setLoading(true);

      const res = await api.post("/user/getuser", {
        email: ownervalue,
      });

      setOwnerStat(res?.data?.ok === true);
      setIsFirst(false);

      console.log(res?.data);
    } catch (err) {
      console.log(err?.response);
      setOwnerStat(false);
      setIsFirst(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!ownervalue.trim()) {
      setIsFirst(true);
      setOwnerStat(false);
      return;
    }

    const timer = setTimeout(() => {
      fetchUser();
    }, 800);

    return () => {
      clearTimeout(timer);
    };
  }, [ownervalue]);

  return (
    <div className={styles.searchplace}>
      <input
        type="text"
        value={ownervalue}
        onChange={(e) => {
          setOwnerValue(e.target.value);
        }}
        placeholder="Enter owner email"
      />

      {!isFirst && (
        <div
          className={`${styles.iconholder} ${
            ownerStat ? styles.normalicon : styles.redicon
          }`}
        >
          {loading ? (
            <span className={styles.loader}></span>
          ) : ownerStat ? (
            <IoIosCheckmarkCircleOutline />
          ) : (
            <GrCircleAlert />
          )}
        </div>
      )}
    </div>
  );
};


const SeedStar = (star = 0) => {
  return Array.from({ length: star }).map((_, ind) => (
    <div
      key={ind}
      className={styles.star}
      style={{ transform: `translateX(-${10 * ind - 4 * ind}px)` }}
    >
      <FaStar />
    </div>
  ));
};

const CancellationPolicy = ({ policy = "" }) => {
  

  return (
    <div className={styles.policypointsholder}>
      {policy?.split("%sp").map((points, index) => {
        return (
          <div className={styles.policypoint} key={index}>
            <div className={styles.policypointicon}>
              <GoDotFill />
            </div>
            <div className={styles.policytext}>{points}</div>
          </div>
        );
      })}
    </div>
  );
};

const Hoteloverview = () => {
  let { hotel, FetchHotelData } = useHotelData();
  return (
    <>
      <div className={styles.overviewcontainer}>
        <div className={styles.containerone}>
          <div className={styles.infoeditbtnholder}>
            <div className={styles.infoeditbtn}>
              <MdModeEdit />
            </div>
          </div>

          <div className={styles.infomainnameholder}>
            {hotel?.name}

            <div className={styles.orgtype}>{hotel?.category}</div>
          </div>

          <div className={styles.simpleinfoholder}>
            <div
              className={styles.starratingholder}
              style={{ transform: `translateX(-${hotel?.starRating * 4}px)` }}
            >
              <div
                className={styles.starsholder}
                style={{ transform: `translateX(${hotel?.starRating * 4}px)` }}
              >
                {SeedStar(hotel?.starRating)}
              </div>
              <div className={styles.starratingtext}>
                {hotel?.starRating} Star{hotel?.starRating > 0 ? "s" : ""} Hotel
              </div>
            </div>

            <div className={styles.registration}>
              <div className={styles.regIcon}>
                {" "}
                <LuCalendarCheck2 />
              </div>
              <div className={styles.regText}>
                {formatDate(hotel?.createdAt)}
              </div>
            </div>
          </div>

          <div className={styles.amenitiesholder}>
            <div className={styles.infolabel}>Amenities:</div>

            <div className={styles.amencardholder}>
              {hotel?.amenities.map((amen, index) => (
                <div key={index} className={styles.amencard}>
                  {amen}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.infopointsholder}>
            <div className={styles.infolabel}>Cancellation Policy:</div>
            <CancellationPolicy policy={hotel?.policies.cancellationPolicy} />
          </div>
          <div className={styles.infoholder}>
            <div className={styles.infolabel}>Discription:</div>
            <div className={styles.infovalue}>{hotel?.description}</div>
          </div>
        </div>
        <div className={styles.containertwo}>
          <div className={styles.hotelimage}>
            <img
              src={`${import.meta.env.VITE_BASE_URL}/uploads/${hotel?.image.filename}`}
              alt=""
            />
          </div>

          <div className={styles.hotelcard}>
            <div className={styles.cardtitle}>Owner Information</div>
            <div className={styles.hotelcardcontent}>
              {!hotel?.owner && (
                <div className={styles.notfoundcardtext}>
                  Owner Not Assigned!
                </div>
              )}
            </div>
             <SearchPlace/>

            <div className={styles.cardbtn}>
              <div className={styles.cardbtnicon}>
                <FiPlus />
              </div>
              <div className={styles.cardbtntext}>Create Owner</div>
            </div>
          </div>

          <div className={styles.hotelcard}>
            <div className={styles.cardtitle}>Contact Information:</div>

            <div className={styles.cardcontactcontent}>
              <div className={styles.contactcard}>
                <div className={styles.contactcardicon}>
                  <FaPhone />
                </div>
                <div className={styles.contactcardvalue}>
                  +977-{hotel?.contact.phone}
                </div>
              </div>

              <div className={styles.contactcard}>
                <div className={styles.contactcardicon}>
                  <MdEmail />
                </div>
                <div className={styles.contactcardvalue}>
                  {hotel?.contact.email}
                </div>
              </div>

              <div className={styles.contactcard}>
                <div className={styles.contactcardicon}>
                  <BsGlobe />
                </div>
                <div className={styles.contactcardvalue}>
                  {hotel?.contact.website}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.hotelcard}>
            <div className={styles.cardtitle}>Location:</div>

            <div className={styles.addresscard}>
              <div className={styles.addressicon}>
                <FaLocationDot />
              </div>
              <div className={styles.addresstext}>
                {`${hotel?.address.street}, ${hotel?.address.area}, ${hotel?.address.city}, ${hotel?.address.province} province, ${hotel?.address.country} ${hotel?.address.zipCode} `}
              </div>
            </div>

            <div className={styles.mapgoogle}>
              <GoogleMap
                lat={hotel?.location.x}
                lng={hotel?.location.y}
                height="250px"
                zoom={18}
                title={hotel?.name}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hoteloverview;
