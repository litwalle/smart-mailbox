import * as React from "react"
import { Button } from "@/components/ui/Button"

interface FloatingAssistantBarProps {
    position: DOMRect | null
    onAction: (action: string) => void
}

export function FloatingAssistantBar({ position, onAction }: FloatingAssistantBarProps) {
    if (!position) return null

    // Calculate position relative to viewport, but we usually want it relative to the container if possible.
    // For simplicity, we use fixed/absolute positioning based on the Rect.
    // We'll trust the parent to pass us a `position` that makes sense or we use `fixed` styles.

    // Position it slightly above the selection
    const top = position.top - 50
    const left = position.left

    return (
        <div
            className="fixed z-[60] flex items-center gap-1 p-1 bg-white rounded-full shadow-xl border border-indigo-100 animate-in fade-in zoom-in-95 duration-150"
            style={{ top: `${top}px`, left: `${left}px` }}
        >
            <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 pl-2 pr-3 text-indigo-600 hover:bg-indigo-50 rounded-full"
                onClick={() => onAction('polish')}
            >
                <span className="material-symbols-outlined text-[18px]">magic_button</span>
                <span className="text-xs font-medium">Polish</span>
            </Button>

            <div className="w-[1px] h-4 bg-slate-200" />

            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-500" title="Proofread" onClick={() => onAction('fix')}>
                <span className="material-symbols-outlined text-[18px]">spellcheck</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-500" title="Translate" onClick={() => onAction('translate')}>
                <span className="material-symbols-outlined text-[18px]">translate</span>
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full text-slate-500" title="Shorten" onClick={() => onAction('shorten')}>
                <span className="material-symbols-outlined text-[18px]">compress</span>
            </Button>
        </div>
    )
}
