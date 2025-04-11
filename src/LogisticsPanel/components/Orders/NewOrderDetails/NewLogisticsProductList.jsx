import React, { useState } from 'react';
import styles from './NewOrderDetails.module.css';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

function NewLogisticsProductList({ productList }) {
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 3;

    const activeOrders = [
    { productId: 'PR1234567', productName: 'Paracetamol', quantity: 200, totalAmount: '500 USD', est_delivery_days: '10 Days' },
    { productId: 'PR1234567', productName: 'Paracetamol', quantity: 200, totalAmount: '500 USD', est_delivery_days: '10 Days' },
    { productId: 'PR1234567', productName: 'Paracetamol', quantity: 200, totalAmount: '500 USD', est_delivery_days: '10 Days' },
    ];

    const data = productList && productList.length > 0 ? productList : activeOrders;

    const indexOfLastOrder  = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const products          = data.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    };
  return (
    <div className={styles.cardBody}>
      <div className={styles.tableHeading}>Product List</div>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Product ID</th>
              <th className={styles.th}>Product Name</th>
              <th className={styles.th}>Quantity</th>
              {/* <th className={styles.th}>Total Price</th> */}
              <th className={styles.th}>No. of Packages</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((item, index) => (
              <tr className={styles.tr} key={index}>
                <td className={styles.td}>
                  <div className={styles.tableContent}>
                    <span>{item.product_id}</span>
                  </div>
                </td>
                <td className={styles.td}>
                  <div className={styles.tableContent}>
                    <span>{item.product_name}</span>
                  </div>
                </td>
                <td className={styles.td}>
                  <div className={styles.tableContent}>
                    <span>{item.quantity}</span>
                  </div>
                </td>
                {/* <td className={styles.td}>
                  <div className={styles.tableContent}>
                    <span>{item.total_amount || item.item_price} USD</span>
                  </div>
                </td> */}
                <td className={styles.td}>
                  <div className={styles.tableContent}>
                    <span>
                      {item.no_of_packages}
                    </span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className={styles.paginationContainer}>
        <Pagination
          activePage         = {currentPage}
          itemsCountPerPage  = {ordersPerPage}
          totalItemsCount    = {data.length}
          pageRangeDisplayed = {5}
          onChange           = {handlePageChange}
          itemClass          = {styles.pageItem}
          linkClass          = {styles.pageLink}
          prevPageText       = {<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
          nextPageText       = {<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
          hideFirstLastPages = {true}
        />
        <div className={styles.totalItems}>Total Items: {data.length}</div>
      </div>
    </div>
  )
}

export default NewLogisticsProductList;
