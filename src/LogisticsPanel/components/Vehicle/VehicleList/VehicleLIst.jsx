import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import ActiveOrder from "../../Orders/ActiveOrders/ActiveOrder";
import { toast } from "react-toastify";
import { apiRequests } from "../../../../api";
import "./VehicleList.css";

import './vehicleorder.css';
import './vehiclelists.css';
import Pagination from "react-js-pagination";
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';
import moment from 'moment/moment';

const VehicleList = () => {
  const navigate                        = useNavigate();
  const [loading, setLoading]           = useState(true);
  const [list, setList]                 = useState([]);
  const [totalList, setTotalList]       = useState();
  const [currentPage, setCurrentPage]   = useState(1);
  const listPerPage                     = 5;

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const fetchData = async () => {
    const partnerIdSessionStorage = sessionStorage.getItem("partner_id");
    const partnerIdLocalStorage = localStorage.getItem("partner_id");

    if (!partnerIdSessionStorage && !partnerIdLocalStorage) {
      navigate("/logistics/login");
      return;
    }

    try {
      const response = await apiRequests.getRequest(
        `logistics/get-logistics-request-list?status=active&pageNo=${currentPage}&pageSize=${listPerPage}`
      );
      if (response.code === 200) {
        setList(response.result.data);
        setTotalList(response.result.totalItems);
      }
    } catch (error) {
      toast(error.message, { type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [currentPage]);

  return (
    <>
      <div className="order-main-container">
        <div className="order-name">List of Vehicle's</div>
        <div className="order-container-right container mt-3">
          <div responsive="xl" className="order-table-responsive">
            <div className='order-main-container'>
              <div className="order-name-2"> Active Requests</div>
              <div className="order-container">
                  <div className="order-container-right-section">
                      <div className='order-inner-container-section'>
                          <table className="table-container">
                              <thead className='order-container-thead'>
                                  <tr className='order-container-tr'>
                                      <th className="order-container-th"><div className="order-container-head">Vehicle ID</div></th>
                                      <th className="order-container-th"><div className="order-container-head">Vehicle Name</div></th>
                                      <th className="order-container-th"><div className="order-container-head">Driver Name</div></th>
                                      <th className="order-container-th"><div className="order-container-head">Contact Number</div></th>
                                      <th className="order-container-th"><div className="order-container-head">Load Capacity</div></th>
                                      <th className="order-container-th"><div className="order-container-head">Transport Type</div></th>
                                      <th className="order-container-th"><div className="order-container-head">Status</div></th>
                                  </tr>
                              </thead>

                              {
                                  list && list.length > 0 ? (
                                      list?.map((order, i) => {
                                          
                                          const orderedDate = moment(order.created_at).format("DD/MM/YYYY")
                                          return (
                                              <tbody className='order-container-tbody'>
                                                  <tr className="order-section-tr">

                                                      <td className='order-section-td'>
                                                          <div className="order-section-heading">{orderedDate}</div>
                                                      </td>
                                                      <td className='order-section-td'>
                                                          <div className="order-section-heading">{order.logistics_id}</div>
                                                      </td>
                                                      <td className='order-section-td'>
                                                          <div className="order-section-heading">{order.supplierDetails?.[0]?.supplier_name}</div>
                                                      </td>
                                                      <td className='order-section-td'>
                                                          <div className="order-section-heading">{order.supplierDetails?.[0]?.supplier_name}</div>
                                                      </td>
                                                      <td className='order-section-td'>
                                                          <div className="order-section-heading">{order.supplierDetails?.[0]?.supplier_name}</div>
                                                      </td>
                                                      <td className='order-section-td'>
                                                          <div className="order-section-heading">
                                                          {order?.status?.charAt(0).toUpperCase() + order?.status?.slice(1)}
                                                          </div>
                                                      </td>
                                                      <td className='order-section-button-cont'>
                                                          <div className='order-section-button'>
                                                            <Link to={`/logistics/pickup-order-details/${order.logistics_id}`}>
                                                                <div className='order-section-view'>
                                                                    <RemoveRedEyeOutlinedIcon className='order-section-eye' />
                                                                </div>
                                                            </Link>
                                                          </div>
                                                      </td>
                                                  </tr>
                                              </tbody>
                                          )
                                      })
                                  ) :
                                      (
                                          <>
                                              <div className='pending-products-no-orders'>
                                                  No Vehicle
                                              </div>
                                          </>
                                      )

                              }
                          </table>
                      </div>
                      {
                          list && list.length > 0 ? (
                              <div className='pagi-container'>
                                  <Pagination
                                      activePage={currentPage}
                                      itemsCountPerPage={listPerPage}
                                      totalItemsCount={totalList}
                                      pageRangeDisplayed={5}
                                      onChange={handlePageChange}
                                      itemClass="page-item"
                                      linkClass="page-link"
                                      prevPageText={<KeyboardDoubleArrowLeftIcon style={{ fontSize: '15px' }} />}
                                      nextPageText={<KeyboardDoubleArrowRightIcon style={{ fontSize: '15px' }} />}
                                      hideFirstLastPages={true}
                                  />
                                  <div className='pagi-total'>
                                      <div className='pagi-total'>
                                          Total Items: {totalList}
                                      </div>
                                  </div>
                              </div>
                          ) : ''
                      }

                  </div>
              </div>
          </div >
          </div>
        </div>
      </div>
    </>
  );
};

export default VehicleList;
