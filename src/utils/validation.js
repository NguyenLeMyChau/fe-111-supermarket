export const validateEmployeeData = (employeeData) => {
    let errors = {};

    if (!employeeData.name.trim()) {
        errors.name = 'Tên không được để trống';
    }
    if (!employeeData.phone.trim()) {
        errors.phone = 'Số điện thoại không được để trống';
    }
    if (!employeeData.email.trim()) {
        errors.email = 'Email không được để trống';
    }
    if (!employeeData.address.street.trim()) {
        errors.address = 'Số nhà tên đường không được để trống';
    }
    if (!employeeData.address.ward.trim()) {
        errors.address = 'Phường/xã không được để trống';
    }
    if (!employeeData.address.district.trim()) {
        errors.address = 'Quận/huyện không được để trống';
    }
    if (!employeeData.address.city.trim()) {
        errors.address = 'Tỉnh/thành phố không được để trống';
    }

    return errors;
};

export const validateSupplierData = (supplierData) => {
    let errors = {};
    if (!supplierData.name) errors.name = 'Tên nhà cung cấp không được để trống';
    if (!supplierData.description) errors.description = 'Mô tả không được để trống';
    if (!supplierData.phone) errors.phone = 'Số điện thoại không được để trống';
    if (!supplierData.email) errors.email = 'Email không được để trống';
    if (!supplierData.address) errors.address = 'Địa chỉ không được để trống';
    return errors;
};

export const validatePromotionHeaderData = (promotionData) => {
    let errors = {};

    if (!promotionData.description.trim()) {
        return errors = 'Mô tả chương trình không được để trống';
    }

    if (!promotionData.startDate) {
        return errors = 'Ngày bắt đầu không được để trống';
    }

    if (!promotionData.endDate) {
        return errors = 'Ngày kết thúc không được để trống';
    }

    if (promotionData.startDate && promotionData.endDate && new Date(promotionData.endDate) < new Date(promotionData.startDate)) {
        return errors = 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu';
    }

    return errors;
};

export const validatePromotionLineData = (promotionLineData) => {
    let errors = {};

    if (!promotionLineData.description.trim()) {
        return errors = 'Mô tả dòng khuyến mãi không được để trống';
    }
    if (!promotionLineData.startDate) {
        return errors = 'Ngày bắt đầu không được để trống';
    }

    if (!promotionLineData.endDate) {
        return errors = 'Ngày kết thúc không được để trống';
    }
    if (promotionLineData.startDate && promotionLineData.endDate && new Date(promotionLineData.endDate) < new Date(promotionLineData.startDate)) {
        return errors = 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu';
    }
    if (!promotionLineData.type) {
        return errors = 'Vui lòng chọn loại khuyến mãi';
    }

    return errors;
};

export const validatePromotionDetailData = (data) => {
    let errors = {};

    if (data.product_id && !data.product_id.trim()) {
        errors.product_id = 'ID sản phẩm không được để trống';
    }

    if (data.unit_id && !data.unit_id.trim()) {
        errors.unit_id = 'ID đơn vị không được để trống';
    }

    if (data.quantity && (!Number.isInteger(Number(data.quantity)) || data.quantity <= 0)) {
        errors.quantity = 'Số lượng phải là số nguyên dương';
    }

    if (data.product_donate && !data.product_donate.trim()) {
        errors.product_donate = 'ID sản phẩm tặng kèm không được để trống';
    }

    if (data.quantity_donate && (!Number.isInteger(Number(data.quantity_donate)) || data.quantity_donate <= 0)) {
        errors.quantity_donate = 'Số lượng tặng kèm phải là số nguyên dương';
    }

    // Kiểm tra amount_sales (chỉ khi loại là 'percentage')
    if (data.amount_sales && (!Number(data.amount_sales) || data.amount_sales <= 0)) {
        errors.amount_sales = 'Số tiền bán phải là số dương';
    }

    if (data.percent && (Number(data.percent) < 0 || Number(data.percent) > 100)) {
        errors.percent = 'Phần trăm phải nằm trong khoảng từ 0 đến 100';
    }

    if (data.amount_limit && (!Number(data.amount_limit) || data.amount_limit <= 0)) {
        errors.amount_limit = 'Giới hạn số tiền phải là số dương';
    }

    if (data.amount_donate && (!Number(data.amount_donate) || data.amount_donate <= 0)) {
        errors.amount_donate = 'Số tiền tặng kèm phải là số dương';
    }

    return errors;
};

export const validatePriceHeaderData = (priceHeaderData) => {
    let errors = {};

    // Check if description is provided and not empty
    if (!priceHeaderData.description || !priceHeaderData.description.trim()) {
        return  errors.description = 'Mô tả không được để trống';
    }

    // Check if startDate is provided
    if (!priceHeaderData.startDate) {
        return  errors = 'Ngày bắt đầu không được để trống';
    }

    // Check if endDate is provided
    if (!priceHeaderData.endDate) {
        return  errors = 'Ngày kết thúc không được để trống';
    }

    // Validate that endDate is after or equal to startDate
    if (
        priceHeaderData.startDate &&
        priceHeaderData.endDate &&
        new Date(priceHeaderData.endDate) < new Date(priceHeaderData.startDate)
    ) {
        return  errors = 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu';
    }

    // Check if status is valid ('active' or 'inactive')
    if (!['active', 'inactive'].includes(priceHeaderData.status)) {
        return  errors = 'Trạng thái không hợp lệ';
    }

    return errors;
};

export const validatePriceDetailData = (data) => {
    let errors = {};

    // Validate product_id
    if (!data.product_id) {
        return  errors = 'Vui lòng chọn sản phẩm.';
    }

    // Validate price
    if (!data.price) {
        return  errors = 'Vui lòng nhập giá.';
    } else if (isNaN(data.price)) {
        return errors = 'Giá phải là một số.';
    } else if (parseFloat(data.price) <= 0) {
        return errors = 'Giá phải lớn hơn 0.';
    }

    return errors;
};


