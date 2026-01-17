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
    primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm",
    secondary: "bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-100",
    outline: "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300"
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
