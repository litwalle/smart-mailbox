import * as React from "react"
import { useMailStore } from "@/store/mailStore"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

export function SidebarCollapsed() {
    const { folders, selectedFolderId, selectFolder } = useMailStore()

    // 简化的折叠视图只显示关键图标
    const keyFolders = folders.filter(f => ['inbox', 'important', 'sent', 'updates'].includes(f.id))

    return (
        <div className="flex flex-col h-full py-4 items-center gap-4">
            {/* Brand Icon */}
            <div className="h-10 w-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold shadow-md shadow-primary/30 mb-2 shrink-0">
                SM
            </div>

            <div className="flex flex-col gap-2 w-full px-2">
                <Button size="icon" className="mb-2 rounded-xl shadow-md w-full aspect-square bg-white border border-slate-200 text-primary hover:bg-slate-50">
                    <span className="material-symbols-outlined">add</span>
                </Button>

                {keyFolders.map(folder => (
                    <div key={folder.id} className="relative group flex justify-center">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "w-10 h-10 rounded-xl transition-all",
                                selectedFolderId === folder.id
                                    ? "bg-primary/10 text-primary ring-1 ring-primary/20"
                                    : "text-slate-500 hover:bg-slate-100"
                            )}
                            onClick={() => selectFolder(folder.id)}
                        >
                            <span className={cn(
                                "material-symbols-outlined",
                                folder.color
                            )}>
                                {folder.icon}
                            </span>
                        </Button>
                        {/* Unread dot */}
                        {folder.unreadCount && folder.unreadCount > 0 && (
                            <span className="absolute top-1 right-1 h-2.5 w-2.5 bg-red-500 border-2 border-white rounded-full"></span>
                        )}
                        {/* Tooltip on hover (simple) */}
                        <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
                            {folder.name}
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-auto pb-2">
                <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                    <span className="material-symbols-outlined">settings</span>
                </Button>
            </div>
        </div>
    )
}
