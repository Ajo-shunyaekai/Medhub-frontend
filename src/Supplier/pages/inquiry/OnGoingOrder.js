import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import '../../style/ongoingorders.css';
import moment from 'moment/moment';

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
      buyer_name: "Divya Pharma Distributors",
     status:"Request"

    },
    {
      inquiry_id: "123456",
      date: "12-07-2024",
      buyer_name: "Crystal Medicines Group",
     status:"Request"

    },
    {
      inquiry_id: "123456",
      date: "12-07-2024",
      buyer_name: "Fourtrek Healthcare",
     status:"Request"

    },
    {
      inquiry_id: "123456",
      date: "12-07-2024",
      buyer_name: "Ganga Pharma Distributors",
      status:"Request"

    },
    {
      inquiry_id: "123456",
      date: "12-07-2024",
      buyer_name: "Numera Lifesciences",
     status:"Request"

    },
    {
      inquiry_id: "123456",
      date: "12-07-2024",
      buyer_name: "Tradeco Pharmaceuticals",
      status:"Request"

    },
  ];



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
                    <th className="ongoing-container-large-th">Buyer Name</th>
                    <th className="ongoing-container-th">Status</th>
                    <th className="ongoing-container-th">Action</th>
                  </tr>
                </thead>
                {inquiryList.map(ongoing => (
                  <tbody key={ongoing.ongoing_id} className='ongoing-container-tbody'>
                    <tr className="ongoing-section-tr">
                      <td className='ongoing-section-td'>
                        <div className="ongoing-section-heading">{ongoing?.enquiry_id}</div>
                      </td>
                      <td className='ongoing-section-td'>
                        <div className="ongoing-section-heading">{moment(ongoing?.created_at).format("DD/MM/YYYY")}</div>
                      </td>
                      <td className='ongoing-section-large-td'>
                        <div className="ongoing-section-heading">{ongoing?.buyer.buyer_name}</div>
                      </td>
                      <td className='ongoing-section-td'>
                        <div className="ongoing-section-heading">
                          {/* {ongoing?.enquiry_status?.charAt(0)?.toUpperCase() + ongoing?.enquiry_status?.slice(1) } */}
                          {ongoing?.enquiry_status?.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                          </div>
                      </td>
                      <td className='ongoing-section-td'>
                        <div className='ongoing-section-button'>
                          <Link to={`/supplier/inquiry-request-details/${ongoing?.enquiry_id}`}>
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