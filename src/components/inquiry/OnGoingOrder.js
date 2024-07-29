import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import '../../style/ongoingorders.css';
import moment from 'moment-timezone';

const OnGoingongoing = ({inquiryList,totalInquiries,currentPage ,inquiryPerPage,handlePageChange,activeLink}) => {
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
      qty: "500",
      unit_price: "20 USD",

    },
    {
      inquiry_id: "123456",
      date: "12-07-2024",
      supplier_name: "Crystal Medicines Group",
      qty: "500",
      unit_price: "20 USD",

    },
    {
      inquiry_id: "123456",
      date: "12-07-2024",
      supplier_name: "Fourtrek Healthcare",
      qty: "500",
      unit_price: "20 USD",

    },
    {
      inquiry_id: "123456",
      date: "12-07-2024",
      supplier_name: "Ganga Pharma Distributors",
      qty: "500",
      unit_price: "20 USD",

    },
    {
      inquiry_id: "123456",
      date: "12-07-2024",
      supplier_name: "Numera Lifesciences",
      qty: "500",
      unit_price: "20 USD",

    },
    {
      inquiry_id: "123456",
      date: "12-07-2024",
      supplier_name: "Tradeco Pharmaceuticals",
      qty: "500",
      unit_price: "20 USD",
    },
  ];

  // const [currentPage, setCurrentPage] = useState(1);
  // const ongoingsPerPage = 4;

  // const indexOfLastongoing = currentPage * ongoingsPerPage;
  // const indexOfFirstongoing = indexOfLastongoing - ongoingsPerPage;
  // const currentongoings = activeongoings.slice(indexOfFirstongoing, indexOfLastongoing);

  // const handlePageChange = (pageNumber) => {
  //   setCurrentPage(pageNumber);
  // };

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
                    <th className="ongoing-container-th">Quantity</th>
                    <th className="ongoing-container-th">Unit Price</th>
                    {/* <th className="ongoing-container-th">Status</th> */}
                    <th className="ongoing-container-th">Action</th>
                  </tr>
                </thead>
                {inquiryList.map(ongoing => (
                  <tbody key={ongoing.ongoing_id} className='ongoing-container-tbody'>
                    <tr className="ongoing-section-tr">
                      <td className='ongoing-section-td'>
                        <div className="ongoing-section-heading">{ongoing.enquiry_id}</div>
                      </td>
                      <td className='ongoing-section-td'>
                        <div className="ongoing-section-heading">{moment(ongoing?.created_at).format("DD/MM/YYYY")}</div>
                      </td>
                      <td className='ongoing-section-large-td'>
                        <div className="ongoing-section-heading">{ongoing?.supplier.supplier_name}</div>
                      </td>
                      <td className='ongoing-section-td'>
                        <div className="ongoing-section-heading">{ongoing.qty || '700'}</div>
                      </td>
                      <td className='ongoing-section-td'>
                        <div className="ongoing-section-heading">{ongoing.unit_price || '2 AED'}</div>
                      </td>
                      {/* <td className='ongoing-section-td'>
                        <div className="ongoing-section-heading">{ongoing.status}</div>
                      </td> */}
                      <td className='ongoing-section-td'>
                        <div className='ongoing-section-button'>
                          <Link to={`/buyer/ongoing-inquiries-details/${ongoing?.enquiry_id}`}>
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
                itemsCountPerPage={inquiryPerPage}
                totalItemsCount={totalInquiries}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
                itemClass="page-item"
                linkClass="page-link"
                prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                hideFirstLastPages={true}
              />
              <div className='pagi-total'>
                Total Items: {totalInquiries}
              </div>
            </div>
          </div>
        </div>
    </>
  );
}

export default OnGoingongoing;