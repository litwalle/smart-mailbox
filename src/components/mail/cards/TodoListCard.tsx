import * as React from "react"
import { AnimatePresence } from "framer-motion"
import { BaseCard } from "./BaseCard"
import { FocusCardActions } from "./FocusCardActions"
import { TodoItem, TodoItemData } from "@/components/ui/TodoItem"

interface TodoListCardProps {
    card: {
        id: string
        title: string
        relatedEmailId?: string
        todoList: TodoItemData[]
        actions: Array<{ label: string; isPrimary?: boolean }>
    }
    onToggleTodo: (cardId: string, todoId: string) => void
    onTodoClick?: (emailId: string) => void
    isSelected?: boolean
    onAction?: (id: string, action: string) => void
}

export function TodoListCard({ card, isSelected, onToggleTodo, onTodoClick, onAction }: TodoListCardProps) {
    return (
        <BaseCard
            title={card.title}
            isSelected={isSelected}
            icon={
                <div className="w-8 h-8 rounded-full bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                    <span className="material-symbols-outlined text-[18px]">check_circle</span>
                </div>
            }
            onComplete={() => onAction?.(card.id, 'archive')}
        >
            <div className="space-y-2 mt-1">
                <AnimatePresence mode="popLayout">
                    {card.todoList.map((todo) => (
                        <TodoItem
                            key={todo.id}
                            todo={todo}
                            onToggle={() => onToggleTodo(card.id, todo.id)}
                            onClick={todo.relatedEmailId ? () => onTodoClick?.(todo.relatedEmailId!) : undefined}
                            animate={true}
                        />
                    ))}
                </AnimatePresence>
            </div>
        </BaseCard>
    )
}
