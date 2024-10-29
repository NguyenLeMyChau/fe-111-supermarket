import React, { useState } from "react";
import FrameData from "../../containers/frameData/FrameData";
import AddProductPriceDetail from "./AddPriceDetail";
import { CiEdit } from "react-icons/ci";
import Modal from "../../components/modal/Modal";
import UpdatePriceDetail from "./UpdatePriceDetail";
import { useLocation } from "react-router";
import Button from "../../components/button/Button";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-dropdown-select";
import { deleteProductPriceDetail } from "../../services/priceRequest";
import { MdDelete } from "react-icons/md";
import { useAccessToken, useAxiosJWT } from "../../utils/axiosInstance";

export default function PriceDetail() {
  const dispatch = useDispatch();
  const axiosJWT = useAxiosJWT();
  const accessToken = useAccessToken();
  const location = useLocation();
  const categories = useSelector((state) => state.category?.categories) || [];
  const units = useSelector((state) => state.unit?.units) || [];
  const { productPriceHeader, productDetail } = location.state || {};
  const [currentDetail, selectCurrentDetail] = useState({});
  const [isEditModalDetailOpen, setIsEditModalDetailOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isOpenNewPrice,setIsOpenNewPrice]= useState(false);
  // Filter state
  const [filters, setFilters] = useState({
    productName: "",
    unit: "",
    minPrice: "",
    maxPrice: "",
  });
console.log(productDetail,productPriceHeader)


const handleDeleteClick = async (event, productPriceHeader) => {
  event.stopPropagation();

  const confirmDelete = window.confirm("Có chắn chắn xóa giá sản phẩm");
  if (!confirmDelete) return; // Exit if user cancels


    const deletedPriceDetail = await deleteProductPriceDetail(accessToken, axiosJWT, dispatch, productPriceHeader._id);
    if(deletedPriceDetail) {
      alert(deletedPriceDetail.message)
      const updatedProductPriceHeader = deletedPriceDetail.allProductPrices?.find(
        (item) => item._id === productPriceHeader.productPriceHeader_id
      );
      console.log(deletedPriceDetail.allProductPrices)
      console.log(productPriceHeader)
      console.log(updatedProductPriceHeader)
    if (updatedProductPriceHeader) {
      const productDetail = updatedProductPriceHeader.productPrices || [];
      updateProductPriceHeader(updatedProductPriceHeader)
      updateProductPriceDetail(productDetail)
    }
  }
    else alert(deletedPriceDetail.message)
 
};

const [filteredProductHeader, setFilteredProductHeader] =
useState(productPriceHeader);

  const [filteredProductDetails, setFilteredProductDetails] =
    useState(productDetail);

    const updateProductPriceHeader = (updatedHeader) => {
      setFilteredProductHeader(updatedHeader); 
      console.log(updatedHeader)
    };
    
    const updateProductPriceDetail = (updateDetail) => {
      setFilteredProductDetails(updateDetail); 
      console.log(updateDetail)
    };
  const productDetailColumn = [
    {
      title: "Mã sản phẩm",
      dataIndex: "item_code",
      key: "item_code",
      width: "20%",
      className: "text-center",
      // render: (product) => product?.item_code,
    },
    {
      title: "Loại sản phẩm",
      dataIndex: "product",
      key: "category",
      width: "15%",
      render: (product) => product?.category_id?.name,
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "product",
      key: "product",
      width: "20%",
      render: (product) => product?.name,
    },
    {
      title: "Đơn vị",
      dataIndex: "unit_id",
      key: "unit",
      width: "10%",
      render: (unit_id) => unit_id?.description,
    },
    {
      title: "Giá",
      dataIndex: "price",
      key: "price",
      width: "10%",
      className: "text-center",
    },
    {
      title: "Chỉnh sửa",
      key: "edit",
      width: "10%",
      className: "text-center",
      render: (text, record) => (
        <CiEdit
          style={{ color: "blue", cursor: "pointer" }}
          size={25}
          onClick={(event) => handleEditDetailClick(event, record)}
        />
      ),
    },{
      title: 'Xóa',
      key: 'delete',
      width: '5%',
      className: 'text-center',
      render: (text, record) => (
        <MdDelete
          style={{ color: 'red', cursor: 'pointer' }}
          size={25}
          onClick={(event) => handleDeleteClick(event, record)}
        />
      ),
    },];
  const handleEditDetailClick = (event, productPriceDetail) => {
    event.stopPropagation();
    selectCurrentDetail(productPriceDetail);
    setIsEditModalDetailOpen(true);
  };

  const handleCloseEditModalDetail = () => {
    setIsEditModalDetailOpen(false);
  };

  const handleFilterClick = () => {
    setIsFilterModalOpen(true);
  };

  const closeFilterModal = () => {
    setIsFilterModalOpen(false);
  };

  // Filter handling
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const applyFilters = () => {
    let filteredData = productDetail;

    if (filters.productName) {
      filteredData = filteredData.filter((detail) =>
        detail.product?.name
          ?.toLowerCase()
          .includes(filters.productName.toLowerCase())
      );
    }

    if (filters.unit) {
      filteredData = filteredData.filter((detail) =>
        detail.product?.unit_id.description
          ?.toLowerCase()
          .includes(filters.unit.toLowerCase())
      );
    }

    if (filters.minPrice) {
      filteredData = filteredData.filter(
        (detail) => detail.price >= Number(filters.minPrice)
      );
    }

    if (filters.maxPrice) {
      filteredData = filteredData.filter(
        (detail) => detail.price <= Number(filters.maxPrice)
      );
    }

    if (filters.itemCode) {
      filteredData = filteredData.filter((detail) =>
        detail.product?.item_code
          ?.toLowerCase()
          .includes(filters.itemCode.toLowerCase())
      );
    }

    if (filters.category) {
      filteredData = filteredData.filter((detail) =>
        detail.product?.category_id.name
          ?.toLowerCase()
          .includes(filters.category.toLowerCase())
      );
    }

    setFilteredProductDetails(filteredData);
    closeFilterModal();
  };

  const resetFilters = () => {
    setFilters({
      productName: "",
      unit: "",
      minPrice: "",
      maxPrice: "",
      itemCode: "",
      productType: "",
    });
    setFilteredProductDetails(productDetail);
  };
  const handleDropdownChange = (name, value) => {
    if (name === "unit") {
      const selectedUnit = units.find((unit) => unit._id === value[0].value);
      const description = selectedUnit ? selectedUnit.description : "";
      setFilters({ ...filters, [name]: description });
    }
    if (name === "category") {
      const selectedCategory = categories.find(
        (category) => category._id === value[0].value
      );
      const nameCategory = selectedCategory ? selectedCategory.name : "";
      setFilters({ ...filters, [name]: nameCategory });
    }
  };
  return (
    <div>
      <FrameData
        title={`Chi tiết : ${filteredProductHeader.description}`}
        data={filteredProductDetails}
        buttonText="Thêm giá sản phẩm"
        columns={productDetailColumn}
        itemsPerPage={8}
        showGoBack={true}
        handleFilterClick={handleFilterClick}
        onButtonClick={() => setIsOpenNewPrice(true)}
        // renderModal={
        //   productPriceHeader?.status === "inactive"
        //     ? (onClose) => (
        //         <AddProductPriceDetail
        //           isOpen={true}
        //           onClose={onClose}
        //           productPriceHeader={productPriceHeader}
                 
        //         />
        //       )
        //     : null
        // }
      />
  {isOpenNewPrice && filteredProductHeader?.status === "inactive" ? (<AddProductPriceDetail
                  isOpen={isOpenNewPrice}
                  onClose={() => setIsOpenNewPrice(false)}
                  productPriceHeader={filteredProductHeader}
                  updateProductPriceDetail={updateProductPriceDetail}
                  updateProductPriceHeader={updateProductPriceHeader}
    
                />):null}
      {isEditModalDetailOpen && filteredProductHeader?.status === "inactive" ? (
        <Modal
          title={`Cập nhật giá`}
          isOpen={isEditModalDetailOpen}
          onClose={handleCloseEditModalDetail}
          width={"30%"}
        >
          <UpdatePriceDetail
            priceDetailid={currentDetail._id}
            priceDetail={currentDetail}
            onClose={handleCloseEditModalDetail}
            updateProductPriceDe={updateProductPriceDetail}
            updateProductPriceHeader={updateProductPriceHeader}
          />
        </Modal>
      ) : null}

      {/* Filter Modal */}
      <Modal
        title="Lọc chi tiết giá"
        isOpen={isFilterModalOpen}
        onClose={closeFilterModal}
        width={600}
        height={700}
      >
        <div className="filter-modal-content">
          <div className="filter-item">
            <label>Mã hàng:</label>
            <input
              type="text"
              name="itemCode"
              value={filters.itemCode}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-item">
            <label>Loại sản phẩm:</label>
            <Select
              value={filters.category}
              onChange={(value) => handleDropdownChange("category", value)}
              options={categories.map((categorie) => ({
                value: categorie._id,
                label: categorie.name,
              }))}
              placeholder="Chọn loại sản phẩm"
            />
          </div>
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
            <label>Đơn vị tính</label>
            <Select
              value={filters.unit}
              onChange={(value) => handleDropdownChange("unit", value)}
              options={units.map((unit) => ({
                value: unit._id,
                label: unit.description,
              }))}
              placeholder="Chọn đơn vị tính"
            />
          </div>

          <div className="filter-item">
            <label>Giá tối thiểu:</label>
            <input
              type="number"
              name="minPrice"
              value={filters.minPrice}
              onChange={handleFilterChange}
            />
          </div>

          <div className="filter-item">
            <label>Giá tối đa:</label>
            <input
              type="number"
              name="maxPrice"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
          </div>

          <div className="button-filter">
            <Button
              text="Lọc"
              backgroundColor="#1366D9"
              color="white"
              width="150"
              onClick={applyFilters}
            />
            <Button
              text="Huỷ lọc"
              backgroundColor="#FF0000"
              color="white"
              width="150"
              onClick={resetFilters}
            />
          </div>
        </div>
      </Modal>
    </div>
  );
}
