import React, { useState } from 'react';
import PaginationComponent from '../../SharedComponents/Pagination/pagination';
import ProductImage from '../../../assets/images/productImage.png'
import '../ongoingdetails.css';

// Function to check if the filename has a valid image extension
const isImageExtension = (filename) => {
  return /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(filename);
};

// Function to validate if the URL is a valid HTTP/HTTPS URL
const isValidHttpUrl = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch (_) {
    return false;
  }
};

// Function to get the correct image source
const getImageSrc = (imageName) => {
const serverUrl = process.env.REACT_APP_SERVER_URL;
  let imageSrc = ProductImage; // Default fallback image

  if (imageName) {
    const imageUrl = imageName?.startsWith("http")
      ? imageName
      : `${serverUrl}uploads/products/${imageName}`;
    if (isValidHttpUrl(imageName) && isImageExtension(imageName)) {
      imageSrc = imageName;
    } else if (isImageExtension(imageName)) {
      imageSrc = imageUrl;
    }
  }
  return imageSrc;
};

const CancelProductList = ({ items, inquiryDetails }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = items?.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="card-body">
      <div>
        <div className="table-assign-driver-heading">Product List</div>
      </div>
      <table className="table">
        <tbody>
          {currentOrders?.map((item, i) => (
            <tr key={i}>
              <td className="tables-td">
                <div className="table-g-section-content">
                  <span className="table-g-driver-name">Product ID</span>
                  <span className="table-g-not-names">{item.product_id}</span>
                </div>
              </td>
              <td className="tables-td-cont">
                <div className="table-second-container">
                   <img
                        src={getImageSrc(item?.medicine_details?.general?.image[0])}
                        alt={item?.medicine_details?.general?.name || 'Product'}
                        style={{ width: '50px', height: '50px', marginRight: '10px', }}
                        onError={(e) => (e.target.src = ProductImage)}
                      />
                  <div className="table-g-section-content">
                    <span className="table-g-driver-name">Product Name</span>
                    <div className="table-g-not-name">
                     
                      <span>{item?.medicine_details?.general?.name || '-'}</span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="tables-td">
                <div className="table-g-section-content">
                  <span className="table-g-driver-name">Quantity</span>
                  <span className="table-g-not-name">{item?.quantity_required}</span>
                </div>
              </td>
              <td className="tables-td">
                <div className="table-g-section-content">
                  <span className="table-g-driver-name">Listed Price</span>
                  <span className="table-g-not-name">
                    {item.unit_price
                      ? item.unit_price.toLowerCase().includes('usd')
                        ? item.unit_price.replace(/usd/i, 'USD')
                        : `${item.unit_price} USD`
                      : '-'}
                  </span>
                </div>
              </td>
              <td className="tables-td">
                <div className="table-g-section-content">
                  <span className="table-g-driver-name">Target Price</span>
                  <span className="table-g-not-name">
                    {item.target_price
                      ? item.target_price.toLowerCase().includes('usd')
                        ? item.target_price.replace(/usd/i, 'USD')
                        : `${item.target_price} USD`
                      : '-'}
                  </span>
                </div>
              </td>
              <td className="tables-td">
                <div className="table-g-section-content">
                  <span className="table-g-driver-name">Est. Delivery Time</span>
                  <span className="table-g-not-name">
                    {item.est_delivery_days
                      ? item.est_delivery_days.toLowerCase().includes('days')
                        ? item.est_delivery_days.replace(/days/i, 'Days')
                        : `${item.est_delivery_days} Days`
                      : 'TBC - based on quantity'}
                  </span>
                </div>
              </td>
              <td className="tables-td">
                <div className="table-g-section-content">
                  <span className="table-g-driver-name">Status</span>
                  <span className="table-g-not-name">
                    {item?.status?.charAt(0)?.toUpperCase() +
                      item?.status?.slice(1)}
                  </span>
                </div>
              </td>
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination section using PaginationComponent */}
      <PaginationComponent
        activePage={currentPage}
        itemsCountPerPage={ordersPerPage}
        totalItemsCount={items?.length || 0}
        pageRangeDisplayed={3}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default CancelProductList;