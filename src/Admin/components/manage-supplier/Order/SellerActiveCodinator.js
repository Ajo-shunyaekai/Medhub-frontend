import React, { useState } from 'react';
import Pagination from 'react-js-pagination';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

const SellerActiveCodinator = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const ordersPerPage = 2; 
    
    const activeOrders = [
        { name: 'Mohammad Khan', companyName: 'Sheetal Pvt. Ltd.', designation: 'Manager', mobile: '+971 12345567', email:'sheetalpvt@gmail.com' },
        { name: 'Harshit Rana', companyName: 'Bkart Pvt Ltd', designation: 'CEO', mobile: '+971 867654311', email:'bkart@gmail.com' },
        // { name: 'Mohammad Khan', companyName: 'Sheetal Pvt. Ltd.', designation: 'Marketing Manager', mobile: '+971 12345567', email:'company@gmail.com' },
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
                                        <span className="table-g-not-names">{ order.name ||'Ashok Kumar'}</span>
                                    </div>
                                </td>
                                <td className='tables-td-cont' >
                                    <div className="table-second-container">
                                        <div className="table-g-section-content">
                                            <span className="table-g-driver-name">Company Name</span>
                                            <span className="table-g-not-name">{ order.companyName || 'Bkart Logisctics'}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className='tables-td'>
                                    <div className="table-g-section-content">
                                        <span className="table-g-driver-name">Designation</span>
                                        <span className="table-g-not-name">{order.designation || 'Manager'}</span>
                                    </div>
                                </td>
                                <td className='tables-td'>
                                    <div className="table-g-section-content">
                                        <span className="table-g-driver-name">Mobile No</span>
                                        <span className="table-g-not-name">{ order.mobile || '79751245141'}</span>
                                    </div>
                                </td>
                                <td className='tables-td'>
                                    <div className="table-g-section-content">
                                        <span className="table-g-driver-name">Email ID</span>
                                        <span className="table-g-not-name">{order.email || 'ashok@gmail.com'}</span>
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

export default SellerActiveCodinator;