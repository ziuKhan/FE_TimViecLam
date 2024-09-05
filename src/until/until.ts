export const formatSalary = (value: string | number | undefined) => {
    if (!value) return 'N/A';
    return parseInt(value.toString()).toLocaleString('vi-VN');
};