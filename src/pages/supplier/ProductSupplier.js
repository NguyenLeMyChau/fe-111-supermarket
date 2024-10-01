import Modal from "../../components/modal/Modal";
import FrameData from "../../containers/frameData/FrameData";


export default function ProductSupplier({ isModalOpen, closeModal, products, productColumns }) {
    return (
        <Modal
            title={'Sản phẩm trong danh mục'}
            isOpen={isModalOpen}
            onClose={closeModal}
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
