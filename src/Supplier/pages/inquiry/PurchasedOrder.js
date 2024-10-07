import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import '../../style/ongoingorders.css';

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
                  <th className="ongoing-container-th">PO Date</th>
                  <th className="ongoing-container-large-th">Buyer Name</th>
                  <th className="ongoing-container-th">Status</th>
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
                          <div className="ongoing-section-heading">{data.buyer_name}</div>
                        </td>
                        <td className='ongoing-section-td'>
                          <div className="ongoing-section-heading">{data?.po_status?.charAt(0)?.toUpperCase() + data?.po_status?.slice(1)}</div>
                        </td>
                        <td className='ongoing-section-td'>
                          <div className='ongoing-section-button'>
                            <Link to={`/supplier/proforma-invoice/${data.purchaseOrder_id}`}>
                              <div className='ongoing-section-button-section-cont'>
                                <span className='ongoing-section-orders-button'>Make Order</span>
                              </div>
                            </Link>
                            <Link to={`/supplier/purchased-order-details/${data.purchaseOrder_id}`}>
                              <div className='ongoing-section-view'>
                                <RemoveRedEyeOutlinedIcon className='ongoing-section-eye' />
                              </div>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  );
                })
              ) : (
                <div className='pending-products-no-orders'>
                 No Purchase Orders Available
                 </div>
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

