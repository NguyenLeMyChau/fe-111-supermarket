export const calculateDiscount = (item) => {
    if (item.promotion) {
      const discountQuantity = Math.floor(
        item.quantity / (item.promotion.quantity + item.promotion.quantity_donate)
      );
      const quantity= item.quantity - discountQuantity;
      const discountedPrice = discountQuantity * item.price;
      return {
        quantity,
        discountedPrice,
        discountQuantity,
        price: item.price
      };
    }
    return {quantity:0, discountedPrice: 0, discountQuantity: 0 , price: 0};
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