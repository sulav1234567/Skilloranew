import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Input } from "../../components/reservationforms";
import "../../css/contentholder.css";
import styles from "../../css/roomcategory.module.css";
import styles1 from "../../css/reservationform.module.css";
import api from "../../../axios/axios";
import { useNavigate, useParams } from "react-router";
import { useGlobalMessageContext } from "../../../Globalmessage/components/globalmessage";
import { LuBedDouble } from "react-icons/lu";
import { RiVipCrownLine } from "react-icons/ri";
import { TbTag } from "react-icons/tb";
import { RxPeople, RxCross1 } from "react-icons/rx";
import { FiEdit2 } from "react-icons/fi";
import { MdOutlineDelete } from "react-icons/md";
import SkeletonLoader from "../../../loader/loaders";
import { useScrollTopContext } from "./roommanagementOutlet";


let EditContext = createContext();
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

let Amenities = ({
  setData = () => {},
  value = [],
  errors = {},
  changes = "",
}) => {
  let [amen, setAmen] = useState([]);
  let [loading, setLoading] = useState(false);
  let { showMessages } = useGlobalMessageContext();

  const handleChange = (e) => {
    const selectedAmenity = e.target.value;

    if (!selectedAmenity) return;

    setData((prev) => {
      const oldAmenities = Array.isArray(prev.amenities?.value)
        ? prev.amenities.value
        : [];

      if (oldAmenities.includes(selectedAmenity)) {
        return prev;
      }

      return {
        ...prev,
        amenities: {
          ...prev.amenities,
          isRequired: true,
          value: [...oldAmenities, selectedAmenity],
        },
      };
    });

    e.target.value = "";
  };

  const removeAmenity = (amenity) => {
    setData((prev) => {
      const oldAmenities = Array.isArray(prev.amenities?.value)
        ? prev.amenities.value
        : [];

      return {
        ...prev,
        amenities: {
          ...prev.amenities,
          isRequired: true,
          value: oldAmenities.filter((a) => a !== amenity),
        },
      };
    });
  };

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        value: Array.isArray(value) ? value : [],
        isRequired: true,
      },
    }));
  }, [changes]);

  let fetchAmen = async () => {
    if (loading) return;
    setLoading(true);

    try {
      let res = await api.get("/roomcategory/getamenenum");

      if (res.status === 200) {
        setAmen(res.data.enum);
      }
    } catch (err) {
      showMessages(
        err?.response?.data?.message || "Internal server error",
        "reject"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAmen();
  }, []);

  return (
    <>
     <div className={styles.amenitiescardholder}>
  {value.length > 0 &&
    value.map((val) => {
      return (
        <div key={val} className={styles.amencard}>
          <span>{val}</span>

          <button
            type="button"
            className={styles.removeamenbtn}
            onClick={() => removeAmenity(val)}
          >
            <RxCross1 />
          </button>
        </div>
      );
    })}
</div>

      <div className={styles1.formrow}>
        <div className={styles1.forminputholder}>
          <div className={styles1.forminputlabelandreqtag}>
            <div className={styles1.formlabel}>Amenities:</div>
            <div className={styles1.requiredTag}>*</div>
          </div>

          <div className={styles1.inperror}>
            {errors?.amenities && errors.amenities}
          </div>

          <select onChange={handleChange}>
            <option value="">--choose--</option>

            {amen
              .filter((a) => !value.includes(a))
              .map((a) => (
                <option key={a} value={a}>
                  {a}
                </option>
              ))}
          </select>
        </div>
      </div>
    </>
  );
};

