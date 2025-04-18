import React from 'react';

import './BadgeUserStatusComponent.scss';

const getStatusText = (status) => {
    switch (status) {
        case 'active':
            return 'Hoạt động';
        case 'unactive':
            return 'Bị khoá';
        default:
            return status;
    }
};

const getStatusColor = (status) => {
    switch (status) {
        case 'active':
            return 'bg-green-500 text-white';
        case 'unactive':
            return 'bg-red-500 text-white';
        default:
            return 'bg-gray-300 text-black';
    }
};

const BadgeUserStatusComponent = ({ status }) => {
    const text = getStatusText(status);
    const colorClass = getStatusColor(status);

    return (
        <span className={`inline-block py-1 px-4 rounded-full text-[11px] whitespace-nowrap ${colorClass}`}>
            {text}
        </span>
    );
};

export default BadgeUserStatusComponent;
