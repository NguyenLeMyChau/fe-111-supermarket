import React, { useState } from "react";
import FrameData from "../../containers/frameData/FrameData";
import AddProductPriceDetail from "./AddPriceDetail";
import { CiEdit } from "react-icons/ci";
import Modal from "../../components/modal/Modal";
import UpdatePriceDetail from "./UpdatePriceDetail";
import { useLocation } from "react-router";
import Button from "../../components/button/Button";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { deleteProductPriceDetail } from "../../services/priceRequest";
import { MdDelete } from "react-icons/md";
import { useAccessToken, useAxiosJWT } from "../../utils/axiosInstance";
import ClipLoader from "react-spinners/ClipLoader";
import { toast } from "react-toastify";
import { formatCurrency } from "../../utils/fotmatDate";


export default function PriceDetail() {
  const dispatch = useDispatch();
  const axiosJWT = useAxiosJWT();
  const accessToken = useAccessToken();
  const location = useLocation();
  const categories = useSelector((state) => state.category?.categories) || [];
  const { productPriceHeader, productDetail } = location.state || {};
  const [currentDetail, selectCurrentDetail] = useState({});
  const [isEditModalDetailOpen, setIsEditModalDetailOpen] = useState(false);
  const [isOpenNewPrice, setIsOpenNewPrice] = useState(false);
  const [loading, setLoading] = useState(false);

  // Filter state
  const [filters, setFilters] = useState({
    item_code: [],
    productName: [],
    category: [],
  });
  console.log(productDetail, productPriceHeader)


  const handleDeleteClick = async (event, productPriceHeader) => {
    event.stopPropagation();
    if (filteredProductHeader?.status !== "inactive") return
    const confirmDelete = window.confirm("Có chắn chắn xóa giá sản phẩm");
    if (!confirmDelete) return; // Exit if user cancels
    setLoading(true)

    const deletedPriceDetail = await deleteProductPriceDetail(accessToken, axiosJWT, dispatch, productPriceHeader._id);
    if (deletedPriceDetail) {
      setLoading(false)
      toast.success(deletedPriceDetail.message)
      const updatedProductPriceHeader = deletedPriceDetail.allProductPrices?.find(
        (item) => item._id === productPriceHeader.productPriceHeader_id
      );
      if (updatedProductPriceHeader) {
        setLoading(false)
        const productDetail = updatedProductPriceHeader.productPrices || [];
        updateProductPriceHeader(updatedProductPriceHeader)
        updateProductPriceDetail(productDetail)
      }
    }

    else {
      setLoading(false)
      toast.error(deletedPriceDetail.message)
    }

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
      sortable: true,
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
      sortable: true,
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
      sortable: true,
      render: (text) => (
        <p>{formatCurrency(text)}</p>
      )
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
    }, {
      title: 'Xóa',
      key: 'delete',
      width: '5%',
      className: 'text-center',
      render: (text, record) => (
        loading ? (
          <ClipLoader size={25} color="#2392D0" loading={loading} />
        ) : (
          <MdDelete
            style={{ color: 'red', cursor: 'pointer' }}
            size={25}
            onClick={(event) => handleDeleteClick(event, record)}
          />
        )
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

  const handleDropdownChange = (name, selectedOptions) => {
    const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: values,
    }));
  };

  const applyFilters = () => {
    let filteredData = productDetail;

    if (filters.productName.length > 0) {
      filteredData = filteredData.filter((detail) =>
        filters.productName.includes(detail.product?.name)
      );
    }

    if (filters.category.length > 0) {
      filteredData = filteredData.filter((detail) =>
        filters.category.includes(detail.product?.category_id.name)
      );
    }

    if (filters.item_code.length > 0) {
      filteredData = filteredData.filter((detail) =>
        filters.item_code.includes(detail.item_code)
      );
    }

    setFilteredProductDetails(filteredData);
  };


  const resetFilters = () => {
    setFilters({
      item_code: [],
      productName: [],
      category: [],
    });
    setFilteredProductDetails(productDetail);
  };

  // Option lists for the dropdowns
  const productNameOptions = Array.from(
    new Set(productDetail.map((detail) => detail.product?.name))
  ).map((name) => ({
    value: name,
    label: name,
  }));

  const itemCodeOptions = Array.from(
    new Set(productDetail.map((detail) => detail.item_code))
  ).map((itemCode) => ({
    value: itemCode,
    label: itemCode,
  }));
  const categoryOptions = categories.map((category) => ({
    value: category.name,
    label: category.name,
  }));


  return (
    <>
      <div className="filter-statistical" style={{ marginBottom: 20 }}>
        <div className='filter-row'>
          <div className="filter-item">
            <label>Mã sản phẩm</label>
            <Select
              options={itemCodeOptions}
              placeholder="Mã sản phẩm"
              onChange={(selectedOptions) => handleDropdownChange("item_code", selectedOptions)}
              value={filters.item_code.map(code => ({ value: code, label: code }))}
              isMulti
              styles={{
                container: (provided) => ({
                  ...provided,
                  width: '200px',
                  zIndex: 1000,
                }),
              }}
            />
          </div>
          <div className="filter-item">
            <label>Tên sản phẩm</label>
            <Select
              options={productNameOptions}
              placeholder="Tên sản phẩm"
              onChange={(selectedOptions) => handleDropdownChange("productName", selectedOptions)}
              value={filters.productName.map(name => ({ value: name, label: name }))}
              isMulti
              styles={{
                container: (provided) => ({
                  ...provided,
                  width: '500px',
                  zIndex: 1000,
                }),
              }}
            />
          </div>
          <div className="filter-item">
            <label>Loại sản phẩm</label>
            <Select
              options={categoryOptions}
              placeholder="Loại sản phẩm"
              onChange={(selectedOptions) => handleDropdownChange("category", selectedOptions)}
              value={filters.category.map(category => ({ value: category, label: category }))}
              isMulti
              styles={{
                container: (provided) => ({
                  ...provided,
                  width: '200px',
                  zIndex: 1000,
                }),
              }}
            />
          </div>
          <div className='button-filter'>
            <Button
              text='Lọc'
              backgroundColor='#1366D9'
              color='white'
              width='100'
              onClick={applyFilters}
            />
            <Button
              text='Huỷ lọc'
              backgroundColor='#FF0000'
              color='white'
              width='100'
              onClick={resetFilters}
            />
          </div>

        </div>
      </div>


      <FrameData
        title={`Chi tiết : ${filteredProductHeader.description}`}
        data={filteredProductDetails}
        buttonText="Thêm giá sản phẩm"
        columns={productDetailColumn}
        itemsPerPage={8}
        showGoBack={true}
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
      {
        isOpenNewPrice && filteredProductHeader?.status === "inactive" ? (<AddProductPriceDetail
          isOpen={isOpenNewPrice}
          onClose={() => setIsOpenNewPrice(false)}
          productPriceHeader={filteredProductHeader}
          updateProductPriceDetail={updateProductPriceDetail}
          updateProductPriceHeader={updateProductPriceHeader}

        />) : null
      }
      {
        isEditModalDetailOpen && filteredProductHeader?.status === "inactive" ? (
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
        ) : null
      }
    </>
  );
}
