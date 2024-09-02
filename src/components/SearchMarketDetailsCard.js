import React, { useState } from 'react';
import '../style/searchdetails.css';
import Tablet from '../assest/tablet.png';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const SearchDetailsCard = ({similarMedicines, totalItems, currentPage, itemsPerPage, handlePageChange}) => {
    const search = [
        { id: 1, name: 'Cipla', supplierName: 'Hoventa Pharma', availablein: 'UAE, India, USA', quantity: 450, price: '25 USD', dossierType: 'EU CTU', dossierStatus: 'Ready to file', deliverytime: '10 Days' },
        { id: 2, name: 'Sun Pharma', supplierName: 'Kabir Lifesciences', availablein: 'UAE, UK, USA', quantity: 1050, price: '22 USD', dossierType: 'EU CTU', dossierStatus: 'Ready to file', deliverytime: '8 Days' },
        { id: 3, name: 'RAM Pharma', supplierName: 'Alpha Drugs', availablein: 'UK, India, USA', quantity: 850, price: '24 USD', dossierType: 'EU CTU', dossierStatus: 'Ready to file', deliverytime: '12 Days' },
        { id: 4, name: 'Akshar Pharma', supplierName: 'Arlak Biotech', availablein: 'UAE, India, USA', quantity: 450, price: '20 USD', dossierType: 'EU CTU', dossierStatus: 'Ready to file', deliverytime: '15 Days' },
        { id: 5, name: 'Alpic Biotech Limited', supplierName: 'Saillon Pharma', availablein: 'Nepal, UAE', quantity: 250, price: '14 USD', dossierType: 'EU CTU', dossierStatus: 'Ready to file', deliverytime: '18 Days' },
        { id: 6, name: 'Glenmark Pharmaceuticals', supplierName: 'Abiba Pharmacia', availablein: 'Dubai UAE', quantity: 1450, price: '18 USD', dossierType: 'EU CTU', dossierStatus: 'Ready to file', deliverytime: '6 Days' },
        { id: 7, name: 'R.S. Healthcare', supplierName: 'Farmson', availablein: 'Dubai UAE', quantity: 1050, price: '16 USD', dossierType: 'EU CTU', dossierStatus: 'Ready to file', deliverytime: '11 Days' },
        { id: 8, name: 'APPLE PHARMACEUTICALS', supplierName: 'Sanify Healthcare', availablein: 'Nepal, UK, UAE', quantity: 1550, price: '17 USD', dossierType: 'EU CTU', dossierStatus: 'Ready to file', deliverytime: '9 Days' },
        { id: 9, name: 'BIOBRICK PHARMA', supplierName: 'Sencare Life Sciences', availablein: 'UAE, India, Nepal', quantity: 2550, price: '21 USD', dossierType: 'EU CTU', dossierStatus: 'Ready to file', deliverytime: '7 Days' },
        { id: 10, name: 'Soigner Pharma', supplierName: 'Praveen Pharma', availablein: 'UAE, USA, Nepal', quantity: 500, price: '19 USD', dossierType: 'EU CTU', dossierStatus: 'Ready to file', deliverytime: '6 Days' },
    ];

    return (
        <>
            <div className='secondary-search-details-main-section'>
                {similarMedicines?.data?.map((search) => {
                    const firstImage = Array.isArray(search?.medicine_image) ? search.medicine_image[0] : null;
                    return (
                        <div key={search.id} className='search-details-card-section'>
                        <div className='search-details-card-img-container'>
                            <div className='search-details-card-img-cont-sec'>
                                {/* <img src={Tablet} alt={search.name} /> */}
                                <img src={`${process.env.REACT_APP_SERVER_URL}uploads/medicine/product_files/${firstImage}`} alt="Medicine" />
                            </div>
                        </div>
                        <div className='search-details-card-right-container'>
                            <div className='search-details-card-upper-section'>
                                <div className='search-details-card-medicine-head'>{search.supplier?.supplier_name}</div>
                                <div className='search-details-card-medicine-text'>{search?.supplier?.description} </div>

                            </div>
                            <div className='search-details-card-text-section'>
                                <div className='search-details-card-text-head'>Medicine Name :</div>
                                <div className='search-details-card-test-text'>{search?.medicine_name}({search.strength})</div>
                            </div>
                            <div className='search-details-card-text-section'>
                                <div className='search-details-card-text-head'>Unit Price :</div>
                                <div className='search-details-card-test-text'>
                                {search?.inventory_info?.[0]?.unit_price} AED
                                    </div>
                            </div>
                            <div className='search-details-card-text-section'>
                                <div className='search-details-card-text-head'>Total Quantity :</div>
                                <div className='search-details-card-test-text'>
                                   {search?.inventory_info?.[0]?.quantity}
                                </div>
                            </div>
                            <div className='search-details-card-text-section'>
                                <div className='search-details-card-text-head'>Delivery Time :</div>
                                <div className='search-details-card-test-text'>
                                {/* {search?.inventory_info?.map((item) => item.est_delivery_days).join(', ')} */}
                                {search?.inventory_info?.[0]?.est_delivery_days 
                                    ? search.inventory_info[0].est_delivery_days.toLowerCase().includes('days') 
                                        ? search.inventory_info[0].est_delivery_days.replace(/days/i, 'Days')
                                        : `${search.inventory_info[0].est_delivery_days} Days`
                                    : 'N/A'}
                                </div>
                            </div>
                            <div className='search-details-card-text-section'>
                                <div className='search-details-card-text-head'>Country Available in :</div>
                                <div className='search-details-card-test-text'>{search.country_available_in?.join(', ') || search.stocked_in?.join(', ')}</div>
                            </div>
                            {/* <Link to='/market-product-details'>
                                <div className='search-details-inner-card-button-sec'>
                                    <span className='search-details-inner-view-card-details'>View Details</span>
                                </div>
                            </Link> */}
                        </div>
                        <div className='search-details-view-button-section-container'>
                            {/* <Link to='/market-product-details/4'> */}
                            <Link to={`/buyer/market-product-details/${search.medicine_id}`}>
                                <div className='search-details-card-image-button-cont'>
                                    View Details
                                </div>
                            </Link>
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

export default SearchDetailsCard;



