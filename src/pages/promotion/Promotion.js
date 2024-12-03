import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import { IoIosCheckmarkCircleOutline } from "react-icons/io";
import { MdDelete, MdDoDisturbOn, MdDoNotDisturbAlt } from 'react-icons/md';
import { formatDate } from '../../utils/fotmatDate';
import Modal from '../../components/modal/Modal';
import { CiEdit } from 'react-icons/ci';

import AddPromotionHeader from './AddPromotion';
import AddPromotionLine from './AddPromotionLine';
import AddPromotionDetail from './AddPromotionDetail';
import UpdatePromotionHeader from './UpdatePromotionHeader';
import UpdatePromotionLine from './UpdatePromotionLine';
import UpdatePromotionDetail from './UpdatePromotionDetail';
import FramePromo from './FramPromo';
import ClipLoader from 'react-spinners/ClipLoader';
import { format } from 'date-fns';
import { deletePromotionDetail, deletePromotionHeader, deletePromotionLine } from '../../services/promotionRequest';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import { toast } from 'react-toastify';

export default function Promotion() {
  const dispatch = useDispatch();
  const axiosJWT = useAxiosJWT();
  const accessToken = useAccessToken();
  const promotions = useSelector((state) => state.promotion?.promotions) || [];  
  const [currentHeader, selectCurrentHeader] = useState({});
  const [currentLine, selectCurrentLine] = useState({});
  const [currentDetail, selectCurrentDetail] = useState({});
  const [promotionLine, setPromotionLine] = useState([]);
  const [isModalOpenLine, setIsModalOpenLine] = useState(false);
  const [promotionDetail, setPromotionDetail] = useState([]);
  const [isModalOpenDetail, setIsModalOpenDetail] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isEditModalLineOpen, setIsEditModalLineOpen] = useState(false);
  const [isEditModalDetailOpen, setIsEditModalDetailOpen] = useState(false);
  const [loading, setLoading] = useState(false); // Trạng thái loading
  const [IsOpenNewLine, setIsOpenNewLine] = useState(false);
  const [isOpenNewDetail,setIsOpenNewDetail]= useState(false);
console.log(promotions)
  const typeMapping = {
    'amount': 'Giảm giá sản phẩm',
    'quantity': 'Tặng sản phẩm',
    'percentage': 'Chiết khấu hóa đơn',
    'combo': 'Combo',
  };

  const handleEditClick = (event, promotionHeader) => {
    event.stopPropagation();
  
    // Check if the endDate is before the current date
    const currentDate = new Date();
    const endDate = new Date(promotionHeader.endDate); // Make sure endDate is in Date format
    if (endDate < currentDate) {
      toast.warning("Không thể chỉnh sửa chương trình khuyến mãi vì ngày kết thúc đã qua.");
      return; // Exit if the end date has passed
    }
  
    // Proceed with editing if the endDate is valid
    selectCurrentHeader(promotionHeader);
    setIsEditModalOpen(true);
  };
  
const handleCloseEditModal = () => {
  setIsEditModalOpen(false);
  selectCurrentHeader(null);
};

