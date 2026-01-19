import * as React from "react"
import { cn } from "@/lib/utils"

interface AIMenuDropdownProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (action: string) => void
}

type TabType = 'tools' | 'suggestions' | 'reader' | 'chat'

// --- Reader Persona Types & Data ---
type ReaderPersonaId = 'boss' | 'pm' | 'cto' | 'new'

interface PersonaData {
    id: ReaderPersonaId
    name: string
    sub: string
    color: string
    img?: string
    icon?: string
    reaction: {
        emoji: string
        title: string
        desc: string
        color: string
        textColor: string
    }
    impact: {
        score: number
        tags: string[]
    }
    advice: {
        icon: string
        title: string
        desc: string
    }[]
}

const READER_PERSONAS: PersonaData[] = [
    {
        id: 'boss',
        name: 'Boss',
        sub: 'Executive',
        color: 'bg-blue-100 text-blue-700',
        img: 'https://i.pravatar.cc/150?u=boss',
        reaction: {
            emoji: '🤔',
            title: 'Too Long',
            desc: 'I have 2 minutes between meetings. Make your point in the first sentence.',
            color: 'bg-orange-50 text-orange-900 border-orange-100',
            textColor: 'text-orange-900'
        },
        impact: {
            score: 6.2,
            tags: ['Clarity', 'Conciseness']
        },
        advice: [
            { icon: 'content_cut', title: 'Cut the fluff', desc: 'Remove the second paragraph completely.' },
            { icon: 'format_list_bulleted', title: 'Use bullets', desc: 'Summarize the metrics in a list.' },
            { icon: 'priority_high', title: 'Action First', desc: 'Move the "Ask" to the top.' }
        ]
    },
    {
        id: 'pm',
        name: 'PM',
        sub: 'Product Manager',
        color: 'bg-purple-100 text-purple-700',
        img: 'https://i.pravatar.cc/150?u=pm',
        reaction: {
            emoji: '🧐',
            title: 'Needs Context',
            desc: 'How does this align with our Q3 OKRs and user feedback?',
            color: 'bg-purple-50 text-purple-900 border-purple-100',
            textColor: 'text-purple-900'
        },
        impact: {
            score: 7.5,
            tags: ['User Value', 'Strategy']
        },
        advice: [
            { icon: 'insights', title: 'Add Metrics', desc: 'Include the retention data from last week.' },
            { icon: 'lightbulb', title: 'Highlight Impact', desc: 'Explicitly state the user benefit.' },
            { icon: 'link', title: 'Link Jira', desc: 'Reference the specific ticket ID.' }
        ]
    },
    {
        id: 'cto',
        name: 'CTO',
        sub: 'Tech Lead',
        color: 'bg-slate-100 text-slate-700',
        img: 'https://i.pravatar.cc/150?u=cto',
        reaction: {
            emoji: '🛠️',
            title: 'Feasibility?',
            desc: 'Are we considering the latency implications of this approach?',
            color: 'bg-slate-50 text-slate-900 border-slate-100',
            textColor: 'text-slate-900'
        },
        impact: {
            score: 5.8,
            tags: ['Scalability', 'Security']
        },
        advice: [
            { icon: 'warning', title: 'Edge Cases', desc: 'What happens if the API fails?' },
            { icon: 'architecture', title: 'Scale Check', desc: 'Will this handle 10k RPS?' },
            { icon: 'lock', title: 'Security', desc: 'Ensure PII is encrypted.' }
        ]
    }
]

