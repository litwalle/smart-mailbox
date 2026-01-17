import * as React from "react"
import { Button } from "@/components/ui/Button"

interface ComposeHeaderProps {
    onMinimize: () => void
    onClose: () => void
    onMouseDown: (e: React.MouseEvent) => void
    toggleSidebar: () => void
    isSidebarOpen: boolean
}

export function ComposeHeader({ onMinimize, onClose, onMouseDown, toggleSidebar, isSidebarOpen }: ComposeHeaderProps) {
    const iconStyle = { fontVariationSettings: "'wght' 300" }

    return (
        <div
            className="flex items-center justify-between px-5 py-3 bg-white rounded-t-2xl border-b border-transparent hover:border-slate-50 transition-colors select-none cursor-grab active:cursor-grabbing group"
            onMouseDown={onMouseDown} // Drag handle
        >
            <div className="flex items-baseline gap-3 pointer-events-none">
                <h3 className="font-semibold text-slate-900 text-[14px] tracking-tight">New Message</h3>
                <span className="text-xs text-slate-400 font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-500">Auto-saved 06:20 PM</span>
            </div>

            <div className="flex items-center gap-0.5 pointer-events-auto">
                {/* AI Toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className={`h-8 w-8 rounded-lg transition-all duration-200 ${isSidebarOpen ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100 ring-1 ring-indigo-200/50' : 'text-slate-400 hover:text-indigo-600 hover:bg-slate-100'}`}
                    onClick={(e) => { e.stopPropagation(); toggleSidebar(); }}
                    title={isSidebarOpen ? "Close Assistant" : "Open Assistant"}
                >
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>
                        auto_awesome
                    </span>
                </Button>

                <div className="w-[1px] h-4 bg-slate-200 mx-2" />

                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-slate-100/80 hover:text-slate-700 rounded-lg transition-colors" onClick={(e) => { e.stopPropagation(); onMinimize(); }}>
                    <span className="material-symbols-outlined text-[20px]" style={iconStyle}>remove</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-slate-100/80 hover:text-slate-700 rounded-lg transition-colors" onClick={(e) => { e.stopPropagation(); }}>
                    <span className="material-symbols-outlined text-[18px]" style={iconStyle}>open_in_full</span>
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors" onClick={(e) => { e.stopPropagation(); onClose(); }}>
                    <span className="material-symbols-outlined text-[20px]" style={iconStyle}>close</span>
                </Button>
            </div>
        </div>
    )
}
