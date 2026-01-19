import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/Card"
import { CapsuleButton } from "@/components/ui/CapsuleButton"

/**
 * TodoItem - 统一待办事项控件
 * 
 * 采用正文样式：扁平卡片布局，左侧checkbox，中间内容+deadline，右侧操作按钮
 * 
 * 【设计规范】
 * - Deadline 颜色规则：三天内截止的任务显示红色 (`isUrgent !== false`)，超过三天显示灰色 (`isUrgent: false`)。
 * - 默认行为：如果设置了 deadline 但未明确设置 `isUrgent: false`，则视为紧急（红色）。
 * - 完成行为：点击完成后，项目会停留 1 秒后消失（调用 `onDismiss`）。
 */

export interface TodoItemData {
    id: string
    content: string
    isDone: boolean
    deadline?: string
    /** 是否为紧急任务（三天内）。默认 true（红色），设置为 false 则显示为灰色。 */
    isUrgent?: boolean
    /** 关联的邮件 ID，用于点击跳转到邮件详情 */
    relatedEmailId?: string
    action?: {
        label: string
        onClick?: () => void
    }
}

interface TodoItemProps {
    todo: TodoItemData
    onToggle?: () => void
    /** 完成后延迟消失时调用（用于从列表中移除） */
    onDismiss?: () => void
    /** 点击整个卡片时触发（导航到邮件详情） */
    onClick?: () => void
    className?: string
    animate?: boolean
}

export function TodoItem({ todo, onToggle, onDismiss, onClick, className, animate = false }: TodoItemProps) {
    // 延迟消失逻辑：完成后停留 1 秒再触发 onDismiss
    React.useEffect(() => {
        if (todo.isDone && onDismiss) {
            const timer = setTimeout(() => {
                onDismiss();
            }, 1000); // 1秒延迟
            return () => clearTimeout(timer);
        }
    }, [todo.isDone, onDismiss]);

    const content = (
        <Card
            className={cn(
                "p-4 border transition-all flex items-center gap-3",
                todo.isDone
                    ? "bg-background-secondary border-comp-divider"
                    : "bg-background-primary border-comp-divider hover:border-brand/30",
                onClick && "cursor-pointer",
                className
            )}
            onClick={onClick}
        >
            {/* Checkbox - 圆形 + 品牌色 */}
            <div
                onClick={(e) => {
                    e.stopPropagation()
                    onToggle?.()
                }}
                className={cn(
                    "h-5 w-5 rounded border cursor-pointer flex items-center justify-center shrink-0 transition-colors",
                    todo.isDone
                        ? "bg-brand border-brand"
                        : "border-comp-divider hover:border-brand/50"
                )}
            >
                {todo.isDone && (
                    <span className="material-symbols-outlined text-font-on-primary text-[14px]">check</span>
                )}
            </div>

            {/* Content & Deadline */}
            <div className="flex-1 flex flex-col justify-center min-w-0">
                <span className={cn(
                    "text-sm font-medium transition-colors",
                    todo.isDone ? "text-font-tertiary line-through" : "text-font-primary"
                )}>
                    {todo.content}
                </span>
                {todo.deadline && !todo.isDone && (
                    <span className={cn(
                        "text-[11px] font-medium mt-0.5",
                        todo.isUrgent !== false ? "text-warning" : "text-font-tertiary"
                    )}>
                        截止: {todo.deadline}
                    </span>
                )}
            </div>

            {/* Action Button (Optional) */}
            {todo.action && (
                <div className="flex items-center shrink-0">
                    <CapsuleButton
                        variant={todo.isDone ? 'outline' : 'secondary'}
                        className={todo.isDone ? 'opacity-50' : ''}
                        onClick={(e) => {
                            e.stopPropagation()
                            todo.action?.onClick?.()
                        }}
                    >
                        {todo.action.label}
                    </CapsuleButton>
                </div>
            )}
        </Card>
    )

    if (animate) {
        return (
            <motion.div
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0, marginBottom: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
            >
                {content}
            </motion.div>
        )
    }

    return content
}
