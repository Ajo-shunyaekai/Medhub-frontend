import React from 'react'
import styles from './productDetails.module.css'
import { HiOutlineDocumentText } from "react-icons/hi";
import Image from '../../../assets/images/product-details/para.webp'
import Image1 from '../../../assets/images/product-details/paracetamol.png'

const ProductDetails = () => {
    return (
        <div className={styles.container}>
            <span className={styles.heading}>Product Details</span>
            <div className={styles.section}>
                <div className={styles.mainContainer}>
                    <div className={styles.InnerContainer}>
                        <span className={styles.medicineName}>Paracetamol</span>
                        <button className={styles.editButton}>Edit</button>
                    </div>
                </div>
                {/* Start general information section */}
                <div className={styles.mainContainer}>
                    <div className={styles.innerSection}>
                        <div className={styles.mainSection}>
                            <div className={styles.medicinesSection}>
                                <span className={styles.medicineHead}>Product Category</span>
                                <span className={styles.medicineText}>Medical Equipment and Devices</span>
                            </div>
                            <div className={styles.medicinesSection}>
                                <span className={styles.medicineHead}>Product Sub Category</span>
                                <span className={styles.medicineText}>Diagnostic Tools</span>
                            </div>
                            <div className={styles.medicinesSection}>
                                <span className={styles.medicineHead}>Product Sub Category(Level3)</span>
                                <span className={styles.medicineText}>Imaging Tools </span>
                            </div>
                            <div className={styles.medicinesSection}>
                                <span className={styles.medicineHead}>Country of origin</span>
                                <span className={styles.medicineText}>India</span>
                            </div>
                            <div className={styles.medicinesSection}>
                                <span className={styles.medicineHead}>UPC</span>
                                <span className={styles.medicineText}>121313SDFF</span>
                            </div>
                            <div className={styles.medicinesSection}>
                                <span className={styles.medicineHead}>Part/Model Number</span>
                                <span className={styles.medicineText}>DS2312312</span>
                            </div>
                            <div className={styles.medicinesSection}>
                                <span className={styles.medicineHead}>Brand Name</span>
                                <span className={styles.medicineText}>Pharmaceutical Pv Ltd</span>
                            </div>
                        </div>
                        <div className={styles.mainSection}>

                            <div className={styles.medicinesSection}>
                                <span className={styles.medicineHead}>Type / Form</span>
                                <span className={styles.medicineText}>Bottle</span>
                            </div>
                            <div className={styles.medicinesSection}>
                                <span className={styles.medicineHead}>Product Quantity</span>
                                <span className={styles.medicineText}>21312124</span>
                            </div>
                            <div className={styles.medicinesSection}>
                                <span className={styles.medicineHead}>Product Size / Volumn</span>
                                <span className={styles.medicineText}>3645</span>
                            </div>
                            <div className={styles.medicinesSection}>
                                <span className={styles.medicineHead}>Product Weight</span>
                                <span className={styles.medicineText}>25235</span>
                            </div>
                            <div className={styles.medicinesSection}>
                                <span className={styles.medicineHead}>Product Packaging Type</span>
                                <span className={styles.medicineText}>Pump</span>
                            </div>
                            <div className={styles.medicinesSection}>
                                <span className={styles.medicineHead}>Product Packaging Material</span>
                                <span className={styles.medicineText}>Plastic</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* End general information section */}
                {/* Start product description */}
                <div className={styles.mainContainer}>
                    <div className={styles.manufacturerDescriptionSection}>
                        <span className={styles.medicineHead}>Product Description</span>
                        <span className={styles.medicineText}>Paracetamol is a medicine used to treat mild to moderate pain. Paracetamol can also be used to treat fever (high temperature). It's dangerous to take more than the recommended dose of paracetamol. Paracetamol overdose can damage your liver and cause death.</span>
                    </div>
                </div>
                {/* End the product description */}

                {/* Start Inventory & Packaging section */}
                <div className={styles.mainContainer}>
                    <div className={styles.innerMainSection}>
                        <div className={styles.inventorySection}>
                            <div className={styles.mainSection}>
                                <div className={styles.medicinesSection}>
                                    <span className={styles.medicineHead}>SKU</span>
                                    <span className={styles.medicineText}>SKU1233</span>
                                </div>
                                <div className={styles.medicinesSection}>
                                    <span className={styles.medicineHead}>Date of Manufacture</span>
                                    <span className={styles.medicineText}>03-03-2025</span>
                                </div>

                            </div>
                            <div className={styles.mainSection}>
                                <div className={styles.medicinesSection}>
                                    <span className={styles.medicineHead}>Stock</span>
                                    <span className={styles.medicineText}>Imaging Tools </span>
                                </div>
                                <div className={styles.medicinesSection}>
                                    <span className={styles.medicineHead}>Stocked in Country</span>
                                    <span className={styles.medicineText}>India</span>
                                </div>

                            </div>
                        </div>
                        <div className={styles.inventorySection}>
                            <div className={styles.mainSection}>
                                <div className={styles.medicinesSection}>
                                    <span className={styles.medicineHead}>Countries where Stock Trades</span>
                                    <span className={styles.medicineHead}>Quantity</span>
                                </div>
                                <div className={styles.medicinesSection}>
                                    <span className={styles.medicineHead}>United Arab Emirates</span>
                                    <span className={styles.medicineText}>112 Pack</span>
                                </div>
                                <div className={styles.medicinesSection}>
                                    <span className={styles.medicineHead}>United Kingdom</span>
                                    <span className={styles.medicineText}>225 Box</span>
                                </div>

                                <div className={styles.medicinesSection}>
                                    <span className={styles.medicineHead}>China</span>
                                    <span className={styles.medicineText}>112 Strip</span>
                                </div>

                                <div className={styles.medicinesSection}>
                                    <span className={styles.medicineHead}>Pakistan</span>
                                    <span className={styles.medicineText}>250 Pack</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End Inventory & Packaging section */}
                {/* Start product inventory section */}
                <div className={styles.mainContainer}>
                    <div className={styles.productImageSection}>
                        <div className={styles.imageContainer}>
                            <img className={styles.imageSection} src={Image} alt='image' />
                        </div>
                        <div className={styles.imageContainer}>
                            <img className={styles.imageSection} src={Image1} alt='image' />
                        </div>
                        <div className={styles.imageContainer}>
                            <img className={styles.imageSection} src={Image} alt='image' />
                        </div>
                        <div className={styles.imageContainer}>
                            <img className={styles.imageSection} src={Image1} alt='image' />
                        </div>
                    </div>
                </div>
                {/* End product inventory section */}

                {/* Start the product inventory section */}
                <div className={styles.mainContainer}>
                    <div className={styles.innerInventorySection}>
                        <div className={styles.inventorySection}>
                            <div className={styles.inventoryContainer}>
                                <span className={styles.inventoryHead}>Quantity</span>
                                <span className={styles.inventoryInput}>0-500</span>
                            </div>
                            <div className={styles.inventoryContainer}>
                                <span className={styles.inventoryHead}>Cost Per Product</span>
                                <span className={styles.inventoryInput}>2 USD</span>
                            </div>
                            <div className={styles.inventoryContainer}>
                                <span className={styles.inventoryHead}>Est. Delivery Time</span>
                                <span className={styles.inventoryInput}>4</span>
                            </div>
                        </div>
                        <div className={styles.inventorySection}>
                            <div className={styles.inventoryContainer}>
                                <span className={styles.inventoryHead}>Quantity</span>
                                <span className={styles.inventoryInput}>0-500</span>
                            </div>
                            <div className={styles.inventoryContainer}>
                                <span className={styles.inventoryHead}>Cost Per Product</span>
                                <span className={styles.inventoryInput}>2 USD</span>
                            </div>
                            <div className={styles.inventoryContainer}>
                                <span className={styles.inventoryHead}>Est. Delivery Time</span>
                                <span className={styles.inventoryInput}>4</span>
                            </div>
                        </div>
                        <div className={styles.inventorySection}>
                            <div className={styles.inventoryContainer}>
                                <span className={styles.inventoryHead}>Quantity</span>
                                <span className={styles.inventoryInput}>0-500</span>
                            </div>
                            <div className={styles.inventoryContainer}>
                                <span className={styles.inventoryHead}>Cost Per Product</span>
                                <span className={styles.inventoryInput}>2 USD</span>
                            </div>
                            <div className={styles.inventoryContainer}>
                                <span className={styles.inventoryHead}>Est. Delivery Time</span>
                                <span className={styles.inventoryInput}>4</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End the product inventory section */}
            </div>
        </div >
    )
}

export default ProductDetails
