import { createContext, useContext, useEffect, useRef, useState } from "react";
import { Input } from "../../components/reservationforms";
import "../../css/contentholder.css";
import styles from "../../css/roomcategory.module.css";
import api from "../../../axios/axios";
import { useNavigate, useParams } from "react-router";
import { useGlobalMessageContext } from "../../../Globalmessage/components/globalmessage";
import { LuBedDouble } from "react-icons/lu";
import { RiVipCrownLine } from "react-icons/ri";
import { TbTag } from "react-icons/tb";
import { RxPeople } from "react-icons/rx";
import { FiEdit2 } from "react-icons/fi";
import { MdOutlineDelete } from "react-icons/md";
import SkeletonLoader from "../../../loader/loaders";

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
let CategoryForm = ({ fetch = () => {} }) => {
  let [data, setData] = useState({});
  let [loading, setLoading] = useState(false);
  let [errors, setErrors] = useState({});
  let [changes, setchanges] = useState(true);
  let { hotelid } = useParams();
  let { showMessages } = useGlobalMessageContext();
  let { editData, setEditData } = useContext(EditContext);
  let navigate = useNavigate();

  useEffect(() => {
    if (!hotelid) {
      navigate(-1);
    }
  }, []);

  let CreateCategory = async () => {
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
      if (!value && isRequired) {
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
    });

    if (Object.keys(error) == 0) {
      let newForm = new FormData();

      Object.keys(data).forEach((key) => {
        let { value, isRequired } = data[key];
        newForm.append(key, value);
      });

      try {
        let res = await api.post(`/roomcategory/create/${hotelid}`, newForm);

        if (res.status === 201) {
          showMessages(res?.data.message, "success");
          fetch();
          setData({});
          setchanges(!changes);
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
      if (!value && isRequired) {
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
    });

    if (Object.keys(error) == 0) {
      let newForm = new FormData();

      Object.keys(editData).forEach((key) => {
        let { value, isRequired } = editData[key];
        if (key !== "id") {
          newForm.append(key, value);
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
    <div className={styles.CategoryForm}>
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
        data={changes}
      />
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
        data={changes}
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
        data={changes}
      />
      <Input
        placeholder="4"
        type="number"
        label="Max Pax:"
        Name="maxPax"
        required
        setData={Object.keys(editData).length > 0 ? setEditData : setData}
        value={
          Object.keys(editData).length == 0
            ? data.maxPax?.value
            : editData.maxPax?.value
        }
        errors={errors}
        data={changes}
      />
      <Input
        type="select"
        label="isActive:"
        Name="isActive"
        required
        value={
          Object.keys(editData).length == 0
            ? data.isActive?.value || 1
            : editData.isActive?.value
        }
        setData={Object.keys(editData).length > 0 ? setEditData : setData}
        errors={errors}
        data={changes}
      >
        <option value="">---select--</option>
        <option value="true">True</option>
        <option value="false">False</option>
      </Input>
      <div
        className={styles.Createbtn}
        onClick={() => {
          if (!loading && Object.keys(editData).length == 0) {
            CreateCategory();
          } else if (!loading && Object.keys(editData).length > 0) {
            EditCategory();
          }
        }}
      >
        {Object.keys(editData).length > 0 ? "Edit" : "Create"}
      </div>

      <div
        className={styles.cancelbtn}
        onClick={() => {
          setData({});
          setEditData({});
          setErrors({});
          setchanges(!changes);
        }}
      >
        Cancel
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
  let lastElementRef = useRef(null)

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
      <div className={styles.categoryheading}>Room Categories Management</div>
      <div className={styles.categorysubheading}>
        Create, edit and manage the room categories in this page
      </div>
      <EditContext.Provider value={{ editData, setEditData }}>
        <CategoryForm fetch={FetchCategories} />
      </EditContext.Provider>

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
              <div className={styles.categorycard} key={category._id} ref={lastElementRef}>
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
                        onClick={() => {
                          let {
                            name,
                            description,
                            baseRate,
                            maxPax,
                            isActive,
                            hotel,
                            _id,
                          } = category;
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
                              value: isActive,
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
                          });
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
    </>
  );
};

export default Roomcategory;
