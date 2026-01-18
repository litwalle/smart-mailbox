"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

export interface SegmentedControlOption<T extends string = string> {
    value: T
    label: React.ReactNode
}

interface SegmentedControlProps<T extends string = string> {
    options: SegmentedControlOption<T>[]
    value: T
    onChange: (value: T) => void
    className?: string
    size?: "sm" | "md"
}

export function SegmentedControl<T extends string = string>({
    options,
    value,
    onChange,
    className,
    size = "md"
}: SegmentedControlProps<T>) {
    return (
        <div className={cn(
            "flex bg-background-secondary p-1 rounded-lg border border-comp-divider items-center justify-center",
            className
        )}>
            {options.map((option) => {
                const isActive = value === option.value
                return (
                    <button
                        type="button"
                        key={option.value}
                        onClick={() => onChange(option.value)}
                        className={cn(
                            "flex items-center justify-center gap-1.5 font-medium rounded-md transition-all relative z-10 whitespace-nowrap outline-none focus:outline-none focus:ring-0 focus-visible:outline-none focus-visible:ring-0",
                            size === "sm" ? "px-2.5 py-1 text-xs" : "px-3 py-1.5 text-sm",
                            isActive
                                ? "bg-background-primary text-font-primary shadow-sm font-semibold ring-1 ring-comp-divider"
                                : "text-font-secondary hover:text-font-primary hover:bg-background-tertiary/50"
                        )}
                    >
                        <span>{option.label}</span>
                    </button>
                )
            })}
        </div>
    )
}
