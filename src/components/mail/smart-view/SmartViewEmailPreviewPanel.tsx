import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { Email } from "@/types/mail"
import { isToday, isYesterday, format } from "date-fns"

interface SmartViewEmailPreviewPanelProps {
    emails: Email[]
    viewName: string
}

// Simplified email item for preview
function PreviewEmailItem({ email, index }: { email: Email; index: number }) {
    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr)
        if (isToday(date)) return format(date, 'HH:mm')
        if (isYesterday(date)) return '昨天'
        return format(date, 'M月d日')
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex items-start gap-3 p-3 bg-white rounded-lg border border-comp-divider shadow-sm"
        >
            {/* Avatar */}
            <div className="size-9 rounded-full bg-background-tertiary flex items-center justify-center shrink-0 overflow-hidden">
                {email.from.avatar ? (
                    <img src={email.from.avatar} alt="" className="size-full object-cover" />
                ) : (
                    <span className="text-xs font-bold text-font-secondary">
                        {email.from.name.charAt(0).toUpperCase()}
                    </span>
                )}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                    <span className={cn(
                        "text-sm truncate",
                        email.isRead ? "text-font-secondary" : "text-font-primary font-semibold"
                    )}>
                        {email.from.name}
                    </span>
                    <span className="text-[11px] text-font-tertiary shrink-0">
                        {formatTime(email.sentAt)}
                    </span>
                </div>
                <div className={cn(
                    "text-sm truncate mb-0.5",
                    email.isRead ? "text-font-secondary" : "text-font-primary font-medium"
                )}>
                    {email.subject}
                </div>
                <div className="text-xs text-font-tertiary truncate">
                    {email.preview}
                </div>
            </div>
        </motion.div>
    )
}

export function SmartViewEmailPreviewPanel({ emails, viewName }: SmartViewEmailPreviewPanelProps) {
    return (
        <div className="flex-1 bg-dot-pattern relative overflow-hidden flex flex-col">
            {/* Header */}
            <div className="h-12 px-6 flex items-center justify-between border-b border-comp-divider bg-white/80 backdrop-blur-sm shrink-0 z-10">
                <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-brand text-[18px]">mail</span>
                    <h3 className="text-sm font-medium text-font-primary">
                        邮件匹配示例
                    </h3>
                    {viewName && (
                        <span className="text-xs text-font-tertiary">
                            (视图：{viewName})
                        </span>
                    )}
                </div>
                <div className="text-xs text-font-tertiary">
                    {emails.length} 封匹配
                </div>
            </div>

            {/* Email List */}
            <div className="flex-1 overflow-y-auto p-6">
                <AnimatePresence mode="popLayout">
                    {emails.length > 0 ? (
                        <div className="space-y-3 max-w-2xl mx-auto">
                            {emails.map((email, index) => (
                                <PreviewEmailItem key={email.id} email={email} index={index} />
                            ))}
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center h-full text-center"
                        >
                            <div className="size-16 rounded-full bg-background-secondary flex items-center justify-center mb-4">
                                <span className="material-symbols-outlined text-[28px] text-icon-tertiary">
                                    search_off
                                </span>
                            </div>
                            <p className="text-sm font-medium text-font-secondary mb-1">
                                暂无匹配邮件
                            </p>
                            <p className="text-xs text-font-tertiary max-w-xs">
                                请从左侧列表选择视图，或调整规则以查看匹配结果。
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Footer */}
            <div className="h-12 px-6 flex items-center border-t border-comp-divider bg-white/80 backdrop-blur-sm shrink-0 z-10">
                <div className="flex items-center gap-2 text-xs text-font-tertiary">
                    <span className="material-symbols-outlined text-[14px] text-brand">info</span>
                    <span>预览仅显示收件箱中匹配的前 5 封邮件。</span>
                </div>
            </div>
        </div>
    )
}
