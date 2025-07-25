import React, { useState } from 'react';
import PaginationComponent from '../../SharedComponents/Pagination/pagination';
import moment from 'moment-timezone';
import ProductImage from '../../../assets/images/productImage.png'
import '../ongoingdetails.css';

const ProductList = ({ orderItems, quotationItems, handleAccept, handleReject, inquiryDetails }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 5;
  const data = orderItems && orderItems?.length > 0 ? orderItems : quotationItems && quotationItems?.length > 0 ? quotationItems : [];
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = data.slice(indexOfFirstOrder, indexOfLastOrder);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const [acceptedItems, setAcceptedItems] = useState([]);
  const [rejectedItems, setRejectedItems] = useState([]);

  const handleAcceptClick = (item, status) => {
    setAcceptedItems([...acceptedItems, item]);
    setRejectedItems(rejectedItems.filter(rejItem => rejItem._id !== item._id));
    handleAccept(item, status);
  };

  const handleRejectClick = (item, status) => {
    setRejectedItems([...rejectedItems, item]);
    setAcceptedItems(acceptedItems.filter(accItem => accItem._id !== item._id));
    handleReject(item, status);
  };

  const isAccepted = (item) => acceptedItems.some(accItem => accItem._id === item._id);
  const isRejected = (item) => rejectedItems.some(rejItem => rejItem._id === item._id);

  const dateToDisplay = inquiryDetails?.quotation_items_created_at || inquiryDetails?.quotation_items_updated_at || moment().toISOString();

  // Format the date to display
  const formattedDate = moment(dateToDisplay)
    .tz('Asia/Kolkata')
    .format('DD/MM/YYYY HH:mm:ss');

  // Function to check if the filename has a valid image extension
  const isImageExtension = (filename) => {
    return /\.(jpg|jpeg|png|webp|gif|bmp)$/i.test(filename);
  };

  // Function to validate if the URL is a valid HTTP/HTTPS URL
  const isValidHttpUrl = (url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === 'http:' || parsed.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  // Function to get the correct image source
  // const getImageSrc = (imageName) => {
  //   const serverUrl = process.env.REACT_APP_SERVER_URL;
  //   let imageSrc = ProductImage; // Default fallback image

  //   if (imageName) {
  //     const imageUrl = imageName?.startsWith('http')
  //       ? imageName
  //       : `${serverUrl}uploads/products/${imageName}`;
  //     if (isValidHttpUrl(imageName) && isImageExtension(imageName)) {
  //       imageSrc = imageName;
  //     } else if (isImageExtension(imageName)) {
  //       imageSrc = imageUrl;
  //     }
  //   }
  //   return imageSrc;
  // };

  const getImageSrc = (imageData) => {
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    let imageName = "";
    let imageSrc = ProductImage; // default fallback image
  
    if (!imageData) return imageSrc;
  
    // Handle case when imageData is an array
    if (Array.isArray(imageData)) {
      imageName = imageData?.[0];
    }
  
    // Handle case when imageData is an object with nested image arrays
    else if (typeof imageData === "object" && imageData !== null) {
      const firstKey = Object.keys(imageData)?.[0];
      imageName = imageData?.[firstKey]?.[0];
    }
  
    if (imageName) {
      const isUrl = isValidHttpUrl(imageName);
      const isImage = isImageExtension(imageName);
      const imageUrl = imageName.startsWith("http")
        ? imageName
        : `${serverUrl}uploads/products/${imageName}`;
  
      if (isUrl && isImage) {
        imageSrc = imageName;
      } else if (isImage) {
        imageSrc = imageUrl;
      }
    }
  
    return imageSrc;
  };
  

  return (
    <div className="card-body">
      <div>
        <div className="table-assign-driver-heading">Quotation from Supplier</div>
      </div>

      <table className="table">
        <tbody>
          {currentOrders?.map((item, i) => (
            <tr key={i}>
              <td className="tables-tds">
                <div className="table-g-section-content">
                  <span className="table-g-driver-name">Product ID</span>
                  <span className="table-g-not-names">{item.product_id || item.productId}</span>
                </div>
              </td>
              <td className="tables-tds-cont">
                <div className="table-second-container">
                     <img
                        src={getImageSrc(item?.medicine_details?.general?.image)}
                        alt={item?.product_name || item?.medicine_details?.general?.name || 'Product'}
                        className="product-image"
                        style={{ width: '40px', height: '40px'}}
                        onError={(e) => (e.target.src = ProductImage)}
                      />
                  <div className="table-g-section-content">
                    <span className="table-g-driver-name">Product Name</span>
                    <div className="product-name-with-image">
                      <span className="table-g-not-name">
                        {item?.product_name || item?.medicine_details?.general?.name}
                      </span>
                    </div>
                  </div>
                </div>
              </td>
              <td className="tables-tds">
                <div className="table-g-section-content">
                  <span className="table-g-driver-name">Quantity Req.</span>
                  <span className="table-g-not-name">{item?.quantity || item?.quantity_required}</span>
                </div>
              </td>
              <td className="tables-tds">
                <div className="table-g-section-content">
                  <span className="table-g-driver-name">Target Price</span>
                  <span className="table-g-not-name">
                    {item.price || item.target_price || item.totalAmount
                      ? `${item.price || item.target_price || item.totalAmount} USD`
                      : '-'}
                  </span>
                </div>
              </td>
              <td className="tables-tds">
                <div className="table-g-section-content">
                  <span className="table-g-driver-name">Counter Price</span>
                  <span className="table-g-not-name">
                    {item.counter_price
                      ? item.counter_price.toLowerCase().includes('usd')
                        ? item.counter_price.replace(/usd/i, 'USD')
                        : `${item.counter_price} USD`
                      : '-'}
                  </span>
                </div>
              </td>
              <td className="tables-tds">
                <div className="table-g-section-content">
                  <span className="table-g-driver-name">Est. Shipping Time</span>
                  <span className="table-g-not-name">
                    {item.est_delivery_days
                      ? item.est_delivery_days.toLowerCase().includes('days')
                        ? item.est_delivery_days.replace(/days/i, 'Days')
                        : `${item.est_delivery_days} Days`
                      : 'TBC- based on quantity'}
                  </span>
                </div>
              </td>
              {inquiryDetails.enquiry_status === 'PO created' && (
                <td className="tables-tds">
                  <div className="table-g-section-content">
                    <span className="table-g-driver-name">Status</span>
                    <span className="table-g-not-name">
                      {item?.status?.split(' ').map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1)).join(' ') || '-'}
                    </span>
                  </div>
                </td>
              )}
              {inquiryDetails.enquiry_status !== 'PO created' && (
                <td className="tables-tds">
                  <div className="table-g-section-content-button">
                    {item.status === 'pending' ? (
                      <>
                        <span className="table-g-not-name-button" onClick={() => handleAcceptClick(item, 'accepted')}>
                          Accept
                        </span>
                        <span className="table-g-not-reject-buttons" onClick={() => handleRejectClick(item, 'rejected')}>
                          Reject
                        </span>
                      </>
                    ) : item.status === 'accepted' ? (
                      <span className="table-g-not-name-button accepted">Accepted</span>
                    ) : item.status === 'rejected' ? (
                      <span className="table-g-not-reject-buttons rejected">Rejected</span>
                    ) : null}
                  </div>
                </td>
              )}
              <td></td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagi-container">
        <PaginationComponent
          activePage={currentPage}
          itemsCountPerPage={ordersPerPage}
          totalItemsCount={data.length}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ProductList;