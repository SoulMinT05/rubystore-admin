import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

export const formatOnlineTime = (createdAt) => {
    const now = dayjs();
    const diffDays = now.diff(dayjs(createdAt), 'day');
    return diffDays < 7
        ? dayjs(createdAt).fromNow() // ví dụ: "2 phút trước"
        : dayjs(createdAt).format('DD/MM/YYYY'); // ví dụ: "12/06/2025"
};

const weekdaysShort = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

export function formatDisplayTime(date) {
    const now = dayjs();
    const msgTime = dayjs(date);

    if (now.isSame(msgTime, 'day')) {
        // cùng ngày → chỉ hiện giờ
        return msgTime.format('HH:mm');
    } else if (now.isSame(msgTime, 'week')) {
        // return msgTime.format('HH:mm dddd'); // ví dụ "23:39 Thứ Ba"
        // trong cùng tuần → giờ + thứ rút gọn (T2, T3...)
        return `${msgTime.format('HH:mm')} ${weekdaysShort[msgTime.day()]}`;
    } else {
        // khác tuần → giờ + ngày tháng năm
        return msgTime.format('HH:mm D MMMM, YYYY'); // "13:52 19 Tháng 8, 2025"
    }
}
