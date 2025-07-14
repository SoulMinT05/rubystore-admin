import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/vi';

dayjs.extend(relativeTime);
dayjs.locale('vi');

export const formatDisplayTime = (createdAt) => {
    const now = dayjs();
    const diffDays = now.diff(dayjs(createdAt), 'day');
    return diffDays < 7
        ? dayjs(createdAt).fromNow() // ví dụ: "2 phút trước"
        : dayjs(createdAt).format('DD/MM/YYYY'); // ví dụ: "12/06/2025"
};
