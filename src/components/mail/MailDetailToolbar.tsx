import {
    LuReply,
    LuReplyAll,
    LuForward,
    LuMail,
    LuMailOpen,
    LuFolderInput,
    LuFlag,
    LuEllipsisVertical
} from "react-icons/lu"
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
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0">
            <div className="flex items-center gap-1">
                {/* Reply Actions */}
                <button
                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Reply"
                    onClick={onReply}
                >
                    <LuReply className="w-5 h-5" />
                </button>
                <button
                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Reply All"
                    onClick={onReplyAll}
                >
                    <LuReplyAll className="w-5 h-5" />
                </button>
                <button
                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Forward"
                    onClick={onForward}
                >
                    <LuForward className="w-5 h-5" />
                </button>

                <div className="w-px h-5 bg-slate-200 mx-2" />

                {/* Status Actions */}
                <button
                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    title={email.isRead ? "Mark as Unread" : "Mark as Read"}
                    onClick={onToggleRead}
                >
                    {email.isRead ? <LuMail className="w-5 h-5" /> : <LuMailOpen className="w-5 h-5" />}
                </button>
                <button
                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Move to..."
                    onClick={onMove}
                >
                    <LuFolderInput className="w-5 h-5" />
                </button>

                <div className="w-px h-5 bg-slate-200 mx-2" />

                {/* Flag & More */}
                <button
                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    title="Flag"
                    onClick={onFlag}
                >
                    <LuFlag className="w-5 h-5" />
                </button>
                <button
                    className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                    title="More options"
                    onClick={onMore}
                >
                    <LuEllipsisVertical className="w-5 h-5" />
                </button>
            </div>

        </div>
    )
}
