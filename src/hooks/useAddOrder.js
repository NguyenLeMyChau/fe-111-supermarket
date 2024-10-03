// src/hooks/useAddOrder.js
import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

const useAddOrder = (selectedProducts, supplier) => {
    const user = useSelector((state) => state.auth?.login?.currentUser);
    const suppliers = useSelector((state) => state.commonData?.dataManager?.suppliers);

    const [quantities, setQuantities] = useState(
        selectedProducts.reduce((acc, product) => {
            acc[product.product_id] = 1;
            return acc;
        }, {})
    );

    const [products, setProducts] = useState(selectedProducts);
    const [ordererName, setOrdererName] = useState('');
    const [selectedSupplier, setSelectedSupplier] = useState(null);

    const handleQuantityChange = (productId, value) => {
        setQuantities((prevQuantities) => ({
            ...prevQuantities,
            [productId]: value < 1 ? 1 : value,
        }));
    };

    const handleRemoveProduct = (productId) => {
        setProducts(products.filter(product => product.product_id !== productId));
        setQuantities((prevQuantities) => {
            const newQuantities = { ...prevQuantities };
            delete newQuantities[productId];
            return newQuantities;
        });
    };

    const handleOrder = () => {
        console.log("Đặt hàng với sản phẩm:", products);
        console.log("Thông tin người đặt:", user.id);
        console.log("Thông tin nhà cung cấp:", products[0].supplier_id);
    };

    const handleSupplierSelect = (selectedOption) => {
        setSelectedSupplier(selectedOption); // Set selected option correctly
    };

    // Sử dụng useMemo để tối ưu hóa việc tạo danh sách nhà cung cấp
    const supplierOptions = useMemo(() => {
        return suppliers.map(supplier => ({
            value: supplier.id,
            label: supplier.name,
        }));
    }, [suppliers]);

    useEffect(() => {
        if (user) {
            setOrdererName(user.user.name);
            setSelectedSupplier({ value: supplier._id, label: supplier.name });
        }

    }, [user, supplier]);

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
    };
};

export default useAddOrder;
