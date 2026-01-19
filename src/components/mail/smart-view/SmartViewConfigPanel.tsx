import * as React from "react"
import { cn } from "@/lib/utils"
import { SmartFolderConfig, SmartViewMode, SmartViewTemplate, SmartViewRule } from "./types"

// Palette color mapping
const PALETTE_BG: Record<string, string> = {
    'palette-1': 'bg-palette-1/15',
    'palette-2': 'bg-palette-2/15',
    'palette-3': 'bg-palette-3/15',
    'palette-4': 'bg-palette-4/15',
    'palette-5': 'bg-palette-5/15',
    'palette-6': 'bg-palette-6/15',
    'palette-7': 'bg-palette-7/15',
    'palette-8': 'bg-palette-8/15',
    'palette-9': 'bg-palette-9/15',
    'palette-10': 'bg-palette-10/15',
    'palette-11': 'bg-palette-11/15',
    'palette-12': 'bg-palette-12/15',
}

const PALETTE_TEXT: Record<string, string> = {
    'palette-1': 'text-palette-1',
    'palette-2': 'text-palette-2',
    'palette-3': 'text-palette-3',
    'palette-4': 'text-palette-4',
    'palette-5': 'text-palette-5',
    'palette-6': 'text-palette-6',
    'palette-7': 'text-palette-7',
    'palette-8': 'text-palette-8',
    'palette-9': 'text-palette-9',
    'palette-10': 'text-palette-10',
    'palette-11': 'text-palette-11',
    'palette-12': 'text-palette-12',
}

interface SmartViewConfigPanelProps {
    mode: SmartViewMode
    setMode: (mode: SmartViewMode) => void
    templates: SmartViewTemplate[]
    selectedTemplateId: string
    setSelectedTemplateId: (id: string) => void

    // Custom mode props
    customViewName: string
    setCustomViewName: (name: string) => void
    customRule: string
    setCustomRule: (val: string) => void
    rules: SmartViewRule[]
    removeRule: (id: string) => void
    isGenerating: boolean
    addRule: () => void
}

