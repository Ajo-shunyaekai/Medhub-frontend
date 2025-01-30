import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import EditIcon from '@mui/icons-material/Edit';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import '../ongoingorders.css';

const PurchasedOrder = ({ poList, totalPoList, currentPage, inquiryPerPage, handlePageChange, activeLink }) => {
  const [modal, setModal] = useState(false);
  const [selectedongoing, setSelectedongoing] = useState(null);

  const showModal = (ongoing) => {
    setSelectedongoing(ongoing);
    setModal(true);
  };

  return (
    <>
      <div className="ongoing-container">
        <div className="ongoing-container-right-section">
          <div className='ongoing-inner-container-section'>
            <table className="table-ongoing-container">
              <thead className='ongoing-container-thead'>
                <tr className='ongoing-container-tr'>
                  <th className="ongoing-container-th">PO ID</th>
                  <th className="ongoing-container-th">Inquiry ID</th>
                  <th className="ongoing-container-th">Date</th>
                  <th className="ongoing-container-large-th">Supplier Name</th>
                  <th className="ongoing-container-th">Total Amount</th>
                  <th className="ongoing-container-th">Action</th>
                </tr>
              </thead>
              {poList?.length > 0 ? (
                poList.map((data, i) => {
                  const totalAmount = data.order_items.reduce((sum, item) => sum + parseFloat(item.total_amount), 0);
                  return (
                    <tbody key={data._id} className='ongoing-container-tbody'>
                      <tr className="ongoing-section-tr">
                        <td className='ongoing-section-td'>
                          <div className="ongoing-section-heading">{data.purchaseOrder_id}</div>
                        </td>
                        <td className='ongoing-section-td'>
                          <div className="ongoing-section-heading">{data.enquiry_id}</div>
                        </td>
                        <td className='ongoing-section-td'>
                          <div className="ongoing-section-heading">{data.po_date}</div>
                        </td>
                        <td className='ongoing-section-large-td'>
                          <div className="ongoing-section-heading">{data.supplier_name}</div>
                        </td>
                        <td className='ongoing-section-td'>
                          <div className="ongoing-section-heading">{data.total_amount || totalAmount} USD</div>
                        </td>
                        <td className='ongoing-section-td'>
                          <div className='ongoing-section-button'>
                            <Link to={`/buyer/purchased-order-details/${data.purchaseOrder_id}`}>
                              <div className='ongoing-section-view'>
                                <RemoveRedEyeOutlinedIcon className='ongoing-section-eye' />
                              </div>
                            </Link>
                            <Link to={`/buyer/edit-create-po/${data.purchaseOrder_id}`}>
                              <div className='ongoing-section-delete' onClick={() => showModal(data)}>
                                <EditIcon className='ongoing-section-off' />
                              </div>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  );
                })
              ) : (
                <>
                  <div className='pending-products-no-orders'>
                    No Purchase Orders Available
                  </div>
                </>
              )}
            </table>
          </div>
          {modal && <ongoingCancel setModal={setModal} ongoing={selectedongoing} />}
          <div className='pagi-container'>
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={inquiryPerPage}
              totalItemsCount={totalPoList}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
              itemClass="page-item"
              linkClass="page-link"
              prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
              nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
              hideFirstLastPages={true}
            />
            <div className='pagi-total'>
              Total Items: {totalPoList}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PurchasedOrder;




