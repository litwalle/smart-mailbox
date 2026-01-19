import {
    Reply,
    ReplyAll,
    Forward,
    Mail,
    MailOpen,
    FolderInput,
    Flag,
    EllipsisVertical,
    Languages,
    FileText,
    Columns2
} from "lucide-react"
import { format } from "date-fns"
import { Email } from "@/types/mail"
import {
    DropdownMenu,
    DropdownMenuTrigger,
    DropdownMenuContent,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

interface MailDetailToolbarProps {
    email: Email
    translationMode: 'original' | 'translation' | 'split'
    setTranslationMode: (mode: 'original' | 'translation' | 'split') => void
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
    translationMode,
    setTranslationMode,
    onReply,
    onReplyAll,
    onForward,
    onToggleRead,
    onMove,
    onFlag,
    onMore
}: MailDetailToolbarProps) {

    // Helper to get current icon
    const getTranslationIcon = () => {
        switch (translationMode) {
            case 'original':
                return <FileText className="w-5 h-5 stroke-[1.5px]" />
            case 'translation':
                return <Languages className="w-5 h-5 stroke-[1.5px]" />
            case 'split':
                return <Columns2 className="w-5 h-5 stroke-[1.5px]" />
        }
    }

    // Check if translation is available to show the button
    const hasTranslation = email.translatedContent || (email.meetingRequest && (email.meetingRequest.translatedTitle || email.meetingRequest.translatedNotices))

    return (
        <div className="flex items-center justify-between px-6 py-4 border-b border-comp-divider shrink-0">
            <div className="flex items-center gap-1">
                {/* Reply Actions */}
                <button
                    className="p-2 text-icon-primary hover:text-icon-primary hover:bg-background-secondary rounded-lg transition-colors"
                    title="回复"
                    onClick={onReply}
                >
                    <Reply className="w-5 h-5 stroke-[1.5px]" />
                </button>
                <button
                    className="p-2 text-icon-primary hover:text-icon-primary hover:bg-background-secondary rounded-lg transition-colors"
                    title="回复全部"
                    onClick={onReplyAll}
                >
                    <ReplyAll className="w-5 h-5 stroke-[1.5px]" />
                </button>
                <button
                    className="p-2 text-icon-primary hover:text-icon-primary hover:bg-background-secondary rounded-lg transition-colors"
                    title="转发"
                    onClick={onForward}
                >
                    <Forward className="w-5 h-5 stroke-[1.5px]" />
                </button>

                <div className="w-px h-5 bg-comp-divider mx-2" />

                {/* Status Actions */}
                <button
                    className="p-2 text-icon-primary hover:text-icon-primary hover:bg-background-secondary rounded-lg transition-colors"
                    title={email.isRead ? "标记为未读" : "标记为已读"}
                    onClick={onToggleRead}
                >
                    {email.isRead ? <Mail className="w-5 h-5 stroke-[1.5px]" /> : <MailOpen className="w-5 h-5 stroke-[1.5px]" />}
                </button>
                <button
                    className="p-2 text-icon-primary hover:text-icon-primary hover:bg-background-secondary rounded-lg transition-colors"
                    title="移动到..."
                    onClick={onMove}
                >
                    <FolderInput className="w-5 h-5 stroke-[1.5px]" />
                </button>

                <div className="w-px h-5 bg-comp-divider mx-2" />

                {/* Flag & More */}
                <button
                    className="p-2 text-icon-primary hover:text-icon-primary hover:bg-background-secondary rounded-lg transition-colors"
                    title="标记"
                    onClick={onFlag}
                >
                    <Flag className="w-5 h-5 stroke-[1.5px]" />
                </button>
                <button
                    className="p-2 text-icon-primary hover:text-icon-primary hover:bg-background-secondary rounded-lg transition-colors"
                    title="更多选项"
                    onClick={onMore}
                >
                    <EllipsisVertical className="w-5 h-5 stroke-[1.5px]" />
                </button>
            </div>

            {/* Right Side: Translation Actions */}
            <div className="flex items-center gap-1">
                {hasTranslation && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className="p-2 text-icon-primary hover:text-icon-primary hover:bg-background-secondary rounded-lg transition-colors flex items-center gap-2 group outline-none"
                                title="翻译视图"
                            >
                                {getTranslationIcon()}
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setTranslationMode('original')}>
                                <FileText className="w-4 h-4 mr-2" />
                                <span>原文</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTranslationMode('translation')}>
                                <Languages className="w-4 h-4 mr-2" />
                                <span>译文</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setTranslationMode('split')}>
                                <Columns2 className="w-4 h-4 mr-2" />
                                <span>对照</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    )
}
