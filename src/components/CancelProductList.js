import React, { useState } from 'react';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const CancelProductList = () => {
  // Static data
  const items = [
    {
      productId: '123654789',
      productName: 'Paracetamol',
      quantity: 1400,
      listedPrice: '20 AED',
      targetPrice: '14 AED',
      status: 'Pending',
    },
    {
      productId: '456123789',
      productName: 'Aspirin',
      quantity: 800,
      listedPrice: '15 AED',
      targetPrice: '10 AED',
      status: 'Pending',
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 3;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = items.slice(indexOfFirstOrder, indexOfLastOrder);

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
          {currentOrders.map((item, i) => (
            <tr key={i}>
              <td className='tables-td'>
                <div className="table-g-section-content">
                  <span className="table-g-driver-name">Product ID</span>
                  <span className="table-g-not-names">{item.productId}</span>
                </div>
              </td>
              <td className='tables-td-cont'>
                <div className="table-second-container">
                  <span className="table-g-section">G</span>
                  <div className="table-g-section-content">
                    <span className="table-g-driver-name">Product Name</span>
                    <span className="table-g-not-name">{item.productName}</span>
                  </div>
                </div>
              </td>
              <td className='tables-td'>
                <div className="table-g-section-content">
                  <span className="table-g-driver-name">Quantity</span>
                  <span className="table-g-not-name">{item.quantity}</span>
                </div>
              </td>
              <td className='tables-td'>
                <div className="table-g-section-content">
                  <span className="table-g-driver-name">Listed Price</span>
                  <span className="table-g-not-name">{item.listedPrice}</span>
                </div>
              </td>
              <td className='tables-td'>
                <div className="table-g-section-content">
                  <span className="table-g-driver-name">Target Price</span>
                  <span className="table-g-not-name">{item.targetPrice}</span>
                </div>
              </td>
              <td className='tables-td'>
                <div className="table-g-section-content">
                    <span className="table-g-driver-name">Status</span>
                    <span className="table-g-not-name">
                      {item.status}
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
          activePage={currentPage}
          itemsCountPerPage={ordersPerPage}
          totalItemsCount={items.length}
          pageRangeDisplayed={5}
          onChange={handlePageChange}
          itemClass="page-item"
          linkClass="page-link"
          prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
          nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
          hideFirstLastPages={true}
        />
        <div className='pagi-total'>
          Total Items: {items.length}
        </div>
      </div>
    </div>
  );
};

export default CancelProductList;
