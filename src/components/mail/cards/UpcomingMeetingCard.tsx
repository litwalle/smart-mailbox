import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { BaseCard } from "./BaseCard"

interface UpcomingMeetingCardProps {
    card: {
        id: string
        title: string
        relatedEmailId?: string
        timeDisplay?: string
        summary?: string
        meetingData: {
            id?: string
            title?: string
            time?: string
            location: string
            attendees: string[]
            tags?: string[]
        }
    },
    onJoin?: () => void
    onDismiss?: () => void
    isSelected?: boolean
}

export function UpcomingMeetingCard({ card, onJoin, onDismiss, isSelected }: UpcomingMeetingCardProps) {
    const attendeeCount = card.meetingData.attendees.length

    const getInitials = (name: string) => name.substring(0, 2).toUpperCase()

    const getAvatarColor = (name: string) => {
        const colors = [
            "bg-blue-100 text-blue-600 border-blue-200",
            "bg-purple-100 text-purple-600 border-purple-200",
            "bg-emerald-100 text-emerald-600 border-emerald-200",
            "bg-amber-100 text-amber-600 border-amber-200",
            "bg-pink-100 text-pink-600 border-pink-200",
        ]
        let hash = 0
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash)
        }
        return colors[Math.abs(hash) % colors.length]
    }

    const getTagStyle = (tag: string) => {
        if (tag === '即将开始') return "bg-blue-50 text-blue-600 border-blue-100"
        if (tag === '内部') return "bg-slate-100 text-slate-500 border-slate-200"
        return "bg-slate-100 text-slate-500 border-slate-200"
    }

    return (
        <BaseCard
            isSelected={isSelected}
            // Header - consistent with other cards
            icon={
                <div className="w-8 h-8 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600">
                    <span className="material-symbols-outlined text-[18px]">calendar_today</span>
                </div>
            }
            title="即将开始的会议"
            onComplete={onDismiss}
        >
            {/* Meeting Title & Tags */}
            <div className="mt-2">
                <h3 className="text-[20px] font-bold text-slate-800 leading-tight">
                    {card.meetingData.title || card.title}
                </h3>
                {card.meetingData.tags && card.meetingData.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {card.meetingData.tags.map(tag => (
                            <span key={tag} className={cn(
                                "px-2 py-0.5 rounded-md text-[11px] font-medium border",
                                getTagStyle(tag)
                            )}>
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Time Row: Time Badge + Countdown + Join Button */}
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                    <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 font-semibold text-[14px]">
                        {card.meetingData.time || "14:00 - 15:00"}
                    </span>

                    {/* Countdown */}
                    <span className="flex items-center gap-2 text-blue-600 font-medium text-[14px]">
                        <span className="relative flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
                        </span>
                        15 min left
                    </span>
                </div>

                {/* Join Button - Outlined Style matching screenshot */}
                <Button
                    size="sm"
                    variant="outline"
                    className="h-9 px-4 rounded-lg border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200"
                    onClick={(e) => {
                        e.stopPropagation()
                        onJoin?.()
                    }}
                >
                    <span className="material-symbols-outlined text-[18px] mr-1.5">videocam</span>
                    Join
                </Button>
            </div>

            {/* AI Insight */}
            {card.summary && (
                <div className="flex items-start gap-3 mt-4 p-3 bg-slate-50/50 rounded-xl">
                    <div className="shrink-0 mt-0.5 text-slate-400">
                        <span className="material-symbols-outlined text-[18px]">auto_awesome</span>
                    </div>
                    <p className="text-[13px] text-slate-600 leading-relaxed">
                        {card.summary}
                    </p>
                </div>
            )}

            {/* Footer: Attendees & Location */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                <div className="flex items-center gap-3">
                    <div className="flex -space-x-2">
                        {card.meetingData.attendees.slice(0, 3).map((attendee, i) => (
                            <div
                                key={i}
                                className={cn(
                                    "w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-[10px] font-bold shadow-sm",
                                    getAvatarColor(attendee)
                                )}
                                title={attendee}
                            >
                                {getInitials(attendee)}
                            </div>
                        ))}
                        {attendeeCount > 3 && (
                            <div className="w-7 h-7 rounded-full border-2 border-white bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-bold shadow-sm">
                                +{attendeeCount - 3}
                            </div>
                        )}
                    </div>
                    <span className="text-[13px] font-medium text-slate-500">
                        {attendeeCount} Participants
                    </span>
                </div>

                <div className="flex items-center gap-1.5 text-slate-400 text-[13px]">
                    <span className="material-symbols-outlined text-[16px]">location_on</span>
                    <span>{card.meetingData.location}</span>
                </div>
            </div>
        </BaseCard>
    )
}
