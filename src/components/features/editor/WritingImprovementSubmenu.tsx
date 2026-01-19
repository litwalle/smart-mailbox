import * as React from "react"
import { Editor } from "@tiptap/react"
import {
    Wand2,
    Check,
    Minimize2,
    Maximize2,
    Edit3,
    List,
    RefreshCw,
    MoreHorizontal
} from "lucide-react"
import {
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
    DropdownMenuGroup,
} from "@/components/ui/dropdown-menu"
import { streamTextToEditor } from "./utils/ai-streaming"

interface WritingImprovementSubmenuProps {
    editor: Editor
    onAction?: (action: string) => void
    onOpenMore?: () => void
}

export function WritingImprovementSubmenu({ editor, onAction, onOpenMore }: WritingImprovementSubmenuProps) {

    const handleAction = (action: string, text: string) => {
        streamTextToEditor(editor, text)
        onAction?.(action)
    }

    return (
        <>
            <DropdownMenuLabel className="text-xs text-slate-400 font-medium px-2 py-1.5">
                基础优化
            </DropdownMenuLabel>
            <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleAction('improve', "[AI 润色] 这是润色后的内容...")} className="gap-2 focus:bg-purple-50 focus:text-purple-900">
                    <Wand2 className="w-4 h-4 text-purple-500" />
                    <span>润色文章</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('fix', "[AI 纠错] 已修复拼写和语法错误。")} className="gap-2 focus:bg-green-50 focus:text-green-900">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>纠正拼写与语法</span>
                </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-xs text-slate-400 font-medium px-2 py-1.5">
                长度调整
            </DropdownMenuLabel>
            <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleAction('shorter', "[AI 缩短]精简版内容...")} className="gap-2 focus:bg-blue-50 focus:text-blue-900">
                    <Minimize2 className="w-4 h-4 text-blue-500" />
                    <span>缩短篇幅</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('longer', "[AI 加长]这是扩展后的详细内容...")} className="gap-2 focus:bg-blue-50 focus:text-blue-900">
                    <Maximize2 className="w-4 h-4 text-blue-500" />
                    <span>扩充篇幅</span>
                </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuLabel className="text-xs text-slate-400 font-medium px-2 py-1.5">
                内容创作
            </DropdownMenuLabel>
            <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => handleAction('expand', "[AI 扩展] 更详细的展开...")} className="gap-2 focus:bg-indigo-50 focus:text-indigo-900">
                    <Edit3 className="w-4 h-4 text-indigo-500" />
                    <span>继续写作</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('summarize', "[AI 总结] 以下是核心要点...")} className="gap-2 focus:bg-emerald-50 focus:text-emerald-900">
                    <List className="w-4 h-4 text-emerald-500" />
                    <span>总结要点</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleAction('rewrite', "[AI 重写] 换一种说法...")} className="gap-2 focus:bg-red-50 focus:text-red-900">
                    <RefreshCw className="w-4 h-4 text-red-500" />
                    <span>重写</span>
                </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem
                className="gap-2 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 cursor-pointer text-blue-900"
                onSelect={(e) => {
                    e.preventDefault()
                    onOpenMore?.()
                }}
            >
                <MoreHorizontal className="w-4 h-4 text-blue-600" />
                <span className="font-medium">更多工具...</span>
            </DropdownMenuItem>
        </>
    )
}
