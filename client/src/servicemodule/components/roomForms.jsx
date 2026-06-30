import { memo, useEffect, useState } from "react";
import styles1 from "../css/reservationform.module.css";
import styles from "../css/roomform.module.css";
import { RxCross1 } from "react-icons/rx";
import { data, useParams } from "react-router";
import { useGlobalMessageContext } from "../../Globalmessage/components/globalmessage";
import api from "../../axios/axios";
import GuestCard from "./guestCard";
import { Input } from "./reservationforms.jsx";
import { useRoomEditContext } from "./roomeditdatacontext.jsx";


const CreateRoomsform = ({ onexit = () => {}, categoryData = {} ,fetch=()=>{}}) => {
  let [loading, setLoading] = useState(false);
  let [errors, setErrors] = useState({});
  let [formData, setFormData] = useState({});
  let { hotelid } = useParams();
  let { showMessages } = useGlobalMessageContext();
  let [changes, setchanges] = useState(false);
  let{editData,setEditData}=useRoomEditContext()
  let isEditData= Object.keys(editData).length>0

  let CreateRoom = async () => {
    if (loading) return;

    let controller = new AbortController()

    setLoading(true)
    let error = {};

    Object.keys(formData).forEach((key) => {
      let { value, isRequired } = formData[key];

      if (!value && isRequired) {
        error = {
          ...error,
          [key]: "Do not leave the required field empty",
        };
      }

      if (
        key == "roomNumber" &&
        (value === "" || !Number.isInteger(Number(value)) || Number(value) < 0)
      ) {
        error = {
          ...error,
          [key]: "This must be positive integer",
        };
      }

      if (
        key == "pax" &&
        (value === "" || !Number.isInteger(Number(value)) || Number(value) < 0)
      ) {
        error = {
          ...error,
          [key]: "This must be positive integer",
        };
      }

      if (
        key == "floor" &&
        (value === "" || !Number.isInteger(Number(value)))
      ) {
        error = {
          ...error,
          [key]: "This must be a integer",
        };
      }
    });


    setErrors(error);

    if(Object.keys(error).length===0){
     let formdata = new FormData();
     Object.keys(formData).forEach((key)=>{
      let{value,isRequired}=formData[key]
      formdata.append(key,value)
     })

     try{
      let res = await api.post(`/room/create/${hotelid}`,formdata);

      if(res?.status===201){
        showMessages(res.data?.message,"success")
        fetch(controller)
        onexit()
      }
      

     }catch(err){
      if(err){
        showMessages(err.response?.data.message||"Internal Server Error","reject")
      }
     }




    }
    setLoading(false)
  };
  let EditRoom = async () => {
    if (loading) return;

    let controller = new AbortController()

    setLoading(true)
    let error = {};

    Object.keys(editData).forEach((key) => {
      let { value, isRequired } = editData[key];

      if (!value && isRequired) {
        error = {
          ...error,
          [key]: "Do not leave the required field empty",
        };
      }

      if (
        key == "roomNumber" &&
        (value === "" || !Number.isInteger(Number(value)) || Number(value) < 0)
      ) {
        error = {
          ...error,
          [key]: "This must be positive integer",
        };
      }

      if (
        key == "pax" &&
        (value === "" || !Number.isInteger(Number(value)) || Number(value) < 0)
      ) {
        error = {
          ...error,
          [key]: "This must be positive integer",
        };
      }

      if (
        key == "floor" &&
        (value === "" || !Number.isInteger(Number(value)))
      ) {
        error = {
          ...error,
          [key]: "This must be a integer",
        };
      }
    });


    setErrors(error);

    if(Object.keys(error).length===0){
     let formdata = new FormData();
     let roomid = null
     Object.keys(editData).forEach((key)=>{
       let{value,isRequired}=editData[key]
      if(key!=="id"){
        formdata.append(key,value)

      }
      else if(key=="id"){
        roomid=value
      }
     })

     try{
      let res = await api.put(`/room/edit/${roomid}`,formdata);

      if(res?.status===200){
        showMessages(res.data?.message,"success")
        fetch(controller)
        onexit()
        setEditData({})
       
      }
      

     }catch(err){
      if(err){
        showMessages(err.response?.data.message||"Internal Server Error","reject")
      }
     }




    }
    setLoading(false)
  };

  return (
    <div className={styles1.reservationformcontainer}>
      <div className={styles1.reservationform}>
        <div className={styles1.reservationformheader}>
          <div className={styles1.titleandsubtitle}>
            <div className={styles1.title}>Create Rooms</div>
            <div className={styles1.subtitle}>
              Fill Up This Form To Create The Reservation
            </div>
          </div>
          <div className={styles1.exitbtn} onClick={()=>{
            if(Object.keys(editData).length>0){
              setEditData({})
            }
            onexit()
            }}>
            <RxCross1 />
          </div>
        </div>
        <div className={styles.formpartitionindicator}></div>

        <div className={styles1.formcontainer}>
          <div className={styles.formrow}>
            <Input
              label="Room Number"
              required
              Name="roomNumber"
              placeholder=" Enter Room Number"
              setData={isEditData?setEditData:setFormData}
              changes={changes}
              errors={errors}
              value={isEditData?editData.roomNumber?.value:formData.roomNumber?.value}
            />
            <Input
              type="select"
              label="Room Category"
              required
              Name="roomCategory"
              setData={isEditData?setEditData:setFormData}
              changes={changes}
              errors={errors}
              value={isEditData?editData.roomCategory?.value:formData.roomCategory?.value}
            >
              <option value="">--Select One--</option>
              {categoryData &&
                Object.keys(categoryData).map((category, index) => {
                  let { name, maxPax, baseRate } = categoryData[category];
                  return (
                    <option
                      value={category}
                      key={index}
                    >{`${name} . Rs.${baseRate} . ${maxPax} Pax`}</option>
                  );
                })}
            </Input>
            <Input
              label="Floor"
              required
              Name="floor"
              placeholder=" Enter Floor"
              setData={isEditData?setEditData:setFormData}
              changes={changes}
              errors={errors}
              value={isEditData?editData.floor?.value:formData.floor?.value}
            />
          </div>
          <div className={styles.formrow}>
            <Input
              label="Description:"
              Name="description"
              placeholder=" Enter description"
              setData={isEditData?setEditData:setFormData}
              changes={changes}
              errors={errors}
              value={isEditData?editData.description?.value:formData.description?.value}
            />
          </div>
          <div className={styles.formrow}>
            <Input
              label="Override Price"
              Name="priceOverride"
              placeholder=" Enter Override Price"
              changes={changes}
              errors={errors}
              setData={isEditData?setEditData:setFormData}
              value={isEditData?editData.priceOverride?.value || 0:formData.priceOverride?.value||0}
            />
            <Input
              label="Pax:"
              Name="pax"
              placeholder=" Enter PAX"
              setData={isEditData?setEditData:setFormData}
              changes={changes}
              errors={errors}
              value={isEditData?editData.pax?.value||0:formData.pax?.value||0}
            />
          </div>

          <div className={styles.formrow}>
            <Input
              type="select"
              label="Status:"
              required
              Name="status"
              setData={isEditData?setEditData:setFormData}
              changes={changes}
              errors={errors}
              value={isEditData?editData.status?.value:formData.status?.value}
            >
              <option value="">--select one--</option>
              <option value="available">Available</option>
              <option value="occupied">occupied</option>
              <option value="maintainance">Under Maintainance</option>
              <option value="cleaning">Cleaning</option>
              <option value="blocked">Blocked</option>
            </Input>
            <Input
              type="select"
              label="Active Status:"
              required
              Name="isActive"
              setData={isEditData?setEditData:setFormData}
              changes={changes}
              errors={errors}
              value={isEditData?editData.isActive?.value:formData.isActive?.value}
            >
              <option value="">--select one--</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </Input>
            <Input
              label="Room Size (in sqft):"
              Name="roomSize"
              placeholder=" Enter Room Size"
              setData={isEditData?setEditData:setFormData}
              changes={changes}
              errors={errors}
              value={isEditData?editData.roomSize?.value:formData.roomSize?.value}
            />
          </div>
        </div>

        <div className={styles1.bottombuttonsholder}>
          <div
            className={`${styles1.formbtn} ${styles1.backbtn} ${Object.keys(formData).length >= 1 ? `${styles1.formbackbtnenable}` : `${styles1.formbackbtndisable}`}`}
            onClick={() => {
              if (Object.keys(formData).length >= 1) {
                setFormData({});
                setchanges(!changes);
              }
            }}
          >
            Clear
          </div>

          <div
            className={`${styles1.formbtn} ${loading ? styles1.submitbtnloading : styles1.formsubmitbtn}`}
            onClick={()=>{
              if(isEditData){
                EditRoom()

              }
              else{
                CreateRoom()

              }
              
            
            }}
          >
            {loading ? <div className={styles1.loader}></div> : isEditData?"Edit Room": "Create Room"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRoomsform;
