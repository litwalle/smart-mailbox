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
    isSelected?: boolean
    onJoin?: () => void
    onClick?: () => void
}

export function MeetingCard({ meeting, className, compact, isSelected, onJoin, onClick }: MeetingCardProps) {

    // Generate initials for avatars
    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
    }

    // Hash string to color - Using Harmony palette
    const getAvatarColor = (name: string) => {
        const colors = [
            "bg-brand/15 text-brand border-brand/20",
            "bg-palette-6/15 text-palette-6 border-palette-6/20",
            "bg-confirm/15 text-confirm border-confirm/20",
            "bg-palette-10/15 text-palette-10 border-palette-10/20",
            "bg-warning/15 text-warning border-warning/20",
        ]
        let hash = 0
        for (let i = 0; i < name.length; i++) {
            hash = name.charCodeAt(i) + ((hash << 5) - hash)
        }
        return colors[Math.abs(hash) % colors.length]
    }

    // Tag color mapping - Using Harmony tokens
    const getTagStyle = (tag: string) => {
        if (tag === '外部') return "bg-brand/10 text-brand border-brand/20"
        if (tag === '重要' || tag === 'Urgent' || tag === 'Important') return "bg-warning/10 text-warning border-warning/20"
        if (tag === '内部') return "bg-background-secondary text-font-secondary border-comp-divider"
        return "bg-background-secondary text-font-secondary border-comp-divider"
    }

    return (
        <div
            className={cn(
                "bg-background-primary rounded-lg p-5 border transition-all duration-300 cursor-pointer",
                isSelected ? "border-brand/50 z-10" : "border-comp-divider",
                !isSelected && "hover:-translate-y-[2px] hover:border-brand/30",
                className
            )}
            onClick={onClick}
        >
            {/* Row 1: Title + Join Button */}
            <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <h3 className="text-[18px] font-bold text-font-primary leading-tight">
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
                    className="h-9 px-4 rounded-lg border-comp-divider text-font-secondary hover:bg-comp-emphasize-tertiary hover:text-brand hover:border-brand/20 shrink-0"
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
                <div className="w-10 h-10 rounded-lg bg-background-secondary border border-comp-divider flex items-center justify-center text-icon-tertiary">
                    <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                </div>
                <div>
                    <div className="text-[14px] font-semibold text-font-primary">
                        {meeting.date || "Today, Jan 16"}
                    </div>
                    <div className="text-[13px] text-brand font-medium">
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
                                    "w-7 h-7 rounded-full border-2 border-background-primary flex items-center justify-center text-[10px] font-bold shadow-sm",
                                    getAvatarColor(attendee)
                                )}
                                title={attendee}
                            >
                                {getInitials(attendee)}
                            </div>
                        ))}
                        {meeting.attendees.length > 3 && (
                            <div className="w-7 h-7 rounded-full border-2 border-background-primary bg-palette-10/15 text-palette-10 flex items-center justify-center text-[10px] font-bold shadow-sm">
                                +{meeting.attendees.length - 3}
                            </div>
                        )}
                    </div>
                    <span className="text-[13px] text-font-secondary font-medium">
                        {meeting.attendees.length} Participants
                    </span>
                </div>

                {/* Location */}
                {meeting.location && (
                    <div className="flex items-center gap-1.5 text-icon-tertiary text-[13px]">
                        <span className="material-symbols-outlined text-[16px]">location_on</span>
                        <span>{meeting.location}</span>
                    </div>
                )}
            </div>
        </div>
    )
}
