import React, { useState } from 'react';
import './Warehouse.scss';
import { useSelector } from 'react-redux';
import FrameData from '../frameData/FrameData';
import { useLocation, useNavigate } from 'react-router';
import ProductWarehouse from './ProductWarehouse';

import Modal from '../../components/modal/Modal';
import Button from '../../components/button/Button';
import { getStatusColor } from '../../utils/fotmatDate';
import Select from 'react-select';

export default function Warehouse() {
    const navigate = useNavigate();
    const location = useLocation();

    const warehouses = useSelector((state) => state.warehouse?.warehouse);
    const productList = useSelector((state) => state.product?.products) || [];

    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Gom các bộ lọc vào object
    const [filters, setFilters] = useState({
        item_code: '',
        productName: '',
        stockQuantity: '',
        minStockThreshold: '',
        status: [],
    });

    const [filteredWarehouses, setFilteredWarehouses] = useState(warehouses);

    const warehouseColumn = [
        { title: 'Mã hàng', dataIndex: 'item_code', key: 'item_code', width: '10%', className: 'text-center' },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'product',
            key: 'product_name',
            width: '30%',
            render: (text, record) => {
                return (
                    <span>
                        {record.product ? record.product.name : ''}
                    </span>
                );
            }
        },
        { title: 'Tồn kho', dataIndex: 'stock_quantity', key: 'stock_quantity', width: '10%', className: 'text-center' },
        { title: 'Ngưỡng giá trị', dataIndex: 'min_stock_threshold', key: 'min_stock_threshold', width: '15%', className: 'text-center' },
        { title: 'Nhà cung cấp', dataIndex: 'product', key: 'supplier_name', width: '15%', render: (text, record) => record.product ? record.product.supplier_name : '' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: '20%',
            className: 'text-center',
            render: (text, record) => {
                return (
                    <span style={{ color: getStatusColor(record.status), fontWeight: 500, fontSize: 16 }}>
                        {record.status}
                    </span>
                );
            }
        },
    ];

    const productColumns = [
        { title: 'Mã hàng', dataIndex: 'item_code', key: 'item_code', width: '10%', className: 'text-center' },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'product',
            key: 'product_name',
            width: '30%',
            render: (text, record) => {
                return (
                    <span>
                        {record.product ? record.product.name : 'Không có sản phẩm'}
                    </span>
                );
            }
        },
        { title: 'Tồn kho', dataIndex: 'stock_quantity', key: 'stock_quantity', width: '15%', className: 'text-center' },
        { title: 'Ngưỡng giá trị', dataIndex: 'min_stock_threshold', key: 'min_stock_threshold', width: '15%', className: 'text-center' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: '20%',
            className: 'text-center',
            render: (text, record) => {
                return (
                    <span style={{ color: getStatusColor(record.status), fontWeight: 500, fontSize: 16 }}>
                        {record.status}
                    </span>
                );
            }
        },
    ];

    const handleRowClick = async (warehouse) => {
        const pathPrev = location.pathname + location.search;
        sessionStorage.setItem('previousWarehousePath', pathPrev);

        // Lọc sản phẩm từ warehouse theo supplier_id
        if (warehouse && warehouse.product) {
            const supplierId = warehouse.product.supplier_id;

            // Lọc sản phẩm từ warehouses theo supplier_id
            const filteredProducts = warehouses.filter(item => item.product && item.product.supplier_id === supplierId);

            // Cập nhật state với danh sách sản phẩm đã lọc
            setProducts(filteredProducts);
            navigate('/admin/inventory/' + warehouse._id + '/product');
            setIsModalOpen(true);

        } else {
            console.error("Warehouse or product is null", warehouse);
        }

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

    // Hàm cập nhật bộ lọc
    const handleFilterChange = (selectedOptions, actionMeta) => {
        const { name } = actionMeta;
        const value = selectedOptions ? selectedOptions.map(option => option.value) : [];
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const applyFilters = () => {
        let filteredData = warehouses;

        if (filters.item_code) {
            filteredData = filteredData.filter(warehouse =>
                warehouse.item_code === filters.item_code);
        }

        if (filters.productName) {
            filteredData = filteredData.filter(warehouse =>
                warehouse.product?.name?.toLowerCase().includes(filters.productName.toLowerCase()));
        }

        if (filters.stockQuantity) {
            filteredData = filteredData.filter(warehouse =>
                warehouse.stock_quantity > Number(filters.stockQuantity)
            );
        }

        if (filters.minStockThreshold) {
            filteredData = filteredData.filter(warehouse =>
                warehouse.min_stock_threshold < Number(filters.minStockThreshold)
            );
        }

        if (filters.status.length > 0) {
            filteredData = filteredData.filter(warehouse =>
                filters.status.includes(warehouse.status)
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
            minStockThreshold: '',
            status: [],
        });
        setFilteredWarehouses(warehouses);
    };

    const statusOptions = [
        { value: 'Còn hàng', label: 'Còn hàng' },
        { value: 'Hết hàng', label: 'Hết hàng' },
        { value: 'Ít hàng', label: 'Ít hàng' },
    ];

    // Lọc các giá trị không trùng nhau cho productOptions
    const uniqueProductOptions = Array.from(new Set(productList.map(product => product.name)))
        .map(name => ({
            value: name,
            label: name
        }));

    // Lọc các giá trị không trùng nhau cho itemCodeOptions
    const uniqueItemCodeOptions = Array.from(new Set(productList.map(product => product.item_code)))
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
                products={products}
                productColumns={productColumns}
            />

            <Modal
                title={'Lọc dữ liệu kho'}
                isOpen={isFilterOpen}
                onClose={closeFilterModal}
                width={500}
                height={500}
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

                    <div className="filter-item">
                        <label>Ngưỡng giá trị nhỏ hơn:</label>
                        <input
                            type="number"
                            name="minStockThreshold"
                            value={filters.minStockThreshold}
                            onChange={(e) => setFilters({ ...filters, minStockThreshold: e.target.value })}
                        />
                    </div>

                    <div className="filter-item">
                        <label>Trạng thái:</label>
                        <Select
                            isMulti
                            name="status"
                            value={statusOptions.filter(option => filters.status.includes(option.value))}
                            onChange={handleFilterChange}
                            options={statusOptions}
                            classNamePrefix="select"
                            menuPortalTarget={document.body}
                            styles={{
                                menuPortal: base => ({ ...base, zIndex: 9999, width: 200 }),
                            }}
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