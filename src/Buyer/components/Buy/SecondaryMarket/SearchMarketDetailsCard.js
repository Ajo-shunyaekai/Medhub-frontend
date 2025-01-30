import React from 'react';
import '../ByProduct/searchdetails.css';
import { Link } from 'react-router-dom';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const SearchDetailsCard = ({similarMedicines, totalItems, currentPage, itemsPerPage, handlePageChange}) => {
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
                                {search?.inventory_info?.[0]?.unit_price} USD
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



