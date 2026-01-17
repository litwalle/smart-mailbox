import * as React from "react"
import { useMailStore } from "@/store/mailStore"
import { MailListItem } from "./MailListItem"
import { Input } from "@/components/ui/Input"
import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/ui/EmptyState"
import { FocusView } from "@/components/mail/FocusView"
import { TodoListView } from "@/components/mail/TodoListView"
import { CalendarMainView } from "@/components/calendar/CalendarMainView"
import { InboxZeroState } from "@/components/mail/InboxZeroState"
import { BulkActionsToolbar } from "./BulkActionsToolbar"
// Import icons for bulk actions
import {
    LuSquareCheck,
    LuX,
    LuArchive,
    LuTrash2,
    LuMailOpen
} from "react-icons/lu"

export function MailList() {
    const {
        selectedEmailId,
        selectedFolderId,
        isFocusMode,
        filterType,
        setFilterType,
        searchQuery,
        setSearchQuery,
        getFilteredEmails,
        selectedEmailIds,
        selectAll,
        clearSelection
    } = useMailStore()

    // *** CRITICAL: Focus View Rendering ***
    if (isFocusMode) {
        return <FocusView />
    }

    if (selectedFolderId === 'calendar') {
        return <CalendarMainView />
    }

    if (selectedFolderId === 'todo') {
        return <TodoListView />
    }

    const emails = getFilteredEmails()
    const isMultiSelectMode = selectedEmailIds.length > 0

    // Tab Button Helper
    const TabBtn = ({ type, label }: { type: 'all' | 'unread' | 'flagged', label: string }) => (
        <button
            onClick={() => setFilterType(type)}
            className={cn(
                "pb-2 text-sm font-medium border-b-2 transition-colors px-1",
                filterType === type
                    ? "border-primary text-primary"
                    : "border-transparent text-slate-500 hover:text-slate-800"
            )}
        >
            {label}
        </button>
    )

    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            {/* Header Area */}
            {/* Header Area */}
            <div className={cn(
                "flex flex-col border-b border-border-color bg-white/80 backdrop-blur-sm sticky top-0 z-20 transition-all duration-300 ease-in-out",
                isMultiSelectMode ? "px-2 h-[72px] justify-center" : "gap-4 p-4"
            )}>
                {isMultiSelectMode ? (
                    <BulkActionsToolbar
                        mode="header"
                        selectedCount={selectedEmailIds.length}
                        onClose={clearSelection}
                        onArchive={() => { console.log('Batch Archive') }}
                        onDelete={() => { console.log('Batch Delete') }}
                        onMarkUnread={() => { console.log('Batch Unread') }}
                        onSelectAll={() => {
                            if (selectedEmailIds.length === emails.length) {
                                clearSelection()
                            } else {
                                selectAll()
                            }
                        }}
                        isAllSelected={selectedEmailIds.length === emails.length && emails.length > 0}
                    />
                ) : (
                    /* Standard Header */
                    <div className="flex flex-col gap-4 animate-in fade-in duration-200">
                        <div className="flex justify-between items-end">
                            <h2 className="text-xl font-bold capitalize text-slate-900 tracking-tight">
                                {selectedFolderId === 'inbox' ? 'Inbox' : selectedFolderId.replace('-', ' ')}
                            </h2>
                            <span className="text-xs text-slate-400 font-medium mb-1">
                                {emails.length} messages
                            </span>
                        </div>

                        <Input
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search..."
                            leftIcon={<span className="material-symbols-outlined text-[18px]">search</span>}
                            className="bg-slate-100 border-transparent focus:bg-white transition-all shadow-none focus:shadow-sm"
                        />

                        <div className="flex gap-4 border-b border-slate-100 mt-1">
                            <TabBtn type="all" label="All" />
                            <TabBtn type="unread" label="Unread" />
                            <TabBtn type="flagged" label="Flagged" />
                        </div>
                    </div>
                )}
            </div>

            {/* List Area */}
            <div className="flex-1 p-2 space-y-2 scrollbar-hover-reveal">
                {emails.length === 0 ? (
                    selectedFolderId === 'inbox' && !searchQuery && filterType === 'all' ? (
                        <InboxZeroState />
                    ) : (
                        <EmptyState
                            icon={searchQuery ? "search_off" : "inbox"}
                            title={searchQuery ? "No matches found" : "All caught up"}
                            description={
                                searchQuery
                                    ? `We couldn't find any emails matching "${searchQuery}"`
                                    : "You have no emails in this folder."
                            }
                            actionLabel={filterType !== 'all' ? "Clear filters" : undefined}
                            onAction={filterType !== 'all' ? () => setFilterType('all') : undefined}
                            className="mt-12"
                        />
                    )
                ) : (
                    emails.map((email) => (
                        <MailListItem
                            key={email.id}
                            email={email}
                            isSelected={selectedEmailId === email.id}
                        />
                    ))
                )}

                {/* Bottom Spacer */}
                <div className="h-4"></div>
            </div>
        </div >
    )
}
