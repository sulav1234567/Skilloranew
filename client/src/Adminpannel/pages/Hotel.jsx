
import { useState } from "react";
import AddHotelFrom from "../components/AddHotelFrom";
import styles from "../css/hotel.module.css"
import Topbuttonholder, { Button } from "../components/topbuttonholder";
import hotelimage from "../../assets/heroimage.jpg"
import { BsThreeDots } from "react-icons/bs";

import { IoEyeOutline } from "react-icons/io5";
import { MdModeEdit } from "react-icons/md";


const OrganizationCard=()=>{
  return (
    <div className={styles.card}>
    <div className={styles.cardimageholder}>
      <img src={hotelimage} alt="" />

      <div className={styles.actionbtn}>
        <BsThreeDots/>

      </div>
    </div>

    <div className={styles.hotelnameholder}>Lemon Tree Premier - Biratnagar Branch</div>

  
  </div>
  )
}

const OrganizationTable=()=>{
  return(
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
          <tr>
            <td>1.</td>
            <td><div className={styles.imageholder}>
              <img src={hotelimage} alt="" />
              </div></td>
              <td>
                Lemon Tree Premier - Biratnagar Branch
              </td>
              <td><div className={styles.ownerholder}>
                <div className={styles.ownerimage}>
                  <img src={hotelimage} alt="" />
                </div>
                <div className={styles.Ownername}>
                  Sulav Khatiwada
                </div>
                </div></td>
                <td>7th april 2026</td>
                <td>Hotel</td>
                <td><div className={styles.activetag}>active</div></td>
                <td>
                  <div className={styles.tableactionsholder}>
                    <div className={`${styles.tableactionbtn} ${styles.tablenormalaction}`}>
                      <IoEyeOutline/>

                    </div>
                    <div className={`${styles.tableactionbtn} ${styles.tablenormalaction}`}>
                      <MdModeEdit/>

                    </div>
                  </div>
                </td>
          </tr>

        </tbody>
      </table>
    </div>
  )
}

const Hotel = () => {
  let [hotelform,setHotelForm]=useState(false)
  

  return (
 <>

<Topbuttonholder heading="Organization Management" subheading="Manage all the organizations from this platform ">
  <Button classname="addbtn" onclick={()=>{setHotelForm(true)}} name="Add Organization"/>
</Topbuttonholder>

 <OrganizationTable/>
     
      
     {hotelform && <AddHotelFrom onclose={()=>{setHotelForm(false)}}/>}
    </>
  );
};

export default Hotel;
