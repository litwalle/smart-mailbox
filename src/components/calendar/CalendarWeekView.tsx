import * as React from "react"
import { format, addDays, startOfWeek, isSameDay, getHours, getMinutes, differenceInMinutes, parseISO } from "date-fns"
import { zhCN } from "date-fns/locale" // Import Chinese Locale
import { useMailStore } from "@/store/mailStore"
import { mockEvents } from "@/data/calendar-mock"
import { CalendarEvent } from "@/types/calendar"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"

// Constants
const START_HOUR = 8; // 8 AM
const END_HOUR = 18;  // 6 PM
const HOUR_HEIGHT = 80; // Increased from 64px to 80px for better spaciousness
const TOTAL_HEIGHT = (END_HOUR - START_HOUR + 1) * HOUR_HEIGHT;

export function CalendarWeekView() {
    const { selectEvent, selectedEventId } = useMailStore()
    const [viewMode, setViewMode] = React.useState<'week' | 'day'>('week');

    // Fixed date for prototype visual: August 5, 2024 (Monday)
    const baseDate = new Date('2024-08-05T00:00:00');

    // Calculate days to display based on View Mode
    const daysToDisplay = React.useMemo(() => {
        if (viewMode === 'week') {
            // Generate 7 days starting from Monday Aug 5
            return Array.from({ length: 7 }, (_, i) => addDays(baseDate, i));
        } else {
            // Day View: Show only Monday Aug 5
            return [baseDate];
        }
    }, [viewMode]);

    // Time slots for left axis
    const timeSlots = Array.from({ length: END_HOUR - START_HOUR + 1 }, (_, i) => START_HOUR + i);

    const handleEventClick = (e: React.MouseEvent, eventId: string) => {
        e.stopPropagation();
        selectEvent(eventId);
    };

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Top Toolbar */}
            <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 bg-white z-20 h-14 shrink-0">
                {/* Left: Search Bar */}
                <div className="relative w-64 group">
                    <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-hover:text-slate-500 transition-colors text-[18px]">search</span>
                    <input
                        type="text"
                        placeholder="搜索日程"
                        className="w-full h-8 pl-9 pr-4 bg-slate-100 hover:bg-slate-200/50 focus:bg-white border focus:border-blue-500 border-transparent rounded-lg text-sm text-slate-700 outline-none transition-all placeholder:text-slate-400"
                    />
                </div>

                {/* Right: Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:bg-slate-100 rounded-md" title="发起会议">
                        <span className="material-symbols-outlined text-[20px]">add</span>
                    </Button>

                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:bg-slate-100 rounded-md" title="同步日历">
                        <span className="material-symbols-outlined text-[20px]">sync</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-600 hover:bg-slate-100 rounded-md" title="更多">
                        <span className="material-symbols-outlined text-[20px]">more_horiz</span>
                    </Button>
                </div>
            </div>

            {/* Navigation Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200 bg-white z-20 shrink-0">
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-bold text-slate-900 tracking-tight">
                        {format(baseDate, 'yyyy年 M月', { locale: zhCN })}
                        {viewMode === 'week' ? ' 5日 - 11日' : ' 5日'}
                    </h2>
                    <div className="flex items-center gap-2">
                        <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-600">
                                <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 bg-slate-100 hover:bg-slate-200 rounded-md text-slate-600">
                                <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                            </Button>
                        </div>
                        <Button variant="ghost" size="sm" className="h-7 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs px-3 font-medium rounded-md">
                            今天
                        </Button>
                    </div>
                </div>

                {/* View Toggles (Restored) */}
                <div className="flex items-center gap-3">
                    <div className="flex bg-slate-100 p-0.5 rounded-lg">
                        <button className="px-3 py-1 text-xs font-medium text-slate-500 hover:text-slate-900 rounded-md">月</button>
                        <button
                            onClick={() => setViewMode('week')}
                            className={cn(
                                "px-3 py-1 text-xs font-medium rounded-md transition-all",
                                viewMode === 'week' ? "text-slate-900 bg-white shadow-sm font-bold" : "text-slate-500 hover:text-slate-900"
                            )}
                        >
                            周
                        </button>
                        <button
                            onClick={() => setViewMode('day')}
                            className={cn(
                                "px-3 py-1 text-xs font-medium rounded-md transition-all",
                                viewMode === 'day' ? "text-slate-900 bg-white shadow-sm font-bold" : "text-slate-500 hover:text-slate-900"
                            )}
                        >
                            日
                        </button>
                    </div>
                </div>
            </div>

            {/* Grid Container */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden relative scrollbar-thin">
                <div className={cn("flex", viewMode === 'week' ? "min-w-[800px]" : "w-full")}>
                    {/* Time Axis */}
                    <div className="w-16 flex-shrink-0 bg-white border-r border-slate-100 z-10 sticky left-0">
                        {/* Header Spacer */}
                        <div className="h-12 border-b border-slate-100 bg-white sticky top-0 z-20">
                            <div className="text-[10px] font-bold text-slate-400 p-2 text-right pt-3">GMT+8</div>
                        </div>

                        {/* Times */}
                        <div className="relative">
                            {timeSlots.map(hour => (
                                <div key={hour} className="border-b border-transparent relative group" style={{ height: HOUR_HEIGHT }}>
                                    <span className="absolute -top-3 right-3 text-xs text-slate-400 font-medium bg-white px-1 font-mono">
                                        {hour.toString().padStart(2, '0')}:00
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Days Grid */}
                    <div className={cn(
                        "flex-1 grid relative divide-x divide-slate-100",
                        viewMode === 'week' ? "grid-cols-7" : "grid-cols-1"
                    )}>
                        {/* Day Columns */}
                        {daysToDisplay.map(day => {
                            const isToday = isSameDay(day, baseDate); // Mock "today" as Monday Aug 5
                            return (
                                <div key={day.toString()} className="min-w-[100px]">
                                    {/* Header */}
                                    <div className="h-12 border-b border-slate-100 bg-white sticky top-0 z-10 flex flex-col items-center justify-center py-1">
                                        <span className={cn(
                                            "text-[10px] font-bold uppercase tracking-wider mb-0.5",
                                            isToday ? "text-blue-600" : "text-slate-400"
                                        )}>
                                            {format(day, 'EEE', { locale: zhCN })}
                                        </span>
                                        <div className={cn(
                                            "text-lg font-bold h-7 w-7 flex items-center justify-center rounded-full transition-colors",
                                            isToday ? "bg-blue-600 text-white shadow-sm" : "text-slate-700"
                                        )}>
                                            {format(day, 'd')}
                                        </div>
                                    </div>

                                    {/* Day Column Body */}
                                    {/* Added group relative for resizing/hover effects if needed */}
                                    <div className="relative border-b border-slate-100" style={{ height: TOTAL_HEIGHT }}>
                                        {/* Time Slot Guides */}
                                        {timeSlots.map(hour => (
                                            <div key={hour} className="border-t border-slate-50 w-full absolute" style={{ top: (hour - START_HOUR) * HOUR_HEIGHT }}></div>
                                        ))}

                                        {/* Red Line for Current Time (Mock at Aug 5, 11:00 AM) */}
                                        {isSameDay(day, baseDate) && (
                                            <div className="absolute w-full border-t border-red-500 z-[50] flex items-center pointer-events-none" style={{ top: (11 - START_HOUR) * HOUR_HEIGHT }}>
                                                <div className="h-2 w-2 rounded-full bg-red-500 -ml-1 absolute left-0 shadow-sm"></div>
                                                <div className="w-full border-t border-red-500 opacity-50"></div>
                                            </div>
                                        )}

                                        {/* Events with Overlap Handling */}
                                        {(() => {
                                            // 1. Filter events for this day
                                            const dayEvents = mockEvents.filter(ev => isSameDay(parseISO(ev.start), day));

                                            // 2. Sort by start time, then duration
                                            dayEvents.sort((a, b) => {
                                                const startDiff = new Date(a.start).getTime() - new Date(b.start).getTime();
                                                if (startDiff !== 0) return startDiff;
                                                return new Date(b.end).getTime() - new Date(a.end).getTime(); // Longer first
                                            });

                                            // 3. Cluster and assign columns
                                            const renderedEvents: (CalendarEvent & { style: { left: string, width: string } })[] = [];
                                            let clusters: CalendarEvent[][] = [];
                                            let currentCluster: CalendarEvent[] = [];
                                            let clusterEnd = -1;

                                            // Group into overlapping clusters
                                            for (const ev of dayEvents) {
                                                const start = new Date(ev.start).getTime();
                                                const end = new Date(ev.end).getTime();

                                                if (currentCluster.length === 0) {
                                                    currentCluster.push(ev);
                                                    clusterEnd = end;
                                                } else {
                                                    if (start < clusterEnd) {
                                                        currentCluster.push(ev);
                                                        clusterEnd = Math.max(clusterEnd, end);
                                                    } else {
                                                        clusters.push(currentCluster);
                                                        currentCluster = [ev];
                                                        clusterEnd = end;
                                                    }
                                                }
                                            }
                                            if (currentCluster.length > 0) clusters.push(currentCluster);

                                            // Process each cluster
                                            for (const cluster of clusters) {
                                                const colEndTimes: number[] = [];
                                                const eventStyles = new Map<string, { left: string, width: string }>();

                                                // Pack into columns
                                                for (const ev of cluster) {
                                                    const start = new Date(ev.start).getTime();
                                                    const end = new Date(ev.end).getTime();
                                                    let placedCol = -1;

                                                    for (let i = 0; i < colEndTimes.length; i++) {
                                                        if (start >= colEndTimes[i]) {
                                                            placedCol = i;
                                                            colEndTimes[i] = end;
                                                            break;
                                                        }
                                                    }

                                                    if (placedCol === -1) {
                                                        placedCol = colEndTimes.length;
                                                        colEndTimes.push(end);
                                                    }

                                                    // Temporary store col index
                                                    // We calculate final width/left after knowing total cols
                                                    eventStyles.set(ev.id, { left: placedCol.toString(), width: '' });
                                                }

                                                const totalCols = colEndTimes.length;
                                                const colWidthPct = 100 / totalCols;

                                                // Calculate final styles
                                                cluster.forEach(ev => {
                                                    const style = eventStyles.get(ev.id);
                                                    if (style) {
                                                        const colIndex = parseInt(style.left);
                                                        renderedEvents.push({
                                                            ...ev,
                                                            style: {
                                                                left: `${colIndex * colWidthPct}%`,
                                                                width: `${colWidthPct}%`
                                                            }
                                                        });
                                                    }
                                                });
                                            }

                                            // Render
                                            return renderedEvents.map(ev => {
                                                const start = parseISO(ev.start);
                                                const end = parseISO(ev.end);
                                                const startH = getHours(start);
                                                const startM = getMinutes(start);
                                                const durationM = differenceInMinutes(end, start);

                                                // Ensure within view bounds (simple check, assume data is valid for view)
                                                if (startH < START_HOUR || startH > END_HOUR) return null;

                                                const topMinutes = (startH - START_HOUR) * 60 + startM;
                                                const topPx = (topMinutes / 60) * HOUR_HEIGHT;
                                                const heightPx = (durationM / 60) * HOUR_HEIGHT;

                                                // Layout Logic: duration < 45min -> horizontal
                                                const isShort = durationM < 45;

                                                const isSelected = ev.id === selectedEventId;

                                                // Default (Meeting)
                                                let containerClass = "bg-blue-50 border-blue-100 text-blue-700 hover:bg-blue-100";
                                                let accentColor = "bg-blue-500";

                                                // Task - Green (Emerald)
                                                if (ev.type === 'task') {
                                                    containerClass = "bg-emerald-50 border-emerald-100 text-emerald-700 hover:bg-emerald-100";
                                                    accentColor = "bg-emerald-500";
                                                }
                                                // Reminder/Other
                                                else if (ev.type === 'reminder') {
                                                    containerClass = "bg-purple-50 border-purple-100 text-purple-700 hover:bg-purple-100";
                                                    accentColor = "bg-purple-500";
                                                }

                                                // Selected State
                                                if (isSelected) {
                                                    containerClass = "bg-blue-600 border-blue-600 text-white shadow-md z-20";
                                                    accentColor = "bg-white/30"; // Subtle accent on solid bg

                                                    if (ev.type === 'task') {
                                                        containerClass = "bg-emerald-600 border-emerald-600 text-white shadow-md z-20";
                                                    } else if (ev.type === 'reminder') {
                                                        containerClass = "bg-purple-600 border-purple-600 text-white shadow-md z-20";
                                                    }
                                                }

                                                // Custom style from layout algo
                                                const layoutStyle = ev.style || { left: '0%', width: '100%' };

                                                return (
                                                    <div
                                                        key={ev.id}
                                                        onClick={(e) => handleEventClick(e, ev.id)}
                                                        className={cn(
                                                            "absolute rounded border border-l-0 pr-1 cursor-pointer overflow-hidden transition-colors flex z-10",
                                                            isShort ? "flex-row items-center" : "flex-col justify-start py-1",
                                                            containerClass
                                                        )}
                                                        style={{
                                                            top: topPx,
                                                            height: Math.max(heightPx, 32), // Min height 32px to fit text
                                                            left: layoutStyle.left,
                                                            width: layoutStyle.width,
                                                        }}
                                                    >
                                                        {/* Left Accent Border - Thinner (3px) */}
                                                        <div className={cn("absolute left-0 top-0 bottom-0 w-[3px]", accentColor)}></div>

                                                        <div className={cn("pl-2.5 flex min-w-0", isShort ? "items-baseline gap-2" : "flex-col mb-0.5")}>
                                                            <span className={cn("truncate leading-tight font-bold text-[12px]")}>{ev.title}</span>
                                                            {isShort && (
                                                                <span className={cn("truncate text-[10px] opacity-80 leading-none")}>
                                                                    {format(start, 'HH:mm')}
                                                                </span>
                                                            )}
                                                        </div>

                                                        {!isShort && (
                                                            <div className={cn("pl-2.5 font-normal text-[10px] opacity-80 leading-tight")}>
                                                                {format(start, 'HH:mm')} - {format(end, 'HH:mm')}
                                                            </div>
                                                        )}
                                                    </div>
                                                )
                                            });
                                        })()}
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        </div >
    )
}
