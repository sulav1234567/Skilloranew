import { NavLink, Outlet, useParams } from "react-router";
import styles from "../css/hoteldetailedview.module.css";
import { createContext, useContext, useEffect, useState } from "react";
import { useGlobalMessageContext } from "../../Globalmessage/components/globalmessage.jsx";
import api from "../../axios/axios.js";

let HotelContext = createContext(null)

const SecondaryNavlink = ({ path = "", end = false, text = "" }) => {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        isActive
          ? `${styles.navlink} ${styles.activesnavlink}`
          : `${styles.navlink}`
      }
      end={end}
    >
      {text}
    </NavLink>
  );
};

const HoteldetailedviewOutlet = () => {
  let { hotelid } = useParams();
  let [hotel, sethotel] = useState(null);
  let { showMessages } = useGlobalMessageContext();

  let FetchHotelData = async () => {
    if (!hotelid || hotelid.length < 16) {
      return showMessages("Hotel Id Not Found", "reject");
    }

    try {
      let res = await api.get(`/hotel/gethotel/${hotelid}`);

      sethotel(res?.data.hotel);
    } catch (err) {
      if (err) {
        showMessages(
          err?.response.data.message ||
            err?.response.message ||
            "internal server error",
        );
      }
    }
  };

  useEffect(() => {
    FetchHotelData();
  }, []);
  return (
    <div className={styles.hoteldetailedviewholder}>
      <div className={styles.detailedviewsecondarynavbar}>
       <SecondaryNavlink path={`/admin/hotels/i/${hotel?._id}`} end text="Overview"/>
       <SecondaryNavlink path={`/admin/hotels/i/${hotel?._id}/staffmanagement`}  text="Staff Management"/>
       <SecondaryNavlink path={`/admin/hotels/i/${hotel?._id}/contactinfo`}  text="Contacts"/>
       <SecondaryNavlink path={`/admin/hotels/i/${hotel?._id}/policies`}  text="Policies"/>
      </div>

      <div className={styles.detailedviewcontentholder}>
        <div className={styles.detailedviewcontentholderscroler}>
        <HotelContext.Provider value={{hotel,FetchHotelData}}>
        <Outlet/>

        </HotelContext.Provider>
        </div>
      </div>
    </div>
  );
};


export const useHotelData = ()=>{
    return useContext(HotelContext)
}
export default HoteldetailedviewOutlet;
