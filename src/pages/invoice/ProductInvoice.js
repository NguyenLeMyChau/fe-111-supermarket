import Modal from "../../components/modal/Modal";
import FrameData from "../../containers/frameData/FrameData";


export default function ProductInvoice({ isModalOpen, closeModal, products, productColumns }) {
    return (
        <Modal
            title={'Chi tiết đơn hàng khách hàng'}
            isOpen={isModalOpen}
            onClose={closeModal}
            width={'50%'}
        >
            {
                products.length > 0 ? (
                    <FrameData
                        data={products}
                        columns={productColumns}
                    />
                ) : (
                    <p style={{ marginLeft: 30 }}>Không có sản phẩm nào trong danh mục này.</p>
                )
            }
        </Modal>
    );
}
