import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    X,
    Sparkles,
    User,
    Briefcase,
    Code,
    Zap,
    Maximize2,
    Minimize2,
    Briefcase as BriefcaseIcon,
    Coffee,
    Smile,
    Gavel,
    Edit3,
    List,
    RefreshCw,
    Wand2,
    Languages,
    CheckCircle2,
    CheckSquare,
    ArrowUp,
    Quote,
    ThumbsUp,
    AlertCircle,
    AlignLeft,
    Eraser,
    Type,
    Highlighter,
    Gift,
    Monitor
} from "lucide-react"

import { Editor } from "@tiptap/react"
import { streamTextToEditor } from "../../features/editor/utils/ai-streaming"

interface ComposeAISidebarProps {
    onClose: () => void
    editor?: Editor | null // TipTap editor instance
}

type TabType = 'tools' | 'suggestions' | 'reader' | 'chat'

export function ComposeAISidebar({ onClose, editor }: ComposeAISidebarProps) {
    const [activeTab, setActiveTab] = React.useState<TabType>('tools')
    const [isLoading, setIsLoading] = React.useState<string | null>(null)

    // Helper to simulate actions for tools
    const simulateAction = (actionId: string, duration = 1500) => {
        setIsLoading(actionId)

        if (editor) {
            // Get mock content
            const dummy = `[AI ${actionId}] 这是根据所选工具生成的优化内容。`
            streamTextToEditor(editor, dummy, () => setIsLoading(null))
        } else {
            setTimeout(() => {
                setIsLoading(null)
            }, duration)
        }
    }

    return (
        <div className="w-[340px] border-l border-comp-divider bg-background-primary flex flex-col shrink-0 h-full animate-in slide-in-from-right-5 duration-200 z-20">
            {/* Header + Tabs */}
            <div className="flex flex-col shrink-0 bg-background-primary">
                <div className="flex items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-2 text-font-primary font-medium text-base">
                        <Sparkles className="w-5 h-5 text-brand" />
                        写作助手
                    </div>
                    <Button variant="ghost" size="icon" className="w-8 h-8 -mr-2 text-icon-secondary hover:text-font-primary" onClick={onClose}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>

                {/* Segmented Control Tabs */}
                <div className="px-4 pb-3">
                    <div className="flex p-1 bg-background-secondary rounded-lg">
                        {['工具', '建议', '读者反应', '对话'].map((label, index) => {
                            const ids: TabType[] = ['tools', 'suggestions', 'reader', 'chat']
                            const id = ids[index]
                            const isActive = activeTab === id
                            return (
                                <button
                                    key={id}
                                    onClick={() => setActiveTab(id)}
                                    className={cn(
                                        "flex-1 py-1.5 text-xs font-medium rounded-md transition-all",
                                        isActive
                                            ? "bg-white text-font-primary shadow-sm"
                                            : "text-font-tertiary hover:text-font-primary"
                                    )}
                                >
                                    {label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <ScrollArea className="flex-1 bg-background-primary">
                <div className="min-h-full">
                    {activeTab === 'tools' && <ToolsTab onSelect={(id) => simulateAction(id)} isLoading={isLoading} editor={editor} />}
                    {activeTab === 'suggestions' && <SuggestionsTab editor={editor} />}
                    {activeTab === 'reader' && <ReaderTab editor={editor} />}
                    {activeTab === 'chat' && <ChatTab editor={editor} />}
                </div>
            </ScrollArea>

            {/* Footer Input */}
            <div className="p-3 border-t border-comp-divider bg-background-primary">
                <div className="relative">
                    <input
                        type="text"
                        placeholder={
                            activeTab === 'chat' ? "输入消息..." :
                                activeTab === 'reader' ? "让 AI 根据反馈调整..." :
                                    activeTab === 'suggestions' ? "让 AI 重新检查..." :
                                        "让 AI 编辑选区..."
                        }
                        className="w-full pl-3 pr-10 py-3 bg-background-secondary rounded-xl text-sm border-none focus:ring-1 focus:ring-brand/20 focus:bg-white transition-all placeholder:text-font-fourth text-font-primary"
                    />
                    <button className="absolute right-2 top-2 p-1.5 hover:bg-black/5 rounded-lg text-font-tertiary transition-colors">
                        <ArrowUp className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </div>
    )
}

// --- Tab Components ---

function ToolsTab({ onSelect, isLoading, editor }: { onSelect: (id: string) => void, isLoading: string | null, editor?: Editor | null }) {
    const groups = [
        {
            title: "文本长度",
            tools: [
                { id: 'longer', label: '加长', icon: Maximize2, color: 'text-blue-600 bg-blue-50' },
                { id: 'shorter', label: '缩短', icon: Minimize2, color: 'text-blue-600 bg-blue-50' }
            ]
        },
        {
            title: "文本风格",
            tools: [
                { id: 'formal', label: '正式', icon: BriefcaseIcon, color: 'text-purple-600 bg-purple-50' },
                { id: 'casual', label: '休闲', icon: Coffee, color: 'text-orange-600 bg-orange-50' },
                { id: 'friendly', label: '友好', icon: Smile, color: 'text-green-600 bg-green-50' },
                { id: 'serious', label: '严肃', icon: Gavel, color: 'text-gray-600 bg-gray-100' }
            ]
        },
        {
            title: "内容创作",
            tools: [
                { id: 'expand', label: '扩展内容', icon: Edit3, color: 'text-indigo-600 bg-indigo-50' },
                { id: 'summarize', label: '总结要点', icon: List, color: 'text-emerald-600 bg-emerald-50' },
                { id: 'rewrite', label: '重写', icon: RefreshCw, color: 'text-red-600 bg-red-50' },
                { id: 'simplify', label: '简化', icon: Wand2, color: 'text-cyan-600 bg-cyan-50' }
            ]
        },
        {
            title: "文本翻译",
            tools: [
                { id: 'translate', label: '翻译', icon: Languages, color: 'text-pink-600 bg-pink-50' }
            ]
        },
        {
            title: "文本检查",
            tools: [
                { id: 'proofread', label: '校对', icon: CheckCircle2, color: 'text-brand bg-brand/10' },
                { id: 'grammar', label: '语法检查', icon: CheckSquare, color: 'text-yellow-600 bg-yellow-50' },
                { id: 'fix_punctuation', label: '标点修复', icon: Type, color: 'text-orange-600 bg-orange-50' }
            ]
        }
    ]

    // Insert "排版美化" group before "文本翻译" (Text Translation) or just after "内容创作" (Content Creation)
    const formattingGroup = {
        title: "排版美化",
        tools: [
            { id: 'highlight_points', label: '重点高亮', icon: Highlighter, color: 'text-yellow-600 bg-yellow-50' },
            { id: 'style_business', label: '商务专业', icon: BriefcaseIcon, color: 'text-slate-600 bg-slate-100' },
            { id: 'style_holiday', label: '温馨节日', icon: Gift, color: 'text-red-600 bg-red-50' },
            { id: 'style_tech', label: '极简科技', icon: Monitor, color: 'text-cyan-600 bg-cyan-50' }
        ]
    }

    const allGroups = [
        ...groups.slice(0, 3), // Length, Style, Content
        formattingGroup,
        ...groups.slice(3)     // Translation, Check
    ]

    return (
        <div className="p-4 space-y-6">
            {allGroups.map((group, idx) => (
                <div key={idx}>
                    <div className="text-xs font-bold text-font-tertiary mb-3 uppercase tracking-wider">{group.title}</div>
                    <div className="grid grid-cols-2 gap-3">
                        {group.tools.map(tool => (
                            <button
                                key={tool.id}
                                onClick={() => onSelect(tool.id)}
                                disabled={isLoading === tool.id}
                                className="flex items-center gap-3 p-3 rounded-lg hover:bg-background-secondary border border-comp-divider hover:border-black/5 transition-all text-left bg-white group disabled:opacity-50 h-12"
                            >
                                <div className={cn(
                                    "w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors",
                                    tool.color,
                                    isLoading === tool.id && "animate-spin"
                                )}>
                                    {isLoading === tool.id ? (
                                        <RefreshCw className="w-4 h-4" />
                                    ) : (
                                        <tool.icon className="w-4 h-4" />
                                    )}
                                </div>
                                <span className="text-sm font-medium text-font-primary whitespace-nowrap">{tool.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

function SuggestionsTab({ editor }: { editor?: Editor | null }) {
    const suggestions = [
        {
            type: 'Typo',
            label: '拼写错误',
            original: 'I will recieve the package.',
            fixed: 'I will receive the package.',
            diff: { start: 7, end: 14, text: 'receive' }
        },
        {
            type: 'Grammar',
            label: '语法错误',
            original: "She don't have the key.",
            fixed: "She doesn't have the key.",
            diff: { start: 4, end: 9, text: "doesn't" }
        },
    ]

    return (
        <div className="flex flex-col gap-3 p-3">
            {suggestions.map((s, i) => (
                <div key={i} className="bg-white rounded-lg border border-black/10 overflow-hidden p-3 flex flex-col gap-2.5">
                    {/* Header Badge */}
                    <div className="flex items-center gap-2">
                        <span className={cn(
                            "inline-flex items-center justify-center px-1.5 py-0.5 rounded-[4px] text-[11px] font-bold border",
                            s.type === 'Typo'
                                ? "bg-red-50 text-red-600 border-red-100"
                                : "bg-blue-50 text-blue-600 border-blue-100"
                        )}>
                            {s.label}
                        </span>
                    </div>

                    {/* Original Context Block */}
                    <div className="bg-slate-50 rounded-md p-2.5 flex flex-col gap-1.5 border border-slate-100">
                        <span className="text-slate-400 text-[10px] font-medium leading-none">原文</span>
                        <p className="text-slate-500 text-[13px] leading-relaxed font-mono">
                            {/* Simple logic for demo, usually we have full context */}
                            {s.original}
                        </p>
                    </div>

                    {/* Suggestion Context Block */}
                    <div className="bg-[#F0F5FF] rounded-md p-2.5 flex flex-col gap-1.5 border border-[#0A59F7]/10">
                        <span className="text-[#0A59F7] text-[10px] font-bold leading-none">建议修改</span>
                        <p className="text-slate-900 text-[13px] font-medium leading-relaxed font-mono">
                            {s.fixed.split(' ').map((word, idx) => {
                                const isDiff = s.diff.text.includes(word.replace(/[^a-zA-Z]/g, ''))
                                return isDiff ? (
                                    <span key={idx} className="bg-[#D6E6FF] text-[#0A59F7] px-1 py-0.5 rounded-[4px] font-bold mx-0.5">
                                        {word}
                                    </span>
                                ) : (
                                    <span key={idx}>{word} </span>
                                )
                            })}
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="grid grid-cols-2 gap-2 mt-0.5">
                        <button className="flex items-center justify-center h-8 rounded-md text-xs font-medium text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors">
                            忽略
                        </button>
                        <button
                            onClick={() => editor && streamTextToEditor(editor, s.fixed)}
                            className="flex items-center justify-center h-8 rounded-md text-xs font-medium text-white bg-[#0A59F7] hover:bg-[#0A59F7]/90 transition-all shadow-sm active:scale-95"
                        >
                            采纳
                        </button>
                    </div>
                </div>
            ))}
        </div>
    )
}

function ReaderTab({ editor }: { editor?: Editor | null }) {
    // --- State and Data ---
    const [activePersonaId, setActivePersonaId] = React.useState<'boss' | 'pm' | 'cto'>('boss')

    const personasData = {
        boss: {
            name: 'Boss', sub: '严厉', img: 'https://i.pravatar.cc/150?u=u2',
            impactScore: 4.5, tags: ['急躁', '数据驱动', '无废话'],
            reaction: { emoji: '💪', title: '预测反馈: 困惑', desc: '你的老板注重效率、结果导向。这封草稿感觉太犹豫且缺乏关键数据支撑。', color: 'bg-orange-50/50 border-orange-100 text-orange-900' },
            advice: [
                { icon: Zap, iconColor: 'text-blue-600 bg-blue-50', title: '删除开头的废话', desc: '建议删除 "希望这封邮件找到你..."，直接以 "关于Q3项目的进度更新" 开始。' },
                { icon: List, iconColor: 'text-purple-600 bg-purple-50', title: '使用列表格式呈现数据', desc: '将第二段的长文本转换为 bullet points，突出关键增长数据，更易扫读。' },
                { icon: Smile, iconColor: 'text-green-600 bg-green-50', title: '语气更自信一点', desc: '将 "我觉得我们可能完成" 改为 "我们将按计划完成"。' },
            ]
        },
        pm: {
            name: 'PM', sub: '忙碌', img: 'https://i.pravatar.cc/150?u=sarah',
            impactScore: 7.5, tags: ['用户价值', '策略', 'OKR'],
            reaction: { emoji: '🧐', title: '预测反馈: 需要更多上下文', desc: 'PM 关注这封邮件与 Q3 OKR 的关联，以及用户反馈。', color: 'bg-purple-50/50 border-purple-100 text-purple-900' },
            advice: [
                { icon: Zap, iconColor: 'text-indigo-600 bg-indigo-50', title: '增加关键指标', desc: '包含上周的用户留存率数据，以支持你的论点。' },
                { icon: ThumbsUp, iconColor: 'text-green-600 bg-green-50', title: '突出用户价值', desc: '明确指出此功能对用户的直接好处。' },
                { icon: Quote, iconColor: 'text-pink-600 bg-pink-50', title: '引用 Jira 链接', desc: '添加相关的 Jira 任务 ID，方便追踪。' },
            ]
        },
        cto: {
            name: 'CTO', sub: '技术', img: 'https://i.pravatar.cc/150?u=mike',
            impactScore: 5.8, tags: ['可扩展性', '安全性', '边缘情况'],
            reaction: { emoji: '🛠️', title: '预测反馈: 可行性存疑', desc: 'CTO 关注技术实现的延迟影响和系统可扩展性。', color: 'bg-slate-50/50 border-slate-200 text-slate-900' },
            advice: [
                { icon: AlertCircle, iconColor: 'text-orange-600 bg-orange-50', title: '考虑边缘情况', desc: '如果 API 调用失败，会发生什么？需要添加容错方案。' },
                { icon: Code, iconColor: 'text-cyan-600 bg-cyan-50', title: '扩展性检查', desc: '系统能否承受 10k RPS 的压力？' },
                { icon: Briefcase, iconColor: 'text-red-600 bg-red-50', title: '安全审查', desc: '确保用户隐私数据 (PII) 已加密处理。' },
            ]
        }
    }

    const activePersona = personasData[activePersonaId]
    const personas = [
        { id: 'boss' as const, ...personasData.boss },
        { id: 'pm' as const, ...personasData.pm },
        { id: 'cto' as const, ...personasData.cto },
    ]

    return (
        <div className="p-4 space-y-8">
            {/* Personas */}
            <div>
                <div className="text-xs font-bold text-font-tertiary uppercase tracking-wider mb-4">目标读者</div>
                <div className="grid grid-cols-4 gap-2">
                    {personas.map((p) => (
                        <button
                            key={p.id}
                            type="button"
                            onClick={() => setActivePersonaId(p.id)}
                            className="flex flex-col items-center gap-2 group cursor-pointer"
                        >
                            <div className={cn(
                                "w-12 h-12 rounded-full flex items-center justify-center transition-all group-hover:scale-105 overflow-hidden",
                                activePersonaId === p.id
                                    ? "ring-2 ring-brand ring-offset-2"
                                    : "opacity-80 group-hover:opacity-100"
                            )}>
                                <img src={p.img} alt={p.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="text-center space-y-0.5">
                                <div className={cn(
                                    "text-xs font-semibold",
                                    activePersonaId === p.id ? "text-brand" : "text-font-primary"
                                )}>{p.name}</div>
                                {p.sub && <div className="text-[10px] text-font-tertiary">{p.sub}</div>}
                            </div>
                        </button>
                    ))}
                    {/* Add New Button */}
                    <div className="flex flex-col items-center gap-2 group cursor-pointer">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center transition-all group-hover:scale-105 overflow-hidden border-2 border-dashed border-comp-divider text-font-fourth bg-transparent">
                            <User className="w-5 h-5" strokeWidth={2} />
                        </div>
                        <div className="text-center space-y-0.5">
                            <div className="text-xs font-semibold text-font-primary">New</div>
                            <div className="text-[10px] text-font-tertiary">新增</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Impact Score */}
            <div key={activePersonaId} className="space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-font-tertiary uppercase tracking-wider">影响力评分</span>
                    <span className="font-bold text-font-primary text-base">{activePersona.impactScore}<span className="text-font-tertiary text-xs left-0.5">/10</span></span>
                </div>
                <div className="h-2 w-full bg-background-secondary rounded-full overflow-hidden">
                    <div
                        className={cn(
                            "h-full rounded-full shadow-sm transition-all duration-500",
                            activePersona.impactScore > 7 ? "bg-gradient-to-r from-emerald-400 to-emerald-500" :
                                activePersona.impactScore > 5 ? "bg-gradient-to-r from-blue-400 to-blue-500" :
                                    "bg-gradient-to-r from-orange-400 to-orange-500"
                        )}
                        style={{ width: `${activePersona.impactScore * 10}%` }}
                    />
                </div>
                <div className="flex flex-wrap gap-2 pt-1">
                    {activePersona.tags.map(tag => (
                        <span key={tag} className="px-2.5 py-1 bg-background-secondary text-[11px] font-medium text-font-secondary rounded-md border border-transparent hover:border-comp-divider transition-colors">
                            {tag}
                        </span>
                    ))}
                </div>
            </div>

            {/* Analysis Box */}
            <div key={`reaction-${activePersonaId}`} className={cn("rounded-lg p-4 flex items-start gap-3 animate-in fade-in duration-300 border", activePersona.reaction.color)}>
                <div className="w-8 h-8 rounded-full bg-white/50 flex items-center justify-center text-lg shrink-0 mt-0.5">
                    <span className="font-emoji">{activePersona.reaction.emoji}</span>
                </div>
                <div>
                    <div className="text-sm font-bold">{activePersona.reaction.title}</div>
                    <div className="text-xs opacity-80 leading-relaxed mt-1">
                        {activePersona.reaction.desc}
                    </div>
                </div>
            </div>

            {/* Suggestions */}
            <div>
                <div className="text-xs font-bold text-font-tertiary uppercase tracking-wider mb-4">修改建议</div>
                <div key={`advice-${activePersonaId}`} className="space-y-3 animate-in fade-in duration-300">
                    {activePersona.advice.map((item, i) => (
                        <AdviceCard
                            key={i}
                            icon={item.icon}
                            iconColor={item.iconColor}
                            title={item.title}
                            desc={item.desc}
                            onAccept={() => editor && streamTextToEditor(editor, "Accepted advice content")}
                        />
                    ))}
                </div>
            </div>
        </div>
    )
}

function AdviceCard({ icon: Icon, iconColor, title, desc, onAccept }: { icon: any, iconColor: string, title: string, desc: string, onAccept?: () => void }) {
    return (
        <div className="p-4 border border-comp-divider rounded-lg space-y-3 bg-white hover:border-brand/30 transition-colors">
            <div className="flex gap-3">
                <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center shrink-0", iconColor)}>
                    <Icon className="w-4 h-4" />
                </div>
                <div>
                    <div className="text-sm font-semibold text-font-primary">{title}</div>
                    <div className="text-xs text-font-secondary mt-1 leading-relaxed">{desc}</div>
                </div>
            </div>
            <div className="flex gap-2 pl-11">
                <button className="px-3 py-1.5 text-xs font-medium border border-comp-divider rounded-md hover:bg-background-secondary transition-colors text-font-secondary">
                    忽略
                </button>
                <button
                    onClick={onAccept}
                    className="px-3 py-1.5 text-xs font-medium bg-brand text-white rounded-md hover:bg-brand/90 transition-colors shadow-sm"
                >
                    采纳
                </button>
            </div>
        </div>
    )
}

function ChatTab({ editor }: { editor?: Editor | null }) {
    return (
        <div className="flex flex-col h-full">
            <div className="flex-1 p-4 space-y-6">

                {/* AI Intro (No Bubble) */}
                <div className="flex flex-col gap-1 items-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand to-blue-400 flex items-center justify-center shrink-0 shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 text-white" fill="currentColor" />
                        </div>
                        <span className="text-xs font-semibold text-font-secondary">AI 助手</span>
                    </div>
                    {/* Plain Text without bubble background */}
                    <div className="pl-8 text-sm text-font-primary leading-relaxed">
                        你好！👋 我可以帮你重写这封邮件，使其更专业、更有效。请告诉我你的目标。
                    </div>
                </div>

                {/* User Reply (Real Avatar + No Bubble) */}
                <div className="flex flex-col gap-1 items-start animate-in fade-in slide-in-from-bottom-2 duration-300 delay-100">
                    <div className="flex items-center gap-2">
                        <img
                            src="https://i.pravatar.cc/150?u=u1"
                            alt="Me"
                            className="w-6 h-6 rounded-full object-cover shrink-0 shadow-sm"
                        />
                        <span className="text-xs font-semibold text-font-secondary">你</span>
                    </div>
                    <div className="pl-8 text-sm text-font-primary leading-relaxed">
                        让它听起来更正式一点，并且再短一点。
                    </div>
                </div>

                {/* AI Response (Markdown Card kept as card per request context, but intro text is flat) */}
                <div className="flex flex-col gap-1 items-start w-full animate-in fade-in slide-in-from-bottom-2 duration-300 delay-200">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-brand to-blue-400 flex items-center justify-center shrink-0 shadow-sm">
                            <Sparkles className="w-3.5 h-3.5 text-white" fill="currentColor" />
                        </div>
                        <span className="text-xs font-semibold text-font-secondary">AI 助手</span>
                    </div>

                    <div className="pl-8 w-full space-y-2">
                        <div className="text-sm text-font-primary leading-relaxed">
                            没问题，这是为您优化的版本，更加精简且语气专业：
                        </div>

                        {/* The Result Card */}
                        <div className="bg-white border border-comp-divider rounded-lg p-4 transition-all group relative mt-2">
                            <div className="text-sm text-font-primary leading-relaxed whitespace-pre-wrap font-mono bg-gray-50/50 p-3 rounded-lg border border-black/5">
                                Dear Team,{"\n\n"}
                                Project Alpha is on track for Q3 launch. Development is 90% complete, and QA begins next week.{"\n\n"}
                                Best,{"\n"}
                                Jesse
                            </div>
                            <div className="flex justify-end mt-3">
                                <Button
                                    onClick={() => editor && streamTextToEditor(editor, `Dear Team,\n\nProject Alpha is on track for Q3 launch. Development is 90% complete, and QA begins next week.\n\nBest,\nJesse`)}
                                    size="sm"
                                    className="h-8 text-xs bg-brand text-white hover:bg-brand/90 font-medium px-4 transition-all hover:scale-105 active:scale-95">
                                    插入内容
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
