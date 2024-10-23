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
import { useLocation, useNavigate } from 'react-router';
import PriceDetail from './PriceDetail';

export default function Price() {
  const navigate = useNavigate();
  const location = useLocation();
  const isPriceDetail = location.pathname.includes('price-detail');
  const prices = useSelector((state) => state.price?.prices) || [];
  const [currentHeader, selectCurrentHeader] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOpenNewPrice, setIsOpenNewPrice] = useState(false);

 const handleEditClick = (event, productPriceHeader) => {
    event.stopPropagation(); 
    selectCurrentHeader(productPriceHeader);
    setIsEditModalOpen(true);
};
const handleCloseEditModal  = () => {
  setIsEditModalOpen(false);
};


const handleRowClickDetail = (productPriceHeader) => {
  
    const productDetail = Array.isArray(productPriceHeader.productPrices) ? productPriceHeader.productPrices : [];
    navigate('/admin/price/price-detail', { state: { productPriceHeader,productDetail } });
  };

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

  return (
    <div>
      {isPriceDetail?<PriceDetail/>:
      <>
      <FrameData
        title="Chương trình giá"
        buttonText="Thêm chương trình giá"
        data={prices}
        columns={productPriceHeader}
        onRowClick={handleRowClickDetail}
        onButtonClick={() => setIsOpenNewPrice(true)}
      />

{ isOpenNewPrice && (
                <AddProductPrice
                    isOpen={isOpenNewPrice}
                    onClose={() => setIsOpenNewPrice(false)}
                />
            )}


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
</>
}
             
    </div>


  );
}