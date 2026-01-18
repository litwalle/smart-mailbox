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
        if (accentColor === "primary") borderColorClass = "border-l-brand"
        else if (accentColor === "success") borderColorClass = "border-l-confirm"
        else if (accentColor === "warning") borderColorClass = "border-l-alert"
        else if (accentColor === "danger") borderColorClass = "border-l-warning"


        return (
            <div
                ref={ref}
                className={cn(
                    "rounded-lg border border-comp-divider bg-background-primary shadow-sm text-font-primary",
                    hoverEffect && "transition-all hover:shadow-md hover:border-brand/30",
                    activeEffect && "border-brand/50 shadow-md ring-1 ring-brand/10",
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
