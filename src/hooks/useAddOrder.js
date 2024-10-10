// src/hooks/useAddOrder.js
import { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { orderProductFromSupplier } from '../services/warehouseRequest';
import { useAccessToken, useAxiosJWT } from '../utils/axiosInstance';
import { useNavigate } from 'react-router';

const useAddOrder = (selectedProducts, supplierId) => {
    const navigate = useNavigate();

    const user = useSelector((state) => state.auth?.login?.currentUser);
    const suppliers = useSelector((state) => state.supplier?.suppliers);
    const warehouses = useSelector((state) => state.warehouse?.warehouse);

    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();

    const [quantities, setQuantities] = useState(
        selectedProducts.reduce((acc, product) => {
            acc[product.product_id] = 1;
            return acc;
        }, {})
    );
    const [products, setProducts] = useState(selectedProducts);
    const ordererName = useState(user.user.name);
    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Thêm state isLoading
    const [isLoadingSupplier, setIsLoadingSupplier] = useState(false); // Thêm state isLoadingSupplier

    const handleQuantityChange = (productId, value) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: value < 1 ? 1 : value,
        }));
    };

    const handleRemoveProduct = (productId) => {
        setProducts(products.filter(product => product.product._id !== productId));
        setQuantities((prevQuantities) => {
            const newQuantities = { ...prevQuantities };
            delete newQuantities[productId];
            return newQuantities;
        });
    };

    const handleOrder = async () => {
        const isConfirmed = window.confirm('Bạn có chắc chắn muốn đặt hàng không?');
        if (!isConfirmed) {
            return;
        }

        setIsLoading(true);
        try {
            const orderData = {
                supplierId: selectedSupplier.value,
                accountId: user.id,
                products: products.map(product => ({
                    product_id: product.product._id,
                    quantity: quantities[product.product._id],
                    price_order: product.order_Price,
                })),
            };

            const order = await orderProductFromSupplier(accessToken, axiosJWT, orderData);

            console.log('Kết quả đặt hàng:', order);
            alert('Đặt hàng thành công!');
            navigate('/admin/order');

        } catch (error) {
            console.error('Đặt hàng thất bại:', error);
            alert(error.response ? error.response.data.message : error.message);
        } finally {
            setIsLoading(false); // Đặt isLoading thành false khi xử lý xong
        }
    };

    const handleSupplierSelect = async (selectedOption) => {
        setSelectedSupplier(selectedOption);
        setIsLoadingSupplier(true);
        try {
            const supplierId = selectedOption.value;
            const filteredProducts = warehouses.filter(item => item.product && item.product.supplier_id === supplierId);

            if (filteredProducts.length === 0) {
                setProducts([]);
                return;
            } else {
                setProducts(filteredProducts);

                const newQuantities = filteredProducts.reduce((acc, product) => {
                    acc[product.product._id] = product.quantity || 1;
                    return acc;
                }, {});
                setQuantities(newQuantities);
            }

        } catch (error) {
            console.error('Load dữ liệu nhà cung cấp thất bại:', error);
            alert(error.response ? error.response.data.message : error.message);
        } finally {
            setIsLoadingSupplier(false);
        }
    };

    // Sử dụng useMemo để tối ưu hóa việc tạo danh sách nhà cung cấp
    const supplierOptions = useMemo(() => {
        // const validStatuses = ['Đang chờ xử lý', 'Đã duyệt', 'Đang giao hàng'];

        if (supplierId) {
            const supplier = suppliers.find(supplier => supplier._id === supplierId);
            setSelectedSupplier({ value: supplier._id, label: supplier.name });
        }
        const filteredSuppliers = suppliers
            .map(supplier => ({
                value: supplier._id,
                label: supplier.name,
            }));
        return filteredSuppliers;

    }, [supplierId, suppliers]);


    return {
        quantities,
        products,
        ordererName,
        selectedSupplier,
        setSelectedSupplier,
        handleQuantityChange,
        handleRemoveProduct,
        handleOrder,
        handleSupplierSelect,
        supplierOptions,
        isLoading,
        isLoadingSupplier
    };
};

export default useAddOrder;
