import { useState } from "react";
import FormContainer, {
  FormInput,
  FormRow,
} from "../../forms/components/FormContainer";
import styles from "../css/hotel.module.css";
import { RxCross2 } from "react-icons/rx";

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

const Hotel = () => {
  let [amenities, setAmenities] = useState([]);

  return (
    <div>
      <FormContainer
        title={"Add Organization"}
        subtitle={"Fill the following details to add a Organization."}
      >
        <FormRow heading="Basic Info">
          <FormInput
            type="text"
            required
            placeholder="Enter Your Organization Name"
            label="Organization Name"
          />
          <FormInput type="select" required label="Category:">
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
            value={3}
          />
        </FormRow>
        <FormRow>
          <FormInput
            type="textarea"
            label="Description:"
            required
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
        <div className={styles.amenitiesholder}>
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
      </FormContainer>
      <h2>Hotel</h2>
    </div>
  );
};

export default Hotel;
