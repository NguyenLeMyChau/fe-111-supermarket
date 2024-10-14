import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdDoNotDisturbAlt } from 'react-icons/md';
import { formatDate } from '../../utils/fotmatDate';
import Modal from '../../components/modal/Modal';
import { CiEdit } from 'react-icons/ci';

import AddPromotionHeader from './AddPromotion';
import AddPromotionLine from './AddPromotionLine';
import AddPromotionDetail from './AddPromotionDetail';
import UpdatePromotionHeader from './UpdatePromotionHeader';
import UpdatePromotionLine from './UpdatePromotionLine';
import UpdatePromotionDetail from './UpdatePromotionDetail';

export default function Promotion() {
  const promotions = useSelector((state) => state.promotion?.promotions) || [];
  const [currentHeader, selectCurrentHeader] = useState({});
  const [currentLine, selectCurrentLine] = useState({});
  const [currentDetail, selectCurrentDetail] = useState({});
console.log(promotions)
  const [promotionLine, setPromotionLine] = useState([]);
  const [isModalOpenLine, setIsModalOpenLine] = useState(false);

  const [promotionDetail, setPromotionDetail] = useState([]);
  const [isModalOpenDetail, setIsModalOpenDetail] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditModalLineOpen, setIsEditModalLineOpen] = useState(false);
  const [isEditModalDetailOpen, setIsEditModalDetailOpen] = useState(false);

  const typeMapping = {
    'amount': 'Giảm giá',
    'quantity': 'Tặng sản phẩm',
    'percentage': 'Phiếu giảm giá',
    'combo': 'Combo',
  };

  const handleEditClick = (event, promotionHeader) => {
    event.stopPropagation(); 
    selectCurrentHeader(promotionHeader);
    setIsEditModalOpen(true);
};
const handleCloseEditModal = () => {
  setIsEditModalOpen(false);
  selectCurrentHeader(null);
};

const handleEditClickLine = (event, promotionLine) => {
  event.stopPropagation(); 
  selectCurrentLine(promotionLine);
  setIsEditModalLineOpen(true);
};
const handleCloseEditModalLine  = () => {
  setIsEditModalLineOpen(false);
};

