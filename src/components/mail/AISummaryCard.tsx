import * as React from "react"
import { cn } from "@/lib/utils"
import { Card } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { CapsuleButton } from "@/components/ui/CapsuleButton"
import { TodoItem, TodoItemData } from "@/components/ui/TodoItem"
import { Todo, ActionCapsule } from "@/types/mail"

interface AISummaryCardProps {
    summary: string
    reason?: string
    tags?: string[]
    todos?: Todo[]
    actionCapsules?: ActionCapsule[]
}

export function AISummaryCard({ summary, reason, tags, todos, actionCapsules }: AISummaryCardProps) {
    // Generate bullet points from summary string if it's not already structured
    const summaryPoints = React.useMemo(() => {
        return summary.split(/(?<=[.!?。！？])\s+/).filter(s => s.trim().length > 0);
    }, [summary]);

    // Local state for todo completion (for visual feedback)
    const [completedTodos, setCompletedTodos] = React.useState<Set<string>>(
        new Set(todos?.filter(t => t.isCompleted).map(t => t.id))
    );

    const toggleTodo = (id: string) => {
        const next = new Set(completedTodos);
        if (next.has(id)) {
            next.delete(id);
        } else {
            next.add(id);
        }
        setCompletedTodos(next);
    };

    // Convert Todo to TodoItemData
    const convertToTodoItemData = (todo: Todo): TodoItemData => ({
        id: todo.id,
        content: todo.content,
        isDone: completedTodos.has(todo.id),
        deadline: todo.deadline ? new Date(todo.deadline).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : undefined,
        action: todo.action ? {
            label: todo.action.label,
            onClick: () => window.open(todo.action!.url, '_blank')
        } : undefined
    })

    return (
        <div className="space-y-4 mb-6">
            {/* 1. Summary Card */}
            <Card className="bg-comp-emphasize-tertiary border-none shadow-none overflow-hidden p-5">
                <div className="mb-4">
                    <h3 className="text-base font-bold text-brand mb-3 flex items-center justify-between">
                        <div className="flex items-center">
                            <span className="material-symbols-outlined text-[20px] mr-1.5 opacity-90">auto_awesome</span>
                            Summary
                        </div>
                        <div className="flex gap-2">
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-brand/60 hover:text-brand">
                                <span className="material-symbols-outlined text-[16px]">thumb_up</span>
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-brand/60 hover:text-brand">
                                <span className="material-symbols-outlined text-[16px]">thumb_down</span>
                            </Button>
                        </div>
                    </h3>

                    <ul className="space-y-2">
                        {summaryPoints.map((point, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-font-secondary leading-relaxed">
                                <span className="block w-1 h-1 rounded-full bg-font-tertiary mt-2 shrink-0" />
                                <span>{point}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Tags (Optional, kept small) */}
                {tags && tags.length > 0 && (
                    <div className="flex gap-2 mb-4 pl-3">
                        {tags.map(tag => (
                            <span key={tag} className="text-[11px] text-font-tertiary font-medium">#{tag}</span>
                        ))}
                    </div>
                )}

                {/* Action Buttons (Capsules) - No Icons */}
                {actionCapsules && actionCapsules.length > 0 && (
                    <div className="flex flex-wrap gap-2 pt-2 border-t border-brand/10">
                        {actionCapsules.map(capsule => (
                            <CapsuleButton
                                key={capsule.id}
                                variant={capsule.type === 'primary' ? 'secondary' : 'outline'}
                            >
                                {capsule.label}
                            </CapsuleButton>
                        ))}
                    </div>
                )}
            </Card>

            {/* 2. Todo Items (Using unified TodoItem component) */}
            {todos && todos.length > 0 && (
                <div className="space-y-2.5">
                    {todos.map(todo => (
                        <TodoItem
                            key={todo.id}
                            todo={convertToTodoItemData(todo)}
                            onToggle={() => toggleTodo(todo.id)}
                            animate={false}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}
