import React from 'react';
import styles from './NewShipment.module.css';
import Main from '../UI/Main/Main';

function NewShipment() {
  return (
    <Main title='Shipment'>
        <div className={styles.shipmentContainer}>
            <form>
                <div className={`${styles.section}`}>
                    <span className={styles.formHead}>Shipment From</span>
                    <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                        <label className={styles.formLabel}>
                        From<span className={styles.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                        <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Address"
                            name="from"
                            // value={values.from}
                            // onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all', ['from'], '-')}
                            // onBlur={handleBlur}
                        />
                        {/* <span
                            className={styles.infoTooltip}
                            data-tooltip-id="from-tooltip"
                            data-tooltip-content="Stock-keeping unit for inventory management"
                            >
                            <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                            />
                            </span> */}
                        {/* <Tooltip className={styles.tooltipSec} id="sku-tooltip" /> */}
                        </div>
                        {/* {touched.from && errors.from && (
                            <span className={styles.error}>{errors.from}</span>
                        )} */}
                    </div>
                    <div className={styles.productContainer}>
                        <label className={styles.formLabel}>
                        City
                        <span className={styles.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                        <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter City"
                            name="from_city"
                            // value={values.from_city}
                            // onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all', ['from_city'], '-')}
                            // onBlur={handleBlur}
                        />
                        {/* <span
                            className={styles.infoTooltip}
                            data-tooltip-id="from_city-tooltip"
                            data-tooltip-content="The date when the item was assembled or manufactured. if applicable for in stock"
                            >
                            <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                            />
                            </span> */}
                        {/* <Tooltip className={styles.tooltipSec} id="from_city-tooltip" /> */}
                        </div>
                        {/* {touched.from_city && errors.from_city && (
                            <span className={styles.error}>{errors.from_city}</span>
                        )} */}
                    </div>
                    <div className={styles.productContainer}>
                        <label className={styles.formLabel}>
                        Pincode
                        <span className={styles.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                        <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Pincode"
                            name="from_pincode"
                            // value={values.from_pincode}
                            // onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all', ['from_pincode'], '-')}
                            // onBlur={handleBlur}
                        />
                        {/* <span
                            className={styles.infoTooltip}
                            data-tooltip-id="from_pincode-tooltip"
                            data-tooltip-content="The date when the item was assembled or manufactured. if applicable for in stock"
                            >
                            <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                            />
                            </span> */}
                        {/* <Tooltip className={styles.tooltipSec} id="from_pincode-tooltip" /> */}
                        </div>
                        {/* {touched.from_pincode && errors.from_pincode && (
                            <span className={styles.error}>{errors.from_pincode}</span>
                        )} */}
                    </div>
                    {/* <div className={styles.productContainer}>
                        <label className={styles.formLabel}>
                        Warehouse status<span className={styles.labelStamp}>*</span>
                        </label>
                        <Select
                        className={styles.formSelect}
                        options={warehouse_status_options}
                        value={selectedCategory}
                        onBlur={handleBlur}
                        onChange={(selectedOption) => {
                            setFieldValue("category", selectedOption?.value);
                            setSelectedCategory(selectedOption);
                            setSelectedSubCategory(null);
                            setFieldValue("subCategory", "");
                            setSelectedLevel3Category(null);
                            setFieldValue("anotherCategory", "");
                        }}
                        placeholder="Warehouse Status"
                        />
                        {touched.warehouse_status && errors.warehouse_status && (
                            <span className={styles.error}>{errors.warehouse_status}</span>
                        )}
                    </div> */}
                    </div>
                </div>

                <div className={`${styles.section} mt-4`}>
                    <span className={styles.formHead}>Shipment To</span>
                    <div className={styles.formSection}>
                    <div className={styles.productContainer}>
                        <label className={styles.formLabel}>
                        To<span className={styles.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                        <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Address"
                            name="to"
                            // value={values.to}
                            // onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all', ['to'], '-')}
                            // onBlur={handleBlur}
                        />
                        {/* <span
                            className={styles.infoTooltip}
                            data-tooltip-id="to-tooltip"
                            data-tooltip-content="Stock-keeping unit for inventory management"
                            >
                            <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                            />
                            </span> */}
                        {/* <Tooltip className={styles.tooltipSec} id="sku-tooltip" /> */}
                        </div>
                        {/* {touched.to && errors.to && (
                            <span className={styles.error}>{errors.to}</span>
                        )} */}
                    </div>
                    <div className={styles.productContainer}>
                        <label className={styles.formLabel}>
                        City
                        <span className={styles.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                        <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter City"
                            name="to_city"
                            // value={values.warehouse_id}
                            // onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all', ['to_city'], '-')}
                            // onBlur={handleBlur}
                        />
                        {/* <span
                            className={styles.infoTooltip}
                            data-tooltip-id="to_city-tooltip"
                            data-tooltip-content="The date when the item was assembled or manufactured. if applicable for in stock"
                            >
                            <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                            />
                            </span> */}
                        {/* <Tooltip className={styles.tooltipSec} id="to_city-tooltip" /> */}
                        </div>
                        {/* {touched.to_city && errors.to_city && (
                            <span className={styles.error}>{errors.to_city}</span>
                        )} */}
                    </div>
                    <div className={styles.productContainer}>
                        <label className={styles.formLabel}>
                        Pincode
                        <span className={styles.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                        <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Pincode"
                            name="to_pincode"
                            // value={values.to_pincode}
                            // onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all', ['to_pincode'], '-')}
                            // onBlur={handleBlur}
                        />
                        {/* <span
                            className={styles.infoTooltip}
                            data-tooltip-id="to_pincode-tooltip"
                            data-tooltip-content="The date when the item was assembled or manufactured. if applicable for in stock"
                            >
                            <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                            />
                            </span> */}
                        {/* <Tooltip className={styles.tooltipSec} id="warehouse_name-tooltip" /> */}
                        </div>
                        {/* {touched.to_pincode && errors.to_pincode && (
                            <span className={styles.error}>{errors.to_pincode}</span>
                        )} */}
                    </div>
                    {/* <div className={styles.productContainer}>
                        <label className={styles.formLabel}>
                        Warehouse status<span className={styles.labelStamp}>*</span>
                        </label>
                        <Select
                        className={styles.formSelect}
                        options={warehouse_status_options}
                        value={selectedCategory}
                        onBlur={handleBlur}
                        onChange={(selectedOption) => {
                            setFieldValue("category", selectedOption?.value);
                            setSelectedCategory(selectedOption);
                            setSelectedSubCategory(null);
                            setFieldValue("subCategory", "");
                            setSelectedLevel3Category(null);
                            setFieldValue("anotherCategory", "");
                        }}
                        placeholder="Warehouse Status"
                        />
                        {touched.warehouse_status && errors.warehouse_status && (
                            <span className={styles.error}>{errors.warehouse_status}</span>
                        )}
                    </div> */}
                    </div>
                </div>

                <div className={styles.logisticsButtonContainer}>
                    <button className={styles.logisticsAccept}>Submit</button>
                    <buttton className={styles.logisticsCancel}>Cancel</buttton>
                </div>
            </form>
        </div>
    </Main>
  )
}

export default NewShipment;
