import React, { useState } from 'react';
import '../style/productDetails.css';
import Tablet from '../assest/tablet.png';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const SecondaryProductDetails = ({similarMedicines, totalItems, onMedicineClick, currentPage, itemsPerPage, handlePageChange}) => {
    const products = [
        { id: 1, name: 'Migon 10 MG', substance: 'flunarizine', origin: 'Dubai UAE', stock: 450, dossierType: 'EU CTU', dossierStatus: 'Ready to file', gmp: 'GU EMP' },
        { id: 2, name: 'Migon 10 MG', substance: 'flunarizine', origin: 'Dubai UAE', stock: 450, dossierType: 'EU CTU', dossierStatus: 'Ready to file', gmp: 'GU EMP' },
        { id: 3, name: 'Migon 10 MG', substance: 'flunarizine', origin: 'Dubai UAE', stock: 450, dossierType: 'EU CTU', dossierStatus: 'Ready to file', gmp: 'GU EMP' },
        { id: 4, name: 'Migon 10 MG', substance: 'flunarizine', origin: 'Dubai UAE', stock: 450, dossierType: 'EU CTU', dossierStatus: 'Ready to file', gmp: 'GU EMP' },
        { id: 5, name: 'Migon 10 MG', substance: 'flunarizine', origin: 'Dubai UAE', stock: 450, dossierType: 'EU CTU', dossierStatus: 'Ready to file', gmp: 'GU EMP' },
        { id: 6, name: 'Migon 10 MG', substance: 'flunarizine', origin: 'Dubai UAE', stock: 450, dossierType: 'EU CTU', dossierStatus: 'Ready to file', gmp: 'GU EMP' },
    ];

    return (
        <>
            <div className='buyer-product-details-card-section-heading'>Similar products</div>
            <div className='secondary-product-details-main-section'>
                {similarMedicines?.map((product,i) => {
                     const firstImage = Array.isArray(product?.medicine_image) ? product.medicine_image[0] : null;
                    return (
                        <div key={product.medicine_id} className='buyer-product-details-card-section'>
                        <div className='buyer-product-details-card-img-container'>
                            <div className='buyer-product-details-card-img-cont-sec'>
                                {/* <img src={Tablet} alt={product.name} /> */}
                                <img src={`${process.env.REACT_APP_SERVER_URL}uploads/medicine/product_files/${firstImage}`} alt={`${product.medicine_name} ${i}`} className="responsive-image" />
                            </div>
                            <Link to='#'>
                                <div className='buyer-product-details-card-image-button-cont' onClick={() => onMedicineClick(product.medicine_id, product.medicine_name)}>
                                    View Details
                                </div>
                            </Link>
                        </div>
                        <div className='buyer-product-details-card-right-container'>
                            <div className='buyer-product-details-card-upper-section'>
                                <div className='buyer-product-details-card-medicine-head'>{product.medicine_name}</div>
                                <div className='buyer-product-details-card-medicine-text'>{product.composition}</div>
                            </div>
                            <div className='buyer-product-details-card-text-section'>
                                <div className='buyer-product-details-card-text-head'>Country of Origin :</div>
                                <div className='buyer-product-details-card-test-text'>{product.country_of_origin}</div>
                            </div>
                            <div className='buyer-product-details-card-text-section'>
                                <div className='buyer-product-details-card-text-head'>Stocked in :</div>
                                <div className='buyer-product-details-card-test-text'>{product.stocked_in}</div>
                            </div>
                            <div className='buyer-product-details-card-text-section'>
                                <div className='buyer-product-details-card-text-head'>Dossier Type :</div>
                                <div className='buyer-product-details-card-test-text'>{product.dossier_type}</div>
                            </div>
                            <div className='buyer-product-details-card-text-section'>
                                <div className='buyer-product-details-card-text-head'>Dossier Status :</div>
                                <div className='buyer-product-details-card-test-text'>{product.dossier_status}</div>
                            </div>
                            <div className='buyer-product-details-card-text-section'>
                                <div className='buyer-product-details-card-text-head'>GMP Approvals :</div>
                                <div className='buyer-product-details-card-test-text'>{product.gmp_approvals}</div>
                            </div>
                            <div className='buyer-product-details-inner-card-button-sec'>
                                <span className='buyer-product-details-inner-view-card-details'>View Details</span>
                            </div>
                        </div>
                    </div>
                    )
                    
})}
            </div>
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
    );
};

export default SecondaryProductDetails;
