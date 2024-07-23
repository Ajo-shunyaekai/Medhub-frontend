import React, { useState } from 'react'
import productDetails from '../style/productDetails.css';
import Tablet from '../assest/tablet.png'
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';


const ProductDetailsCard = ({similarMedicines, onMedicineClick, totalItems, currentPage, itemsPerPage, handlePageChange }) => {
    const products = [
        { id: 1, name: 'Amlodipine', substance: 'flunarizine', origin: 'Dubai UAE', stock: 450, dossierType: 'EU CTU', dossierStatus: 'Ready to file', gmp: 'GU EMP' },
        { id: 2, name: 'Atorvastatin', substance: 'flunarizine', origin: 'Dubai UAE', stock: 450, dossierType: 'EU CTU', dossierStatus: 'Ready to file', gmp: 'GU EMP' },
        { id: 3, name: 'Metformin', substance: 'flunarizine', origin: 'Dubai UAE', stock: 450, dossierType: 'EU CTU', dossierStatus: 'Ready to file', gmp: 'GU EMP' },
        { id: 4, name: 'Omeprazole', substance: 'flunarizine', origin: 'Dubai UAE', stock: 450, dossierType: 'EU CTU', dossierStatus: 'Ready to file', gmp: 'GU EMP' },
        { id: 5, name: 'Albuterol', substance: 'flunarizine', origin: 'Dubai UAE', stock: 450, dossierType: 'EU CTU', dossierStatus: 'Ready to file', gmp: 'GU EMP' },
        { id: 6, name: 'Cephalexin', substance: 'flunarizine', origin: 'Dubai UAE', stock: 450, dossierType: 'EU CTU', dossierStatus: 'Ready to file', gmp: 'GU EMP' },
        { id: 7, name: 'Gabapentin', substance: 'flunarizine', origin: 'Dubai UAE', stock: 450, dossierType: 'EU CTU', dossierStatus: 'Ready to file', gmp: 'GU EMP' },
        { id: 8, name: 'Levothyroxine', substance: 'flunarizine', origin: 'Dubai UAE', stock: 450, dossierType: 'EU CTU', dossierStatus: 'Ready to file', gmp: 'GU EMP' },
        { id: 9, name: 'Losartan', substance: 'flunarizine', origin: 'Dubai UAE', stock: 450, dossierType: 'EU CTU', dossierStatus: 'Ready to file', gmp: 'GU EMP' },
        { id: 10, name: 'Esomeprazole', substance: 'flunarizine', origin: 'Dubai UAE', stock: 450, dossierType: 'EU CTU', dossierStatus: 'Ready to file', gmp: 'GU EMP' },
    ];

    const totalProducts = Math.ceil(totalItems / itemsPerPage);
    return (
        <>
        
           <div className='product-details-card-section-heading'>Other products</div>
            <div className='secondary-product-details-main-section'>
                {similarMedicines?.data?.map((product,i) => {
                    const firstImage = Array.isArray(product?.medicine_image) ? product.medicine_image[0] : null;
                    return (
                        <div key={product.medicine_id} className='product-details-card-section'>
                        <div className='product-details-card-img-container'>
                            <div className='product-details-card-img-cont-sec'>
                                {/* <img src={Tablet} alt={product.medicine_name} /> */}
                                <img src={`${process.env.REACT_APP_SERVER_URL}uploads/medicine/product_files/${firstImage}`} alt={`${product.medicine_name} ${i}`} className="responsive-image" />
                            </div>
                            {/* <Link to='#'> */}
                                <div className='product-details-card-image-button-cont' onClick={() => onMedicineClick(product.medicine_id, product.medicine_name)}>
                                    View Details
                                </div>
                            {/* </Link> */}
                        </div>
                        <div className='product-details-card-right-container'>
                            <div className='product-details-card-upper-section'>
                                <div className='product-details-card-medicine-head'>{product.medicine_name}</div>
                                <div className='product-details-card-medicine-text'>{product.composition}</div>
                            </div>
                            <div className='product-details-card-text-section'>
                                <div className='product-details-card-text-head'>Country of Origin :</div>
                                <div className='product-details-card-test-text'>{product.country_of_origin}</div>
                            </div>
                            <div className='product-details-card-text-section'>
                                <div className='product-details-card-text-head'>Stocked In :</div>
                                <div className='product-details-card-test-text'>{product.stocked_in?.join(', ')}</div>
                            </div>
                            <div className='product-details-card-text-section'>
                                <div className='product-details-card-text-head'>Dossier Type :</div>
                                <div className='product-details-card-test-text'>{product.dossier_type}</div>
                            </div>
                            <div className='product-details-card-text-section'>
                                <div className='product-details-card-text-head'>Dossier Status :</div>
                                <div className='product-details-card-test-text'>{product.dossier_status}</div>
                            </div>
                            <div className='product-details-card-text-section'>
                                <div className='product-details-card-text-head'>GMP Approvals :</div>
                                <div className='product-details-card-test-text'>{product.gmp_approvals}</div>
                            </div>
                            <div className='product-details-inner-card-button-sec'>
                                <span className='product-details-inner-view-card-details'>View Details</span>
                            </div>
                        </div>
                    </div>
                    )
                }
                    
                )}
            </div>

           {/* {
                similarMedicines?.map((medicine,i) => (
                    <div className='product-details-card-section' key={i}>
                    <div className='product-details-card-img-container'>
                        <div className='product-details-card-img-cont-sec'>
                            <img src={`${process.env.REACT_APP_SERVER_URL}uploads/medicine/product_files/${medicine.medicine_image[0]}`}  />
                        </div>
                        <div className='product-details-card-image-button-cont' onClick={() => onMedicineClick(medicine.medicine_id,medicine.medicine_name)}>
                            View Details
                        </div>
                    </div>
                    <div className='product-details-card-right-container'>
                        <div className='product-details-card-upper-section'>
                            <div className='product-details-card-medicine-head'>{medicine.medicine_name}</div>
                            <div className='product-details-card-medicine-text'>{medicine.drugs_name}</div>
                        </div>
                        <div className='product-details-card-text-section'>
                            <div className='product-details-card-text-head'>Country of Origin :</div>
                            <div className='product-details-card-test-text'>{medicine.country_of_origin}</div>
                        </div>
                        <div className='product-details-card-text-section'>
                            <div className='product-details-card-text-head'>Stocked In :</div>
                            <div className='product-details-card-test-text'>{medicine.quantity}</div>
                        </div>
                        <div className='product-details-card-text-section'>
                            <div className='product-details-card-text-head'>Dossier Type :</div>
                            <div className='product-details-card-test-text'>{medicine.dossier_type}</div>
                        </div>
                        <div className='product-details-card-text-section'>
                            <div className='product-details-card-text-head'>Dossier Status :</div>
                            <div className='product-details-card-test-text'>{medicine.dossier_status}</div>
                        </div>
                        <div className='product-details-card-text-section'>
                            <div className='product-details-card-text-head'>GMP Approvals :</div>
                            <div className='product-details-card-test-text'>{medicine.gmp_approvals}</div>
                        </div>
                        
                    </div>
                </div>
                ))
            } */}
            <div className='pagi-container'>
                <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={itemsPerPage}
                    totalItemsCount={totalItems}
                    pageRangeDisplayed={5}
                    onChange={handlePageChange}
                    itemClass="page-item"
                    linkClass="page-link"
                    prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                    nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                    hideFirstLastPages={true}
                />
                <div className='pagi-total'>
                    Total Items: {totalItems}
                </div>
            </div>
        </>
    )
}

export default ProductDetailsCard