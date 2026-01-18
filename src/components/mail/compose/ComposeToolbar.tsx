import * as React from "react"
import { Button } from "@/components/ui/Button"

interface ComposeToolbarProps {
    onAiMenuClick: (e: React.MouseEvent) => void
}

export function ComposeToolbar({ onAiMenuClick }: ComposeToolbarProps) {
    // 1. Unified 1.5px Stroke (Weight 300)
    const iconStyle = { fontVariationSettings: "'wght' 300, 'opsz' 20" }
    const iconClass = "material-symbols-outlined text-[20px]"
    const iconSmallClass = "material-symbols-outlined text-[18px]"

    // 2. Tighter, Professional Spacing
    const toolBtnClass = "h-8 w-8 text-icon-secondary hover:text-icon-primary hover:bg-background-secondary rounded-md transition-all flex items-center justify-center active:scale-95"
    const dropdownBtnClass = "flex items-center gap-1 text-[13px] font-medium text-font-secondary hover:text-font-primary hover:bg-background-secondary px-2 h-8 rounded-md transition-all select-none border border-transparent active:scale-95"
    const dividerClass = "h-4 w-[1px] bg-comp-divider mx-1.5" // Clear separation

    return (
        <div className="px-5 py-2 border-y border-comp-divider flex items-center bg-background-primary select-none relative z-20 gap-0.5 touch-auto overflow-x-auto scrollbar-none">
            {/* History */}
            <div className="flex items-center gap-0.5">
                <Button variant="ghost" size="icon" className={toolBtnClass} title="Undo">
                    <span className={iconClass} style={iconStyle}>undo</span>
                </Button>
                <Button variant="ghost" size="icon" className={toolBtnClass} title="Redo">
                    <span className={iconClass} style={iconStyle}>redo</span>
                </Button>
            </div>

            <div className={dividerClass} />

            {/* Paint/Clear */}
            <div className="flex items-center gap-0.5">
                <Button variant="ghost" size="icon" className={toolBtnClass} title="Format Painter">
                    <span className={iconClass} style={iconStyle}>format_paint</span>
                </Button>
                <Button variant="ghost" size="icon" className={toolBtnClass} title="Clear Formatting">
                    <span className={iconClass} style={iconStyle}>format_clear</span>
                </Button>
            </div>

            <div className={dividerClass} />

            {/* Text Style Dropdowns - Tighter */}
            <div className="flex items-center gap-0.5">
                <button className={dropdownBtnClass} style={{ minWidth: '80px', justifyContent: 'space-between' }}>
                    Normal
                    <span className={iconSmallClass}>expand_more</span>
                </button>
                <button className={dropdownBtnClass} style={{ minWidth: '90px', justifyContent: 'space-between' }}>
                    Sans Serif
                    <span className={iconSmallClass}>expand_more</span>
                </button>
                <button className={dropdownBtnClass} style={{ minWidth: '50px', justifyContent: 'space-between' }}>
                    11
                    <span className={iconSmallClass}>expand_more</span>
                </button>
            </div>

            <div className={dividerClass} />

            {/* Basic Formatting */}
            <div className="flex items-center gap-0.5">
                <Button variant="ghost" size="icon" className={toolBtnClass} title="Bold">
                    <span className={iconClass} style={{ fontVariationSettings: "'wght' 500" }}>format_bold</span>
                </Button>
                <Button variant="ghost" size="icon" className={toolBtnClass} title="Italic">
                    <span className={iconClass} style={{ fontVariationSettings: "'wght' 300" }}>format_italic</span>
                </Button>
                <Button variant="ghost" size="icon" className={toolBtnClass} title="Underline">
                    <span className={iconClass} style={{ fontVariationSettings: "'wght' 300" }}>format_underlined</span>
                </Button>
            </div>

            <div className={dividerClass} />

            {/* Color / Highlight */}
            <div className="flex items-center gap-0.5">
                <Button variant="ghost" size="icon" className={toolBtnClass} title="Text Color">
                    <span className={iconClass} style={iconStyle}>format_color_text</span>
                </Button>
                <Button variant="ghost" size="icon" className={toolBtnClass} title="Highlight Color">
                    <span className={iconClass} style={iconStyle}>border_color</span>
                </Button>
            </div>

            <div className="flex-1 min-w-[16px]" /> {/* Spacer */}

            {/* AI/Insert - Right Aligned group */}
            <div className="flex items-center gap-1">
                <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-brand hover:bg-brand/10 hover:text-brand rounded-lg transition-all animate-in fade-in zoom-in active:scale-95 ring-1 ring-transparent hover:ring-brand/10"
                    title="AI Assistant"
                    onClick={onAiMenuClick}
                >
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>auto_awesome</span>
                </Button>

                <div className="h-5 w-[1px] bg-comp-divider mx-1" />

                <Button variant="ghost" size="icon" className={toolBtnClass}>
                    <span className={iconClass} style={iconStyle}>image</span>
                </Button>
                <Button variant="ghost" size="icon" className={toolBtnClass}>
                    <span className={iconClass} style={iconStyle}>grid_view</span>
                </Button>
            </div>

        </div>
    )
}
