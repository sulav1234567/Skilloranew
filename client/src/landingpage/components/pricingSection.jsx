import styles from "../css/pricingsection.module.css";
import { FaCheck } from "react-icons/fa6";

const PricingSection = () => {
  return (
    <div className={styles.pricingsection}>
      <div className={styles.pricingsectionheading}>
        Simple, Transparent Hotel Pricing
      </div>
      <div className={styles.pricingsectionsubheading}>
        Choose the perfect plan for your hotel. All plans include a 14-day free
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
            Perfect for small hotels and lodges
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
                Up to 20 rooms
              </div>
            </div>

            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                Reservation management
              </div>
            </div>

            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                Guest profile management
              </div>
            </div>

            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                Basic reports
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
          </div>
        </div>
        <div className={`${styles.pricingcard} ${styles.choosen}`}>
          <div className={styles.pricingsectioncardheading}>Professional</div>
          <div className={styles.pricingsectionpriceholder}>
            <div className={styles.pricingsectionprice}>NPR.7900</div>
            <div className={styles.pricingsectionpricevalidity}>per month</div>
          </div>
          <div className={styles.pricingsectionpricesubheading}>
            For growing hotels and resorts
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
                Up to 100 rooms
              </div>
            </div>

            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                Advanced reservation system
              </div>
            </div>

            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                Front office operations
              </div>
            </div>

            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                Billing and invoicing
              </div>
            </div>

            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                Staff roles and permissions
              </div>
            </div>
            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                Occupancy and revenue reports
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
            For large hotels and hotel chains
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
                Unlimited rooms
              </div>
            </div>

            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                Multi-property management
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
                White-label hotel system
              </div>
            </div>

            <div className={styles.pricingsectionpricecategory}>
              <div className={styles.pricingsectionpricecatrgoryicon}>
                <FaCheck />
              </div>
              <div className={styles.pricingsectionpricecatrgorytext}>
                Custom staff permissions
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