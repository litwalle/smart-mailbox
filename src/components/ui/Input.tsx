"use client"

import * as React from "react"
import { cn } from "@/lib/utils"
import { cva, type VariantProps } from "class-variance-authority"

const inputVariants = cva(
    "flex w-full text-sm text-font-primary file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-font-tertiary focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all",
    {
        variants: {
            variant: {
                default: "h-10 rounded border border-comp-divider bg-background-primary px-3 py-2 shadow-sm focus:border-brand/50 focus:ring-2 focus:ring-brand/10",
                linear: "h-9 bg-transparent border-b border-comp-divider focus:border-brand px-0 py-1.5 rounded-none",
            }
        },
        defaultVariants: {
            variant: "default"
        }
    }
)

export interface InputProps
    extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'>,
    VariantProps<typeof inputVariants> {
    label?: string
    labelPosition?: "top" | "left"
    labelSpacing?: number // For left label, distance between label and input in px
    prefix?: React.ReactNode
    suffix?: React.ReactNode
    prefixMode?: "default" | "active" // active means always show, default means show on focus
    suffixMode?: "default" | "active"
    containerClassName?: string
    // Legacy support
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({
        className,
        variant,
        label,
        labelPosition = "top",
        labelSpacing = 12,
        prefix,
        suffix,
        prefixMode = "default",
        suffixMode = "default",
        containerClassName,
        leftIcon,
        rightIcon,
        ...props
    }, ref) => {
        const [isFocused, setIsFocused] = React.useState(false)

        // Legacy support: map leftIcon/rightIcon to prefix/suffix
        const effectivePrefix = prefix || leftIcon
        const effectiveSuffix = suffix || rightIcon

        const showPrefix = effectivePrefix && (prefixMode === "active" || isFocused)
        const showSuffix = effectiveSuffix && (suffixMode === "active" || isFocused)

        const inputElement = (
            <div className={cn("relative flex items-center w-full group", containerClassName)}>
                {effectivePrefix && (
                    <div className={cn(
                        "absolute left-0 text-icon-secondary pointer-events-none flex items-center justify-center transition-opacity",
                        variant === "linear" ? "left-0" : "left-3",
                        showPrefix ? "opacity-100" : "opacity-0"
                    )}>
                        {effectivePrefix}
                    </div>
                )}
                <input
                    className={cn(
                        inputVariants({ variant }),
                        effectivePrefix && variant === "linear" && "pl-6",
                        effectivePrefix && variant !== "linear" && "pl-10",
                        effectiveSuffix && variant === "linear" && "pr-6",
                        effectiveSuffix && variant !== "linear" && "pr-10",
                        className
                    )}
                    ref={ref}
                    onFocus={(e) => {
                        setIsFocused(true)
                        props.onFocus?.(e)
                    }}
                    onBlur={(e) => {
                        setIsFocused(false)
                        props.onBlur?.(e)
                    }}
                    {...props}
                />
                {effectiveSuffix && (
                    <div className={cn(
                        "absolute right-0 text-icon-secondary flex items-center justify-center transition-opacity",
                        variant === "linear" ? "right-0" : "right-3",
                        showSuffix ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
                    )}>
                        {effectiveSuffix}
                    </div>
                )}
            </div>
        )

        if (label && labelPosition === "left") {
            return (
                <div className="flex items-center w-full" style={{ gap: labelSpacing }}>
                    <label className="text-sm font-medium text-font-secondary whitespace-nowrap shrink-0">
                        {label}
                    </label>
                    {inputElement}
                </div>
            )
        }

        if (label && labelPosition === "top") {
            return (
                <div className="flex flex-col gap-1.5 w-full">
                    <label className="text-sm font-medium text-font-secondary">
                        {label}
                    </label>
                    {inputElement}
                </div>
            )
        }

        return inputElement
    }
)
Input.displayName = "Input"

export { Input, inputVariants }
