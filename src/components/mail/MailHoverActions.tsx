import * as React from "react"
import { cn } from "@/lib/utils"
// We use react-icons/lu for 1.5px stroke line icons as requested
import {
    LuCheck,
    LuTrash2,
    LuMail,
    LuMailOpen,
    LuFlag,
    LuArchive,
    LuClock
} from "react-icons/lu"

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
            "flex items-center gap-1 p-1 bg-white rounded-lg shadow-sm border border-slate-100",
            className
        )}>
            <button
                onClick={(e) => handleAction(e, onArchive)}
                className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                title="Archive"
            >
                <LuArchive className={iconClass} />
            </button>
            <button
                onClick={(e) => handleAction(e, onDelete)}
                className="p-1 text-slate-500 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                title="Delete"
            >
                <LuTrash2 className={iconClass} />
            </button>
            <button
                onClick={(e) => handleAction(e, onComplete)}
                className="p-1 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors"
                title="Complete"
            >
                <LuCheck className={iconClass} />
            </button>
            <button
                // Using Clock as a placeholder for "Snooze" if needed, but user mentioned specific 5.
                // Re-reading user request: "完成，删除，已读/未读，旗标、归档".
                // I will stick to these 5.
                onClick={(e) => handleAction(e, onToggleRead)} // Maybe "Snooze" isn't in the list?
                // Wait, Figure 2 has 5 icons. Box, Trash, Check, Clock, Tag? 
                // User text says: "Complete, Delete, Read/Unread, Flag, Archive".
                // User text "Complete" = Check. "Delete" = Trash. "Archive" = Box. "Read/Unread" = Mail. "Flag" = Flag.
                // The image might be different, visual "Clock" usually means Snooze. 
                // I will follow the TEXT instructions for functionality but maybe add Snooze if it fits. 
                // Actually, let's stick to the text: Complete, Delete, Read/Unread, Flag, Archive.
                // That is 5 items.
                className="p-1 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors"
                title={isRead ? "Mark as Unread" : "Mark as Read"}
            >
                {isRead ? <LuMail className={iconClass} /> : <LuMailOpen className={iconClass} />}
            </button>
            <button
                onClick={(e) => handleAction(e, onToggleFlag)}
                className={cn(
                    "p-1 rounded-md transition-colors hover:bg-slate-100",
                    isStarred ? "text-yellow-500 hover:text-yellow-600" : "text-slate-500 hover:text-slate-900"
                )}
                title="Flag"
            >
                <LuFlag className={cn(iconClass, isStarred && "fill-current")} />
            </button>
        </div>
    )
}
