import React, { useState } from 'react';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const BuyerActiveCodinator = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 3; 
    
    const activeOrders = [
        { name: 'Mohammad Khan', companyName: 'Sheetal Pvt. Ltd.', designation: 'Manager', mobile: '+971 12345567', email:'company@gmail.com' },
        { name: 'Anmol Singh', companyName: 'Sheetal Pvt. Ltd.', designation: 'Manager', mobile: '+971 12345567', email:'company@gmail.com' },
        { name: 'Harshit Rana', companyName: 'Sheetal Pvt. Ltd.', designation: 'Manager', mobile: '+971 12345567', email:'company@gmail.com' },
    ];

    const data =  activeOrders;

    const indexOfLastOrder  = currentPage * ordersPerPage;
    const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
    const currentOrders     = data.slice(indexOfFirstOrder, indexOfLastOrder);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    return (
        <div className="card-body">
            <div>
                <div className="table-assign-driver-heading">Coordinator List</div>
            </div>
            <table className="table">
                <tbody>

                       {
                        currentOrders.map((order, i) => (
                            <tr key={i}>
                                <td className='tables-td'>
                                    <div className="table-g-section-content">
                                        <span className="table-g-driver-name">Name</span>
                                        <span className="table-g-not-names">{order.name }</span>
                                    </div>
                                </td>
                                <td className='tables-td-cont' >
                                    <div className="table-second-container">
                                        <div className="table-g-section-content">
                                            <span className="table-g-driver-name">Company Name</span>
                                            <span className="table-g-not-name">{order.companyName}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className='tables-td'>
                                    <div className="table-g-section-content">
                                        <span className="table-g-driver-name">Designation</span>
                                        <span className="table-g-not-name">{order.designation}</span>
                                    </div>
                                </td>
                                <td className='tables-td'>
                                    <div className="table-g-section-content">
                                        <span className="table-g-driver-name">Mobile No</span>
                                        <span className="table-g-not-name">{order.mobile}</span>
                                    </div>
                                </td>
                                <td className='tables-td'>
                                    <div className="table-g-section-content">
                                        <span className="table-g-driver-name">Email ID</span>
                                        <span className="table-g-not-name">{order.email}</span>
                                    </div>
                                </td>
                            </tr>
                        ))
                    }
                    
                </tbody>
            </table>
            <div className='pagi-container'>
                <Pagination
                    activePage={currentPage}
                    itemsCountPerPage={ordersPerPage}
                    totalItemsCount={data.length}
                    pageRangeDisplayed={5}
                    onChange={handlePageChange}
                    itemClass="page-item"
                    linkClass="page-link"
                    prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                    nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                    hideFirstLastPages={true}
                />
                <div className='pagi-total'>
                    <div>Total Items: {data.length}</div>
                </div>
            </div>
        </div>
    );
};

export default BuyerActiveCodinator;



