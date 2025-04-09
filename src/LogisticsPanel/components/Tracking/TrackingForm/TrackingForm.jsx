import React from "react";
import styles from './TrackingForm.module.css';
import Select from "react-select";

const Tracking = () => {

    return (
    <>
      <div className="order-main-container">
        <div className={`${styles.orderName}`}>Tracking</div>
        <form>
            <div className={`${styles.section} mt-4`}>
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
            </div>

            <div className={styles.logisticsButtonContainer}>
            <button className={styles.logisticsAccept}>
                Track
            </button>
            <buttton className={styles.logisticsCancel}>
                Cancel
            </buttton>
            </div>
        </form>
      </div>
    </>
  );
};

export default Tracking;
