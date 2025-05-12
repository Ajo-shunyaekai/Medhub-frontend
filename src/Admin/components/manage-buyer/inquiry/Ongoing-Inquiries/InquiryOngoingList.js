import React, { useState } from 'react';
import moment from "moment-timezone";
import PaginationComponent from '../../../shared-components/Pagination/Pagination';

const InquiryOngoingList = ({ items, inquiryDetails }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3; 
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = items?.slice(indexOfFirstOrder, indexOfLastOrder);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="product-list-main-container">
      <div className='table-card-body-container'>
        <div className="table-assign-driver-heading">Product List</div>
        <div className='table-assign-date-time'>
          {moment(inquiryDetails?.created_at)
            .tz("Asia/Kolkata")
            .format("DD/MM/YYYY HH:mm:ss")}
        </div>
      </div>

      <table className="table">
        <tbody>
          {currentOrders?.map((item, i) => (
            <tr key={i}>
              <td className='tables-td'>
                <div className="table-g-section-content">
                  <span className="table-g-driver-name">Product ID</span>
                  <span className="table-g-not-names">{item.product_id}</span>
                </div>
              </td>
              <td className='tables-td-cont'>
                <div className="table-second-container">
                  <div className="table-g-section-content">
                    <span className="table-g-driver-name">Product Name</span>
                    <span className="table-g-not-name">{item?.medicine_details?.general?.name}</span>
                  </div>
                </div>
              </td>
              <td className='tables-td'>
                <div className="table-g-section-content">
                  <span className="table-g-driver-name">Quantity Req.</span>
                  <span className="table-g-not-name">{item?.quantity_required}</span>
                </div>
              </td>
              <td className='tables-td'>
                <div className="table-g-section-content">
                  <span className="table-g-driver-name">Listed Price</span>
                  <span className="table-g-not-name">{item.unit_price ? `${item.unit_price} USD` : ''}</span>
                </div>
              </td>
              <td className='tables-td'>
                <div className="table-g-section-content">
                  <span className="table-g-driver-name">Target Price</span>
                  <span className="table-g-not-name">
                    {item.target_price
                      ? item.target_price.toLowerCase().includes('usd')
                        ? item.target_price.replace(/days/i, 'USD')
                        : `${item.target_price} USD`
                      : '-'}
                  </span>
                </div>
              </td>
              <td className='tables-td'>
                <div className="table-g-section-content">
                  <span className="table-g-driver-name">Est. Delivery Time</span>
                  <span className="table-g-not-name">
                    {item.est_delivery_days
                      ? item.est_delivery_days.toLowerCase().includes('days')
                        ? item.est_delivery_days.replace(/days/i, 'Days')
                        : `${item.est_delivery_days} Days`
                      : 'TBC- based on quantity'}
                  </span>
                </div>
              </td>
              <td className='tables-td'>
                <div className="table-g-section-content">
                  <span className="table-g-driver-name">Status</span>
                  <span className="table-g-not-name">
                    {item.status === 'Quotation submitted'
                      ? 'Quotation Received'
                      : item?.status?.split(' ').map(word => word?.charAt(0)?.toUpperCase() + word?.slice(1)).join(' ')
                    }
                  </span>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <PaginationComponent
        activePage={currentPage}
        itemsCountPerPage={ordersPerPage}
        totalItemsCount={items?.length}
        pageRangeDisplayed={5}
        onChange={handlePageChange}
      />
    </div>
  );
};

export default InquiryOngoingList;