import * as React from "react"
import { cn } from "@/lib/utils"

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverEffect?: boolean
    activeEffect?: boolean
    accentColor?: "primary" | "secondary" | "success" | "warning" | "danger"
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
    ({ className, hoverEffect = false, activeEffect = false, accentColor, children, ...props }, ref) => {

        // 如果有 accentColor，添加左侧强调边框
        const accentClass = accentColor ? `border-l-4 pl-4` : ""
        let borderColorClass = ""

        // 这里可以细化颜色逻辑，简单起见用几个预设
        if (accentColor === "primary") borderColorClass = "border-l-primary"
        else if (accentColor === "success") borderColorClass = "border-l-green-500"
        else if (accentColor === "warning") borderColorClass = "border-l-amber-500"
        else if (accentColor === "danger") borderColorClass = "border-l-red-500"


        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-xl border border-slate-200 bg-white shadow-card text-text-main",
                    hoverEffect && "transition-all hover:shadow-lg hover:border-primary/30",
                    activeEffect && "border-primary/50 shadow-md ring-1 ring-primary/10",
                    accentClass,
                    borderColorClass,
                    className
                )}
                {...props}
            >
                {children}
            </div>
        )
    }
)
Card.displayName = "Card"

export { Card }
