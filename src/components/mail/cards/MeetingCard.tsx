import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"

export interface MeetingData {
    id: string
    title: string
    time: string
    date?: string
    location: string
    attendees: string[]
    tags?: string[]
    isExternal?: boolean
}

interface MeetingCardProps {
    meeting: MeetingData
    className?: string
    compact?: boolean
    onJoin?: () => void
    onClick?: () => void
}

export function MeetingCard({ meeting, className, compact, onJoin, onClick }: MeetingCardProps) {

    // Generate initials for avatars
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    // Hash string to color
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

    // Tag color mapping
    const getTagStyle = (tag: string) => {
        if (tag === '外部') return "bg-blue-50 text-blue-600 border-blue-100"
        if (tag === '重要' || tag === 'Urgent' || tag === 'Important') return "bg-orange-50 text-orange-600 border-orange-100"
        if (tag === '内部') return "bg-slate-100 text-slate-500 border-slate-200"
        return "bg-slate-100 text-slate-500 border-slate-200"
    }

    return (
        <div
            className={cn(
                "bg-white rounded-2xl p-5 border border-slate-100 hover:shadow-lg hover:-translate-y-[2px] transition-all duration-300 cursor-pointer",
                className
            )}
            onClick={onClick}
        >
            {/* Row 1: Title + Join Button */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h3 className="text-[18px] font-bold text-slate-800 leading-tight">
                        {meeting.title}
                    </h3>

                    {/* Tags */}
                    {meeting.tags && meeting.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mt-2">
                            {meeting.tags.map(tag => (
                                <span
                                    key={tag}
                                    className={cn(
                                        "px-2 py-0.5 rounded-md text-[11px] font-medium border",
                                        getTagStyle(tag)
                                    )}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Join Button - Outlined Style */}
                <Button
                    size="sm"
                    variant="outline"
                    className="h-9 px-4 rounded-lg border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 shrink-0"
                    onClick={(e) => {
                        e.stopPropagation()
                        onJoin?.()
                    }}
                >
                    <span className="material-symbols-outlined text-[18px] mr-1.5">videocam</span>
                    Join
                </Button>
            </div>

            {/* Row 2: Date & Time */}
            <div className="flex items-center gap-3 mt-4">
                <div className="w-10 h-10 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400">
                    <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                </div>
                <div>
                    <div className="text-[14px] font-semibold text-slate-700">
                        {meeting.date || "Today, Jan 16"}
                    </div>
                    <div className="text-[13px] text-blue-500 font-medium">
                        {meeting.time}
                    </div>
                </div>
            </div>

            {/* Row 3: Attendees & Location */}
            <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-3">
                    {/* Attendee Avatars */}
                    <div className="flex -space-x-2">
                        {meeting.attendees.slice(0, 3).map((attendee, i) => (
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
                        {meeting.attendees.length > 3 && (
                            <div className="w-7 h-7 rounded-full border-2 border-white bg-amber-100 text-amber-600 flex items-center justify-center text-[10px] font-bold shadow-sm">
                                +{meeting.attendees.length - 3}
                            </div>
                        )}
                    </div>
                    <span className="text-[13px] text-slate-500 font-medium">
                        {meeting.attendees.length} Participants
                    </span>
                </div>

                {/* Location */}
                {meeting.location && (
                    <div className="flex items-center gap-1.5 text-slate-400 text-[13px]">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        <span>{meeting.location}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
