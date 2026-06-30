import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import api from "../../../axios/axios";
import { LuBedDouble } from "react-icons/lu";
import { RiVipCrownLine } from "react-icons/ri";
import styles from "../../css/categoryIndividual.module.css";
import { LuTags } from "react-icons/lu";
import { MdOutlineMeetingRoom } from "react-icons/md";
import { RxPeople } from "react-icons/rx";
import { BsStars } from "react-icons/bs";
import { BsCheckLg } from "react-icons/bs";
import { FiClock } from "react-icons/fi";
import { formatDate } from "../../../Adminpannel/components/dateformatter";
import { useGlobalMessageContext } from "../../../Globalmessage/components/globalmessage";

let colors = ["rgb(0, 198, 0)", "rgb(60, 0, 201)", "rgb(198, 99, 0)", "blue"];

let ColorAndIcons = {
  Bed: {
    color: {
      background: "#e6e6ff",
    },
    icon: <LuBedDouble color={"#0e00cd"} />,
  },
  Vip: {
    color: {
      background: "#fff6e4",
    },
    icon: <RiVipCrownLine color="#e67f00" />,
  },
};

let InfoCard = ({ icon, name = "", value = "" }) => {
  return (
    <div className={styles.categoryInfoCard}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.name}>{name}</div>
      <div className={styles.value}>{value}</div>
    </div>
  );
};
const CategoryIndividualView = () => {
  let [loading, setLoading] = useState(false);
  let [searchparams, setSearchParams] = useSearchParams();
  let [categoryinfo, setCategoryInfo] = useState(null);
  let navigate = useNavigate()
  let {showMessages}=useGlobalMessageContext()
  let CI = searchparams.get("CI");

  let FetchCategory = async (controller) => {
    if (loading && !CI) return;

    setLoading(true);

    try {
      let res = await api.get(`/roomcategory/singlecategory/${CI}`, {
        signal: controller.signal,
      });
      if (res.status == 200) {
        setCategoryInfo(res?.data.roomcategory);
      }
    } catch (err) {
      if (err) {
        showMessages(err?.response?.data.message, "reject");
      }
    }
    setLoading(true);
  };
  useEffect(() => {
    let controller = new AbortController();
    FetchCategory(controller);

    return () => {
      controller.abort();
    };
  }, []);
  console.log(categoryinfo);
  return (
    <>
      <div className={styles.maininfocard}>
        <div className={styles.roomandiconholder}>
          <div
            className={styles.categoryicon}
            style={{
              backgroundColor: ["vip", "royal", "presidential"].some((word) =>
                categoryinfo?.name?.trim().toLowerCase().includes(word),
              )
                ? ColorAndIcons.Vip.color.background
                : ColorAndIcons.Bed.color.background,
            }}
          >
            {["vip", "royal", "presidential"].some((word) =>
              categoryinfo?.name?.trim().toLowerCase().includes(word),
            )
              ? ColorAndIcons.Vip.icon
              : ColorAndIcons.Bed.icon}
          </div>
          <div className={styles.categorynameandstat}>
            <div className={styles.categoryname}>{categoryinfo?.name}</div>
            <div className={styles.status}>
              {categoryinfo?.isActive === true ||
              categoryinfo?.isActive === "true"
                ? "Active"
                : "Inactive"}
            </div>
          </div>
        </div>
        <div className={styles.categoryinfocardholder}>
          <InfoCard
            icon={<LuTags color={colors[0]} />}
            name="Base Rate"
            value={`Rs. ${categoryinfo?.baseRate}`}
          />
          <InfoCard
            icon={<MdOutlineMeetingRoom color={colors[1]} />}
            name="Rooms"
            value={categoryinfo?.rooms.length}
          />
          <InfoCard
            icon={<RxPeople color={colors[2]} />}
            name="Max Pax"
            value={categoryinfo?.maxPax}
          />
          <InfoCard
            icon={<FiClock color={colors[3]} />}
            name="Created On"
            value={formatDate(categoryinfo?.createdAt)}
          />
        </div>

        <div className={styles.descriptionholder}>
          <div className={styles.title}>Description:</div>
          <div className={styles.desvalholder}>{categoryinfo?.description}</div>
        </div>
      </div>

      <div className={styles.maininfocard2}>
        <div className={styles.infocard2}>
          <div className={styles.headingandicon}>
            <div className={styles.icon}>
              <BsStars color="rgb(170, 170, 170)" />
            </div>
            <div className={styles.title}>Amenities:</div>
          </div>

          <div className={styles.amencardholder}>
            {categoryinfo?.amenities
              ? categoryinfo?.amenities.map((amen, ind) => {
                  return (
                    <div className={styles.amencard} key={ind}>
                      <div className={styles.amencardicon}>
                        <BsCheckLg />
                      </div>
                      <div className={styles.amenval}>{amen}</div>
                    </div>
                  );
                })
              : "No Amenities Uploaded"}
          </div>
        </div>
        <div className={styles.infocard2}>
          <div className={styles.headingandicon}>
            <div className={styles.icon}>
              <MdOutlineMeetingRoom color="rgb(170, 170, 170)" />
            </div>
            <div className={styles.title}>Rooms:</div>
          </div>

          <div className={`${styles.roomcardholder} ${categoryinfo?.rooms.length===0 && styles.roomcardsempty}`}>
            {categoryinfo?.rooms.length > 0
              ? categoryinfo?.rooms.map((room, ind) => {
                  return <div className={styles.roomcard} key={ind} onClick={()=>{
                    navigate(`/services/${room.hotel}/roommanagement/rooms/i?RI=${room._id}`)
                    
                  }}>
                    <div className={styles.roomname}>
                       Room - {room.roomNumber}
                      
                    </div>
                    <div className={styles.roompax}>
                        {room.pax} . Pax
                      
                    </div>
                    <div className={styles.roomstatus}>
                        {room.status}
                      
                    </div>
                  </div>;
                })
              : "Rooms Not Available"}
          </div>
        </div>
      </div>
    </>
  );
};

export default CategoryIndividualView;
