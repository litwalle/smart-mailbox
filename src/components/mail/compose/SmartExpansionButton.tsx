import * as React from "react"
import { Button } from "@/components/ui/Button"

interface SmartExpansionButtonProps {
    position: DOMRect | null
    isVisible: boolean
    onClick: () => void
}

export function SmartExpansionButton({ position, isVisible, onClick }: SmartExpansionButtonProps) {
    if (!position || !isVisible) return null

    // Position it right after the cursor
    const top = position.top - 4 // slight adjustment
    const left = position.left + 2

    return (
        <div
            className="fixed z-[60] animate-in fade-in duration-200"
            style={{ top: `${top}px`, left: `${left}px` }}
        >
            <Button
                variant="ghost"
                size="sm"
                className="h-6 gap-1 px-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 border border-indigo-100 rounded-lg shadow-sm"
                onClick={onClick}
            >
                <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                <span className="text-[10px] font-semibold">Expand</span>
            </Button>
        </div>
    )
}
