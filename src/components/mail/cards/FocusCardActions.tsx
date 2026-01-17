import * as React from "react"
import { cn } from "@/lib/utils"
import { CapsuleButton } from "@/components/ui/CapsuleButton"

export interface CardAction {
    label: string
    actionType?: string
    isPrimary?: boolean
    onClick?: () => void
}

interface FocusCardActionsProps {
    actions: CardAction[]
    className?: string
}

export function FocusCardActions({ actions, className }: FocusCardActionsProps) {
    if (!actions || actions.length === 0) return null

    const primaryAction = actions.find(a => a.isPrimary) || actions[0]
    const secondaryActions = actions.filter(a => a !== primaryAction)

    return (
        <div className={cn("flex flex-wrap gap-2 items-center min-h-[32px] mt-4", className)}>
            {/* Primary Action - Always Visible */}
            {primaryAction && (
                <CapsuleButton
                    variant="secondary"
                    onClick={primaryAction.onClick}
                >
                    {primaryAction.label}
                </CapsuleButton>
            )}

            {/* Secondary Actions - Visible on Group Hover only */}
            {secondaryActions.map((act, idx) => (
                <CapsuleButton
                    key={idx}
                    variant="outline"
                    onClick={act.onClick}
                    className="hidden group-hover:inline-flex"
                >
                    {act.label}
                </CapsuleButton>
            ))}
        </div>
    )
}
