import React from 'react';
import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: PaginationLink[];
    from?: number;
    to?: number;
    total?: number;
    className?: string;
}

export default function Pagination({ links, from, to, total, className }: PaginationProps) {
    if (!links || links.length <= 1) {
        return null;
    }

    // Laravel pagination typically has first, prev, pages, next, last
    // We'll take the first as prev and last as next, and everything in between as page links
    const prevLink = links.length > 0 ? links[0] : null;
    const nextLink = links.length > 1 ? links[links.length - 1] : null;
    const pageLinks = links.length > 2 ? links.slice(1, -1) : [];

    return (
        <div className={cn("flex items-center justify-between border-t border-border pt-4", className)}>
            {from && to && total && (
                <div className="flex-1 flex justify-between sm:hidden">
                    {prevLink?.url && (
                        <Button variant="outline" size="sm" asChild>
                            <Link href={prevLink.url}>Précédent</Link>
                        </Button>
                    )}
                    {nextLink?.url && (
                        <Button variant="outline" size="sm" asChild>
                            <Link href={nextLink.url}>Suivant</Link>
                        </Button>
                    )}
                </div>
            )}

            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    {from && to && total && (
                        <p className="text-sm text-muted-foreground">
                            Affichage de <span className="font-medium text-foreground">{from}</span> à{' '}
                            <span className="font-medium text-foreground">{to}</span> sur{' '}
                            <span className="font-medium text-foreground">{total}</span> résultats
                        </p>
                    )}
                </div>
                <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    {prevLink?.url && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-r-none"
                            asChild
                        >
                            <Link href={prevLink.url}>
                                <ChevronLeft className="h-4 w-4" />
                                <span className="sr-only">Précédent</span>
                            </Link>
                        </Button>
                    )}

                    {pageLinks.map((link, index) => {
                        if (link.url === null) {
                            return (
                                <span
                                    key={index}
                                    className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-muted-foreground ring-1 ring-inset ring-border hover:bg-accent"
                                >
                                    <MoreHorizontal className="h-4 w-4" />
                                </span>
                            );
                        }

                        return (
                            <Button
                                key={index}
                                variant={link.active ? "default" : "outline"}
                                size="sm"
                                className={cn(
                                    "rounded-none",
                                    link.active && "z-10 bg-primary text-primary-foreground ring-1 ring-primary"
                                )}
                                asChild
                            >
                                <Link
                                    href={link.url}
                                    dangerouslySetInnerHTML={{ __html: link.label }}
                                />
                            </Button>
                        );
                    })}

                    {nextLink?.url && (
                        <Button
                            variant="outline"
                            size="sm"
                            className="rounded-l-none"
                            asChild
                        >
                            <Link href={nextLink.url}>
                                <span className="sr-only">Suivant</span>
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    )}
                </nav>
            </div>
        </div>
    );
}
