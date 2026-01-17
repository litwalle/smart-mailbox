import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "./Button"

interface EmptyStateProps {
    icon?: string
    title: string
    description?: string
    actionLabel?: string
    onAction?: () => void
    className?: string
}

export function EmptyState({
    icon = "inbox",
    title,
    description,
    actionLabel,
    onAction,
    className
}: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center h-full text-center p-8 animate-in fade-in zoom-in-95 duration-500", className)}>
            <div className="h-24 w-24 bg-slate-50 rounded-full flex items-center justify-center mb-6 shadow-inner ring-8 ring-slate-50/50">
                <span className="material-symbols-outlined text-5xl text-slate-300">{icon}</span>
            </div>

            <h3 className="text-lg font-bold text-slate-800 mb-2">{title}</h3>

            {description && (
                <p className="text-sm text-slate-500 max-w-xs mb-6 leading-relaxed">
                    {description}
                </p>
            )}

            {actionLabel && onAction && (
                <Button variant="secondary" onClick={onAction}>
                    {actionLabel}
                </Button>
            )}
        </div>
    )
}
