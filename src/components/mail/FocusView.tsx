import * as React from "react"
import { motion, AnimatePresence, Variants } from "framer-motion"
import { useMailStore } from "@/store/mailStore"
import { getFocusBriefingForAccount } from "@/data/dataFoundation"

import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"
import { MailListItem } from "@/components/mail/MailListItem"
import { FocusEmptyState } from "./FocusEmptyState"
import { BulkActionsToolbar } from "./BulkActionsToolbar"
import { SegmentedControl } from "@/components/ui/SegmentedControl"
import { BriefingHeader } from "./BriefingHeader"
import { TimelineItemWrapper } from "./TimelineItemWrapper"

// Import modular cards
import { MeetingScheduleCard } from "./cards/MeetingScheduleCard"
import { TransitCard } from "./cards/TransitCard"
import { InsightCard } from "./cards/InsightCard"
import { TodoListCard } from "./cards/TodoListCard"
import { StandardEmailCard } from "./cards/StandardEmailCard"
import { MeetingCard } from "./cards/MeetingCard"
import { UpcomingMeetingCard } from "./cards/UpcomingMeetingCard"

// Animation Variants
const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.05
        }
    }
}

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.4,
            ease: "easeOut"
        }
    }
}

export function FocusView() {
    const {
        currentAccountId,
        selectEmail,
        selectedEmailId,
        selectedEmailIds,
        clearSelection,
        archiveEmail,
        setSelectedEmailIds
    } = useMailStore()

    // In a real app, this data would come from the store or props
    const briefing = getFocusBriefingForAccount(currentAccountId)
    const [viewMode, setViewMode] = React.useState<'secretary' | 'list'>('secretary')
    const [cards, setCards] = React.useState(briefing.cards)

    // Reset cards when account changes
    React.useEffect(() => {
        setCards(briefing.cards)
    }, [currentAccountId, briefing])

    const handleCardArchive = (id: string, relatedEmailId?: string) => {
        // If it has a related email, archive that too
        if (relatedEmailId) {
            archiveEmail(relatedEmailId)
        }
        // Remove card from local state
        setCards(prev => prev.filter(c => c.id !== id))
    }

    const handleCardAction = (id: string, action: string) => {
        console.log("Card Action:", id, action)
        if (action === 'open-email') {
            selectEmail(id) // id is emailId here
            return
        }
        if (action === 'archive' || action === 'delete' || action === 'complete') {
            handleCardArchive(id)
        }
    }

    const handleToggleTodo = (cardId: string, todoId: string) => {
        setCards(prevCards => {
            const newCards = prevCards.map(card => {
                if (card.id !== cardId || !card.todoList) return card;

                const newTodoList = card.todoList.map((todo: any) => {
                    if (todo.id === todoId) {
                        return { ...todo, isDone: !todo.isDone }
                    }
                    return todo
                });

                return {
                    ...card,
                    todoList: newTodoList
                };
            });
            return newCards
        });
    };

    // Get emails from focus cards that have relatedEmail for List View (deduplicated)
    const focusEmails = React.useMemo(() => {
        const { emails: allEmails } = useMailStore.getState();
        const emailIds = new Set<string>();

        briefing.cards.forEach(card => {
            // 1. Direct Relation
            if (card.relatedEmailId) {
                emailIds.add(card.relatedEmailId);
            }

            // 2. Nested Meeting List
            if (card.meetingList) {
                card.meetingList.forEach(meeting => {
                    if (meeting.relatedEmailId) {
                        emailIds.add(meeting.relatedEmailId);
                    }
                });
            }

            // 3. Todo Items
            if (card.todoList) {
                card.todoList.forEach(todo => {
                    if (todo.relatedEmailId) {
                        emailIds.add(todo.relatedEmailId);
                    }
                });
            }
        });

        // Map IDs to Email objects
        return Array.from(emailIds)
            .map(id => allEmails.find(e => e.id === id))
            .filter((e): e is import("@/types/mail").Email => !!e);
    }, [briefing.cards])






    return (
        <div className="flex flex-col h-full bg-background-secondary/50">

            {/* 1. Header & Toolbar */}
            <div className={cn(
                "sticky top-0 z-20 transition-all duration-300 ease-in-out",
                selectedEmailIds.length > 0
                    ? "bg-background-primary/80 backdrop-blur-sm border-b border-comp-divider px-2 h-[72px] flex flex-col justify-center"
                    : "px-6 py-4 bg-background-secondary/90 backdrop-blur-md"
            )}>
                {selectedEmailIds.length > 0 ? (
                    <BulkActionsToolbar
                        mode="header"
                        selectedCount={selectedEmailIds.length}
                        onClose={clearSelection}
                        onArchive={() => console.log('Archive Batch')}
                        onDelete={() => console.log('Delete Batch')}
                        onMarkUnread={() => console.log('Mark Unread Batch')}
                        onSelectAll={() => {
                            if (selectedEmailIds.length === focusEmails.length) {
                                clearSelection()
                            } else {
                                setSelectedEmailIds(focusEmails.map(e => e.id))
                            }
                        }}
                        isAllSelected={selectedEmailIds.length === focusEmails.length && focusEmails.length > 0}
                    />
                ) : (
                    <>
                        {/* Search Bar */}
                        <div className="relative group mb-3">
                            <div className="absolute inset-0 bg-gradient-to-r from-brand/10 to-brand/5 rounded-lg blur opacity-20 group-hover:opacity-30 transition-opacity"></div>
                            <div className="relative bg-background-primary border border-comp-divider rounded-lg flex items-center px-3 py-2.5 gap-3 transition-all group-hover:border-brand/30">
                                <span className="material-symbols-outlined text-[18px] text-icon-tertiary">auto_awesome</span>
                                <input
                                    className="flex-1 bg-transparent border-none outline-none text-sm placeholder:text-font-tertiary text-font-primary"
                                    placeholder="Ask AI: 'Find the contract from John...'"
                                />
                                <Button size="sm" variant="ghost" className="h-7 w-7 w-auto px-2 p-0 text-icon-tertiary hover:text-brand">
                                    <span className="material-symbols-outlined text-[18px]">mic</span>
                                </Button>
                            </div>
                        </div>

                        {/* View Switcher + Action Icons */}
                        <div className="flex items-center justify-between">
                            <SegmentedControl
                                value={viewMode}
                                onChange={(val) => setViewMode(val as 'secretary' | 'list')}
                                options={[
                                    { value: 'secretary', label: 'Smart Briefing' },
                                    { value: 'list', label: 'Email List' }
                                ]}
                            />
                            <div className="flex items-center gap-2">
                                <button className="h-8 w-8 rounded-lg flex items-center justify-center text-icon-secondary hover:text-icon-primary hover:bg-background-tertiary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">refresh</span>
                                </button>
                                <button className="h-8 w-8 rounded-lg flex items-center justify-center text-icon-secondary hover:text-icon-primary hover:bg-background-tertiary transition-colors">
                                    <span className="material-symbols-outlined text-[20px]">filter_list</span>
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>

            {/* Scrollable Content */}
            <div className={cn(
                "flex-1 overflow-y-auto scrollbar-thin",
                cards.length === 0 && "flex flex-col justify-center"
            )}>
                {cards.length === 0 ? (
                    <div className="h-full flex flex-col justify-center">
                        <FocusEmptyState />
                    </div>
                ) : viewMode === 'list' ? (
                    /* List View */
                    <div className="p-2 space-y-2">
                        {focusEmails.map((email) => (
                            <MailListItem
                                key={email.id}
                                email={email}
                                isSelected={selectedEmailId === email.id}
                            />
                        ))}
                    </div>
                ) : (
                    /* Secretary View - Narrative Stream */
                    <motion.div
                        className="px-6 pb-12 space-y-8"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Cards Stream */}
                        <div className="space-y-12 relative">
                            {/* Vertical Timeline Line */}
                            <motion.div
                                className="absolute left-[15px] top-6 bottom-10 w-[2px] bg-gradient-to-b from-brand/20 via-comp-divider to-transparent z-0"
                                initial={{ opacity: 0, scaleY: 0 }}
                                animate={{ opacity: 1, scaleY: 1 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                                style={{ originY: 0 }}
                            />

                            {/* Briefing Header (Greeting + Summary) */}
                            <motion.div variants={itemVariants}>
                                <TimelineItemWrapper className="mb-8">
                                    <BriefingHeader
                                        headline={briefing.headline}
                                        summary={briefing.summary}
                                        dateDisplay={briefing.dateDisplay}
                                    />
                                </TimelineItemWrapper>
                            </motion.div>

                            <AnimatePresence mode="popLayout">
                                {cards.map((card) => {
                                    // Determine Card Component
                                    let CardComponent;
                                    const commonProps = {
                                        card: card as any,
                                        onAction: handleCardAction
                                    }

                                    // MeetingCard & TodoListCard are now Self-Contained (Include Timeline)
                                    // Others still depend on TimelineItemWrapper

                                    // Others - Wrap in TimelineItemWrapper
                                    if (card.transitData) {
                                        CardComponent = <TransitCard {...commonProps} />;
                                    } else if (card.insightData) {
                                        CardComponent = <InsightCard {...commonProps} />;
                                    } else if (card.meetingList) {
                                        CardComponent = <MeetingScheduleCard {...commonProps} />;
                                    } else if (card.id === 'focus-upcoming-meeting' && card.meetingData) {
                                        // Use UpcomingMeetingCard for the prominently displayed upcoming meeting
                                        CardComponent = (
                                            <UpcomingMeetingCard
                                                card={card as any}
                                                onJoin={() => handleCardAction(card.id, 'join')}
                                                onDismiss={() => handleCardArchive(card.id, card.relatedEmailId)}
                                            />
                                        );
                                    } else if (card.meetingData) {
                                        CardComponent = (
                                            <MeetingCard
                                                meeting={card.meetingData as any}
                                                onJoin={() => handleCardAction(card.id, 'join')}
                                                onClick={() => {
                                                    if (card.relatedEmailId) selectEmail(card.relatedEmailId)
                                                }}
                                            />
                                        );
                                    } else if (card.type === 'todo') {
                                        CardComponent = (
                                            <TodoListCard
                                                {...commonProps}
                                                onToggleTodo={handleToggleTodo}
                                                onTodoClick={(emailId) => selectEmail(emailId)}
                                            />
                                        );
                                    } else {
                                        CardComponent = (
                                            <StandardEmailCard
                                                {...commonProps}
                                                onArchive={(id) => handleCardArchive(id, card.relatedEmailId)}
                                            />
                                        );
                                    }


                                    return (
                                        <TimelineItemWrapper key={card.id}>
                                            <motion.div
                                                variants={itemVariants}
                                                exit={{ opacity: 0, transition: { duration: 0.2 } }}
                                            >
                                                {/* Guidance Text */}
                                                {card.guidanceText && (
                                                    <div
                                                        className="mb-3 text-[18px] font-medium text-font-secondary leading-relaxed tracking-tight [&_b]:font-medium [&_strong]:font-medium"
                                                        dangerouslySetInnerHTML={{ __html: card.guidanceText }}
                                                    />
                                                )}

                                                <div onClick={() => {
                                                    if (card.relatedEmailId) {
                                                        selectEmail(card.relatedEmailId)
                                                    }
                                                }}>
                                                    {CardComponent}
                                                </div>
                                            </motion.div>
                                        </TimelineItemWrapper>
                                    )
                                })}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    )
}
