import React, { useState, useEffect } from 'react';
import styles from '../style/proformainvoice.module.css';
import CloseIcon from '@mui/icons-material/Close';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { useNavigate, useParams } from 'react-router-dom';
import { postRequestWithToken } from '../api/Requests';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { toast } from 'react-toastify';

const ProformaInvoice = () => {
    const { purchaseOrderId } = useParams();
    const navigate = useNavigate();

    const supplierIdSessionStorage = sessionStorage.getItem("supplier_id");
    const supplierIdLocalStorage = localStorage.getItem("supplier_id");

    const [currentDate, setCurrentDate] = useState('');
    const [dueDate, setDueDate] = useState('')
    const [invoiceNumber, setInvoiceNumber] = useState();
    const [inquiryDetails, setInquiryDetails] = useState();
    const [orderItems, setOrderItems] = useState([])

    const [formData, setFormData] = useState({
        operationCountries: [],
        originCountry: ''
    });
    const [countries, setCountries] = useState([]);
    const [formItems, setFormItems] = useState([{ id: Date.now(), productName: '' }]);

    useEffect(() => {
        const countryOptions = countryList().getData();
        setCountries(countryOptions);
    }, []);

    const productOptions = [
        { value: 'Product1', label: 'Product 1' },
        { value: 'Product2', label: 'Product 2' },
        { value: 'Product3', label: 'Product 3' }
    ];

    const addFormItem = () => {
        setFormItems([...formItems, { id: Date.now(), productName: '' }]);
    };

    const removeFormItem = (id) => {
        setFormItems(formItems.filter(item => item.id !== id));
    };

    const handleProductChange = (selectedOption, index) => {
        const newFormItems = [...formItems];
        newFormItems[index].productName = selectedOption.value;
        setFormItems(newFormItems);
    };

    const { register, handleSubmit, control, setValue, watch, formState: { errors } } = useForm({
        defaultValues: {
            invoiceDate: '',
            invoiceDueDate: '',
            invoiceNumber: '',
            supplierName: '',
            supplierAddress: '',
            supplierEmail: '',
            supplierMobile: '',
            // supplierRegNo: '',
            buyerName: '',
            buyerAddress: '',
            buyerEmail: '',
            buyerMobile: '',
            // buyerRegNo: '',
            orderItems: [],
            // description: ''
        }
    });

    useEffect(() => {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are zero-based
        const year = today.getFullYear();
        setCurrentDate(`${day}-${month}-${year}`);
        setValue('invoiceDate', `${day}-${month}-${year}`);

        const generateRandomNumber = () => Math.floor(10000000 + Math.random() * 90000000);
        setInvoiceNumber(generateRandomNumber());
        setValue('invoiceNumber', generateRandomNumber());

        const dueDate = new Date(today);
        dueDate.setDate(today.getDate() + 15);
        const dueDay = String(dueDate.getDate()).padStart(2, '0');
        const dueMonth = String(dueDate.getMonth() + 1).padStart(2, '0');
        const dueYear = dueDate.getFullYear();
        const formattedDueDate = `${dueDay}-${dueMonth}-${dueYear}`;
        setDueDate(formattedDueDate)
        setValue('invoiceDueDate', formattedDueDate);

        // const storedItems = sessionStorage.getItem('acceptedQuotationItems');

    }, [setValue]);

    useEffect(() => {
        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            navigate("/supplier/login");
            return;
        }
        const obj = {
            supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
            purchaseOrder_id: purchaseOrderId
            // enquiry_id: inquiryId,
        };
        postRequestWithToken('supplier/purchaseorder/get-po-details', obj, async (response) => {
            if (response.code === 200) {
                setInquiryDetails(response?.result);
                setValue('supplierName', response?.result?.supplier_details[0]?.supplier_name);
                setValue('supplierAddress', response?.result?.supplier_details[0]?.supplier_address);
                setValue('supplierEmail', response?.result?.supplier_details[0]?.contact_person_email);
                setValue('supplierMobile', response?.result?.supplier_details[0]?.contact_person_mobile_no);
                // setValue('supplierRegNo',response?.result?.supplier_details[0]?.registration_no)
                setValue('buyerName', response?.result?.buyer_details[0]?.buyer_name);
                setValue('buyerAddress', response?.result?.buyer_details[0]?.buyer_address);
                setValue('buyerEmail', response?.result?.buyer_details[0]?.contact_person_email);
                setValue('buyerMobile', response?.result?.buyer_details[0]?.contact_person_mobile);
                // setValue('buyerRegNo',response?.result?.buyer_details[0]?.registration_no)
                const totalDueAmount = response?.result?.order_items.reduce((total, item) => total + parseFloat(item.total_amount), 0);
                setValue('totalDueAmount', totalDueAmount);
                setValue('orderItems', response?.result?.order_items)


                setOrderItems(response?.result?.order_items)
            } else {
                console.log('error in order list api', response);
            }
        });
    }, [navigate, supplierIdSessionStorage, supplierIdLocalStorage, setValue]);

    const onSubmit = (data) => {

        if (!supplierIdSessionStorage && !supplierIdLocalStorage) {
            navigate("/supplier/login");
            return;
        }
        const updatedOrderItems = orderItems.map(item => ({
            ...item,
            unit_tax: item?.medicine_details?.unit_tax
        }));
        const obj = {
            supplier_id: supplierIdSessionStorage || supplierIdLocalStorage,
            enquiry_id: inquiryDetails?.enquiry_id,
            purchaseOrder_id: purchaseOrderId,
            buyer_id: inquiryDetails?.buyer_id,
            // itemIds     : itemId,
            orderItems: updatedOrderItems,
            data
        };
        postRequestWithToken('buyer/order/create-order', obj, async (response) => {
            if (response.code === 200) {
                toast(response.message, { type: 'success' })
                setTimeout(() => {
                    navigate('/supplier/order/active')
                }, 1000)
            } else {
                console.log('error in create-order api', response);
                toast(response.message, { type: 'error' })
            }
        });

    };

    return (
        <div className={styles['create-invoice-container']}>
            <div className={styles['create-invoice-heading']}>Create Proforma Invoice</div>
            <form className={styles['craete-invoice-form']} onSubmit={handleSubmit(onSubmit)}>
                <div className={styles['create-invoice-section']}>
                    <div className={styles['create-invoice-form-heading']}>Supplier</div>
                    <div className={styles['create-invoice-inner-form-container']}>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Name</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='supplierName' placeholder='Enter Name'
                                {...register('supplierName', { validate: value => value?.trim() !== '' || 'Supplier name is required' })} />
                        </div>
                        {errors.supplierName && <p>{errors.supplierName.message}</p>}
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Invoice Number</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                placeholder='Enter Invoice Number'
                                name='invoiceNumber'
                                value={invoiceNumber}
                                readOnly
                                {...register('invoiceNumber')} />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Invoice Generate Date</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='invoiceDate'
                                placeholder='Enter Invoice Generate Date'
                                value={currentDate}
                                readOnly
                                {...register('invoiceDate')} />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Payment Due Date</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='invoiceDueDate' placeholder='Enter Payment Due Date'
                                value={dueDate}
                                readOnly
                                {...register('invoiceDueDate')}
                            />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Deposit Requested</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='totalDueAmount'
                                placeholder='Enter Deposit Requested'
                                {...register('totalDueAmount',
                                    //  { validate: value => value?.trim() !== '' || 'Due amount is required' }
                                )} />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Deposit Due</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='totalDueAmount'
                                placeholder='Enter Deposit Due'
                                {...register('totalDueAmount',
                                    //  { validate: value => value?.trim() !== '' || 'Due amount is required' }
                                )} />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Total Due Amount</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='totalDueAmount'
                                placeholder='Enter Total Due Amount'
                                {...register('totalDueAmount',
                                    //  { validate: value => value?.trim() !== '' || 'Due amount is required' }
                                )} />
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Email ID</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='supplierEmail'
                                placeholder='Enter Email ID'
                                {...register('supplierEmail', { validate: value => value?.trim() !== '' || 'Supplier email is required' })} />
                            {errors.supplierEmail && <p>{errors.supplierEmail.message}</p>}
                        </div>

                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Mobile No.</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='supplierMobile'
                                placeholder='Enter Mobile No.'
                                {...register('supplierMobile', { validate: value => value?.trim() !== '' || 'Supplier mobile no. is required' })} 
                                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                                />
                            {errors.supplierMobile && <p>{errors.supplierMobile.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Address</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='supplierAddress'
                                placeholder='Enter Address'
                                {...register('supplierAddress', { validate: value => value?.trim() !== '' || 'Supplier address is required' })} />
                            {errors.supplierAddress && <p>{errors.supplierAddress.message}</p>}
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
                                {...register('buyerName', { validate: value => value?.trim() !== '' || 'Buyer name is required' })} />
                            {errors.buyerName && <p>{errors.buyerName.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Email ID</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='buyerEmail'
                                placeholder='Enter Email ID'
                                {...register('buyerEmail', { validate: value => value?.trim() !== '' || 'Buyer email is required' })} />
                            {errors.buyerEmail && <p>{errors.buyerEmail.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Mobile No.</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='buyerMobile'
                                placeholder='Enter Mobile No.'
                                {...register('buyerMobile', { validate: value => value?.trim() !== '' || 'Buyer mobile no. is required' })} 
                                onInput={(e) => e.target.value = e.target.value.replace(/[^0-9]/g, '')}
                                />
                            {errors.buyerMobile && <p>{errors.buyerMobile.message}</p>}
                        </div>
                        <div className={styles['create-invoice-div-container']}>
                            <label className={styles['create-invoice-div-label']}>Address</label>
                            <input className={styles['create-invoice-div-input']} type='text'
                                name='buyerAddress'
                                placeholder='Enter Address'
                                {...register('buyerAddress', { validate: value => value?.trim() !== '' || 'Buyer address is required' })} />
                            {errors.buyerAddress && <p>{errors.buyerAddress.message}</p>}
                        </div>
                    </div>
                </div>
                <div className={styles['create-invoice-section']}>
                    {/* <div className={styles['create-invoice-add-item-cont']}>
                        <div className={styles['create-invoice-form-heading']}>Add Item</div>
                    </div> */}
                    {orderItems.map((item, index) => (
                        <div className={styles['form-item-container']} key={item.id}>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Product Name</label>
                                <input className={styles['create-invoice-div-input']} type='text' name={`Qty-${item.id}`}
                                    placeholder='Enter Product Name'
                                    value={item?.medicine_details?.medicine_name}
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
                                <label className={styles['create-invoice-div-label']}>Listed Price</label>
                                <input className={styles['create-invoice-div-input']} type='text'
                                    name={`UnitPrice-${item.id}`}
                                    placeholder='Enter Unit Price'
                                    value={item?.unit_price}
                                    readOnly
                                />
                            </div>
                            <div className={styles['create-invoice-div-container']}>
                                <label className={styles['create-invoice-div-label']}>Tax Percentage</label>
                                <input className={styles['create-invoice-div-input']} type='text'
                                    name={`UnitPrice-${item.id}`}
                                    placeholder='Enter Tax Percentage'
                                    value={item?.medicine_details?.unit_tax}
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
                            {/* {formItems.length > 1 && (
                                <div className={styles['create-invoice-close-btn']} onClick={() => removeFormItem(item.id)}>
                                    <CloseIcon />
                                </div>
                            )} */}
                        </div>
                    ))}
                </div>
                <div className={styles['create-invoice-section']}>
                    <div className={styles['craete-invoice-form']}>
                        <div className={styles['create-invoice-div-textarea']}>
                            <label className={styles['create-invoice-div-label']}>Payment Terms</label>
                            <textarea
                                className={styles['create-invoice-div-input']}
                                name="description"
                                rows="4"
                                cols="10"
                                placeholder='Enter Payment Terms'
                                {...register('description')}
                            />
                        </div>
                    </div>
                </div>
                <div className={styles['craete-invoices-button']}>
                    <button type='submit' className={styles['create-invoices-submit']}>Create Proforma Invoice</button>
                    <div className={styles['create-invoices-cancel']}>Cancel</div>
                </div>
            </form>
        </div >
    );
}

export default ProformaInvoice;





