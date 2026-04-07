import styles from "../css/pricingsection.module.css";
import { FaCheck } from "react-icons/fa6";

const PricingSection = () => {
  return (
    <div className={styles.pricingsection}>
      <div className={styles.pricingsectionheading}>
        Simple, Transparent Pricing
      </div>
      <div className={styles.pricingsectionsubheading}>
        Choose the perfect plan for your needs. All plans include a 14-day free
        trial.
      </div>

      <div className={styles.pricingcardsholder}>
        <div className={`${styles.pricingcard} ${styles.normal}`}>
          <div className={styles.pricingsectioncardheading}>Starter</div>
          <div className={styles.pricingsectionpriceholder}>
            <div className={styles.pricingsectionprice}>NPR.2000</div>
            <div className={styles.pricingsectionpricevalidity}>per month</div>
          </div>
          <div className={styles.pricingsectionpricesubheading}>
            Perfect for individual educators
          </div>

          <div
            className={`${styles.pricingsectionpricecardbtn} ${styles.pricingsectionpricecardsecondarybtn}`}
          >
            Start Free Trial
          </div>

          <div className={styles.pricingsectionpricecategories}>
            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                Up to 100 students
              </div>
            </div>

            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                5 courses
              </div>
            </div>

            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                Basic analytics
              </div>
            </div>

            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                Email support
              </div>
            </div>

            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                Course certificates
              </div>
            </div>
          </div>
        </div>
        <div className={`${styles.pricingcard} ${styles.choosen}`}>
          <div className={styles.pricingsectioncardheading}>Professional</div>
          <div className={styles.pricingsectionpriceholder}>
            <div className={styles.pricingsectionprice}>NPR.7900</div>
            <div className={styles.pricingsectionpricevalidity}>per month</div>
          </div>
          <div className={styles.pricingsectionpricesubheading}>
            For growing educational businesses
          </div>

          <div
            className={`${styles.pricingsectionpricecardbtn} ${styles.pricingsectionpricecardprimarybtn}`}
          >
            Start Free Trial
          </div>

          <div className={styles.pricingsectionpricecategories}>
            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                Up to 1,000 students
              </div>
            </div>

            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                Unlimited courses
              </div>
            </div>

            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                Advanced analytics
              </div>
            </div>

            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                Priority support
              </div>
            </div>

            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                Custom branding
              </div>
            </div>
            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                Live video classes
              </div>
            </div>
            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                API access
              </div>
            </div>
          </div>
        </div>

        <div className={`${styles.pricingcard} ${styles.normal}`}>
          <div className={styles.pricingsectioncardheading}>Enterprise</div>
          <div className={styles.pricingsectionpriceholder}>
            <div className={styles.pricingsectionprice}>Custom</div>
            <div className={styles.pricingsectionpricevalidity}>
              contact sales
            </div>
          </div>
          <div className={styles.pricingsectionpricesubheading}>
            For large organizations
          </div>

          <div
            className={`${styles.pricingsectionpricecardbtn} ${styles.pricingsectionpricecardsecondarybtn}`}
          >
            Start Free Trial
          </div>

          <div className={styles.pricingsectionpricecategories}>
            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                Unlimited students
              </div>
            </div>

            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                Unlimited courses
              </div>
            </div>

            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                Enterprise analytics
              </div>
            </div>

            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                Dedicated support
              </div>
            </div>

            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                White-label solution
              </div>
            </div>

            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                SSO integration
              </div>
            </div>

            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                Custom development
              </div>
            </div>

            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                SLA guarantee
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PricingSection;
