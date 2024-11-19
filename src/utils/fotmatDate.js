import { format } from 'date-fns';

export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return format(date, 'dd/MM/yyyy HH:mm:ss');
};

export const formatDateDDMMYYYY = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0'); // Months are zero-indexed
    const year = d.getFullYear();

    return `${day}/${month}/${year}`;
};


export const formatCurrency = (amount, locale = 'vi-VN', currency = 'VND') => {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(amount);
};

export const getStatusColor = (status) => {
    switch (status) {
        case 'Hết hàng':
            return 'red';
        case 'Ít hàng':
            return 'orange';
        case 'Còn hàng':
            return 'green';
        default:
            return 'black';
    }
};