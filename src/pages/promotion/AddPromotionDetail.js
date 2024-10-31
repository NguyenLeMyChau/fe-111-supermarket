import React, { useEffect, useState } from "react";
import "./Promotion.scss";
import Modal from "../../components/modal/Modal";
import Input from "../../components/input/Input";
import Button from "../../components/button/Button";
import { addPromotionDetail } from "../../services/promotionRequest";
import { useAccessToken, useAxiosJWT } from "../../utils/axiosInstance";
import { validatePromotionDetailData } from "../../utils/validation";

import Dropdownpicker from "../../components/dropdownpicker/dropdownpicker";
import { getAllProducts } from "../../services/productRequest";
import { useDispatch, useSelector } from "react-redux";

export default function AddPromotionDetail({ isOpen, onClose, promotionLine }) {
  const axiosJWT = useAxiosJWT();
  const accessToken = useAccessToken();
  const dispatch = useDispatch();
  const units = useSelector((state) => state.unit?.units) || [];
  const [unitItem, setUnitItem] = useState(units);
  const [unitItemDonate, setUnitItemDonate] = useState(units);
  const [errors, setErrors] = useState({});
  console.log(promotionLine)
  const [productId, setProductId] = useState({
    item_code: "",
    unit_id: "",
    name: "",
  });
  const [productDonate, setProductDonate] = useState({
    item_code: "",
    unit_id: "",
    name: "",
  });
  const [products, setProducts] = useState([]);
  const [productItem, setProductItem] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [promotionDetailData, setPromotionDetailData] = useState({
    product_id: null,
    quantity: "",
    product_donate: null,
    quantity_donate: "",
    amount_sales: "",
    amount_donate: "",
    percent: "",
    amount_limit: "",
    unit_id: null,
    unit_id_donate: null,
    promotionLine_id: promotionLine._id,
    description:"",
  });

  const fetchProducts = async () => {
    try {
      const productsData = await getAllProducts(
        accessToken,
        axiosJWT,
        dispatch
      );
      setProducts(productsData);
    } catch (error) {
      console.error("Failed to fetch products:", error);
    }
  };

  useEffect(() => {
    if (
      (promotionLine.type === "quantity" || promotionLine.type === "amount") &&
      products.length === 0
    ) {
      fetchProducts();
    }
  }, [accessToken, axiosJWT, dispatch]);
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
    setPromotionDetailData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDropdownChangeProduct = (name, value) => {
    if (name === "unit_id") {
      setPromotionDetailData((prevData) => ({ ...prevData, unit_id: value }));
    }
    if (name === "item_code" || name === "name") {
      const selectedProduct = products.find(
        (product) => product.name === value || product.item_code === value
      );
     
      if (selectedProduct) {
        // Get the unit IDs for the selected product
        const unitIds = products
          .filter((product) => product.item_code === selectedProduct.item_code)
          .flatMap((product) => product.unit_convert.map((unit) => unit.unit));
        console.log(unitIds);
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
    if (name === "item_code") {
      const product_id= products.find(
        (product) =>
          product.item_code === value
      )?._id;

      setPromotionDetailData((prevData) => ({
        ...prevData,
        product_id,
      }));
    }
  };
  const handleDropdownChangeProductDonate = (name, value) => {
    if (name === "unit_id") {
      setPromotionDetailData((prevData) => ({ ...prevData, unit_id_donate: value }));
    }
    if (name === "item_code" || name === "name") {
      const selectedProductDonate = products.find(
        (product) => product.name === value || product.item_code === value
      );
      if (selectedProductDonate) {
        // Get the unit IDs for the selected product
        const unitIds = products
          .filter((product) => product.item_code === selectedProductDonate.item_code)
          .flatMap((product) => product.unit_convert.map((unit) => unit.unit));
        console.log(unitIds);
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
    if (name === "item_code") {
        const product_donate = products.find(
          (product) =>
            product.item_code === value
        )?._id;
  
        setPromotionDetailData((prevData) => ({
          ...prevData,
          product_donate,
        }));
      }
  };
  const handleAddPromotionDetail = async (e) => {
   
    e.preventDefault();
    setIsLoading(true)
    const validationErrors = validatePromotionDetailData(promotionDetailData,promotionLine.type);
    console.log(validationErrors)
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsLoading(false)
      alert(validationErrors)
      return;
    }

    try {
      const response = await addPromotionDetail(
        { ...promotionDetailData },
        dispatch,
        accessToken,
        axiosJWT
      );
      if (response) {
        console.log("Promotion detail added:", response);
        setPromotionDetailData({
          product_id: "",
          quantity: "",
          product_donate: "",
          quantity_donate: "",
          amount_sales: "",
          amount_donate: "",
          percent: "",
          unit_id_donate:"",
          amount_limit: "",
          promotionLine_id: promotionLine._id,
          description: "",
        });
        setErrors({});
        alert("Đã thêm chi tiết khuyến mãi thành công");
        onClose(); // Đóng modal
      }
    } catch (error) {
      console.error("Failed to add promotion detail:", error);
      alert("Có lỗi xảy ra khi thêm chi tiết khuyến mãi.");
    }
  };

  return (
    <Modal
      title="Thêm Chi Tiết Khuyến Mãi"
      isOpen={isOpen}
      onClose={onClose}
      width={"30%"}
    >
      <div className="add-promotion-detail-modal">
        <form
          className="promotion-detail-form"
          onSubmit={handleAddPromotionDetail}
        >
          {promotionLine.type === "percentage" && (
            <>
              <Input
                className="promotion-input"
                type="text"
                label="Mô tả"
                name="description"
                value={promotionDetailData.description}
                onChange={handleChange}
                error={errors.description}
              />
              <Input
                className="promotion-input"
                type="number"
                label="Số tiền bán"
                name="amount_sales"
                value={promotionDetailData.amount_sales}
                onChange={handleChange}
                error={errors.amount_sales}
              />
              <Input
                className="promotion-input"
                type="number"
                label="Phần trăm"
                name="percent"
                value={promotionDetailData.percent}
                onChange={handleChange}
                error={errors.percent}
              />
              <Input
                className="promotion-input"
                type="number"
                label="Giới hạn số tiền"
                name="amount_limit"
                value={promotionDetailData.amount_limit}
                onChange={handleChange}
                error={errors.amount_limit}
              />
            </>
          )}

          {promotionLine.type === "amount" && (
            <>
              <Input
                className="promotion-input"
                type="text"
                label="Mô tả"
                name="description"
                value={promotionDetailData.description}
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
                value={promotionDetailData.quantity}
                onChange={handleChange}
                error={errors.quantity}
              />
              <Input
                className="promotion-input"
                type="number"
                label="Số tiền tặng kèm"
                name="amount_donate"
                value={promotionDetailData.amount_donate}
                onChange={handleChange}
                error={errors.amount_donate}
              />
            </>
          )}

          {promotionLine.type === "quantity" && (
            <>
              <Input
                className="promotion-input"
                type="text"
                label="Mô tả"
                name="description"
                value={promotionDetailData.description}
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
                value={promotionDetailData.quantity}
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
                value={promotionDetailData.quantity_donate}
                onChange={handleChange}
                error={errors.quantity_donate}
              />
            </>
          )}

          <div className="flex-row-center">
          <div className="login-button" style={{ width: 200 }}>
                            <Button
                                type="submit"
                                text={isLoading ? 'Đang thêm...' : 'Thêm'}
                               
                                
                            />
                        </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
