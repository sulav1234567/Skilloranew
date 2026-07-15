
import SkeletonLoader from "../../loader/loaders.jsx";
import styles from "../css/reservationDetailedView.module.css";

const SkeletonReservationDetailpage = () => {
  return (
    <>
      {/* Reservation header */}
      <div className={styles.reservationsummary}>
        <div className={styles.resvinfoholder}>
          <div className={styles.GuestNameAndStatus}>
            <div className={styles.guestname}>
              <div className={styles.bookedByTag}>
                <SkeletonLoader
                  style={{
                    width: "70px",
                    height: "10px",
                  }}
                />
              </div>

              <div className={styles.name}>
                <SkeletonLoader
                  style={{
                    width: "200px",
                    height: "24px",
                  }}
                />
              </div>
            </div>

            <div className={styles.status}>
              <SkeletonLoader
                style={{
                  width: "90px",
                  height: "28px",
                  borderRadius: "9999px",
                }}
              />
            </div>
          </div>

          <div className={styles.otherdetails}>
            <div className={styles.odcard}>
              <div className={styles.odvalcode}>
                <SkeletonLoader
                  style={{
                    width: "110px",
                    height: "15px",
                  }}
                />
              </div>
            </div>

            <div className={styles.odcard}>
              <div className={styles.odicon}>
                <SkeletonLoader
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                  }}
                />
              </div>

              <div className={styles.odval}>
                <SkeletonLoader
                  style={{
                    width: "160px",
                    height: "14px",
                  }}
                />
              </div>
            </div>

            <div className={styles.odcard}>
              <div className={styles.odicon}>
                <SkeletonLoader
                  style={{
                    width: "18px",
                    height: "18px",
                    borderRadius: "50%",
                  }}
                />
              </div>

              <div className={styles.odval}>
                <SkeletonLoader
                  style={{
                    width: "90px",
                    height: "14px",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className={styles.rsvbtnholder}>
          {Array.from({ length: 3 }).map((_, index) => (
            <div className={styles.actionbtn} key={index}>
              <div className={styles.actionbtnicon}>
                <SkeletonLoader
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                  }}
                />
              </div>

              <div className={styles.actionbtntext}>
                <SkeletonLoader
                  style={{
                    width: "65px",
                    height: "14px",
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.summarymainholder}>
        {/* Left column */}
        <div className={styles.infocardholder}>
          {/* Stay summary */}
          <div className={styles.infocard}>
            <div className={styles.infocardhead}>
              <div className={styles.infocardheading}>
                <SkeletonLoader
                  style={{
                    width: "120px",
                    height: "20px",
                  }}
                />
              </div>
            </div>

            <div className={styles.detailsholder}>
              {Array.from({ length: 4 }).map((_, index) => (
                <div className={styles.detailcard} key={index}>
                  <div className={styles.detailcardheader}>
                    <div className={styles.detailcardicon}>
                      <SkeletonLoader
                        style={{
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                        }}
                      />
                    </div>

                    <div className={styles.dcheading}>
                      <SkeletonLoader
                        style={{
                          width: "70px",
                          height: "12px",
                        }}
                      />
                    </div>
                  </div>

                  <div className={styles.dcvalue}>
                    <SkeletonLoader
                      style={{
                        width: "105px",
                        height: "18px",
                      }}
                    />
                  </div>

                  <div className={styles.dctime}>
                    <SkeletonLoader
                      style={{
                        width: "85px",
                        height: "11px",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Guest information */}
          <div className={styles.infocard} style={{ gap: "0px" }}>
            <div className={styles.infocardhead}>
              <div className={styles.infoheadicon}>
                <SkeletonLoader
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                  }}
                />
              </div>

              <div className={styles.infocardheading}>
                <SkeletonLoader
                  style={{
                    width: "150px",
                    height: "20px",
                  }}
                />
              </div>
            </div>

            <div className={styles.guestinfoholder}>
              <div className={styles.guestProfilePic}>
                <SkeletonLoader
                  style={{
                    width: "100%",
                    height: "100%",
                    minWidth: "50px",
                    minHeight: "50px",
                    borderRadius: "50%",
                  }}
                />
              </div>

              <div className={styles.nameholder}>
                <div className={styles.guestname}>
                  <SkeletonLoader
                    style={{
                      width: "170px",
                      height: "18px",
                    }}
                  />
                </div>

                <div className={styles.guesttag}>
                  <SkeletonLoader
                    style={{
                      width: "90px",
                      height: "11px",
                    }}
                  />
                </div>
              </div>
            </div>

            <div className={styles.frdivider} />

            <div className={styles.guestcontacinfo}>
              {Array.from({ length: 3 }).map((_, index) => (
                <div className={styles.contactcard} key={index}>
                  <div className={styles.contactcardicon}>
                    <SkeletonLoader
                      style={{
                        width: "22px",
                        height: "22px",
                        borderRadius: "50%",
                      }}
                    />
                  </div>

                  <div className={styles.contactcardinfo}>
                    <div className={styles.contactcardname}>
                      <SkeletonLoader
                        style={{
                          width: "55px",
                          height: "10px",
                        }}
                      />
                    </div>

                    <div className={styles.contactcardvalue}>
                      <SkeletonLoader
                        style={{
                          width: index === 0 ? "190px" : "145px",
                          height: "14px",
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className={styles.infocard}>
            <div className={styles.infocardhead}>
              <div className={styles.infoheadicon}>
                <SkeletonLoader
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                  }}
                />
              </div>

              <div className={styles.infocardheading}>
                <SkeletonLoader
                  style={{
                    width: "70px",
                    height: "20px",
                  }}
                />
              </div>
            </div>

            <div className={styles.notecontent}>
              <SkeletonLoader
                style={{
                  width: "100%",
                  height: "13px",
                  marginBottom: "10px",
                }}
              />

              <SkeletonLoader
                style={{
                  width: "95%",
                  height: "13px",
                  marginBottom: "10px",
                }}
              />

              <SkeletonLoader
                style={{
                  width: "70%",
                  height: "13px",
                }}
              />
            </div>
          </div>
        </div>

        {/* Right column */}
        <div className={styles.infocardholder}>
          {/* Payment summary */}
          <div className={styles.infocard}>
            <div className={styles.infocardhead}>
              <div className={styles.infoheadicon}>
                <SkeletonLoader
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                  }}
                />
              </div>

              <div className={styles.infocardheading}>
                <SkeletonLoader
                  style={{
                    width: "145px",
                    height: "20px",
                  }}
                />
              </div>
            </div>

            <div className={styles.paymentholder}>
              {Array.from({ length: 2 }).map((_, index) => (
                <div className={styles.paymentrow} key={`top-${index}`}>
                  <div className={styles.paymenttitle}>
                    <SkeletonLoader
                      style={{
                        width: index === 0 ? "120px" : "95px",
                        height: "14px",
                      }}
                    />
                  </div>

                  <div className={styles.paymentValuenormal}>
                    <SkeletonLoader
                      style={{
                        width: "75px",
                        height: "14px",
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className={styles.frdivider} />

              {Array.from({ length: 3 }).map((_, index) => (
                <div className={styles.paymentrow} key={`middle-${index}`}>
                  <div className={styles.paymenttitle}>
                    <SkeletonLoader
                      style={{
                        width: index === 0 ? "115px" : "65px",
                        height: "14px",
                      }}
                    />
                  </div>

                  <div className={styles.paymentValuelight}>
                    <SkeletonLoader
                      style={{
                        width: "80px",
                        height: index === 1 ? "18px" : "14px",
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className={styles.frdivider} />

              <div className={styles.paymentrow}>
                <div className={styles.paymenttitle}>
                  <SkeletonLoader
                    style={{
                      width: "45px",
                      height: "14px",
                    }}
                  />
                </div>

                <div className={styles.paymentValueBold}>
                  <SkeletonLoader
                    style={{
                      width: "90px",
                      height: "19px",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Recorded payments */}
          <div className={styles.infocard}>
            <div className={styles.infocardhead}>
              <div className={styles.infoheadicon}>
                <SkeletonLoader
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                  }}
                />
              </div>

              <div className={styles.infocardheading}>
                <SkeletonLoader
                  style={{
                    width: "150px",
                    height: "20px",
                  }}
                />
              </div>
            </div>

            {Array.from({ length: 3 }).map((_, index) => (
              <div className={styles.paymentrecords} key={index}>
                <div className={styles.paymentrecordsymbol}>
                  <SkeletonLoader
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                    }}
                  />
                </div>

                <div className={styles.otherinfo}>
                  <div className={styles.paymentrecordname}>
                    <SkeletonLoader
                      style={{
                        width: "145px",
                        height: "15px",
                      }}
                    />
                  </div>

                  <div className={styles.paymentReason}>
                    <SkeletonLoader
                      style={{
                        width: "190px",
                        height: "11px",
                      }}
                    />
                  </div>

                  <div className={styles.pricedetails}>
                    <div className={styles.amt}>
                      <SkeletonLoader
                        style={{
                          width: "75px",
                          height: "14px",
                        }}
                      />
                    </div>

                    <div className={styles.statofpayment}>
                      <SkeletonLoader
                        style={{
                          width: "70px",
                          height: "20px",
                          borderRadius: "9999px",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Create transaction form */}
          <div className={styles.infocard}>
            <div className={styles.infocardhead}>
              <div className={styles.infoheadicon}>
                <SkeletonLoader
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                  }}
                />
              </div>

              <div className={styles.infocardheading}>
                <SkeletonLoader
                  style={{
                    width: "160px",
                    height: "20px",
                  }}
                />
              </div>
            </div>

            {/* Amount */}
            <div>
              <SkeletonLoader
                style={{
                  width: "70px",
                  height: "11px",
                  marginBottom: "8px",
                }}
              />

              <SkeletonLoader
                style={{
                  width: "100%",
                  height: "42px",
                  borderRadius: "6px",
                }}
              />
            </div>

            {/* Payment mode and mode ID */}
            <div className={styles.inputrow}>
              {Array.from({ length: 2 }).map((_, index) => (
                <div style={{ flex: 1 }} key={index}>
                  <SkeletonLoader
                    style={{
                      width: index === 0 ? "110px" : "70px",
                      height: "11px",
                      marginBottom: "8px",
                    }}
                  />

                  <SkeletonLoader
                    style={{
                      width: "100%",
                      height: "42px",
                      borderRadius: "6px",
                    }}
                  />
                </div>
              ))}
            </div>

            {/* Remarks */}
            <div>
              <SkeletonLoader
                style={{
                  width: "80px",
                  height: "11px",
                  marginBottom: "8px",
                }}
              />

              <SkeletonLoader
                style={{
                  width: "100%",
                  height: "42px",
                  borderRadius: "6px",
                }}
              />
            </div>

            <div className={styles.createtransactionbtn}>
              <SkeletonLoader
                style={{
                  width: "135px",
                  height: "15px",
                }}
              />
            </div>
          </div>

          {/* Transaction history */}
          <div className={styles.infocard}>
            <div className={styles.infocardhead}>
              <div className={styles.infoheadicon}>
                <SkeletonLoader
                  style={{
                    width: "22px",
                    height: "22px",
                    borderRadius: "50%",
                  }}
                />
              </div>

              <div className={styles.infocardheading}>
                <SkeletonLoader
                  style={{
                    width: "165px",
                    height: "20px",
                  }}
                />
              </div>
            </div>

            {Array.from({ length: 3 }).map((_, index) => (
              <div className={styles.paymentrecords} key={index}>
                <div className={styles.paymentrecordsymbol}>
                  <SkeletonLoader
                    style={{
                      width: "12px",
                      height: "12px",
                      borderRadius: "50%",
                    }}
                  />
                </div>

                <div className={styles.otherinfo}>
                  <SkeletonLoader
                    style={{
                      width: "130px",
                      height: "15px",
                      marginBottom: "8px",
                    }}
                  />

                  <SkeletonLoader
                    style={{
                      width: "90%",
                      height: "11px",
                      marginBottom: "10px",
                    }}
                  />

                  <div className={styles.pricedetails}>
                    <SkeletonLoader
                      style={{
                        width: "80px",
                        height: "14px",
                      }}
                    />

                    <SkeletonLoader
                      style={{
                        width: "85px",
                        height: "20px",
                        borderRadius: "9999px",
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default SkeletonReservationDetailpage;