import React from 'react';
import { Link } from 'react-router-dom';
import DataTable from 'react-data-table-component';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import PaginationComponent from '../../shared-components/Pagination/Pagination';
import styles from '../../../assets/style/table.module.css';
import '../../../assets/style/table.css'

const ApprovedSecondaryProducts = ({
  productList,
  totalProducts,
  currentPage,
  listPerPage,
  handlePageChange,
  activeLink,
}) => {
  const columns = [
    {
      name: 'Supplier ID',
      selector: (row) => row?.userDetails?.supplier_id || 'N/A',
      sortable: true,
     
    },
    {
      name: 'Product ID',
      selector: (row) => row.product_id || 'N/A',
      sortable: true,
    
    },
    {
      name: 'Product Name',
      selector: (row) => row?.general?.name || 'N/A',
      sortable: true,
      
    },
    {
      name: 'Category',
      selector: row => {
        const category = row.category || 'N/A';
        return category
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .replace(/\b\w/g, char => char.toUpperCase());
      },
      sortable: true,
    },
    {
      name: 'Total Quantity',
      selector: row => row.general?.quantity || 'N/A',
      sortable: true,
    },
  
    {
      name: 'Action',
      cell: (row) => (
        <Link to={`/admin/product-details/${row?._id}`}>
           <div className={styles.activeBtn}>
                        <RemoveRedEyeOutlinedIcon className={styles['table-icon']} />
                    </div>
        </Link>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
      sortable: false,
    },
  ];

  return (
      <div className={styles.container}>
          <DataTable
            columns={columns}
            data={productList || []}
            persistTableHead
            noDataComponent={<div className={styles['no-data']}>No Data Available</div>}
            pagination={false}
            responsive
          />
          {productList && productList.length > 0 && (
            <PaginationComponent
              activePage={currentPage}
              itemsCountPerPage={listPerPage}
              totalItemsCount={totalProducts}
              pageRangeDisplayed={10}
              onChange={handlePageChange}
            />
          )}
        </div>
    
  );
};

export default ApprovedSecondaryProducts;