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
  const [promotionDetailData, setPromotionDetailData] = useState({
    product_id: "",
    quantity: "",
    product_donate: "",
    quantity_donate: "",
    amount_sales: "",
    amount_donate: "",
    percent: "",
    amount_limit: "",
    promotionLine_id: promotionLine._id,
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
  
  
  console.log(products);
  console.log(productItem);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPromotionDetailData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleDropdownChangeProduct = (name, value) => {
    if (name === "unit_id") {
      console.log(value);
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

        // Find the unit details for these unit IDs
        const unitSelect = units.filter((unit) => unitIds.includes(unit._id));

        if (unitSelect) {
          setUnitItem(unitSelect);
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
          product.name === productId.name &&
          product.unit_id === productId.unit_id
      )?._id;

      setPromotionDetailData((prevData) => ({
        ...prevData,
        product_id,
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

        // Find the unit details for these unit IDs
        const unitSelectDonate = units.filter((unit) => unitIds.includes(unit._id));

        if (unitSelectDonate) {
          setUnitItemDonate(unitSelectDonate);
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
            product.name === productDonate.name &&
            product.unit_id === productDonate.unit_id
        )?._id;
  
        setPromotionDetailData((prevData) => ({
          ...prevData,
          product_donate,
        }));
      }
  };
  const handleAddPromotionDetail = async (e) => {
    e.preventDefault();

    const validationErrors = validatePromotionDetailData(promotionDetailData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      const response = await addPromotionDetail(
        { ...promotionDetailData },
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
          amount_limit: "",
          promotionLine_id: promotionLine._id,
          description: "",
        });
        setErrors({});
        alert("Đã thêm chi tiết khuyến mãi thành công");
        onClose(); // Đóng modal
        window.location.reload();
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
              <Button type="submit" text="Thêm dòng khuyến mãi" />
            </div>
          </div>
        </form>
      </div>
    </Modal>
  );
}
