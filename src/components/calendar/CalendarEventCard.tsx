import * as React from "react"
import { format, differenceInMinutes, parseISO } from "date-fns"
import { cn } from "@/lib/utils"
import { CalendarEvent } from "@/types/calendar"

interface CalendarEventCardProps {
    event: CalendarEvent
    onClick: (e: React.MouseEvent, eventId: string) => void
    style: {
        top: number
        height: number
        left: string
        width: string
    }
    isSelected: boolean
    isPast?: boolean
    showTime?: boolean
}

export function CalendarEventCard({ event, onClick, style, isSelected, isPast = false, showTime = true }: CalendarEventCardProps) {
    const start = parseISO(event.start);
    const end = parseISO(event.end);
    const durationM = differenceInMinutes(end, start);

    // Layout Logic: duration < 45min -> horizontal
    const isShort = durationM < 45;

    // Base Styles - Using Harmony palette
    let containerClass = "bg-brand/10 border-brand/20 text-brand hover:bg-brand/15";
    let accentColor = "bg-brand";
    let textColor = "text-brand";

    // Status Logic
    const isCancelled = event.status === 'cancelled';

    // Type Specific Styles - Using Harmony palette
    if (event.type === 'task') {
        containerClass = "bg-confirm/10 border-confirm/20 text-confirm hover:bg-confirm/15";
        accentColor = "bg-confirm";
        textColor = "text-confirm";
    } else if (event.type === 'reminder') {
        containerClass = "bg-palette-6/10 border-palette-6/20 text-palette-6 hover:bg-palette-6/15";
        accentColor = "bg-palette-6";
        textColor = "text-palette-6";
    }

    // Cancelled State
    if (isCancelled) {
        containerClass = "bg-background-tertiary border-comp-divider text-font-tertiary overflow-hidden";
        accentColor = "bg-font-tertiary";
        textColor = "text-font-tertiary line-through decoration-comp-divider";
    }

    // Past State (Transparency) - Only if NOT selected
    if (isPast && !isSelected) {
        containerClass = cn(containerClass, "opacity-60 grayscale-[0.3]");
    }

    // Selected State overrides
    if (isSelected) {
        if (isCancelled) {
            containerClass = "bg-font-secondary border-font-secondary text-font-on-primary shadow-md z-30";
            accentColor = "bg-font-secondary";
            textColor = "text-font-on-primary/80 line-through decoration-font-on-primary/30";
        } else {
            if (event.type === 'task') {
                containerClass = "bg-confirm border-confirm text-font-on-primary shadow-md z-30 ring-0";
                accentColor = "bg-confirm";
            } else if (event.type === 'reminder') {
                containerClass = "bg-palette-6 border-palette-6 text-font-on-primary shadow-md z-30 ring-0";
                accentColor = "bg-palette-6";
            } else {
                containerClass = "bg-brand border-brand text-font-on-primary shadow-md z-30 ring-0";
                accentColor = "bg-brand";
            }
            textColor = "text-font-on-primary";
        }
    }

    return (
        <div
            onClick={(e) => onClick(e, event.id)}
            className={cn(
                "absolute rounded border border-l-0 pr-1 cursor-pointer overflow-hidden transition-colors flex z-10",
                isShort ? "flex-row items-center" : "flex-col justify-start py-1",
                containerClass
            )}
            style={{
                top: style.top,
                height: Math.max(style.height, 32), // Min height 32px
                left: style.left,
                width: style.width,
            }}
        >
            {/* Left Accent Border */}
            <div className={cn("absolute left-0 top-0 bottom-0 w-[3px]", accentColor)}></div>

            <div className={cn("pl-2.5 flex min-w-0", isShort ? "items-baseline gap-2" : "flex-col mb-0.5")}>
                {/* Title */}
                <span className={cn("truncate leading-tight font-bold text-[12px]", textColor)}>
                    {isCancelled ? `[已取消] ${event.title}` : event.title}
                </span>

                {/* Short Time Display */}
                {isShort && showTime && (
                    <span className={cn("truncate text-[10px] opacity-80 leading-none", textColor)}>
                        {format(start, 'HH:mm')}
                    </span>
                )}
            </div>

            {/* Long Time Display */}
            {!isShort && showTime && (
                <div className={cn("pl-2.5 font-normal text-[10px] opacity-80 leading-tight", textColor)}>
                    {format(start, 'HH:mm')} - {format(end, 'HH:mm')}
                </div>
            )}
        </div>
    )
}
