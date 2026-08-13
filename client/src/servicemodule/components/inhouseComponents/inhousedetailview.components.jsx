import { useState } from "react";
import { useParams } from "react-router";
import { useGlobalMessageContext } from "../../../Globalmessage/components/globalmessage";
import { useConfirmationMessageContext } from "../../../forms/components/confirmationmessage";
import styles from "../../css/inhouse css/inhousedetailview.module.css"
import { Input } from "./../reservationforms";
import api from "../../../axios/axios";

export const DetailCard = ({
  icon,
  heading = "",
  value = "",
  secondValue = "",
}) => {
  return (
    <div className={styles.detailcard}>
      <div className={styles.detailcardheader}>
        <div className={styles.detailcardicon}>{icon}</div>
        <div className={styles.dcheading}>{heading}</div>
      </div>
      <div className={styles.dcvalue}>{value}</div>
      <div className={styles.dctime}>{secondValue}</div>
    </div>
  );
};

export const ContactCard = ({ icon, name = "", value = "" }) => {
  return (
    <div className={styles.contactcard}>
      <div className={styles.contactcardicon}>{icon}</div>

      <div className={styles.contactcardinfo}>
        <div className={styles.contactcardname}>{name}</div>

        <div className={styles.contactcardvalue}>{value}</div>
      </div>
    </div>
  );
};

