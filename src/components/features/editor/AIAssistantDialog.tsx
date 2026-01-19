import * as React from "react"
import { Sparkles, Send, Copy, Check, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/Button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"

interface AIAssistantDialogProps {
    onInsert: (content: string) => void
    initialPrompt?: string
}

export function AIAssistantDialog({ onInsert, initialPrompt = "" }: AIAssistantDialogProps) {
    const [prompt, setPrompt] = React.useState(initialPrompt)
    const [messages, setMessages] = React.useState<{ role: 'user' | 'ai', content: string }[]>([])
    const [isGenerating, setIsGenerating] = React.useState(false)
    const [generatedContent, setGeneratedContent] = React.useState("")
    const [selectedFontSize, setSelectedFontSize] = React.useState("16px")

    const handleSend = () => {
        if (!prompt.trim()) return

        const newMessages = [...messages, { role: 'user' as const, content: prompt }]
        setMessages(newMessages)
        setIsGenerating(true)
        setPrompt("")

        // Simulate AI response
        setTimeout(() => {
            const response = "Here is a refined version of your text based on your request. It is concise, professional, and clear."
            setMessages([...newMessages, { role: 'ai', content: "I've generated a suggestion for you below." }])
            setGeneratedContent(response)
            setIsGenerating(false)
        }, 1500)
    }

    return (
        <div className="w-[400px] flex flex-col bg-white rounded-lg shadow-xl border border-slate-200 overflow-hidden">
            {/* Header / Chat Area */}
            <div className="flex-1 min-h-[200px] max-h-[300px] flex flex-col bg-slate-50/50">
                <div className="flex items-center px-4 py-3 border-b border-slate-100 bg-white">
                    <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
                    <span className="text-sm font-semibold text-slate-800">AI Assistant</span>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {messages.length === 0 && (
                        <div className="text-center text-slate-400 text-sm mt-8">
                            <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-20" />
                            <p>Ask me to write, edit, or translate...</p>
                        </div>
                    )}
                    {messages.map((msg, i) => (
                        <div key={i} className={cn("flex gap-2 text-sm", msg.role === 'user' ? "justify-end" : "justify-start")}>
                            {msg.role === 'ai' && (
                                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                                    <Sparkles className="w-3 h-3 text-purple-600" />
                                </div>
                            )}
                            <div className={cn(
                                "px-3 py-2 rounded-lg max-w-[80%]",
                                msg.role === 'user'
                                    ? "bg-slate-900 text-white rounded-tr-none"
                                    : "bg-white border border-slate-100 text-slate-800 rounded-tl-none"
                            )}>
                                {msg.content}
                            </div>
                        </div>
                    ))}
                    {isGenerating && (
                        <div className="flex gap-2 text-sm">
                            <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center shrink-0 animate-pulse">
                                <Sparkles className="w-3 h-3 text-purple-600" />
                            </div>
                            <div className="px-3 py-2 bg-white border border-slate-100 rounded-lg rounded-tl-none text-slate-500 italic">
                                Thinking...
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-3 bg-white border-t border-slate-100">
                    <div className="relative">
                        <Textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Tell AI what to do..."
                            className="min-h-[40px] pr-10 resize-none py-2 text-sm"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault()
                                    handleSend()
                                }
                            }}
                        />
                        <Button
                            className="absolute right-1 top-1 h-7 w-7 p-0"
                            size="sm"
                            variant="ghost"
                            onClick={handleSend}
                            disabled={!prompt.trim() || isGenerating}
                        >
                            <Send className="w-5 h-5 text-slate-500" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Generated Content Area */}
            {generatedContent && (
                <div className="border-t border-slate-200 bg-white p-4 animate-in slide-in-from-bottom-2">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Generated Content</span>
                        <div className="flex items-center gap-2">
                            {/* Reusing common select for font size if needed, simple implementation here */}
                            <select
                                className="text-xs border-none bg-slate-50 rounded px-1 py-0.5 text-slate-600 focus:ring-0 cursor-pointer"
                                value={selectedFontSize}
                                onChange={(e) => setSelectedFontSize(e.target.value)}
                            >
                                <option value="12px">12px</option>
                                <option value="14px">14px</option>
                                <option value="16px">16px</option>
                                <option value="18px">18px</option>
                            </select>
                            <Button size="sm" variant="ghost" className="h-6 w-6 p-0" onClick={() => setGeneratedContent("")}>
                                <RotateCcw className="w-3 h-3 text-slate-400" />
                            </Button>
                        </div>
                    </div>

                    <div
                        className="bg-slate-50 rounded-md p-3 text-sm text-slate-800 mb-3 border border-slate-100 font-sans leading-relaxed"
                        style={{ fontSize: selectedFontSize }}
                    >
                        {generatedContent}
                    </div>

                    <div className="flex gap-2">
                        <Button
                            className="flex-1 gap-2 bg-slate-900 hover:bg-slate-800 text-white"
                            onClick={() => onInsert(generatedContent)}
                        >
                            <Check className="w-4 h-4" />
                            Insert Selection
                        </Button>
                        <Button variant="outline" className="flex-1 gap-2 border-slate-200">
                            <Copy className="w-4 h-4" />
                            Copy
                        </Button>
                    </div>
                </div>
            )}
        </div>
    )
}
