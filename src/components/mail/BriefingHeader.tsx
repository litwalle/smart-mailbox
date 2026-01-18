import * as React from "react"
import { cn } from "@/lib/utils"

interface BriefingHeaderProps {
    headline: string
    summary: string
    dateDisplay: string
    weather?: string
    temperature?: string
}

export function BriefingHeader({ headline, summary, dateDisplay, weather = "Sunny", temperature = "24°C" }: BriefingHeaderProps) {
    const today = new Date()
    const weekDay = today.toLocaleDateString('zh-CN', { weekday: 'long' })
    const fullDate = today.toLocaleDateString('zh-CN', { month: 'long', day: 'numeric' })

    return (
        <div className="relative mb-8 group">
            {/* Subtle Gradient Backing - Keep for ambiance but much lighter/smaller if needed, or remove? User said "pure text". I'll keep it very subtle to not look like a "Card container". */}
            {/* Actually user said "Directly present pure text", implied no container box. */}

            <div className="relative z-10 space-y-4">
                {/* Top Row: Greeting & Meta */}
                <div className="flex items-start justify-between">
                    <h1 className="text-3xl font-black text-font-primary tracking-tight leading-tight">
                        {headline}
                    </h1>

                    {/* Date/Weather Pill */}
                    <div className="flex flex-col items-end">
                        <div className="inline-flex items-center gap-3 bg-background-secondary border border-comp-divider px-3 py-1.5 rounded-full">
                            <div className="flex items-center gap-1.5 text-xs font-semibold text-font-primary">
                                <span>{fullDate}</span>
                                <span className="opacity-50">|</span>
                                <span>{weekDay}</span>
                            </div>
                            <div className="flex items-center gap-1 text-xs text-font-secondary">
                                <span className="material-symbols-outlined text-[16px] text-palette-10">wb_sunny</span>
                                <span>{temperature}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Summary Text */}
                <div
                    className="text-[18px] font-medium text-font-secondary leading-relaxed max-w-2xl tracking-tight [&_b]:font-medium [&_strong]:font-medium"
                    dangerouslySetInnerHTML={{ __html: summary }}
                />
            </div>
        </div>
    )
}
