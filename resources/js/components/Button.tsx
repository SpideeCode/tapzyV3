import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string;
    disabled?: boolean;
    children: React.ReactNode;
    type?: 'button' | 'submit' | 'reset';
    variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({
    className = '',
    disabled = false,
    children,
    type = 'button',
    variant = 'primary',
    ...props
}: ButtonProps) {
    const baseStyles = 'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
    
    const variants = {
        primary: 'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
        secondary: 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-indigo-500',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    };

    return (
        <button
            type={type}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
}

export default Button;
