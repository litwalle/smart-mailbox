import * as React from "react"
import { cn } from "@/lib/utils"

interface TimelineGuidanceProps {
    summary: string
    dateDisplay?: string // e.g. "10月24日 星期三"
    className?: string
}

export function TimelineGuidance({ summary, dateDisplay, className }: TimelineGuidanceProps) {
    // Fallback date generation if not provided
    const displayDate = dateDisplay || new Date().toLocaleDateString('zh-CN', { month: 'long', day: 'numeric', weekday: 'long' });

    return (
        <div className={cn("relative pl-[40px]", className)}>
            {/* Timeline Icon Node - Minimalist Dot */}
            <div className="absolute left-0 top-[18px] z-10 flex items-center justify-center w-8">
                <div className="w-3 h-3 rounded-full bg-blue-500 ring-4 ring-white shadow-sm" />
            </div>

            {/* Content Card */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-brand/30 transition-all duration-300">
                {/* Date Pill */}
                <div className="mb-3">
                    <span className="inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold tracking-wide">
                        {displayDate}
                    </span>
                </div>

                {/* Summary Text */}
                <div
                    className="text-[15px] font-medium text-slate-700 leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: summary }}
                />
            </div>
        </div>
    )
}
