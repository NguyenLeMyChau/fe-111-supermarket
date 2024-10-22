import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { getProductsDetail } from '../../services/productRequest';
import { useLocation, useNavigate } from 'react-router';
import ProductDetail from './ProductDetail';
import { CiEdit } from 'react-icons/ci';
import Modal from '../../components/modal/Modal';
import UpdateProduct from './UpdateProduct';
import AddProduct from './AddProduct';
import Button from '../../components/button/Button';
import Select from 'react-select'; // Import react-select

export default function Product() {
    const navigate = useNavigate();
    const location = useLocation();
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();

    const products = useSelector((state) => state.product?.products) || [];
    const isProductDetail = location.pathname.includes('product-detail');
    const [isOpenNewProduct, setIsOpenNewProduct] = useState(false);

    const [isFilterOpen, setIsFilterOpen] = useState(false);

    // Gom các bộ lọc vào object
    const [filters, setFilters] = useState({
        productName: '',
        item_code: '',
        barcode: '',
    });

    const [filteredProducts, setFilteredProducts] = useState(products);

    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    const handleEditClick = (event, product) => {
        event.stopPropagation();
        setSelectedProduct(product);
        setIsEditModalOpen(true);
        console.log('Selected product', product);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setSelectedProduct(null);
    };

    const productColumns = [
        {
            title: 'Hình ảnh', dataIndex: 'img', key: 'img', width: '20%', className: 'text-center',
            render: (text, record) => (
                <img
                    src={record.img}
                    alt={record.name}
                    style={{ width: 70, height: 70 }}
                />
            )
        },
        { title: 'Mã hàng', dataIndex: 'item_code', key: 'item_code', width: '10%', className: 'text-center' },
        { title: 'Tên sản phẩm', dataIndex: 'name', key: 'name', width: '20%' },
        { title: 'Đơn vị tính', dataIndex: 'unit_id', key: 'unit_id', width: '10%', render: (unit) => unit.description },
        { title: 'Barcode', dataIndex: 'barcode', key: 'barcode', width: '15%', className: 'text-center' },
        {
            title: 'Chỉnh sửa',
            key: 'edit',
            width: '10%',
            className: 'text-center',
            render: (text, record) => (
                <CiEdit
                    style={{ color: 'blue', cursor: 'pointer' }}
                    size={25}
                    onClick={(event) => handleEditClick(event, record)}
                />
            ),
        }
    ];

    const handleRowClick = async (product) => {
        const detail = await getProductsDetail(accessToken, axiosJWT, product._id);
        console.log('Product detail', detail);
        navigate(`/admin/product/${product._id}/product-detail`, { state: { detail } });
    };

    const applyFilters = () => {
        let filteredData = products;

        if (filters.productName) {
            filteredData = filteredData.filter(product =>
                product?.name?.toLowerCase().includes(filters.productName.toLowerCase()));
        }

        if (filters.item_code) {
            filteredData = filteredData.filter(product =>
                product.item_code === filters.item_code
            );
        }

        if (filters.barcode) {
            filteredData = filteredData.filter(product =>
                product.barcode === filters.barcode
            );
        }

        setFilteredProducts(filteredData);
        closeFilterModal();
    };

    // Hàm đặt lại bộ lọc
    const resetFilters = () => {
        setFilters({
            productName: '',
            item_code: '',
            barcode: '',
        });
        setFilteredProducts(products);
    };

    const handleFilterClick = () => {
        setIsFilterOpen(true);
    };

    const closeFilterModal = () => {
        setIsFilterOpen(false);
    };

    // Options cho react-select
    // Lọc các giá trị không trùng nhau cho productOptions
    const uniqueProductOptions = Array.from(new Set(products.map(product => product.name)))
        .map(name => ({
            value: name,
            label: name
        }));

    // Lọc các giá trị không trùng nhau cho itemCodeOptions
    const uniqueItemCodeOptions = Array.from(new Set(products.map(product => product.item_code)))
        .map(item_code => ({
            value: item_code,
            label: item_code
        }));

    // Lọc các giá trị không trùng nhau cho barcodeOptions
    const uniqueBarcodeOptions = Array.from(new Set(products.map(product => product.barcode)))
        .map(barcode => ({
            value: barcode,
            label: barcode
        }));

    return (
        <>
            {isProductDetail ? (
                <ProductDetail />
            ) : (
                <>
                    <FrameData
                        title="Danh sách sản phẩm"
                        buttonText="Thêm sản phẩm"
                        data={filteredProducts}
                        columns={productColumns}
                        onRowClick={handleRowClick}
                        onButtonClick={() => setIsOpenNewProduct(true)}
                        handleFilterClick={handleFilterClick}
                    />

                    <Modal
                        title={'Lọc sản phẩm'}
                        isOpen={isFilterOpen}
                        onClose={closeFilterModal}
                        width={500}
                        height={400}
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
                                            width: '300px',
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
                                            width: '300px',
                                            zIndex: 8888,
                                        }),
                                    }}
                                />

                            </div>
                            <div className="filter-item">
                                <label>Barcode</label>
                                <Select
                                    value={uniqueBarcodeOptions.find(option => option.value === filters.barcode) || null}
                                    options={uniqueBarcodeOptions}
                                    onChange={(selectedOption) => setFilters({ ...filters, barcode: selectedOption?.value || '' })}
                                    styles={{
                                        container: (provided) => ({
                                            ...provided,
                                            width: '300px',
                                            zIndex: 7777,
                                        }),
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

                </>
            )}

            {isOpenNewProduct && (
                <AddProduct
                    isOpen={isOpenNewProduct}
                    onClose={() => setIsOpenNewProduct(false)}
                />
            )}

            {isEditModalOpen && (
                <Modal
                    title='Cập nhật sản phẩm'
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    width={'70%'}
                >
                    <UpdateProduct
                        product={selectedProduct}
                    />
                </Modal>
            )}
        </>
    );
}
