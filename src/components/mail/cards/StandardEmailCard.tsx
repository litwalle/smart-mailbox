import * as React from "react"
import { BaseCard } from "./BaseCard"
import { FocusCardActions } from "./FocusCardActions"
import { cn } from "@/lib/utils"

interface StandardEmailCardProps {
    card: {
        id: string
        title: string
        relatedEmailId?: string
        summary: string
        timeDisplay?: string
        relatedEmail?: {
            subject: string
            from: {
                name: string
                avatar?: string
            }
        }
        type?: string
        isImportant?: boolean
        actions: Array<{ label: string; isPrimary?: boolean }>
    },
    isHovered?: boolean
    isSelected?: boolean
    onArchive?: (id: string) => void
}

export function StandardEmailCard({ card, isHovered, isSelected, onArchive }: StandardEmailCardProps) {

    // 1. Icon Logic
    const renderIcon = () => {
        if (card.type === 'meeting') {
            return (
                <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-blue-600 ring-2 ring-white shadow-sm">
                    <span className="material-symbols-outlined text-[18px]">calendar_month</span>
                </div>
            )
        }
        if (card.relatedEmail?.from?.avatar) {
            return <img src={card.relatedEmail.from.avatar} className="w-8 h-8 rounded-full object-cover ring-2 ring-white shadow-sm" />
        }
        return (
            <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center text-slate-500 font-bold text-sm ring-2 ring-white shadow-sm">
                {(card.relatedEmail?.from?.name || card.title).charAt(0)}
            </div>
        )
    }

    const senderName = card.relatedEmail?.from?.name || (card.type === 'meeting' ? 'Meeting' : card.title)

    // Duplicate Check: If Title == Sender Name, use Subject if available, or just hide title in body.
    // In Mock: Title="Sarah Johnson", Subject(relatedEmail)="Sarah has accepted..." (wait, subject is "Sarah Johnson" in screenshot?). 
    // Actually screenshot content says "Sarah Johnson" (Bold) then body.
    // Let's use relatedEmail.subject as the MAIN content title if it exists.
    const contentTitle = card.relatedEmail?.subject || card.title
    const showContentTitle = contentTitle !== senderName

    return (
        <BaseCard
            className="group"
            isHovered={isHovered}
            isSelected={isSelected}

            // Slots
            icon={renderIcon()}
            title={senderName}
            // Swap: Tag is now Subtitle (Under name), Time is right side
            subtitle={card.isImportant && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-wide">
                    Important
                </span>
            )}
            time={card.timeDisplay || "Today"}
            onComplete={onArchive ? () => onArchive(card.id) : undefined}

            footer={<FocusCardActions actions={card.actions} />}
        >
            <div className="mt-2">
                {showContentTitle && (
                    <h3 className="text-[16px] font-bold text-slate-800 leading-tight mb-2 group-hover:text-blue-600 transition-colors">
                        {contentTitle}
                    </h3>
                )}
                <p className="text-[14px] text-slate-500 leading-relaxed line-clamp-2">
                    {card.summary}
                </p>
            </div>
        </BaseCard>
    )
}
