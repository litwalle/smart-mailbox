import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { SmartFolderConfig } from "./types"

// Palette color mapping for background and icon colors
const PALETTE_BG: Record<string, string> = {
    'palette-1': 'bg-palette-1/15',
    'palette-2': 'bg-palette-2/15',
    'palette-3': 'bg-palette-3/15',
    'palette-4': 'bg-palette-4/15',
    'palette-5': 'bg-palette-5/15',
    'palette-6': 'bg-palette-6/15',
    'palette-7': 'bg-palette-7/15',
    'palette-8': 'bg-palette-8/15',
    'palette-9': 'bg-palette-9/15',
    'palette-10': 'bg-palette-10/15',
    'palette-11': 'bg-palette-11/15',
    'palette-12': 'bg-palette-12/15',
}

const PALETTE_TEXT: Record<string, string> = {
    'palette-1': 'text-palette-1',
    'palette-2': 'text-palette-2',
    'palette-3': 'text-palette-3',
    'palette-4': 'text-palette-4',
    'palette-5': 'text-palette-5',
    'palette-6': 'text-palette-6',
    'palette-7': 'text-palette-7',
    'palette-8': 'text-palette-8',
    'palette-9': 'text-palette-9',
    'palette-10': 'text-palette-10',
    'palette-11': 'text-palette-11',
    'palette-12': 'text-palette-12',
}

interface SmartViewViewListPanelProps {
    folders: SmartFolderConfig[]
    selectedViewId: string | null
    onSelectView: (id: string) => void
    onUpdateFolder: (id: string, updates: Partial<SmartFolderConfig>) => void
    onRemoveFolder: (id: string) => void
    matchCounts: Record<string, number> // viewId -> count
}

export function SmartViewViewListPanel({
    folders,
    selectedViewId,
    onSelectView,
    onUpdateFolder,
    onRemoveFolder,
    matchCounts
}: SmartViewViewListPanelProps) {
    const [editingId, setEditingId] = React.useState<string | null>(null)

    const handleRename = (id: string, newName: string) => {
        if (newName.trim()) {
            onUpdateFolder(id, { name: newName.trim() })
        }
        setEditingId(null)
    }

    return (
        <div className="w-[300px] border-r border-comp-divider bg-background-primary flex flex-col h-full">
            {/* Header */}
            <div className="h-12 px-4 flex items-center justify-between border-b border-comp-divider shrink-0">
                <h3 className="text-xs font-bold text-font-tertiary uppercase tracking-wider">即将创建的视图</h3>
                <span className="text-xs text-font-tertiary">共 {folders.length} 个视图</span>
            </div>

            {/* View List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2">
                <AnimatePresence mode="popLayout">
                    {folders.map((folder, index) => {
                        const bgClass = PALETTE_BG[folder.color] || 'bg-background-secondary'
                        const textClass = PALETTE_TEXT[folder.color] || 'text-icon-secondary'
                        const isSelected = selectedViewId === folder.id
                        const matchCount = matchCounts[folder.id] || 0

                        return (
                            <motion.div
                                key={folder.id}
                                layout
                                exit={{ opacity: 0, scale: 0.95 }}
                                onClick={() => onSelectView(folder.id)}
                                className={cn(
                                    "group flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all border",
                                    isSelected
                                        ? "bg-brand/5 border-brand shadow-sm"
                                        : "bg-white border-comp-divider hover:border-brand/30 hover:shadow-sm"
                                )}
                            >
                                {/* Icon */}
                                <div className={cn(
                                    "size-9 rounded-lg flex items-center justify-center shrink-0",
                                    bgClass
                                )}>
                                    <span className={cn("material-symbols-outlined text-[20px]", textClass)}>
                                        {folder.icon}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="flex-1 min-w-0">
                                    {editingId === folder.id ? (
                                        <input
                                            autoFocus
                                            defaultValue={folder.name}
                                            onBlur={(e) => handleRename(folder.id, e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') handleRename(folder.id, e.currentTarget.value)
                                                if (e.key === 'Escape') setEditingId(null)
                                            }}
                                            onClick={(e) => e.stopPropagation()}
                                            className="w-full bg-transparent text-sm font-medium text-font-primary outline-none border-b border-brand"
                                        />
                                    ) : (
                                        <div
                                            className="text-sm font-medium text-font-primary truncate"
                                            onDoubleClick={(e) => {
                                                e.stopPropagation()
                                                setEditingId(folder.id)
                                            }}
                                        >
                                            {folder.name}
                                        </div>
                                    )}
                                    <div className="text-[11px] text-font-tertiary mt-0.5">
                                        {matchCount > 0 ? `${matchCount} 封邮件匹配` : '暂无匹配'}
                                    </div>
                                </div>

                                {/* Actions (visible on hover) */}
                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            setEditingId(folder.id)
                                        }}
                                        className="p-1 text-icon-tertiary hover:text-icon-primary rounded transition-colors"
                                        title="重命名"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">edit</span>
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation()
                                            onRemoveFolder(folder.id)
                                        }}
                                        className="p-1 text-icon-tertiary hover:text-warning rounded transition-colors"
                                        title="删除"
                                    >
                                        <span className="material-symbols-outlined text-[16px]">delete</span>
                                    </button>
                                </div>
                            </motion.div>
                        )
                    })}
                </AnimatePresence>

                {folders.length === 0 && (
                    <div className="text-center py-12 text-font-tertiary text-sm">
                        <span className="material-symbols-outlined text-[32px] text-icon-fourth mb-2 block">folder_off</span>
                        未配置视图
                    </div>
                )}
            </div>
        </div>
    )
}
