import * as React from "react"
import { cn } from "@/lib/utils"
import { Sparkles } from "lucide-react"
import { SimpleMailCard } from "./SimpleMailCard"
import { Email } from "@/types/mail"

interface AISearchResultCardProps {
    query: string
    aiReply: string
    relatedEmail?: Email
    onEmailClick?: () => void
}

export function AISearchResultCard({ query, aiReply, relatedEmail, onEmailClick }: AISearchResultCardProps) {
    const [displayedText, setDisplayedText] = React.useState("")
    const [isTypingComplete, setIsTypingComplete] = React.useState(false)

    React.useEffect(() => {
        setDisplayedText("")
        setIsTypingComplete(false)
        let index = 0
        const speed = 30 // Typing speed in ms

        const intervalId = setInterval(() => {
            setDisplayedText((prev) => {
                if (index < aiReply.length) {
                    index++
                    return aiReply.slice(0, index)
                }
                clearInterval(intervalId)
                setIsTypingComplete(true)
                return prev
            })
        }, speed)

        return () => clearInterval(intervalId)
    }, [aiReply])

    return (
        <div className="w-full mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-blue-50/80 border border-slate-200">
            <div className="p-4 space-y-3">
                {/* Header */}
                <div className="flex items-center gap-2 text-indigo-600 mb-2">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider opacity-80">AI 智能回答</span>
                </div>

                {/* Content */}
                <div className="text-[15px] leading-relaxed text-slate-700">
                    <span className="font-medium text-slate-900">{displayedText}</span>
                    {!isTypingComplete && <span className="inline-block w-1.5 h-4 ml-1 bg-indigo-400 animate-pulse align-middle rounded-full" />}
                </div>

                {/* Related Email Card */}
                {relatedEmail && (
                    <div className={cn(
                        "mt-3 transition-opacity duration-500 delay-300",
                        isTypingComplete ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
                    )}>
                        <SimpleMailCard email={relatedEmail} onClick={onEmailClick} />
                    </div>
                )}
            </div>
        </div>
    )
}
