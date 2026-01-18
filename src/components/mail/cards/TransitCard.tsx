import * as React from "react"
import { BaseCard } from "./BaseCard"
import { FocusCardActions } from "./FocusCardActions"
import { MeetingCard } from "./MeetingCard"
import { cn } from "@/lib/utils"

interface TransitStep {
    type: 'bus' | 'walk' | 'subway'
    instruction: string
    time: string
    from: string
    to: string
}

interface TransitCardProps {
    card: {
        id: string
        title: string
        timeDisplay?: string
        relatedEmailId?: string
        meetingData?: {
            id?: string
            title?: string
            time?: string
            location: string
            attendees: string[]
            tags?: string[]
        }
        transitData: {
            departureTime: string
            steps: TransitStep[]
            suggestedAction?: string
        }
        actions: Array<{ label: string; isPrimary?: boolean }>
    },
    isSelected?: boolean
    selectedEmailId?: string | null
    onAction?: (id: string, action: string) => void
}

export function TransitCard({ card, isSelected, selectedEmailId, onAction }: TransitCardProps) {
    // Determine title: Use suggestedAction if available, otherwise "建议出发"
    // Wait, user requested specific title: "从C区出发去F区参加会议"
    // So we use card.transitData.suggestedAction which we just added.
    const displayTitle = card.transitData.suggestedAction || "建议出发";

    return (
        <BaseCard
            isSpecial
            isSelected={isSelected}
            className="border-blue-100/50"
            // Title
            icon={
                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                    <span className="material-symbols-outlined text-[18px]">directions_car</span>
                </div>
            }
            title={displayTitle}
            // Subtitle: Uses original "预计...出发"
            subtitle={`预计 ${card.transitData.departureTime} 出发`}
            time={card.timeDisplay || "Now"}
            onComplete={() => onAction?.(card.id, 'archive')}
            footer={<FocusCardActions actions={card.actions} />}
        >
            {/* Content Body: Map + Meeting Info + Steps */}
            <div>
                {/* 
                    "Meeting Card in the Card": 
                    Render the target meeting info if available.
                    This addresses "You lost the meeting card".
                 */}
                {card.meetingData && (
                    <MeetingCard
                        meeting={{
                            id: card.meetingData.id || 'target-meeting',
                            title: card.meetingData.title || card.title,
                            time: card.meetingData.time || '14:00 - 15:00',
                            location: card.meetingData.location,
                            attendees: card.meetingData.attendees,
                            tags: card.meetingData.tags || []
                        }}
                        compact
                        isSelected={card.relatedEmailId === selectedEmailId}
                        className="mb-5 -mt-1 bg-blue-50/50 border-blue-100/60 shadow-none"
                    />
                )}

                {/* Visual Route Container - Dotted Background + Simple Route */}
                <div className="h-28 bg-slate-50/50 border border-slate-200/60 rounded-xl relative overflow-hidden mb-5 mt-1 group-hover:border-blue-200 transition-colors">

                    {/* Dotted Grid Background */}
                    <div className="absolute inset-0 opacity-[0.15]"
                        style={{
                            backgroundImage: 'radial-gradient(#475569 1px, transparent 1px)',
                            backgroundSize: '16px 16px'
                        }}>
                    </div>

                    {/* Simple SVG Route Connection */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none" preserveAspectRatio="none">
                        {/* Gradient Definition */}
                        <defs>
                            <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#10b981" /> {/* Emerald-500 */}
                                <stop offset="100%" stopColor="#8b5cf6" /> {/* Violet-500 */}
                            </linearGradient>
                        </defs>

                        {/* Connecting Line (Curved) */}
                        <path
                            d="M60,65 C120,65 180,50 240,50"
                            stroke="url(#routeGradient)"
                            strokeWidth="1.5"
                            fill="none"
                            strokeLinecap="round"
                            strokeDasharray="6 4"
                            className="drop-shadow-sm"
                        />
                    </svg>

                    {/* Start Node: C区 */}
                    <div className="absolute left-[60px] top-[65px] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                        <div className="mb-2 px-2 py-0.5 bg-white shadow-sm border border-slate-100 rounded text-[11px] font-bold text-slate-600 whitespace-nowrap">
                            C 区
                        </div>
                        <div className="w-4 h-4 rounded-full bg-white border-[3px] border-emerald-500 shadow-sm z-10"></div>
                    </div>

                    {/* End Node: F区 */}
                    <div className="absolute left-[240px] top-[50px] -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
                        <div className="mb-2 px-2 py-0.5 bg-white shadow-sm border border-slate-100 rounded text-[11px] font-bold text-slate-600 whitespace-nowrap">
                            F 区
                        </div>
                        <div className="w-4 h-4 rounded-full bg-white border-[3px] border-violet-500 shadow-sm z-10"></div>
                    </div>
                </div>

                {/* Steps List */}
                <div className="relative space-y-0">
                    {/* Continuous Vertical Line Background - Aligned with Header Icon (X=20px) */}
                    <div className="absolute left-5 top-4 bottom-4 w-[2px] bg-slate-100 -translate-x-1/2"></div>

                    {card.transitData.steps.map((step, idx) => (
                        <div key={idx} className="relative flex group/step pb-6 last:pb-1">
                            {/* Icon Column - w-10 to match Header Icon width, centered content */}
                            <div className="w-10 shrink-0 flex flex-col items-center relative z-10">
                                <div className="bg-white p-1 rounded-full shadow-sm border border-slate-100 group-hover/step:border-blue-200 group-hover/step:scale-110 transition-all">
                                    {step.type === 'bus' ? (
                                        <div className="h-6 w-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[14px]">directions_bus</span>
                                        </div>
                                    ) : (
                                        <div className="h-6 w-6 bg-slate-100 text-slate-500 rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[14px]">directions_walk</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0 flex items-center justify-between pl-3 pt-1.5">
                                <div>
                                    <span className="text-[14px] font-bold text-slate-700 block">{step.instruction}</span>
                                    <div className="text-xs text-slate-500 truncate font-medium mt-0.5">
                                        {step.from} <span className="text-slate-300 mx-1">→</span> {step.to}
                                    </div>
                                </div>
                                <span className="text-xs font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded text-center min-w-[50px]">{step.time}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </BaseCard>
    )
}
