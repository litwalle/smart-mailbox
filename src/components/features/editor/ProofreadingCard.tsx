
import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ProofreadingError } from "@/data/smart-compose-mock"
import { cn } from "@/lib/utils"

interface ProofreadingCardProps {
    error: ProofreadingError
    position: { x: number, y: number }
    onAccept: () => void
    onIgnore: () => void
    onClose: () => void
}

export function ProofreadingCard({ error, position, onAccept, onIgnore, onClose }: ProofreadingCardProps) {
    const contextParts = error.context ? error.context.split(error.text) : [error.text];
    const hasContext = !!error.context && error.context.includes(error.text);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15, ease: "easeInOut" }}
                // Card Standard: bg-background-primary, rounded-lg (8px), shadow-sm, border-comp-divider
                className="fixed z-50 bg-white rounded-lg shadow-sm border border-black/10 overflow-hidden min-w-[320px] max-w-[360px] p-3 flex flex-col gap-2.5"
                style={{
                    left: position.x,
                    top: position.y + 8
                }}
            >
                {/* Header Badge - More Compact */}
                <div className="flex items-center gap-2">
                    <span className={cn(
                        "inline-flex items-center justify-center px-1.5 py-0.5 rounded-[4px] text-[11px] font-bold border",
                        error.type === 'spelling'
                            ? "bg-red-50 text-red-600 border-red-100"
                            : "bg-blue-50 text-blue-600 border-blue-100"
                    )}>
                        {error.type === 'spelling' ? "拼写错误" : "语法建议"}
                    </span>
                </div>

                {/* Original Context Block - Compact */}
                <div className="bg-slate-50 rounded-md p-2.5 flex flex-col gap-1.5 border border-slate-100">
                    <span className="text-slate-400 text-[10px] font-medium leading-none">原文</span>
                    <p className="text-slate-500 text-[13px] leading-relaxed font-mono">
                        {hasContext ? (
                            <>
                                {error.context.substring(0, error.context.indexOf(error.text))}
                                {/* Strikethrough Logic: Lighter color text, clearly visible line */}
                                <span className="relative inline-block mx-0.5">
                                    <span className="text-slate-400 decoration-slate-300 line-through decoration-1">
                                        {error.text}
                                    </span>
                                </span>
                                {error.context.substring(error.context.indexOf(error.text) + error.text.length)}
                            </>
                        ) : (
                            <span className="text-slate-400 decoration-slate-300 line-through">{error.text}</span>
                        )}
                    </p>
                </div>

                {/* Suggestion Context Block - Compact */}
                <div className="bg-[#F0F5FF] rounded-md p-2.5 flex flex-col gap-1.5 border border-[#0A59F7]/10">
                    <span className="text-[#0A59F7] text-[10px] font-bold leading-none">建议修改</span>
                    <p className="text-slate-900 text-[13px] font-medium leading-relaxed font-mono">
                        {hasContext ? (
                            <>
                                {error.context.substring(0, error.context.indexOf(error.text))}
                                <span className="bg-[#D6E6FF] text-[#0A59F7] px-1 py-0.5 rounded-[4px] font-bold mx-0.5">
                                    {error.suggestion}
                                </span>
                                {error.context.substring(error.context.indexOf(error.text) + error.text.length)}
                            </>
                        ) : (
                            <span className="text-[#0A59F7] font-bold">{error.suggestion}</span>
                        )}
                    </p>
                </div>

                {/* Actions - Compact Buttons (h-8) */}
                <div className="grid grid-cols-2 gap-2 mt-0.5">
                    <button
                        onClick={(e) => { e.stopPropagation(); onIgnore(); }}
                        className="flex items-center justify-center h-8 rounded-md text-xs font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
                    >
                        忽略
                    </button>
                    <button
                        onClick={(e) => { e.stopPropagation(); onAccept(); }}
                        className="flex items-center justify-center h-8 rounded-md text-xs font-medium text-white bg-[#0A59F7] hover:bg-[#0A59F7]/90 transition-all shadow-sm active:scale-95"
                    >
                        采纳
                    </button>
                </div>

            </motion.div>
        </AnimatePresence>
    )
}
