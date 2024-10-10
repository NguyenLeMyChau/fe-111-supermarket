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
    if (!employeeData.address.trim()) {
        errors.address = 'Địa chỉ không được để trống';
    }

    return errors;
};
export const validatePromotionHeaderData = (promotionData) => {
    let errors = {};

    if (!promotionData.description.trim()) {
        errors.description = 'Mô tả chương trình không được để trống';
    }

    if (!promotionData.startDate) {
        errors.startDate = 'Ngày bắt đầu không được để trống';
    }

    if (!promotionData.endDate) {
        errors.endDate = 'Ngày kết thúc không được để trống';
    }

    if (promotionData.startDate && promotionData.endDate && new Date(promotionData.endDate) < new Date(promotionData.startDate)) {
        errors.endDate = 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu';
    }

    return errors;
};

export const validatePromotionLineData = (promotionLineData) => {
    let errors = {};

    // if (!promotionLineData.description.trim()) {
    //     errors.description = 'Mô tả dòng khuyến mãi không được để trống';
    // }
    // if (!promotionLineData.startDate) {
    //     errors.startDate = 'Ngày bắt đầu không được để trống';
    // }

    // if (!promotionLineData.endDate) {
    //     errors.endDate = 'Ngày kết thúc không được để trống';
    // }
    // if (promotionLineData.startDate && promotionLineData.endDate && new Date(promotionLineData.endDate) < new Date(promotionLineData.startDate)) {
    //     errors.endDate = 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu';
    // }
    // if(promotionLineData.promotionHeader_id.trim()){
    //     errors.promotionHeader_id = 'ID chương trình khuyến mãi không tìm thấy';
    // }
    return errors;
};

export const validatePromotionDetailData = (data) => {
    let errors = {};

    // if (data.product_id && !data.product_id.trim()) {
    //     errors.product_id = 'ID sản phẩm không được để trống';
    // }

    // if (data.unit_id && !data.unit_id.trim()) {
    //     errors.unit_id = 'ID đơn vị không được để trống';
    // }

    // if (data.quantity && (!Number.isInteger(Number(data.quantity)) || data.quantity <= 0)) {
    //     errors.quantity = 'Số lượng phải là số nguyên dương';
    // }

    // if (data.product_donate && !data.product_donate.trim()) {
    //     errors.product_donate = 'ID sản phẩm tặng kèm không được để trống';
    // }

    // if (data.quantity_donate && (!Number.isInteger(Number(data.quantity_donate)) || data.quantity_donate <= 0)) {
    //     errors.quantity_donate = 'Số lượng tặng kèm phải là số nguyên dương';
    // }

    // // Kiểm tra amount_sales (chỉ khi loại là 'percentage')
    // if (data.amount_sales && (!Number(data.amount_sales) || data.amount_sales <= 0)) {
    //     errors.amount_sales = 'Số tiền bán phải là số dương';
    // }

    // if (data.percent && (Number(data.percent) < 0 || Number(data.percent) > 100)) {
    //     errors.percent = 'Phần trăm phải nằm trong khoảng từ 0 đến 100';
    // }

    // if (data.amount_limit && (!Number(data.amount_limit) || data.amount_limit <= 0)) {
    //     errors.amount_limit = 'Giới hạn số tiền phải là số dương';
    // }

    // if (data.amount_donate && (!Number(data.amount_donate) || data.amount_donate <= 0)) {
    //     errors.amount_donate = 'Số tiền tặng kèm phải là số dương';
    // }

    return errors;
};



