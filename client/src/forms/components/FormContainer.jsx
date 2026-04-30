import styles from "../css/Formcontainer.module.css";
import { RxCross1 } from "react-icons/rx";
import { FaStarOfLife } from "react-icons/fa6";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { FiUpload } from "react-icons/fi";
import { FiFileText, FiX } from "react-icons/fi";

let Formdatacontext = createContext();
let useFormData = () => {
  return useContext(Formdatacontext);
};


export const ToggleRowForm = ({ title,value=false,name, desc, checked,required=false}) => {

  const [InputValue, setInputValue] = useState(value);
  let { setData, error } = useFormData();

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      [name]: {
        value: InputValue,
        isrequired: required,
        type: "boolean",
      },
    }));
  }, [InputValue]);
  return (
    <div className={styles.toggleRow}>
      <div>
        <div className={styles.formerror}>{error?.[name]}</div>
        <div className={styles.toggleTitle}>
          {title}
          {required && <FaStarOfLife className={styles.forminputrequiredtag} />}
          </div>
        <div className={styles.toggleDesc}>{desc}</div>
      </div>
      <input
        type="checkbox"
        className={styles.toggle}
        checked={checked}
        onChange={(e) => setInputValue(e.target.checked)}
        name={name}
      />
    </div>
  );
};

export const FormVideoPreview=({url,exitfunct=()=>{}})=>{
  let iurl = URL.createObjectURL(url);
  let [thumbnail,setThumbnail]=useState(null)

  let generateThumbnail=()=>{
    let canvas = document.createElement("canvas")
    let video=document.createElement("video");
    video.src=iurl;
     let ctx = canvas.getContext("2d")

     video.currentTime= 3;

     video.onseeked=()=>{
      canvas.width=video.videoWidth;
      canvas.height=video.videoHeight
      ctx.drawImage(video,0,0,canvas.width,canvas.height)

      const imageUrl = canvas.toDataURL("image/png");
      setThumbnail(imageUrl)
     }

  }

  useEffect(()=>{
    generateThumbnail()
  },[])

  


  return (
    <div className={styles.formimagepreview}>
      <div
        className={styles.formimagepreviewexit}
        onClick={() => {
          exitfunct();
        }}
      >
        <RxCross1 />
      </div>

      <img src={thumbnail} alt="thumbnail" />
    </div>
  );

}
export const FormInput = ({
  type = "text",
  value = "",
  placeholder = "N/A",
  label = "N/A",
  required = false,
  name,
  children,
}) => {
  const [InputValue, setInputValue] = useState(value);
  let { setData, error } = useFormData();
  useEffect(() => {
    setData((prev) => ({
      ...prev,
      [name]: {
        value: InputValue,
        isrequired: required,
        type: type,
      },
    }));
  }, [InputValue]);
  return (
    <div className={styles.forminputsholderwithlabel}>
      <div className={styles.forminputlabel}>
        {label}
        {required && <FaStarOfLife className={styles.forminputrequiredtag} />}
      </div>
      <div className={styles.formerror}>{error?.[name]}</div>
      <div className={styles.forminputs}>
        {type != "select" && (
          <input
            type={type}
            placeholder={placeholder}
            value={InputValue}
            name={name}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          />
        )}
        {type == "select" && (
          <select
            name={name}
            value={InputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
            }}
          >
            {children}
          </select>
        )}
      </div>
    </div>
  );
};

export const FormRow = ({ children, heading = "" }) => {
  return (
    <div className={styles.formrow}>
      <div className={styles.formrowheading}>{heading}</div>
      <div className={styles.formrowinputsholder}>{children}</div>
    </div>
  );
};
export const FormImagePreview = ({ url, exitfunct = () => {} }) => {
  let iurl = URL.createObjectURL(url);
  return (
    <div className={styles.formimagepreview}>
      <div
        className={styles.formimagepreviewexit}
        onClick={() => {
          exitfunct();
        }}
      >
        <RxCross1 />
      </div>
      <img src={iurl} alt="" />
    </div>
  );
};

export const FilePreview = ({ file, onClose }) => {
  const url = URL.createObjectURL(file);

  const isPdf = file.type === "application/pdf";
  const isDocx =
    file.type ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  return (
    <div className={styles.previewContainer}>
      <div className={styles.closeBtn} onClick={onClose}>
        <FiX />
      </div>

      {isPdf && (
        <iframe
          src={url}
          title="PDF Preview"
          className={styles.previewIframe}
        />
      )}

      {isDocx && (
        <div className={styles.unsupported}>
          <h2>DOCX Preview Not Supported</h2>
          <p>Download to view the document.</p>
          <a href={url} download>
            Download File
          </a>
        </div>
      )}

      {!isPdf && !isDocx && (
        <div className={styles.unsupported}>
          <h2>Preview not available</h2>
        </div>
      )}

    </div>
  );
};

