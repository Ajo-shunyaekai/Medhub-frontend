import React from "react";
import styles from './AddVehicle.module.css';
import Select from "react-select";
import Section from "../../UI/Section";

const AddVehicle = () => {

  const vehicle_status_options = [
    { value : 'active',     label : 'Active' },
    { value : 'in-active',  label : 'In-Active' },
  ];
  const type_of_transport_options = [
    { value : 'road',   label : 'By-Road' },
    { value : 'air',    label : 'By-Air' },
    { value : 'water',  label : 'By-Water' },
    { value : 'train',  label : 'By-Train' },
  ]

  return (
    <>
      <Section classes={styles.AddVehileMainContainer}>
        <div className={styles.orderName}>Add Vehicle</div>
        <form>
          <div className={`${styles.section} mt-4`}>
            <span className={styles.formHead}>Vehicle Details</span>
              <div className={styles.formSection}>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Vehicle ID<span className={styles.labelStamp}>*</span>
                  </label>
                  <div className={styles.tooltipContainer}>
                    <input
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Vehicle ID"
                      name="vehicle_id"
                      // value={values.vehicle_id}
                      // onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all', ['vehicle_id'], '-')}
                      // onBlur={handleBlur}
                    />
                    {/* <span
                      className={styles.infoTooltip}
                      data-tooltip-id="vehicle_id-tooltip"
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
                  {/* {touched.vehicle_id && errors.vehicle_id && (
                    <span className={styles.error}>{errors.vehicle_id}</span>
                  )} */}
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Vehicle Name
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <div className={styles.tooltipContainer}>
                  <input
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Name"
                      name="vehicle_name"
                      // value={values.warehouse_id}
                      // onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all', ['vehicle_name'], '-')}
                      // onBlur={handleBlur}
                    />
                    {/* <span
                      className={styles.infoTooltip}
                      data-tooltip-id="vehicle_name-tooltip"
                      data-tooltip-content="The date when the item was assembled or manufactured. if applicable for in stock"
                    >
                      <img
                        src={Information}
                        className={styles.iconTooltip}
                        alt="information"
                      />
                    </span> */}
                    {/* <Tooltip className={styles.tooltipSec} id="vehicle_name-tooltip" /> */}
                  </div>
                  {/* {touched.vehicle_name && errors.vehicle_name && (
                    <span className={styles.error}>{errors.vehicle_name}</span>
                  )} */}
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Driver Name
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <div className={styles.tooltipContainer}>
                  <input
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Driver Name"
                      name="driver_name"
                      // value={values.warehouse_id}
                      // onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all', ['driver_name'], '-')}
                      // onBlur={handleBlur}
                    />
                    {/* <span
                      className={styles.infoTooltip}
                      data-tooltip-id="driver_name-tooltip"
                      data-tooltip-content="The date when the item was assembled or manufactured. if applicable for in stock"
                    >
                      <img
                        src={Information}
                        className={styles.iconTooltip}
                        alt="information"
                      />
                    </span> */}
                    {/* <Tooltip className={styles.tooltipSec} id="driver_name-tooltip" /> */}
                  </div>
                  {/* {touched.driver_name && errors.driver_name && (
                    <span className={styles.error}>{errors.driver_name}</span>
                  )} */}
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Contact Number
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <div className={styles.tooltipContainer}>
                  <input
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Contact Number"
                      name="contact_number"
                      maxLength={12}
                      inputMode="numeric"
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, "");
                      }}
                      // value={values.warehouse_id}
                      // onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all', ['contact_number'], '-')}
                      // onBlur={handleBlur}
                    />
                    {/* <span
                      className={styles.infoTooltip}
                      data-tooltip-id="contact_number-tooltip"
                      data-tooltip-content="The date when the item was assembled or manufactured. if applicable for in stock"
                    >
                      <img
                        src={Information}
                        className={styles.iconTooltip}
                        alt="information"
                      />
                    </span> */}
                    {/* <Tooltip className={styles.tooltipSec} id="contact_number-tooltip" /> */}
                  </div>
                  {/* {touched.contact_number && errors.contact_number && (
                    <span className={styles.error}>{errors.contact_number}</span>
                  )} */}
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Load Capacity
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <div className={styles.tooltipContainer}>
                  <input
                      className={styles.formInput}
                      type="text"
                      placeholder="Enter Capacity"
                      name="load_capacity"
                      maxLength={7}
                      inputMode="numeric"
                      onInput={(e) => {
                        e.target.value = e.target.value.replace(/\D/g, "");
                      }}
                      // value={values.warehouse_id}
                      // onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all', ['load_capacity'], '-')}
                      // onBlur={handleBlur}
                    />
                    {/* <span
                      className={styles.infoTooltip}
                      data-tooltip-id="load_capacity-tooltip"
                      data-tooltip-content="The date when the item was assembled or manufactured. if applicable for in stock"
                    >
                      <img
                        src={Information}
                        className={styles.iconTooltip}
                        alt="information"
                      />
                    </span> */}
                    {/* <Tooltip className={styles.tooltipSec} id="load_capacity-tooltip" /> */}
                  </div>
                  {/* {touched.load_capacity && errors.load_capacity && (
                    <span className={styles.error}>{errors.load_capacity}</span>
                  )} */}
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Type of Transport
                    <span className={styles.labelStamp}>*</span>
                  </label>
                  <Select
                    className={styles.formSelect}
                    options={type_of_transport_options}
                    // value={selectedCategory}
                    // onBlur={handleBlur}
                    // onChange={(selectedOption) => {
                    //   setFieldValue("category", selectedOption?.value);
                    //   setSelectedCategory(selectedOption);
                    //   setSelectedSubCategory(null);
                    //   setFieldValue("subCategory", "");
                    //   setSelectedLevel3Category(null);
                    //   setFieldValue("anotherCategory", "");
                    // }}
                    placeholder="Type of Transport"
                  />
                  {/* {touched.prefered_transport && errors.prefered_transport && (
                    <span className={styles.error}>{errors.prefered_transport}</span>
                  )} */}
                </div>
                <div className={styles.productContainer}>
                  <label className={styles.formLabel}>
                    Vehicle status<span className={styles.labelStamp}>*</span>
                  </label>
                  <Select
                    className={styles.formSelect}
                    options={vehicle_status_options}
                    // value={selectedCategory}
                    // onBlur={handleBlur}
                    // onChange={(selectedOption) => {
                    //   setFieldValue("category", selectedOption?.value);
                    //   setSelectedCategory(selectedOption);
                    //   setSelectedSubCategory(null);
                    //   setFieldValue("subCategory", "");
                    //   setSelectedLevel3Category(null);
                    //   setFieldValue("anotherCategory", "");
                    // }}
                    placeholder="Vehicle Status"
                  />
                  {/* {touched.warehouse_status && errors.vehicle_status && (
                    <span className={styles.error}>{errors.vehicle_status}</span>
                  )} */}
                </div>
              </div>
          </div>

          

          <div className={styles.logisticsButtonContainer}>
            <button className={styles.logisticsAccept}>
              Submit
            </button>
            <buttton className={styles.logisticsCancel}>
              Cancel
            </buttton>
          </div>
        </form>
      </Section>
    </>
  );
};
export default AddVehicle;
