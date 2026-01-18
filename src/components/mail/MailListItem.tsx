import * as React from "react"
import { isToday, isYesterday, format } from "date-fns"
import { cn } from "@/lib/utils"
import { Email } from "@/types/mail"
import { useMailStore } from "@/store/mailStore"
import { MailHoverActions } from "./MailHoverActions"
import {
    Calendar,
    Paperclip,
    CircleAlert,
    Check
} from "lucide-react"

interface MailListItemProps {
    email: Email
    isSelected: boolean
}

// 标签样式配置 - Harmony Semantic Colors
const TAG_STYLES: Record<string, string> = {
    action: "bg-warning/10 text-warning border-warning/30", // Urgent -> Red
    time: "bg-brand/10 text-brand border-brand/30",
    content: "bg-palette-6/15 text-palette-6 border-palette-6/30",
    sender: "bg-background-secondary text-font-secondary border-comp-divider",
    default: "bg-background-secondary text-font-secondary border-comp-divider"
}

export function MailListItem({ email, isSelected }: MailListItemProps) {
    const {
        selectEmail,
        toggleStar,
        markAsRead,
        deleteEmail,
        archiveEmail,
        selectedEmailIds,
        toggleEmailSelection
    } = useMailStore()

    const isMultiSelected = selectedEmailIds.includes(email.id);
    const isMultiSelectMode = selectedEmailIds.length > 0;

    // 处理点击相关逻辑
    const handleAction = (action: (id: string) => void) => (e: React.MouseEvent) => {
        e.stopPropagation()
        action(email.id)
    }

    const handleSelectToggle = (e: React.MouseEvent) => {
        e.stopPropagation()
        toggleEmailSelection(email.id)
    }

    // Smart Date Display
    const timeDisplay = React.useMemo(() => {
        if (!email.sentAt) return ''
        const date = new Date(email.sentAt)
        if (isNaN(date.getTime())) return ''

        if (isToday(date)) {
            return format(date, 'HH:mm')
        } else if (isYesterday(date)) {
            return 'Yesterday'
        }
        return format(date, 'MMM d')
    }, [email.sentAt])

    // Detect if it's a meeting invite
    const isMeeting = React.useMemo(() => {
        const subjectLower = email.subject.toLowerCase()
        return subjectLower.includes('meeting') ||
            subjectLower.includes('invite') ||
            subjectLower.includes('sync') ||
            email.labels?.includes('Meeting')
    }, [email.subject, email.labels])

    // Generate Display Tags (Max 3)
    const displayTags = React.useMemo(() => {
        const tags: { label: string; type: string; color: string }[] = []

        // 1. Action Required (Priority 1) -> RED
        if (email.priority === 'high') {
            tags.push({ label: 'Urgent', type: 'action', color: TAG_STYLES.action })
        }

        // 2. Time Pressure Tags (Priority 1)
        if (email.deadline) {
            tags.push({
                label: email.deadline.includes('Tomorrow') ? 'Tomorrow' : 'Today',
                type: 'time',
                color: TAG_STYLES.time
            })
        }

        // 3. Content Category 
        const contentLabels = email.labels?.filter(l => !['Meeting', 'Work', 'Personal', 'Urgent'].includes(l)) || []
        contentLabels.forEach(l => {
            tags.push({ label: l, type: 'content', color: TAG_STYLES.content })
        })

        // 4. Sender/General
        if (email.labels?.includes('Work')) {
            tags.push({ label: 'Work', type: 'sender', color: TAG_STYLES.sender })
        }

        return tags.slice(0, 3)
    }, [email])

    return (
        <div
            onClick={(e) => {
                if (isMultiSelectMode) {
                    toggleEmailSelection(email.id)
                } else {
                    selectEmail(email.id)
                }
            }}
            className={cn(
                "group relative flex flex-col gap-1 px-4 py-3 rounded-lg border border-transparent cursor-pointer transition-all",
                isSelected || isMultiSelected
                    ? "bg-background-primary border-brand/50 z-10"
                    : "hover:bg-background-primary hover:border-comp-divider bg-transparent",
                (!isSelected && !isMultiSelected && !email.isRead) && "bg-background-primary/40"
            )}
        >
            {/* Row 1: Status + Avatar + Name + Time */}
            <div className="flex justify-between items-center w-full relative h-6">
                <div className="flex items-center gap-3 min-w-0">
                    {/* Unread Container - Fixed width to reserve space and align with checkbox */}
                    <div className="w-5 flex justify-center shrink-0">
                        {/* Unread Dot */}
                        {!email.isRead && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                        )}
                    </div>

                    {/* Avatar */}
                    {email.from.avatar ? (
                        <img
                            src={email.from.avatar}
                            className="h-5 w-5 rounded-full object-cover shrink-0 bg-background-tertiary"
                            alt={email.from.name}
                        />
                    ) : (
                        <div className="h-5 w-5 rounded-full bg-background-secondary border border-comp-divider flex items-center justify-center text-[10px] font-semibold text-font-secondary shrink-0">
                            {email.from.name.charAt(0)}
                        </div>
                    )}

                    <span className={cn(
                        "text-sm truncate",
                        !email.isRead ? "font-semibold text-font-primary" : "font-medium text-font-secondary"
                    )}>
                        {email.from.name}
                    </span>
                </div>

                {/* Right: Time & Icons */}
                <div className="flex items-center gap-2">
                    {email.priority === 'high' && (
                        <CircleAlert className="w-3.5 h-3.5 text-warning stroke-[1.5px]" />
                    )}
                    {email.hasAttachments && (
                        <Paperclip className="w-3.5 h-3.5 text-icon-tertiary stroke-[1.5px]" />
                    )}
                    <span className={cn(
                        "text-xs whitespace-nowrap",
                        !email.isRead ? "text-font-secondary font-medium" : "text-font-tertiary"
                    )}>
                        {timeDisplay}
                    </span>
                </div>

                {/* Hover Action Card - Lighter shadow, moved up/right */}
                <div className="absolute right-[-12px] top-[-8px] opacity-0 group-hover:opacity-100 transition-all duration-200 scale-95 group-hover:scale-100 z-20 pointer-events-none group-hover:pointer-events-auto">
                    <MailHoverActions
                        isRead={email.isRead}
                        isStarred={email.isStarred}
                        onComplete={handleAction((id) => console.log('Complete', id))}
                        onDelete={handleAction(deleteEmail)}
                        onToggleRead={handleAction(markAsRead)}
                        onToggleFlag={handleAction(toggleStar)}
                        onArchive={handleAction(archiveEmail)}
                        className="shadow-sm shadow-comp-divider border-comp-divider bg-background-primary" // Lighter shadow
                    />
                </div>
            </div>

            {/* Row 2: Checkbox + Summary + Tags */}
            <div className="flex items-start gap-3 mt-1 min-h-[20px]">
                {/* Checkbox Area - Aligned with Dot in Row 1 */}
                <div
                    className={cn(
                        "flex justify-center shrink-0 w-5 transition-opacity cursor-pointer mt-0.5",
                        isMultiSelected || isMultiSelectMode ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    )}
                    onClick={handleSelectToggle}
                >
                    <div className={cn(
                        "w-4 h-4 rounded-[5px] border flex items-center justify-center transition-all", // 统一圆角矩形 Unified Rounded Rect
                        isMultiSelected
                            ? "bg-brand border-brand text-font-on-primary"
                            : "border-icon-secondary bg-background-primary hover:border-icon-primary"
                    )}>
                        {isMultiSelected && <Check className="w-3 h-3 stroke-[3px]" />}
                    </div>
                </div>

                <div className="flex-1 min-w-0 flex flex-col gap-1.5 ">
                    {/* Summary - Larger Text, Black Color */}
                    <div className="text-[14px] text-font-primary leading-snug line-clamp-2">
                        {isMeeting && (
                            <Calendar className="w-3.5 h-3.5 text-icon-tertiary inline-block mr-1 align-text-bottom" />
                        )}
                        {email.aiSummary || email.preview}
                    </div>

                    {/* Tags */}
                    {displayTags.length > 0 && (
                        <div className="flex items-center gap-1.5 flex-wrap">
                            {displayTags.map((tag, i) => (
                                <span
                                    key={i}
                                    className={cn(
                                        "px-1.5 py-0.5 rounded text-[10px] font-medium border",
                                        tag.color
                                    )}
                                >
                                    {tag.label}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
