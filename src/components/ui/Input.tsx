import * as React from "react"
import { cn } from "@/lib/utils"

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    leftIcon?: React.ReactNode
    rightIcon?: React.ReactNode
    containerClassName?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, leftIcon, rightIcon, containerClassName, ...props }, ref) => {
        return (
            <div className={cn("relative flex items-center w-full", containerClassName)}>
                {leftIcon && (
                    <div className="absolute left-3 text-text-secondary pointer-events-none flex items-center justify-center">
                        {leftIcon}
                    </div>
                )}
                <input
                    className={cn(
                        "flex h-10 w-full rounded-lg border border-border-color bg-slate-50 px-3 py-2 text-sm text-text-main shadow-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-text-secondary focus-visible:outline-none focus:bg-white focus:border-primary/50 focus:ring-2 focus:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50",
                        leftIcon && "pl-10",
                        rightIcon && "pr-10",
                        className
                    )}
                    ref={ref}
                    {...props}
                />
                {rightIcon && (
                    <div className="absolute right-3 text-text-secondary pointer-events-none flex items-center justify-center">
                        {rightIcon}
                    </div>
                )}
            </div>
        )
    }
)
Input.displayName = "Input"

export { Input }