const handleEditClickDetail = (event, promotionDetail) => {
  event.stopPropagation(); 
  selectCurrentDetail(promotionDetail);
  setIsEditModalDetailOpen(true);
};
const handleCloseEditModalDetail = () => {
  setIsEditModalDetailOpen(false);
  selectCurrentDetail(null);
};

  const promotionHeaderColumn = [
    { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '40%', },
    {
      title: 'Số lượng line',
      dataIndex: 'lines',
      key: 'lines',
      width: '10%',
      className: 'text-center',
      render: (lines) => (Array.isArray(lines) ? lines.length : 0)
    },
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
      dataIndex: 'isActive',
      key: 'isActive',
      width: '15%',
      className: 'text-center',
      render: (active) =>
        active
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

  const promotionLineColumn = [
    { title: 'Loại khuyến mãi', dataIndex: 'type', key: 'type', width: '15%',render: (text) => typeMapping[text] || text, },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '30%' },
    {
      title: 'Số lượng sản phẩm',
      dataIndex: 'details',
      key: 'details',
      width: '15%',
      className: 'text-center',
      render: (details) => (Array.isArray(details) ? details.length : 0)
    },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      className: 'text-center',
      width: '15%',

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
      dataIndex: 'isActive',
      key: 'isActive',
      width: '10%',
      className: 'text-center',
      render: (active) =>
        active
          ? <IoIosCheckmarkCircleOutline style={{ color: 'green' }} size={20} />
          : <MdDoNotDisturbAlt style={{ color: 'red' }} size={20} />
    }, {
      title: 'Chỉnh sửa',
      key: 'edit',
      width: '10%',
      className: 'text-center',
      render: (text, record) => (
          <CiEdit
              style={{ color: 'blue', cursor: 'pointer' }}
              size={25}
              onClick={(event) => handleEditClickLine(event, record)}
          />
      ),
  },];

  const promotionDetailColumnAmount = [
    { title: 'Tên sản phẩm', dataIndex: 'product', key: 'product', width: '15%', render: (product) => product?.name },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', width: '10%', className: 'text-center' },
    { title: 'Số tiền tặng', dataIndex: 'amount_donate', key: 'amount_donate', width: '10%', className: 'text-center' },
    {
      title: 'Chỉnh sửa',
      key: 'edit',
      width: '10%',
      className: 'text-center',
      render: (text, record) => (
          <CiEdit
              style={{ color: 'blue', cursor: 'pointer' }}
              size={25}
              onClick={(event) => handleEditClickDetail(event, record)}
          />
      ),
  },
  ];
  const promotionDetailColumnQuantity = [
    { title: 'Tên sản phẩm', dataIndex: 'product', key: 'product', width: '15%', render: (product) => product?.name },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', width: '10%', className: 'text-center' },
    { title: 'Sản phẩm tặng', dataIndex: 'product_donate', key: 'product_donate', width: '15%', render: (product) => product?.name },
    { title: 'Số lượng tặng', dataIndex: 'quantity_donate', key: 'quantity_donate', width: '10%', className: 'text-center' },
    {
      title: 'Chỉnh sửa',
      key: 'edit',
      width: '10%',
      className: 'text-center',
      render: (text, record) => (
          <CiEdit
              style={{ color: 'blue', cursor: 'pointer' }}
              size={25}
              onClick={(event) => handleEditClickDetail(event, record)}
          />
      ),
  },
  ];
  const promotionDetailColumnPer = [
    { title: 'Mã khuyến mãi', dataIndex: 'voucher', key: 'amount_donate', width: '15%', className: 'text-center' },
    { title: 'Số tiền bán', dataIndex: 'amount_sales', key: 'amount_sales', width: '10%', className: 'text-center' },
    { title: 'Phần trăm khuyến mãi', dataIndex: 'percent', key: 'percent', width: '10%', className: 'text-center' },
    { title: 'Tôi đa', dataIndex: 'amount_limit', key: 'amount_limit', width: '10%', className: 'text-center' },
    
    {
      title: 'Chỉnh sửa',
      key: 'edit',
      width: '10%',
      className: 'text-center',
      render: (text, record) => (
          <CiEdit
              style={{ color: 'blue', cursor: 'pointer' }}
              size={25}
              onClick={(event) => handleEditClickDetail(event, record)}
          />
      ),
  },
  ];

  const handleRowClickLine = (promotionHeader) => {
    const promotionLine = Array.isArray(promotionHeader.lines) ? promotionHeader.lines : [];
    setPromotionLine(promotionLine);
    setIsModalOpenLine(true);
    selectCurrentHeader(promotionHeader);
  };

  const closeModalLine = () => {
    setIsModalOpenLine(false);
  };

  const handleRowClickDetail = (promotionLine) => {

    const promotionDetail = Array.isArray(promotionLine.details) ? promotionLine.details : [];
    console.log(promotionDetail)
    selectCurrentLine(promotionLine);
    setPromotionDetail(promotionDetail);
    setIsModalOpenDetail(true);
  }

  const closeModalDetail = () => {
    setIsModalOpenDetail(false);
  }

  return (
    <div>
      <FrameData
        title="Khuyến mãi"
        buttonText="Thêm khuyến mãi"
        data={promotions}
        columns={promotionHeaderColumn}
        onRowClick={handleRowClickLine}
        renderModal={(onClose) => (
          <AddPromotionHeader
            isOpen={true}
            onClose={onClose}
          />
        )}
      />

      <Modal
        title={'Sản phẩm trong danh mục'}
        isOpen={isModalOpenLine}
        onClose={closeModalLine}
      >


        <FrameData
          data={promotionLine}
          columns={promotionLineColumn}
          buttonText={'Thêm loại khuyến mãi'}
          onRowClick={handleRowClickDetail}
          itemsPerPage={8}
          renderModal={(onClose, data) => (
            <AddPromotionLine
              isOpen={true}
              onClose={onClose}
              promotionHeader={currentHeader}
            />
          )}
        />

      </Modal>

      <Modal
        title={'Chi tiết khuyến mãi'}
        isOpen={isModalOpenDetail}
        onClose={closeModalDetail}
      >

        <FrameData
          data={promotionDetail}
          buttonText="Thêm khuyến mãi"
          columns={
            currentLine.type === 'quantity'
              ? promotionDetailColumnQuantity
              : currentLine.type === 'amount'
              ? promotionDetailColumnAmount
              : promotionDetailColumnPer
          }          itemsPerPage={8}
          renderModal={(onClose) => (
            <AddPromotionDetail
              isOpen={true}
              onClose={onClose}
              promotionLine={currentLine}
            />
          )}
        />
      </Modal>
      {isEditModalOpen && (
                <Modal
                title={`Cập nhật ${currentHeader.description}`}
                    isOpen={isEditModalOpen}
                    onClose={handleCloseEditModal}
                    width={'30%'}
                >
                    <UpdatePromotionHeader
                        promotionHeader={currentHeader}
                        onClose={handleCloseEditModal}
                    />
                </Modal>
            )}
             {isEditModalLineOpen && (
                <Modal
                title={`Cập nhật ${currentHeader.description}`}
                    isOpen={isEditModalLineOpen}
                    onClose={handleCloseEditModalLine}
                    width={'30%'}
                >
                    <UpdatePromotionLine
                        promotionLine={currentLine}
                        promotionHeader={currentHeader}
                        onClose={handleCloseEditModalLine}
                    />
                </Modal>
            )}
             {isEditModalDetailOpen && (
                <Modal
                title={`Cập nhật chương trình khuyến mãi`}
                    isOpen={isEditModalDetailOpen}
                    onClose={handleCloseEditModalDetail}
                    width={'30%'}
                >
                    <UpdatePromotionDetail
                        promotionLine={currentLine}
                        promotionDetail={currentDetail}
                        onClose={handleCloseEditModalDetail}
                    />
                </Modal>
            )}
    </div>


  );
}