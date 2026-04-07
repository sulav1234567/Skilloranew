
import styles from "../css/herosection2.module.css"
import { FiBookOpen } from "react-icons/fi";
import { GoPeople } from "react-icons/go";
import { BsGraphUpArrow } from "react-icons/bs";
import { IoVideocamOutline } from "react-icons/io5";
import { AiOutlineSafetyCertificate } from "react-icons/ai"
import { SlBadge } from "react-icons/sl";
const cardDetail = [
    {
        title:"rich course library",
        subtitle:"Access thousands of courses across various subjects with multimedia content and interactive lessons.",
        icon:<FiBookOpen/>
    },
     {
        title:"Collaborative Learning",
        subtitle:"Foster engagement with discussion forums, group projects, and peer-to-peer learning opportunities.",
        icon:<GoPeople/>
    },
     {
        title:"Advanced Analytics",
        subtitle:"Track progress with detailed insights, performance metrics, and customizable learning paths.",
        icon:<BsGraphUpArrow/>
    },

    {
        title:"Live Video Classes",
        subtitle:"Host interactive live sessions with HD video, screen sharing, and real-time collaboration tools.",
        icon:<IoVideocamOutline/>
    },
    {
        title:"Certifications",
        subtitle:"Issue and manage professional certificates to recognize achievements and skill mastery.",
        icon:<SlBadge/>

    },
    {
        title:"Enterprise Security",
        subtitle:"Bank-level encryption, SSO integration, and compliance with global data protection standards.",
        icon:<AiOutlineSafetyCertificate/>
    },
    

]

const HeroSection2Card=({detail})=>{
    return (
        <div className={styles.herosection2card}>
            <div className={styles.cardicon}>
                {detail.icon}
            </div>
            <div className={styles.cardtitle}>
                {detail.title}
            </div>
            <div className={styles.cardsubtitle}>
                {detail.subtitle}
            </div>
        </div>
        
    )
}
const Herosection2 = () => {
  return (
   <div className={styles.herosection2}>
    <div className={styles.mainheader}>
        Everything You Need to Succeed

    </div>

    <div className={styles.secondaryheading}>
        Powerful features designed to create engaging learning experiences and drive measurable results.
    </div>


    <div className={styles.herosection2CardsHolder}>
       {cardDetail.map((detail,index)=>{
        return <HeroSection2Card detail={detail} key={index}/>
       })}

    </div>

   </div>
  );
};

export default Herosection2;