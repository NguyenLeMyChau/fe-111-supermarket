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