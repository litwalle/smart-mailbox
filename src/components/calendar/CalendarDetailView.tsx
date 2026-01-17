import * as React from "react"
import { format, parseISO } from "date-fns"
import { zhCN } from "date-fns/locale"
import { useMailStore } from "@/store/mailStore"
import { mockEvents } from "@/data/calendar-mock"
import { Button } from "@/components/ui/Button"
import { Card } from "@/components/ui/Card"
import { Input } from "@/components/ui/Input"
import { EmptyState } from "@/components/ui/EmptyState"

export function CalendarDetailView() {
    const { selectedEventId, selectEvent } = useMailStore()

    const event = React.useMemo(() =>
        mockEvents.find(e => e.id === selectedEventId),
        [selectedEventId])

    if (!event) return null; // Should not happen due to parent check, but good for safety

    const start = parseISO(event.start)
    const end = parseISO(event.end)
    const typeLabel = event.type === 'meeting' ? '会议' : (event.type === 'task' ? '任务' : '提醒');

    return (
        <div className="flex flex-col h-full bg-white relative">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-2">
                    <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                        {typeLabel}
                    </span>
                </div>
                <Button variant="ghost" size="icon" onClick={() => selectEvent(null)}>
                    <span className="material-symbols-outlined text-slate-400">close</span>
                </Button>
            </div>

            {/* Content Content - Scrollable */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">

                {/* Title Section */}
                <div>
                    <h1 className="text-2xl font-bold text-slate-900 mb-4">{event.title}</h1>

                    <div className="space-y-3">
                        {/* Time */}
                        <div className="flex items-start gap-3">
                            <div className="mt-0.5 h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center">
                                <span className="material-symbols-outlined text-[14px] text-slate-500">schedule</span>
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-slate-900">
                                    {format(start, 'M月d日 EEEE', { locale: zhCN })}
                                </div>
                                <div className="text-xs text-slate-500">
                                    {format(start, 'HH:mm')} - {format(end, 'HH:mm')}
                                </div>
                            </div>
                        </div>

                        {/* Location */}
                        {event.location && (
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[14px] text-slate-500">location_on</span>
                                </div>
                                <div className="text-sm font-medium text-slate-900 self-center">
                                    {event.location}
                                </div>
                            </div>
                        )}

                        {/* Attendees */}
                        {event.attendees && event.attendees.length > 0 && (
                            <div className="flex items-start gap-3">
                                <div className="mt-0.5 h-5 w-5 rounded-full bg-slate-100 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[14px] text-slate-500">group</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {event.attendees.slice(0, 3).map((u, i) => (
                                        u.avatar ? (
                                            <img key={i} src={u.avatar} className="h-6 w-6 rounded-full border border-white" title={u.name} />
                                        ) : (
                                            <div key={i} className="h-6 w-6 rounded-full bg-slate-200 border border-white flex items-center justify-center text-[10px] font-bold">
                                                {u.name[0]}
                                            </div>
                                        )
                                    ))}
                                    {event.attendees.length > 3 && (
                                        <div className="h-6 w-6 rounded-full bg-slate-100 border border-white flex items-center justify-center text-[10px] font-bold text-slate-500">
                                            +{event.attendees.length - 3}
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="h-px bg-slate-100 my-2"></div>

                {/* AI Context Section */}
                {event.aiContext && (
                    <div className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                                <span className="material-symbols-outlined text-blue-500 text-[18px]">temp_preferences_custom</span>
                                AI 摘要与建议
                            </h3>
                            <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[10px] font-bold border border-blue-100">Beta</span>
                        </div>

                        <div className="bg-blue-50/50 border border-blue-100 rounded-xl p-4 space-y-3">
                            {event.aiContext.summary && (
                                <div>
                                    <span className="text-xs font-bold text-blue-700">摘要: </span>
                                    <span className="text-xs text-slate-700 leading-relaxed">
                                        {event.aiContext.summary}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Related Email Card */}
                {event.sourceEmail && (
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">相关邮件</h3>
                        <div className="bg-white border border-slate-200 rounded-xl p-3 hover:border-blue-300 transition-colors cursor-pointer group shadow-sm">
                            <div className="flex justify-between items-start mb-1">
                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                    <span className="material-symbols-outlined text-[14px]">mail</span>
                                    邮件来源
                                </div>
                                <span className="text-[10px] text-slate-400">昨天</span>
                            </div>
                            <div className="font-bold text-sm text-slate-900 mb-0.5 group-hover:text-blue-600 transition-colors">
                                {event.sourceEmail.subject}
                            </div>
                            <div className="text-xs text-slate-500 truncate">
                                来自: {event.sourceEmail.from.name} &lt;{event.sourceEmail.from.email}&gt;
                            </div>
                        </div>
                    </div>
                )}

                {/* Attachments */}
                {event.aiContext?.attachments && event.aiContext.attachments.length > 0 && (
                    <div className="space-y-2">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">附件</h3>
                        {event.aiContext.attachments.map((file, i) => (
                            <div key={i} className="flex items-center gap-3 p-3 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                                <div className="h-10 w-10 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
                                    <span className="material-symbols-outlined">picture_as_pdf</span>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-slate-800">{file.name}</div>
                                    <div className="text-xs text-slate-400">{file.size}</div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* AI Note */}
                {event.aiContext?.note && (
                    <div className="bg-yellow-50 border border-yellow-100 border-dashed rounded-xl p-3 flex gap-3">
                        <span className="material-symbols-outlined text-yellow-600 text-[18px] mt-0.5">lightbulb</span>
                        <div className="space-y-1">
                            <div className="text-xs font-bold text-yellow-800">AI 提示</div>
                            <div className="text-xs text-slate-700 leading-relaxed">
                                {event.aiContext.note}
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Footer Input */}
            <div className="p-4 border-t border-slate-100 bg-white sticky bottom-0">
                <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-slate-400 text-[18px]">edit</span>
                    <input
                        type="text"
                        placeholder="添加私人笔记"
                        className="w-full pl-9 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all"
                    />
                </div>
            </div>
        </div>
    )
}
