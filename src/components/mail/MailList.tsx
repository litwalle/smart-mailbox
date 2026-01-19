import * as React from "react"
import { useMailStore } from "@/store/mailStore"
import { MailListItem } from "./MailListItem"
import { SearchInput } from "@/components/mail/search/SearchInput"
import { SearchResultsList } from "@/components/mail/search/SearchResultsList"
import { cn } from "@/lib/utils"
import { EmptyState } from "@/components/ui/EmptyState"
import { FocusView } from "@/components/mail/FocusView"
import { TodoListView } from "@/components/mail/TodoListView"
import { CalendarMainView } from "@/components/calendar/CalendarMainView"
import { InboxZeroState } from "@/components/mail/InboxZeroState"
import { BulkActionsToolbar } from "./BulkActionsToolbar"
// Import icons for bulk actions
import {
    SquareCheck,
    X,
    Archive,
    Trash2,
    MailOpen
} from "lucide-react"

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
        clearSelection,
        isSearchActive,
        setSearchActive,
        selectAll
    } = useMailStore()


    if (isSearchActive) {
        return <SearchResultsList />
    }

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
        <div className="flex flex-col h-full bg-background-primary">
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
                        <SearchInput
                            value={searchQuery}
                            onChange={(value) => setSearchQuery(value)}
                            onSearch={() => setSearchActive(true)}
                            onClear={() => {
                                setSearchQuery('')
                                setSearchActive(false)
                            }}
                            className="w-full"
                        />

                        <div className="flex justify-between items-end">
                            <h2 className="text-xl font-bold capitalize text-slate-900 tracking-tight">
                                {selectedFolderId === 'inbox' ? '收件箱' :
                                    selectedFolderId === 'sent' ? '已发送' :
                                        selectedFolderId === 'archive' ? '归档' :
                                            selectedFolderId === 'trash' ? '已删除' :
                                                selectedFolderId.replace('-', ' ')}
                            </h2>
                            <span className="text-xs text-slate-400 font-medium mb-1">
                                {emails.length} 封邮件
                            </span>
                        </div>

                        <div className="flex gap-4 border-b border-slate-100 mt-1">
                            <TabBtn type="all" label="全部" />
                            <TabBtn type="unread" label="未读" />
                            <TabBtn type="flagged" label="红旗" />
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
                            title={searchQuery ? "未找到匹配项" : "没有更多邮件"}
                            description={
                                searchQuery
                                    ? `未找到与 "${searchQuery}" 匹配的邮件`
                                    : "此文件夹为空。"
                            }
                            actionLabel={filterType !== 'all' ? "清除筛选" : undefined}
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
