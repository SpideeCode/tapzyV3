import React, { LabelHTMLAttributes } from 'react';

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
    value?: string;
    required?: boolean;
}

export default function Label({
    value,
    className = '',
    children,
    required = false,
    ...props
}: LabelProps) {
    return (
        <label
            className={`block text-sm font-medium text-gray-700 ${className}`}
            {...props}
        >
            {value || children}
            {required && <span className="text-red-500 ml-1">*</span>}
        </label>
    );
}
