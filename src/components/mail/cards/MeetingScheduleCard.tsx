import * as React from "react"
import { BaseCard } from "./BaseCard"
import { FocusCardActions } from "./FocusCardActions"
import { MeetingCard } from "./MeetingCard"
import { cn } from "@/lib/utils"

interface Meeting {
    id: string
    title: string
    time: string
    location: string
    attendees: string[]
    tags: string[]
    relatedEmailId?: string
}

interface MeetingScheduleCardProps {
    card: {
        id: string
        title: string
        timeDisplay?: string
        summary: string
        meetingList: Meeting[]
        actions: Array<{ label: string; isPrimary?: boolean }>
    },
    onAction?: (id: string, action: string) => void
}

export function MeetingScheduleCard({ card, onAction }: MeetingScheduleCardProps) {
    return (
        <BaseCard
            // Header
            icon={
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                </div>
            }
            title={
                <div className="flex items-center gap-2">
                    <span>{card.title}</span>
                    <span className="text-slate-400 font-normal text-sm">({card.meetingList.length})</span>
                </div>
            }
            time={card.timeDisplay}
            subtitle={card.summary}
            onComplete={() => onAction?.(card.id, 'archive')}
            footer={<FocusCardActions actions={card.actions} />}
        >
            {/*
               Optimized Timeline Layout
               - Aligned with Header Icon (which is w-10, centered at 20px relative to padding)
               - Vertical line is absolutely positioned at center of w-10 column (left 20px)
            */}
            <div className="space-y-3 mt-3">
                {card.meetingList.map((meeting) => (
                    <MeetingCard
                        key={meeting.id}
                        meeting={meeting}
                        // If relatedEmailId exists, clicking 'Join' or the card itself could open it.
                        // For 'Join', we might want a specific meeting link, but here we treat it as 'Open Detail'
                        onJoin={() => onAction?.(meeting.id, 'join')}
                        onClick={() => {
                            if (meeting.relatedEmailId) {
                                onAction?.(meeting.relatedEmailId, 'open-email')
                            }
                        }}
                        className="bg-slate-50/50 hover:bg-white border-slate-200/60 cursor-pointer transition-colors"
                    />
                ))}
            </div>
        </BaseCard>
    )
}
