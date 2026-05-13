import { useState, useEffect } from "react";
import FormContainer, {
  FormFileInput,
  FormInput,
  FormRow,
  ToggleRowForm,
} from "../../forms/components/FormContainer";
import styles from "../css/hotel.module.css";
import { RxCross2 } from "react-icons/rx";

import { useGlobalMessageContext } from "../../Globalmessage/components/globalmessage";
import { nepalProvinceCities } from "../components/nepalcities";
import { emailRegex, phoneRegex, websiteRegex } from "./regex";
import api from "../../axios/axios";

let data = {
  category: ["hotel", "resort", "guest-house", "homestay", "resturant"],
  amenities: [
    "wifi",
    "parking",
    "swimming-pool",
    "restaurant",
    "bar",
    "gym",
    "spa",
    "airport-shuttle",
    "room-service",
    "laundry",
    "ac",
    "hot-water",
    "tv",
  ],
};
const AddHotelFrom = ({onclose}) => {
  let [amenities, setAmenities] = useState([]);
  let [location, setLocation] = useState({ latitude: "", longitude: "" });
  let { showMessages } = useGlobalMessageContext();
  let [province, setProvince] = useState("");
  let[formerror,setFormError]=useState({})
  const getlocation = () => {
    if (!navigator.geolocation) {
      showMessages("Location is not supported by this device", "reject");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        console.log("New location:", latitude, longitude);

        setLocation({
          latitude,
          longitude,
        });

        showMessages("Location fetched successfully", "success");
      },
      (error) => {
        showMessages(error.message, "reject");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      },
    );
  };

  
    
  
  const onSubmit = async(data, setLoading) => {
  let errors = {};

  Object.keys(data).forEach((key) => {
    const { value, isrequired, type } = data[key];

   
    if (isrequired && (value === "" || value === null || value === undefined)) {
      errors = {
        ...errors,
        [key]: "Please fill up the required field",
      };

      return; 
    }

   
    if (!value) return;

    
    if (type === "number" && isNaN(Number(value))) {
      errors = {
        ...errors,
        [key]: "The value must be a number",
      };
    }

   
    if (type === "email" && !emailRegex.test(value)) {
      errors = {
        ...errors,
        [key]: "The value must be a valid email",
      };
    }

  
    if (type === "phonenumber" && !phoneRegex.test(value)) {
      errors = {
        ...errors,
        [key]: "The value must be a valid phone number",
      };
    }

   
    if (type === "website" && !websiteRegex.test(value)) {
      errors = {
        ...errors,
        [key]: "The value must be a valid website link",
      };
    }
  });

  
  if (!data.latitude?.value || !data.longitude?.value) {
    errors = {
      ...errors,
      location: "Location is not provided",
    };

    showMessages("Location is not provided", "reject");
  }

  
  if (amenities.length === 0) {
    errors = {
      ...errors,
      amenities: "Please select at least one amenity",
    };
  }

  setFormError(errors);

 
  if (Object.keys(errors).length > 0) {
    return;
  }

  const form = new FormData();

  Object.entries(data).forEach(([key, values]) => {
    if (key !== "amenities") {
      form.append(key, values.value);
    }
  });

  amenities.forEach((amenity) => {
    form.append("amenities", amenity);
  });

  
  try{
     setLoading(true)
      let res = await api.post("/hotel/create",form);
      onclose();
      showMessages(res?.data.message,"success");
      
      
 
    }
    catch(err){
      showMessages(err?.response?.data.message,"reject")

    }
    finally{
      setLoading(false)
    }
};
  return (
    <FormContainer
      title={"Add Organization"}
      subtitle={"Fill the following details to add a Organization."}
      onsubmit={onSubmit}
      error={formerror}
      onclose={onclose}
    >
      <FormRow heading="Basic Info">
        <FormInput
          type="text"
          required
          name={"organizationname"}
          placeholder="Enter Your Organization Name"
          label="Organization Name"
        />
        <FormInput
          type="select"
          required
          label="Category:"
          name={"organizationcategory"}
        >
          <option value={""}>--Select One --</option>
          {data.category.map((categ) => (
            <option value={categ}>{categ.toUpperCase()}</option>
          ))}
        </FormInput>
        <FormInput
          type="number"
          required
          label="Star Rating:"
          placeholder="1-5"
          name={"starrating"}
          value={3}
        />
      </FormRow>
      <FormRow>
        <FormFileInput name={"organizationimage"} accept="image/*" required />
      </FormRow>
      <FormRow>
        <FormInput
          type="textarea"
          label="Description:"
          required
          name={"organizationdiscription"}
          placeholder="Enter The description of the organization"
        />
      </FormRow>
      <FormRow heading="Amenities:-">
        <FormInput
          type="select"
          required
          label="Amenities"
          name={"amenities"}
          onchange={(e) => {
            if (e.target.value !== "") {
              setAmenities((prev) => [...prev, e.target.value]);
            }
          }}
        >
          <option value={""}>--select--</option>
          {data.amenities.map((amen) => {
            if (!amenities.includes(amen)) {
              return <option value={amen}>{amen}</option>;
            }
          })}
        </FormInput>
      </FormRow>
      <div
        className={styles.amenitiesholder}
        style={amenities.length > 0 ? { marginBottom: "15px" } : {}}
      >
        {amenities.map((amen) => (
          <div className={styles.amenities} key={amen}>
            {amen}{" "}
            <div
              className={styles.amenremove}
              onClick={() => {
                let filteredArray = amenities.filter((val) => val != amen);
                setAmenities(filteredArray);
              }}
            >
              <RxCross2 />
            </div>
          </div>
        ))}
      </div>
      <FormRow heading="Addresses and location:-">
        {location.latitude != "" && location.longitude != "" && (
          <>
            <FormInput
              type="text"
              value={location.latitude}
              name={"latitude"}
              label="Latitude"
              readonly
            />
            <FormInput
              type="text"
              value={location.longitude}
              name={"longitude"}
              label="Longitude"
              readonly
            />
          </>
        )}
        <div className={styles.getlocationbtnholder}>
          <div
            className={styles.getlocationbtn}
            onClick={async () => {
              getlocation();
            }}
          >
            Get Location
          </div>
        </div>
      </FormRow>
      <FormRow>
        <FormInput type="select" name={"country"} label="Country:" required>
          <option value="">---Select One---</option>
          <option value="nepal">Nepal</option>
        </FormInput>
        <FormInput
          type="select"
          name={"province"}
          label="Province:"
          required
          onchange={(e) => {
            setProvince(e.target.value);
          }}
        >
          <option value="">---Select One---</option>
          {Object.keys(nepalProvinceCities).map((province) => (
            <option value={province}>{province.toUpperCase()}</option>
          ))}
        </FormInput>
        {province && (
          <FormInput type="select" name={"city"} label="City:" required>
            <option value="">---Select One---</option>
            {nepalProvinceCities[province].map((city) => (
              <option value={city}>{city.toUpperCase()}</option>
            ))}
          </FormInput>
        )}
      </FormRow>
      <FormRow>
        <FormInput
          placeholder="Enter The Area"
          label="Area:"
          required
          name={"area"}
        />
        <FormInput
          placeholder="Enter The Street Name"
          label="Street:"
          name={"street"}
          required
        />
        <FormInput
          placeholder="Enter The Zip Code"
          label="Zip Code:"
          name={"zip"}
          required
        />
      </FormRow>
      <FormRow heading="Contacts:-">
        <FormInput
          type="email"
          label="Email:"
          required
          name={"email"}
          placeholder="Enter Your Email"
        />
        <FormInput
          type="number"
          label="Phone Number:"
          name={"phonenumber"}
          required
          placeholder="Enter Your Phone Number"
        />
        <FormInput
          type="text"
          label="Website:"
          name={"website"}
          value="N/A"
          placeholder="Enter Your website"
        />
      </FormRow>

      <FormRow heading="Policies">
        <FormInput
          type="time"
          label="CheckIn Time:"
          required
          name={"checkintime"}
        />
        <FormInput
          type="time"
          label="CheckOut Time:"
          required
          name={"checkouttime"}
        />
      </FormRow>
      <FormInput
        type="textarea"
        placeholder="Enter The Cancellation Policy"
        label="Cancellation Policy:"
        name={"cancellationpolicy"}
      />
      <ToggleRowForm
        title={"Allow Pet"}
        desc={"Toggle this btn to allow the pet entry"}
        name={"allowpet"}
      />
      <ToggleRowForm
        title={"Allow Smoking"}
        name="allowsmoking"
        desc={"Toggle this btn to allow the smoking inside premises"}
      />
    </FormContainer>
  );
};

export default AddHotelFrom;
