import React from 'react';
import styles from './addproduct.module.css';
import '../SharedComponents/Signup/signup.css'
import ImageAddUploader from './ImageAppUploader';
import AddPdfUpload from './AddPdfUpload';
const AddProduct = () => {
    return (
        <div className={styles.container}>
            <span className={styles.heading}>Products</span>
            <form className={styles.form}>
                <div className={styles.section}>
                    <span className={styles.formHead}>General Information</span>
                    <div className={styles.formSection}>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Name</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Product Name'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Type</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Product Type'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>
                             Product Category
                            </label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Strength'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Sub Catgory</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Tax%'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Sub Category (Level 3)</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Type of Form'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Description</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Shelf Life'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Manufacturer </label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Dossier Type'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Country of Origin</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Dossier Type'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>UPC</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter UPC'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Part/Model Number</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Dossier Status'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Brand Name</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Brand Name'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Type/Form</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Dossier Status'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Dossier Status</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Dossier Status'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Dossier Status</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Dossier Status'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Dossier Status</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Dossier Status'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Dossier Status</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Dossier Status'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Dossier Status</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Dossier Status'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Dossier Status</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Dossier Status'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Dossier Status</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Dossier Status'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Available For</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Dossier Status'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Tags</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Tags'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Product Description</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Product Description'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                    </div>

                </div>


                <div className={styles.section}>
                    <span className={styles.formHead}>Inventory & Packaging</span>
                    <div className={styles.formSection}>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                    </div>

                </div>




                <div className={styles.section}>
                    <span className={styles.formHead}>Compliances & Certification</span>
                    <div className={styles.formSection}>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                    </div>

                </div>



                <div className={styles.section}>
                    <span className={styles.formHead}>Storage & Handling</span>
                    <div className={styles.formSection}>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                    </div>
                </div>



                <div className={styles.section}>
                    <span className={styles.formHead}>Additional Information</span>
                    <div className={styles.formSection}>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                    </div>
                </div>



                <div className={styles.section}>
                    <span className={styles.formHead}>Health & Safety</span>
                    <div className={styles.formSection}>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>

                        <div className={styles.productContainer}>
                            <label className={styles.formLabel}>Total Quantity</label>
                            <input
                                className={styles.formInput}
                                type='text'
                                name='totalQuantity'
                                placeholder='Enter Total Quantity'
                                autoComplete='off'
                            />
                            <span className={styles.error}></span>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AddProduct;