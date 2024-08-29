import React, { useState, useEffect } from 'react';
import styles from '../../style/createInvoice.module.css';
import CloseIcon from '@mui/icons-material/Close';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { PhoneInput } from 'react-international-phone';
import { useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../../api/Requests';

const CreateInvoice = () => {
    const {orderId} = useParams()
    const navigate = useNavigate();

    const [currentDate, setCurrentDate] = useState('');
    const [invoiceNumber, setInvoiceNumber] = useState();
    const [orderDetails, setOrderDetails] = useState(null);
    const [formData, setFormData] = useState({
        orderId: '',
        invoiceNo: '',
        invoiceDate: '',
        supplierId: '',
        supplierName: '',
        supplierEmail: '',
        supplierCountry: '',
        supplierAddress: '',
        supplierMobile: '',
        supplierCountryCode: '',
        supplierContactPersonMobile: '',
        supplierContactPersonCountryCode: '',
        supplierVatRegNo: '',
        buyerId: '',
        buyerName: '',
        buyerEmail: '',
        buyerCountry: '',
        buyerAddress: '',
        buyerMobile: '',
        buyerCountryCode: '',
        buyerContactPersonMobile: '',
        buyerContactPersonCountryCode: '',
        buyerVatRegNo: '',
        orderItems: [],
        vatPercentage: '',
        totalPayableAmount: '',
        accountNo: '',
        sortCode: ''
    })

const [errors, setErrors]                                   = useState({})
const [countries, setCountries]                             = useState([]);
const [supplierCountryOfOrigin, setSupplierCountryOfOrigin] = useState('')
const [buyerCountryOfOrigin, setBuyerCountryOfOrigin]       = useState('')

useEffect(() => {
    const countryOptions = countryList().getData();
    setCountries(countryOptions);
}, []);

useEffect(() => {
    const today = new Date();
    const day = String(today.getDate()).padStart(2, '0');
    const month = String(today.getMonth() + 1).padStart(2, '0'); 
    const year = today.getFullYear();
    setCurrentDate(`${day}-${month}-${year}`);

    const generateRandomNumber = () => Math.floor(10000000 + Math.random() * 90000000);
    setInvoiceNumber(generateRandomNumber());
}, [orderId]);

const handleSupplierCountryOriginChange = (selected) => {
    setSupplierCountryOfOrigin(selected)
    setFormData(prevState => ({ ...prevState, supplierCountry: selected }));
    if (!selected) {
        setErrors(prevState => ({ ...prevState, supplierCountry: 'Supplie Country of Origin is Required' }));
    } else {
        setErrors(prevState => ({ ...prevState, supplierCountry: '' }));
    }
};

const handleBuyerCountryOriginChange = (selected) => {
    setBuyerCountryOfOrigin(selected)
    setFormData(prevState => ({ ...prevState, buyerCountry: selected }));
    if (!selected) {
        setErrors(prevState => ({ ...prevState, buyerCountry: 'Buyer Country of Origin is Required' }));
    } else {
        setErrors(prevState => ({ ...prevState, buyerCountry: '' }));
    }
};

    useEffect(() => {
        const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
        const supplierIdLocalStorage = localStorage.getItem("supplier_id");

        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            navigate("/supplier/login");
            return;
        }

        const obj = {
            order_id: orderId,
            supplier_id: supplierIdSessionStorage || supplierIdLocalStorage
        };

        postRequestWithToken('supplier/order/supplier-order-details', obj, (response) => {
            if (response.code === 200) {
                setOrderDetails(response.result);
                const data = response.result
                setFormData(prevFormData => ({
                    ...prevFormData,
                    orderId: data.order_id,
                    supplierId: data.supplier_id,
                    supplierName: data?.supplier?.supplier_name,
                    supplierEmail: data?.supplier?.supplier_email,
                    // supplierCountry: data.supplier_country,
                    supplierCountry: { label: data?.supplier?.country_of_origin, value: data?.supplier?.country_of_origin } || null,
                    supplierAddress: data?.supplier?.supplier_address,
                    supplierMobile: data?.supplier?.supplier_mobile,
                    supplierCountryCode: data?.supplier?.supplier_country_code,
                    supplierContactPersonMobile: data?.supplier?.contact_person_mobile_no,
                    supplierContactPersonCountryCode: data?.supplier?.contact_person_country_code,
                    supplierVatRegNo: data?.supplier?.vat_reg_no,
                    buyerId: data.buyer_id,
                    buyerName: data?.buyer?.buyer_name,
                    buyerEmail: data?.buyer?.buyer_email,
                    buyerCountry: data?.buyer?.buyer_country,
                    buyerAddress: data?.buyer?.buyer_address,
                    buyerMobile: data?.buyer?.buyer_mobile,
                    buyerCountryCode: data?.buyer?.buyer_country_code,
                    buyerContactPersonMobile: data?.buyer?.contact_person_mobile,
                    buyerContactPersonCountryCode: data?.buyer?.contact_person_country_code,
                    buyerVatRegNo: data?.buyer?.buyer_vat_reg_no,
                    orderItems: data.items,
                    vatPercentage: data.vat_percentage,
                    totalPayableAmount: data.total_payable_amount,
                    accountNo: data.account_no,
                    sortCode: data.sort_code
                }));
            } else {
                console.log('error in order details api');
            }
        });
    }, [orderId, navigate]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        let newErrors = {};
        let isValid = true;

        if (name === 'description') {
            if (value.length > 1000) {
                newErrors.description = 'Description cannot exceed 1000 characters';
                isValid = false;
            } else {
                newErrors.description = '';
            }
        }
        if (name === 'productName' || name === 'dossierStatus') {
            if (!/^[a-zA-Z\s]*$/.test(value)) {
                isValid = false;
            } else {
                newErrors[name] = '';
            }
        }
        if (name === 'totalQuantity' || name === 'minPurchaseUnit' ) {
            if (!/^\d*$/.test(value)) {
                isValid = false;
            } else {
                newErrors[name] = '';
            }
        }
        if (name === 'unitTax') {
            if (!/^\d*\.?\d*$/.test(value)) {
                isValid = false;
            } else {
                newErrors.unitTax = '';
            }
        }
        if (isValid) {
            setFormData(prevState => ({ ...prevState, [name]: value }));
        }
        setErrors(prevState => ({ ...prevState, ...newErrors }));
    };

    return (
        // <div className={styles['create-invoice-container']}>
        //     <div className={styles['create-invoice-heading']}>Create Invoice</div>
        //     <div className={styles['create-invoice-section']}>
        //         <div className={styles['create-invoice-form-heading']}>Supplier</div>
        //         <form className={styles['craete-invoice-form']}>
        //             <div className={styles['create-invoice-div-container']}>
        //                 <label className={styles['create-invoice-div-label']}>Name</label>
        //                 <input className={styles['create-invoice-div-input']} 
        //                 type='text' 
        //                 name='supplierName' 
        //                 placeholder='Enter Supplier Name'
        //                 value={formData.supplierName}
        //                 readOnly
        //                  />
        //             </div>
        //             <div className={styles['create-invoice-div-container']}>
        //                 <label className={styles['create-invoice-div-label']}>Invoice Number</label>
        //                 <input className={styles['create-invoice-div-input']} 
        //                 type='text' 
        //                 name='InvoiceNumber' 
        //                 placeholder='Enter Invoice Number' 

        //                 />
        //             </div>
        //             <div className={styles['create-invoice-div-container']}>
        //                 <label className={styles['create-invoice-div-label']}>Invoice Date</label>
        //                 <input className={styles['create-invoice-div-input']} 
        //                     type='text'
        //                     name='InvoiceDate' 
        //                     placeholder='Enter Invoice Date' 
        //                  />
        //             </div>
        //             <div className={styles['create-invoice-div-container']}>
        //                 <label className={styles['create-invoice-div-label']}>Address</label>
        //                 <input className={styles['create-invoice-div-input']} 
        //                     type='text' 
        //                     name='supplierAddress'
        //                     placeholder='Enter Address'
        //                     value={formData.supplierAddress}
        //                     readOnly
        //                   />
        //             </div>
        //             <div className={styles['create-invoice-div-container']}>
        //                 <label className={styles['create-invoice-div-label']}>Country</label>
                       
        //                 <Select
        //                     className={styles['create-invoice-div-input-select']}
        //                     name='supplierCountry'
        //                     options={countries}
        //                     placeholder="Select Country of Origin"
        //                     autoComplete='off'
        //                     // value={countryOfOrigin}
        //                     value={formData.supplierCountry}
        //                     onChange={handleSupplierCountryOriginChange}
        //                     readOnly
        //                 />
        //             </div>
        //             <div className={styles['create-invoice-div-container']}>
        //                 <label className={styles['create-invoice-div-label']}>VAT Reg No.</label>
        //                 <input className={styles['create-invoice-div-input']} 
        //                 type='text' 
        //                 name='supplierSatRegNo' 
        //                 placeholder='Enter Vat Reg No.'
        //                 value={formData.supplierVatRegNo}
        //                     readOnly
        //                  />
        //             </div>
        //         </form>
        //     </div>
        //     <div className={styles['create-invoice-section']}>
        //         <div className={styles['create-invoice-form-heading']}>Buyer</div>
        //         <form className={styles['craete-invoice-form']}>
        //             <div className={styles['create-invoice-div-container']}>
        //                 <label className={styles['create-invoice-div-label']}>Name</label>
        //                 <input className={styles['create-invoice-div-input']} 
        //                 type='text' 
        //                 name='Name' 
        //                 placeholder='Enter Name' 
        //                 />
        //             </div>
        //             <div className={styles['create-invoice-div-container']}>
        //                 <label className={styles['create-invoice-div-label']}>Address</label>
        //                 <input className={styles['create-invoice-div-input']} type='text' name='Address' placeholder='Enter Address' />
        //             </div>
        //             <div className={styles['create-invoice-div-container']}>
        //                 <label className={styles['create-invoice-div-label']}>Country</label>
        //                 <Select
        //                     className='signup-forms-sections-select'
        //                     // options={countries}
        //                     // value={countries.find(option => option.value === formData.originCountry)}
        //                     // onChange={(selectedOption) => setFormData({ ...formData, originCountry: selectedOption.value })}
        //                 />
        //             </div>
        //             <div className={styles['create-invoice-div-container']}>
        //                 <label className={styles['create-invoice-div-label']}>VAT Reg No.</label>
        //                 <input className={styles['create-invoice-div-input']} type='text' name='VatRegNo' placeholder='Enter Vat Reg No' />
        //             </div>
        //         </form>
        //     </div>
        //     <div className={styles['create-invoice-section']}>
                
        //         {formData.orderItems?.map((item, index) => (
        //             <div className={styles['form-item-container']} key={item.id}>
        //                 <form className={styles['craete-invoice-form']}>
        //                     <div className={styles['create-invoice-div-container']}>
        //                         <label className={styles['create-invoice-div-label']}>Product Name</label>
                                
        //                          <input className={styles['create-invoice-div-input']} type='text' name={`Qty-${item.id}`} placeholder='Enter Product Name' />
        //                     </div>
        //                     <div className={styles['create-invoice-div-container']}>
        //                         <label className={styles['create-invoice-div-label']}>Quantity</label>
        //                         <input className={styles['create-invoice-div-input']} type='text' name={`Qty-${item.id}`} placeholder='Enter Quantity' />
        //                     </div>
        //                     <div className={styles['create-invoice-div-container']}>
        //                         <label className={styles['create-invoice-div-label']}>Price</label>
        //                         <input className={styles['create-invoice-div-input']} type='text' name={`UnitPrice-${item.id}`} placeholder='Enter Price' />
        //                     </div>
        //                     <div className={styles['create-invoice-div-container']}>
        //                         <label className={styles['create-invoice-div-label']}>Unit Tax%</label>
        //                         <input className={styles['create-invoice-div-input']} type='text' name={`UnitPrice-${item.id}`} placeholder='Enter Unit Tax%' />
        //                     </div>
        //                     <div className={styles['create-invoice-div-container']}>
        //                         <label className={styles['create-invoice-div-label']}>Total Amount</label>
        //                         <input className={styles['create-invoice-div-input']} type='text' name={`TotalAmount-${item.id}`} placeholder='Enter Total Amount' />
        //                     </div>
        //                 </form>
                       
        //             </div>
        //         ))}
        //     </div>
        //     <div className={styles['create-invoice-section']}>
        //         <div className={styles['create-invoice-form-heading']}></div>
        //         <form className={styles['craete-invoice-form']}>
        //             <div className={styles['create-invoice-div-container']}>
        //                 <label className={styles['create-invoice-div-label']}>VAT @ 20%</label>
        //                 <input className={styles['create-invoice-div-input']} type='text' name='VAT' placeholder='Enter Vat @ 20%' />
        //             </div>
        //             <div className={styles['create-invoice-div-container']}>
        //                 <label className={styles['create-invoice-div-label']}>Total Payable Amount</label>
        //                 <input className={styles['create-invoice-div-input']} type='text' name='TotalPayableAmount' placeholder='Enter Total Payable Amount' />
        //             </div>
        //             <div className={styles['create-invoice-div-container']}>
        //                 <label className={styles['create-invoice-div-label']}>Account Number</label>
        //                 <input className={styles['create-invoice-div-input']} type='text' name='AccountNumber' placeholder='Enter Account Number' />
        //             </div>
        //             <div className={styles['create-invoice-div-container']}>
        //                 <label className={styles['create-invoice-div-label']}>Sort Code</label>
        //                 <input className={styles['create-invoice-div-input']} type='text' name='SortCode' placeholder='Enter Sort Code' />
        //             </div>
        //         </form>
        //     </div>
        //     <div className={styles['craete-invoices-button']}>
        //         <div className={styles['create-invoices-submit']}>Create Invoice</div>
        //         <div className={styles['create-invoices-cancel']}>Cancel</div>
        //     </div>
        // </div>


        <div className={styles['create-invoice-container']}>
        <div className={styles['create-invoice-heading']}>Create Invoice</div>
        <form className={styles['craete-invoice-form']} 
        // onSubmit={handleSubmit(onSubmit)}
         >
            <div className={styles['create-invoice-section']}>
                <div className={styles['create-invoice-form-heading']}>Supplier</div>
                <div className={styles['create-invoice-inner-form-container']}>
                    <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>Name</label>
                        <input className={styles['create-invoice-div-input']} type='text'
                            name='supplierName' placeholder='Enter Supplier Name'
                            value={formData.supplierName}
                            onChange={handleChange}
                            />
                    </div>
                    {errors.supplierName && <p>{errors.supplierName.message}</p>}
                    <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>Invoice Number</label>
                        <input className={styles['create-invoice-div-input']} type='text'
                            placeholder='Enter Invoice Number'
                            name='invoiceNumber'
                            value={invoiceNumber}
                            readOnly
                            />
                    </div>
                    <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>Invoice Generate Date</label>
                        <input className={styles['create-invoice-div-input']} type='text'
                            name='invoiceDate'
                            placeholder='Enter Invoice Generate Date'
                            value={currentDate}
                            readOnly
                            />
                    </div>
                    
                    <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>Email ID</label>
                        <input className={styles['create-invoice-div-input']} type='text'
                            name='supplierEmail'
                            placeholder='Enter Email ID'
                            value={formData.supplierEmail}
                            onChange={handleChange}
                            />
                        {errors.supplierEmail && <p style={{color: 'red'}}>{errors.supplierEmail.message}</p>}
                    </div>

                    <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>Mobile No.</label>
                        <PhoneInput
                        className='signup-form-section-phone-input'
                        defaultCountry="ae"
                        name='phoneinput'
                        value={`${formData.supplierCountryCode || ''}${formData.supplierMobile || ''}`}
                    />
                        {errors.supplierMobile && <p style={{color: 'red'}}>{errors.supplierMobile.message}</p>}
                    </div>
                    <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>Address</label>
                        <input className={styles['create-invoice-div-input']} type='text'
                            name='supplierAddress'
                            placeholder='Enter Address'
                            value={formData.supplierAddress}
                            onChange={handleChange}
                            />
                        {errors.supplierAddress && <p style={{color: 'red'}}>{errors.supplierAddress.message}</p>}
                    </div>

                    <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>Country</label>
                              <Select
                                className={styles['create-invoice-div-input-select']}
                                        name='supplierCountry'
                                        options={countries}
                                    autoComplete='off'
                                    value={formData.supplierCountry}
                                        onChange={handleSupplierCountryOriginChange}
                                />
                        {errors.supplierCountry && <p style={{color: 'red'}}>{errors.supplierCountry.message}</p>}
                    </div>

                    <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>VAT Reg No.</label>
                        <input className={styles['create-invoice-div-input']} type='text'
                            name='supplierVatRegNo'
                            placeholder='Enter VAT Reg No'
                            value={formData.supplierVatRegNo}
                            onChange={handleChange}
                            />
                        {errors.supplierVatRegNo && <p style={{color: 'red'}}>{errors.supplierVatRegNo.message}</p>}
                    </div>

                    
                </div>
            </div>
            <div className={styles['create-invoice-section']}>
                <div className={styles['create-invoice-form-heading']}>Buyer</div>
                <div className={styles['create-invoice-inner-form-container']}>
                    <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>Name</label>
                        <input className={styles['create-invoice-div-input']} type='text'
                            name='buyerName' placeholder='Enter Name'
                            readOnly
                            value={formData.buyerName}
                            />
                        {errors.buyerName && <p style={{color: 'red'}}>{errors.buyerName.message}</p>}
                    </div>
                    <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>Email ID</label>
                        <input className={styles['create-invoice-div-input']} type='text'
                            name='buyerEmail'
                            placeholder='Enter Email ID'
                            readOnly
                            value={formData.buyerEmail}
                            />
                        {errors.buyerEmail && <p style={{color: 'red'}}>{errors.buyerEmail.message}</p>}
                    </div>
                    <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>Mobile No.</label>
                        <PhoneInput
                        className='signup-form-section-phone-input'
                        defaultCountry="ae"
                        name='phoneinput'
                        value={`${formData.buyerCountryCode || ''}${formData.buyerMobile || ''}`}
                        disabled
                    />
                        {errors.buyerMobile && <p style={{color: 'red'}}>{errors.buyerMobile.message}</p>}
                    </div>
                    <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>Address</label>
                        <input className={styles['create-invoice-div-input']} type='text'
                            name='buyerAddress'
                            placeholder='Enter Address'
                            readOnly
                            value={formData.buyerAddress}
                            />
                        {errors.buyerAddress && <p style={{color: 'red'}}>{errors.buyerAddress.message}</p>}
                    </div>
                    <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>Country</label>
                              <Select
                                className={styles['create-invoice-div-input-select']}
                                        name='buyerCountryy'
                                        options={countries}
                                    autoComplete='off'
                                    value={formData.buyerCountry}
                                        onChange={handleBuyerCountryOriginChange}
                                    readOnly
                                />
                        {errors.buyerCountry && <p style={{color: 'red'}}>{errors.buyerCountry.message}</p>}
                    </div>

                    <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>VAT Reg No.</label>
                        <input className={styles['create-invoice-div-input']} type='text'
                            name='buyerVatRegNo'
                            placeholder='Enter VAT Reg No'
                            value={formData.buyerVatRegNo}
                            readOnly
                            />
                        {errors.buyerVatRegNo && <p style={{color: 'red'}}>{errors.buyerVatRegNo.message}</p>}
                    </div>
                </div>
            </div>
            <div className={styles['create-invoice-section']}>
                {formData?.orderItems?.map((item, index) => {
                    return (
                        <div className={styles['form-item-container']} key={item.id}>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Product Name</label>
                            <input className={styles['create-invoice-div-input']} type='text' name={`Qty-${item.id}`}
                                placeholder='Enter Product Name'
                                value={item?.medicine_name}
                                readOnly
                            />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Quantity</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name={`Qty-${item.id}`}
                                placeholder='Enter Quantity'
                                value={item?.quantity_required}
                                readOnly
                            />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Price</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name={`UnitPrice-${item.id}`}
                                placeholder='Enter Price'
                                value={item?.counter_price || item?.target_price}
                                readOnly
                            />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Tax%</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name={`UnitPrice-${item.id}`}
                                placeholder='Enter Tax%'
                                value={item?.unit_tax}
                                readOnly
                            />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Total Amount</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name={`TotalAmount-${item.id}`} placeholder='Enter Total Amount'
                                value={item?.total_amount}
                                readOnly
                            />
                        </div>
                    </div>
                    )
                }
                    
                )}
            </div>
            
                 <div className={styles['create-invoice-section']}>
               <div className={styles['create-invoice-form-heading']}></div>
                <form className={styles['craete-invoice-form']}>
                     <div className={styles['create-invoice-div-container']}>
                       <label className={styles['create-invoice-div-label']}>VAT @ 20%</label>
                        <input className={styles['create-invoice-div-input']} 
                        type='text' name='VAT' 
                        placeholder='Enter Vat @ 20%' 
                        value={formData.vatPercentage}
                        onChange={handleChange}
                        />
                    </div>
                     <div className={styles['create-invoice-div-container']}>
                        <label className={styles['create-invoice-div-label']}>Total Payable Amount</label>
                        <input className={styles['create-invoice-div-input']} 
                        type='text' 
                        name='TotalPayableAmount' 
                        placeholder='Enter Total Payable Amount' 
                        />
                    </div>
                    <div className={styles['create-invoice-div-container']}>
                     <label className={styles['create-invoice-div-label']}>Account Number</label>
                         <input className={styles['create-invoice-div-input']} 
                         type='text' 
                         name='AccountNumber' 
                         placeholder='Enter Account Number' 
                         value={formData.accountNo}
                         onChange={handleChange}
                         />
                     </div>
                    <div className={styles['create-invoice-div-container']}>
                         <label className={styles['create-invoice-div-label']}>Sort Code</label>
                        <input className={styles['create-invoice-div-input']} 
                        type='text' name='SortCode' 
                        placeholder='Enter Sort Code' 
                        value={formData.sortCode}
                        onChange={handleChange}
                        />
                </div>
                 </form>
               </div>
            <div className={styles['craete-invoices-button']}>
                <button type='submit' className={styles['create-invoices-submit']}>Create Invoice</button>
                <div className={styles['create-invoices-cancel']}>Cancel</div>
            </div>
        </form>
        </div >
    );
}

export default CreateInvoice;
