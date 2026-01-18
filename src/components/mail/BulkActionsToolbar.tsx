import * as React from "react"
import { cn } from "@/lib/utils"
import { Archive, Trash2, Mail, X, Check } from "lucide-react"

interface BulkActionsToolbarProps {
    selectedCount: number
    mode: 'header' | 'floating'
    onArchive?: () => void
    onDelete?: () => void
    onMarkUnread?: () => void
    onClose: () => void
    onSelectAll?: () => void
    isAllSelected?: boolean
    className?: string
}

export function BulkActionsToolbar({
    selectedCount,
    mode,
    onArchive,
    onDelete,
    onMarkUnread,
    onClose,
    onSelectAll,
    isAllSelected,
    className
}: BulkActionsToolbarProps) {
    if (mode === 'header') {
        return (
            <div className={cn("flex items-center justify-between w-full h-12 px-4 bg-background-primary/80 backdrop-blur-sm border-b border-comp-divider sticky top-0 z-10", className)}>
                {/* Left: Count */}
                <div className="flex items-center gap-3">
                    <div className="w-5 flex justify-center shrink-0">
                        {/* Checkbox triggers Select All */}
                        <div
                            onClick={onSelectAll}
                            className="w-4 h-4 rounded-[5px] border-2 border-brand bg-brand flex items-center justify-center cursor-pointer opacity-90 transition-all hover:scale-110 active:scale-95 shadow-sm"
                        >
                            {isAllSelected ? (
                                <Check className="w-3 h-3 text-white stroke-[3px]" />
                            ) : (
                                <div className="w-1.5 h-1.5 bg-white rounded-full opacity-0" /> // Hidden dot when not selected? Actually just show check if selected.
                            )}
                        </div>
                    </div>
                    <span className="font-semibold text-font-primary text-sm tracking-tight">
                        {selectedCount} Selected
                    </span>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <button onClick={onArchive} className="p-2 text-icon-secondary hover:text-icon-primary hover:bg-background-secondary rounded-lg transition-colors" title="Archive">
                        <Archive className="w-5 h-5 stroke-[1.5px]" />
                    </button>
                    <button onClick={onDelete} className="p-2 text-icon-secondary hover:text-warning hover:bg-warning/10 rounded-lg transition-colors" title="Delete">
                        <Trash2 className="w-5 h-5 stroke-[1.5px]" />
                    </button>
                    <button onClick={onMarkUnread} className="p-2 text-icon-secondary hover:text-icon-primary hover:bg-background-secondary rounded-lg transition-colors" title="Mark Unread">
                        <Mail className="w-5 h-5 stroke-[1.5px]" />
                    </button>

                    {/* Divider */}
                    <div className="h-4 w-px bg-comp-divider mx-1" />

                    {/* Close Button */}
                    <button onClick={onClose} className="p-2 text-icon-tertiary hover:text-icon-primary hover:bg-background-secondary rounded-lg transition-colors" title="Cancel Selection">
                        <X className="w-5 h-5 stroke-[1.5px]" />
                    </button>
                </div>
            </div>
        )
    }

    // Floating Mode (for Detail View)
    return (
        <div className={cn(
            "flex flex-col items-center gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 z-40",
            className
        )}>
            {/* Pill Label */}
            <div className="text-xl font-medium text-font-primary bg-background-primary/80 px-5 py-1.5 rounded-full backdrop-blur-md border border-comp-divider shadow-card mb-2">
                {selectedCount} Selected
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-1 bg-background-primary p-2 pr-3 rounded-2xl shadow-floating border border-comp-divider">
                {/* Action Bar Background & Padding Adjusted */}

                <button onClick={onArchive} className="flex items-center gap-2 px-3 py-2 hover:bg-background-secondary rounded-xl transition-colors text-font-primary font-medium group text-[13px]">
                    <Archive className="w-4 h-4 text-icon-secondary group-hover:text-icon-primary stroke-[1.5px]" />
                    <span>Archive</span>
                </button>
                <button onClick={onDelete} className="flex items-center gap-2 px-3 py-2 hover:bg-warning/10 rounded-xl transition-colors text-font-primary font-medium group text-[13px]">
                    <Trash2 className="w-4 h-4 text-icon-secondary group-hover:text-warning stroke-[1.5px]" />
                    <span>Delete</span>
                </button>
                <button onClick={onMarkUnread} className="flex items-center gap-2 px-3 py-2 hover:bg-background-secondary rounded-xl transition-colors text-font-primary font-medium group text-[13px]">
                    <Mail className="w-4 h-4 text-icon-secondary group-hover:text-icon-primary stroke-[1.5px]" />
                    <span>Unread</span>
                </button>

                {/* Divider */}
                <div className="h-6 w-px bg-comp-divider mx-1" />

                {/* Close Button */}
                <button onClick={onClose} className="p-2 text-icon-tertiary hover:text-icon-primary hover:bg-background-secondary rounded-xl transition-colors">
                    <X className="w-5 h-5 stroke-[1.5px]" />
                </button>
            </div>
        </div>
    )
}
