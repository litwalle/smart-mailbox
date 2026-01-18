import * as React from "react"
import { useMailStore } from "@/store/mailStore"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
// Import icons
import {
    Archive,
    Trash2,
    Mail,
    Check
} from "lucide-react"
import { MailDetailHeader } from "./MailDetailHeader"
import { MailDetailToolbar } from "./MailDetailToolbar"
import { BulkActionsToolbar } from "./BulkActionsToolbar"
import { MeetingDetail } from "./MeetingDetail"
import { SplitMailView } from "./SplitMailView"
import { SegmentedControl } from "@/components/ui/SegmentedControl"

export function MailDetail() {
    const {
        emails,
        selectedEmailId,
        selectedEmailIds,
        markAsRead,
        toggleStar,
        deleteEmail,
        archiveEmail
    } = useMailStore()

    const email = emails.find(e => e.id === selectedEmailId)
    const isMultiSelect = selectedEmailIds.length > 1

    // Safety check - if nothing selected (should imply no detail view or empty state, but let's handle grace)
    if (!email && !isMultiSelect) {
        return (
            <div className="flex items-center justify-center h-full text-slate-400">
                Select an email to view
            </div>
        )
    }

    // --- STACKED VIEW MODE ---
    // --- STACKED VIEW MODE ---
    if (isMultiSelect) {
        const selectedCount = selectedEmailIds.length
        // Get up to 3 selected emails for previews (latest first)
        // Get up to 3 selected emails for previews (latest SELECTED first)
        // User wants the newly selected email to "stack on top".
        // So we use selectedEmailIds (which appends new ones) in reverse order.
        const selectedCards = [...selectedEmailIds]
            .reverse()
            .slice(0, 3)
            .map(id => emails.find(e => e.id === id))
            .filter((e): e is import("@/types/mail").Email => !!e)

        return (
            <div className="flex flex-col h-full bg-slate-50/50 relative overflow-hidden items-center justify-center">

                {/* Stacked Cards Container */}
                <div className="relative w-full max-w-2xl h-[420px] lg:h-[480px] flex items-center justify-center mb-12 perspective-1000">
                    {/* We map the cards in REVERSE order for z-index stacking if we just use index.
                         But simpler: Render normally and use absolute z-index.
                         Item 0 is Top. z-30.
                     */}
                    {selectedCards.map((cardEmail, i) => (
                        <div
                            key={cardEmail.id}
                            className={cn(
                                "absolute w-full h-full bg-white rounded-2xl shadow-xl border border-slate-100 transition-all duration-500 ease-out flex flex-col overflow-hidden fill-mode-backwards",
                                // Entry Animation: "Cover from top"
                                "animate-in fade-in slide-in-from-top-10 zoom-in-95",
                                // Stack Effect
                                i === 0 && "z-30 transform scale-100 translate-y-0 opacity-100 shadow-2xl",
                                i === 1 && "z-20 transform scale-[0.96] translate-y-4 opacity-100 shadow-lg", // Visible underneath
                                i === 2 && "z-10 transform scale-[0.92] translate-y-8 opacity-90 shadow-md",
                                // Subtle rotation for realism? User didn't strictly ask but mentions "real email screenshot". 
                                // Clean stack is often preferred. Let's keep it straight but stepped.
                            )}
                            style={{
                                animationDelay: `${i * 100}ms`,
                                top: 0
                            }}
                        >
                            {/* Fake Email Content (Preview) */}
                            {/* Header */}
                            <div className="px-8 py-6 border-b border-slate-50 flex items-start justify-between bg-white">
                                <div className="flex items-center gap-4">
                                    {cardEmail.from.avatar ? (
                                        <img src={cardEmail.from.avatar} className="w-12 h-12 rounded-full border border-slate-100" />
                                    ) : (
                                        <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg">
                                            {cardEmail.from.name[0]}
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-bold text-slate-900 text-lg">{cardEmail.from.name}</div>
                                        <div className="text-sm text-slate-500">{format(new Date(cardEmail.sentAt), "MMM d, h:mm a")}</div>
                                    </div>
                                </div>
                            </div>
                            {/* Body Preview */}
                            <div className="p-8 flex-1 bg-white">
                                <h1 className="text-2xl font-bold text-slate-900 mb-6 leading-tight line-clamp-2">{cardEmail.subject}</h1>
                                <div className="space-y-3">
                                    <div className="h-4 bg-slate-100 rounded w-full" />
                                    <div className="h-4 bg-slate-100 rounded w-5/6" />
                                    <div className="h-4 bg-slate-100 rounded w-full" />
                                    <div className="h-4 bg-slate-100 rounded w-4/5" />
                                    {/* Small text preview if available */}
                                    <p className="text-slate-400 mt-4 line-clamp-3 leading-relaxed">
                                        {cardEmail.aiSummary || cardEmail.preview}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Fallback if somehow no cards */}
                    {selectedCards.length === 0 && (
                        <div className="text-slate-400">No content</div>
                    )}
                </div>

                {/* Bottom Actions Bar (Below cards) */}
                <BulkActionsToolbar
                    mode="floating"
                    selectedCount={selectedCount}
                    onClose={() => useMailStore.getState().clearSelection()} // or pass a handler
                    onArchive={() => console.log('Archive')}
                    onDelete={() => console.log('Delete')}
                    onMarkUnread={() => console.log('Mark Unread')}
                    onSelectAll={() => {
                        // Decide if we want "Select All" in the floating toolbar. 
                        // Usually floating toolbar has "X" to clear. 
                        // If user clicks checkbox in floating toolbar, it should probably select all similarly?
                        // The floating toolbar implementation of the checkbox now triggers onSelectAll.
                        const { selectAll, clearSelection } = useMailStore.getState();
                        if (selectedEmailIds.length === emails.length) {
                            clearSelection();
                        } else {
                            // Assuming we select all in current "view" (emails list)
                            // Since MailDetail doesn't know about Filtered View directly unless we select from store...
                            // But 'emails' prop here is from useMailStore() which returns ALL emails usually, or filtered?
                            // useMailStore() returns `emails` state which is ALL.
                            // MailList uses `getFilteredEmails`. 
                            // We should probably use `selectAll` action from store which mimics MailList logic if properly implemented?
                            // Store's `selectAll` uses `getFilteredEmails`. So calling it is correct.
                            selectAll();
                        }
                    }}
                    isAllSelected={selectedEmailIds.length === emails.length && emails.length > 0}
                    className="delay-150"
                />

            </div>
        )
    }

    // --- SINGLE VIEW MODE (Original) ---
    if (!email) return null // Should be handled above

    return (
        <div className="flex flex-col h-full bg-white">
            <MailDetailToolbar
                email={email}
                onReply={() => console.log("Reply", email.id)}
                onReplyAll={() => console.log("Reply All", email.id)}
                onForward={() => console.log("Forward", email.id)}
                onToggleRead={() => markAsRead(email.id, !email.isRead)}
                onMove={() => archiveEmail(email.id)}
                onFlag={() => toggleStar(email.id)}
                onMore={() => console.log("More", email.id)}
            />

            {/*
                Meeting emails: Need header + MeetingDetail (as body)
                Normal emails: MailDetailContent (which includes SplitMailView with header inside)
            */}
            {(email.meetingRequest || email.labels.includes('Meeting')) ? (
                <MeetingEmailContent email={email} onToggleStar={toggleStar} />
            ) : (
                <MailDetailContent email={email} />
            )}
        </div>
    )
}

function MailDetailContent({ email }: { email: import("@/types/mail").Email }) {
    const [translationMode, setTranslationMode] = React.useState<'original' | 'translation' | 'split'>('original')

    // Reset on email change
    React.useEffect(() => {
        setTranslationMode('original')
    }, [email.id])

    return (
        <>
            {/* Translation Toolbar - Sticky/Fixed at top of content area */}
            {email.translatedContent && (
                <div className="px-8 py-2 bg-white border-b border-slate-50 flex items-center justify-between shrink-0 z-20">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-indigo-500 text-[18px]">translate</span>
                        <span className="text-sm font-semibold text-slate-700">AI Translation</span>
                    </div>
                    <SegmentedControl
                        value={translationMode}
                        onChange={(val) => setTranslationMode(val as any)}
                        options={[
                            { value: 'original', label: 'Original' },
                            { value: 'translation', label: 'Translation' },
                            { value: 'split', label: 'Contrast' }
                        ]}
                        size="sm"
                    />
                </div>
            )}

            {/* Split View (Handles Scrolling internally) */}
            <SplitMailView
                email={email}
                translationMode={translationMode}
            />
        </>
    )
}

function MeetingEmailContent({ email, onToggleStar }: { email: import("@/types/mail").Email, onToggleStar: (id: string) => void }) {
    const [translationMode, setTranslationMode] = React.useState<'original' | 'translation' | 'split'>('original')
    const meeting = email.meetingRequest

    // Check if translation is available
    const hasTranslation = meeting?.translatedTitle || email.translatedContent

    // Reset on email change
    React.useEffect(() => {
        setTranslationMode('original')
    }, [email.id])

    return (
        <>
            {/* Translation Toolbar - Same as regular emails */}
            {hasTranslation && (
                <div className="px-8 py-2 bg-white border-b border-slate-50 flex items-center justify-between shrink-0 z-20">
                    <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-indigo-500 text-[18px]">translate</span>
                        <span className="text-sm font-semibold text-slate-700">AI Translation</span>
                    </div>
                    <SegmentedControl
                        value={translationMode}
                        onChange={(val) => setTranslationMode(val as any)}
                        options={[
                            { value: 'original', label: 'Original' },
                            { value: 'translation', label: 'Translation' },
                            { value: 'split', label: 'Contrast' }
                        ]}
                        size="sm"
                    />
                </div>
            )}

            {/* Use SplitMailView for unified translation/contrast handling */}
            <SplitMailView
                email={email}
                translationMode={translationMode}
            />
        </>
    )
}