export function SmartViewConfigPanel({
    mode,
    setMode,
    templates,
    selectedTemplateId,
    setSelectedTemplateId,
    customViewName,
    setCustomViewName,
    customRule,
    setCustomRule,
    rules,
    removeRule,
    isGenerating,
    addRule
}: SmartViewConfigPanelProps) {

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            addRule()
        }
    }

    return (
        <div className="w-[320px] flex flex-col border-r border-comp-divider bg-background-primary h-full">
            {/* Mode Switch */}
            <div className="p-4 border-b border-comp-divider shrink-0">
                <div className="flex p-1 bg-background-secondary rounded-lg">
                    <button
                        onClick={() => setMode('template')}
                        className={cn(
                            "flex-1 py-1.5 text-xs font-medium rounded-md transition-all",
                            mode === 'template'
                                ? "bg-white text-font-primary shadow-sm"
                                : "text-font-tertiary hover:text-font-secondary"
                        )}
                    >
                        推荐模版
                    </button>
                    <button
                        onClick={() => setMode('custom')}
                        className={cn(
                            "flex-1 py-1.5 text-xs font-medium rounded-md transition-all flex items-center justify-center gap-1.5",
                            mode === 'custom'
                                ? "bg-white text-font-primary shadow-sm"
                                : "text-font-tertiary hover:text-font-secondary"
                        )}
                    >
                        <span>自定义 AI</span>
                        <span className="text-[9px] bg-brand/10 text-brand px-1 py-0.5 rounded font-bold">BETA</span>
                    </button>
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto p-4">
                {mode === 'template' && (
                    <div className="space-y-4">
                        <h3 className="text-[11px] font-bold text-font-tertiary uppercase tracking-wider">
                            选择模版分类
                        </h3>
                        <div className="grid grid-cols-2 gap-2.5">
                            {templates.map(template => {
                                const bgClass = PALETTE_BG[template.color] || 'bg-background-secondary'
                                const textClass = PALETTE_TEXT[template.color] || 'text-icon-secondary'
                                const isSelected = selectedTemplateId === template.id

                                return (
                                    <div
                                        key={template.id}
                                        onClick={() => setSelectedTemplateId(template.id)}
                                        className={cn(
                                            "cursor-pointer rounded-lg border p-3 transition-all hover:shadow-md flex flex-col items-center gap-2 text-center",
                                            isSelected
                                                ? "border-brand bg-brand/5"
                                                : "border-comp-divider bg-background-primary hover:border-brand/30"
                                        )}
                                    >
                                        {/* Colored Icon Container */}
                                        <div className={cn(
                                            "size-10 rounded-lg flex items-center justify-center transition-colors",
                                            bgClass
                                        )}>
                                            <span className={cn("material-symbols-outlined text-[22px]", textClass)}>
                                                {template.icon}
                                            </span>
                                        </div>
                                        <span className={cn(
                                            "text-sm font-medium leading-tight",
                                            isSelected ? "text-brand" : "text-font-primary"
                                        )}>
                                            {template.name}
                                        </span>
                                    </div>
                                )
                            })}
                        </div>
                    </div>
                )}

                {mode === 'custom' && (
                    <div className="space-y-4">
                        {/* Label Name Input */}
                        <div className="space-y-2">
                            <h3 className="text-[11px] font-bold text-font-tertiary uppercase tracking-wider">
                                视图名称
                            </h3>
                            <input
                                type="text"
                                value={customViewName}
                                onChange={(e) => setCustomViewName(e.target.value)}
                                placeholder="我的智能视图"
                                className="w-full px-3 py-2 text-sm border border-comp-divider rounded-lg focus:border-brand focus:ring-1 focus:ring-brand/20 outline-none bg-white text-font-primary placeholder:text-font-tertiary"
                            />
                        </div>

                        {/* Rule Input */}
                        <div className="space-y-2">
                            <h3 className="text-[11px] font-bold text-font-tertiary uppercase tracking-wider">
                                添加筛选规则
                            </h3>
                            <div className="relative">
                                <textarea
                                    value={customRule}
                                    onChange={(e) => setCustomRule(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="例如：筛选来自 @github.com 的邮件，或者包含“发票”的主题"
                                    rows={3}
                                    className="w-full px-3 py-2.5 text-sm border border-comp-divider rounded-lg focus:border-brand focus:ring-1 focus:ring-brand/20 outline-none resize-none bg-white text-font-primary placeholder:text-font-tertiary"
                                />
                                <button
                                    onClick={addRule}
                                    disabled={!customRule.trim() || isGenerating}
                                    className={cn(
                                        "absolute bottom-2.5 right-2.5 h-7 px-2.5 rounded text-[11px] font-bold text-white flex items-center gap-1.5 transition-all",
                                        customRule.trim() && !isGenerating
                                            ? "bg-brand hover:bg-brand/90 shadow-sm"
                                            : "bg-comp-divider cursor-not-allowed"
                                    )}
                                >
                                    {isGenerating ? (
                                        <>
                                            <span className="material-symbols-outlined text-[14px] animate-spin">refresh</span>
                                            <span>解析中</span>
                                        </>
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-[14px]">auto_awesome</span>
                                            <span>添加</span>
                                        </>
                                    )}
                                </button>
                            </div>
                            <p className="text-[10px] text-font-tertiary">
                                AI 会解析自然语言规则。按 Enter 快速添加。
                            </p>
                        </div>

                        {/* Rule Cards */}
                        {rules.length > 0 && (
                            <div className="space-y-2">
                                <h3 className="text-[11px] font-bold text-font-tertiary uppercase tracking-wider">
                                    生效规则 ({rules.length})
                                </h3>
                                <div className="space-y-2">
                                    {rules.map((rule) => (
                                        <div
                                            key={rule.id}
                                            className="group flex items-center gap-2 p-2.5 bg-background-secondary rounded-lg"
                                        >
                                            <span className="material-symbols-outlined text-[16px] text-brand shrink-0">
                                                filter_alt
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <div className="text-xs font-medium text-font-primary truncate">
                                                    {rule.displayText}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => removeRule(rule.id)}
                                                className="opacity-0 group-hover:opacity-100 p-1 text-icon-tertiary hover:text-warning transition-all"
                                                title="删除规则"
                                            >
                                                <span className="material-symbols-outlined text-[14px]">close</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
