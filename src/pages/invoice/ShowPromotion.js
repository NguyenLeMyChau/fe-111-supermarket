import React from "react";
import { useSelector } from "react-redux";
import { formatCurrency } from "../../utils/fotmatDate";

export default function ShowPromotion({ promotion }) {
    const products = useSelector(state => state.product?.products);

    if (!promotion) return '';

    const { type, promotionDetail } = promotion;

    switch (type) {
        case 'amount':
            return (
                <p>
                    Mua {promotionDetail?.quantity} giảm {formatCurrency(promotionDetail?.amount_donate)}
                </p>
            );
        case 'quantity':
            return (
                <div>
                    <span>
                        Mua {promotionDetail?.quantity} {promotionDetail?.productBuy?.unit_id?.description} {promotionDetail?.productBuy?.name}
                    </span>
                    <br />
                    <span>
                        Tặng {promotionDetail?.quantity_donate} {promotionDetail?.productDonate?.unit_id?.description} {promotionDetail?.productDonate?.name}
                    </span>
                </div>
            );
        // Thêm các loại khuyến mãi khác nếu cần
        default:
            return <p>Không có khuyến mãi hợp lệ</p>;
    }
}
