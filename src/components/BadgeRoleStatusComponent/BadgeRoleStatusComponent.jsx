import React from 'react';

import './BadgeRoleStatusComponent.scss';

const getStatusText = (status) => {
    switch (status) {
        case 'staff':
            return 'Nhân viên';
        case 'user':
            return 'Người dùng';
        case 'admin':
            return 'Quản lý';
        case 'cancelled':
            return 'Đã huỷ';
        default:
            return status;
    }
};

const getStatusColor = (status) => {
    switch (status) {
        case 'staff':
            return 'bg-blue-500 text-white';
        case 'user':
            return 'bg-yellow-500 text-white';
        case 'admin':
            return 'bg-green-500 text-white';
        case 'cancelled':
            return 'bg-red-500 text-white';
        default:
            return 'bg-gray-300 text-black';
    }
};

const BadgeOrderStatusComponent = ({ status }) => {
    const text = getStatusText(status);
    const colorClass = getStatusColor(status);

    return (
        <span className={`inline-block py-1 px-4 rounded-full text-[11px] whitespace-nowrap ${colorClass}`}>
            {text}
        </span>
    );
};

export default BadgeOrderStatusComponent;
