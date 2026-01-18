import * as React from "react"
import { cn } from "@/lib/utils"

export type TagVariant = "default" | "important" | "urgent" | "today" | "work" | "outline" | "solid"

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: TagVariant
    color?: string // Optional custom color override if needed, but variants preferred
}

export function Tag({ className, variant = "default", children, ...props }: TagProps) {
    const variants: Record<TagVariant, string> = {
        default: "bg-background-secondary text-font-secondary border-comp-divider",
        important: "bg-palette-10/15 text-palette-10 border-palette-10/30", // Orange for Important
        urgent: "bg-warning/10 text-warning border-warning/30",             // Red for Urgent
        today: "bg-brand/10 text-brand border-brand/30",                    // Blue for Today
        work: "bg-background-secondary text-font-secondary border-comp-divider",   // Gray for Work/General
        outline: "bg-transparent border-comp-divider text-font-secondary",
        solid: "bg-comp-background-neutral text-font-on-primary border-transparent",
    }

    return (
        <span
            className={cn(
                "inline-flex items-center px-1.5 py-0.5 rounded-sm text-[11px] font-medium border leading-tight transition-colors",
                variants[variant],
                className
            )}
            {...props}
        >
            {children}
        </span>
    )
}
