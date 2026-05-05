import styles from "../css/authsystem.module.css";
import logo from "../../assets/image.svg";
import { useEffect, useRef, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { BsGithub } from "react-icons/bs";
import { RxCross2 } from "react-icons/rx";
import AuthInputs from "../../inputs/components/AuthInputs";
import { LuMail } from "react-icons/lu";
import { GoLock } from "react-icons/go";
import { RxPerson } from "react-icons/rx";
import api from "../../axios/axios";
import { useGlobalMessageContext } from "../../Globalmessage/components/globalmessage";
import { useUserInfo } from "../../userinfo/userinfo";
import { useNavigate, useSearchParams } from "react-router-dom";

let backendurl = import.meta.env.VITE_BASE_URL;
const Loginform = ({ setformtype = () => {}, closeform = () => {} }) => {
  const [formdata, setFormData] = useState({
    skilloraloginemail: "",
    skilloraloginpassword: "",
  });
  const { showMessages } = useGlobalMessageContext();
  const [errors, setErrors] = useState({});
  const [btnstate, setBtnState] = useState(false);
  const [loading, setloading] = useState(false);
  const { getUserInfo } = useUserInfo();

  const LoginFunction = async () => {
    let error = {};

    Object.entries(formdata).forEach((entry) => {
      let [key, value] = entry;

      if (key != "skilloraloginemail" && (!value || value === "")) {
        error = {
          ...error,
          [key]: "Do Not Leave This Field Empty",
        };
      }

      if (
        key === "skilloraloginemail" &&
        !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(value)
      ) {
        error = {
          ...error,
          [key]: "Enter a valid email",
        };
      }
    });

    setErrors(error);

    if (Object.entries(error).length === 0) {
      setloading(true);
      let formdatainp = new FormData();

      Object.entries(formdata).forEach(([key, value]) => {
        formdatainp.append(key, value);
      });

      try {
        let res = await api.post("/auth/login/me", formdatainp);

        await getUserInfo();
        closeform();
        showMessages(res?.data.message, "success");
      } catch (err) {
        if (err) {
          showMessages(err?.response?.data.message, "reject");
        }
      } finally {
        setloading(false);
      }
    }
  };

  useEffect(() => {
    let isactive = true;
    Object.entries(formdata).forEach(([key, value]) => {
      if (!value || value === "") {
        isactive = false;
      }
    });

    setBtnState(isactive);
  }, [formdata]);
  return (
    <>
      <AuthInputs
        type="email"
        placeholder="youremail@gmail.com"
        label="Email Address:"
        name="skilloraloginemail"
        errors={errors}
        getdata={setFormData}
      >
        <LuMail />
      </AuthInputs>

      <AuthInputs
        type="password"
        placeholder="••••••••••"
        label="Password:"
        name="skilloraloginpassword"
        errors={errors}
        getdata={setFormData}
      >
        <GoLock />
      </AuthInputs>

      <div className={styles.remembermeandforgotpasssettings}>
        <div className={styles.remembermeholder}>
          <div className={styles.togglebtn}></div>

          <div className={styles.remembermetext}>Remember me</div>
        </div>

        <div className={styles.forgotpassbtn}>Forgot password?</div>
      </div>

      <div
        className={
          btnstate && !loading ? styles.loginbtnactive : styles.loginbtndeactive
        }
        onClick={() => {
          if (btnstate && !loading) {
            LoginFunction();
          }
        }}
      >
        {!loading ? " Sign in" : <div className={styles.loader}></div>}
      </div>

      <div className={styles.navigationlink}>
        Don't have an account?{" "}
        <div
          onClick={() => {
            setformtype("signup");
          }}
        >
          Sign Up
        </div>
      </div>
    </>
  );
};

let SignupForm = ({ setformtype = () => {}, closeform = () => {} }) => {
  const [formdata, setFormData] = useState({
    skillorafullname: "",
    skilloraemail: "",
    skillorapassword: "",
    skilloraconfirmpassword: "",
  });
  const { showMessages } = useGlobalMessageContext();
  const [errors, setErrors] = useState({});
  const [btnstate, setBtnState] = useState(false);
  const [loading, setloading] = useState(false);

  const RegisterFunction = async () => {
    let error = {};

    Object.entries(formdata).forEach((entry) => {
      let [key, value] = entry;

      if (key != "skilloraemail" && (!value || value === "")) {
        error = {
          ...error,
          [key]: "Do Not Leave This Field Empty",
        };
      }

      if (
        key === "skilloraemail" &&
        !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,})+$/.test(value)
      ) {
        error = {
          ...error,
          [key]: "Enter a valid email",
        };
      }
    });
    if (
      formdata["skilloraconfirmpassword"] &&
      formdata["skillorapassword"] &&
      formdata["skillorapassword"] !== formdata["skilloraconfirmpassword"]
    ) {
      error = {
        ...error,
        ["skilloraconfirmpassword"]: "Passwords doesnot match",
        ["skillorapassword"]: "Passwords doesnot match",
      };
    }

    setErrors(error);

    if (Object.entries(error).length === 0) {
      setloading(true);
      let formdatainp = new FormData();

      Object.entries(formdata).forEach(([key, value]) => {
        formdatainp.append(key, value);
      });

      try {
        let res = await api.post("/auth/register/me", formdatainp);
        showMessages(res?.data.message, "success");
        closeform();
      } catch (err) {
        if (err) {
          showMessages(err?.response?.data.message, "reject");
        }
      } finally {
        setloading(false);
      }
    }
  };

  useEffect(() => {
    let isactive = true;
    Object.entries(formdata).forEach(([key, value]) => {
      if (!value || value === "") {
        isactive = false;
      }
    });

    setBtnState(isactive);
  }, [formdata]);
  return (
    <>
      <AuthInputs
        type="text"
        placeholder="Write Your Full Name"
        label="Full Name :"
        name="skillorafullname"
        getdata={setFormData}
        errors={errors}
      >
        <RxPerson />
      </AuthInputs>

      <AuthInputs
        type="email"
        placeholder="youremail@gmail.com"
        label="Email Address :"
        name="skilloraemail"
        getdata={setFormData}
        errors={errors}
      >
        <LuMail />
      </AuthInputs>

      <AuthInputs
        type="password"
        placeholder="••••••••••"
        label="Password:"
        name="skillorapassword"
        getdata={setFormData}
        errors={errors}
      >
        <GoLock />
      </AuthInputs>

      <AuthInputs
        type="password"
        placeholder="••••••••••"
        label="Confirm Password:"
        name="skilloraconfirmpassword"
        getdata={setFormData}
        errors={errors}
      >
        <GoLock />
      </AuthInputs>

      <div
        className={
          btnstate && !loading ? styles.loginbtnactive : styles.loginbtndeactive
        }
        onClick={() => {
          if (btnstate && !loading) {
            RegisterFunction();
          }
        }}
      >
        {!loading ? "Create Account" : <div className={styles.loader}></div>}
      </div>

      <div className={styles.navigationlink}>
        Already have an account?{" "}
        <div
          onClick={() => {
            setformtype("signin");
          }}
        >
          Sign In
        </div>
      </div>
    </>
  );
};