export const FileAttachment = ({ file, onRemove, onClick }) => {
  return (
    <div className={styles.fileChip} onClick={onClick}>
      <div className={styles.left}>
        <FiFileText className={styles.icon} />
        <div className={styles.fileName}>{file?.name}</div>
      </div>

      <div
        className={styles.close}
        onClick={(e) => {
          e.stopPropagation(); // IMPORTANT
          onRemove();
        }}
      >
        <FiX />
      </div>
    </div>
  );
};

export const FormFileInput = ({ name, accept = "*/*", required = false}) => {
  let [previewstate, setPreviewState] = useState(false);
  let [file, setFile] = useState(null);
  let [filepreview, setFilePreview] = useState(false);
  let { setData,error } = useFormData();
  useEffect(() => {
    setData((prev) => ({
      ...prev,
      [name]: {
        value: file,
        isrequired: required,
        type: "file",
        accept,
      },
    }));
  }, [file]);
  return (
    <>
      {!previewstate && (
        <div className={styles.formfileinputholder}>
          <input
            type="file"
            name={name}
            id="fileinput"
            style={{ display: "none" }}
            accept={accept}
            onChange={(e) => {
              setFile(e.target.files[0]);
              setPreviewState(true);
              console.log(e.target.files[0]);
            }}
          />
          <div className={styles.formfileinputheadinganddiscription}>
            <div className={styles.formfileinputheading}>Upload File
               {required && <FaStarOfLife className={styles.forminputrequiredtag} />}
            </div>
            <div className={styles.formfileinputheadingdis}>
              upload your image less than 50 mb
            </div>
            <div className={styles.formerror}>{error?.[name]}</div>
          </div>

          <label htmlFor="fileinput" className={styles.formfileinputlabel}>
            <div className={styles.formfileinputlabelsvg}>
              <FiUpload />
            </div>
            <div className={styles.formfileinputlabeltext}>
              Click to upload or drag and drop
            </div>
            <div className={styles.formfileinputlabeltextsmall}>
              PDF, DOCX, PPTX, or ZIP (MAX. 50MB)
            </div>
          </label>
        </div>
      )}

      {previewstate && file?.type.startsWith("image/") && (
        <FormImagePreview
          url={file}
          exitfunct={() => {
            setPreviewState(false);
            setFile(null);
          }}
        />
      )}
      
      {previewstate && file?.type.startsWith("video/") && (

        <FormVideoPreview
         url={file}
          exitfunct={() => {
            setPreviewState(false);
            setFile(null);
          }}
        />
      )}
      {previewstate && (file?.type.startsWith("application/")|| file?.type.startsWith("text/")) && (
        <FileAttachment
          file={file}
          onRemove={() => {
            setPreviewState(false);
            setFile(null);
          }}
          onClick={() => setFilePreview(true)}
        />
      )}

      {filepreview && (
        <FilePreview file={file} onClose={() => setFilePreview(false)} />
      )}
    </>
  );
};

export const BtnLoader=()=>{
  return<>
  <div className={styles.loadercontainer}>
    <div className={styles.loader}></div>

  </div>
  </>
}

const FormContainer = ({
  title,
  subtitle,
  onclose,
  children,
  getData = async() => {},
  error,
  onsubmit = async() => {},
  height=95,
  width=70
}) => {
  let [data, setData] = useState({});
  let[loading,setLoading]=useState(false)
  useEffect(()=>{

    if(Object.keys(data).length>0){
      getData(data)
    }
  },[data])
  return (
    <Formdatacontext.Provider value={{ data, setData, error }}>
      <div className={styles.Formcontainer}>
        <div className={styles.formcontentsholder} style={{height:`${height}%`,width:`${width}%`}}>
          <div className={styles.formheader}>
            <div className={styles.formheadingandsubtitleholder}>
              <div className={styles.formheaderheading}>{title}</div>

              <div className={styles.formheadingsubtitle}>{subtitle}</div>
            </div>

            <div
              className={styles.formexitbtn}
              onClick={() => {
                onclose();
                setData({});
              }}
            >
              <RxCross1 />
            </div>
          </div>

          <div className={styles.formcontentholder}>{children}</div>
          <div className={styles.formfooterorbtnholder}>
            <div
              className={`${!loading?styles.formsubmitbtnactive:styles.formsubmitbtndeactive} ${styles.formsubmitbtn}`}
              onClick={async() => {
                if(!loading){
                  await onsubmit(data,setLoading,setData);
                }
              }}
            >

              {loading?<BtnLoader/>:"submit"}
            </div>
          </div>
        </div>
      </div>
    </Formdatacontext.Provider>
  );
};

export default FormContainer;