export function AIMenuDropdown({ isOpen, onClose, onSelect }: AIMenuDropdownProps) {
    const dropdownRef = React.useRef<HTMLDivElement>(null)
    const [activeTab, setActiveTab] = React.useState<TabType>('tools')
    const [readerPersonaId, setReaderPersonaId] = React.useState<ReaderPersonaId>('boss')
    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose()
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    return (
        <div
            ref={dropdownRef}
            className="absolute bottom-12 left-0 z-50 w-[340px] bg-white/95 backdrop-blur-xl rounded-2xl shadow-floating border border-black/5 flex flex-col overflow-hidden animate-in zoom-in-95 duration-200 origin-bottom-left"
        >
            {/* Header Tabs */}
            <div className="flex items-center px-1 pt-1 border-b border-black/5 bg-black/0">
                {['Tools', 'Suggestions', 'Reader', 'Chat'].map((tab) => {
                    const id = tab.toLowerCase() as TabType
                    const isActive = activeTab === id
                    return (
                        <button
                            key={id}
                            onClick={() => setActiveTab(id)}
                            className={cn(
                                "flex-1 py-2.5 text-sm font-medium transition-all relative",
                                isActive
                                    ? "text-brand"
                                    : "text-font-tertiary hover:text-font-primary"
                            )}
                        >
                            {tab}
                            {isActive && (
                                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand rounded-t-full mx-3" />
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Content Area */}
            <div className="min-h-[320px] max-h-[400px] overflow-y-auto w-full">
                {activeTab === 'tools' && <ToolsTab onSelect={onSelect} />}
                {activeTab === 'suggestions' && <SuggestionsTab />}
                {activeTab === 'reader' && (
                    <ReaderTab
                        activePersonaId={readerPersonaId}
                        onPersonaChange={setReaderPersonaId}
                    />
                )}
                {activeTab === 'chat' && <ChatTab />}
            </div>

            {/* Contextual Input Footer */}
            <div className="p-3 border-t border-black/5 bg-background-primary/50">
                <div className="relative">
                    <input
                        type="text"
                        placeholder={
                            activeTab === 'chat' ? "Ask anything..." :
                                activeTab === 'reader' ? "Ask AI to refine based on feedback..." :
                                    activeTab === 'suggestions' ? "Ask AI to review again..." :
                                        "Ask AI to edit selection..."
                        }
                        className="w-full pl-3 pr-10 py-2.5 bg-background-secondary rounded-xl text-sm border-none focus:ring-1 focus:ring-black/5 focus:bg-white transition-all placeholder:text-font-fourth text-font-primary"
                    />
                    <button className="absolute right-1.5 top-1.5 p-1.5 hover:bg-black/5 rounded-lg text-font-tertiary transition-colors">
                        <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                    </button>
                </div>
            </div>
        </div>
    )
}

// --- Tab Components ---

function ToolsTab({ onSelect }: { onSelect: (id: string) => void }) {
    const tools = [
        { id: 'longer', label: 'Longer', sub: 'Add detail & depth', icon: 'unfold_more' },
        { id: 'shorter', label: 'Shorter', sub: 'Make concise', icon: 'unfold_less' },
        { id: 'formal', label: 'Formal', sub: 'Professional tone', icon: 'business_center' },
        { id: 'casual', label: 'Casual', sub: 'Friendly tone', icon: 'coffee' },
        { id: 'expand', label: 'Expand', sub: 'Continue writing', icon: 'edit_note', color: 'bg-purple-50 text-purple-600' },
        { id: 'summarize', label: 'Summarize', sub: 'Create key points', icon: 'list', color: 'bg-emerald-50 text-emerald-600' },
        { id: 'translate', label: 'Translate', sub: 'Change language', icon: 'translate', color: 'bg-pink-50 text-pink-600' },
        { id: 'proofread', label: 'Proofread', sub: 'Fix grammar', icon: 'spellcheck', color: 'bg-brand/10 text-brand' },
    ]

    return (
        <div className="grid grid-cols-2 gap-2 p-3">
            {tools.map(tool => (
                <button
                    key={tool.id}
                    onClick={() => onSelect(tool.id)}
                    className="flex flex-col items-start p-3 rounded-xl hover:bg-background-secondary border border-transparent hover:border-black/5 transition-all text-left group"
                >
                    <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center mb-2 transition-colors",
                        tool.color || "bg-blue-50 text-blue-600"
                    )}>
                        <span className="material-symbols-outlined text-[18px]">{tool.icon}</span>
                    </div>
                    <span className="text-sm font-semibold text-font-primary">{tool.label}</span>
                    <span className="text-xs text-font-tertiary">{tool.sub}</span>
                </button>
            ))}
        </div>
    )
}

function SuggestionsTab() {
    const suggestions = [
        {
            type: 'Typo',
            label: 'Typo',
            original: 'I will recieve the package.',
            fixed: 'I will receive the package.',
            diff: { start: 7, end: 14, text: 'receive' }
        },
        {
            type: 'Grammar',
            label: 'Grammar',
            original: "She don't have the key.",
            fixed: "She doesn't have the key.",
            diff: { start: 4, end: 9, text: "doesn't" }
        },
    ]

    return (
        <div className="flex flex-col gap-3 p-3">
            {suggestions.map((s, i) => (
                <div key={i} className="border border-black/5 rounded-xl p-3 bg-white space-y-3 shadow-sm">
                    <div className="flex items-center justify-between">
                        <span className={cn(
                            "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider",
                            s.type === 'Typo' ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"
                        )}>
                            {s.label}
                        </span>
                        <button className="text-font-fourth hover:text-font-primary">
                            <span className="material-symbols-outlined text-[16px]">more_horiz</span>
                        </button>
                    </div>

                    <div className="bg-background-secondary/50 p-2 rounded-lg text-sm text-font-tertiary">
                        <div className="text-[10px] uppercase font-bold text-font-fourth mb-1">Original</div>
                        <div className="line-through decoration-red-400/50 decoration-2">{s.original}</div>
                    </div>

                    <div className="bg-blue-50/50 p-2 rounded-lg text-sm text-font-primary border border-blue-100">
                        <div className="text-[10px] uppercase font-bold text-blue-400 mb-1">Suggested</div>
                        <div>
                            {s.fixed.split(' ').map((word, idx) => {
                                // Simple naive highlight for demo
                                const isDiff = s.diff.text.includes(word.replace(/[^a-zA-Z]/g, ''))
                                return (
                                    <span key={idx} className={cn(isDiff && "font-semibold text-blue-600")}>
                                        {word}{' '}
                                    </span>
                                )
                            })}
                        </div>
                    </div>

                    <div className="flex gap-2 pt-1">
                        <button className="flex-1 py-1.5 text-sm bg-background-primary border border-black/10 rounded-lg text-font-secondary hover:bg-background-secondary transition-colors">
                            Ignore
                        </button>
                        <button className="flex-1 py-1.5 text-sm bg-brand text-white rounded-lg hover:brightness-110 transition-all font-medium shadow-sm shadow-brand/20">
                            Accept
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

interface ReaderTabProps {
    activePersonaId: ReaderPersonaId
    onPersonaChange: (id: ReaderPersonaId) => void
}

function ReaderTab({ activePersonaId, onPersonaChange }: ReaderTabProps) {
    const activePersona = React.useMemo(() =>
        READER_PERSONAS.find(p => p.id === activePersonaId) || READER_PERSONAS[0],
        [activePersonaId])

    return (
        <div className="p-4 space-y-6">
            <div>
                <div className="text-xs font-bold text-font-tertiary uppercase tracking-wider mb-3">Target Reader</div>
                <div className="flex justify-between px-2">
                    {READER_PERSONAS.map((p) => (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => onPersonaChange(p.id)}
                            className="flex flex-col items-center gap-1 group relative z-10 cursor-pointer"
                        >
                            <div className={cn(
                                "w-12 h-12 rounded-full border-2 flex items-center justify-center overflow-hidden transition-all duration-200",
                                activePersonaId === p.id
                                    ? "border-brand ring-2 ring-brand/20 scale-110"
                                    : "border-transparent opacity-70 group-hover:opacity-100 bg-background-secondary"
                            )}>
                                {p.img ? (
                                    <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                                ) : (
                                    <span className="material-symbols-outlined">{p.icon}</span>
                                )}
                            </div>
                            <div className="text-center">
                                <div className={cn(
                                    "text-xs font-medium transition-colors",
                                    activePersonaId === p.id ? "text-brand" : "text-font-tertiary"
                                )}>{p.name}</div>
                                {p.sub && <div className="text-[10px] text-font-fourth">{p.sub}</div>}
                            </div>
                        </button>
                    ))}
                    <button
                        type="button"
                        className="flex flex-col items-center gap-1 group"
                    >
                        <div className="w-12 h-12 rounded-full border-2 border-dashed border-black/20 flex items-center justify-center overflow-hidden transition-all duration-200 hover:border-black/40 bg-transparent text-font-fourth hover:text-font-primary">
                            <span className="material-symbols-outlined">add</span>
                        </div>
                        <div className="text-center">
                            <div className="text-xs font-medium text-font-tertiary">New</div>
                            <div className="text-[10px] text-font-fourth">User</div>
                        </div>
                    </button>
                </div>
            </div>

            <div key={activePersonaId} className={cn("rounded-xl p-4 flex items-center gap-3 transition-colors duration-300 animate-in fade-in slide-in-from-bottom-2", activePersona.reaction.color)}>
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-2xl shrink-0 bg-white/50 backdrop-blur-sm")}>
                    {activePersona.reaction.emoji}
                </div>
                <div>
                    <div className={cn("text-sm font-bold", activePersona.reaction.textColor)}>{activePersona.reaction.title}</div>
                    <div className={cn("text-xs leading-relaxed mt-0.5 opacity-90", activePersona.reaction.textColor)}>
                        {activePersona.reaction.desc}
                    </div>
                </div>
            </div>

            <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-font-tertiary">IMPACT SCORE</span>
                    <span className="font-bold text-font-primary">{activePersona.impact.score}/10</span>
                </div>
                <div className="h-1.5 w-full bg-background-secondary rounded-full overflow-hidden">
                    <div
                        className={cn("h-full rounded-full transition-all duration-500",
                            activePersona.impact.score > 7 ? "bg-emerald-500" :
                                activePersona.impact.score > 5 ? "bg-blue-500" :
                                    "bg-orange-500"
                        )}
                        style={{ width: `${activePersona.impact.score * 10}%` }}
                    />
                </div>
                <div className="flex gap-2 mt-2 flex-wrap">
                    {activePersona.impact.tags.map(tag => (
                        <span key={tag} className="px-2 py-1 bg-background-secondary text-[10px] font-medium text-font-secondary rounded-md">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            <div>
                <div className="text-xs font-bold text-font-tertiary uppercase tracking-wider mb-3">Advice for Change</div>
                <div className="space-y-2">
                    {activePersona.advice.map((item, i) => (
                        <div key={i} className="p-3 border border-black/5 rounded-xl flex gap-3 hover:bg-background-secondary/50 transition-colors cursor-pointer group">
                            <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-[18px]">{item.icon}</span>
                            </div>
                            <div>
                                <div className="text-sm font-semibold text-font-primary">{item.title}</div>
                                <div className="text-xs text-font-tertiary mt-0.5">{item.desc}</div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

function ChatTab() {
    return (
        <div className="flex flex-col h-[320px]">
            <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-brand text-[18px]">auto_awesome</span>
                    </div>
                    <div className="bg-background-secondary p-3 rounded-2xl rounded-tl-none text-sm text-font-primary leading-relaxed">
                        Hi! I can help you rewrite this email to be more effective. What's your goal?
                    </div>
                </div>

                {/* Mock user reply */}
                <div className="flex gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 overflow-hidden">
                        <span className="material-symbols-outlined text-font-tertiary text-[18px]">person</span>
                    </div>
                    <div className="bg-brand text-white p-3 rounded-2xl rounded-tr-none text-sm leading-relaxed shadow-sm shadow-brand/20">
                        Make it sound more professional and shorter.
                    </div>
                </div>

                <div className="flex gap-3">
                    <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-brand text-[18px]">auto_awesome</span>
                    </div>
                    <div className="bg-background-secondary p-3 rounded-2xl rounded-tl-none text-sm text-font-primary leading-relaxed">
                        Got it. Here is a more concise version for you...
                    </div>
                </div>
            </div>
        </div>
    )
}
