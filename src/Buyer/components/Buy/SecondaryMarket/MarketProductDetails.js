import React, { useEffect, useState } from 'react';
import '../ByProduct/productDetails.css';
import CountryDetails from '../CountryDetails';
import { Link, useNavigate, useParams } from 'react-router-dom';
// import Invoice from '../assest/invoice.pdf'
import Select from 'react-select';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { toast, ToastContainer } from "react-toastify";
import SecondaryProductDetails from './SecondaryProductDetails';
import { postRequestWithToken } from '../../../../api/Requests';


const MarketProductDetails = () => {
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();
    const { medicineId } = useParams()

    const [loading, setLoading] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const [details, setDetails] = useState()
    const [medId, setMedId] = useState(medicineId)
    const [supplierId, setSupplierId] = useState()
    const [medicineName, setMedicineName] = useState()
    const [newMedicineName, setNewMedicineName] = useState()
    const [similarMedicinesList, setSimilarMedicinesList] = useState([])
    const [invoiceImage, setInvoiceImage] = useState([])

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalitems] = useState()
    const itemsPerPage = 2;

    const [selectedOption, setSelectedOption] = useState(null);
    const [selectedDetails, setSelectedDetails] = useState({});
    const [quantityRequired, setQuantityRequired] = useState('');
    const [targetPrice, setTargetPrice] = useState('');
    const [errors, setErrors] = useState({});

    const hasInventoryInfo = details && details.inventory_info && details.inventory_info.length > 0;

    const options = hasInventoryInfo
        ? details.inventory_info.map((item, index) => ({
            value: index,
            label: item.quantity
        }))
        : [];

    useEffect(() => {
        if (hasInventoryInfo) {
            setSelectedOption(options[0]);
            setSelectedDetails(details.inventory_info[0]);
        }
    }, [details]);

    const handleSelectChange = (selectedOption) => {
        setQuantityRequired('')
        setTargetPrice('')
        setSelectedOption(selectedOption);
        setSelectedDetails(details.inventory_info[selectedOption.value]);
    };

    const handleDownloadPDF = () => {
        const input = document.getElementById('invoice-section');

        html2canvas(input)
            .then((canvas) => {
                const imgData = canvas.toDataURL('image/png');
                const pdf = new jsPDF();
                const imgProps = pdf.getImageProperties(imgData);
                const pdfWidth = pdf.internal.pageSize.getWidth();
                const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

                pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
                pdf.save('invoice.pdf');
            })
            .catch((error) => {
                console.error('Error generating PDF', error);
            });
    };

    const toggleModal = () => {
        setShowModal(!showModal);
    };

    const closeModal = (e) => {
        if (e.target.className === 'modal') {
            setShowModal(false);
        }
    };

    useEffect(() => {
        const buyerIdSessionStorage = sessionStorage.getItem("buyer_id");
        const buyerIdLocalStorage = localStorage.getItem("buyer_id");

        if (!buyerIdSessionStorage && !buyerIdLocalStorage) {
            navigate("/buyer/login");
            return;
        }

        const obj = {
            medicine_id: medId,
            buyer_id: buyerIdSessionStorage || buyerIdLocalStorage
        }

        postRequestWithToken('buyer/medicine/medicine-details', obj, async (response) => {
            if (response.code === 200) {
                setDetails(response?.result?.data)
                setInvoiceImage(response?.result?.data?.invoice_image[0])
                setMedicineName(response?.result?.data?.medicine_name)
                setSupplierId(response?.result?.data?.supplier_id)
            } else {
                console.log('error in med details api');
            }
        })
    }, [medId])

    useEffect(() => {
        const obj = {

            medicine_id: medicineId,
            supplier_id: supplierId,
            medicine_type: 'secondary market',
            status: 1,
            pageNo: 1,
            pageSize: 3
            // medicine_name : medicineName
        }
        postRequestWithToken('buyer/medicine/other-medicine-list', obj, async (response) => {
            if (response.code === 200) {
                setSimilarMedicinesList(response?.result?.data)
                setTotalitems(response.result.totalItems)
            } else {
                console.log('error in similar-medicine-list api');
            }
        })
    }, [medicineName, medId, currentPage])

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const validateInputs = () => {
        let formErrors = {};
        if (!quantityRequired || isNaN(quantityRequired) || quantityRequired <= 0) {
            formErrors.quantityRequired = 'Please enter a valid quantity.';
        }
        if (!targetPrice || isNaN(targetPrice) || targetPrice <= 0) {
            formErrors.targetPrice = 'Please enter a valid target price.';
        }
        setErrors(formErrors);
        return Object.keys(formErrors).length === 0;
    };

    const handleMedicineClick = (newMedicineId, newMedicine) => {
        setMedId(newMedicineId)
        setNewMedicineName(newMedicine)
        navigate(`/buyer/market-product-details/${newMedicineId}`);
    };

    const handleAddToList = async (e) => {
        e.preventDefault();
        const quantityRequiredNumber = Number(quantityRequired);
        const minPurchaseUnit = Number(details?.min_purchase_unit);

        if (validateInputs()) {
            if (quantityRequiredNumber < minPurchaseUnit) {
                toast('Quantity required should be greater than or equal to minimum purchase unit', { type: 'error' })
                return
            } else {
                setLoading(true)
                const obj = {
                    medicine_id: medId,
                    supplier_id: supplierId,
                    buyer_id: sessionStorage.getItem('buyer_id') || localStorage.getItem('buyer_id'),
                    quantity_required: quantityRequired,
                    target_price: targetPrice,
                    quantity: selectedDetails.quantity,
                    unit_price: selectedDetails.unit_price,
                    est_delivery_time: selectedDetails.est_delivery_days
                };

                postRequestWithToken('buyer/add-to-list', obj, async (response) => {
                    if (response.code === 200) {
                        toast(response.message, { type: "success" });
                        sessionStorage.setItem('list_count', response.result.listCount)
                        setTimeout(() => {
                            navigate('/buyer/send-inquiry')
                            setLoading(true)
                        }, 1000);
                    } else {
                        setLoading(false)
                        toast(response.message, { type: "error" });
                        console.log('error in similar-medicine-list api');
                    }
                });
            }

        } else {
            setLoading(false)
            toast('Some Fields are Missing', { type: "error" });
            setButtonLoading(false)
        }
    };

    const handleQuantityChange = (e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
            setQuantityRequired(value);
        }
    };

    const handleTargetPriceChange = (e) => {
        const value = e.target.value;
        if (/^\d*\.?\d*$/.test(value)) {
            setTargetPrice(value);
        }
    };

    return (
        <>
            <div className='main-product-details-container'>
                <div className="buyer-product-details-cover">
                    <div className='buyer-product-details-container-main'>
                        <div className="buyer-product-details-section-one">
                            <div className="buyer-product-details-sec-one-left">
                                <h4>
                                    {details?.medicine_name} <span className='buyer-product-details-stength'> ({details?.strength.includes('mg') ? details?.strength : `${details?.strength}mg`})</span>
                                </h4>
                                {/* <p className="font-semibold text-[12px] leading-[21px] md:text-[16px] md:leading-[28px] text-gray-700 m-0">
                                    {details?.composition}
                                </p> */}
                            </div>
                        </div>
                    </div>

                    <div className="buyer-product-details-wrapper">
                        <div className='buyer-product-details-container'>
                            <div className="buyer-product-details-section-two">
                                <div className="buyer-product-details-sec-two-left">
                                    <div className="buyer-product-details-two">
                                        <div className='buyer-product-details-two-left-text'>Purchased on :</div>
                                        <div className='buyer-product-details-two-right-text'>{details?.purchased_on}</div>
                                    </div>
                                    <div className="buyer-product-details-two">
                                        <div className='buyer-product-details-two-left-text'>Country Available in :</div>
                                        <div className='buyer-product-details-two-right-text'>{details?.country_available_in?.join(', ')}</div>
                                    </div>
                                    <div className="buyer-product-details-two">
                                        <div className='buyer-product-details-two-left-text'>Total Quantity :</div>
                                        <div className='buyer-product-details-two-right-text'>{details?.total_quantity}</div>
                                    </div>
                                </div>
                                <div className="buyer-product-details-sec-two-left">
                                    <div className="buyer-product-details-two">
                                        <div className='buyer-product-details-two-left-text'>Unit Price :</div>
                                        <div className='buyer-product-details-two-right-text'>{details?.unit_price} USD</div>
                                    </div>
                                    <div className="buyer-product-details-two">
                                        <div className='buyer-product-details-two-left-text'>Minimum Purchase :</div>
                                        <div className='buyer-product-details-two-right-text'>{details?.min_purchase_unit} Unit</div>
                                    </div>
                                    <div className="buyer-product-details-two">
                                        <div className='buyer-product-details-two-left-text'>Condition :</div>
                                        <div className='buyer-product-details-two-right-text'>{details?.condition}</div>
                                    </div>
                                </div>
                                <div className="buyer-product-details-sec-two-button-cont">
                                    <div className='buyer-product-details-view-button-invoice' onClick={toggleModal}>
                                        <span className='view-purchase-invoice-button-sec'>View Purchase Invoice</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className='buyer-product-details-container'>
                            <div className="buyer-product-details-section-two">
                                <div className="buyer-product-details-sec-two-left">
                                    <div className="buyer-product-details-two">
                                        <div className='buyer-product-details-two-left-text'>Shipping Time :</div>
                                        <div className='buyer-product-details-two-right-text'>{details?.shipping_time}</div>
                                    </div>
                                    <div className="buyer-product-details-two">
                                        <div className='buyer-product-details-two-left-text'>Dossier Type :</div>
                                        <div className='buyer-product-details-two-right-text'>{details?.dossier_type}</div>
                                    </div>
                                    <div className="buyer-product-details-two">
                                        <div className='buyer-product-details-two-left-text'>Dossier Status :</div>
                                        <div className='buyer-product-details-two-right-text'>{details?.dossier_status}</div>
                                    </div>
                                    <div className="buyer-product-details-two">
                                        <div className='buyer-product-details-two-left-text'>Type of Form :</div>
                                        <div className='buyer-product-details-two-right-text'>{details?.type_of_form}</div>
                                    </div>
                                    <div className="buyer-product-details-two">
                                        <div className='buyer-product-details-two-left-text'>Tax% :</div>
                                        <div className='buyer-product-details-two-right-text'>{details?.unit_tax}%</div>
                                    </div>
                                </div>
                                <div className="buyer-product-details-sec-two-left">
                                    <div className="buyer-product-details-two">
                                        <div className='buyer-product-details-two-left-text'>Product Category :</div>
                                        <div className='buyer-product-details-two-right-text'>{details?.medicine_category}</div>
                                    </div>
                                    <div className="buyer-product-details-two">
                                        <div className='buyer-product-details-two-left-text'>Shelf Life :</div>
                                        <div className='buyer-product-details-two-right-text'>{details?.shelf_life} Months</div>
                                    </div>
                                    <div className="buyer-product-details-two">
                                        <div className='buyer-product-details-two-left-text'>Country of Origin :</div>
                                        <div className='buyer-product-details-two-right-text'>{details?.country_of_origin}</div>
                                    </div>
                                    <div className="buyer-product-details-two">
                                        <div className='buyer-product-details-two-left-text'>GMP Approvals :</div>
                                        <div className='buyer-product-details-two-right-text'>{details?.gmp_approvals}</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className='buyer-product-details-container'>
                            <div className="buyer-product-details-section-two-img">
                                {details?.medicine_image?.map((image, j) => (
                                    <div className="buyer-product-details-sec-img-left" key={j}>
                                        <img src={`${process.env.REACT_APP_SERVER_URL}uploads/medicine/product_files/${image}`} alt={`${image.medicine_name}`} className="responsive-image" />
                                    </div>

                                ))}
                            </div>

                        </div>
                        <div className='buyer-product-details-container'>
                            <div className="buyer-product-details-country-section">
                                <div className="buyer-product-details-county">
                                    <div className='buyer-product-details-four-left-text'>Registered in :</div>
                                    <div className='buyer-product-details-four-right-text'> <CountryDetails countryData={details?.registered_in} /></div>
                                </div>
                                <div className="buyer-product-details-county">
                                    <div className='buyer-product-details-four-left-text'>Tags :</div>
                                    <div className='buyer-product-details-four-right-text'>{details?.tags?.join(', ')}</div>
                                </div>
                                <div className="buyer-product-details-county">
                                    <div className='buyer-product-details-four-left-text'>Available for :</div>
                                    <div className='buyer-product-details-four-right-text'>{details?.available_for}</div>
                                </div>
                                {/* <div className="buyer-product-details-county">
                                    <div className='buyer-product-details-four-left-text'>Comments :</div>
                                    <div className='buyer-product-details-four-right-text'>
                                        {details?.description}
                                    </div>
                                </div> */}
                            </div>
                        </div>

                        <div className='buyer-product-details-company-section'>
                            <div className='buyer-product-details-company-conatiner'>
                                <div className='buyer-product-details-inner-company'>
                                    <Link to='/buyer/supplier-details'>
                                        <div className='buyer-product-details-inner-copmany-head'>Supplier Name :</div>
                                        <div className='buyer-product-details-inner-copmany-text'>{details?.supplier?.supplier_name}</div>
                                    </Link>
                                </div>
                                <div className='buyer-product-details-inner-company'>
                                    <div className='buyer-product-details-inner-copmany-head'>Company Type :</div>
                                    <div className='buyer-product-details-inner-copmany-text'>{details?.supplier?.supplier_type}</div>
                                </div>
                                <div className="buyer-product-details-inner-company-stockedin">
                                    <div className="buyer-product-details-inner-copmany-head">Stocked in :</div>
                                    <div className="buyer-product-details-inner-copmany-text">
                                        <div className='buyer-product-details-main-company-section'>
                                            <div className='buyer-stockedin-heading'>Countries</div>
                                            <div className='buyer-stockedin-heading'>Quantity</div>
                                        </div>
                                        <>
                                            {details?.stockedIn_details?.map((item, index) => (
                                                <div className='buyer-product-details-main-company-section' key={index}>
                                                    <div className='buyer-product-details-main-company-stockedin'>
                                                        {item.stocked_in_country}
                                                    </div>
                                                    <div className='buyer-product-details-main-company-totalquantity'>
                                                        {item.stocked_quantity} {item.stocked_in_type}
                                                    </div>
                                                </div>
                                            ))}
                                        </>
                                    </div>
                                </div>

                            </div>
                            <div className='buyer-product-details-company-conatiner'>
                                <div className='buyer-product-details-inner-company'>
                                    <div className='buyer-product-details-inner-copmany-head'>License No. :</div>
                                    <div className='buyer-product-details-inner-copmany-text'>{details?.supplier?.license_no}</div>
                                </div>
                                <div className='buyer-product-details-inner-company'>
                                    <div className='buyer-product-details-inner-copmany-head'>Tax No. :</div>
                                    <div className='buyer-product-details-inner-copmany-text'>{details?.supplier?.tax_no}</div>
                                </div>
                            </div>
                        </div>

                        <div className='buyer-product-details-containers'>
                            <div className="buyer-product-details-mfg-container">
                                <div className="buyer-product-details-mfg-heading">Description</div>
                                <div className="buyer-product-details-mfg-details">{details?.supplier?.description}</div>
                            </div>
                        </div>
                        <div className="buyer-product-details-container">
                            <div className="buyer-product-range-details">
                                <div className="buyer-product-range-select">
                                    <div className="buyer-product-range-heading">Quantity</div>
                                    <Select className="buyer-product-range-select-fields" options={options} value={selectedOption} onChange={handleSelectChange} />
                                </div>
                                <div className="buyer-product-range-text">
                                    <div className="buyer-product-range-heading">Unit Price</div>
                                    <input className="buyer-product-range-input" type="text" value={`${selectedDetails.unit_price} USD`} readOnly />
                                </div>
                                <div className="buyer-product-range-text">
                                    <div className="buyer-product-range-heading">Est. Delivery Time</div>
                                    <input className="buyer-product-range-input" type="text"
                                        // value={selectedDetails.est_delivery_days}
                                        value={
                                            selectedDetails.est_delivery_days
                                                ? selectedDetails.est_delivery_days.toLowerCase().includes('days')
                                                    ? selectedDetails.est_delivery_days.replace(/days/i, 'Days')
                                                    : `${selectedDetails.est_delivery_days} Days`
                                                : ''
                                        }
                                        readOnly />
                                </div>
                                <div className="buyer-product-range-text">
                                    <div className="buyer-product-range-heading">Quantity Required</div>
                                    <input className="buyer-product-range-input" type="text"
                                        placeholder='Enter Qty Req.' value={quantityRequired}
                                        //  onChange={(e) => setQuantityRequired(e.target.value)} 
                                        onInput={handleQuantityChange}
                                    />
                                    {errors.quantityRequired && <div className="buyer-product-error">{errors.quantityRequired}</div>}
                                </div>
                                <div className="buyer-product-range-text">
                                    <div className="buyer-product-range-heading">Target Price</div>
                                    <input className="buyer-product-range-input" type="text" placeholder='Enter Target Price'
                                        value={targetPrice}
                                        // onChange={(e) => setTargetPrice(e.target.value)}
                                        onInput={handleTargetPriceChange}
                                    />
                                    {errors.targetPrice && <div className="buyer-product-error">{errors.targetPrice}</div>}
                                </div>
                            </div>

                        </div>
                        <div className="buyer-product-details-main-button-section">
                            <button
                                className="buyer-product-details-list-button"
                                onClick={handleAddToList}
                                disabled={loading}
                            >
                                {/* Add to List */}
                                {loading ? (
                                    <div className='loading-spinner'></div>
                                ) : (
                                    'Add to List'
                                )}
                            </button>

                            <div className="buyer-product-details-cancel-button"
                                onClick={() => {
                                    setQuantityRequired('');
                                    setTargetPrice('');
                                    setErrors({ ...errors, quantityRequired: '', targetPrice: '' });
                                }}>
                                Cancel
                            </div>
                        </div>
                        {/* start the ecommerce card */}
                        <div className='buyer-product-details-card-container'>
                            {/* <ProductDetailsCard /> */}
                            <SecondaryProductDetails
                                similarMedicines={similarMedicinesList}
                                onMedicineClick={handleMedicineClick}
                                totalItems={totalItems}
                                currentPage={currentPage}
                                itemsPerPage={itemsPerPage}
                                handlePageChange={handlePageChange}
                            />
                        </div>
                        {/* end the ecommerce card */}
                    </div>
                </div>
                {showModal && (
                    <div className="market-modal" onClick={closeModal}>
                        <div className="market-modal-content">
                            <span className="market-close" onClick={toggleModal}>&times;</span>
                            <div id="invoice-section" style={{ backgroundColor: 'transparent' }}>
                                {/* <iframe
                                    src={`${Invoice}#toolbar=0&navpanes=0&scrollbar=0`}
                                    style={{ border: 'none' }}
                                    width="100%"
                                    height="500px"
                                    title="Invoice"
                                /> */}

                                <iframe
                                    src={`${process.env.REACT_APP_SERVER_URL}uploads/medicine/invoice_image/${invoiceImage}#toolbar=0&navpanes=0&scrollbar=0`}
                                    style={{ border: 'none' }}
                                    width="100%"
                                    height="500px"
                                    title="Invoice"
                                />
                            </div>
                            {/* <div className='invoice-download-button-container'>
                                <button id="invoice-download-button" onClick={handleDownloadPDF}>Download Invoice</button>
                            </div> */}
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}

export default MarketProductDetails;
