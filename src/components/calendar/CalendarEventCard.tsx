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

    // Base Styles
    let containerClass = "bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100";
    let accentColor = "bg-blue-500";
    let textColor = "text-blue-700";

    // Status Logic
    const isCancelled = event.status === 'cancelled';

    // Type Specific Styles
    if (event.type === 'task') {
        containerClass = "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100";
        accentColor = "bg-emerald-500";
        textColor = "text-emerald-700";
    } else if (event.type === 'reminder') {
        containerClass = "bg-purple-50 border-purple-100 text-purple-700 hover:bg-purple-100";
        accentColor = "bg-purple-500";
        textColor = "text-purple-700";
    }

    // Cancelled State
    if (isCancelled) {
        containerClass = "bg-slate-100 border-slate-300 text-slate-500 overflow-hidden";
        accentColor = "bg-slate-300";
        textColor = "text-slate-400 line-through decoration-slate-300";
    }

    // Past State (Transparency) - Only if NOT selected
    // If selected, we want full visibility to read details, or maybe just slight opacity?
    // User request: "current timeline above... calendar items should be expired card will have lower transparency"
    // Let's apply opacity-60 if past and not selected.
    // If selected, we keep it fully opaque or maybe opacity-90. Let's stick to opaque for readability/focus.
    if (isPast && !isSelected) {
        containerClass = cn(containerClass, "opacity-60 grayscale-[0.3]"); // Add some grayscale too for "expired" feel
    }

    // Selected State overrides
    if (isSelected) {
        if (isCancelled) {
            // Selected Cancelled: Darker gray background, white text
            containerClass = "bg-slate-500 border-slate-500 text-white shadow-md z-30";
            accentColor = "bg-slate-500"; // Blend in
            textColor = "text-slate-100 line-through decoration-slate-300";
        } else {
            // Selected Active: Solid background matching the accent of unselected state (500 shade)
            if (event.type === 'task') {
                containerClass = "bg-emerald-500 border-emerald-500 text-white shadow-md z-30 ring-0";
                accentColor = "bg-emerald-500"; // Blend in
            } else if (event.type === 'reminder') {
                containerClass = "bg-purple-500 border-purple-500 text-white shadow-md z-30 ring-0";
                accentColor = "bg-purple-500"; // Blend in
            } else {
                // Meeting (Blue)
                containerClass = "bg-blue-500 border-blue-500 text-white shadow-md z-30 ring-0";
                accentColor = "bg-blue-500"; // Blend in
            }
            textColor = "text-white";
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
