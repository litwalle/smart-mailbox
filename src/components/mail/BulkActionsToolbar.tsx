import * as React from "react"
import { cn } from "@/lib/utils"
import { LuArchive, LuTrash2, LuMail, LuX, LuCheck } from "react-icons/lu"

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
            <div className={cn("flex items-center justify-between w-full h-12 px-4 bg-white/80 backdrop-blur-sm border-b border-slate-200/60 sticky top-0 z-10", className)}>
                {/* Left: Count */}
                <div className="flex items-center gap-3">
                    <div className="w-5 flex justify-center shrink-0">
                        {/* Checkbox triggers Select All */}
                        <div
                            onClick={onSelectAll}
                            className="w-4 h-4 rounded-[5px] border-2 border-primary bg-primary flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-colors"
                        >
                            {isAllSelected ? (
                                <LuCheck className="w-3 h-3 text-white stroke-[3px]" />
                            ) : (
                                <div className="w-2 h-2 bg-white rounded-[1px]" />
                            )}
                        </div>
                    </div>
                    <span className="font-semibold text-slate-700 text-sm">
                        {selectedCount} Selected
                    </span>
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <button onClick={onArchive} className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" title="Archive">
                        <LuArchive className="w-5 h-5 stroke-[1.5px]" />
                    </button>
                    <button onClick={onDelete} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                        <LuTrash2 className="w-5 h-5 stroke-[1.5px]" />
                    </button>
                    <button onClick={onMarkUnread} className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors" title="Mark Unread">
                        <LuMail className="w-5 h-5 stroke-[1.5px]" />
                    </button>

                    {/* Divider */}
                    <div className="h-4 w-px bg-slate-200 mx-1" />

                    {/* Close Button */}
                    <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors" title="Cancel Selection">
                        <LuX className="w-5 h-5 stroke-[1.5px]" />
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
            <div className="text-xl font-medium text-slate-700 bg-white/80 px-5 py-1.5 rounded-full backdrop-blur-md border border-slate-200/60 shadow-sm mb-2">
                {selectedCount} Selected
            </div>

            {/* Action Bar */}
            <div className="flex items-center gap-1 bg-white p-1.5 pr-3 rounded-2xl shadow-xl border border-slate-100/80">
                {/* Check / Icon Indicator Removed per user request */}

                <button onClick={onArchive} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-700 font-medium group text-sm">
                    <LuArchive className="w-4 h-4 text-slate-500 group-hover:text-slate-900 stroke-[1.5px]" />
                    <span>Archive</span>
                </button>
                <button onClick={onDelete} className="flex items-center gap-2 px-3 py-2 hover:bg-red-50 rounded-xl transition-colors text-slate-700 font-medium group text-sm">
                    <LuTrash2 className="w-4 h-4 text-slate-500 group-hover:text-red-600 stroke-[1.5px]" />
                    <span>Delete</span>
                </button>
                <button onClick={onMarkUnread} className="flex items-center gap-2 px-3 py-2 hover:bg-slate-50 rounded-xl transition-colors text-slate-700 font-medium group text-sm">
                    <LuMail className="w-4 h-4 text-slate-500 group-hover:text-slate-900 stroke-[1.5px]" />
                    <span>Unread</span>
                </button>

                {/* Divider */}
                <div className="h-6 w-px bg-slate-100 mx-1" />

                {/* Close Button */}
                <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors">
                    <LuX className="w-5 h-5 stroke-[1.5px]" />
                </button>
            </div>
        </div>
    )
}
