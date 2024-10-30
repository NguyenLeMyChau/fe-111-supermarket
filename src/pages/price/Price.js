import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FrameData from '../../containers/frameData/FrameData';
import { formatDate } from '../../utils/fotmatDate';
import { IoIosCheckmarkCircleOutline } from 'react-icons/io';
import { MdCopyAll, MdDelete, MdDoDisturbOn, MdDoNotDisturbAlt, MdDoNotDisturbOff } from 'react-icons/md';
import { CiEdit } from 'react-icons/ci';
import Modal from '../../components/modal/Modal';
import AddProductPrice from './AddPrice';
import EditProductPrice from './UpdatePrice';
import { useLocation, useNavigate } from 'react-router';
import PriceDetail from './PriceDetail';
import { format } from 'date-fns';
import { deleteProductPrice, getAllPriceDetail } from '../../services/priceRequest';
import { useAccessToken, useAxiosJWT } from '../../utils/axiosInstance';
import ClipLoader from 'react-spinners/ClipLoader';

export default function Price() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const axiosJWT = useAxiosJWT();
  const accessToken = useAccessToken();
  const isPriceDetail = location.pathname.includes('price-detail');
  const prices = useSelector((state) => state.price?.prices) || [];
  const [currentHeader, selectCurrentHeader] = useState({});
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isOpenNewPrice, setIsOpenNewPrice] = useState(false);
  const [isOpenCopyPrice, setIsOpenCopyPrice] = useState(false);
  const [loading, setLoading] = useState(false); // Trạng thái loading

  const typeMapping = {
    'active': 'Hoạt động',
    'pauseactive': 'Ngưng hoạt động',
    'inactive': 'Không hoạt động',
  };

 const handleEditClick = (event, productPriceHeader) => {
    event.stopPropagation(); 
    selectCurrentHeader(productPriceHeader);
    setIsEditModalOpen(true);
};
const handleCloseEditModal  = () => {
  setIsEditModalOpen(false);
};

const handleDeleteClick = async (event, productPriceHeader) => {
  event.stopPropagation();

  if(productPriceHeader.status!=="inactive") return;
  const confirmDelete = window.confirm("Có chắn chắn xóa giá sản phẩm");
  if (!confirmDelete) return; // Exit if user cancels
  setLoading(true)
    const deletedPriceHeader = await deleteProductPrice(accessToken, axiosJWT, dispatch, productPriceHeader._id);
    setLoading(false)
    if(deletedPriceHeader) 
      alert(deletedPriceHeader.message)
    else alert(deletedPriceHeader.message)
 
};

const handleCopyPrice = async (event, productPriceHeader) => {
  event.stopPropagation(); 
  selectCurrentHeader(productPriceHeader);
  setIsOpenCopyPrice(true);
};
const handleRowClickDetail = async (productPriceHeader) => {
  setLoading(true)
  const productPriceHeader2 = await getAllPriceDetail(accessToken, axiosJWT, dispatch);
  const updatedProductPriceHeader = productPriceHeader2.find(
    (item) => item._id === productPriceHeader._id
  );
  const productDetail = Array.isArray(updatedProductPriceHeader.productPrices) ? updatedProductPriceHeader.productPrices : [];
  setLoading(false)
  navigate('/admin/price/price-detail', { state: { productPriceHeader, productDetail } });
};


 const productPriceHeader = [
   { title: 'Mã bảng giá', dataIndex: 'productPriceHeaderId', key: 'id', width: '15%', },
    { title: 'Mô tả', dataIndex: 'description', key: 'description', width: '15%', },
    {
      title: 'Ngày bắt đầu',
      dataIndex: 'startDate',
      key: 'startDate',
      width: '15%',
      className: 'text-center',
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
      width: '15%',
      className: 'text-left',
      render: (status) => (
        <>
          {status==='pauseactive' && <MdDoDisturbOn style={{ color: 'yellow',marginRight:5 }} size={15} />}
          {status==='active' && <IoIosCheckmarkCircleOutline style={{ color: 'green',marginRight:5 }} size={15} />}
          {status==='inactive' && <MdDoNotDisturbAlt style={{ color: 'red',marginRight:5 }} size={15} />}
          {typeMapping[status]}
        </>
      ),
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
  },{
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
      ) :(handleDeleteClick(event, record))}}
      />
    ),
  },{
    title: 'Sao chép',
    key: 'Copy',
    width: '10%',
    className: 'text-center',
    render: (text, record) => (
      <MdCopyAll
        style={{ color: 'Black', cursor: 'pointer' }}
        size={25}
        onClick={(event) => handleCopyPrice(event, record)}
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
       {loading?(
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1 }}>
<ClipLoader size={50} color="#2392D0" loading={loading} /></div>
        ) :null}
{ isOpenNewPrice && (
                <AddProductPrice
                title={'Thêm chương trình giá'}
                    isOpen={isOpenNewPrice}
                    onClose={() => setIsOpenNewPrice(false)}
                />
            )}
{ isOpenCopyPrice && (
                <AddProductPrice
                title={`Sao chép chương trình giá  ${currentHeader.description}`}
                    isOpen={isOpenCopyPrice}
                    onClose={() => setIsOpenCopyPrice(false)}
                    productPriceHeader={currentHeader}
                />
            )}
      {(isEditModalOpen) ? (
    <Modal
        title={`Cập nhật bảng giá`}
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