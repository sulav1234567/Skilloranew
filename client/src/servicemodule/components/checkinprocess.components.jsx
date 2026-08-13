import { data, Form, useParams } from "react-router";
import { useConfirmationMessageContext } from "../../forms/components/confirmationmessage";
import { useGlobalMessageContext } from "../../Globalmessage/components/globalmessage";
import styles from "../css/checkindetailview.module.css";
import { useEffect, useRef, useState } from "react";
import { Input } from "./reservationforms";
import api from "../../axios/axios";
import { BsCheck } from "react-icons/bs";
import { IoDocumentsOutline, IoSearchSharp } from "react-icons/io5";
import { IoIosAdd } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { MdDeleteOutline } from "react-icons/md";
import { emailRegex, phoneRegex } from "../../Adminpannel/components/regex";

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

const GuestFilePreview = ({
  file,
  onRemove = () => {},
  direct = false,
  removable = true,
}) => {
  const [previewUrl, setPreviewUrl] = useState("");

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    if (direct) {
      setPreviewUrl(file);
      return;
    }

    if (!(file instanceof Blob)) {
      console.error("Preview requires a File or Blob:", file);
      setPreviewUrl("");
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [file, direct]);

  return (
    <div className={styles.selectedfile}>
      {removable && (
        <button
          type="button"
          className={styles.removefile}
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <RxCross2 />
        </button>
      )}

      <div className={styles.imageholder}>
        {previewUrl && (
          <img
            src={previewUrl}
            alt={direct ? "Guest document" : file?.name || "Selected document"}
            onLoad={() => {
              console.log("Image loaded:", previewUrl);
            }}
            onError={(e) => {
              console.error("Image failed to load:", previewUrl);
              e.currentTarget.style.display = "none";
            }}
          />
        )}
      </div>
    </div>
  );
};

