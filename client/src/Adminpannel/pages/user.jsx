import { createContext, useContext, useEffect, useState } from "react";
import AddHotelFrom, { EditHotelFrom } from "../components/AddHotelFrom";
import styles from "../css/hotel.module.css";
import Topbuttonholder, { Button } from "../components/topbuttonholder";

import { BsThreeDots } from "react-icons/bs";
import { MdDeleteOutline } from "react-icons/md";

import { IoEyeOutline } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";
import api from "../../axios/axios";
import { useGlobalMessageContext } from "../../Globalmessage/components/globalmessage";
import { formatDate } from "../components/dateformatter";
import { useConfirmationMessageContext } from "../../forms/components/confirmationmessage";
import { useNavigate } from "react-router";
import SkeletonLoader from "../../loader/loaders";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";

let FetchDataContext = createContext(null);

const TableRowSkeletonLoader = ()=>{
  return (
    <>

      <tr>
  <td>
    <SkeletonLoader
      style={{
        width: "22px",
        height: "16px",
        borderRadius: "5px",
      }}
    />
  </td>

  <td>
    <div className={styles.imageholder}>
      <SkeletonLoader
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "8px",
        }}
      />
    </div>
  </td>

  <td>
    <SkeletonLoader
      style={{
        width: "140px",
        height: "16px",
        borderRadius: "6px",
      }}
    />
  </td>

  <td>
    <div className={styles.ownerholder}>
      <div className={styles.ownerimage}>
        <SkeletonLoader
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
          }}
        />
      </div>

      <SkeletonLoader
        style={{
          width: "95px",
          height: "16px",
          borderRadius: "6px",
        }}
      />
    </div>
  </td>

  <td>
    <SkeletonLoader
      style={{
        width: "95px",
        height: "16px",
        borderRadius: "6px",
      }}
    />
  </td>

  <td>
    <div className={styles.category}>
      <SkeletonLoader
        style={{
          width: "60px",
          height: "14px",
          borderRadius: "6px",
        }}
      />
    </div>
  </td>

  <td>
    <SkeletonLoader
      style={{
        width: "78px",
        height: "30px",
        borderRadius: "20px",
      }}
    />
  </td>

  <td>
    <div className={styles.tableactionsholder}>
      <SkeletonLoader
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "8px",
        }}
      />

      <SkeletonLoader
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "8px",
        }}
      />

      <SkeletonLoader
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "8px",
        }}
      />
    </div>
  </td>
</tr>


  <tr>
  <td>
    <SkeletonLoader
      style={{
        width: "22px",
        height: "16px",
        borderRadius: "5px",
      }}
    />
  </td>

  <td>
    <div className={styles.imageholder}>
      <SkeletonLoader
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "8px",
        }}
      />
    </div>
  </td>

  <td>
    <SkeletonLoader
      style={{
        width: "140px",
        height: "16px",
        borderRadius: "6px",
      }}
    />
  </td>

  <td>
    <div className={styles.ownerholder}>
      <div className={styles.ownerimage}>
        <SkeletonLoader
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
          }}
        />
      </div>

      <SkeletonLoader
        style={{
          width: "95px",
          height: "16px",
          borderRadius: "6px",
        }}
      />
    </div>
  </td>

  <td>
    <SkeletonLoader
      style={{
        width: "95px",
        height: "16px",
        borderRadius: "6px",
      }}
    />
  </td>

  <td>
    <div className={styles.category}>
      <SkeletonLoader
        style={{
          width: "60px",
          height: "14px",
          borderRadius: "6px",
        }}
      />
    </div>
  </td>

  <td>
    <SkeletonLoader
      style={{
        width: "78px",
        height: "30px",
        borderRadius: "20px",
      }}
    />
  </td>

  <td>
    <div className={styles.tableactionsholder}>
      <SkeletonLoader
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "8px",
        }}
      />

      <SkeletonLoader
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "8px",
        }}
      />

      <SkeletonLoader
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "8px",
        }}
      />
    </div>
  </td>