let CategoryForm = ({ fetch = () => {}, onexit = () => {} }) => {
  let [data, setData] = useState({});
  let [loading, setLoading] = useState(false);
  let [errors, setErrors] = useState({});
  let [changes, setchanges] = useState(true);
  let { hotelid } = useParams();
  let { showMessages } = useGlobalMessageContext();
  let { editData, setEditData } = useContext(EditContext);
  let { scrollTop, setScrollTop } = useScrollTopContext();
  let navigate = useNavigate();

  useEffect(() => {
    if (!hotelid) {
      navigate(-1);
    }
  }, []);
  let CreateCategory = async () => {
    if (loading) return;
    setLoading(true);
    if (!hotelid) {
      showMessages("hotel id not found", "reject");
      setLoading(false);
      return;
    }
    let toBoolean = (val) => {
      return val === "true";
    };
    let isBoolean = (val) => {
      return val === "true" || val === "false" || val === true || val === false;
    };
    let error = {};
    Object.keys(data).forEach((key) => {
      let { value, isRequired } = data[key];
      if (!value && isRequired && key!=="amenities") {

        error = {
          ...error,
          [key]: "Enter the data",
        };
      }

      if (
        (key == "baseRate" || key == "maxPax") &&
        isNaN(Number.parseInt(value))
      ) {
        error = {
          ...error,
          [key]: "Invalid Value",
        };
      }

      if (key == "maxPax" && value && value <= 0) {
        error = {
          ...error,
          [key]: "Range: >0",
        };
      }

      if (key == "isActive" && !isBoolean(value)) {
        error = {
          ...error,
          [key]: "Invalid Boolean",
        };
      }

      if(key=="amenities" && isRequired && value.length===0){
        error ={
          ...error,
          [key]:"do not leave the amenities empty"
        }

      }
    });

    if (Object.keys(error) == 0) {
      let newForm = new FormData();

      Object.keys(data).forEach((key) => {
        let { value, isRequired } = data[key];
         if (key!=="amenities") {
          newForm.append(key, value);
        }
        if(key=="amenities"){
          value.forEach((val)=>{
            newForm.append(key,val)
          })
        }
       
      });

      try {
        let res = await api.post(`/roomcategory/create/${hotelid}`, newForm);

        if (res.status === 201) {
          showMessages(res?.data.message, "success");
          fetch();
          setData({});
          setchanges(!changes);
          onexit();
        }
      } catch (err) {
        if (err) {
          showMessages(
            err.response?.data.message || "internal server error",
            "reject",
          );
        }
      }
    }

    setErrors(error);
    setLoading(false);
  };

  let EditCategory = async () => {
    if (loading) return;
    setLoading(true);
    if (!editData.hotelid?.value) {
      showMessages("hotel id not found", "reject");
      setLoading(false);
      return;
    }
    let toBoolean = (val) => {
      return val === "true";
    };
    let isBoolean = (val) => {
      return val === "true" || val === "false" || val === true || val === false;
    };
    let error = {};
    Object.keys(editData).forEach((key) => {
      let { value, isRequired } = editData[key];
      if (!value && isRequired && key!="amenities") {
        error = {
          ...error,
          [key]: "Enter the data",
        };
      }

      if (
        (key == "baseRate" || key == "maxPax") &&
        isNaN(Number.parseInt(value))
      ) {
        error = {
          ...error,
          [key]: "Invalid Value",
        };
      }

      if (key == "maxPax" && value && value <= 0) {
        error = {
          ...error,
          [key]: "Range: >0",
        };
      }

      if (key == "isActive" && !isBoolean(value)) {
        error = {
          ...error,
          [key]: "Invalid Boolean",
        };
      }
       if(key=="amenities" && isRequired && value.length===0){
        error ={
          ...error,
          [key]:"do not leave the amenities empty"
        }

      }
    });

    if (Object.keys(error) == 0) {
      let newForm = new FormData();

      Object.keys(editData).forEach((key) => {
        let { value, isRequired } = editData[key];
        if (key !== "id" && key!=="amenities") {
          newForm.append(key, value);
        }
        if(key=="amenities"){
          value.forEach((val)=>{
            newForm.append(key,val)
          })
        }
      });

      try {
        let res = await api.put(
          `/roomcategory/edit/${editData.id.value}`,
          newForm,
        );

        if (res.status === 200) {
          showMessages(res?.data.message, "success");
          fetch();
          setData({});
          setEditData({});
          setchanges(!changes);
          onexit();
        }
      } catch (err) {
        if (err) {
          showMessages(
            err.response?.data.message || "internal server error",
            "reject",
          );
        }
      }
    }

    setErrors(error);
    setLoading(false);
  };

  return (
    // <div
    //   className={styles.CategoryForm}
    //   style={{
    //     position:
    //       Object.keys(editData).length == 0 || !editData
    //         ? "static"
    //         : "absolute",

    //     top:
    //       Object.keys(editData).length == 0 || !editData
    //         ? "0px"
    //         : `${scrollTop + 150}px`,
    //     width:
    //       Object.keys(editData).length == 0 || !editData
    //         ? "100%"
    //         : `calc(100% - 60px)`,
    //   }}
    // >
    //   <Input
    //     placeholder="eg. Delux-x0"
    //     label="Category Name:"
    //     Name="name"
    //     required
    //     setData={Object.keys(editData).length > 0 ? setEditData : setData}
    //     value={
    //       Object.keys(editData).length == 0
    //         ? data.name?.value
    //         : editData.name?.value
    //     }
    //     errors={errors}
    //     changes={changes}
    //   />
    //   <Input
    //     placeholder="This is the most luxurious category"
    //     Name="description"
    //     label="Description:"
    //     setData={Object.keys(editData).length > 0 ? setEditData : setData}
    //     value={
    //       Object.keys(editData).length == 0
    //         ? data.description?.value
    //         : editData.description?.value
    //     }
    //     errors={errors}
    //     changes={changes}
    //   />
    //   <Input
    //     placeholder="0"
    //     type="number"
    //     label="Base Rate:"
    //     Name="baseRate"
    //     required
    //     setData={Object.keys(editData).length > 0 ? setEditData : setData}
    //     value={
    //       Object.keys(editData).length == 0
    //         ? data.baseRate?.value
    //         : editData.baseRate?.value
    //     }
    //     errors={errors}
    //     changes={changes}
    //   />
    //   <Input
    //     placeholder="4"
    //     type="number"
    //     label="Max Pax:"
    //     Name="maxPax"
    //     required
    //     setData={Object.keys(editData).length > 0 ? setEditData : setData}
    //     value={
    //       Object.keys(editData).length == 0
    //         ? data.maxPax?.value
    //         : editData.maxPax?.value
    //     }
    //     errors={errors}
    //     changes={changes}
    //   />
    //   <Input
    //     type="select"
    //     label="isActive:"
    //     Name="isActive"
    //     required
    //     value={
    //       Object.keys(editData).length == 0
    //         ? data.isActive?.value || 1
    //         : editData.isActive?.value
    //     }
    //     setData={Object.keys(editData).length > 0 ? setEditData : setData}
    //     errors={errors}
    //     changes={changes}
    //   >
    //     <option value="">---select--</option>
    //     <option value="true">True</option>
    //     <option value="false">False</option>
    //   </Input>
    //   <div
    //     className={`${styles.Createbtn} ${loading ? styles.loadingbtn : styles.activebtn}`}
    //     onClick={() => {
    //       if (!loading && Object.keys(editData).length == 0) {
    //         CreateCategory();
    //       } else if (!loading && Object.keys(editData).length > 0) {
    //         EditCategory();
    //       }
    //     }}
    //   >
    //     {loading ? (
    //       <div className={styles.loader}></div>
    //     ) : Object.keys(editData).length > 0 ? (
    //       "Edit"
    //     ) : (
    //       "Create"
    //     )}
    //   </div>

    //   <div
    //     className={`${styles.cancelbtn}`}
    //     onClick={() => {
    //       setData({});
    //       setEditData({});
    //       setErrors({});
    //       setchanges(!changes);
    //     }}
    //   >
    //     Cancel
    //   </div>
    // </div>
    <div className={styles1.reservationformcontainer}>
      <div className={styles1.reservationform}>
        <div className={styles1.reservationformheader}>
          <div className={styles1.titleandsubtitle}>
            <div className={styles1.title}>Create Rooms</div>
            <div className={styles1.subtitle}>
              Fill Up This Form To Create The Reservation
            </div>
          </div>
          <div
            className={styles1.exitbtn}
            onClick={() => {
              setEditData({});
              onexit();
            }}
          >
            <RxCross1 />
          </div>
        </div>
        <div className={styles.formpartitionindicator}></div>

        <div className={styles1.formcontainer}>
          <div className={styles.formrow}>
            <Input
              placeholder="eg. Delux-x0"
              label="Category Name:"
              Name="name"
              required
              setData={Object.keys(editData).length > 0 ? setEditData : setData}
              value={
                Object.keys(editData).length == 0
                  ? data.name?.value
                  : editData.name?.value
              }
              errors={errors}
              changes={changes}
            />
            <Input
              placeholder="0"
              type="number"
              label="Pax:"
              Name="maxPax"
              required
              setData={Object.keys(editData).length > 0 ? setEditData : setData}
              value={
                Object.keys(editData).length == 0
                  ? data.maxPax?.value
                  : editData.maxPax?.value
              }
              errors={errors}
              changes={changes}
            />
            <Input
              placeholder="0"
              type="number"
              label="Base Rate:"
              Name="baseRate"
              required
              setData={Object.keys(editData).length > 0 ? setEditData : setData}
              value={
                Object.keys(editData).length == 0
                  ? data.baseRate?.value
                  : editData.baseRate?.value
              }
              errors={errors}
              changes={changes}
            />

            <Input
              type="select"
              label="Active:"
              Name="isActive"
              required
              setData={Object.keys(editData).length > 0 ? setEditData : setData}
              value={
                Object.keys(editData).length == 0
                  ? data.isActive?.value
                  : editData.isActive?.value
              }
              errors={errors}
              changes={changes}
            >
              <option value="">---select One---</option>
              <option value="true">True</option>
              <option value="false">False</option>
            </Input>
          </div>
          <div className={styles.formrow}>
            <Input
              placeholder="This is the most luxurious category"
              Name="description"
              label="Description:"
              setData={Object.keys(editData).length > 0 ? setEditData : setData}
              value={
                Object.keys(editData).length == 0
                  ? data.description?.value
                  : editData.description?.value
              }
              errors={errors}
              changes={changes}
            />
          </div>
          <Amenities
            setData={Object.keys(editData).length > 0 ? setEditData : setData}
            value={
               Object.keys(editData).length == 0
                  ? data.amenities?.value
                  : editData.amenities?.value
            }
            errors={errors}
            changes={changes}
            
          />
        </div>

        <div className={styles1.bottombuttonsholder}>
          <div
            className={`${styles1.formbtn} ${styles1.backbtn} ${Object.keys(data).length >= 1 ? `${styles1.formbackbtnenable}` : `${styles1.formbackbtndisable}`}`}
            onClick={() => {
              setData({});
              setchanges(!changes);
            }}
          >
            Clear
          </div>

          <div
            className={`${styles1.formbtn} ${loading ? styles1.submitbtnloading : styles1.formsubmitbtn}`}
            onClick={() => {
              Object.keys(editData).length === 0
                ? CreateCategory()
                : EditCategory();
            }}
          >
            {loading ? (
              <div className={styles1.loader}></div>
            ) : Object.keys(editData).length === 0 ? (
              "Create Room"
            ) : (
              "Edit"
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Roomcategory = () => {
  let { showMessages } = useGlobalMessageContext();
  let [loading, setLoading] = useState(false);
  let { hotelid } = useParams();
  let [roomCategories, setRoomCategories] = useState(null);
  let [editData, setEditData] = useState({});
  let lastElementRef = useRef(null);
  let navigate = useNavigate()
  let [showForm, setShowForm] = useState(false);

  let FetchCategories = async () => {
    if (!hotelid || loading) {
      return;
    }

    try {
      setLoading(true);
      let res = await api.get(`/roomcategory/getall/${hotelid}`);

      if (res?.status === 200) {
        setRoomCategories(res.data?.roomcategory);
      }
    } catch (err) {
      if (err) {
        showMessages(err?.response?.data.message, "reject");
      }
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    FetchCategories();
  }, []);
  return (
    <>
      <div className={styles.mainwrapper}>
        <div className={styles.wrapper}>
          <div className={styles.categoryheading}>
            Room Categories Management
          </div>
          <div className={styles.categorysubheading}>
            Create, edit and manage the room categories in this page
          </div>
        </div>
        <div
          className={`${styles.Createbtn} ${loading ? styles.loadingbtn : styles.activebtn}`}
          onClick={() => {
            setShowForm(true);
          }}
        >
          Create
        </div>
      </div>

      <div className={styles.categorycardsholder}>
        {!roomCategories && (
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
        {roomCategories &&
          roomCategories?.map((category) => {
            return (
              <div
                className={styles.categorycard}
                key={category._id}
                ref={lastElementRef}
                onClick={()=>{
                 navigate(`/services/${hotelid}/roommanagement/category/i?CI=${category._id}`)
                }}
              >
                <div className={styles.wrappertwoitem}>
                  <div className={styles.categorycardheader}>
                    <div
                      className={styles.categoryicon}
                      style={{
                        backgroundColor: ["vip", "royal", "presidential"].some(
                          (word) =>
                            category?.name?.trim().toLowerCase().includes(word),
                        )
                          ? ColorAndIcons.Vip.color.background
                          : ColorAndIcons.Bed.color.background,
                      }}
                    >
                      {["vip", "royal", "presidential"].some((word) =>
                        category?.name?.trim().toLowerCase().includes(word),
                      )
                        ? ColorAndIcons.Vip.icon
                        : ColorAndIcons.Bed.icon}
                    </div>
                    <div className={styles.categoryname}>{category.name}</div>

                    <div className={styles.actionbtnholdercatcard}>
                      <div
                        className={styles.actionbtncatcard}
                        onClick={(e) => {
                          e.stopPropagation()
                          let {
                            name,
                            description,
                            baseRate,
                            maxPax,
                            isActive,
                            hotel,
                            _id,
                            amenities
                          } = category;
                          console.log(category);
                          setEditData({
                            name: {
                              value: name,
                              isRequired: true,
                            },
                            description: {
                              value: description,
                              isRequired: false,
                            },
                            baseRate: {
                              value: baseRate,
                              isRequired: true,
                            },
                            maxPax: {
                              value: maxPax,
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
                            amenities:{
                              value:amenities,
                              isRequired:true
                            }
                          });
                          setShowForm(true);
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
                    {category.description.trim() == ""
                      ? "No description Added Yet."
                      : category.description}
                  </div>
                </div>
                <div className={styles.cardfooter}>
                  <div className={styles.footerwrapper}>
                    <div className={styles.footerinfoholder}>
                      <div className={styles.iconcategorycard}>
                        <TbTag />
                      </div>
                      <div className={styles.footercategorycardtext}>
                        B Rate: Rs.{category.baseRate}
                      </div>
                    </div>
                    <div className={styles.footerinfoholder}>
                      <div className={styles.iconcategorycard}>
                        <RxPeople />
                      </div>
                      <div className={styles.footercategorycardtext}>
                        {category.maxPax} Pax
                      </div>
                    </div>
                  </div>
                  <div
                    className={`${styles.statustag} ${category.isActive == true ? styles.statustagactive : styles.statustaginactive}`}
                  >
                    {category.isActive == true ? "Active" : "Inactive"}
                  </div>
                </div>
              </div>
            );
          })}
      </div>
      <EditContext.Provider value={{ editData, setEditData }}>
        {showForm && !loading && (
          <CategoryForm
            onexit={() => {
              setShowForm(false);
            }}
            fetch={FetchCategories}
          />
        )}
      </EditContext.Provider>
    </>
  );
};

export default Roomcategory;
