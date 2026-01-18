import * as React from "react"
import { AnimatePresence } from "framer-motion"
import { useMailStore } from "@/store/mailStore"
import { Input } from "@/components/ui/Input"
import { cn } from "@/lib/utils"
import { TodoItem, TodoItemData } from "@/components/ui/TodoItem"
import { getTodosForAccount } from "@/data/dataFoundation"

export function TodoListView() {
    const {
        currentAccountId,
        searchQuery,
        setSearchQuery,
        selectEmail,
    } = useMailStore()

    // Flatten items from getTodosForAccount with group assignment
    const initialItems = React.useMemo(() => {
        const todos = getTodosForAccount(currentAccountId);

        return todos.map(t => {
            let targetGroup: 'today' | 'tomorrow' | 'later' = 'today';

            // Heuristic to determine group based on deadline
            const deadline = t.deadline?.toLowerCase() || '';
            if (deadline.includes('tomorrow') || deadline.includes('明天')) {
                targetGroup = 'tomorrow';
            } else if (deadline.includes('week') || deadline.includes('later') || deadline.includes('周')) {
                targetGroup = 'later';
            }

            return {
                id: t.id,
                content: t.content,
                isDone: t.isCompleted,
                isUrgent: t.priority === 'high',
                deadline: t.deadline,
                relatedEmailId: t.sourceEmailId,
                group: targetGroup
            };
        });
    }, [currentAccountId]);

    // Local state for managing todo items
    const [todoItems, setTodoItems] = React.useState(() => initialItems.filter(i => !i.isDone));
    const [completedItems, setCompletedItems] = React.useState(() => initialItems.filter(i => i.isDone));
    const [isCompletedExpanded, setIsCompletedExpanded] = React.useState(false);

    // Reset when initialItems changes
    React.useEffect(() => {
        setTodoItems(initialItems.filter(i => !i.isDone));
        setCompletedItems(initialItems.filter(i => i.isDone));
    }, [initialItems]);

    const handleToggleTodo = (todoId: string) => {
        setTodoItems(prev => prev.map(item =>
            item.id === todoId ? { ...item, isDone: !item.isDone } : item
        ));
    };

    const handleReactivateTodo = (todoId: string) => {
        const item = completedItems.find(i => i.id === todoId);
        if (item) {
            const reactivatedItem = { ...item, isDone: false };
            setCompletedItems(prev => prev.filter(i => i.id !== todoId));
            setTodoItems(prev => [...prev, reactivatedItem]);
        }
    };

    const handleDismiss = (todoId: string) => {
        // Move item to completed list instead of deleting
        const item = todoItems.find(i => i.id === todoId);
        if (item) {
            setCompletedItems(prev => [item, ...prev]);
            setTodoItems(prev => prev.filter(i => i.id !== todoId));
        }
    };

    const handleClearCompleted = () => {
        setCompletedItems([]);
    };

    const handleItemClick = (emailId?: string) => {
        if (emailId) {
            selectEmail(emailId);
        }
    };

    // Group items for rendering (keep isDone items here until dismissed)
    const todoGroups = {
        today: todoItems.filter(i => i.group === 'today'),
        tomorrow: todoItems.filter(i => i.group === 'tomorrow'),
        later: todoItems.filter(i => i.group === 'later'),
    };

    // Helper to calculate total count (pending only)
    const totalCount = todoGroups.today.length + todoGroups.tomorrow.length + todoGroups.later.length;

    return (
        <div className="flex flex-col h-full bg-background-primary">
            {/* Header Area */}
            <div className="flex flex-col gap-4 p-4 border-b border-border-color bg-white/80 backdrop-blur-sm sticky top-0 z-20 transition-all duration-300 ease-in-out">
                <div className="flex justify-between items-end">
                    <h2 className="text-xl font-bold capitalize text-slate-900 tracking-tight">
                        Todo
                    </h2>
                    <span className="text-xs text-slate-400 font-medium mb-1">
                        {totalCount} items
                    </span>
                </div>

                <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search todos..."
                    leftIcon={<span className="material-symbols-outlined text-[18px]">search</span>}
                    className="bg-slate-100 border-transparent focus:bg-white transition-all shadow-none"
                />
            </div>

            {/* List Area */}
            <div className="flex-1 p-2 space-y-2 overflow-y-auto scrollbar-hover-reveal px-6 py-6 pb-12">
                <div className="space-y-10">
                    {/* Today */}
                    {todoGroups.today.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider pl-1">Today Due</h3>
                            <div className="space-y-3">
                                <AnimatePresence mode="popLayout">
                                    {todoGroups.today.map(item => (
                                        <TodoItem
                                            key={item.id}
                                            todo={item}
                                            onToggle={() => handleToggleTodo(item.id)}
                                            onDismiss={() => handleDismiss(item.id)}
                                            onClick={item.relatedEmailId ? () => handleItemClick(item.relatedEmailId) : undefined}
                                            animate={true}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}

                    {/* Tomorrow */}
                    {todoGroups.tomorrow.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider pl-1">Tomorrow Due</h3>
                            <div className="space-y-3">
                                <AnimatePresence mode="popLayout">
                                    {todoGroups.tomorrow.map(item => (
                                        <TodoItem
                                            key={item.id}
                                            todo={item}
                                            onToggle={() => handleToggleTodo(item.id)}
                                            onDismiss={() => handleDismiss(item.id)}
                                            onClick={item.relatedEmailId ? () => handleItemClick(item.relatedEmailId) : undefined}
                                            animate={true}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}

                    {/* Later */}
                    {todoGroups.later.length > 0 && (
                        <div className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider pl-1">Upcoming</h3>
                            <div className="space-y-3">
                                <AnimatePresence mode="popLayout">
                                    {todoGroups.later.map(item => (
                                        <TodoItem
                                            key={item.id}
                                            todo={item}
                                            onToggle={() => handleToggleTodo(item.id)}
                                            onDismiss={() => handleDismiss(item.id)}
                                            onClick={item.relatedEmailId ? () => handleItemClick(item.relatedEmailId) : undefined}
                                            animate={true}
                                        />
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    )}

                    {/* 已完成 - Collapsible */}
                    {completedItems.length > 0 && (
                        <div className="space-y-4 pt-4 border-t border-slate-200">
                            <div
                                className="flex items-center justify-between cursor-pointer group"
                                onClick={() => setIsCompletedExpanded(!isCompletedExpanded)}
                            >
                                <div className="flex items-center gap-2">
                                    <span className={cn(
                                        "material-symbols-outlined text-[16px] text-slate-400 transition-transform",
                                        isCompletedExpanded && "rotate-90"
                                    )}>
                                        chevron_right
                                    </span>
                                    <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                                        已完成 ({completedItems.length})
                                    </h3>
                                </div>
                                {isCompletedExpanded && (
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleClearCompleted();
                                        }}
                                        className="text-xs text-slate-400 hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-50"
                                    >
                                        清空
                                    </button>
                                )}
                            </div>
                            {isCompletedExpanded && (
                                <div className="space-y-3 pl-6">
                                    <AnimatePresence mode="popLayout">
                                        {completedItems.map(item => (
                                            <TodoItem
                                                key={item.id}
                                                todo={item}
                                                onToggle={() => handleReactivateTodo(item.id)}
                                                animate={true}
                                            />
                                        ))}
                                    </AnimatePresence>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
