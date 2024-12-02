import React, { useState, useEffect } from 'react';
import '../../style/supplyproductlist.css';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import { Link } from 'react-router-dom';

const SupplyProductList = ({ productsData, totalProducts, currentPage, productsPerPage, handleProductPageChange }) => {

  const [currenttPage, setCurrenttPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(window.innerWidth >= 1590 ? 4 : 3);

  // Sample data for demonstration
  const productList = [
    { id: 1, name: 'Product 1', country: 'Dubai', stocked: 450, dossierType: 'EU CTU', dossierStatus: 'Ready to file', gmpApprovals: 'GU EMP' },
    { id: 2, name: 'Product 2', country: 'Dubai', stocked: 450, dossierType: 'EU CTU', dossierStatus: 'Ready to file', gmpApprovals: 'GU EMP' },
    { id: 3, name: 'Product 3', country: 'Dubai', stocked: 450, dossierType: 'EU CTU', dossierStatus: 'Ready to file', gmpApprovals: 'GU EMP' },
    { id: 4, name: 'Product 4', country: 'Dubai', stocked: 450, dossierType: 'EU CTU', dossierStatus: 'Ready to file', gmpApprovals: 'GU EMP' },
    { id: 5, name: 'Product 5', country: 'Dubai', stocked: 450, dossierType: 'EU CTU', dossierStatus: 'Ready to file', gmpApprovals: 'GU EMP' },
    // Add more product data as needed
  ];
  const indexOfLastItem = currenttPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = productList.slice(indexOfFirstItem, indexOfLastItem);
  const handlePageChange = (pageNumber) => setCurrenttPage(pageNumber);
  const handleResize = () => {
    setItemsPerPage(window.innerWidth >= 1590 ? 4 : 3);
  };
  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className='supply-product-list-main-sections'>
      <div className='supplier-product-card-main-section'>
        {productsData && productsData.length > 0 ? (
          productsData.map((product, i) => {
            const firstImage = Array.isArray(product?.medicine_image) ? product.medicine_image[0] : null;
            const linkTo =
              product.medicine_type === 'new'
                ? `/buyer/medicine-details/${product.medicine_id}`
                : `/buyer/market-product-details/${product.medicine_id}`;
            return (
              <div key={product.id} className='supply-product-list-container'>
                <div className='supply-product-left-container'>
                  <div className='supply-product-left-image-cont'>
                    <img
                      src={`${process.env.REACT_APP_SERVER_URL}uploads/medicine/product_files/${firstImage}`}
                      alt='Product'
                    />
                  </div>
                  <Link to={linkTo}>
                    <div className='supply-product-left-button-cont'>
                      <span className='supply-product-left-button-details'>View Details</span>
                    </div>
                  </Link>
                </div>
                <div className='supply-product-right-container'>
                  <div className='supply-product-right-first-heading-section'>
                    <div className='supply-product-right-container-main-heading'>{product.medicine_name}</div>
                    <div className='supply-product-right-container-main-text'>{product.composition}</div>
                  </div>
                  <div className='supply-product-right-first-section'>
                    <div className='supply-product-right-container-head'>Country of Origin</div>
                    <div className='supply-product-right-container-text'>{product.country_of_origin}</div>
                  </div>
                  <div className='supply-product-right-first-section'>
                    <div className='supply-product-right-container-head'>Stocked in</div>
                    <div className='supply-product-right-container-stockedin'>{product.stocked_in?.join(', ')}</div>
                  </div>
                  <div className='supply-product-right-first-section'>
                    <div className='supply-product-right-container-head'>Dossier Type</div>
                    <div className='supply-product-right-container-text'>{product.dossier_type}</div>
                  </div>
                  <div className='supply-product-right-first-section'>
                    <div className='supply-product-right-container-head'>Dossier Status</div>
                    <div className='supply-product-right-container-text'>{product.dossier_status}</div>
                  </div>
                  <div className='supply-product-right-first-section'>
                    <div className='supply-product-right-container-head'>GMP Approvals</div>
                    <div className='supply-product-right-container-text'>{product.gmp_approvals}</div>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className='no-data-container'>
            <div className='no-data-message'>No data available</div>
          </div>
        )}
      </div>
      <div className='pagi-container'>
        <Pagination
          activePage={currentPage}
          itemsCountPerPage={productsPerPage}
          totalItemsCount={totalProducts}
          pageRangeDisplayed={5}
          onChange={handleProductPageChange}
          itemClass='page-item'
          linkClass='page-link'
          prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
          nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
          hideFirstLastPages={true}
        />
        <div className='pagi-total'>Total Items: {totalProducts}</div>
      </div>
    </div>
  );

};

export default SupplyProductList;