</tr>


  <tr>
  <td>
    <SkeletonLoader
      style={{
        width: "22px",
        height: "16px",
        borderRadius: "5px",
      }}
    />
  </td>

  <td>
    <div className={styles.imageholder}>
      <SkeletonLoader
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "8px",
        }}
      />
    </div>
  </td>

  <td>
    <SkeletonLoader
      style={{
        width: "140px",
        height: "16px",
        borderRadius: "6px",
      }}
    />
  </td>

  <td>
    <div className={styles.ownerholder}>
      <div className={styles.ownerimage}>
        <SkeletonLoader
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
          }}
        />
      </div>

      <SkeletonLoader
        style={{
          width: "95px",
          height: "16px",
          borderRadius: "6px",
        }}
      />
    </div>
  </td>

  <td>
    <SkeletonLoader
      style={{
        width: "95px",
        height: "16px",
        borderRadius: "6px",
      }}
    />
  </td>

  <td>
    <div className={styles.category}>
      <SkeletonLoader
        style={{
          width: "60px",
          height: "14px",
          borderRadius: "6px",
        }}
      />
    </div>
  </td>

  <td>
    <SkeletonLoader
      style={{
        width: "78px",
        height: "30px",
        borderRadius: "20px",
      }}
    />
  </td>

  <td>
    <div className={styles.tableactionsholder}>
      <SkeletonLoader
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "8px",
        }}
      />

      <SkeletonLoader
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "8px",
        }}
      />

      <SkeletonLoader
        style={{
          width: "30px",
          height: "30px",
          borderRadius: "8px",
        }}
      />
    </div>
  </td>
</tr>
    </>
  )

}


const TableRow = ({
  sn = {},
  image={},
  id = {},
  name="",
  email="",
  registeredAt="",
  role="",
  providers={}
}) => {
  let [editHotelForm, setEditHotelForm] = useState(false);
  let { setConfirmationMessageData, clearMessage } =
    useConfirmationMessageContext();
  let { showMessages } = useGlobalMessageContext();
  let {fetchData} = useFetchFunction()
  let navigate = useNavigate()


  return (
    <>
      <tr id={id}>
        <td>{sn}.</td>
        <td>
          <div className={styles.imageholder}>
            <img src={image} alt="" />
          </div>
        </td>
        <td>{name}</td>
        <td>
          {email}
        </td>
        <td>{formatDate(registeredAt)}</td>
        <td>
          {" "}
          <div className={styles.category}>{role}</div>
        </td>
        <td>
         <div className={styles.authproviderholder}>
            {Object.entries(providers).map(([key,value],ind)=>{

              
               if(value){
                return (
                    <div className={styles.authprovider} key={ind}>
                        <MdOutlineKeyboardArrowRight/>
                        {key}
                      
                    </div>
                )
               }
            })}
           
         </div>
        </td>
        <td>
          <div className={styles.tableactionsholder}>
            
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

const Table = ({ info = [] }) => {
  return (
    <div className={styles.tableholder}>
      <table>
        <thead>
          <tr>
            <th>S.N</th>
            <th>Image</th>
            <th>User Name</th>
            <th>Email</th>
            <th>Registered At</th>
            <th>Role</th>
            <th>Providers</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {info.length > 0 &&
            info?.map((user, index) => {
              return (
                <TableRow
                  key={user._id}
                  sn={index + 1}
                  image={`${user.avatar}`}
                  name={user.Fullname}
                  id={user._id}
                  email={user.email}
                  registeredAt={user.createdAt}
                  role={user.role}
                  providers={user.authprovider}
                  
                />
              );
            })}

             {info.length === 0 && (
       <>
     <TableRowSkeletonLoader/>
       </>
      )}
        </tbody>
      </table>
     
    </div>
  );
};

const User= () => {
  
  let [users,setUsers] = useState([]);
  let { showMessages } = useGlobalMessageContext();

  let FetchUserData= async () => {
    try {
      let res = await api.get("/user/getalluser");

      if (res.status === 200) {
        console.log(res.data.users)
        setUsers(res?.data.users);
      }
    } catch (err) {
      showMessages(
        err.message || err.response?.message || "Unknown Error!",
        "reject",
      );
    }
  };

  useEffect(() => {
    FetchUserData();
  }, []);

  return (
    <>
      <FetchDataContext.Provider value={{ fetchData: FetchUserData }}>
        <Topbuttonholder
          heading="User Management"
          subheading="Manage all the Users from this platform "
        >
          
        </Topbuttonholder>

        <Table info={users} />

        
      </FetchDataContext.Provider>
    </>
  );
};

export const useFetchFunction = () => {
  return useContext(FetchDataContext);
};
export default User;