const AuthSystem = ({
  onclose = () => {},
  formtype = "signin",
  setformtype = () => {},
}) => {
  const scrolldiv = useRef();
  let[searchParams,setSearchParams]=useSearchParams()
  let navigate = useNavigate();
  useEffect(() => {
    document.body.style.overflowY = "hidden";
    return () => {
      document.body.style.overflowY = "scroll";
    };
  }, []);

  useEffect(() => {
    scrolldiv.current.scrollTo({
      top: 0,
      behaviour: "smooth",
    });
  }, [formtype]);
  return (
    <div className={styles.maincontainerBg}>
      <div className={styles.authformcontainer}>
        <div
          className={styles.exitbtn}
          onClick={() => {
            onclose();
            setSearchParams({})
          }}
        >
          <RxCross2 />
        </div>
        <div className={styles.authfromcontentholder} ref={scrolldiv}>
          <div className={styles.logoholder}>
            <div className={styles.logo}>
              <img src={logo} alt="logo" />
            </div>
          </div>

          <div className={styles.welcomeMessage}>
            {formtype == "signin" ? "Welcome Back" : "Create Account"}
          </div>

          <div className={styles.welcomeSubMessage}>
            {formtype == "signin"
              ? "Sign in to continue your learning journey"
              : "Join thousands of learners on Skillora"}
          </div>

          <div className={styles.authpagebtn}>
            <div className={styles.authpagebtnlogo}>
              <FcGoogle />
            </div>
            <div
              className={styles.authpagebtntext}
              onClick={() => {
                window.location.href = `${backendurl}/auth/google`;
              }}
            >
              Continue With Google
            </div>
          </div>

          <div className={styles.authpagebtn}>
            <div className={styles.authpagebtnlogo}>
              <BsGithub />
            </div>
            <div
              className={styles.authpagebtntext}
              onClick={() => {
                window.location.href = `${backendurl}/auth/github`;
              }}
            >
              Continue With Github
            </div>
          </div>

          <div className={styles.continuewithdivider}>
            Or continue with email
          </div>

          {formtype == "signin" && (
            <Loginform setformtype={setformtype} closeform={onclose} />
          )}
          {formtype == "signup" && (
            <SignupForm setformtype={setformtype} closeform={onclose} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthSystem;
