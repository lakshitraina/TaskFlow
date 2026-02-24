import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const Card = ({ className, children, ...props }) => {
    return (
        <div
            className={twMerge(
                clsx(
                    'bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden',
                    className
                )
            )}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
