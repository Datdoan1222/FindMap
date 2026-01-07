import {useMemo} from 'react';
import dayjs from 'dayjs';

/**
 * Hook tính trạng thái thuê phòng
 * @param {Object} data
 * @param {string|Date} data.rent_start_date - Ngày bắt đầu thuê
 * @param {string|Date} data.rent_end_date - Ngày kết thúc hợp đồng
 * @param {string|Date} data.due_date - Ngày đến hạn đóng tiền tháng
 * @returns {Object} { paymentStatus, daysLeft, contractStatus }
 */
export const useRentStatus = data => {
  return useMemo(() => {
    if (!data) return {};

    const today = dayjs();
    const rentEnd = dayjs(data.rent_end_date);
    const dueDate = dayjs(data.due_date);
    //2025-11-10T17:53:13.992Z
    // 💰 1. Trạng thái tiền thuê
    const paymentStatus =
      dueDate.month() === today.month()
        ? true // 'Chưa đóng tiền tháng'
        : false; //'Đã đóng tiền tháng';

    // 📅 2. Tính số ngày còn lại hợp đồng
    const daysLeft = rentEnd.diff(today, 'day');
    let contractStatus = false;
    let warningContractStatus = false;
    if (daysLeft <= 0) {
      contractStatus = false; // false là hết hạn
    } else if (daysLeft <= 30) {
      warningContractStatus = true;
    } else {
      contractStatus = true; // > 30ngày true chưa hết hạn
    }

    return {paymentStatus, warningContractStatus, daysLeft, contractStatus};
  }, [data]);
};
