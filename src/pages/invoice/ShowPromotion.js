// PromotionDetail.js
import { useSelector } from "react-redux";
import { formatCurrency } from "../../utils/fotmatDate";

export default function ShowPromotion({ promotion }) {
    const products = useSelector(state => state.product?.products);

    if (!promotion) return '';

    const { type, promotionDetail } = promotion;

    switch (type) {
        case 'amount':
            return (
                <>
                    Mua {promotionDetail.quantity} giảm {formatCurrency(promotionDetail.amount_donate)}
                </>
            );
        case 'quantity':
            return (
                <>
                    Mua {promotionDetail.quantity} tặng {promotionDetail.quantity_donate}
                </>
            );
        // Thêm các loại khuyến mãi khác nếu cần
        default:
            return 'Không có khuyến mãi hợp lệ';
    }
}
