import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import { formatDate } from '../../utils/fotmatDate';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { MdDoNotDisturbAlt } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import Modal from '../../components/modal/Modal';
import AddPromotionDetail from '../promotion/AddPromotionDetail';
import AddPromotionHeader from '../promotion/AddPromotion';

export default function Promotion() {
  const prices = useSelector((state) => state.price?.prices) || [];
  const [currentHeader, selectCurrentHeader] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [productPriceDetail,setProductPriceDetail] = useState([]);
  const [isModalOpenDetail, setIsModalOpenDetail] = useState(false);

 console.log(prices)


 const handleEditClick = (event, productPriceHeader) => {
    event.stopPropagation(); 
    selectCurrentHeader(productPriceHeader);
    setIsEditModalOpen(true);
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
      // render: (date) => formatDate(date)
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      width: '15%',
      className: 'text-center',
      // render: (date) => formatDate(date)
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
              onClick={(event) => handleEditClick(event, record)}
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
          <AddPromotionHeader
            isOpen={true}
            onClose={onClose}
          />
        )}
      />
       <Modal
        title={'Chi tiết khuyến mãi'}
        isOpen={isModalOpenDetail}
        onClose={closeModalDetail}
      >

        <FrameData
          data={productPriceDetail}
          buttonText="Thêm giá sản phẩm"
          columns={productDetailColumn }       
            itemsPerPage={8}
          renderModal={(onClose) => (
            <AddPromotionDetail
              isOpen={true}
              onClose={onClose}
              
            />
          )}
        />
      </Modal>
    </div>


  );
}