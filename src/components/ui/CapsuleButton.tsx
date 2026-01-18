import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * CapsuleButton - 统一胶囊按钮组件
 * 
 * 变体:
 * - primary: 深色背景，白色文字（主要操作）
 * - secondary: 浅蓝色背景，蓝色文字（次要操作）
 * - outline: 白色背景，灰色边框和文字（辅助操作）
 */

export interface CapsuleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline'
    size?: 'sm' | 'md'
    children: React.ReactNode
}

const variantStyles = {
    primary: "bg-comp-background-neutral text-font-on-primary hover:bg-comp-background-neutral/90 shadow-sm",
    secondary: "bg-comp-emphasize-tertiary text-brand hover:bg-comp-emphasize-secondary border border-brand/20",
    outline: "bg-background-primary text-font-secondary border border-comp-divider hover:bg-background-secondary hover:border-comp-divider"
}

const sizeStyles = {
    sm: "px-3 py-1 text-[11px]",
    md: "px-4 py-1.5 text-xs"
}

export function CapsuleButton({
    variant = 'primary',
    size = 'md',
    className,
    children,
    onClick,
    ...props
}: CapsuleButtonProps) {
    return (
        <button
            onClick={(e) => {
                e.stopPropagation()
                onClick?.(e)
            }}
            className={cn(
                "rounded-full font-semibold transition-colors whitespace-nowrap",
                variantStyles[variant],
                sizeStyles[size],
                className
            )}
            {...props}
        >
            {children}
        </button>
    )
}