const GuestIdentificationInputs = ({
  guest = null,
  setFormData = () => {},
  formData = null,
  formError = null,
}) => {
  let idTypeEnum = ["citizenship", "passport", "license", "national_id"];
  let guestTypeEnum = ["normal", "vip", "corporate", "blacklisted"];

  return (
    <div className={styles.guestInfoForm}>
      <div className={styles.formrow}>
        <Input
          type="select"
          Name="guesttype"
          label="Guest Type:"
          required
          readonly={Boolean(guest?.guestType)}
          setData={setFormData}
          value={guest?.guestType ?? formData?.guesttype?.value ?? ""}
          errors={formError}
        >
          <option value="">---Select One---</option>
          {guestTypeEnum.map((type, ind) => {
            return (
              <option value={type} key={ind}>
                {type.toUpperCase()}
              </option>
            );
          })}
        </Input>

        <Input
          Name="idtype"
          type="select"
          label="ID Type:"
          required
          readonly={Boolean(guest?.idType)}
          setData={setFormData}
          value={guest?.idType ?? formData?.idtype?.value ?? ""}
          errors={formError}
        >
          <option value="">---Select One---</option>
          {idTypeEnum.map((type, ind) => {
            return (
              <option value={type} key={ind}>
                {type.toUpperCase()}
              </option>
            );
          })}
        </Input>
      </div>

      <div className={styles.formrow}>
        <Input
          Name="idnumber"
          label="ID Number:"
          required
          placeholder="Enter ID Number"
          readonly={Boolean(guest?.idNumber)}
          setData={setFormData}
          value={guest?.idNumber ?? formData?.idnumber?.value ?? ""}
          errors={formError}
        />
        <Input
          Name="nationality"
          type="select"
          label="Nationality:"
          required
          readonly={Boolean(guest?.nationality)}
          setData={setFormData}
          value={guest?.nationality ?? formData?.nationality?.value ?? ""}
          errors={formError}
        >
          <option value="">---select one---</option>
          <option value="Nepali">Nepali</option>
        </Input>
      </div>
    </div>
  );
};
export const GuestCard = ({
  guest = null,
  isprimary = false,
  guestType = "N/A",
  maxfile = 2,
  maxfilesize = 20 * 1024 * 1024,
  setGuestData = () => {},
  index = null,
}) => {
  const [selectBtn, setSelectBtn] = useState(false);
  const [formData, setFormData] = useState({
    guestname: {
      value: null,
      isRequired: true,
    },
    guestemail: {
      value: null,
      isRequired: true,
    },
    guestphone: {
      value: null,
      isRequired: true,
    },
    guestaddress: {
      value: null,
      isRequired: true,
    },
  });
  const [clearform, setClearForm] = useState(false);

  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchedGuest, setSearchedGuest] = useState(null);
  const [searchStatus, setSearchStatus] = useState(false);

  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);

  const [fileError, setFileError] = useState("");
  const [formError, setFormError] = useState({});

  const inputRef = useRef(null);

  const { hotelid } = useParams();
  const { showMessages } = useGlobalMessageContext();
  const accept = "image/*";

  const existingDocuments = Array.isArray(searchedGuest?.documents)
    ? searchedGuest.documents
    : [];

  const existingDocumentCount = existingDocuments.length;

  const remainingDocumentSlots = Math.max(
    maxfile - existingDocumentCount - files.length,
    0,
  );
  let searchGuest = async () => {
    console.log("evoked");
    if (!hotelid) {
      showMessages("Hotel Id Not Found", "reject");
      return;
    }
    if (searchLoading) {
      return;
    }

    try {
      setSearchLoading(true);
      let { guestname, guestphone, guestemail } = formData;
      let guestfirstname = guestname.value?.trim().split(" ")[0] || null;
      let guestlastname = guestname.value?.trim().split(" ")[1] || null;

      let error = {};

      if (!guestfirstname || !guestlastname) {
        error = {
          ...error,
          guestname: "Invalid Name Format",
        };
      }

      if (!guestphone.value || !phoneRegex.test(guestphone.value)) {
        error = {
          ...error,
          guestphone: "Invalid Phone Number",
        };
      }

      if (!guestemail.value || !emailRegex.test(guestemail.value)) {
        error = {
          ...error,
          guestemail: "Invalid Guest Email",
        };
      }
      setFormError(error);

      if (Object.keys(error).length === 0) {
        let Formdata = new FormData();
        Formdata.append("firstName", guestfirstname);
        Formdata.append("lastName", guestlastname);
        Formdata.append("phonenumber", guestphone.value);
        Formdata.append("email", guestemail.value);
        let res = await api.post(`/guest/search/${hotelid}`, Formdata);
        if (res.status === 200) {
          setSearchedGuest(res.data?.guest);
          console.log(res.data.guest);
          setSearchStatus(true);
          showMessages("Guest Found", "success");
        }
      }
    } catch (err) {
      if (err) {
        if (err && err.response) {
          setSearchStatus(true);
          setSearchedGuest(null)
          showMessages(err.response?.data.message, "reject");
        }
      }
    } finally {
      setSearchLoading(false);
    }
  };

  const validateFiles = (selectedFiles) => {
    const validFiles = [];
    const validationMessages = [];

    selectedFiles.forEach((file) => {
      if (!file.type?.startsWith("image/")) {
        validationMessages.push(`${file.name} is not a supported image file`);
        return;
      }

      if (file.size > maxfilesize) {
        const maximumSizeInMb = Math.round(maxfilesize / (1024 * 1024));

        validationMessages.push(
          `${file.name} must be smaller than ${maximumSizeInMb} MB`,
        );
        return;
      }

      validFiles.push(file);
    });

    return {
      validFiles,
      validationMessage: validationMessages[0] || "",
    };
  };
  const addFiles = (selectedFiles) => {
    setFiles((previousFiles) => {
      const remainingFileSlots =
        maxfile - existingDocumentCount - previousFiles.length;

      if (remainingFileSlots <= 0) {
        setFileError(`Only ${maxfile} total files are allowed`);
        return previousFiles;
      }

      const { validFiles, validationMessage } =
        validateFiles(Array.from(selectedFiles));

      const uniqueFiles = validFiles.filter((newFile) => {
        return !previousFiles.some((existingFile) => {
          return (
            existingFile.name === newFile.name &&
            existingFile.size === newFile.size &&
            existingFile.lastModified === newFile.lastModified
          );
        });
      });

      const filesThatCanBeAdded = uniqueFiles.slice(0, remainingFileSlots);

      if (validFiles.length > remainingFileSlots) {
        setFileError(
          `Only ${remainingFileSlots} more ${
            remainingFileSlots === 1 ? "file is" : "files are"
          } allowed`,
        );
      } else if (validationMessage) {
        setFileError(validationMessage);
      } else if (uniqueFiles.length !== validFiles.length) {
        setFileError("Duplicate files were ignored");
      } else {
        setFileError("");
      }

      return [...previousFiles, ...filesThatCanBeAdded];
    });
  };
  const HandleDragEnter = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
  };
  const HandleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };
  const HandleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setIsDragging(false);

    const droppedFiles = e.dataTransfer?.files;

    if (!droppedFiles || droppedFiles.length === 0) {
      return;
    }

    addFiles(droppedFiles);
  };
  const HandleFileSelect = (e) => {
    const selectedFiles = e.target.files;

    if (selectedFiles?.length > 0) {
      addFiles(selectedFiles);
    }

    // Allows selecting the same file again after it has been removed.
    e.target.value = "";
  };
  const RemoveFile = (fileIndex) => {
    setFiles((previousFiles) => {
      return previousFiles.filter((_, indexValue) => {
        return indexValue !== fileIndex;
      });
    });

    setFileError("");
  };

  useEffect(() => {
    if (selectBtn && isprimary && guest) {
      setFormData((prev) => {
        return {
          ...prev,
          guestname: {
            ...prev.guestname,
            value: `${guest.firstName} ${guest.lastName}`,
          },
          guestphone: {
            ...prev.guestphone,
            value: guest.phone,
          },
          guestemail: {
            ...prev.guestemail,
            value: guest.email,
          },
          guestaddress: {
            ...prev.guestaddress,
            value: guest.address,
          },
        };
      });
    } else {
      setFormData((prev) => {
        return {
          guestname: {
            ...prev.guestname,
            value: null,
          },
          guestphone: {
            ...prev.guestphone,
            value: null,
          },
          guestemail: {
            ...prev.guestemail,
            value: null,
          },
          guestaddress: {
            ...prev.guestaddress,
            value: null,
          },
        };
      });
    }
  }, [selectBtn]);

  let deleteCard = (Okey) => {
    setGuestData((prev) => {
      return Object.fromEntries(
        Object.entries(prev).filter(([key, value]) => {
          return Okey && key != Okey;
        }),
      );
    });
  };

  useEffect(() => {
    setGuestData((prev) => {
      return {
        ...prev,
        [index]: {
          files: files,
          isprimary: isprimary,
          guest: searchedGuest,
          inputdata: formData,
          selectBtn,
          maxfilesize,
          maxfile,
          accept,
          searchStatus,
          requiredfiles: Number(maxfile) - Number(searchedGuest?.documents?.length || 0),
          setfileError:setFileError,
          setinputError:setFormError
        },
      };
    });
  }, [selectBtn, formData, files, searchedGuest, searchStatus]);

  useEffect(() => {
    setSearchedGuest(null);
    setSearchStatus(false);
    setFiles([]);
  }, [
    selectBtn,
    formData?.guestname?.value,
    formData?.guestphone?.value,
    formData?.guestemail?.value,
  ]);

  return (
    <div className={styles.guestinfo}>
      <div className={styles.buttonsholder}>
        <div
          className={`${styles.searchbtn} ${searchLoading ? styles.loadingbtn : ""}`}
          onClick={() => {
            searchGuest();
          }}
        >
          {searchLoading ? (
            <div className={styles.loader}></div>
          ) : (
            <IoSearchSharp />
          )}
        </div>

        {!isprimary && (
          <div
            className={styles.deletebutton}
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              deleteCard(index);
            }}
          >
            <MdDeleteOutline />
          </div>
        )}
      </div>

      <div className={styles.guesttypeheading}>
        {guestType}

        {isprimary && <div className={styles.requiredTag}>*</div>}
      </div>

      {isprimary && (
        <div className={styles.primaryGuestSelection}>
          <div
            className={`${styles.selectionbtn} ${
              selectBtn
                ? styles.selectionbtnactive
                : styles.selectionbtninactive
            }`}
            onClick={(e) => {
              e.stopPropagation();
              setSelectBtn(!selectBtn);
            }}
          >
            {selectBtn && <BsCheck />}
          </div>

          <div className={styles.selectiontext}>
            Select the booking guest as the primary guest
          </div>
        </div>
      )}

      <div className={styles.guestInfoForm}>
        <div className={styles.formrow}>
          <Input
            Name="guestname"
            label="Name:"
            required
            placeholder="Enter Guest Name"
            readonly={selectBtn}
            setData={setFormData}
            value={formData?.guestname?.value || ""}
            errors={formError}
            changes={clearform}
          />

          <Input
            Name="guestphone"
            label="Phone:"
            required
            placeholder="Enter Guest Phone"
            readonly={selectBtn}
            value={formData?.guestphone?.value || ""}
            setData={setFormData}
            errors={formError}
            changes={clearform}
          />

          <Input
            Name="guestemail"
            label="Email:"
            required
            placeholder="Enter Guest Email"
            readonly={selectBtn}
            value={formData?.guestemail?.value || ""}
            setData={setFormData}
            errors={formError}
            changes={clearform}
          />
        </div>

        <div className={styles.formrow}>
          <Input
            Name="guestaddress"
            label="Address:"
            required
            placeholder="Enter Guest Address"
            readonly={selectBtn}
            value={formData?.guestaddress?.value || ""}
            setData={setFormData}
            errors={formError}
            changes={clearform}
          />
        </div>
      </div>

      {searchedGuest && (
        <div className={styles.guestFoundMessage}>Existing guest selected</div>
      )}

      {searchStatus && (
        <GuestIdentificationInputs
          guest={searchedGuest}
          setFormData={setFormData}
          formData={formData}
          formError={formError}
        />
      )}

      {searchStatus && (
        <>
          <div className={styles.selectedFilesHolder}>
            {/* Newly selected local files */}
            {files.map((file, fileIndex) => (
              <GuestFilePreview
                key={`${file.name}-${file.size}-${file.lastModified}`}
                file={file}
                onRemove={() => RemoveFile(fileIndex)}
              />
            ))}

            {/* Existing server documents */}
            {existingDocuments.map((document, fileIndex) => {
              const documentUrl =
                `${import.meta.env.VITE_BASE_URL}` +
                `/stream/hotel/${document.hotel}/media/${document._id}`;

              return (
                <GuestFilePreview
                  key={document._id || fileIndex}
                  file={documentUrl}
                  direct
                  removable={false}
                />
              );
            })}
          </div>

          {remainingDocumentSlots > 0 && (
            <>
              {fileError && (
                <div className={styles.dragfileserror}>{fileError}</div>
              )}

              <div
                className={`${styles.guestDocuments} ${
                  isDragging ? styles.dragging : styles.notdragging
                }`}
                onClick={() => inputRef.current?.click()}
                onDragEnter={HandleDragEnter}
                onDragOver={HandleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={HandleDrop}
              >
                <div className={styles.dragfeatures}>
                  {!isDragging && (
                    <div className={styles.title}>Upload guest documents</div>
                  )}

                  <div className={styles.icondrag}>
                    {isDragging ? <IoIosAdd /> : <IoDocumentsOutline />}
                  </div>

                  <div className={styles.secondtitle}>
                    <input
                      type="file"
                      ref={inputRef}
                      multiple
                      accept={accept}
                      hidden
                      onChange={HandleFileSelect}
                      capture="environment"
                    />

                    {isDragging
                      ? "Drop the files here"
                      : `Click to upload or drag and drop — ${remainingDocumentSlots} remaining`}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
