import * as React from "react"
import { Star, Reply, ReplyAll, Forward, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Email } from "@/types/mail"
import { AISummaryCard } from "./AISummaryCard"
import { MailRecipientDetails } from "./MailRecipientDetails"
import { Tag, TagVariant } from "@/components/ui/Tag"

interface MailDetailHeaderProps {
    email: Email
    onToggleStar: (id: string) => void
}

export function MailDetailHeader({ email, onToggleStar }: MailDetailHeaderProps) {
    const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)

    // Generate Recipient Summary
    const recipientSummary = React.useMemo(() => {
        // Mock checking "me" (u1)
        const meId = 'u1';
        const otherRecipients = email.to.filter(u => u.id !== meId);
        const hasMe = email.to.some(u => u.id === meId);

        let text = hasMe ? "me" : "";

        if (otherRecipients.length > 0) {
            if (text) text += ", ";
            text += otherRecipients[0].name.split(' ')[0]; // First name only for brevity

            const remainingCount = otherRecipients.length - 1 + (email.cc?.length || 0);
            if (remainingCount > 0) {
                text += ` and ${remainingCount} others`;
            } else if (email.cc && email.cc.length > 0) {
                text += ` and ${email.cc.length} others`;
            }
        } else {
            // Just me
            if (email.cc && email.cc.length > 0) {
                text += ` and ${email.cc.length} others`;
            }
        }

        return text || "Recipients";
    }, [email.to, email.cc]);

    // Generate Display Tags (Consistent Logic)
    const displayTags = React.useMemo(() => {
        const tags: { label: string; variant: TagVariant }[] = []

        // 1. Action Required (Priority 1) -> RED
        if (email.priority === 'high') {
            tags.push({ label: 'Urgent', variant: 'urgent' })
        }

        // 2. Time Pressure Tags (Priority 1)
        if (email.deadline) {
            tags.push({
                label: email.deadline.includes('Tomorrow') ? 'Tomorrow' : 'Today',
                variant: 'today'
            })
        }

        // 3. Content Category 
        const contentLabels = email.labels?.filter(l => !['Meeting', 'Work', 'Personal', 'Urgent', 'High Priority'].includes(l)) || []
        contentLabels.forEach(l => {
            tags.push({ label: l, variant: 'default' })
        })

        // 4. Sender/General
        if (email.labels?.includes('Work')) {
            tags.push({ label: 'Work', variant: 'work' })
        }

        return tags.slice(0, 3)
    }, [email])

    return (
        <div className="max-w-4xl mx-auto px-8 pt-8 pb-0">
            {/* Subject */}
            <div className="flex items-start justify-between gap-4 mb-2">
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">
                    {email.subject}
                </h1>
                <button
                    onClick={() => onToggleStar(email.id)}
                    className="p-1 rounded-full hover:bg-slate-100 transition-colors shrink-0 mt-1"
                >
                    <Star className={cn("w-6 h-6", email.isStarred ? "fill-yellow-400 text-yellow-400" : "text-slate-300")} />
                </button>
            </div>

            {/* Tags (Below Title) */}
            {displayTags.length > 0 && (
                <div className="flex items-center gap-2 mb-6">
                    {displayTags.map((tag, i) => (
                        <Tag key={i} variant={tag.variant}>
                            {tag.label}
                        </Tag>
                    ))}
                </div>
            )}

            {/* Sender Info - Enhanced */}
            <div className="flex items-start gap-4 mb-8">
                {email.from.avatar ? (
                    <img
                        src={email.from.avatar}
                        className="h-12 w-12 rounded-full object-cover bg-slate-200 border border-slate-100 shrink-0"
                        alt={email.from.name}
                    />
                ) : (
                    <div className="h-12 w-12 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center text-lg font-bold text-slate-600 shrink-0">
                        {email.from.name.charAt(0)}
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                        <div className="font-semibold text-slate-900">{email.from.name}</div>
                        <div className="text-sm text-slate-500 font-medium whitespace-nowrap ml-4">
                            {format(new Date(email.sentAt), "MMM d, yyyy, h:mm a")}
                        </div>
                    </div>

                    {/* Toggle Interaction */}
                    <div
                        className="flex items-center gap-1 text-sm text-slate-500 cursor-pointer hover:text-slate-800 transition-colors group select-none"
                        onClick={() => setIsDetailsOpen(!isDetailsOpen)}
                    >
                        <span className="truncate">
                            &lt;{email.from.email}&gt; to {recipientSummary}
                        </span>
                        <div className={cn(
                            "p-0.5 rounded-sm transition-all duration-200",
                            isDetailsOpen ? "bg-slate-100 rotate-180" : "group-hover:bg-slate-100"
                        )}>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Expanded Details Panel - Full Width */}
            {isDetailsOpen && (
                <div className="mb-8">
                    <MailRecipientDetails
                        email={email}
                        currentUserId="u1"
                        onClose={() => setIsDetailsOpen(false)}
                    />
                </div>
            )}

            {/* AI Summary, Todos, and Action Capsules Card */}
            {
                (email.aiSummary || (email.aiTodos && email.aiTodos.length > 0) || (email.actionCapsules && email.actionCapsules.length > 0)) && (
                    <AISummaryCard
                        summary={email.aiSummary || email.preview}
                        reason={email.aiReason}
                        tags={email.aiTags}
                        todos={email.aiTodos}
                        actionCapsules={email.actionCapsules}
                    />
                )
            }
        </div >
    )
}
