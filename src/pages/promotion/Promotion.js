import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdDoNotDisturbAlt } from 'react-icons/md';
import { formatDate } from '../../utils/fotmatDate';
import Modal from '../../components/modal/Modal';

import AddPromotionHeader from './AddPromotion';
import AddPromotionLine from './AddPromotionLine';
import AddPromotionDetail from './AddPromotionDetail';

export default function Promotion() {
  const promotions = useSelector((state) => state.promotion?.promotions) || [];
  const [currentHeader, selectCurrentHeader] = useState({});
  const [currentLine, selectCurrentLine] = useState({});

  const [promotionLine, setPromotionLine] = useState([]);
  const [isModalOpenLine, setIsModalOpenLine] = useState(false);

  const [promotionDetail, setPromotionDetail] = useState([]);
  const [isModalOpenDetail, setIsModalOpenDetail] = useState(false);

  const promotionHeaderColumn = [
    { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '40%' },
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
    },];

  const promotionLineColumn = [
    { title: 'Loại khuyến mãi', dataIndex: 'type', key: 'type', width: '15%' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '30%' },
    {
      title: 'Số lượng sản phẩm',
      dataIndex: 'details',
      key: 'details',
      width: '10%',
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
    },];

  const promotionDetailColumn = [
    { title: 'Số tiền bán', dataIndex: 'amount_sales', key: 'amount_sales', width: '10%', className: 'text-center' },
    { title: 'Phần trăm khuyến mãi', dataIndex: 'percent', key: 'percent', width: '10%', className: 'text-center' },
    { title: 'Tôi đa', dataIndex: 'amount_limit', key: 'amount_limit', width: '10%', className: 'text-center' },
    { title: 'Số tiền tặng', dataIndex: 'amount_donate', key: 'amount_donate', width: '10%', className: 'text-center' },
    { title: 'Tên sản phẩm', dataIndex: 'product', key: 'product', width: '15%', render: (product) => product?.name },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', width: '10%', className: 'text-center' },
    { title: 'Sản phẩm tặng', dataIndex: 'product', key: 'product_donate', width: '15%', render: (product) => product?.name },
    { title: 'Số lượng tặng', dataIndex: 'quantity_donate', key: 'quantity_donate', width: '10%', className: 'text-center' },
    
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
          columns={promotionDetailColumn}
          itemsPerPage={8}
          renderModal={(onClose) => (
            <AddPromotionDetail
              isOpen={true}
              onClose={onClose}
              promotionLine={currentLine}
            />
          )}
        />
      </Modal>
    </div>


  );
}