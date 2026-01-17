import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "ghost" | "outline" | "pill"
    size?: "sm" | "md" | "lg" | "icon"
    isLoading?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "md", isLoading, children, disabled, ...props }, ref) => {

        const variants = {
            primary: "bg-primary text-white hover:bg-primary-hover active:scale-95 border-transparent",
            secondary: "bg-white text-slate-700 border-slate-200 border hover:bg-slate-50 hover:border-slate-300 active:scale-95",
            ghost: "bg-transparent text-text-secondary hover:text-text-main hover:bg-slate-100 border-transparent",
            outline: "bg-transparent border border-primary text-primary hover:bg-primary-light active:scale-95",
            pill: "rounded-full bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 transition-all text-xs font-medium px-4 py-1.5 active:scale-95",
        }

        const sizes = {
            sm: "h-8 px-3 text-xs rounded-lg gap-1.5",
            md: "h-10 px-5 py-2 text-sm rounded-xl gap-2",
            lg: "h-12 px-8 text-base rounded-2xl gap-2.5",
            icon: "h-10 w-10 p-2 flex items-center justify-center rounded-xl",
        }

        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    variant !== "pill" && sizes[size], // pill has its own padding/size logic usually
                    className
                )}
                ref={ref}
                disabled={isLoading || disabled}
                {...props}
            >
                {isLoading && (
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                )}
                {children}
            </button>
        )
    }
)
Button.displayName = "Button"

export { Button }
