import React, { useState } from 'react';
import './Warehouse.scss';
import { useDispatch, useSelector } from 'react-redux';
import FrameData from '../frameData/FrameData';
import { useLocation, useNavigate } from 'react-router';
import ProductWarehouse from './ProductWarehouse';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { getProductsByWarehouseId } from '../../services/warehouseRequest';
import Modal from '../../components/modal/Modal';
import Button from '../../components/button/Button';

export default function Warehouse() {
    const navigate = useNavigate();
    const location = useLocation();
    const dispatch = useDispatch();

    const accessToken = useAccessToken();
    const axiosJWT = useAxiosJWT();

    const warehouses = useSelector((state) => state.warehouse?.warehouse);

    const [products, setProducts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Gom các bộ lọc vào object
    const [filters, setFilters] = useState({
        productName: '',
        stockQuantity: '',
        minStockThreshold: '',
        status: '',
    });

    const [filteredWarehouses, setFilteredWarehouses] = useState(warehouses);

    const warehouseColumn = [
        { title: 'Tên sản phẩm', dataIndex: 'product_name', key: 'product_name', width: '40%' },
        { title: 'Tồn kho', dataIndex: 'stock_quantity', key: 'stock_quantity', width: '20%', className: 'text-center' },
        { title: 'Ngưỡng giá trị', dataIndex: 'min_stock_threshold', key: 'min_stock_threshold', width: '20%', className: 'text-center' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: '20%',
            className: 'text-center',
            render: (status) => (
                <span className={status ? 'status-true' : 'status-false'}>
                    {status ? 'Còn hàng' : 'Hết hàng'}
                </span>
            )
        },
    ];

    const productColumns = [
        { title: 'Tên sản phẩm', dataIndex: 'product_name', key: 'product_name', width: '30%' },
        { title: 'Tồn kho', dataIndex: 'stock_quantity', key: 'stock_quantity', width: '15%', className: 'text-center' },
        { title: 'Ngưỡng giá trị', dataIndex: 'min_stock_threshold', key: 'min_stock_threshold', width: '15%', className: 'text-center' },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: '15%',
            className: 'text-center',
            render: (status) => (
                <span className={status ? 'status-true' : 'status-false'}>
                    {status ? 'Còn hàng' : 'Hết hàng'}
                </span>
            )
        }
    ];

    const handleRowClick = async (warehouse) => {
        const pathPrev = location.pathname + location.search;
        sessionStorage.setItem('previousWarehousePath', pathPrev);

        const warehouseProduct = await getProductsByWarehouseId(accessToken, axiosJWT, dispatch, warehouse._id);
        setProducts(warehouseProduct);

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

    // Hàm cập nhật bộ lọc
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    const applyFilters = () => {
        let filteredData = warehouses;

        if (filters.productName) {
            filteredData = filteredData.filter(warehouse =>
                warehouse.product_name.toLowerCase().includes(filters.productName.toLowerCase())
            );
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

        if (filters.status) {
            filteredData = filteredData.filter(warehouse =>
                warehouse.status === (filters.status === 'true')
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
            status: '',
        });
        setFilteredWarehouses(warehouses);
    };

    return (
        <div>
            <FrameData
                title="Kho"
                buttonText="Cập nhật kho"
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
                height={400}
            >
                <div className="filter-modal-content">
                    <div className="filter-item">
                        <label>Tên sản phẩm:</label>
                        <input
                            type="text"
                            name="productName"
                            value={filters.productName}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="filter-item">
                        <label>Tồn kho lớn hơn:</label>
                        <input
                            type="number"
                            name="stockQuantity"
                            value={filters.stockQuantity}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="filter-item">
                        <label>Ngưỡng giá trị nhỏ hơn:</label>
                        <input
                            type="number"
                            name="minStockThreshold"
                            value={filters.minStockThreshold}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="filter-item">
                        <label>Trạng thái:</label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                        >
                            <option value="">Tất cả</option>
                            <option value="true">Còn hàng</option>
                            <option value="false">Hết hàng</option>
                        </select>
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
