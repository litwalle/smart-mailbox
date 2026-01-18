import * as React from "react"
import { cn } from "@/lib/utils"
// We use react-icons/lu for 1.5px stroke line icons as requested
import {
    Check,
    Trash2,
    Mail,
    MailOpen,
    Flag,
    Archive,
    Clock
} from "lucide-react"

interface MailHoverActionsProps {
    className?: string
    isRead: boolean
    isStarred: boolean
    onComplete?: (e: React.MouseEvent) => void
    onDelete?: (e: React.MouseEvent) => void
    onToggleRead?: (e: React.MouseEvent) => void
    onToggleFlag?: (e: React.MouseEvent) => void
    onArchive?: (e: React.MouseEvent) => void
}

export function MailHoverActions({
    className,
    isRead,
    isStarred,
    onComplete,
    onDelete,
    onToggleRead,
    onToggleFlag,
    onArchive
}: MailHoverActionsProps) {
    const handleAction = (e: React.MouseEvent, action?: (e: React.MouseEvent) => void) => {
        e.stopPropagation()
        e.preventDefault()
        action?.(e)
    }

    const iconClass = "w-[18px] h-[18px] stroke-[1.5px]"

    return (
        <div className={cn(
            "flex items-center gap-1 p-1 bg-background-primary rounded-lg shadow-sm border border-comp-divider",
            className
        )}>
            <button
                onClick={(e) => handleAction(e, onArchive)}
                className="p-1 text-icon-secondary hover:text-icon-primary hover:bg-background-secondary rounded-md transition-colors"
                title="Archive"
            >
                <Archive className={iconClass} />
            </button>
            <button
                onClick={(e) => handleAction(e, onDelete)}
                className="p-1 text-icon-secondary hover:text-warning hover:bg-warning/10 rounded-md transition-colors"
                title="Delete"
            >
                <Trash2 className={iconClass} />
            </button>
            <button
                onClick={(e) => handleAction(e, onComplete)}
                className="p-1 text-icon-secondary hover:text-confirm hover:bg-confirm/10 rounded-md transition-colors"
                title="Complete"
            >
                <Check className={iconClass} />
            </button>
            <button
                onClick={(e) => handleAction(e, onToggleRead)}
                className="p-1 text-icon-secondary hover:text-icon-primary hover:bg-background-secondary rounded-md transition-colors"
                title={isRead ? "Mark as Unread" : "Mark as Read"}
            >
                {isRead ? <Mail className={iconClass} /> : <MailOpen className={iconClass} />}
            </button>
            <button
                onClick={(e) => handleAction(e, onToggleFlag)}
                className={cn(
                    "p-1 rounded-md transition-colors hover:bg-background-secondary",
                    isStarred ? "text-palette-10 hover:text-palette-10" : "text-icon-secondary hover:text-icon-primary"
                )}
                title="Flag"
            >
                <Flag className={cn(iconClass, isStarred && "fill-current")} />
            </button>
        </div>
    )
}
