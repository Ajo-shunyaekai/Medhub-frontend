import React from "react";
import styles from './NewTrackingForm.module.css';
import Main from "../../UI/Main/Main";
import Card from "../../UI/FormCard/FormCard";
import NewTrackingTimeline from "../NewTrackingDetails/NewTrackingTimeline";

const trackingData = [
    { status: "Delivered",        location: "Ahmedabad, GJ",                    date: "27th Aug 2021", time: "2:30 PM" },
    { status: "Out For Delivery", location: "Ahmedabad, GJ",                    date: "27th Aug 2021", time: "11:30 AM" },
    { status: "In transit",       location: "From Mumbai, MH to Ahmedabad, GJ", date: "25th Aug 2021", time: "05:30 PM" },
    { status: "Order Picked up",  location: "Mumbai, MH",                       date: "24th Aug 2021", time: "07:26 AM" },
    { status: "Order Received",   location: "Mumbai, MH",                       date: "23rd Aug 2021", time: "12:46 PM" },
  ];

const NewTracking = () => {

    return (
        <Main title='Tracking'>
            <div className={styles.trackingContainer}>
                <form>
                    <Card>
                        <span className={styles.formHead}>Track Order</span>
                        <center className={styles.formSection}>
                            <div className={styles.productContainer}>
                                <label className={`${styles.formLabel} mb-4`}>
                                    Tracking ID<span className={styles.labelStamp}>*</span>
                                </label>
                                <div className={styles.tooltipContainer}>
                                <input
                                    className={styles.formInput}
                                    type="text"
                                    placeholder="Enter Tracking ID"
                                    name="tracking_id"
                                    // value={values.tracking_id}
                                    // onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all', ['tracking_id'], '-')}
                                    // onBlur={handleBlur}
                                />
                                {/* <span
                                    className={styles.infoTooltip}
                                    data-tooltip-id="tracking_id-tooltip"
                                    data-tooltip-content="Stock-keeping unit for inventory management"
                                >
                                    <img
                                    src={Information}
                                    className={styles.iconTooltip}
                                    alt="information"
                                    />
                                </span> */}
                                {/* <Tooltip className={styles.tooltipSec} id="tracking_id-tooltip" /> */}
                                </div>
                                {/* {touched.tracking_id && errors.tracking_id && (
                                <span className={styles.error}>{errors.tracking_id}</span>
                                )} */}
                            </div>
                        </center>
                    </Card>

                    <div className={styles.logisticsButtonContainer}>
                        <button className={styles.logisticsAccept}>
                            Track
                        </button>
                        <buttton className={styles.logisticsCancel}>
                            Cancel
                        </buttton>
                    </div>
                </form>

                <NewTrackingTimeline trackingData={trackingData} />
            </div>
    </Main>
  );
};

export default NewTracking;
