export const validateEmployeeData = (employeeData) => {
  let errors = {};

  if (!employeeData.name.trim()) {
    errors.name = "Tên không được để trống";
  }
  if (!employeeData.phone.trim()) {
    errors.phone = "Số điện thoại không được để trống";
  }
  if (!employeeData.email.trim()) {
    errors.email = "Email không được để trống";
  }
  if (!employeeData.address.street.trim()) {
    errors.address = "Số nhà tên đường không được để trống";
  }
  if (!employeeData.address.ward.trim()) {
    errors.address = "Phường/xã không được để trống";
  }
  if (!employeeData.address.district.trim()) {
    errors.address = "Quận/huyện không được để trống";
  }
  if (!employeeData.address.city.trim()) {
    errors.address = "Tỉnh/thành phố không được để trống";
  }

  return errors;
};

export const validateCustomerData = (employeeData) => {
  let errors = {};

  if (!employeeData.name.trim()) {
    errors.name = "Tên không được để trống";
  }
  if (!employeeData.phone.trim()) {
    errors.phone = "Số điện thoại không được để trống";
  }
  return errors;
};

export const validateSupplierData = (supplierData) => {
  let errors = {};
  if (!supplierData.name) errors.name = "Tên nhà cung cấp không được để trống";
  if (!supplierData.description)
    errors.description = "Mô tả không được để trống";
  if (!supplierData.phone) errors.phone = "Số điện thoại không được để trống";
  if (!supplierData.email) errors.email = "Email không được để trống";
  if (!supplierData.address) errors.address = "Địa chỉ không được để trống";
  return errors;
};

export const validatePromotionHeaderData = (promotionData) => {
  let errors = {};

  if (!promotionData.description.trim()) {
    return (errors = "Mô tả chương trình không được để trống");
  }

  if (!promotionData.startDate) {
    return (errors = "Ngày bắt đầu không được để trống");
  }

  if (!promotionData.endDate) {
    return (errors = "Ngày kết thúc không được để trống");
  }

  if (
    promotionData.startDate &&
    promotionData.endDate &&
    new Date(promotionData.endDate) < new Date(promotionData.startDate)
  ) {
    return (errors = "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu");
  }

  return errors;
};

export const validatePromotionLineData = (promotionLineData) => {
  let errors = {};

  if (!promotionLineData.description.trim()) {
    return (errors = "Mô tả dòng khuyến mãi không được để trống");
  }
  if (!promotionLineData.startDate) {
    return (errors = "Ngày bắt đầu không được để trống");
  }

  if (!promotionLineData.endDate) {
    return (errors = "Ngày kết thúc không được để trống");
  }
  if (
    promotionLineData.startDate &&
    promotionLineData.endDate &&
    new Date(promotionLineData.endDate) < new Date(promotionLineData.startDate)
  ) {
    return (errors = "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu");
  }
  if (!promotionLineData.type) {
    return (errors = "Vui lòng chọn loại khuyến mãi");
  }

  return errors;
};

