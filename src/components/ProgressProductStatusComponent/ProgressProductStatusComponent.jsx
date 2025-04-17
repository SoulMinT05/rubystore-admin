import React from 'react';

import './ProgressProductStatusComponent.scss';

const getStatusBackgroundColor = (status) => {
    switch (status) {
        case 'commingSoon':
            return 'bg-blue-500';
        case 'unactive':
            return 'bg-yellow-500';
        case 'active':
            return 'bg-green-500';
        case 'outOfStock':
            return 'bg-red-500';
        case 'draft':
            return 'bg-orange-400';
        default:
            return 'bg-gray-300';
    }
};

const ProgressProductStatusComponent = ({ value, status }) => {
    const backgroundColorClass = getStatusBackgroundColor(status);
    return (
        <div className="w-[100px] h-auto overflow-hidden rounded-md bg-[#f1f1f1]">
            <span className={`flex items-center h-[8px] ${backgroundColorClass}`} style={{ width: `${value}%` }}></span>
        </div>
    );
};

export default ProgressProductStatusComponent;
