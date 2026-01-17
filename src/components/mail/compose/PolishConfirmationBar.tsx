import * as React from "react"
import { Button } from "@/components/ui/Button"

interface PolishConfirmationBarProps {
    position: DOMRect | null
    onAccept: () => void
    onRewrite: () => void
    onCancel: () => void
}

export function PolishConfirmationBar({ position, onAccept, onRewrite, onCancel }: PolishConfirmationBarProps) {
    if (!position) return null

    // Position below the selection
    const top = position.bottom + 8
    const left = position.left

    return (
        <div
            className="fixed z-[60] flex items-center gap-2 p-1 bg-slate-900 text-white rounded-lg shadow-xl animate-in fade-in slide-in-from-top-1 duration-200"
            style={{ top: `${top}px`, left: `${left}px` }}
        >
            <div className="flex items-center gap-1 px-2 border-r border-slate-700">
                <span className="text-xs font-medium text-slate-300">Tone: Friendly</span>
            </div>

            <button
                className="hover:bg-slate-700 p-1 px-2 rounded flex items-center gap-1 text-xs font-medium transition-colors"
                onClick={onAccept}
            >
                <span className="material-symbols-outlined text-[14px] text-green-400">check</span>
                Accept
            </button>

            <button
                className="hover:bg-slate-700 p-1 px-2 rounded flex items-center gap-1 text-xs font-medium transition-colors"
                onClick={onRewrite}
            >
                <span className="material-symbols-outlined text-[14px] text-indigo-400">refresh</span>
                Rewrite
            </button>

            <button
                className="hover:bg-red-900/50 p-1 px-2 rounded flex items-center gap-1 text-xs font-medium transition-colors text-slate-300 hover:text-red-200"
                onClick={onCancel}
            >
                <span className="material-symbols-outlined text-[14px]">close</span>
                Cancel
            </button>
        </div>
    )
}
