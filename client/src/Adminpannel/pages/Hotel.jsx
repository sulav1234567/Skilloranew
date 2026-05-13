
import { useState } from "react";
import AddHotelFrom from "../components/AddHotelFrom";



const Hotel = () => {

  let [hotelform,setHotelForm]=useState(false)
  

  return (
    <div>
      <button onClick={()=>{setHotelForm(true)}}>add hotel</button>
     {hotelform && <AddHotelFrom onclose={()=>{setHotelForm(false)}}/>}
    </div>
  );
};

export default Hotel;
