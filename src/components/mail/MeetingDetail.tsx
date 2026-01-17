import * as React from "react"
import { format } from "date-fns"
import { Email } from "@/types/mail"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import {
    LuCalendar,
    LuMapPin,
    LuVideo,
    LuCheck,
    LuX,
    LuCircleHelp,
    LuClock,
    LuFileText,
    LuExternalLink,
    LuTriangleAlert
} from "react-icons/lu"

interface MeetingDetailProps {
    email: Email
    translationMode?: 'original' | 'translation' | 'split'
}

export function MeetingDetail({ email, translationMode = 'original' }: MeetingDetailProps) {
    const meeting = email.meetingRequest
    const [status, setStatus] = React.useState<'pending' | 'accepted' | 'declined' | 'tentative'>('pending')

    if (!meeting) return null

    // Check if translation is available
    const hasTranslation = meeting.translatedTitle || email.translatedContent

    const startDate = new Date(meeting.start)
    const endDate = new Date(meeting.end)
    const dateStr = format(startDate, "yyyy年MM月dd日")
    const timeStr = `${format(startDate, "HH:mm")} - ${format(endDate, "HH:mm")}`

    // Get translated or original content based on mode
    const isTranslated = translationMode === 'translation' && hasTranslation
    const displayTitle = isTranslated && meeting.translatedTitle ? meeting.translatedTitle : meeting.title
    const displayLocation = isTranslated && meeting.translatedLocation ? meeting.translatedLocation : meeting.location
    const displayDescription = isTranslated && meeting.translatedDescription ? meeting.translatedDescription : meeting.description

    // Get translated agenda items
    const getAgendaTitle = (item: NonNullable<typeof meeting.agendaItems>[0]) =>
        isTranslated && item.translatedTitle ? item.translatedTitle : item.title
    const getAgendaType = (item: NonNullable<typeof meeting.agendaItems>[0]) =>
        isTranslated && item.translatedType ? item.translatedType : item.type

    // Get translated notices
    const displayNotices = isTranslated && meeting.translatedNotices ? meeting.translatedNotices : meeting.notices

    // Group Attendees
    const internalAttendees = meeting.attendees.filter(a => a.type !== 'external')
    const externalAttendees = meeting.attendees.filter(a => a.type === 'external')

    // Attendee Block Component - Clean, no shadow
    const AttendeeBlock = ({ attendee }: { attendee: typeof meeting.attendees[0] }) => {
        const statusConfig = {
            accepted: { icon: LuCheck, color: "text-emerald-600" },
            declined: { icon: LuX, color: "text-red-500" },
            tentative: { icon: LuCircleHelp, color: "text-amber-500" },
            pending: { icon: LuClock, color: "text-slate-400" }
        }
        const config = statusConfig[attendee.status] || statusConfig.pending
        const StatusIcon = config.icon

        return (
            <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-md px-2.5 py-1 text-sm text-slate-700 mr-2 mb-2">
                <span className="font-medium">{attendee.name}</span>
                <StatusIcon className={cn("w-3.5 h-3.5", config.color)} />
            </div>
        )
    }

    // Section Title - Design System Compliant
    const SectionTitle = ({ children }: { children: React.ReactNode }) => (
        <h3 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-0.5 h-3.5 bg-blue-500 rounded-full" />
            {children}
        </h3>
    )

    return (
        <div className="max-w-4xl mx-auto px-8 pb-12 w-full">
            {/* Response Action Bar - Card Style */}
            <div className="mb-4 bg-white border border-slate-200 rounded-xl p-4 shadow-sm min-h-[72px] flex items-center justify-between transition-all duration-300">
                {status === 'pending' ? (
                    <>
                        <div className="font-medium text-slate-700 text-sm">Confirm your attendance</div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="primary"
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 min-w-[90px] shadow-sm rounded-lg"
                                onClick={() => setStatus('accepted')}
                            >
                                Accept
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="bg-white hover:bg-slate-50 min-w-[90px] shadow-sm border border-slate-200 rounded-lg text-slate-700"
                                onClick={() => setStatus('tentative')}
                            >
                                Maybe
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="text-slate-500 hover:text-slate-700 hover:bg-slate-100 min-w-[80px] rounded-lg"
                                onClick={() => setStatus('declined')}
                            >
                                Decline
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-between w-full animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center",
                                status === 'accepted' && "bg-emerald-100 text-emerald-600",
                                status === 'declined' && "bg-slate-100 text-slate-500",
                                status === 'tentative' && "bg-amber-100 text-amber-600"
                            )}>
                                {status === 'accepted' && <LuCheck className="w-5 h-5" />}
                                {status === 'declined' && <LuX className="w-5 h-5" />}
                                {status === 'tentative' && <LuCircleHelp className="w-5 h-5" />}
                            </div>
                            <div className="flex flex-col">
                                <span className={cn(
                                    "font-semibold text-sm",
                                    status === 'accepted' && "text-emerald-700",
                                    status === 'declined' && "text-slate-600",
                                    status === 'tentative' && "text-amber-700"
                                )}>
                                    {status === 'accepted' && "Going"}
                                    {status === 'declined' && "Declined"}
                                    {status === 'tentative' && "Maybe"}
                                </span>
                                <span className="text-xs text-slate-500">
                                    {status === 'accepted' && "You accepted this meeting invitation."}
                                    {status === 'declined' && "You declined this meeting invitation."}
                                    {status === 'tentative' && "You tentatively accepted this meeting."}
                                </span>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-slate-400 hover:text-slate-600"
                            onClick={() => setStatus('pending')}
                        >
                            Change Response
                        </Button>
                    </div>
                )}
            </div>

            {/* Main Card - Subtle shadow */}
            <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mt-0 shadow-sm">

                {/* Card Header */}
                <div className="bg-slate-50 p-6 border-b border-slate-100">
                    <div className="flex justify-between items-start gap-6">
                        <div className="flex-1">
                            {/* Badge */}
                            <div className="mb-2">
                                <span className={cn(
                                    "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider",
                                    status === 'accepted' ? "bg-emerald-600 text-white" :
                                        status === 'declined' ? "bg-slate-500 text-white" :
                                            "bg-blue-600 text-white"
                                )}>
                                    {status === 'pending' ? 'Invitation' : status}
                                </span>
                            </div>

                            {/* Title */}
                            <h2 className="text-xl font-bold text-slate-900 mb-4">{displayTitle}</h2>

                            {/* Info Rows */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2.5 text-slate-700">
                                    <LuCalendar className="w-4 h-4 text-blue-500 shrink-0" />
                                    <span className="font-medium text-sm">
                                        {dateStr} {timeStr}
                                        <span className="text-slate-400 font-normal ml-1.5">({meeting.timeZone})</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2.5 text-slate-700">
                                    <LuMapPin className="w-4 h-4 text-rose-500 shrink-0" />
                                    <span className="font-medium text-sm">{displayLocation}</span>
                                </div>
                            </div>
                        </div>

                        {/* Date Block - Clean */}
                        <div className="bg-white border border-slate-200 rounded-xl px-4 py-3 flex flex-col items-center shrink-0 min-w-[72px]">
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">
                                {format(startDate, "MMM")}
                            </span>
                            <span className="text-3xl font-black text-slate-900 leading-none mt-0.5">
                                {format(startDate, "d")}
                            </span>
                        </div>
                    </div>

                    {/* Actions - Now only Join Buttons on Left */}
                    <div className="mt-5 pt-4 border-t border-slate-200/60 flex items-center justify-between min-h-[40px]">
                        {/* Join Meeting Buttons - Moved to Left, Distinct Colors */}
                        {meeting.joinUrl && (
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="h-9 px-4 gap-2 bg-blue-600 hover:bg-blue-700 shadow-sm transition-colors text-white border-0"
                                    onClick={() => window.open(meeting.joinUrl, '_blank')}
                                >
                                    <span className="material-symbols-outlined text-[18px]">videocam</span>
                                    Host
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="h-9 px-4 gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-sm transition-colors text-white border-0"
                                    onClick={() => window.open(meeting.joinUrl, '_blank')}
                                >
                                    <span className="material-symbols-outlined text-[18px]">videocam</span>
                                    Guest
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="h-9 px-4 gap-2 bg-indigo-600 hover:bg-indigo-700 shadow-sm transition-colors text-white border-0"
                                    onClick={() => window.open(meeting.joinUrl, '_blank')}
                                >
                                    <span className="material-symbols-outlined text-[18px]">open_in_new</span>
                                    External
                                </Button>
                            </div>
                        )}

                        {/* Right side spacer or additional actions if needed */}
                        <div />
                    </div>
                </div>

                {/* Card Body */}
                <div className="p-6 space-y-6">
                    {/* Agenda Table */}
                    {meeting.agendaItems && meeting.agendaItems.length > 0 && (
                        <div>
                            <SectionTitle>Agenda</SectionTitle>
                            <div className="border border-slate-200 rounded-lg overflow-hidden ml-2.5">
                                <table className="w-full text-sm">
                                    <thead className="bg-slate-50/80 text-slate-500 text-xs font-medium border-b border-slate-200">
                                        <tr>
                                            <th className="px-3 py-2 w-10 text-center">#</th>
                                            <th className="px-3 py-2 text-left">Topic</th>
                                            <th className="px-3 py-2 w-24 text-left">Type</th>
                                            <th className="px-3 py-2 w-24 text-left">Time</th>
                                            <th className="px-3 py-2 w-16 text-right">Duration</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {meeting.agendaItems.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-slate-50/50">
                                                <td className="px-3 py-2 text-center text-slate-400 font-mono text-xs">{index + 1}</td>
                                                <td className="px-3 py-2 font-medium text-slate-700">{getAgendaTitle(item)}</td>
                                                <td className="px-3 py-2">
                                                    <span className="inline-flex px-1.5 py-0.5 rounded text-xs font-medium bg-indigo-50 text-indigo-600">
                                                        {getAgendaType(item)}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 text-slate-500 font-mono text-xs">{item.time}</td>
                                                <td className="px-3 py-2 text-right text-slate-500">{item.duration}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Resources */}
                    <div>
                        <SectionTitle>Resources</SectionTitle>
                        <div className="flex items-center gap-2 ml-2.5">
                            <Button variant="secondary" size="sm" className="gap-1.5 text-slate-600 text-xs h-8">
                                <LuFileText className="w-3.5 h-3.5" />
                                View Detailed Agenda
                            </Button>
                            {meeting.materials && meeting.materials.length > 0 && (
                                <Button variant="secondary" size="sm" className="gap-1.5 text-slate-600 text-xs h-8">
                                    <LuExternalLink className="w-3.5 h-3.5" />
                                    View Materials ({meeting.materials.length})
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Attendees */}
                    <div>
                        <SectionTitle>
                            Attendees <span className="text-slate-300 font-normal">({meeting.attendees.length})</span>
                        </SectionTitle>

                        <div className="ml-2.5 space-y-4">
                            {internalAttendees.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] font-semibold text-emerald-600 mb-2 uppercase tracking-wide flex items-center gap-1">
                                        <span className="w-1 h-1 bg-emerald-500 rounded-full" />
                                        Internal
                                    </h4>
                                    <div className="flex flex-wrap">
                                        {internalAttendees.map((a, i) => <AttendeeBlock key={i} attendee={a} />)}
                                    </div>
                                </div>
                            )}

                            {externalAttendees.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] font-semibold text-violet-600 mb-2 uppercase tracking-wide flex items-center gap-1">
                                        <span className="w-1 h-1 bg-violet-500 rounded-full" />
                                        External
                                    </h4>
                                    <div className="flex flex-wrap">
                                        {externalAttendees.map((a, i) => <AttendeeBlock key={i} attendee={a} />)}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Notices - Redesigned as clean list */}
                    {meeting.notices && meeting.notices.length > 0 && (
                        <div>
                            <SectionTitle>
                                <LuTriangleAlert className="w-3 h-3 text-amber-500" />
                                Important Notices
                            </SectionTitle>
                            <ul className="ml-2.5 space-y-1.5">
                                {displayNotices?.map((notice, i) => (
                                    <li key={i} className="text-sm text-slate-600 flex items-start gap-2">
                                        <span className="w-1 h-1 rounded-full bg-amber-400 mt-2 shrink-0" />
                                        {notice}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
