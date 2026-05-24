import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import styles from "./hotelroleverification.module.css";
import api from "../axios/axios";
import Topnavbar from "../landingpage/components/topnavbar";
import { useUserInfo } from "../userinfo/userinfo";
import styles1 from "../landingpage/css/landingpage.module.css";
import logo from "../assets/image.svg";
import { LuCircleAlert } from "react-icons/lu";
import { IoCheckmarkCircleOutline } from "react-icons/io5";

const Hotelroleverification = () => {
  const { invitationtoken } = useParams();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [data, setData] = useState(null);

  let VerificationFunction = async () => {
    try {
      setLoading(true);

      if (!invitationtoken) {
        return;
      }

      let res = await api.post(`/hotel/accept-invitation`, {
        token: invitationtoken,
      });

      setData({
        status: res?.status,
        message: res?.data.message,
      });
    } catch (err) {
      if (err) {
        setData({
          status: err?.response?.status,
          message: err?.response?.data.message,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    VerificationFunction();
  }, []);

  return (
    <div className={styles.verificationmainholder}>
      <div className={styles1.topnavbar}>
        <div className={styles1.topnavbarlogoholder}>
          <div className={styles1.topnavbarlogo}>
            <img src={logo} alt="logo" />
          </div>
          <div className={styles1.topnavbarlogotext}>SkillOra</div>
        </div>
      </div>

      <div className={styles.contentHolder}>
        <div className={styles.invitationholder}>
          <div className={styles.loaderholder}>
            {!data && loading && <div className={styles.loader}></div>}
            {data && data.status === 201 && !loading && (
              <div className={styles.verificationsuccessicon}>
                <IoCheckmarkCircleOutline />
              </div>
            )}
            {data && data.status != 201 && !loading && (
              <div className={styles.verificationfailedicon}>
                <LuCircleAlert />
              </div>
            )}
          </div>

          <div className={styles.heading}>
            {loading && !data && <> Verifying ....</>}
            {!loading && data && data.status === 201 && (
              <>Verification Successful !</>
            )}
            {!loading && data && data.status != 201 && (
              <>Verification Failed !</>
            )}
          </div>

          <div className={styles.subheading}>
            {data?.message ||
              ` We are verifying your invitation request. Please wait while the
            server confirms your role and updates your access.`}
          </div>

          { !loading && data &&  <div className={styles.navigatorbutton} onClick={()=>{
            navigate("/",{replace:true})
          }}>Go To Home Page</div>}
        </div>
      </div>
    </div>
  );
};

export default Hotelroleverification;
