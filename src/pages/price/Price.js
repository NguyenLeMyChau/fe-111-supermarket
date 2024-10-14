import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import { formatDate } from '../../utils/fotmatDate';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { MdDoNotDisturbAlt } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import Modal from '../../components/modal/Modal';
import AddProductPrice from './AddPrice';
import EditProductPrice from './UpdatePrice';
import AddProductPriceDetail from './AddPriceDetail';
import UpdatePriceDetail from './UpdatePriceDetail';

export default function Promotion() {
  const prices = useSelector((state) => state.price?.prices) || [];
  const [currentHeader, selectCurrentHeader] = useState({});
  const [currentDetail, selectCurrentDetail] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditModalDetailOpen, setIsEditModalDetailOpen] = useState(false);
  const [productPriceDetail,setProductPriceDetail] = useState([]);
  const [isModalOpenDetail, setIsModalOpenDetail] = useState(false);
  

 const handleEditClick = (event, productPriceHeader) => {
    event.stopPropagation(); 
    selectCurrentHeader(productPriceHeader);
    setIsEditModalOpen(true);
};
const handleCloseEditModal  = () => {
  setIsEditModalOpen(false);
};

const handleEditDetailClick = (event, productPriceDetail) => {
  event.stopPropagation(); 
  selectCurrentDetail(productPriceDetail);
  setIsEditModalDetailOpen(true);
};
const handleCloseEditModalDetail  = () => {
  setIsEditModalDetailOpen(false);
};
const handleRowClickDetail = (productPriceHeader) => {
    const productDetail = Array.isArray(productPriceHeader.productPrices) ? productPriceHeader.productPrices : [];
    setProductPriceDetail(productDetail);
    setIsModalOpenDetail(true);
    selectCurrentHeader(productPriceHeader);
  };

  const closeModalDetail = () => {
    setIsModalOpenDetail(false);
  }


 const productPriceHeader = [
    { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '40%', },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      width: '15%',
      className: 'text-center',
      render: (date) => formatDate(date)
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      width: '15%',
      className: 'text-center',
      render: (date) => formatDate(date)
    },
    {
      title: 'Hoạt động',
      dataIndex: 'status',
      key: 'status',
      width: '15%',
      className: 'text-center',
      render: (status) =>
        status==='active'
          ? <IoIosCheckmarkCircleOutline style={{ color: 'green' }} size={20} />
          : <MdDoNotDisturbAlt style={{ color: 'red' }} size={20} />
    },
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
  },];

  const productDetailColumn = [
    { title: 'Tên sản phẩm', dataIndex: 'product', key: 'product', width: '15%', render: (product) => product?.name },
    { title: 'Giá', dataIndex: 'price', key: 'price', width: '10%', className: 'text-center' },
    {
      title: 'Chỉnh sửa',
      key: 'edit',
      width: '10%',
      className: 'text-center',
      render: (text, record) => (
          <CiEdit
              style={{ color: 'blue', cursor: 'pointer' }}
              size={25}
              onClick={(event) => handleEditDetailClick(event, record)}
          />
      ),
  },];

  return (
    <div>
      <FrameData
        title="Chương trình giá"
        buttonText="Thêm chương trình giá"
        data={prices}
        columns={productPriceHeader}
        onRowClick={handleRowClickDetail}
        renderModal={(onClose) => (
          <AddProductPrice
            isOpen={true}
            onClose={onClose}
          />
        )}
      />
       <Modal
        title={'Chi tiết chương trình giá'}
        isOpen={isModalOpenDetail}
        onClose={closeModalDetail}
      >

<FrameData
  data={productPriceDetail}
  buttonText="Thêm giá sản phẩm"
  columns={productDetailColumn}
  itemsPerPage={8}
  renderModal={currentHeader.status === 'inactive' ? (onClose) => (
    <AddProductPriceDetail
      isOpen={true}
      onClose={onClose}
      productPriceHeader={currentHeader}
    />
  ) : null}
/>

      </Modal>
      {(isEditModalOpen) ? (
    <Modal
        title={`Cập nhật ${currentHeader.description}`}
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        width={'30%'}
    >
        <EditProductPrice
            priceId={currentHeader._id}
            initialData={currentHeader}
            onClose={handleCloseEditModal}
        />
    </Modal>
) : null}
             {(isEditModalDetailOpen &&  currentHeader.status === 'inactive')?(
                <Modal
                title={`Cập nhật ${currentDetail.description}`}
                    isOpen={isEditModalDetailOpen}
                    onClose={handleCloseEditModalDetail}
                    width={'30%'}
                >
                    <UpdatePriceDetail
                    priceDetailid={currentDetail._id} 
                    priceDetail={currentDetail}
                    />
                </Modal>
            ):null}
    </div>


  );
}