import {
    Reply,
    ReplyAll,
    Forward,
    Mail,
    MailOpen,
    FolderInput,
    Flag,
    EllipsisVertical
} from "lucide-react"
import { format } from "date-fns"
import { Email } from "@/types/mail"

interface MailDetailToolbarProps {
    email: Email
    onReply?: () => void
    onReplyAll?: () => void
    onForward?: () => void
    onToggleRead?: () => void
    onMove?: () => void
    onFlag?: () => void
    onMore?: () => void
}

export function MailDetailToolbar({
    email,
    onReply,
    onReplyAll,
    onForward,
    onToggleRead,
    onMove,
    onFlag,
    onMore
}: MailDetailToolbarProps) {
    return (
        <div className="flex items-center justify-between px-6 py-4 border-b border-comp-divider shrink-0">
            <div className="flex items-center gap-1">
                {/* Reply Actions */}
                <button
                    className="p-2 text-icon-primary hover:text-icon-primary hover:bg-background-secondary rounded-lg transition-colors"
                    title="Reply"
                    onClick={onReply}
                >
                    <Reply className="w-5 h-5" />
                </button>
                <button
                    className="p-2 text-icon-primary hover:text-icon-primary hover:bg-background-secondary rounded-lg transition-colors"
                    title="Reply All"
                    onClick={onReplyAll}
                >
                    <ReplyAll className="w-5 h-5" />
                </button>
                <button
                    className="p-2 text-icon-primary hover:text-icon-primary hover:bg-background-secondary rounded-lg transition-colors"
                    title="Forward"
                    onClick={onForward}
                >
                    <Forward className="w-5 h-5" />
                </button>

                <div className="w-px h-5 bg-comp-divider mx-2" />

                {/* Status Actions */}
                <button
                    className="p-2 text-icon-primary hover:text-icon-primary hover:bg-background-secondary rounded-lg transition-colors"
                    title={email.isRead ? "Mark as Unread" : "Mark as Read"}
                    onClick={onToggleRead}
                >
                    {email.isRead ? <Mail className="w-5 h-5" /> : <MailOpen className="w-5 h-5" />}
                </button>
                <button
                    className="p-2 text-icon-primary hover:text-icon-primary hover:bg-background-secondary rounded-lg transition-colors"
                    title="Move to..."
                    onClick={onMove}
                >
                    <FolderInput className="w-5 h-5" />
                </button>

                <div className="w-px h-5 bg-comp-divider mx-2" />

                {/* Flag & More */}
                <button
                    className="p-2 text-icon-primary hover:text-icon-primary hover:bg-background-secondary rounded-lg transition-colors"
                    title="Flag"
                    onClick={onFlag}
                >
                    <Flag className="w-5 h-5" />
                </button>
                <button
                    className="p-2 text-icon-primary hover:text-icon-primary hover:bg-background-secondary rounded-lg transition-colors"
                    title="More options"
                    onClick={onMore}
                >
                    <EllipsisVertical className="w-5 h-5" />
                </button>
            </div>

        </div>
    )
}
