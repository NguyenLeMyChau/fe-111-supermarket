export const calculateDiscount = (item) => {
  const { quantity, promotion } = item;

  if (promotion) {
    const {
      quantity: promoQuantity, // Số lượng mua để được khuyến mãi
      quantity_donate, // Số lượng tặng
      unit_id: promoUnit, // Đơn vị mua
      unit_id_donate: promoUnitDonate, // Đơn vị quà tặng
    } = promotion;

    // Tính số lần áp dụng khuyến mãi
    const fullSets = Math.floor(quantity / promoQuantity); // Số lần đủ khuyến mãi
    const remainingQuantity = quantity % promoQuantity; // Phần lẻ không được khuyến mãi

    // Nếu đơn vị khác nhau
    const isDifferentUnit = promoUnit._id !== promoUnitDonate._id;

    return {
      quantityPaid: quantity, // Tổng số lượng đã mua
      discountQuantity: fullSets * quantity_donate, // Tổng quà tặng
      remainingQuantity, // Số lượng lẻ không áp dụng khuyến mãi
      discountedPrice: isDifferentUnit ? 0 : fullSets * quantity_donate * item.price, // Giá trị khuyến mãi
      note: `Mua ${promoQuantity} ${promoUnit.description}, tặng ${quantity_donate} ${promoUnitDonate.description}`,
    };
  }

  // Không có khuyến mãi
  return {
    quantityPaid: quantity,
    discountQuantity: 0,
    remainingQuantity: 0,
    discountedPrice: 0,
  };
};

 export const calculateDiscountAmount = (item) => {
    if (item.promotion) {
      const discountQuantity = Math.floor(
        item.quantity / item.promotion.quantity
      );
      const discountedPrice = discountQuantity * item.promotion.amount_donate;
      return {
        quantity: item.quantity,
        discountedPrice,
        discountQuantity,
        price: item.promotion.amount_donate
      };
    }
    return {quantity:0, discountedPrice: 0, discountQuantity: 0 ,price: item.promotion.amount_donate};
  };