
import { useState } from "react";
import AddHotelFrom from "../components/AddHotelFrom";
import styles from "../css/hotel.module.css"
import Topbuttonholder, { Button } from "../components/topbuttonholder";



const Hotel = () => {
  let [hotelform,setHotelForm]=useState(false)
  

  return (
 <>

<Topbuttonholder heading="Organization Management" subheading="Manage all the organizations from this platform ">
  <Button classname="addbtn" onclick={()=>{setHotelForm(true)}} name="Add Organization"/>
</Topbuttonholder>
     
      
     {hotelform && <AddHotelFrom onclose={()=>{setHotelForm(false)}}/>}
    </>
  );
};

export default Hotel;
