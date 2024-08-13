import React, { useState } from 'react';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';


const AssignDriver = ({ items, inquiryDetails }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3; // Number of orders to display per page

  // Logic to slice orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = items?.slice(indexOfFirstOrder, indexOfLastOrder);

  // Function to handle page change
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
              <td className='tables-td'>
                <div className="table-g-section-content">
                  <span className="table-g-driver-name">Product ID</span>
                  <span className="table-g-not-names">{item.medicine_id}</span>
                </div>
              </td>
              <td className='tables-td-cont'>
                <div className="table-second-container">
                  <span className="table-g-section">G</span>
                  <div className="table-g-section-content">
                    <span className="table-g-driver-name">Product Name</span>
                    <span className="table-g-not-name">{item?.medicine_details?.medicine_name}</span>
                  </div>
                </div>
              </td>
              <td className='tables-td'>
                <div className="table-g-section-content">
                  <span className="table-g-driver-name">Quantity</span>
                  <span className="table-g-not-name">{item.quantity_required}</span>
                </div>
              </td>
              <td className='tables-td'>
                <div className="table-g-section-content">
                  <span className="table-g-driver-name">Listed Price</span>
                  <span className="table-g-not-name">{item.unit_price} AED</span>
                </div>
              </td>
              <td className='tables-td'>
                <div className="table-g-section-content">
                  <span className="table-g-driver-name">Target Price</span>
                  <span className="table-g-not-name">{item.target_price} AED</span>
                </div>
              </td>
              <td className='tables-td'>
                <div className="table-g-section-content">
                    <span className="table-g-driver-name">Status</span>
                    <span className="table-g-not-name">
                        {item.status === 'Quotation submitted' 
                            ? 'Quotation received' 
                            : item?.status?.charAt(0).toUpperCase() + item?.status?.slice(1)
                        }
                    </span>
                </div>
            </td>

              <td>
                {/* Any additional actions */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination section */}
      <div className='pagi-container'>
        <Pagination
          activePage         = {currentPage}
          itemsCountPerPage  = {ordersPerPage}
          totalItemsCount    = {items?.length}
          pageRangeDisplayed = {5}
          onChange           = {handlePageChange}
          itemClass          = "page-item"
          linkClass          = "page-link"
          prevPageText       = {<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
          nextPageText       = {<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
          hideFirstLastPages = {true}
        />
        <div className='pagi-total'>
          Total Items: {items?.length}
        </div>
      </div>
    </div>
  );
};

export default AssignDriver;
