import React, { useState, useEffect } from 'react';
import Button from '../../components/button/Button';
import Input from '../../components/input/Input';
import { updatePromotionDetail } from '../../services/promotionRequest';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { validatePromotionDetailData } from '../../utils/validation';
import Dropdownpicker from '../../components/dropdownpicker/dropdownpicker';
import { getAllProducts } from '../../services/productRequest';
import { useDispatch, useSelector } from 'react-redux';

const UpdatePromotionDetail = ({ promotionDetail, onClose, promotionLine }) => {
    const axiosJWT = useAxiosJWT();
    const accessToken = useAccessToken();
    const dispatch = useDispatch();
    const units = useSelector((state) => state.unit?.units) || [];
    const [unitItem, setUnitItem] = useState(units);
    const [unitItemDonate, setUnitItemDonate] = useState(units);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [products, setProducts] = useState([]);
    const [productItem, setProductItem] = useState([]);
    console.log(promotionDetail)
    const [productId, setProductId] = useState({
        item_code: promotionDetail.product.item_code,
        unit_id:promotionDetail.product.unit_id._id,
        name: promotionDetail.product.name,
      });
      const [productDonate, setProductDonate] = useState({
        item_code: promotionDetail.product_donate?.item_code,
        unit_id:promotionDetail.product_donate?.unit_id._id,
        name: promotionDetail.product_donate?.name,
      });
    const [formData, setFormData] = useState({
        product_id: promotionDetail.product._id || '',
        quantity: promotionDetail.quantity || '',
        product_donate: promotionDetail.product_donate?._id || '',
        quantity_donate: promotionDetail.quantity_donate || '',
        amount_sales: promotionDetail.amount_sales || '',
        amount_donate: promotionDetail.amount_donate || '',
        percent: promotionDetail.percent || '',
        amount_limit: promotionDetail.amount_limit || '',
        promotionLine_id: promotionDetail.promotionLine_id,
        description: promotionDetail.description,
    });

    const fetchProducts = async () => {
        try {
            const productsData = await getAllProducts(accessToken, axiosJWT, dispatch);
            setProducts(productsData);
        } catch (error) {
            console.error('Failed to fetch products:', error);
        }
    };

    useEffect(() => {
        if ((promotionLine.type === 'quantity' || promotionLine.type === 'amount') && products.length === 0) {
            fetchProducts();
        }
    }, [promotionLine.type, accessToken, axiosJWT, dispatch]);

    useEffect(() => {
        if (products.length > 0) {
          const seenItemCodes = new Set();
          const filteredProductItem = products
            .filter(({ item_code }) => {
              if (seenItemCodes.has(item_code)) {
                return false; // Skip duplicates
              }
              seenItemCodes.add(item_code);
              return true; // Include unique item_code
            })
            .map(({ item_code, name }) => ({
              item_code,
              name,
            }));
            
          setProductItem(filteredProductItem);
        }
      }, [products]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDropdownChange = (name, value) => {
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };
    const handleDropdownChangeProduct = (name, value) => {
        if (name === "unit_id") {
          setProductId((prevData) => ({ ...prevData, unit_id: value }));
        }
        if (name === "item_code" || name === "name") {
          const selectedProduct = products.find(
            (product) => product.name === value || product.item_code === value
          );
         
          if (selectedProduct) {
            // Get the unit IDs for the selected product
            const unitIds = products
              .filter((product) => product.item_code === selectedProduct.item_code)
              .map((product) => product.unit_id);
    
            if (unitIds) {
              setUnitItem(unitIds);
            }
            setProductId((prevData) => ({
              ...prevData,
              name: selectedProduct.name,
              item_code: selectedProduct.item_code,
            }));
          }
        }
        if (productId.item_code && productId.name && productId.unit_id) {
          const product_id = products.find(
            (product) =>
              product.item_code === productId.item_code &&
              product.unit_id._id === productId.unit_id
          );
          console.log(product_id)      
          if(product_id)
          setFormData((prevData) => ({
            ...prevData,
            product_id:product_id._id,
          }));
        }
      };
      const handleDropdownChangeProductDonate = (name, value) => {
        setProductDonate((prevData) => ({ ...prevData, [name]: value }));
        if (name === "item_code" || name === "name") {
          const selectedProductDonate = products.find(
            (product) => product.name === value || product.item_code === value
          );
          if (selectedProductDonate) {
            // Get the unit IDs for the selected product
            const unitIds = products
              .filter((product) => product.item_code === selectedProductDonate.item_code)
              .map((product) => product.unit_id);
    
      
    
            if (unitIds) {
              setUnitItemDonate(unitIds);
            }
    
            setProductDonate((prevData) => ({
              ...prevData,
              name: selectedProductDonate.name,
              item_code: selectedProductDonate.item_code,
            }));
          }
        }
        if (productDonate.item_code && productDonate.name && productDonate.unit_id) {
            const product_donate = products.find(
              (product) =>
                product.item_code === productDonate.item_code &&
                product.unit_id._id === productDonate.unit_id
            )?._id;
      
            setErrors((prevData) => ({
              ...prevData,
              product_donate,
            }));
          }
      };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validatePromotionDetailData(formData);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            alert(errors)
            return;
        }
        try {
            setIsLoading(true);
            await updatePromotionDetail(promotionDetail._id, formData, accessToken, axiosJWT);
            alert('Cập nhật chi tiết khuyến mãi thành công');
            onClose();
            window.location.reload()
        } catch (error) {
            alert('Cập nhật chi tiết khuyến mãi thất bại: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    // Kiểm tra xem promotionLine.isActive có phải là true không
    const isActive = promotionLine.isActive;

    return (
        <div className="flex-column-center">
            {isActive ? (
               <div className="promotion-message">
               <p>Chi tiết khuyến mãi không thể được sửa đổi vì chương trình đang hoạt động.</p>
               <Button text="Đóng" onClick={onClose} />
             </div>
            ) : (
                <form onSubmit={handleSubmit}>
                    {promotionLine.type === 'percentage' && (
                        <>
                           <Input
                className="promotion-input"
                type="text"
                label="Mô tả"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
              />
              <Input
                className="promotion-input"
                type="number"
                label="Số tiền bán"
                name="amount_sales"
                value={formData.amount_sales}
                onChange={handleChange}
                error={errors.amount_sales}
              />
              <Input
                className="promotion-input"
                type="number"
                label="Phần trăm"
                name="percent"
                value={formData.percent}
                onChange={handleChange}
                error={errors.percent}
              />
              <Input
                className="promotion-input"
                type="number"
                label="Giới hạn số tiền"
                name="amount_limit"
                value={formData.amount_limit}
                onChange={handleChange}
                error={errors.amount_limit}
              />
            </>
                    )}

                    {promotionLine.type === 'amount' && (
                        <>
                           <Input
                className="promotion-input"
                type="text"
                label="Mô tả"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
              />
              <Dropdownpicker
                className="promotion-dropdown"
                label="Mã hàng"
                options={products.map((product) => ({
                  value: product.item_code,
                  label: product.item_code,
                }))}
                value={productId.item_code}
                onChange={(value) =>
                  handleDropdownChangeProduct("item_code", value)
                }
                error={errors.item_code}
              />
              <Dropdownpicker
                className="promotion-dropdown"
                label="Sản phẩm"
                options={products.map((product) => ({
                  value: product.name,
                  label: product.name,
                }))}
                value={productId.name}
                onChange={(value) => handleDropdownChangeProduct("name", value)}
                error={errors.product_id}
              />
              <Dropdownpicker
                className="promotion-dropdown"
                label="Đơn vị"
                options={unitItem.map((unit) => ({
                  value: unit._id,
                  label: unit.description,
                }))}
                value={productId.unit_id}
                onChange={(value) =>
                  handleDropdownChangeProduct("unit_id", value)
                }
              />
              <Input
                className="promotion-input"
                type="number"
                label="Số lượng"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                error={errors.quantity}
              />
              <Input
                className="promotion-input"
                type="number"
                label="Số tiền tặng kèm"
                name="amount_donate"
                value={formData.amount_donate}
                onChange={handleChange}
                error={errors.amount_donate}
              />
            </>
                    )}

                    {promotionLine.type === 'quantity' && (
                        <>
                            <Input
                className="promotion-input"
                type="text"
                label="Mô tả"
                name="description"
                value={formData.description}
                onChange={handleChange}
                error={errors.description}
              />
              <Dropdownpicker
                className="promotion-dropdown"
                label="Mã hàng"
                options={products.map((product) => ({
                  value: product.item_code,
                  label: product.item_code,
                }))}
                value={productId.item_code}
                onChange={(value) =>
                  handleDropdownChangeProduct("item_code", value)
                }
                error={errors.item_code}
              />
              <Dropdownpicker
                className="promotion-dropdown"
                label="Sản phẩm"
                options={products.map((product) => ({
                  value: product.name,
                  label: product.name,
                }))}
                value={productId.name}
                onChange={(value) => handleDropdownChangeProduct("name", value)}
                error={errors.product_id}
              />
              <Dropdownpicker
                className="promotion-dropdown"
                label="Đơn vị"
                options={unitItem.map((unit) => ({
                  value: unit._id,
                  label: unit.description,
                }))}
                value={productId.unit_id}
                onChange={(value) =>
                  handleDropdownChangeProduct("unit_id", value)
                }
              />
              <Input
                className="promotion-input"
                type="number"
                label="Số lượng"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                error={errors.quantity}
              />
              <Dropdownpicker
                className="promotion-dropdown"
                label="Mã hàng tặng"
                options={products.map((product) => ({
                  value: product.item_code,
                  label: product.item_code,
                }))}
                value={productDonate.item_code}
                onChange={(value) =>
                  handleDropdownChangeProductDonate("item_code", value)
                }
                error={errors.item_code}
              />
              <Dropdownpicker
                className="promotion-dropdown"
                label="Sản phẩm tặng"
                options={products.map((product) => ({
                  value: product.name,
                  label: product.name,
                }))}
                value={productDonate.name}
                onChange={(value) =>
                  handleDropdownChangeProductDonate("name", value)
                }
                error={errors.product_id}
              />
              <Dropdownpicker
                className="promotion-dropdown"
                label="Đơn vị"
                options={unitItemDonate.map((unit) => ({
                  value: unit._id,
                  label: unit.description,
                }))}
                value={productDonate.unit_id}
                onChange={(value) =>
                  handleDropdownChangeProductDonate("unit_id", value)
                }
              />
              <Input
                className="promotion-input"
                type="number"
                label="Số lượng tặng kèm"
                name="quantity_donate"
                value={formData.quantity_donate}
                onChange={handleChange}
                error={errors.quantity_donate}
              />
            </>
                    )}

                    <div className="flex-row-center">
                        <div className="login-button" style={{ width: 200 }}>
                            <Button
                                type="submit"
                                text={isLoading ? 'Đang cập nhật...' : 'Cập nhật chi tiết khuyến mãi'}
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default UpdatePromotionDetail;
