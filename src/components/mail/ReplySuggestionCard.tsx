import * as React from "react"
import { ReplySuggestion } from "@/data/reply-suggestions-mock"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

interface ReplySuggestionCardProps {
    suggestion: ReplySuggestion;
    onUse: (suggestion: ReplySuggestion) => void;
    index: number;
}

export function ReplySuggestionCard({ suggestion, onUse, index }: ReplySuggestionCardProps) {
    // Pastel colors based on index
    const gradients = [
        "bg-gradient-to-br from-indigo-50/80 to-blue-50/50 border-indigo-100 hover:border-indigo-200",
        "bg-gradient-to-br from-rose-50/80 to-orange-50/50 border-rose-100 hover:border-rose-200",
        "bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border-emerald-100 hover:border-emerald-200",
        "bg-gradient-to-br from-amber-50/80 to-yellow-50/50 border-amber-100 hover:border-amber-200",
        "bg-gradient-to-br from-violet-50/80 to-purple-50/50 border-violet-100 hover:border-violet-200",
    ];

    const iconColors = [
        "text-indigo-500",
        "text-rose-500",
        "text-emerald-500",
        "text-amber-600",
        "text-violet-500"
    ];

    const styleClass = gradients[index % gradients.length];
    const iconColor = iconColors[index % iconColors.length];

    return (
        <div className={cn(
            "group flex flex-col w-full h-[220px] rounded-xl border hover:border-brand/30 transition-all duration-200 overflow-hidden shrink-0",
            styleClass
        )}>
            {/* Header: Strategy Title + Action */}
            <div className="px-5 py-4 flex items-center justify-between gap-3 border-b border-black/5 bg-white/20">
                <div className="flex items-center gap-2 overflow-hidden">
                    <span className={cn("material-symbols-outlined text-[18px] shrink-0", iconColor)}>auto_awesome</span>
                    <h4 className="font-semibold text-slate-800 text-sm leading-tight truncate" title={suggestion.strategy}>
                        {suggestion.strategy}
                    </h4>
                </div>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn("h-7 w-7 bg-white/50 hover:bg-white shrink-0 shadow-sm", iconColor)}
                    onClick={() => onUse(suggestion)}
                    title="Use this suggestion"
                >
                    <span className="material-symbols-outlined text-[18px]">edit_square</span>
                </Button>
            </div>

            {/* Body: Preview Content */}
            <div className="flex-1 p-5 overflow-y-auto text-sm text-slate-600 leading-relaxed custom-scrollbar-hide">
                <p className="whitespace-pre-wrap">{suggestion.preview}</p>
            </div>
        </div>
    )
}