const handleEditClickLine = (event, promotionLine) => {
  event.stopPropagation(); 
  const currentDate = new Date();
  const endDate = new Date(promotionLine.endDate); // Make sure endDate is in Date format
  if (endDate < currentDate) {
    toast.warning("Không thể chỉnh sửa chương trình khuyến mãi vì ngày kết thúc đã qua.");
    return; // Exit if the end date has passed
  }
  
  
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
const handleCloseAddModalLine = () => {
  setIsOpenNewLine(false);
};

const handleDeleteClick = async (event, promotionLine) => {
  event.stopPropagation();
  if(promotionLine.status!=="inactive") return;
  const currentDate = new Date();
  const endDate = new Date(promotionLine.endDate); // Make sure endDate is in Date format
  if (endDate < currentDate) {
    toast.warning("Không thể xóa chương trình khuyến mãi vì ngày kết thúc đã qua.");
    return; // Exit if the end date has passed
  }
  const confirmDelete = window.confirm("Có chắn chắn xóa");
  if (!confirmDelete) return; // Exit if user cancels
  setLoading(true)
    const deleteHeader = await deletePromotionLine(promotionLine._id, accessToken, dispatch, axiosJWT);
    setLoading(false)
    if(deleteHeader) 
      toast.success(deleteHeader.message)
    else toast.error(deleteHeader.message)
};
const handleDeleteClickHeader = async (event, promotionHeader) => {
  event.stopPropagation();

  // Check if the endDate is before the current date
  const currentDate = new Date();
  const endDate = new Date(promotionHeader.endDate); // Make sure endDate is in Date format
  if (endDate < currentDate) {
    toast.warning("Không thể xóa chương trình khuyến mãi vì ngày kết thúc đã qua.");
    return; // Exit if the end date has passed
  }

  const confirmDelete = window.confirm("Có chắn chắn xóa?");
  if (!confirmDelete) return; // Exit if user cancels

  setLoading(true);

  try {
    // Call the delete function and pass the required parameters
    const deleteHeader = await deletePromotionHeader(promotionHeader._id, accessToken, dispatch, axiosJWT);

    // Handle response
    setLoading(false);
    toast.success(deleteHeader.message);

  } catch (error) {
    setLoading(false);
    toast.error("Đã có lỗi xảy ra khi xóa chương trình khuyến mãi.");
  }
};

const handleDeleteClickDetail = async (event, promotionDetail) => {
  event.stopPropagation();
  if(currentLine.status!=="inactive") return;
   const confirmDelete = window.confirm("Có chắn chắn xóa");
   if (!confirmDelete) return; // Exit if user cancels
   
   setLoading(true)
     const deleteHeader = await deletePromotionDetail(promotionDetail._id, accessToken, dispatch, axiosJWT);
     console.log(deleteHeader)
     setLoading(false)
     if(deleteHeader) 
      toast.success(deleteHeader.message)
     else toast.error(deleteHeader.message)
};
  const promotionHeaderColumn = [
    { title: 'Mã khuyến mãi', dataIndex: 'promotionHeaderId', key: 'promotionHeaderId', width: '20%', },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '20%', },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      width: '20%',
      className: 'text-center',
      render: (date) =>format(new Date(date), 'dd-MM-yyyy')
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      width: '20%',
      className: 'text-center',
      render: (date) =>format(new Date(date), 'dd-MM-yyyy')
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
  },
  {
    title: 'Xóa',
    key: 'delete',
    width: '8%',
    className: 'text-center',
    render: (text, record) => (
      <MdDelete
        style={{ color: 'Black', cursor: 'pointer' }}
        size={25}
        onClick={(event) =>   {loading ? (
          <ClipLoader size={30} color="#2392D0" loading={loading} />
      ) :(handleDeleteClickHeader(event, record))}}
      />
    ),
  }
];

  const promotionLineColumn = [
    { title: 'Mã dòng', dataIndex: 'promotionLineId', key: 'promotionLineId', width: '15%', },
    { title: 'Loại khuyến mãi', dataIndex: 'type', key: 'type', width: '15%', className: 'text-left',render: (text) => typeMapping[text] || text, },

    { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '18%' },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      className: 'text-center',
      width: '15%',

      render: (date) =>format(new Date(date), 'dd-MM-yyyy')
    },
    {
      title: 'Ngày kết thúc',
      dataIndex: 'endDate',
      key: 'endDate',
      width: '15%',
      className: 'text-center',
      render: (date) =>format(new Date(date), 'dd-MM-yyyy')
    },
    {
      title: 'Hoạt động',
      dataIndex: 'status',
      key: 'status',
      width: '12%',
      className: 'text-center',
      render: (status) => (
        <>
          
          {status==='active' && <IoIosCheckmarkCircleOutline style={{ color: 'green',marginRight:5 }} size={15} />}
          {status==='inactive' && <MdDoNotDisturbAlt style={{ color: 'red',marginRight:5 }} size={15} />}

        </>
      ),
    }, {
      title: 'Chỉnh sửa',
      key: 'edit',
      width: '12%',
      className: 'text-center',
      render: (text, record) => (
          <CiEdit
              style={{ color: 'blue', cursor: 'pointer' }}
              size={25}
              onClick={(event) => handleEditClickLine(event, record)}
          />
      ),
    },{
      title: 'Xóa',
      key: 'delete',
      width: '8%',
      className: 'text-center',
      render: (text, record) => (
        <MdDelete
          style={{ color: 'Black', cursor: 'pointer' }}
          size={25}
          onClick={(event) =>   {loading ? (
            <ClipLoader size={30} color="#2392D0" loading={loading} />
        ) :(handleDeleteClick(event, record))}}
        />
      ),
    }];

  const promotionDetailColumnAmount = [
    { title: 'Mã chi tiết', dataIndex: 'promotionDetailId', key: 'promotionDetailId', width: '20%' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '20%' },
    { title: 'Tên sản phẩm', dataIndex: 'product', key: 'product', width: '15%', render: (product) => product?.name },
    {
      title: "Đơn vị",
      dataIndex: "unit_id",
      key: "unit_id",
      width: "10%",
      render: (unit_id) => unit_id?.description,
    },
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
  },{
    title: 'Xóa',
    key: 'delete',
    width: '8%',
    className: 'text-center',
    render: (text, record) => (
      <MdDelete
        style={{ color: 'Black', cursor: 'pointer' }}
        size={25}
        onClick={(event) =>   {loading ? (
          <ClipLoader size={30} color="#2392D0" loading={loading} />
      ) :(handleDeleteClickDetail(event, record))}}
      />
    ),
  }
  ];
  const promotionDetailColumnQuantity = [
    { title: 'Mã chi tiết', dataIndex: 'promotionDetailId', key: 'promotionDetailId', width: '15%' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '15%' },
    { title: 'Tên sản phẩm', dataIndex: 'product', key: 'product', width: '20%', render: (product) => product?.name },
    {
      title: "Đơn vị",
      dataIndex: "unit_id",
      key: "unit_id",
      width: "10%",
      render: (unit_id) => unit_id?.description,
    },
    { title: 'Số lượng', dataIndex: 'quantity', key: 'quantity', width: '10%', className: 'text-center' },
    { title: 'Sản phẩm tặng', dataIndex: 'product_donate', key: 'product_donate', width: '20%', render: (product_donate) => product_donate?.name },
    {
      title: "Đơn vị",
      dataIndex: "unit_id_donate",
      key: "unit_id_donate",
      width: "10%",
      render: (unit_id_donate) => unit_id_donate?.description,
    },
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
  },,{
    title: 'Xóa',
    key: 'delete',
    width: '8%',
    className: 'text-center',
    render: (text, record) => (
      <MdDelete
        style={{ color: 'Black', cursor: 'pointer' }}
        size={25}
        onClick={(event) =>   {loading ? (
          <ClipLoader size={30} color="#2392D0" loading={loading} />
      ) :(handleDeleteClickDetail(event, record))}}
      />
    ),
  }
  ];
  const promotionDetailColumnPer = [
    { title: 'Mã chi tiết', dataIndex: 'promotionDetailId', key: 'promotionDetailId', width: '20%' },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '20%' },
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
  },,{
    title: 'Xóa',
    key: 'delete',
    width: '5%',
    className: 'text-center',
    render: (text, record) => (
      <MdDelete
        style={{ color: 'Black', cursor: 'pointer' }}
        size={25}
        onClick={(event) =>   {loading ? (
          <ClipLoader size={30} color="#2392D0" loading={loading} />
      ) :(handleDeleteClickDetail(event, record))}}
      />
    ),
  }
  ];

  // const handleRowClickLine = (promotionHeader) => {
  //   const promotionLine = Array.isArray(promotionHeader.lines) ? promotionHeader.lines : [];
  //   setPromotionLine(promotionLine);
  //   setIsModalOpenLine(true);
  //   selectCurrentHeader(promotionHeader);
  // };
  
  const closeModalLine = () => {
    setIsOpenNewLine(false);
  };
  const handleAddDetail=()=>{
    // Check if the endDate is before the current date
  const currentDate = new Date();
  const endDate = new Date(currentLine.endDate); // Make sure endDate is in Date format
  if (endDate < currentDate) {
    toast.info("Chương trình đã kết thúc");
    return; // Exit if the end date has passed
  }
    setIsOpenNewDetail(true)
    
  }
  const handleAddLine=(item)=>{
    // Check if the endDate is before the current date
  const currentDate = new Date();
  const endDate = new Date(item.endDate); // Make sure endDate is in Date format
  if (endDate < currentDate) {
    toast.info("Chương trình đã kết thúc");
    return; // Exit if the end date has passed
  }
    selectCurrentHeader(item);
    setIsOpenNewLine(true)
  }
  const onChangeDetail = (item)=> {
    console.log(item)
    setIsModalOpenDetail(false);
    const promotionH = Array.isArray(item) ? item : [];
    console.log(promotionH)
    if(promotionH)
    {
      const promotionL =  Array.isArray(promotionH.lines) ? promotionH.lines : [];
      if(promotionL) {
        const promotionDetail = Array.isArray(currentLine.details) ? currentLine.details : [];
        console.log(promotionDetail)
        if(promotionDetail)
          setPromotionDetail(promotionDetail)
      }
    }
    setIsModalOpenDetail(true);
  }
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
      <FramePromo
        title="Khuyến mãi"
        buttonText="Thêm chương trình khuyến mãi"
        data={promotions}
        columns={promotionHeaderColumn}
        onRowClick={handleRowClickDetail}
        columnLine={promotionLineColumn}
        onAddLine={handleAddLine}
        renderModal={(onClose) => (
          <AddPromotionHeader
            isOpen={true}
            onClose={onClose}
          />
        )}
      />

      <Modal
        title={'Chi tiết khuyến mãi'}
        isOpen={isModalOpenLine}
        onClose={closeModalLine}
      >


        { <FrameData
          data={promotionLine}
          columns={promotionLineColumn}
          buttonText={'Thêm loại khuyến mãi'}
          onRowClick={handleRowClickDetail}
         
          renderModal={(onClose, data) => (
            <AddPromotionLine
              isOpen={true}
              onClose={onClose}
              promotionHeader={currentHeader}
            />
          )}
        /> }

      </Modal>

      <Modal
        title={'Chi tiết khuyến mãi'}
        isOpen={isModalOpenDetail}
        onClose={closeModalDetail}
      >

        <FrameData
          data={promotionDetail}
          buttonText="Thêm chi tiết khuyến mãi"
          columns={
            currentLine.type === 'quantity'
              ? promotionDetailColumnQuantity
              : currentLine.type === 'amount'
              ? promotionDetailColumnAmount
              : promotionDetailColumnPer
          }          itemsPerPage={8}
          onButtonClick={handleAddDetail}
          // renderModal={(onClose) => (
          //   <AddPromotionDetail
          //     isOpen={true}
          //     onClose={onClose}
          //     promotionLine={currentLine}
          //   />
          // )}
        />
      </Modal>

      {isOpenNewDetail && currentLine.status === "inactive" && (<AddPromotionDetail
                  isOpen={isOpenNewDetail}
                  onClose={() => setIsOpenNewDetail(false)}       
                  promotionLine={currentLine}
                />)}

      {IsOpenNewLine && (
         <AddPromotionLine
          isOpen={IsOpenNewLine}
          onClose={handleCloseAddModalLine}
          promotionHeader={currentHeader}
       />
      )}
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
                title={`Cập nhật dòng`}
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
                        onChangeDetail={onChangeDetail}
                    />
                </Modal>
            )}
    </div>


  );
}