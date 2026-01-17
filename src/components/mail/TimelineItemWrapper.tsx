import * as React from "react"
import { cn } from "@/lib/utils"

interface TimelineItemWrapperProps {
    children: React.ReactNode
    className?: string
    dotColor?: string
    variant?: 'default' | 'large' | 'capsule'
    /** Time string to display in capsule mode (e.g. "10:16") */
    timeDisplay?: string
}

export function TimelineItemWrapper({
    children,
    className,
    dotColor = "bg-blue-500",
    variant = 'default',
    timeDisplay
}: TimelineItemWrapperProps) {

    // Position adjustments based on variant - aligned with first line of 18px text
    const topClass = variant === 'large' ? 'top-[8px]' : variant === 'capsule' ? 'top-[16px]' : 'top-[10px]'

    // Left padding adjustment - capsule needs more space
    const paddingClass = variant === 'capsule' ? 'pl-[60px]' : 'pl-[40px]'

    return (
        <div className={cn("relative", paddingClass, className)}>
            {/* Timeline Line/Node Container */}
            <div className={cn("absolute left-0 z-10 flex justify-center",
                variant === 'capsule' ? "w-[50px] left-[-4px]" : "w-8",
                topClass
            )}>
                {variant === 'capsule' && timeDisplay ? (
                    // Time Capsule Style
                    <div className={cn(
                        "px-2 py-0.5 rounded-full text-[11px] font-bold text-white shadow-sm",
                        dotColor === "bg-blue-500" ? "bg-blue-600" : (dotColor || "bg-red-500")
                    )}>
                        {timeDisplay}
                    </div>
                ) : (
                    // Default Dot Style
                    <div className={cn(
                        "w-2.5 h-2.5 rounded-full ring-[3px] ring-white shadow-[0_0_0_1px_rgba(0,0,0,0.05),0_1px_2px_rgba(0,0,0,0.1)]",
                        dotColor
                    )} />
                )}
            </div>
            {children}
        </div>
    )
}
