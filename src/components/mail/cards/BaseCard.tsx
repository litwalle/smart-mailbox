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
        <motion.div
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
            className={cn(
                "group relative border rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer flex flex-col",
                isSpecial
                    ? "bg-white/90 backdrop-blur-md border-white/60 shadow-[0_4px_20px_rgba(0,0,0,0.03)]"
                    : "bg-white/90 backdrop-blur-md border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.02)]",
                "hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)] hover:-translate-y-[2px] hover:border-blue-100/50",
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
                                <div className="text-[14px] font-bold text-slate-900 leading-tight">
                                    {title}
                                </div>
                            )}
                            {subtitle && (
                                <div className="mt-0.5 text-[13px] text-slate-500 leading-relaxed">
                                    {subtitle}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Right Side: Action | Time */}
                    <div className="flex items-center gap-3 shrink-0 pl-2">
                        {time && (
                            <div className="text-[12px] text-slate-400 font-medium whitespace-nowrap">
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
                                className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200 transition-colors group/check"
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

        </motion.div>
    )
}