export const validatePromotionDetailData = (promotionDetailData, type) => {
  console.log(promotionDetailData);
  console.log(type);
  let errors = {};
  if (!promotionDetailData.description.trim()) {
    return (errors = "Mô tả dòng khuyến mãi không được để trống");
  }
  if (type === "percentage")
    if (!promotionDetailData.amount_sales)
      return (errors = "Vui lòng nhập số tiền bán");
    else if (isNaN(promotionDetailData.amount_sales))
      return (errors = "Số tiền bán phải là số");
    else if (parseFloat(promotionDetailData.amount_sales) <= 0) {
      return (errors = "Số tiền bán phải lớn hơn 0");
    }
  if (type === "percentage")
    if (!promotionDetailData.percent)
      return (errors = "Vui lòng nhập số phần trăm");
    else if (isNaN(promotionDetailData.percent))
      return (errors = "Phần trăm phải là số");
    else if (
      parseFloat(promotionDetailData.percent) <= 0 ||
      parseFloat(promotionDetailData.percent) > 100
    ) {
      return (errors = "Phần trăm phải trong khoảng  0 - 100");
    }
  if (type === "percentage")
    if (!promotionDetailData.amount_limit)
      return (errors = "Vui lòng nhập giới hạn số tiền");
    else if (isNaN(promotionDetailData.amount_limit))
      return (errors = "Giới hạn số tiền phải là số");
    else if (parseFloat(promotionDetailData.amount_limit) <= 0) {
      return (errors = "Giới hạn số tiền phải lớn hơn 0");
    }
  if (type === "quantity" || type === "amount")
    if (!promotionDetailData.product_id) {
      return (errors = "Vui lòng chọn sản phẩm");
    }
  if (type === "quantity" || type === "amount")
    if (!promotionDetailData.unit_id) {
      return (errors = "Vui lòng chọn đơn vị tính");
    }
  if (type === "quantity" || type === "amount")
    if (!promotionDetailData.quantity)
      return (errors = "Vui lòng nhập số lượng");
    else if (isNaN(promotionDetailData.quantity))
      return (errors = "số lượng phải là số");
    else if (parseFloat(promotionDetailData.quantity) <= 0) {
      return (errors = "số lượng phải lớn hơn 0");
    }
  if (type === "quantity")
    if (!promotionDetailData.product_donate) {
      return (errors = "Vui lòng chọn sản phẩm khuyến mãi");
    }
  if (type === "quantity")
    if (!promotionDetailData.unit_id_donate) {
      return (errors = "Vui lòng chọn đơn vị tính cho sản phẩm khuyến mãi");
    }
  if (type === "quantity")
    if (!promotionDetailData.quantity_donate)
      return (errors = "Vui lòng nhập số lượng tặng kèm");
    else if (isNaN(promotionDetailData.quantity_donate))
      return (errors = "số lượng  tặng kèm phải là số");
    else if (parseFloat(promotionDetailData.quantity_donate) <= 0) {
      return (errors = "số lượng tặng kèm phải lớn hơn 0");
    }
  if (type === "amount")
    if (!promotionDetailData.amount_donate)
      return (errors = "Vui lòng nhập số tiền tặng");
    else if (isNaN(promotionDetailData.amount_donate))
      return (errors = "số tiền tặng kèm phải là số");
    else if (parseFloat(promotionDetailData.amount_donate) <= 0) {
      return (errors = "số tiền tặng phải lớn hơn 0");
    }

  return errors;
};

export const validatePriceHeaderData = (priceHeaderData) => {
  let errors = {};

  // Check if description is provided and not empty
  if (!priceHeaderData.description || !priceHeaderData.description.trim()) {
    return (errors = "Mô tả không được để trống");
  }

  // Check if startDate is provided
  if (!priceHeaderData.startDate) {
    return (errors = "Ngày bắt đầu không được để trống");
  }

  // Check if endDate is provided
  if (!priceHeaderData.endDate) {
    return (errors = "Ngày kết thúc không được để trống");
  }

  // Validate that endDate is after or equal to startDate
  if (
    priceHeaderData.startDate &&
    priceHeaderData.endDate &&
    new Date(priceHeaderData.endDate) < new Date(priceHeaderData.startDate)
  ) {
    return (errors = "Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu");
  }

  // Check if status is valid ('active' or 'inactive')
  if (!["active", "inactive", "pauseactive"].includes(priceHeaderData.status)) {
    return (errors = "Trạng thái không hợp lệ");
  }

  return errors;
};

export const validatePriceDetailData = (data) => {
  let errors = {};

  // Validate product_id
  if (!data.item_code) {
    return (errors = "Vui lòng chọn sản phẩm");
  }
  if (!data.unit_id) {
    return (errors = "Vui lòng chọn đơn vị tính");
  }
  // Validate price
  if (!data.price) {
    return (errors = "Vui lòng nhập giá.");
  } else if (isNaN(data.price)) {
    return (errors = "Giá phải là một số.");
  } else if (parseFloat(data.price) <= 0) {
    return (errors = "Giá phải lớn hơn 0.");
  }

  return errors;
};
