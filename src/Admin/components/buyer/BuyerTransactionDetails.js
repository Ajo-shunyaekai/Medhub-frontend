import React, { useEffect, useState } from 'react';
import '../../style/transacetiondetails.css'
import 'react-responsive-modal/styles.css';
import { useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../../api/Requests';
import { toast } from 'react-toastify';
import { FaFilePdf } from 'react-icons/fa';
import Image1 from '../../assest/tax-certificate.jpg'
const BuyerTransactionDetails = () => {
  const { supplierId } = useParams()
  const navigate = useNavigate()
  const adminIdSessionStorage = sessionStorage.getItem("admin_id");
  const adminIdLocalStorage = localStorage.getItem("admin_id");
  const [supplierDetails, setSupplierDetails] = useState()
  // Start the modal and pdf url
  const [open, setOpen] = useState(false);
  const [pdfUrl, setPdfUrl] = useState(null);
  const openModal = (url) => {
    window.open(url, '_blank');
  };

  const closeModal = () => {
    setOpen(false);
    setPdfUrl(null);
  };
  const extractFileName = (url) => {
    return url.split('/').pop();
  };

  // Assuming `supplierDetails` has arrays like `license_image`, `tax_image`, and `certificate_image`
  const renderFiles = (files, type) => {
    return files?.map((file, index) => {
      if (file.endsWith('.pdf')) {
        // Render a PDF icon with a clickable link
        return (
          <div key={index} className='transaction-details-pdf-section'>
            <FaFilePdf
              size={50}
              color="red"
              style={{ cursor: 'pointer' }}
              onClick={() => openModal(`${process.env.REACT_APP_SERVER_URL}uploads/supplier/${type}/${file}`)}
            />
            <div className='pdf-url' onClick={() => openModal(`${process.env.REACT_APP_SERVER_URL}uploads/supplier/${type}/${file}`)}>
              {extractFileName(file)}
            </div>
          </div>
        );
      } else {
        // Render an image
        return (
          <img
            key={index}
            src={`${process.env.REACT_APP_SERVER_URL}uploads/supplier/${type}/${file}`}
            alt={type}
            className='transaction-details-document-image'
          />
        );
      }
    });
  };




  // End the modal and pdf url
  useEffect(() => {
    if (!adminIdSessionStorage && !adminIdLocalStorage) {
      navigate("/admin/login");
      return;
    }
    const obj = {
      admin_id: adminIdSessionStorage || adminIdLocalStorage,
      supplier_id: supplierId,
    }
    postRequestWithToken('admin/get-supplier-details', obj, async (response) => {
      if (response.code === 200) {
        setSupplierDetails(response.result)
      } else {
        console.log('error in get-supplier-details api', response);
      }
    })
  }, [])

  const handleAcceptReject = (action) => {
    const obj = {
      admin_id: adminIdSessionStorage || adminIdLocalStorage,
      supplier_id: supplierId,
      action
    }

    postRequestWithToken('admin/accept-reject-supplier-registration', obj, async (response) => {
      if (response.code === 200) {
        toast(response.message, { type: 'success' })
        setTimeout(() => {
          navigate('/admin/seller-request')
        }, 1000)

        // setSupplierDetails(response.result)
      } else {
        console.log('error in accept-reject-supplier api', response);
        toast(response.message, { type: 'error' })
      }
    })
  }
  return (
    <>
      <div className='transaction-details-container'>
        <div className='transaction-details-inner-conatiner'>
          <div className='transaction-details-container-heading'>Buyer Transaction Details</div>
          <div className='transaction-details-left-inner-container'>
            <div className='transaction-details-left-uppar-section'>
              <div className='transaction-details-uppar-main-logo-section'>
                <div className='transaction-details-left-uppar-section'>
                  <div className='transaction-details-uppar-main-logo-section'>
                    <div className='transaction-details-uppar-right-main-section'>
                      <div className='transaction-details-uppar-right-main-section'>
                        <div className='transaction-details-uppar-right-container-section'>
                          <div className='transaction-details-company-type-section'>
                            <div className='transaction-details-company-type-sec-head'>Invoice No:</div>
                            <div className='transaction-details-company-type-sec-text'>147852669</div>
                          </div>
                          <div className='transaction-details-company-type-section'>
                            <div className='transaction-details-company-type-sec-head'>Order ID:</div>
                            <div className='transaction-details-company-type-sec-text'>147852369</div>
                          </div>
                          <div className='transaction-details-company-type-section'>
                            <div className='transaction-details-company-type-sec-head'>Buyer Name:</div>
                            <div className='transaction-details-company-type-sec-text'>Pharmaceuticals</div>
                          </div>
                        </div>
                        <div className='transaction-details-uppar-right-container-section'>

                          <div className='transaction-details-company-type-section'>
                            <div className='transaction-details-company-type-sec-head'>Supplier Name:</div>
                            <div className='transaction-details-company-type-sec-text'>Sheetal Pharmacy</div>
                          </div>
                          <div className='transaction-details-uppar-main-containers'>
                            <div className='transaction-details-left-inner-section'>
                              <div className='transaction-details-left-company-type'>
                                <div className='transaction-details-company-type-sec-head'>Amount:</div>
                                <div className='transaction-details-company-type-sec-text'>2500 USD</div>
                              </div>
                              <div className='transaction-details-left-company-type'>
                                <div className='transaction-details-company-type-sec-head'>Payment Type:</div>
                                <div className='transaction-details-company-type-sec-text'>Cheque</div>
                              </div>
                              <div className='transaction-details-left-company-type'>
                                <div className='transaction-details-company-type-sec-head'>Status:</div>
                                <div className='transaction-details-company-type-sec-text'>Pending</div>
                              </div>
                            </div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='transaction-details-card-section'>
            <div className='transaction-details-uppar-card-section'>
              <div className='transaction-details-uppar-card-inner-section'>

                {/* Trade License */}
                <div className='transaction-details-card-container'>
                  <div className='transaction-details-company-logo-heading'>Cheque Image</div>
                  <div className='transaction-details-company-img-container'>
                    <img src={Image1} alt='image' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default BuyerTransactionDetails
