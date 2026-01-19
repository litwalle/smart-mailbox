import * as React from "react"
import { useMailStore } from "@/store/mailStore"
import { AISearchResultCard } from "./AISearchResultCard"
import { MailListItem } from "../MailListItem"
import { ArrowLeft } from "lucide-react"
import { SearchInput } from "@/components/mail/search/SearchInput"

export function SearchResultsList() {
    const {
        searchQuery,
        getGlobalSearchResults,
        setSearchActive,
        setSearchQuery,
        selectedEmailId
    } = useMailStore()

    const results = getGlobalSearchResults()

    // Mimic AI Reply logic (hardcoded or mock for now as per demo)
    const mockAIReply = `Found ${results.length} emails related to "${searchQuery}". Here is the most relevant one.`
    const topResult = results.length > 0 ? results[0] : undefined

    return (
        <div className="flex flex-col h-full bg-background-primary animate-in fade-in duration-300">
            {/* Header */}
            <div className="flex flex-col gap-3 p-4 border-b border-border-color bg-white/80 backdrop-blur-sm sticky top-0 z-20">
                {/* Top Row: Search Input (Stable Position) */}
                <div className="w-full">
                    <SearchInput
                        value={searchQuery}
                        onChange={(value) => setSearchQuery(value)}
                        onSearch={() => { /* Already searching as we type */ }}
                        onClear={() => {
                            setSearchQuery('')
                            setSearchActive(false)
                        }}
                        placeholder="搜索邮件..."
                        className="w-full"
                    />
                </div>

                {/* Bottom Row: Back + Title */}
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => {
                            setSearchActive(false)
                            setSearchQuery('')
                        }}
                        className="p-2 -ml-2 hover:bg-slate-100 rounded-full transition-colors text-slate-600"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">搜索结果</h2>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-2 space-y-2 overflow-y-auto scrollbar-hover-reveal">
                {/* AI Card */}
                {searchQuery && (
                    <AISearchResultCard
                        query={searchQuery}
                        aiReply={mockAIReply} // In real app, this comes from AI service
                        relatedEmail={topResult}
                    />
                )}

                {/* List Results */}
                <div className="space-y-1">
                    {results.map((email) => (
                        <MailListItem
                            key={email.id}
                            email={email}
                            isSelected={selectedEmailId === email.id}
                            highlightKeyword={searchQuery} // Passing keyword for highlighting
                        />
                    ))}

                    {results.length === 0 && (
                        <div className="text-center py-12 text-slate-400">
                            未找到相关邮件
                        </div>
                    )}
                </div>

                <div className="h-4" />
            </div>
        </div>
    )
}
