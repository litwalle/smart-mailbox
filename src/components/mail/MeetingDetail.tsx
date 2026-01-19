import * as React from "react"
import { format } from "date-fns"
import { Email } from "@/types/mail"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import {
    Calendar,
    MapPin,
    Video,
    Check,
    X,
    CircleHelp,
    Clock,
    FileText,
    ExternalLink,
    TriangleAlert
} from "lucide-react"

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
            accepted: { icon: Check, color: "text-confirm" },
            declined: { icon: X, color: "text-warning" },
            tentative: { icon: CircleHelp, color: "text-palette-10" },
            pending: { icon: Clock, color: "text-icon-tertiary" }
        }
        const config = statusConfig[attendee.status] || statusConfig.pending
        const StatusIcon = config.icon

        return (
            <div className="inline-flex items-center gap-2 bg-background-secondary border border-comp-divider rounded-md px-2.5 py-1 text-sm text-font-primary mr-2 mb-2">
                <span className="font-medium">{attendee.name}</span>
                <StatusIcon className={cn("w-3.5 h-3.5", config.color)} />
            </div>
        )
    }

    // Section Title - Design System Compliant
    const SectionTitle = ({ children }: { children: React.ReactNode }) => (
        <h3 className="text-[10px] font-bold text-font-secondary uppercase tracking-widest mb-3 flex items-center gap-2">
            <span className="w-0.5 h-3.5 bg-brand rounded-full" />
            {children}
        </h3>
    )

    return (
        <div className="max-w-4xl mx-auto px-8 pb-12 w-full">
            {/* Response Action Bar - Card Style */}
            <div className="mb-4 bg-background-primary border border-comp-divider rounded-lg p-4 min-h-[72px] flex items-center justify-between transition-all duration-300">
                {status === 'pending' ? (
                    <>
                        <div className="font-medium text-font-primary text-sm">确认此时程安排</div>
                        <div className="flex items-center gap-3">
                            <Button
                                variant="primary"
                                size="sm"
                                className="min-w-[90px] border-0"
                                onClick={() => setStatus('accepted')}
                            >
                                接受
                            </Button>
                            <Button
                                variant="secondary"
                                size="sm"
                                className="min-w-[90px]"
                                onClick={() => setStatus('tentative')}
                            >
                                待定
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="min-w-[80px]"
                                onClick={() => setStatus('declined')}
                            >
                                拒绝
                            </Button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-between w-full animate-in fade-in slide-in-from-right-4 duration-300">
                        <div className="flex items-center gap-3">
                            <div className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center",
                                status === 'accepted' && "bg-confirm/15 text-confirm",
                                status === 'declined' && "bg-background-secondary text-font-secondary",
                                status === 'tentative' && "bg-palette-10/15 text-palette-10"
                            )}>
                                {status === 'accepted' && <Check className="w-5 h-5" />}
                                {status === 'declined' && <X className="w-5 h-5" />}
                                {status === 'tentative' && <CircleHelp className="w-5 h-5" />}
                            </div>
                            <div className="flex flex-col">
                                <span className={cn(
                                    "font-semibold text-sm",
                                    status === 'accepted' && "text-confirm",
                                    status === 'declined' && "text-font-secondary",
                                    status === 'tentative' && "text-palette-10"
                                )}>
                                    {status === 'accepted' && "已接受"}
                                    {status === 'declined' && "已拒绝"}
                                    {status === 'tentative' && "待定"}
                                </span>
                                <span className="text-xs text-font-tertiary">
                                    {status === 'accepted' && "你已接受此会议邀请。"}
                                    {status === 'declined' && "你已拒绝此会议邀请。"}
                                    {status === 'tentative' && "你已将此会议标记为待定。"}
                                </span>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-font-tertiary hover:text-font-secondary"
                            onClick={() => setStatus('pending')}
                        >
                            更改回复
                        </Button>
                    </div>
                )}
            </div>

            {/* Main Card - Subtle shadow */}
            <div className="bg-background-primary border border-comp-divider rounded-lg overflow-hidden mt-0">

                {/* Card Header */}
                <div className="bg-background-secondary p-6 border-b border-comp-divider">
                    <div className="flex justify-between items-start gap-6">
                        <div className="flex-1">
                            {/* Badge */}
                            <div className="mb-2">
                                <span className={cn(
                                    "text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider",
                                    status === 'accepted' ? "bg-confirm text-font-on-primary" :
                                        status === 'declined' ? "bg-font-secondary text-font-on-primary" :
                                            "bg-brand text-font-on-primary"
                                )}>
                                    {status === 'pending' ? '会议邀请' : status}
                                </span>
                            </div>

                            {/* Title */}
                            <h2 className="text-xl font-bold text-font-primary mb-4">{displayTitle}</h2>

                            {/* Info Rows */}
                            <div className="space-y-2">
                                <div className="flex items-center gap-2.5 text-font-primary">
                                    <Calendar className="w-4 h-4 text-brand shrink-0" />
                                    <span className="font-medium text-sm">
                                        {dateStr} {timeStr}
                                        <span className="text-font-tertiary font-normal ml-1.5">({meeting.timeZone})</span>
                                    </span>
                                </div>
                                <div className="flex items-center gap-2.5 text-font-primary">
                                    <MapPin className="w-4 h-4 text-warning shrink-0" />
                                    <span className="font-medium text-sm">{displayLocation}</span>
                                </div>
                            </div>
                        </div>

                        {/* Date Block - Clean */}
                        <div className="bg-background-primary border border-comp-divider rounded-lg px-4 py-3 flex flex-col items-center shrink-0 min-w-[72px]">
                            <span className="text-[10px] font-bold text-warning uppercase tracking-widest">
                                {format(startDate, "MMM")}
                            </span>
                            <span className="text-3xl font-black text-font-primary leading-none mt-0.5">
                                {format(startDate, "d")}
                            </span>
                        </div>
                    </div>

                    {/* Actions - Now only Join Buttons on Left */}
                    <div className="mt-5 pt-4 border-t border-comp-divider/60 flex items-center justify-between min-h-[40px]">
                        {/* Join Meeting Buttons - Moved to Left, Distinct Colors */}
                        {meeting.joinUrl && (
                            <div className="flex items-center gap-3">
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="h-9 px-4 gap-2 border-0"
                                    onClick={() => window.open(meeting.joinUrl, '_blank')}
                                >
                                    <span className="material-symbols-outlined text-[18px]">videocam</span>
                                    Host
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="h-9 px-4 gap-2 bg-confirm hover:bg-confirm/90 border-0"
                                    onClick={() => window.open(meeting.joinUrl, '_blank')}
                                >
                                    <span className="material-symbols-outlined text-[18px]">videocam</span>
                                    Guest
                                </Button>
                                <Button
                                    variant="primary"
                                    size="sm"
                                    className="h-9 px-4 gap-2 bg-palette-6 hover:bg-palette-6/90 border-0"
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
                            <SectionTitle>会议议程</SectionTitle>
                            <div className="border border-comp-divider rounded-lg overflow-hidden ml-2.5">
                                <table className="w-full text-sm">
                                    <thead className="bg-background-secondary/80 text-font-secondary text-xs font-medium border-b border-comp-divider">
                                        <tr>
                                            <th className="px-3 py-2 w-10 text-center">#</th>
                                            <th className="px-3 py-2 text-left">主题</th>
                                            <th className="px-3 py-2 w-24 text-left">类型</th>
                                            <th className="px-3 py-2 w-24 text-left">时间</th>
                                            <th className="px-3 py-2 w-16 text-right">时长</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-comp-divider/50">
                                        {meeting.agendaItems.map((item, index) => (
                                            <tr key={item.id} className="hover:bg-background-secondary/50">
                                                <td className="px-3 py-2 text-center text-font-tertiary font-mono text-xs">{index + 1}</td>
                                                <td className="px-3 py-2 font-medium text-font-primary">{getAgendaTitle(item)}</td>
                                                <td className="px-3 py-2">
                                                    <span className="inline-flex px-1.5 py-0.5 rounded text-xs font-medium bg-brand/10 text-brand">
                                                        {getAgendaType(item)}
                                                    </span>
                                                </td>
                                                <td className="px-3 py-2 text-font-secondary font-mono text-xs">{item.time}</td>
                                                <td className="px-3 py-2 text-right text-font-secondary">{item.duration}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Resources */}
                    <div>
                        <SectionTitle>会议资料</SectionTitle>
                        <div className="flex items-center gap-2 ml-2.5">
                            <Button variant="secondary" size="sm" className="gap-1.5 text-font-secondary text-xs h-8">
                                <FileText className="w-3.5 h-3.5" />
                                查看详细议程
                            </Button>
                            {meeting.materials && meeting.materials.length > 0 && (
                                <Button variant="secondary" size="sm" className="gap-1.5 text-font-secondary text-xs h-8">
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    查看参考资料 ({meeting.materials.length})
                                </Button>
                            )}
                        </div>
                    </div>

                    {/* Attendees */}
                    <div>
                        <SectionTitle>
                            参会人员 <span className="text-font-tertiary font-normal">({meeting.attendees.length})</span>
                        </SectionTitle>

                        <div className="ml-2.5 space-y-4">
                            {internalAttendees.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] font-semibold text-confirm mb-2 uppercase tracking-wide flex items-center gap-1">
                                        <span className="w-1 h-1 bg-confirm rounded-full" />
                                        内部人员
                                    </h4>
                                    <div className="flex flex-wrap">
                                        {internalAttendees.map((a, i) => <AttendeeBlock key={i} attendee={a} />)}
                                    </div>
                                </div>
                            )}

                            {externalAttendees.length > 0 && (
                                <div>
                                    <h4 className="text-[10px] font-semibold text-palette-6 mb-2 uppercase tracking-wide flex items-center gap-1">
                                        <span className="w-1 h-1 bg-palette-6 rounded-full" />
                                        外部人员
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
                                <TriangleAlert className="w-3 h-3 text-palette-10" />
                                重要提示
                            </SectionTitle>
                            <ul className="ml-2.5 space-y-1.5">
                                {displayNotices?.map((notice, i) => (
                                    <li key={i} className="text-sm text-font-secondary flex items-start gap-2">
                                        <span className="w-1 h-1 rounded-full bg-palette-10 mt-2 shrink-0" />
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
