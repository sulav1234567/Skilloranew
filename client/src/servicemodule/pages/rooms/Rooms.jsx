import {useEffect, useState } from "react";
import styles from "../../css/rooms.module.css";
import { useNavigate, useParams } from "react-router";
import api from "../../../axios/axios";
import { useGlobalMessageContext } from "../../../Globalmessage/components/globalmessage";
import { Input } from "../../components/reservationforms";
import CreateRoomsform from "../../components/roomForms";
import SkeletonLoader from "../../../loader/loaders";
import { FiEdit2 } from "react-icons/fi";
import { MdOutline10K, MdOutlineDelete } from "react-icons/md";
import { RxPeople } from "react-icons/rx";
import { TbTag } from "react-icons/tb";
import { MdOutlineMeetingRoom } from "react-icons/md";
import { RoomEditContext } from "../../components/roomeditdatacontext.jsx";

const Rooms = () => {
  
  let[roomLoading,setRoomLoading]=useState(false)
  let [loading, setLoading] = useState(false);
  let [roomCategories, setRoomCategories] = useState(null);
  let[rooms,setRooms]=useState(null)
  let { hotelid } = useParams();
  let { showMessages } = useGlobalMessageContext();
  let[createForm,setCreateForm]=useState(false)
  let[editData,setEditData]=useState({})
  let navigate=useNavigate()

  let FetchCategories = async (controller) => {
    if (loading && !roomCategories) {
      return;
    }
    let categoryData = {};
    setLoading(true);
    try {
      let res = await api.get(`/roomcategory/getall/${hotelid}`, {
        signal: controller.signal,
      });

      if (res.status === 200) {
        let categorydata = res.data?.roomcategory;
        categorydata?.forEach((data) => {
          let { _id, name, maxPax, baseRate } = data;
          categoryData = {
            ...categoryData,
            [_id]: {
              name,
              maxPax,
              baseRate,
            },
          };
        });
        setRoomCategories(categoryData);
      }
    } catch (err) {
      if (err) {
        showMessages(
          err.response?.data.message || "Internal Server error",
          "reject",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  let FetchRooms = async(controller)=>{
     if (roomLoading && !rooms) {
      return;
    }
    setLoading(true);
    try {
      let res = await api.get(`/room/getall/${hotelid}`, {
        signal: controller.signal,
      });

      if (res.status === 200) {
        
        setRooms(res?.data.rooms)
        console.log(res?.data.rooms)
      }
    } catch (err) {
      if (err) {
        showMessages(
          err.response?.data.message || "Internal Server error",
          "reject",
        );
      }
    } finally {
      setLoading(false);
    }

  }

  useEffect(() => {
    let controller = new AbortController();
    FetchCategories(controller);
    FetchRooms(controller)
    return () => {
      controller.abort();
    };
  }, []);

  return (
    <>
      <div className={styles.mainwrapper}>
        <div className={styles.wrapper}>
          <div className={styles.roomsheading}>Room Management</div>

          <div className={styles.roomssubheading}>
            Create, View and Operate The Rooms From this Route
          </div>
        </div>

        <div
          className={`${styles.Createbtn} ${loading ? styles.loadingbtn : styles.activebtn}`}
          onClick={() => {
            setCreateForm(true)
          }}
        >
          Create
        </div>
      </div>

       <div className={styles.categorycardsholder}>
        {!rooms && (
          <>
            <SkeletonLoader
              style={{ height: "180px", width: "100%", borderRadius: "15px" }}
            />
            <SkeletonLoader
              style={{ height: "180px", width: "100%", borderRadius: "15px" }}
            />
            <SkeletonLoader
              style={{ height: "180px", width: "100%", borderRadius: "15px" }}
            />
            <SkeletonLoader
              style={{ height: "180px", width: "100%", borderRadius: "15px" }}
            />
            <SkeletonLoader
              style={{ height: "180px", width: "100%", borderRadius: "15px" }}
            />
            <SkeletonLoader
              style={{ height: "180px", width: "100%", borderRadius: "15px" }}
            />
            <SkeletonLoader
              style={{ height: "180px", width: "100%", borderRadius: "15px" }}
            />
            <SkeletonLoader
              style={{ height: "180px", width: "100%", borderRadius: "15px" }}
            />
            <SkeletonLoader
              style={{ height: "180px", width: "100%", borderRadius: "15px" }}
            />
          </>
        )}
        {rooms &&
          rooms?.map((room) => {
            return (
              <div
                className={styles.categorycard}
                key={room._id}
                onClick={()=>{
                  navigate(`/services/${room.hotel}/roommanagement/rooms/i?RI=${room._id}`)

                  
                }}
               
              >
                <div className={styles.wrappertwoitem}>
                  <div className={styles.categorycardheader}>
                    <div
                      className={styles.categoryicon}
                    >
                      <MdOutlineMeetingRoom/>
                     
                    </div>
                    <div className={styles.categoryname}>Room - {room.roomNumber}</div>

                    <div className={styles.actionbtnholdercatcard}>
                      <div
                        className={styles.actionbtncatcard}
                        onClick={(e) => {
                          e.stopPropagation()
                          let {
                            roomNumber,
                            floor,
                            priceOverride,
                            pax,
                            roomSize,
                            description,
                            status,
                            isActive,
                            hotel,
                            _id,
                            category
                           
                          } = room;
                         
                          setEditData({
                            roomNumber: {
                              value: roomNumber,
                              isRequired: true,
                            },
                            description: {
                              value: description,
                              isRequired: false,
                            },
                            priceOverride: {
                              value: priceOverride || 0,
                              isRequired: false,
                            },
                            pax: {
                              value: pax||0,
                              isRequired: true,
                            },
                            isActive: {
                              value: isActive.toString(),
                              isRequired: true,
                            },
                            hotelid: {
                              value: hotel,
                              isRequired: true,
                            },
                            id: {
                              value: _id,
                              isRequired: true,
                            },
                            floor:{
                              value:floor,
                              isRequired:true
                            },
                            roomSize:{
                              value:roomSize || 0,
                              isRequired:false
                            },
                            roomCategory:{
                              value:category._id,
                              isRequired:true
                            },
                            status:{
                              value:status,
                              isRequired:true

                            }
                           
                          });
                          setCreateForm(true);
                        }}
                      >
                        <FiEdit2 color="#787878" />
                      </div>
                      <div className={styles.actionbtncatcard}>
                        <MdOutlineDelete color="red" />
                      </div>
                    </div>
                  </div>

                  <div className={styles.categorydescription}>
                    {room.description.trim() == "" || room.description.trim() == "N/A" ||!room.description
                      ? "No description Added Yet."
                      : room.description}
                  </div>
                </div>
                <div className={styles.cardfooter}>
                  <div className={styles.footerwrapper}>
                    <div className={styles.footerinfoholder}>
                      <div className={styles.iconcategorycard}>
                        <TbTag />
                      </div>
                      <div className={styles.footercategorycardtext}>
                        Rate: Rs.{room.effectivePrice}
                      </div>
                    </div>
                    <div className={styles.footerinfoholder}>
                      <div className={styles.iconcategorycard}>
                        <RxPeople />
                      </div>
                      <div className={styles.footercategorycardtext}>
                        {room.pax} Pax
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${styles.statustag} ${room.isActive == true ? styles.statustagactive : styles.statustaginactive}`}
                  >
                    {room.isActive == true ? "Active" : "Inactive"}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      {createForm &&
      <RoomEditContext.Provider value={{editData,setEditData}}>
        <CreateRoomsform onexit={()=>{setCreateForm(false)}} categoryData={roomCategories} fetch={FetchRooms}/>

      </RoomEditContext.Provider>
}
      
    </>
  );
};



export default Rooms;
