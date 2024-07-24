import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import '../../style/ongoingorders.css';

const PurchasedOrder = () => {
  const [modal, setModal] = useState(false);
  const [selectedongoing, setSelectedongoing] = useState(null);

  const showModal = (ongoing) => {
    setSelectedongoing(ongoing);
    setModal(true);
  };

  const activeongoings = [
    {
      pono: "123456",
      podate: "12-07-2024",
      buyer_name: "Divya Pharma Distributors",
      unit_price: "5000 USD",
    },
    {
      pono: "123456",
      podate: "12-07-2024",
      buyer_name: "Divya Pharma Distributors",
      unit_price: "8000 USD",
    },
    {
      pono: "123456",
      podate: "12-07-2024",
      buyer_name: "Divya Pharma Distributors",
      unit_price: "10000 USD",
    },
    {
      pono: "123456",
      podate: "12-07-2024",
      buyer_name: "Divya Pharma Distributors",
      unit_price: "22000 USD",
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const ongoingsPerPage = 4;

  const indexOfLastongoing = currentPage * ongoingsPerPage;
  const indexOfFirstongoing = indexOfLastongoing - ongoingsPerPage;
  const currentongoings = activeongoings.slice(indexOfFirstongoing, indexOfLastongoing);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <div className="ongoing-container">
        {/* <Link to='/create-PO'>
          <div className='ongoing-order-container-heading-button'>
            <span className='ongoing-order-button-span'>Create Purchased Order</span>
          </div>
        </Link> */}
        <div className="ongoing-container-right-section">
          <div className='ongoing-inner-container-section'>
            <table className="table-ongoing-container">
              <thead className='ongoing-container-thead'>
                <tr className='ongoing-container-tr'>
                  <th className="ongoing-container-th">PO ID</th>
                  <th className="ongoing-container-th">PO Date</th>
                  <th className="ongoing-container-large-th">Buyer Name</th>
                  {/* <th className="ongoing-container-th">Quantity</th> */}
                  <th className="ongoing-container-th">Total Amount</th>
                  <th className="ongoing-container-th">Action</th>
                </tr>
              </thead>
              {currentongoings.map(ongoing => (
                <tbody key={ongoing.ongoing_id} className='ongoing-container-tbody'>
                  <tr className="ongoing-section-tr">
                    <td className='ongoing-section-td'>
                      <div className="ongoing-section-heading">{ongoing.pono}</div>
                    </td>
                    <td className='ongoing-section-td'>
                      <div className="ongoing-section-heading">{ongoing.podate}</div>
                    </td>
                    <td className='ongoing-section-large-td'>
                      <div className="ongoing-section-heading">{ongoing.buyer_name}</div>
                    </td>
                    {/* <td className='ongoing-section-td'>
                      <div className="ongoing-section-heading">{ongoing.qty}</div>
                    </td> */}
                    <td className='ongoing-section-td'>
                      <div className="ongoing-section-heading">{ongoing.unit_price}</div>
                    </td>
                    <td className='ongoing-section-td'>
                      <div className='ongoing-section-button'>
                        <Link to='/supplier/purchased-order-details'>
                          <div className='ongoing-section-view'>
                            <RemoveRedEyeOutlinedIcon className='ongoing-section-eye' />
                          </div>
                        </Link>
                      </div>
                    </td>
                  </tr>
                </tbody>
              ))}
            </table>
          </div>
          {modal && <ongoingCancel setModal={setModal} ongoing={selectedongoing} />}
          <div className='pagi-container'>
            <Pagination
              activePage={currentPage}
              itemsCountPerPage={ongoingsPerPage}
              totalItemsCount={activeongoings.length}
              pageRangeDisplayed={5}
              onChange={handlePageChange}
              itemClass="page-item"
              linkClass="page-link"
              prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
              nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
              hideFirstLastPages={true}
            />
            <div className='pagi-total'>
              Total Items: {activeongoings.length}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PurchasedOrder;




