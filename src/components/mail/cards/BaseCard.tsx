import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface BaseCardProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
    isSpecial?: boolean
    isHovered?: boolean
    children?: React.ReactNode

    // Configuration Slots
    icon?: React.ReactNode
    title?: React.ReactNode
    subtitle?: React.ReactNode // e.g., Tag (Under title)
    time?: React.ReactNode    // Right side meta

    action?: React.ReactNode  // Top right custom action
    onComplete?: () => void   // Top right check button

    // Footer
    footer?: React.ReactNode
}

export function BaseCard({
    children,
    className,
    isSpecial = false,
    isHovered = false,
    onClick,

    icon,
    title,
    subtitle,
    time,
    action,
    onComplete,
    footer,

    ...props
}: BaseCardProps) {
    return (
        <div
            className={cn(
                "group relative border rounded-lg overflow-hidden transition-all duration-300 cursor-pointer flex flex-col",
                isSpecial
                    ? "bg-background-primary/90 backdrop-blur-md border-comp-divider shadow-sm"
                    : "bg-background-primary/90 backdrop-blur-md border-comp-divider shadow-sm",
                "hover:shadow-md hover:-translate-y-[2px] hover:border-brand/30",
                className
            )}
            onClick={onClick}
            {...props}
        >
            {/* Standard Header Construction */}
            {(icon || title || time || onComplete) && (
                <div className="flex items-center justify-between p-5 pb-2">
                    <div className="flex items-center gap-3 min-w-0">
                        {/* Icon/Avatar Slot */}
                        {icon && (
                            <div className="shrink-0">
                                {icon}
                            </div>
                        )}

                        {/* Title & Subtitle Slot */}
                        <div className="min-w-0 flex flex-col">
                            {title && (
                                <div className="text-[14px] font-bold text-font-primary leading-tight">
                                    {title}
                                </div>
                            )}
                            {subtitle && (
                                <div className="mt-0.5 text-[13px] text-font-secondary leading-relaxed">
                                    {subtitle}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Action | Time */}
                    <div className="flex items-center gap-3 shrink-0 pl-2">
                        {time && (
                            <div className="text-[12px] text-font-tertiary font-medium whitespace-nowrap">
                                {time}
                            </div>
                        )}

                        {/* Custom Action or Complete Button */}
                        {action}
                        {onComplete && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    onComplete()
                                }}
                                className="w-8 h-8 rounded-full border border-comp-divider flex items-center justify-center text-icon-tertiary hover:bg-confirm/10 hover:text-confirm hover:border-confirm/30 transition-colors group/check"
                            >
                                <span className="material-symbols-outlined text-[18px]">check</span>
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="px-5 pb-5 flex-1">
                {children}

                {/* Footer slot (Actions) */}
                {footer}
            </div>

        </div>
    )
}
