import * as React from "react"
import { ReplySuggestionCard } from "./ReplySuggestionCard"
import { getSuggestionsForEmail } from "@/data/reply-suggestions-mock"
import { useMailStore } from "@/store/mailStore"
import { Email } from "@/types/mail"

interface ReplySuggestionListProps {
    email: Email;
}

export function ReplySuggestionList({ email }: ReplySuggestionListProps) {
    const { openCompose } = useMailStore()

    const suggestions = React.useMemo(() => getSuggestionsForEmail(email.id), [email.id])

    if (!suggestions || suggestions.length === 0) return null

    const handleUseSuggestion = (s: import("@/data/reply-suggestions-mock").ReplySuggestion) => {
        // Construct draft
        openCompose({
            to: email.from.email, // Simple reply to sender
            subject: `Re: ${email.subject}`,
            content: s.preview
        })
    }

    return (
        <div className="mt-8 max-w-4xl mx-auto px-8 pb-8">
            <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-indigo-500 text-[18px]">assistant</span>
                <h3 className="text-sm font-semibold text-slate-700">AI Reply Suggestions</h3>
            </div>

            <div className="grid grid-cols-2 gap-4 pb-4">
                {suggestions.map((suggestion, index) => (
                    <ReplySuggestionCard
                        key={suggestion.id}
                        suggestion={suggestion}
                        onUse={handleUseSuggestion}
                        index={index}
                    />
                ))}
            </div>
        </div>
    )
}
