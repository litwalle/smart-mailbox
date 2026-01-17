import * as React from "react"
import { Button } from "@/components/ui/Button"

export function ComposeActionbar() {
    const iconStyle = { fontVariationSettings: "'wght' 300" } // 1.5px stroke standard
    const iconClass = "material-symbols-outlined text-[20px]" // Standard size

    const btnBase = "h-9 px-2.5 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all gap-1.5 active:scale-95 flex items-center"
    const btnIconOnly = "h-9 w-9 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all flex items-center justify-center active:scale-95"

    return (
        <div className="px-5 py-3 flex items-center justify-between bg-white select-none shrink-0 border-b border-transparent">
            {/* Left Actions */}
            <div className="flex items-center gap-3">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-5 h-9 shadow-md shadow-blue-600/10 gap-2 transition-all active:scale-95">
                    <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: "'wght' 300" }}>send</span>
                    <span className="font-semibold text-[14px]">Send</span>
                </Button>

                <div className="flex items-center gap-0.5">
                    <Button variant="ghost" size="icon" className={btnIconOnly} title="Save Draft">
                        <span className={iconClass} style={iconStyle}>save</span>
                    </Button>

                    <Button variant="ghost" className={btnBase} title="Attach File">
                        <span className={iconClass} style={iconStyle}>attach_file</span>
                        <span className="material-symbols-outlined text-[18px] text-slate-400" style={iconStyle}>expand_more</span>
                    </Button>

                    <Button variant="ghost" className={btnBase} title="Security Options">
                        <span className={iconClass} style={iconStyle}>lock</span>
                        <span className="material-symbols-outlined text-[18px] text-slate-400" style={iconStyle}>expand_more</span>
                    </Button>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon" className={btnIconOnly} title="Add Person">
                    <span className={iconClass} style={iconStyle}>person_add</span>
                </Button>
                <div className="h-4 w-[1px] bg-slate-200 mx-1" />
                <Button variant="ghost" size="icon" className={btnIconOnly} title="More Options">
                    <span className={iconClass} style={iconStyle}>more_horiz</span>
                </Button>
            </div>
        </div>
    )
}
