"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import {
    HoverCard,
    HoverCardContent,
    HoverCardTrigger,
} from "@/components/ui/hover-card"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, Info, XCircle } from "lucide-react"

export interface HoverTipProps {
    /**
     * The element to trigger the hover tip
     */
    children: React.ReactNode

    /**
     * Raw content (replaces title/description structure)
     * or main identifier (email etc.)
     */
    content?: React.ReactNode

    /**
     * Primary title text (bold)
     */
    title?: React.ReactNode

    /**
     * Secondary description text (muted)
     */
    description?: React.ReactNode

    /**
     * Footer content (below separator)
     */
    footer?: React.ReactNode

    /**
     * Visual style type
     */
    type?: "default" | "error" | "warning"

    /**
     * Text alignment
     */
    align?: "start" | "center" | "end"

    /**
     * Side to display tooltip
     */
    side?: "top" | "right" | "bottom" | 'left'

    /**
     * Offset from trigger
     */
    sideOffset?: number

    /**
     * Custom class for content container
     */
    className?: string

    /**
     * Max Width of the tooltip (default: auto/min-content)
     */
    width?: "auto" | "fixed" | "stretchy"
}

export function HoverTip({
    children,
    content,
    title,
    description,
    footer,
    type = "default",
    align = "center",
    side = "top",
    sideOffset = 5,
    className,
    width = "auto",
}: HoverTipProps) {

    // Resolve styling based on type
    const typeStyles = {
        default: "",
        error: "border-destructive/20 bg-white", // Error style
        warning: "border-warning/20 bg-white", // Warning style
    }

    const iconMap = {
        default: null,
        error: <XCircle className="h-4 w-4 text-destructive shrink-0" />,
        warning: <AlertCircle className="h-4 w-4 text-warning shrink-0" />,
    }

    const TypeIcon = iconMap[type]

    return (
        <HoverCard openDelay={50} closeDelay={100}>
            <HoverCardTrigger asChild>
                {children}
            </HoverCardTrigger>
            <HoverCardContent
                side={side}
                sideOffset={sideOffset}
                align={align === "center" ? "center" : align === "end" ? "end" : "start"}
                className={cn(
                    "z-[9999] p-2 shadow-lg rounded-lg border border-border/50 bg-white",
                    width === 'auto' && "w-auto max-w-[320px]",
                    width === 'fixed' && "w-[260px]",
                    typeStyles[type],
                    className
                )}
            >
                <div className={cn(
                    "flex flex-col gap-1",
                    align === "center" && "items-center text-center",
                    align === "end" && "items-end text-right",
                    align === "start" && "items-start text-left"
                )}>
                    {/* Main Content Area */}
                    {(title || content) && (
                        <div className="flex flex-col gap-0.5 w-full">
                            {title && (
                                <div className={cn("text-sm font-medium text-foreground flex items-center gap-2",
                                    align === "center" && "justify-center",
                                    align === "end" && "justify-end"
                                )}>
                                    {title}
                                </div>
                            )}
                            {content && (
                                <div className={cn("text-sm text-foreground/90")}>
                                    {content}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Description */}
                    {description && (
                        <div className="text-xs text-muted-foreground break-all">
                            {description}
                        </div>
                    )}

                    {/* Footer Area with Separator */}
                    {footer && (
                        <>
                            <Separator className="my-2 bg-border/60" />
                            <div className={cn(
                                "flex items-center gap-2 text-xs w-full",
                                type === 'error' && "text-destructive font-medium",
                                type === 'warning' && "text-amber-600 font-medium",
                                !['error', 'warning'].includes(type) && "text-muted-foreground",
                                align === "center" && "justify-center",
                                align === "end" && "justify-end"
                            )}>
                                {['error', 'warning'].includes(type) && TypeIcon}
                                <span>{footer}</span>
                            </div>
                        </>
                    )}
                </div>
            </HoverCardContent>
        </HoverCard>
    )
}
