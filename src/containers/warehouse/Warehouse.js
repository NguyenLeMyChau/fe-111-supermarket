import React, { useState } from 'react';
import './Warehouse.scss';
import { useSelector } from 'react-redux';
import FrameData from '../frameData/FrameData';
import { useLocation, useNavigate } from 'react-router';
import ProductWarehouse from './ProductWarehouse';

import Modal from '../../components/modal/Modal';
import Button from '../../components/button/Button';
import Select from 'react-select';
import { formatDate } from '../../utils/fotmatDate';
import useAddBill from '../../hooks/useAddBill';

export default function Warehouse() {
    const navigate = useNavigate();
    const location = useLocation();

    const warehouses = useSelector((state) => state.warehouse?.warehouse);
    const productList = useSelector((state) => state.product?.products) || [];
    const transactions = useSelector((state) => state.transaction?.transactions) || [];
    const { getUnitDescription } = useAddBill();

    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Gom các bộ lọc vào object
    const [filters, setFilters] = useState({
        item_code: '',
        productName: '',
        stockQuantity: '',
    });

    const [filteredWarehouses, setFilteredWarehouses] = useState(warehouses);
    console.log('filteredWarehouses', filteredWarehouses);
    const [filteredTransactions, setFilteredTransactions] = useState([]); // State for filtered transactions

    const warehouseColumn = [
        { title: 'Mã hàng', dataIndex: 'item_code', key: 'item_code', width: '10%', className: 'text-center' },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'product',
            key: 'product_name',
            width: '30%',
        },
        {
            title: 'Đơn vị tính', dataIndex: 'unit', key: 'unit', width: '10%', render: (text, record) => record.unit ? record.unit.description : ''
        },
        { title: 'Số lượng', dataIndex: 'stock_quantity', key: 'stock_quantity', width: '10%', className: 'text-center' },
        {
            title: 'Đơn vị cơ bản', dataIndex: 'unitBasic', key: 'unitBasic', width: '15%', render: (text, record) => record.unitBasic ? record.unitBasic.description : ''
        },
        {
            title: 'Số lượng cơ bản',
            dataIndex: 'quantityBasic',
            key: 'quantityBasic',
            width: '15%',
            className: 'text-center',
            render: (text, record) => {
                // Kiểm tra nếu record.unit_convert và record.unit tồn tại
                if (!record.unit_convert || !record.unit) {
                    return 'N/A 1';
                }

                // Tìm đơn vị chuyển đổi
                const unitConvert = record.unit_convert.find(item => item.unit === record.unit._id);

                // Kiểm tra nếu unitConvert tồn tại
                if (!unitConvert) {
                    return 'N/A 2';
                }

                // Tính toán số lượng cơ bản
                const quantityBasic = record.stock_quantity * unitConvert.quantity;
                return quantityBasic; // Định dạng theo nhu cầu
            }
        },
    ];

    const transactionColumn = [
        { title: 'Mã giao dịch', dataIndex: '_id', key: '_id', width: '25%' },
        { title: 'Kiểu', dataIndex: 'type', key: 'type', width: '15%' },
        { title: 'Đơn vị tính', dataIndex: 'unit_id', key: 'unit_id', width: '15%', render: (unit) => getUnitDescription(unit) },
        {
            title: 'Ngày giao dịch',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: '15%',
            className: 'text-center',
            render: (date) => formatDate(date)
        },
        { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', width: '15%', className: 'text-center' },
    ];

    const handleRowClick = async (warehouse) => {
        const pathPrev = location.pathname + location.search;
        sessionStorage.setItem('previousWarehousePath', pathPrev);

        // Lọc các giao dịch có item_code và unit_id giống với warehouse
        const filteredTrans = transactions.filter(transaction => {
            const productFind = productList.find(product => product._id === transaction.product_id);
            return productFind && productFind.item_code === warehouse.item_code && transaction.unit_id === warehouse.unit_id;
        });
        setFilteredTransactions(filteredTrans);

        navigate('/admin/inventory/' + warehouse._id + '/product');
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);

        const pathPrev = sessionStorage.getItem('previousWarehousePath');
        if (pathPrev) {
            navigate(pathPrev);
            sessionStorage.removeItem('previousWarehousePath');
        }
    };

    const handleFilterClick = () => {
        setIsFilterOpen(true);
    };

    const closeFilterModal = () => {
        setIsFilterOpen(false);
    };


    const applyFilters = () => {
        let filteredData = warehouses;

        if (filters.item_code) {
            filteredData = filteredData.filter(warehouse =>
                warehouse.item_code === filters.item_code);
        }

        if (filters.productName) {
            filteredData = filteredData.filter(warehouse =>
                console.log('warehose', warehouse) ||
                warehouse.product?.toLowerCase().includes(filters.productName.toLowerCase()));
        }

        if (filters.stockQuantity) {
            filteredData = filteredData.filter(warehouse =>
                warehouse.stock_quantity > Number(filters.stockQuantity)
            );
        }

        setFilteredWarehouses(filteredData);
        closeFilterModal();
    };

    // Hàm đặt lại bộ lọc
    const resetFilters = () => {
        setFilters({
            productName: '',
            stockQuantity: '',
        });
        setFilteredWarehouses(warehouses);
    };

    // Lọc các giá trị không trùng nhau cho productOptions
    const uniqueProductOptions = Array.from(new Set(productList?.map(product => product.name)))
        .map(name => ({
            value: name,
            label: name
        }));

    // Lọc các giá trị không trùng nhau cho itemCodeOptions
    const uniqueItemCodeOptions = Array.from(new Set(productList?.map(product => product.item_code)))
        .map(item_code => ({
            value: item_code,
            label: item_code
        }));

    return (
        <div>
            <FrameData
                title="Kho"
                data={filteredWarehouses}
                columns={warehouseColumn}
                itemsPerPage={10}
                onRowClick={handleRowClick}
                handleFilterClick={handleFilterClick}
            />

            <ProductWarehouse
                isModalOpen={isModalOpen}
                closeModal={closeModal}
                products={filteredTransactions}
                productColumns={transactionColumn}
            />

            <Modal
                title={'Lọc dữ liệu kho'}
                isOpen={isFilterOpen}
                onClose={closeFilterModal}
                width={500}
                height={350}
            >
                <div className="filter-modal-content">
                    <div className="filter-item">
                        <label>Mã hàng</label>
                        <Select
                            value={uniqueItemCodeOptions.find(option => option.value === filters.item_code) || null}
                            options={uniqueItemCodeOptions}
                            onChange={(selectedOption) => setFilters({ ...filters, item_code: selectedOption?.value || '' })}
                            styles={{
                                container: (provided) => ({
                                    ...provided,
                                    width: '265px',
                                    zIndex: 9999,
                                }),
                            }}
                        />
                    </div>
                    <div className="filter-item">
                        <label>Tên sản phẩm</label>
                        <Select
                            value={uniqueProductOptions.find(option => option.value === filters.productName) || null}
                            options={uniqueProductOptions}
                            onChange={(selectedOption) => setFilters({ ...filters, productName: selectedOption?.value || '' })}
                            styles={{
                                container: (provided) => ({
                                    ...provided,
                                    width: '265px',
                                    zIndex: 8888,
                                }),
                            }}
                        />

                    </div>
                    <div className="filter-item">
                        <label>Tồn kho lớn hơn:</label>
                        <input
                            type="number"
                            name="stockQuantity"
                            value={filters.stockQuantity}
                            onChange={(e) => setFilters({ ...filters, stockQuantity: e.target.value })}
                        />
                    </div>

                    <div className='button-filter'>
                        <Button
                            text='Lọc'
                            backgroundColor='#1366D9'
                            color='white'
                            width='150'
                            onClick={applyFilters}
                        />
                        <Button
                            text='Huỷ lọc'
                            backgroundColor='#FF0000'
                            color='white'
                            width='150'
                            onClick={resetFilters}
                        />
                    </div>
                </div>
            </Modal>

        </div>
    );
}