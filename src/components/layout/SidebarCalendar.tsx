import * as React from "react"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
// import { useMailStore } from "@/store/mailStore" // We might need store for currentUser

// Mock user for now, or import from store if needed. 
// Since SidebarMail uses store, we should probably use it here too for consistency.
import { useMailStore } from "@/store/mailStore"

interface SidebarCalendarProps {
    isCollapsed?: boolean
}

export function SidebarCalendar({ isCollapsed }: SidebarCalendarProps) {
    // Use store to manage filters
    const { currentUser, calendarFilters, setCalendarFilter } = useMailStore()

    // Map local definition to store keys
    // Keys in store: meetings, tasks, reminders, others
    const calendars = [
        { id: 'meetings', label: '会议', color: 'bg-blue-500', checked: calendarFilters.meetings },
        { id: 'tasks', label: '待办', color: 'bg-emerald-500', checked: calendarFilters.tasks },
        { id: 'reminders', label: '提醒', color: 'bg-purple-500', checked: calendarFilters.reminders },
        { id: 'others', label: '其他', color: 'bg-slate-400', checked: calendarFilters.others },
    ];

    // Calendar Grid Generation for August 2024
    // August 2024 starts on Thursday (index 4) and has 31 days.
    // Previous month (July) ends on 31.
    // Grid:
    // Row 1: Jul 28, 29, 30, 31, Aug 1, 2, 3
    // Row 2: Aug 4, 5, 6, 7, 8, 9, 10
    // Row 3: Aug 11, 12, 13, 14, 15, 16, 17
    // Row 4: Aug 18, 19, 20, 21, 22, 23, 24
    // Row 5: Aug 25, 26, 27, 28, 29, 30, 31

    // Flattened array for easy mapping
    const calendarDays = [
        { day: 28, type: 'prev' }, { day: 29, type: 'prev' }, { day: 30, type: 'prev' }, { day: 31, type: 'prev' }, { day: 1, type: 'curr' }, { day: 2, type: 'curr' }, { day: 3, type: 'curr' },
        { day: 4, type: 'curr' }, { day: 5, type: 'curr', isSelected: true }, { day: 6, type: 'curr' }, { day: 7, type: 'curr' }, { day: 8, type: 'curr' }, { day: 9, type: 'curr' }, { day: 10, type: 'curr' },
        { day: 11, type: 'curr' }, { day: 12, type: 'curr' }, { day: 13, type: 'curr' }, { day: 14, type: 'curr' }, { day: 15, type: 'curr' }, { day: 16, type: 'curr' }, { day: 17, type: 'curr' },
        { day: 18, type: 'curr' }, { day: 19, type: 'curr' }, { day: 20, type: 'curr' }, { day: 21, type: 'curr' }, { day: 22, type: 'curr' }, { day: 23, type: 'curr' }, { day: 24, type: 'curr' },
        { day: 25, type: 'curr' }, { day: 26, type: 'curr' }, { day: 27, type: 'curr' }, { day: 28, type: 'curr' }, { day: 29, type: 'curr' }, { day: 30, type: 'curr' }, { day: 31, type: 'curr' },
    ];

    const handleFilterToggle = (id: string, currentChecked: boolean) => {
        // Map string id to keyof CalendarFilters
        // Safe to cast if ids match keys basically
        setCalendarFilter(id as any, !currentChecked);
    };

    return (
        <div className="flex flex-col h-full">
            {/* New Event Button */}
            <div className={cn("mb-6 pt-2 transition-all", isCollapsed ? "px-2 flex justify-center" : "px-4")}>
                <Button
                    className={cn(
                        "transition-all bg-white hover:bg-slate-50 text-blue-600 border border-slate-200 font-semibold rounded-lg shadow-none",
                        isCollapsed
                            ? "h-10 w-10 p-0 justify-center rounded-lg"
                            : "w-full justify-center gap-2"
                    )}
                    size="lg"
                    title="新建日程"
                >
                    <span className={cn("material-symbols-outlined", isCollapsed ? "text-[24px]" : "text-[20px]")}>add</span>
                    {!isCollapsed && "新建日程"}
                </Button>
            </div>

            <div className={cn(
                "flex-1 overflow-y-auto scrollbar-thin transition-all",
                isCollapsed ? "px-2" : "px-4 pb-4"
            )}>

                {/* Mini Calendar Widget - Immersive (No card bg/border) */}
                {!isCollapsed && (
                    <div className="mb-8 animate-in fade-in duration-300 pl-1 pr-1">
                        <div className="flex items-center justify-between mb-4 px-1">
                            <span className="font-bold text-base text-slate-900">August 2024</span>
                            <div className="flex gap-2">
                                <button className="h-6 w-6 flex items-center justify-center hover:bg-slate-200/50 rounded-full text-slate-500 transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                                </button>
                                <button className="h-6 w-6 flex items-center justify-center hover:bg-slate-200/50 rounded-full text-slate-500 transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                                </button>
                            </div>
                        </div>

                        {/* Days Header */}
                        <div className="grid grid-cols-7 gap-y-2 text-center mb-2">
                            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                                <div key={i} className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">{d}</div>
                            ))}
                        </div>

                        {/* Days Grid - Increased spacing for 320px width */}
                        <div className="grid grid-cols-7 gap-y-2 text-center">
                            {calendarDays.map((item, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "text-[13px] h-8 w-8 mx-auto flex items-center justify-center rounded-full cursor-pointer font-medium transition-colors",
                                        item.type === 'prev' ? "text-slate-300" : "text-slate-700 hover:bg-slate-200/50",
                                        item.isSelected && "bg-blue-600 text-white font-bold shadow-md hover:bg-blue-600 hover:shadow-lg"
                                    )}
                                >
                                    {item.day}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Calendar List (User Account) */}
                <div className="space-y-4">
                    {/* User Account Header */}
                    {!isCollapsed ? (
                        <div className="px-1 py-1 flex items-center gap-2 mb-2 rounded-lg hover:bg-slate-100/50 cursor-pointer">
                            <div className="h-5 w-5 rounded-full bg-slate-200 overflow-hidden shrink-0">
                                <img src={currentUser.avatar} className="object-cover h-full w-full" />
                            </div>
                            <span className="text-xs font-bold text-slate-700 truncate">{currentUser.email}</span>
                            <span className="material-symbols-outlined text-[14px] ml-auto text-slate-400">expand_more</span>
                        </div>
                    ) : (
                        <div className="my-4 flex justify-center">
                            <div className="h-6 w-6 rounded-full bg-slate-200 overflow-hidden shrink-0 ring-2 ring-white shadow-sm">
                                <img src={currentUser.avatar} className="object-cover h-full w-full" />
                            </div>
                        </div>
                    )}

                    {/* Calendars List */}
                    <div className={cn("space-y-1.5", isCollapsed && "space-y-3")}>
                        {calendars.map(cal => (
                            <div
                                key={cal.id}
                                className={cn(
                                    "flex items-center cursor-pointer group transition-colors rounded-md",
                                    isCollapsed ? "justify-center" : "gap-2 px-2 py-1.5 hover:bg-slate-100"
                                )}
                                title={cal.label}
                                onClick={() => !isCollapsed && handleFilterToggle(cal.id, cal.checked)}
                            >
                                {
                                    isCollapsed ? (
                                        // Collapsed: Dot with Ring
                                        <div className={cn("h-3 w-3 rounded-full ring-2 ring-white shadow-sm", cal.color)
                                        } ></div>
                                    ) : (
                                        // Expanded: Checkbox Row
                                        <>
                                            <div className={cn(
                                                "h-5 w-5 rounded-full flex items-center justify-center transition-all border shrink-0",
                                                cal.checked ? cn(cal.color, "border-transparent text-white") : "border-slate-300 bg-white group-hover:border-slate-400"
                                            )}>
                                                {cal.checked && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
                                                        <polyline points="20 6 9 17 4 12"></polyline>
                                                    </svg>
                                                )}
                                            </div>
                                            {/* Removed standalone dot */}
                                            <span className="text-sm text-slate-600 font-medium group-hover:text-slate-900 pt-0.5">{cal.label}</span>
                                        </>
                                    )}
                            </div>
                        ))}
                    </div>
                </div>

            </div >
        </div >
    )
}
