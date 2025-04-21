import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { MdProductionQuantityLimits } from "react-icons/md";
import styles from '../../../../assets/style/secondsidebar.module.css';
import NewProduct from './NewProductList';
import SecondaryMarket from './SecondaryProductList';
import { useDispatch, useSelector } from "react-redux";
import { fetchProductsList } from "../../../../../redux/reducers/productSlice";
import Loader from '../../../shared-components/Loader/Loader';
import FileUploadModal from '../FileUpload/FileUpload';
import { bulkUpload, previewBulkProducts } from "../../../../../redux/reducers/productSlice";

const Product = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { products } = useSelector((state) => state.productReducer);
    const [loading, setLoading] = useState(true);
    const [totalItems, setTotalItems] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 10
    const [open, setOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const path = location.pathname.split('/').filter(Boolean);;
    const lastPart = path[path.length - 1];
    const showButtonGroup = lastPart === 'newproduct' || lastPart === 'product';
    const [medicineType, setMedicineType] = useState(() => {
        switch (location.pathname) {
            case '/admin/product/new-product':
                return 'new-product';
            case '/admin/product/secondary-product':
                return 'secondary-product';
            default:
                return 'new-product';
        }
    });
    const getActiveButtonFromPath = (path) => {
        switch (path) {
            case '/admin/product/new-product':
                return 'new-product';
            case '/admin/product/secondary-product':
                return 'secondary-product';
            default:
                return 'new-product';
        }
    };
    const activeButton = getActiveButtonFromPath(location.pathname);
    const handleButtonClick = (button) => {
        setCurrentPage(1)
        switch (button) {
            case 'new-product':
                setMedicineType('new-product')
                navigate('/admin/product/new-product');
                break;
            case 'secondary-product':
                setMedicineType('secondary-product')
                navigate('/admin/product/secondary-product');
                break;
            default:
                navigate('/admin/product/new-product');
        }
    };
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };
    const handleSelectFile = (file) => {
        setSelectedFile(file);
    };
    const handleUpdateProductUpload = () => {
        if (selectedFile) {
            const bulkFormData = new FormData();
            bulkFormData.append("admin_id", localStorage.getItem("_id"));
            bulkFormData.append("csvfile", selectedFile);
            dispatch(bulkUpload(bulkFormData));
        }
    };
    const handleBulkUpload = () => {
        if (selectedFile) {
            const bulkFormData = new FormData();
            bulkFormData.append("admin_id", localStorage.getItem("_id"));
            bulkFormData.append("csvfile", selectedFile);

            dispatch(previewBulkProducts(bulkFormData)).then((response) => {
                if (response?.meta.requestStatus === "fulfilled") {
                    navigate("/admin/preview-file");
                }
            });
        }
    };
    useEffect(() => {
        const adminIdSessionStorage = localStorage.getItem("admin_id");
        const adminIdLocalStorage = localStorage.getItem("admin_id");
        const admin_id = localStorage.getItem("_id") || localStorage.getItem("_id");

        if (!adminIdSessionStorage && !adminIdLocalStorage) {
            localStorage.clear();
            navigate("/admin/login");
            return;
        }
        const fetchData = async () => {

            const marketType = activeButton === 'new-product' ? 'new' : 'secondary';
            const response = await dispatch(
                fetchProductsList(`product?market=${marketType}&admin_id=${admin_id}&page_no=${currentPage}&page_size=${itemsPerPage}`)
            );
            if (response.meta.requestStatus === 'fulfilled') {
                setTotalItems(response.payload?.totalItems);
                setLoading(false);
            }
        };

        fetchData();
    }, [dispatch, currentPage, medicineType]);
    return (
        <>
            {loading ? (
                <Loader />
            ) : (
                <div className={styles.container}>
                    <div className={styles.header}>
                        <div className={styles.title}>
                            Products
                        </div>
                        <button onClick={() => setOpen(true)} className={styles.button}>
                            Bulk Upload
                        </button>
                    </div>
                    <div className={styles.content}>
                        <div className={styles.sidebar}>
                            <div
                                className={`${styles.tab} ${activeButton === 'new-product' ? styles.active : ''}`}
                                onClick={() => handleButtonClick('new-product')}
                            >
                                <MdProductionQuantityLimits
                                    className={styles.icon}
                                />
                                <div className={styles.text}>New Product</div>


                            </div>
                            <div
                                className={`${styles.tab} ${activeButton === 'secondary-product' ? styles.active : ''}`}
                                onClick={() => handleButtonClick('secondary-product')}
                            >
                                <MdProductionQuantityLimits
                                    className={styles.icon}
                                />
                                <div className={styles.text}>Secondary Market</div>

                            </div>
                        </div>
                        <div className={styles.main}>

                            {activeButton === 'new-product' &&
                                <NewProduct
                                    products={products?.products}
                                    totalItems={totalItems}
                                    currentPage={currentPage}
                                    itemsPerPage={itemsPerPage}
                                    handlePageChange={handlePageChange}
                                />}
                            {activeButton === 'secondary-product' &&
                                <SecondaryMarket
                                    products={products?.products}
                                    totalItems={totalItems}
                                    currentPage={currentPage}
                                    itemsPerPage={itemsPerPage}
                                    handlePageChange={handlePageChange}
                                />}

                            {open && (
                                <FileUploadModal
                                    onClose={() => setOpen(false)}
                                    onSelectFile={handleSelectFile}
                                    onHandleUpload={handleBulkUpload}
                                    modaltitle="Bulk Upload"
                                    title="Preview"
                                    selectedFile={selectedFile}
                                />
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default Product;

