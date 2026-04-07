import styles from "../css/herosection3.module.css"
import image1 from "../../assets/hero3image1.jpeg"
import image2 from "../../assets/hero3image2.jpeg"
import { FaCheck } from "react-icons/fa6";

const CardPoint=({text})=>{
    return  <div className={styles.cardpoints}>
                        <div className={styles.cardpointsicon}>
                            <FaCheck/>

                        </div>
                        <div className={styles.cardpointstext}>
                            {text}
                        </div>
                    </div>
}

const Herosection3 = () => {
  return (
    <div className={styles.herosection3}>
        <div className={styles.herosection3heading}>Built for Every Learning Journey</div>
        <div className={styles.herosection3subheading}>Whether you're an educator, organization, or lifelong learner, Skillora adapts to your needs.</div>

        <div className={styles.herosection3cardsholder}>
            <div className={styles.herosection3card}>
                <div className={styles.cardimage}>
                    <img src={image1} alt="" />
                </div>

                <div className={styles.cardtitle}>For Instructors</div>

                <div className={styles.cardpointsholder}>
                   <CardPoint text={"Create and monetize courses effortlessly"}/>
                   <CardPoint text={"Engage students with interactive content"}/>
                   <CardPoint text={"Track student progress in real-time"}/>
                   <CardPoint text={"Build your personal brand"}/>
                   
                </div>
            </div>
            <div className={styles.herosection3card}>
                <div className={styles.cardimage}>
                    <img src={image2} alt="" />
                </div>

                <div className={styles.cardtitle}>For Organizations</div>

                <div className={styles.cardpointsholder}>
                   <CardPoint text={"Scale training programs efficiently"}/>
                   <CardPoint text={"Maintain compliance and certifications"}/>
                   <CardPoint text={"Integrate with existing tools"}/>
                   <CardPoint text={"Reduce training costs by 60%"}/>
                   
                </div>
            </div>

            

        </div>

    </div>
  );
};

export default Herosection3;