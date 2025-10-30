import React, { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
    isFocused?: boolean;
}

export default function Input({
    className = '',
    isFocused = false,
    ...props
}: InputProps) {
    return (
        <input
            {...props}
            className={`rounded-md shadow-sm border-gray-300 focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 ${className}`}
            autoFocus={isFocused}
        />
    );
}
