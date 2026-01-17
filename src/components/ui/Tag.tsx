import * as React from "react"
import { cn } from "@/lib/utils"

export type TagVariant = "default" | "important" | "urgent" | "today" | "work" | "outline" | "solid"

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: TagVariant
    color?: string // Optional custom color override if needed, but variants preferred
}

export function Tag({ className, variant = "default", children, ...props }: TagProps) {
    const variants: Record<TagVariant, string> = {
        default: "bg-slate-100 text-slate-600 border-slate-200",
        important: "bg-amber-50 text-amber-700 border-amber-200", // Yellow/Orange for Important
        urgent: "bg-red-50 text-red-700 border-red-200",       // Red for Urgent
        today: "bg-blue-50 text-blue-700 border-blue-200",      // Blue for Today
        work: "bg-slate-100 text-slate-600 border-slate-200",   // Gray for Work/General
        outline: "bg-transparent border-slate-200 text-slate-600",
        solid: "bg-slate-800 text-white border-transparent",
    }

    return (
        <span
            className={cn(
                "inline-flex items-center px-1.5 py-0.5 rounded text-[11px] font-medium border leading-tight transition-colors",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    )
}
