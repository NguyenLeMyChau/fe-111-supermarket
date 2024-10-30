// import { useNavigate } from "react-router";
// import Button from "../../components/button/Button";
import Modal from "../../components/modal/Modal";
import FrameData from "../../containers/frameData/FrameData";

export default function ProductWarehouse({ isModalOpen, closeModal, products, productColumns }) {
    // const navigate = useNavigate();

    // const handleOrderClick = (product) => {
    //     navigate('/admin/order/add-order', { state: { selectedProduct: product } });
    // };

    return (
        <Modal
            title={'Giao dịch sản phẩm'}
            isOpen={isModalOpen}
            onClose={closeModal}
        >
            {
                products ? (
                    <>
                        <FrameData
                            data={products}
                            columns={productColumns}
                        />

                    </>
                ) : (
                    <p style={{ marginLeft: 30 }}>Không có sản phẩm nào trong danh mục này.</p>
                )
            }
        </Modal>
    );
}
