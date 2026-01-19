import * as React from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Sparkles, ArrowRight, Wand2, ArrowLeftRight, WrapText, AlignLeft, SpellCheck } from "lucide-react"

interface WriteWithAIDialogProps {
    onAction: (action: string) => void
}

export function WriteWithAIDialog({ onAction }: WriteWithAIDialogProps) {
    const [query, setQuery] = React.useState("")

    const aiOptions = [
        { id: "improve", label: "Improve writing", icon: <Wand2 className="w-5 h-5" /> },
        { id: "fix", label: "Fix spelling and grammar", icon: <SpellCheck className="w-5 h-5" /> },
        { id: "longer", label: "Make longer", icon: <AlignLeft className="w-5 h-5" /> },
        { id: "shorter", label: "Make shorter", icon: <WrapText className="w-5 h-5" /> },
        { id: "simplify", label: "Simplify writing", icon: <ArrowLeftRight className="w-5 h-5" /> },
    ]

    return (
        <div className="w-[340px] p-2 bg-white/95 backdrop-blur-xl border border-white/20 shadow-2xl rounded-2xl flex flex-col gap-2">

            {/* Header/Input Area */}
            <div className="px-1 pt-1 space-y-3">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-purple-500" fill="url(#sparkle-gradient)" />
                    <svg width="0" height="0">
                        <linearGradient id="sparkle-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop stopColor="#a855f7" offset="0%" />
                            <stop stopColor="#ec4899" offset="50%" />
                            <stop stopColor="#f43f5e" offset="100%" />
                        </linearGradient>
                    </svg>
                    <h3 className="font-semibold text-[15px] text-gray-900">How can I help your writing?</h3>
                </div>
                <p className="text-[13px] text-slate-500 text-left leading-tight">
                    I can refine your writing, fix grammar, and more.
                </p>

                <div className="relative flex items-center">
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Ask Brain to edit or write"
                        className="h-[36px] pr-9 bg-white border-slate-300 focus:border-purple-500 transition-all rounded-lg text-[13px] placeholder:text-slate-400"
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && query.trim()) {
                                onAction(`custom:${query}`)
                                setQuery("")
                            }
                        }}
                    />
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 text-slate-400">
                        <span className="text-[20px] transition-colors hover:text-purple-600 cursor-pointer">@</span>
                        <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6 text-slate-400 hover:text-purple-600 hover:bg-transparent rounded-md transition-colors"
                            onClick={() => {
                                if (query.trim()) {
                                    onAction(`custom:${query}`)
                                    setQuery("")
                                }
                            }}
                        >
                            <ArrowRight className="w-5 h-5" />
                        </Button>
                    </div>

                </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-[2px]">
                {aiOptions.map((opt, i) => (
                    <button
                        key={opt.id}
                        className={`w-full flex items-center gap-3 px-3 h-9 text-[13px] text-slate-700 hover:bg-slate-100 rounded-lg transition-colors text-left group ${i === 1 ? "bg-slate-100 font-medium" : ""}`}
                        onClick={() => onAction(opt.id)}
                    >
                        <div className="text-slate-500 group-hover:text-slate-900 transition-colors">
                            {opt.icon}
                        </div>
                        <span className="flex-1">{opt.label}</span>
                        {i === 1 && <span className="text-[10px] text-slate-400">↵</span>}
                    </button>
                ))}
            </div>
        </div>
    )
}
