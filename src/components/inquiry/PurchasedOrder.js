import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
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
      inquiry_id: "123456",
      date: "12-07-2024",
      supplier_name: "Divya Pharma Distributors",
      unit_price: "20000 USD",

    },
    {
      inquiry_id: "123456",
      date: "12-07-2024",
      supplier_name: "Crystal Medicines Group",
      unit_price: "80000 USD",

    },
    {
      inquiry_id: "123456",
      date: "12-07-2024",
      supplier_name: "Fourtrek Healthcare",
      unit_price: "14000 USD",

    },
    {
      inquiry_id: "123456",
      date: "12-07-2024",
      supplier_name: "Ganga Pharma Distributors",
      unit_price: "30000 USD",

    },
    {
      inquiry_id: "123456",
      date: "12-07-2024",
      supplier_name: "Numera Lifesciences",
      unit_price: "10000 USD",

    },
    {
      inquiry_id: "123456",
      date: "12-07-2024",
      supplier_name: "Tradeco Pharmaceuticals",
      unit_price: "8000 USD",

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
          <div className="ongoing-container-right-section">
            <div className='ongoing-inner-container-section'>
              <table className="table-ongoing-container">
                <thead className='ongoing-container-thead'>
                  <tr className='ongoing-container-tr'>
                    <th className="ongoing-container-th">Inquiry ID</th>
                    <th className="ongoing-container-th">Date</th>
                    <th className="ongoing-container-large-th">Supplier Name</th>
                    {/* <th className="ongoing-container-th">Quantity</th> */}
                    <th className="ongoing-container-th">Total Amount</th>
                    {/* <th className="ongoing-container-th">Status</th> */}
                    <th className="ongoing-container-th">Action</th>
                  </tr>
                </thead>
                {currentongoings.map(ongoing => (
                  <tbody key={ongoing.ongoing_id} className='ongoing-container-tbody'>
                    <tr className="ongoing-section-tr">
                      <td className='ongoing-section-td'>
                        <div className="ongoing-section-heading">{ongoing.inquiry_id}</div>
                      </td>
                      <td className='ongoing-section-td'>
                        <div className="ongoing-section-heading">{ongoing.date}</div>
                      </td>
                      <td className='ongoing-section-large-td'>
                        <div className="ongoing-section-heading">{ongoing.supplier_name}</div>
                      </td>
                      <td className='ongoing-section-td'>
                        <div className="ongoing-section-heading">{ongoing.unit_price}</div>
                      </td>
                      {/* <td className='ongoing-section-td'>
                        <div className="ongoing-section-heading">{ongoing.status}</div>
                      </td> */}
                      <td className='ongoing-section-td'>
                        <div className='ongoing-section-button'>
                          <Link to='/buyer/purchased-order-details'>
                            <div className='ongoing-section-view'>
                              <RemoveRedEyeOutlinedIcon className='ongoing-section-eye' />
                            </div>
                          </Link>
                          <div className='ongoing-section-delete' onClick={() => showModal(ongoing)}>
                            <HighlightOffIcon className='ongoing-section-off' />
                          </div>
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




