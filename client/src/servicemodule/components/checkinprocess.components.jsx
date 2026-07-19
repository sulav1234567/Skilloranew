import { useParams } from "react-router";
import { useConfirmationMessageContext } from "../../forms/components/confirmationmessage";
import { useGlobalMessageContext } from "../../Globalmessage/components/globalmessage";
import styles from "../css/checkindetailview.module.css";
import { useEffect, useRef, useState } from "react";
import { Input } from "./reservationforms";
import api from "../../axios/axios";
import { BsCheck } from "react-icons/bs";
import { IoDocumentsOutline } from "react-icons/io5";
import { IoIosAdd } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";

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

export const GuestCard = (
  {
  guest=null,
  isprimary=false,
  guestType="N/A",
  maxfile=null,
  maxfilesize=null
}) => {
  let [selectBtn, setSelectBtn] = useState(false);
  let [formData, setFormData] = useState(null);


  let inputRef = useRef(null);
  let [files,setFiles]=useState([]);
  let[isDragging,setIsDragging]=useState(false);
  let [error,setError]=useState(null)
  let accept = "image/*"
  let MaxFileSize=maxfilesize || 20*1024*1024
  let MaxFiles = maxfile || 2
  


  let validatefiles = (files)=>{
    let validFiles = [];
    let errorMessage=null;
    

    files.forEach((file)=>{
      let filetype = file.type.split("/")[0]
     
      if(filetype!="image"){
        errorMessage = `${file.name} is unsupported file`
        return

      }

      if(file.size > MaxFileSize){
        errorMessage= `${file.name} is larger than 10 mb`
        return

      }

      validFiles.push(file)
    })
    setError(errorMessage);

    return validFiles

  }

  let addFiles = (selectedFiles)=>{
    const fileArray = Array.from(selectedFiles);
    const validFiles = validatefiles(fileArray);
  

    setFiles((prevFiles)=>{
      let newFiles = validFiles.filter((newfile)=>{
        return !prevFiles.some((file)=>{
          return  file.name === newfile.name && file.size === newfile.size

        })
      })

      return [...prevFiles,...newFiles]
    })
  }

  const HandleDragEnter = (e)=>{
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true)
  }

  const HandleDragOver = (e)=>{
     e.preventDefault();
    e.stopPropagation();
    setIsDragging(true)

  }

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();

   
    if (!event.currentTarget.contains(event.relatedTarget)) {
      setIsDragging(false);
    }
  };

  const HandleDrop = (e)=>{
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);

    let droppedfiles = e.dataTransfer.files;

    
  
    if(droppedfiles.length>0 && droppedfiles.length <= (MaxFiles-files.length)){
      addFiles(droppedfiles)
    }
    else(
      setError(`Only ${MaxFiles-files.length} files are allowed`)
    )
  }

  const HandleFileSelect = (e)=>{
    if(e.target.files.length>0 && e.target.files.length <= (MaxFiles-files.length)) {
      addFiles(e.target.files)
    }
    else{
      setError(`Only ${MaxFiles-files.length} files are allowed`)

    }

    e.target.value=""
  }

  const RemoveFile = (fileIndex)=>{
    setFiles((prevfiles)=>{

      return prevfiles.filter((_,ind)=>ind!==fileIndex)

    })
            
  }
  

  return (
    <>
      <div className={styles.guestinfo}>
        <div className={styles.guesttypeheading}>
          {guestType}
          {isprimary && <div className={styles.requiredTag}>*</div>}
          
        </div>
         {isprimary &&  <div className={styles.primaryGuestSelection}>
          <div
            className={`${styles.selectionbtn} ${selectBtn ? styles.selectionbtnactive : styles.selectionbtninactive}`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectBtn(!selectBtn);
            }}
          >
            {selectBtn ? <BsCheck /> : ""}
          </div>
          <div className={styles.selectiontext}>
            Select The Booking Guest As The Primary Guest
          </div>
        </div>}
       

        <div className={styles.guestInfoForm}>
          <div className={styles.formrow}>
            <Input
              Name="guestname"
              label="Name:"
              required
              placeholder="Enter Guest Name"
              readonly={selectBtn}
              value={selectBtn && guest? `${guest.firstName} ${guest.lastName}`:formData?.guestname?.value}
              setData={setFormData}
            />
            <Input
              Name="guestphone"
              label="Phone:"
              required
              placeholder="Enter Guest Phone"

              readonly={selectBtn}
              value={selectBtn && guest? guest.phone:formData?.guestphone?.value}
              setData={setFormData}
            />

            <Input
              Name="guestemail"
              label="Email:"
              placeholder="Enter Guest Email"

              readonly={selectBtn}
              value={selectBtn && guest? guest.email:formData?.guestemail?.value}
              setData={setFormData}
            />
          </div>
          <div className={styles.formrow}>
            <Input 
            Name="guestaddress"
              label="Address:"
              required
              placeholder="Enter Guest Address"

              readonly={selectBtn}
              value={selectBtn && guest? guest.address:formData?.guestaddress?.value}
              setData={setFormData}
            
            />
          </div>
        </div>

        <div className={styles.selectedFilesHolder}>
         {files.map((file,ind)=>{

          let ObjectUrl = URL.createObjectURL(file)
          return (
            <div className={styles.selectedfile}>
              <div className={styles.removefile} onClick={(e)=>{
                e.stopPropagation()
                RemoveFile(ind)
              }}>
                <RxCross2/>
                
              </div>

              <div className={styles.imageholder}>
                <img src={ObjectUrl} alt={`File ${ind+1}`} />
                
              </div>
              
            </div>
          )
         })}
          
        </div>

        {files.length <MaxFiles && (
          <>
           <div className={styles.dragfileserror}>
          {error}
          
        </div>



        <div className={`${styles.guestDocuments} ${isDragging?styles.dragging:styles.notdragging}`} 
        onClick={()=>inputRef.current?.click()}
        onDragEnter={HandleDragEnter}
        onDragOver={HandleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={HandleDrop}
        >

          <div className={styles.dragfeatures} >
            {!isDragging && <div className={styles.title}>
              
            Documents not found
              
            </div> }
            
            <div className={styles.icondrag}>
              {isDragging?<IoIosAdd/>:<IoDocumentsOutline/>}
              

              
            </div>
            <div className={styles.secondtitle}>
              <input
               type="file"
               ref={inputRef}
               multiple
               maxLength={MaxFiles}
               accept={accept}
               hidden
               onChange={HandleFileSelect}
               capture={"environment"}

               />
             { isDragging?"Drag Here":"Click to upload or Drag And Drop Here"}
            </div>
            
          </div>
          
        </div>
          </>
        )}
        
       
      </div>
    </>
  );
};
