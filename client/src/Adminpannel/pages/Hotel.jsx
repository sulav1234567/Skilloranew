import { createContext, useContext, useEffect, useState } from "react";
import AddHotelFrom, { EditHotelFrom } from "../components/AddHotelFrom";
import styles from "../css/hotel.module.css";
import Topbuttonholder, { Button } from "../components/topbuttonholder";
import hotelimage from "../../assets/heroimage.jpg";
import { BsThreeDots } from "react-icons/bs";

import { IoEyeOutline } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import api from "../../axios/axios";
import { useGlobalMessageContext } from "../../Globalmessage/components/globalmessage";
import { formatDate } from "../components/dateformatter";

let FetchDataContext = createContext(null);

const OrganizationCard = () => {
  return (
    <div className={styles.card}>
      <div className={styles.cardimageholder}>
        <img src={hotelimage} alt="" />

        <div className={styles.actionbtn}>
          <BsThreeDots />
        </div>
      </div>

      <div className={styles.hotelnameholder}>
        Lemon Tree Premier - Biratnagar Branch
      </div>
    </div>
  );
};

const TableRow = ({
  sn = {},
  image = {},
  orgname = {},
  createdAt = {},
  id = {},
  category = {},
  data = {},
}) => {
  let [editHotelForm, setEditHotelForm] = useState(false);

  return (
    <>
      <tr id={id}>
        <td>{sn}.</td>
        <td>
          <div className={styles.imageholder}>
            <img src={image} alt="" />
          </div>
        </td>
        <td>{orgname}</td>
        <td>
          <div className={styles.ownerholder}>
            <div className={styles.ownerimage}>
              <img src={hotelimage} alt="" />
            </div>
            <div className={styles.Ownername}>Sulav Khatiwada</div>
          </div>
        </td>
        <td>{createdAt}</td>
        <td>
          {" "}
          <div className={styles.category}>{category}</div>
        </td>
        <td>
          <div className={styles.activetag}>active</div>
        </td>
        <td>
          <div className={styles.tableactionsholder}>
            <div
              className={`${styles.tableactionbtn} ${styles.tablenormalaction}`}
            >
              <IoEyeOutline />
            </div>
            <div
              className={`${styles.tableactionbtn} ${styles.tablenormalaction}`}
              onClick={(e) => {
                e.stopPropagation();
                setEditHotelForm(true);
              }}
            >
              <MdModeEdit />
            </div>
          </div>
        </td>
      </tr>

      {editHotelForm && (
        <EditHotelFrom
          onclose={() => {
            setEditHotelForm(false);
          }}
          hoteldata={data}
        />
      )}
    </>
  );
};

const OrganizationTable = ({ info = [] }) => {
  return (
    <div className={styles.tableholder}>
      <table>
        <thead>
          <tr>
            <th>S.N</th>
            <th>Image</th>
            <th>Organization Name</th>
            <th>Owner</th>
            <th>Registered At</th>
            <th>Category</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {info?.map((org, index) => {
            return (
              <TableRow
                key={org._id}
                sn={index + 1}
                image={`${import.meta.env.VITE_BASE_URL}/uploads/${org.image.filename}`}
                orgname={org.name}
                createdAt={formatDate(org.createdAt)}
                id={org._id}
                category={org.category}
                data={org}
              />
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const Hotel = () => {
  let [hotelform, setHotelForm] = useState(false);
  let [hotels, setHotels] = useState([]);
  let { showMessages } = useGlobalMessageContext();

  let FetchHotelData = async () => {
    try {
      let res = await api.get("/hotel/getinfo");

      if (res.status === 200) {
        setHotels(res?.data.hotels);
      }
    } catch (err) {
      showMessages(
        err.message || err.response?.message || "Unknown Error!",
        "reject",
      );
    }
  };

  useEffect(() => {
    FetchHotelData();
  }, []);

  return (
    <>
      <FetchDataContext.Provider value={{ fetchData: FetchHotelData }}>
        <Topbuttonholder
          heading="Organization Management"
          subheading="Manage all the organizations from this platform "
        >
          <Button
            classname="addbtn"
            onclick={() => {
              setHotelForm(true);
            }}
            name="Add Organization"
          />
        </Topbuttonholder>

        <OrganizationTable info={hotels} />

        {hotelform && (
          <AddHotelFrom
            onclose={() => {
              setHotelForm(false);
            }}
          />
        )}
      </FetchDataContext.Provider>
    </>
  );
};

export const useFetchFunction = () => {
  return useContext(FetchDataContext);
};
export default Hotel;
