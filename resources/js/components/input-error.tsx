import { cn } from '@/lib/utils';
import { type HTMLAttributes } from 'react';

export default function InputError({
    message,
    className = '',
    ...props
}: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    return message ? (
        <p
            {...props}
            className={cn('text-sm text-destructive font-medium flex items-center gap-1.5', className)}
        >
            <span className="text-destructive">•</span>
            {message}
        </p>
    ) : null;
}
