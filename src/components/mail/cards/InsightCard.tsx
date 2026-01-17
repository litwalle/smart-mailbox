import * as React from "react"
import { BaseCard } from "./BaseCard"
import { FocusCardActions } from "./FocusCardActions"
import { cn } from "@/lib/utils"

interface InsightCardProps {
    card: {
        id: string
        title: string
        summary: string
        timeDisplay?: string
        insightData: {
            imageUrl: string
            tag: string
            source: string
        }
        actions: Array<{ label: string; isPrimary?: boolean }>
    },
    onAction?: (id: string, action: string) => void
}

export function InsightCard({ card, onAction }: InsightCardProps) {
    return (
        <BaseCard
            className="group"
            // Standard Header
            icon={
                <div className="w-8 h-8 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                    <span className="material-symbols-outlined text-[18px]">lightbulb</span>
                </div>
            }
            title={card.title}
            time={card.timeDisplay || "Today"}
            onComplete={() => onAction?.(card.id, 'archive')}
            footer={<FocusCardActions actions={card.actions} />}
        >
            {/* Content Body */}
            <div className="mt-1">
                {/* Hero Image - Now inside content */}
                <div className="h-40 w-full relative overflow-hidden rounded-xl border border-slate-100 mb-4">
                    <img
                        src={card.insightData.imageUrl}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        alt="Insight Cover"
                    />

                    {/* Tag Overlay */}
                    <div className="absolute top-3 left-3">
                        <span className="text-[10px] font-bold bg-white/90 backdrop-blur-md px-2 py-0.5 rounded border border-white/20 uppercase tracking-wider shadow-sm text-slate-800">
                            {card.insightData.tag}
                        </span>
                    </div>
                </div>

                {/* Summary */}
                <p className="text-[14px] text-slate-600 leading-relaxed mb-1 line-clamp-3">
                    {card.summary}
                </p>

                <div className="mt-2 text-xs font-medium text-slate-400 flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                    Recommended by {card.insightData.source}
                </div>
            </div>
        </BaseCard>
    )
}