export const ActionBtn = ({
  icon,
  value = "",
  onclick = () => {},
  classname = "",
}) => {
  return (
    <div
      className={`${styles.actionbtn} ${styles[classname]}`}
      onClick={onclick}
    >
      <div className={styles.actionbtnicon}>{icon}</div>

      <div className={styles.actionbtntext}>{value}</div>
    </div>
  );
};
export const TransactionForm = ({
  guestid = null,
  folioid = null,
  fetch = () => {},
}) => {
  //{ amount, paymentmode, modeid, remarks,guestid,hotelid }
  let [transactionData, setTransactionData] = useState(null);
  let [changes, setChanges] = useState(false);
  let [loading, setLoading] = useState(false);
  let { hotelid } = useParams();
  let { showMessages } = useGlobalMessageContext();
  let [errors, setErrors] = useState({});
  let { setConfirmationMessageData, clearMessage } =
    useConfirmationMessageContext();

  let modepayment = [
    "cash",
    "esewa",
    "bank",
    "fonepay",
    "card",
    "khalti",
    "upi",
  ];

  let CreateTransaction = async () => {
    if (loading) {
      return;
    }

    if (!guestid || !folioid || !hotelid) {
      showMessages("Ids Are Required");
    }
    setLoading(true);
    try {
      let { amount, paymentmode, modeid, remarks } = transactionData;

      let error = {};

      if (!amount.value || Number(amount.value) <= 0) {
        error = {
          ...error,
          amount: "Invalid amount",
        };
      }

      if (
        !paymentmode.value ||
        !modepayment.includes(paymentmode.value.trim())
      ) {
        error = {
          ...error,
          paymentmode: "Invalid Payment Mode",
        };
      }

      if (paymentmode.value != "cash" && !modeid.value) {
        error = {
          ...error,
          modeid: "Mode Id Required",
        };
      }

      if (!remarks.value) {
        error = {
          ...error,
          remarks: "Remarks Required",
        };
      }
      if (Object.keys(error).length > 0) {
        setErrors(error);
        return;
      }

      let formData = new FormData();
      formData.append("amount", amount.value);
      formData.append("paymentmode", paymentmode.value);
      formData.append("modeid", modeid.value);
      formData.append("remarks", remarks.value);
      formData.append("hotelid", hotelid);
      formData.append("guestid", guestid);
      let res = await api.post(`/transaction/create/${folioid}`, formData);

      if (res.status === 201) {
        showMessages(res.data.message, "success");
        setTransactionData(null);
        setChanges(!changes);
        fetch();
      }
    } catch (err) {
      console.log(err);
      if (err) {
        showMessages(
          err.response?.data?.message ||
            err.response?.message ||
            "Internal server error",
          "reject",
        );
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Input
        label="Amount:"
        required
        placeholder="0.00"
        setData={setTransactionData}
        value={transactionData?.amount?.value}
        Name="amount"
        changes={changes}
        type="number"
        errors={errors}
      />

      <div className={styles.inputrow}>
        <Input
          label="Payment Mode:"
          required
          placeholder="0.00"
          setData={setTransactionData}
          value={transactionData?.paymentmode?.value}
          type="select"
          Name="paymentmode"
          changes={changes}
          errors={errors}
        >
          <option value="">---select one--</option>
          {modepayment.map((pm, ind) => {
            return (
              <option value={pm.trim()} key={ind}>
                {pm.trim().toUpperCase()}
              </option>
            );
          })}
        </Input>
        <Input
          label="Mode Id:"
          required={
            transactionData && transactionData.paymentmode.value != "cash"
          }
          placeholder="98xxxxxxxxxx"
          setData={setTransactionData}
          value={transactionData?.modeid?.value}
          Name="modeid"
          changes={changes}
          errors={errors}
        />
      </div>

      <Input
        label="Remarks:"
        required
        placeholder="This payment is for the reservation"
        setData={setTransactionData}
        value={transactionData?.remarks?.value}
        Name="remarks"
        changes={changes}
        errors={errors}
      />

      <div
        className={`${styles.createtransactionbtn} ${loading ? styles.loadingbtn : styles.activebtn}`}
        onClick={() => {
          CreateTransaction();
        }}
      >
        {loading ? <div className={styles.loader}></div> : "Create Transaction"}
      </div>
    </>
  );
};

export const PaymentForm = ({
  guestid = null,
  folioid = null,
  checkinId = null,
  fetch = () => {},
}) => {
 
  let [transactionData, setTransactionData] = useState(null);
  let [changes, setChanges] = useState(false);
  let [loading, setLoading] = useState(false);
  let { hotelid } = useParams();
  let { showMessages } = useGlobalMessageContext();
  let [errors, setErrors] = useState({});
  let { setConfirmationMessageData, clearMessage } =
    useConfirmationMessageContext();

    /*{
      paymentName,
      amountToPay,
      paymentFor,
      paymentItem,
      payableModel,
      paymentType,
      hotelid,
      guestid,
    }*/

   const paymentType=["receive","pay","return"];
   const payAbleModel = ["Reservation","Room","CheckIn","Folio"]

      

  let CreatePayment = async () => {
    if (loading) {
      return;
    }

    if (!guestid || !folioid || !hotelid || !checkinId) {
      showMessages("Ids Are Required");
    }
    setLoading(true);
    try {
      let { paymentname,amount,paymentfor,paymentitem,payablemodel,paymenttype} = transactionData;

      let error = {};

      if (!amount.value || Number(amount.value) <= 0) {
        error = {
          ...error,
          amount: "Invalid amount",
        };
      }

      if (
        !payablemodel.value ||
        !payAbleModel.includes(payablemodel.value.trim())
      ) {
        error = {
          ...error,
          payablemodel: "Invalid Payable Model",
        };
      }

      if (
        !paymenttype.value ||
        !paymentType.includes(paymenttype.value.trim())
      ) {
        error = {
          ...error,
          paymenttype: "Invalid Payment type",
        };
      }

      if (!paymentfor) {
        error = {
          ...error,
          paymentfor: "paymentfor Required",
        };
      }

      if (!paymentitem.value) {
        error = {
          ...error,
          paymentitem: "Payment Item Required",
        };
      }
       if (!paymentname.value) {
        error = {
          ...error,
          paymentname: "Payment Name Required",
        };
      }
      if (Object.keys(error).length > 0) {
        setErrors(error);
        return;
      }

      let formData = new FormData();
      formData.append("paymentName", paymentname.value);
      formData.append("amountToPay", amount.value);
      formData.append("paymentFor", paymentfor.value);
      formData.append("paymentItem", paymentitem.value);
      formData.append("payableModel", payablemodel.value);
      formData.append("paymentType", paymenttype.value);
      formData.append("hotelid", hotelid);
      formData.append("guestid", guestid);
      let res = await api.post(`/payment/create/${folioid}`, formData);

      if (res.status === 201) {
        showMessages(res.data.message, "success");
        setTransactionData(null);
        setChanges(!changes);
        fetch();
      }
    } catch (err) {
      console.log(err);
      if (err) {
        showMessages(
          err.response?.data?.message ||
            err.response?.message ||
            "Internal server error",
          "reject",
        );
      }
    } finally {
      setLoading(false);
    }
  };
    
  return (
    <>
      <Input
        label="Payment Name:"
        required
        placeholder="Enter Payment Name"
        setData={setTransactionData}
        value={transactionData?.paymentname?.value}
        Name="paymentname"
        changes={changes}
        errors={errors}
      />

      <div className={styles.inputrow}>
        <Input
          label="Amount:"
          required
          placeholder="0.00"
          setData={setTransactionData}
          value={transactionData?.amount?.value}
          type="number"
          Name="amount"
          changes={changes}
          errors={errors}
        />
        <Input
        label="Item:"
        required
        setData={setTransactionData}
        value={transactionData?.paymentitem?.value || checkinId || ""}
        readonly
        Name="paymentitem"
        changes={changes}
        errors={errors}
      />

         
        
      </div>

        
          <Input
          label="Payment For:"
          required
          setData={setTransactionData}
          placeholder="Type The Reason Of The Payment"
          value={transactionData?.paymentfor?.value}
          Name="paymentfor"
          changes={changes}
          errors={errors}
        />
        <div className={styles.inputrow}>
          <Input
          label="Payable Model:"
          required
          setData={setTransactionData}
          value={transactionData?.payablemodel?.value || "CheckIn"}
          type="select"
          Name="payablemodel"
          changes={changes}
          errors={errors}

          >
            <option value="">---Select One---</option>
            {
              payAbleModel.map((pm,ind)=>{
                return (
                  <option value={pm.trim()} key={ind}>{pm.trim().toUpperCase()}</option>
                )
              })
            }
          </Input>

          <Input
          label="Payment Type:"
          required
          setData={setTransactionData}
          value={transactionData?.paymenttype?.value || "receive"}
          type="select"
          Name="paymenttype"
          changes={changes}
          errors={errors}


          >
            <option value="">---Select One---</option>
            {
              paymentType.map((pm,ind)=>{
                return (
                  <option value={pm.trim()} key={ind}>{pm.trim().toUpperCase()}</option>
                )
              })
            }
          </Input>

      
      </div>

      <div
        className={`${styles.createtransactionbtn} ${loading ? styles.loadingbtn : styles.activebtn}`}
        onClick={() => {
          CreatePayment();
        }}
      >
        {loading ? <div className={styles.loader}></div> : "Create Payment"}
      </div>
    </>
  );
};