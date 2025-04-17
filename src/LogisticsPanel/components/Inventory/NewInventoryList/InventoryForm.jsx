import React, { useState } from "react";
import Select from "react-select";
import styles from "./InventoryForm.module.css";
import CloseIcon from "@mui/icons-material/Close";
import Main from "../../UI/Main/Main";
import Card from '../../UI/FormCard/FormCard';

function InventoryForm() {
    const [product, setProduct] = useState([
        {
            product_id       : Date.now().toString(),
            product_name     : "",
            product_quantity : "",
            product_weight   : "",
        },
        ]);

    const warehouse_status_options = [
    { value: "active",    label: "Active" },
    { value: "in-active", label: "In-Active" },
    ];
    const product_unit_of_measure_options = [
    { value: "envelops",  label: "Envelops" },
    { value: "pieces",    label: "Pieces" },
    { value: "boxes",     label: "Boxes" },
    ];
    const prefered_transport_options = [
    { value: "road",  label: "By-Road" },
    { value: "air",   label: "By-Air" },
    { value: "water", label: "By-Water" },
    { value: "train", label: "By-Train" },
    ];

    const handleInputChange = (index, field, value) => {
    const updatedProducts = [...product];
    updatedProducts[index][field] = value;
    setProduct(updatedProducts);
    };
    
    const handleAddNewProducts = () => {
    setProduct([
        ...product,
        {
        product_id       : Date.now().toString(),
        product_name     : "",
        product_quantity : "",
        product_weight   : "",
        },
    ]);
    };

    const handleRemoveProduct = (index) => {
    setProduct((prevProducts) => prevProducts.filter((_, i) => i !== index));
    };

  return (
    <Main title='Inventory'>
        <div className={styles.inventoryContainer}>
            <form>
                <Card>
                    <span className={styles.formHead}>Warehouse Details</span>
                    <div className={styles.formSection}>
                        <div className={styles.productContainer}>
                        <label className={styles.formLabel}>
                            Warehouse ID<span className={styles.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                            <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Warehouse ID"
                            name="warehouse_id"
                            // value={values.warehouse_id}
                            // onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all', ['warehouse_id'], '-')}
                            // onBlur={handleBlur}
                            />
                            {/* <span
                                className={styles.infoTooltip}
                                data-tooltip-id="warehouse_id-tooltip"
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
                        {/* {touched.warehouse_id && errors.warehouse_id && (
                            <span className={styles.error}>{errors.warehouse_id}</span>
                            )} */}
                        </div>
                        <div className={styles.productContainer}>
                        <label className={styles.formLabel}>
                            Warehouse Name
                            <span className={styles.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                            <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Name"
                            name="warehouse_name"
                            // value={values.warehouse_id}
                            // onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all', ['warehouse_name'], '-')}
                            // onBlur={handleBlur}
                            />
                            {/* <span
                                className={styles.infoTooltip}
                                data-tooltip-id="warehouse_name-tooltip"
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
                        {/* {touched.warehouse_name && errors.warehouse_name && (
                            <span className={styles.error}>{errors.warehouse_name}</span>
                            )} */}
                        </div>
                        <div className={styles.productContainer}>
                        <label className={styles.formLabel}>
                            Warehouse Address
                            <span className={styles.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                            <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Address"
                            name="warehouse_address"
                            // value={values.warehouse_id}
                            // onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all', ['warehouse_address'], '-')}
                            // onBlur={handleBlur}
                            />
                            {/* <span
                                className={styles.infoTooltip}
                                data-tooltip-id="warehouse_address-tooltip"
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
                        {/* {touched.warehouse_address && errors.warehouse_address && (
                            <span className={styles.error}>{errors.warehouse_address}</span>
                            )} */}
                        </div>
                        <div className={styles.productContainer}>
                        <label className={styles.formLabel}>
                            Warehouse status<span className={styles.labelStamp}>*</span>
                        </label>
                        <Select
                            className={styles.formSelect}
                            options={warehouse_status_options}
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
                            placeholder="Warehouse Status"
                        />
                        {/* {touched.warehouse_status && errors.warehouse_status && (
                            <span className={styles.error}>{errors.warehouse_status}</span>
                            )} */}
                        </div>
                    </div>
                </Card>
    
                <Card>
                    {/* <span className={styles.formHead}>Product Registration</span> */}
                    <div className={styles.formHeadSection}>
                        <span className={styles.formHead}>Product Registration</span>
                        <span
                        className={styles.formAddButton}
                        // onClick={() => {
                        //   setFieldValue("productPricingDetails", [
                        //     ...values.productPricingDetails,
                        //     {
                        //       quantity: "",
                        //       price: "",
                        //       deliveryTime: "",
                        //     },
                        //   ]);
                        // }}
                        onClick={handleAddNewProducts}
                        >
                        Add More
                        </span>
                    </div>
                    <div className={styles.formSection}>
                        {/* {product.flatMap(url => Array(1).fill(url)).map((url, index) => ( */}
                        {product.map((item, index) => (
                        <>
                            <div key={item.product_id} className={styles.formSection}>
                            <div className={styles.productContainer}>
                                <label className={styles.formLabel}>
                                Product ID<span className={styles.labelStamp}>*</span>
                                </label>
                                <div className={styles.tooltipContainer}>
                                <input
                                    className={styles.formInput}
                                    type="text"
                                    placeholder="Enter Product ID"
                                    name="product_id"
                                    onChange={(e) => handleInputChange(index, "product_id", e.target.value)}
                                    // value={values.warehouse_id}
                                    // onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all', ['product_id'], '-')}
                                    // onBlur={handleBlur}
                                />
                                {/* <span
                                    className={styles.infoTooltip}
                                    data-tooltip-id="product_id-tooltip"
                                    data-tooltip-content="Stock-keeping unit for inventory management"
                                >
                                    <img
                                    src={Information}
                                    className={styles.iconTooltip}
                                    alt="information"
                                    />
                                </span> */}
                                {/* <Tooltip className={styles.tooltipSec} id="product_id-tooltip" /> */}
                                </div>
                                {/* {touched.product_id && errors.product_id && (
                                <span className={styles.error}>{errors.product_id}</span>
                                )} */}
                            </div>
                            <div className={styles.productContainer}>
                                <label className={styles.formLabel}>
                                Product Name
                                <span className={styles.labelStamp}>*</span>
                                </label>
                                <div className={styles.tooltipContainer}>
                                <input
                                    className={styles.formInput}
                                    type="text"
                                    placeholder="Enter Product name"
                                    name="product_name"
                                    onChange={(e) => handleInputChange(index, "product_name", e.target.value)}
                                    // value={values.warehouse_id}
                                    // onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all', ['product_name'], '-')}
                                    // onBlur={handleBlur}
                                />
                                {/* <span
                                    className={styles.infoTooltip}
                                    data-tooltip-id="warehouse_name-tooltip"
                                    data-tooltip-content="The date when the item was assembled or manufactured. if applicable for in stock"
                                >
                                    <img
                                    src={Information}
                                    className={styles.iconTooltip}
                                    alt="information"
                                    />
                                </span> */}
                                {/* <Tooltip className={styles.tooltipSec} id="product_name-tooltip" /> */}
                                </div>
                                {/* {touched.product_name && errors.product_name && (
                                <span className={styles.error}>{errors.product_name}</span>
                                )} */}
                            </div>
                            <div className={styles.productContainer}>
                                <label className={styles.formLabel}>
                                Product Quantity
                                <span className={styles.labelStamp}>*</span>
                                </label>
                                <div className={styles.tooltipContainer}>
                                <input
                                    className={styles.formInput}
                                    type="text"
                                    placeholder="Enter Quantity"
                                    name="product_quantity"
                                    onChange={(e) => handleInputChange(index, "product_quantity", e.target.value)}
                                    // onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all', ['product_quantity'], '-')}
                                    // onBlur={handleBlur}
                                />
                                {/* <span
                                    className={styles.infoTooltip}
                                    data-tooltip-id="product_quantity-tooltip"
                                    data-tooltip-content="The date when the item was assembled or manufactured. if applicable for in stock"
                                    >
                                    <img
                                        src={Information}
                                        className={styles.iconTooltip}
                                        alt="information"
                                    />
                                    </span> */}
                                {/* <Tooltip className={styles.tooltipSec} id="product_quantity-tooltip" /> */}
                                </div>
                                {/* {touched.product_quantity && errors.product_quantity && (
                                    <span className={styles.error}>{errors.product_quantity}</span>
                                )} */}
                            </div>
                            <div className={styles.productContainer}>
                                <label className={styles.formLabel}>
                                Product Weight
                                <span className={styles.labelStamp}>*</span>
                                </label>
                                <div className={styles.tooltipContainer}>
                                <input
                                    className={styles.formInput}
                                    type="text"
                                    placeholder="Enter Product Weight"
                                    name="product_quantity"
                                    onChange={(e) => handleInputChange(index, "product_weight", e.target.value)}
                                    // onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all', ['product_weight'], '-')}
                                    // onBlur={handleBlur}
                                />
                                {/* <span
                                    className={styles.infoTooltip}
                                    data-tooltip-id="product_weight-tooltip"
                                    data-tooltip-content="The date when the item was assembled or manufactured. if applicable for in stock"
                                    >
                                    <img
                                        src={Information}
                                        className={styles.iconTooltip}
                                        alt="information"
                                    />
                                    </span> */}
                                {/* <Tooltip className={styles.tooltipSec} id="product_weight-tooltip" /> */}
                                </div>
                                {/* {touched.product_weight && errors.product_weight && (
                                    <span className={styles.error}>{errors.product_weight}</span>
                                )} */}
                            </div>
        
                            {product.length > 1 && (
                            <div
                                className={styles.formCloseSection}
                                onClick={() => handleRemoveProduct(index)}
                            >
                                <span className={styles.formclose}>
                                <CloseIcon className={styles.icon} />
                                </span>
                            </div>
                            )}
                            </div>
                        </>
                        ))}
        
                        <div className={styles.productContainer}>
                        <label className={styles.formLabel}>
                            Batch Number
                            <span className={styles.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                            <input
                            className={styles.formInput}
                            type="text"
                            placeholder="Enter Batch Number"
                            name="batch_number"
                            // onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all', ['batch_number'], '-')}
                            // onBlur={handleBlur}
                            />
                            {/* <span
                                className={styles.infoTooltip}
                                data-tooltip-id="product_quantity-tooltip"
                                data-tooltip-content="The date when the item was assembled or manufactured. if applicable for in stock"
                            >
                                <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                                />
                            </span> */}
                            {/* <Tooltip className={styles.tooltipSec} id="batch_number-tooltip" /> */}
                        </div>
                        {/* {touched.batch_number && errors.batch_number && (
                            <span className={styles.error}>{errors.batch_number}</span>
                            )} */}
                        </div>
                        <div className={styles.productContainer}>
                        <label className={styles.formLabel}>
                            Unit of Measurement
                            <span className={styles.labelStamp}>*</span>
                        </label>
                        <Select
                            className={styles.formSelect}
                            options={product_unit_of_measure_options}
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
                            placeholder="Unit of Measurement"
                        />
                        {/* {touched.warehouse_status && errors.warehouse_status && (
                            <span className={styles.error}>{errors.warehouse_status}</span>
                            )} */}
                        </div>
                        <div className={styles.productContainer}>
                        <label className={styles.formLabel}>
                            Date of Receiving
                            <span className={styles.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                            <input
                            className={styles.formInput}
                            type="date"
                            placeholder="Enter receiving date"
                            name="date_of_receiving"
                            // onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all', ['date_of_receiving'], '-')}
                            // onBlur={handleBlur}
                            />
                            {/* <span
                                className={styles.infoTooltip}
                                data-tooltip-id="product_quantity-tooltip"
                                data-tooltip-content="The date when the item was assembled or manufactured. if applicable for in stock"
                            >
                                <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                                />
                            </span> */}
                            {/* <Tooltip className={styles.tooltipSec} id="date_of_receiving-tooltip" /> */}
                        </div>
                        {/* {touched.date_of_receiving && errors.date_of_receiving && (
                            <span className={styles.error}>{errors.date_of_receiving}</span>
                            )} */}
                        </div>
                        <div className={styles.productContainer}>
                        <label className={styles.formLabel}>
                            Estimated Delivery Date
                            <span className={styles.labelStamp}>*</span>
                        </label>
                        <div className={styles.tooltipContainer}>
                            <input
                            className={styles.formInput}
                            type="date"
                            placeholder="Enter deliery date"
                            name="estimate_delivery"
                            // onChange={(e) => handleInputChange(e, setFieldValue, 20, 'all', ['estimate_delivery'], '-')}
                            // onBlur={handleBlur}
                            />
                            {/* <span
                                className={styles.infoTooltip}
                                data-tooltip-id="product_quantity-tooltip"
                                data-tooltip-content="The date when the item was assembled or manufactured. if applicable for in stock"
                            >
                                <img
                                src={Information}
                                className={styles.iconTooltip}
                                alt="information"
                                />
                            </span> */}
                            {/* <Tooltip className={styles.tooltipSec} id="estimate_delivery-tooltip" /> */}
                        </div>
                        {/* {touched.estimate_delivery && errors.estimate_delivery && (
                            <span className={styles.error}>{errors.estimate_delivery}</span>
                            )} */}
                        </div>
                        <div className={styles.productContainer}>
                        <label className={styles.formLabel}>
                            Prefered Transporation
                            <span className={styles.labelStamp}>*</span>
                        </label>
                        <Select
                            className={styles.formSelect}
                            options={prefered_transport_options}
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
                            placeholder="Prefered Transportation"
                        />
                        {/* {touched.prefered_transport && errors.prefered_transport && (
                            <span className={styles.error}>{errors.prefered_transport}</span>
                            )} */}
                        </div>
                    </div>
                </Card>
    
                <div className={styles.logisticsButtonContainer}>
                    <button className={styles.logisticsAccept}>Submit</button>
                    <buttton className={styles.logisticsCancel}>Cancel</buttton>
                </div>
            </form>
        </div>
    </Main>
  )
}

export default InventoryForm;