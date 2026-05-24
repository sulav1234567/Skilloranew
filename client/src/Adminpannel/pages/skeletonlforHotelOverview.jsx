
import SkeletonLoader from "../../loader/loaders";
import styles from "../css/hoteloverview.module.css";
const HotelOverviewSkeleton = () => {
  return (
    <div className={styles.overviewcontainer}>
      <div className={styles.containerone}>
        <div className={styles.infoeditbtnholder}>
          <SkeletonLoader
            style={{
              width: "30px",
              height: "30px",
              borderRadius: "8px",
            }}
          />
        </div>

        <div className={styles.infomainnameholder}>
          <SkeletonLoader
            style={{
              width: "280px",
              height: "36px",
              borderRadius: "10px",
            }}
          />

          <SkeletonLoader
            style={{
              width: "95px",
              height: "28px",
              borderRadius: "8px",
            }}
          />
        </div>

        <div className={styles.simpleinfoholder}>
          <div className={styles.starratingholder}>
            <SkeletonLoader
              style={{
                width: "90px",
                height: "18px",
                borderRadius: "8px",
              }}
            />

            <SkeletonLoader
              style={{
                width: "90px",
                height: "16px",
                borderRadius: "6px",
              }}
            />
          </div>

          <div className={styles.registration}>
            <SkeletonLoader
              style={{
                width: "20px",
                height: "20px",
                borderRadius: "6px",
              }}
            />

            <SkeletonLoader
              style={{
                width: "115px",
                height: "16px",
                borderRadius: "6px",
              }}
            />
          </div>
        </div>

        <div className={styles.amenitiesholder}>
          <SkeletonLoader
            style={{
              width: "95px",
              height: "22px",
              borderRadius: "6px",
            }}
          />

          <div className={styles.amencardholder}>
            {Array.from({ length: 6 }).map((_, index) => (
              <SkeletonLoader
                key={index}
                style={{
                  width: index % 2 === 0 ? "85px" : "105px",
                  height: "30px",
                  borderRadius: "10px",
                }}
              />
            ))}
          </div>
        </div>

        <div className={styles.infopointsholder}>
          <SkeletonLoader
            style={{
              width: "170px",
              height: "22px",
              borderRadius: "6px",
            }}
          />

          <div className={styles.policypointsholder}>
            {Array.from({ length: 4 }).map((_, index) => (
              <div className={styles.policypoint} key={index}>
                <SkeletonLoader
                  style={{
                    minWidth: "15px",
                    width: "15px",
                    height: "15px",
                    borderRadius: "50%",
                    marginTop: "3px",
                  }}
                />

                <SkeletonLoader
                  style={{
                    width: index === 3 ? "70%" : "95%",
                    height: "16px",
                    borderRadius: "6px",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.infoholder}>
          <SkeletonLoader
            style={{
              width: "100px",
              height: "22px",
              borderRadius: "6px",
            }}
          />

          <div className={styles.infovalue}>
            <div style={{ width: "100%" }}>
              <SkeletonLoader
                style={{
                  width: "100%",
                  height: "16px",
                  borderRadius: "6px",
                  marginBottom: "10px",
                }}
              />

              <SkeletonLoader
                style={{
                  width: "96%",
                  height: "16px",
                  borderRadius: "6px",
                  marginBottom: "10px",
                }}
              />

              <SkeletonLoader
                style={{
                  width: "90%",
                  height: "16px",
                  borderRadius: "6px",
                  marginBottom: "10px",
                }}
              />

              <SkeletonLoader
                style={{
                  width: "65%",
                  height: "16px",
                  borderRadius: "6px",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className={styles.containertwo}>
        <div className={styles.hotelimage}>
          <SkeletonLoader
            style={{
              width: "100%",
              height: "100%",
              borderRadius: "15px",
            }}
          />
        </div>

        <div className={styles.hotelcard}>
          <SkeletonLoader
            style={{
              width: "140px",
              height: "18px",
              borderRadius: "6px",
              marginBottom: "15px",
            }}
          />

          <div className={styles.ownerinfoholder}>
            <SkeletonLoader
              style={{
                width: "50px",
                height: "50px",
                borderRadius: "50%",
                flexShrink: 0,
              }}
            />

            <div className={styles.ownerotherinfo}>
              <SkeletonLoader
                style={{
                  width: "130px",
                  height: "18px",
                  borderRadius: "6px",
                  marginBottom: "7px",
                }}
              />

              <div className={styles.owneremailandstatus}>
                <SkeletonLoader
                  style={{
                    width: "155px",
                    height: "16px",
                    borderRadius: "6px",
                  }}
                />

                <SkeletonLoader
                  style={{
                    width: "70px",
                    height: "28px",
                    borderRadius: "6px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.hotelcard}>
          <SkeletonLoader
            style={{
              width: "150px",
              height: "18px",
              borderRadius: "6px",
              marginBottom: "15px",
            }}
          />

          <div className={styles.cardcontactcontent}>
            {Array.from({ length: 3 }).map((_, index) => (
              <div className={styles.contactcard} key={index}>
                <SkeletonLoader
                  style={{
                    minWidth: "20px",
                    width: "20px",
                    height: "20px",
                    borderRadius: "6px",
                  }}
                />

                <SkeletonLoader
                  style={{
                    width:
                      index === 0
                        ? "130px"
                        : index === 1
                        ? "210px"
                        : "180px",
                    height: "16px",
                    borderRadius: "6px",
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        <div className={styles.hotelcard}>
          <SkeletonLoader
            style={{
              width: "80px",
              height: "18px",
              borderRadius: "6px",
              marginBottom: "15px",
            }}
          />

          <div
            style={{
              display: "flex",
              gap: "10px",
              width: "100%",
              marginBottom: "12px",
            }}
          >
            <SkeletonLoader
              style={{
                minWidth: "20px",
                width: "20px",
                height: "20px",
                borderRadius: "6px",
              }}
            />

            <div style={{ width: "calc(100% - 30px)" }}>
              <SkeletonLoader
                style={{
                  width: "100%",
                  height: "16px",
                  borderRadius: "6px",
                  marginBottom: "8px",
                }}
              />

              <SkeletonLoader
                style={{
                  width: "80%",
                  height: "16px",
                  borderRadius: "6px",
                }}
              />
            </div>
          </div>

          <div className={styles.mapgoogle}>
            <SkeletonLoader
              style={{
                width: "100%",
                height: "250px",
                borderRadius: "10px",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default HotelOverviewSkeleton