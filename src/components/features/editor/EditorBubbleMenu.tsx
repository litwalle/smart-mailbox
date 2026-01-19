import * as React from "react"
import { Editor, isTextSelection } from "@tiptap/react"
import {
    Sparkles,
    Bold,
    Italic,
    Underline,
    Link,
    ChevronDown,
    Wand2,
    Check,
    AlignLeft,
    Palette,
    Highlighter,
    Maximize2,
    Minimize2,
    Edit3,
    List,
    RefreshCw,
    MoreHorizontal,
    MessageCircle,
    X,
    ArrowUp,
    Send,
    ThumbsUp,
    ThumbsDown,
    RotateCw,
    AtSign,
    ArrowRight,
    ArrowLeft,
    ArrowDownLeft,
    Copy,
    ChevronLeft,
    Bot
} from "lucide-react"
import { Button, ButtonProps } from "@/components/ui/Button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSeparator,
    DropdownMenuLabel,
    DropdownMenuGroup,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent
} from "@/components/ui/dropdown-menu"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { AIAssistantDialog } from "./AIAssistantDialog"
import { ColorPicker } from "@/components/ui/color-picker"
import { cn } from "@/lib/utils"
import { streamTextToEditor } from "./utils/ai-streaming"
import { WritingImprovementSubmenu } from "./WritingImprovementSubmenu"

interface EditorBubbleMenuProps {
    editor: Editor | null
}

interface BubbleButtonProps extends ButtonProps {
    icon: React.ElementType
    isActive?: boolean
    iconClassName?: string
    strokeWidth?: number
}

// Forward Ref for BubbleButton
const BubbleButton = React.forwardRef<HTMLButtonElement, BubbleButtonProps>(({
    icon: Icon,
    onClick,
    isActive,
    className,
    iconClassName,
    strokeWidth = 1.5,
    ...props
}, ref) => (
    <Button
        ref={ref}
        variant="ghost"
        size="sm"
        onMouseDown={(e) => {
            e.preventDefault()
            e.stopPropagation()
        }}
        onClick={onClick}
        className={cn(
            "h-8 w-8 p-0 rounded-md text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-all",
            isActive && "bg-slate-100 text-slate-900",
            className
        )}
        {...props}
    >
        <Icon className={cn("w-4 h-4", iconClassName)} strokeWidth={strokeWidth} />
    </Button>
))
BubbleButton.displayName = "BubbleButton"

export function EditorBubbleMenu({ editor }: EditorBubbleMenuProps) {
    // UI States
    const [isAIDialogOpen, setIsAIDialogOpen] = React.useState(false)
    const [isOptimizationOpen, setIsOptimizationOpen] = React.useState(false)
    const [isFontSizeOpen, setIsFontSizeOpen] = React.useState(false)
    const [isTextColorOpen, setIsTextColorOpen] = React.useState(false)
    const [isBgColorOpen, setIsBgColorOpen] = React.useState(false)
    const [isAIToolsOpen, setIsAIToolsOpen] = React.useState(false)
    const [isAIChatOpen, setIsAIChatOpen] = React.useState(false)
    const [aiChatInput, setAiChatInput] = React.useState('')
    const [aiChatOutput, setAiChatOutput] = React.useState('')
    const [isAiChatLoading, setIsAiChatLoading] = React.useState(false)

    // Refs for sync access
    const isAIDialogOpenRef = React.useRef(isAIDialogOpen)
    const isOptimizationOpenRef = React.useRef(isOptimizationOpen)
    const isFontSizeOpenRef = React.useRef(isFontSizeOpen)
    const isTextColorOpenRef = React.useRef(isTextColorOpen)
    const isBgColorOpenRef = React.useRef(isBgColorOpen)
    const isAIToolsOpenRef = React.useRef(isAIToolsOpen)
    const isAIChatOpenRef = React.useRef(isAIChatOpen)

    // 【关键】跟踪上一次打开的时间戳，用于忽略"打开后立即关闭"的请求
    const optimizationOpenedAtRef = React.useRef<number>(0)
    const fontSizeOpenedAtRef = React.useRef<number>(0)
    const aiChatOpenedAtRef = React.useRef<number>(0)

    // Position State
    const [isVisible, setIsVisible] = React.useState(false)
    const [position, setPosition] = React.useState({ top: 0, left: 0 })

    // Sync refs
    React.useEffect(() => { isAIDialogOpenRef.current = isAIDialogOpen }, [isAIDialogOpen])
    React.useEffect(() => { isOptimizationOpenRef.current = isOptimizationOpen }, [isOptimizationOpen])
    React.useEffect(() => { isFontSizeOpenRef.current = isFontSizeOpen }, [isFontSizeOpen])
    React.useEffect(() => { isTextColorOpenRef.current = isTextColorOpen }, [isTextColorOpen])
    React.useEffect(() => { isBgColorOpenRef.current = isBgColorOpen }, [isBgColorOpen])
    React.useEffect(() => { isAIToolsOpenRef.current = isAIToolsOpen }, [isAIToolsOpen])
    React.useEffect(() => { isAIChatOpenRef.current = isAIChatOpen }, [isAIChatOpen])

    const containerRef = React.useRef<HTMLDivElement>(null)

    // Update Position Logic
    const updatePosition = React.useCallback(() => {
        if (!editor || !editor.view || editor.isDestroyed) return

        const { selection } = editor.state
        const { empty } = selection

        // 如果任何菜单打开，强制保持可见
        if (
            isOptimizationOpenRef.current ||
            isFontSizeOpenRef.current ||
            isAIDialogOpenRef.current ||
            isTextColorOpenRef.current ||
            isBgColorOpenRef.current ||
            isAIToolsOpenRef.current ||
            isAIChatOpenRef.current
        ) {
            setIsVisible(true)
            return
        }

        // 标准可见性规则
        if (empty || !isTextSelection(selection)) {
            setIsVisible(false)
            return
        }

        // Calculate Position
        const { view } = editor
        const { to } = selection

        const endCoords = view.coordsAtPos(to)
        const editorDom = view.dom
        const editorRectLocal = editorDom.getBoundingClientRect()

        const menuWidth = containerRef.current?.offsetWidth || 350
        let left = endCoords.left - editorRectLocal.left + (endCoords.right - endCoords.left) / 2
        let top = endCoords.bottom - editorRectLocal.top

        left -= menuWidth / 2
        top += 10

        const safetyPadding = 24
        const editorWidth = editorDom.clientWidth

        if (left < safetyPadding) left = safetyPadding
        if (left + menuWidth > editorWidth - safetyPadding) {
            left = editorWidth - menuWidth - safetyPadding
        }
        if (left < 0) left = safetyPadding

        setPosition({ top, left })
        setIsVisible(true)

    }, [editor])

    // Listen to editor updates
    React.useEffect(() => {
        if (!editor) return

        const handleUpdate = () => {
            requestAnimationFrame(updatePosition)
        }

        editor.on('selectionUpdate', handleUpdate)
        editor.on('update', handleUpdate)
        editor.on('focus', handleUpdate)
        editor.on('blur', () => {
            setTimeout(() => {
                if (
                    isOptimizationOpenRef.current ||
                    isFontSizeOpenRef.current ||
                    isAIDialogOpenRef.current
                ) {
                    // Don't hide
                } else {
                    updatePosition()
                }
            }, 100)
        })

        return () => {
            editor.off('selectionUpdate', handleUpdate)
            editor.off('update', handleUpdate)
            editor.off('focus', handleUpdate)
            editor.off('blur', handleUpdate)
        }
    }, [editor, updatePosition])

    if (!editor) return null

    // Handlers
    const handleQuickAIAction = (action: string) => {
        console.log(`AI Action: ${action}`)
        setIsOptimizationOpen(false)
        isOptimizationOpenRef.current = false
        setTimeout(updatePosition, 50)
    }

    const setLink = () => {
        const previousUrl = editor.getAttributes('link').href
        const url = window.prompt('URL', previousUrl)
        if (url === null) return
        if (url === '') {
            editor.chain().focus().extendMarkRange('link').unsetLink().run()
            return
        }
        editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
    }

    // 【关键】阻止触发器上的 mousedown 导致编辑器失焦
    const handleTriggerMouseDown = (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
    }

    // 处理 Optimization 下拉菜单的打开/关闭
    // 【关键改动】忽略在打开后 300ms 内发生的关闭请求
    const handleOptimizationOpenChange = (open: boolean) => {
        console.log('[EditorBubbleMenu] Optimization onOpenChange:', open)

        if (open) {
            // 记录打开时间
            optimizationOpenedAtRef.current = Date.now()
            setIsOptimizationOpen(true)
            isOptimizationOpenRef.current = true
        } else {
            // 检查是否是"打开后立即关闭"的情况
            const timeSinceOpen = Date.now() - optimizationOpenedAtRef.current
            if (timeSinceOpen < 300) {
                // 这是 Radix 的误判关闭，忽略它！
                console.log('[EditorBubbleMenu] Ignoring close request - too soon after open:', timeSinceOpen, 'ms')
                // 强制保持打开状态
                setTimeout(() => {
                    setIsOptimizationOpen(true)
                    isOptimizationOpenRef.current = true
                }, 0)
                return
            }
            // 正常关闭
            setIsOptimizationOpen(false)
            isOptimizationOpenRef.current = false
            setTimeout(() => editor.commands.focus(), 0)
        }
    }

    // 处理 FontSize 下拉菜单的打开/关闭
    const handleFontSizeOpenChange = (open: boolean) => {
        console.log('[EditorBubbleMenu] FontSize onOpenChange:', open)

        if (open) {
            fontSizeOpenedAtRef.current = Date.now()
            setIsFontSizeOpen(true)
            isFontSizeOpenRef.current = true
        } else {
            const timeSinceOpen = Date.now() - fontSizeOpenedAtRef.current
            if (timeSinceOpen < 300) {
                console.log('[EditorBubbleMenu] Ignoring close request - too soon after open:', timeSinceOpen, 'ms')
                setTimeout(() => {
                    setIsFontSizeOpen(true)
                    isFontSizeOpenRef.current = true
                }, 0)
                return
            }
            setIsFontSizeOpen(false)
            isFontSizeOpenRef.current = false
            setTimeout(() => editor.commands.focus(), 0)
        }
    }

    if (!isVisible) return null

    return (
        <div
            ref={containerRef}
            className={cn(
                "absolute flex items-center p-1 gap-0.5 bg-white rounded-lg shadow-xl border border-slate-200/80 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-150 z-50",
            )}
            style={{
                top: `${position.top}px`,
                left: `${position.left}px`,
                width: 'max-content'
            }}
            onMouseDown={(e) => e.stopPropagation()}
        >
            {/* 1. Writing Optimization (AI) Dropdown */}
            <DropdownMenu
                open={isOptimizationOpen}
                onOpenChange={handleOptimizationOpenChange}
                modal={false}
            >
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 gap-1 text-purple-600 hover:text-purple-700 hover:bg-purple-50 px-2 rounded">
                        <Wand2 className="w-4 h-4" />
                        <span className="text-sm font-medium">优化</span>
                        <ChevronDown className="w-3 h-3 opacity-50" />
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="start"
                    side="bottom"
                    className="w-56 p-1 z-[9999]"
                    sideOffset={8}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <WritingImprovementSubmenu
                        editor={editor}
                        onAction={handleQuickAIAction}
                        onOpenMore={() => {
                            setIsOptimizationOpen(false)
                            isOptimizationOpenRef.current = false
                            window.dispatchEvent(new CustomEvent('open-writing-assistant'))
                        }}
                    />
                </DropdownMenuContent>
            </DropdownMenu>

            {/* 2. AI Chat Button */}
            <Popover open={isAIChatOpen} onOpenChange={(open) => {
                if (open) {
                    setIsAIChatOpen(true)
                    isAIChatOpenRef.current = true
                    aiChatOpenedAtRef.current = Date.now()
                } else {
                    const timeSinceOpen = Date.now() - aiChatOpenedAtRef.current
                    if (timeSinceOpen < 300) {
                        console.log('[EditorBubbleMenu] Ignoring close request - too soon after open (AI Chat):', timeSinceOpen, 'ms')
                        setTimeout(() => {
                            setIsAIChatOpen(true)
                            isAIChatOpenRef.current = true
                        }, 0)
                        return
                    }
                    setIsAIChatOpen(false)
                    isAIChatOpenRef.current = false
                    setAiChatOutput('')
                    setAiChatInput('')
                }
            }}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        onMouseDown={handleTriggerMouseDown}
                        className={cn(
                            "h-8 w-8 p-0 rounded-md text-purple-600 hover:bg-purple-50 hover:text-purple-700 transition-colors mr-1",
                            isAIChatOpen ? "bg-purple-50" : ""
                        )}
                        aria-label="AI 对话"
                    >
                        <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-[420px] p-0 z-[9999] shadow-2xl border border-comp-divider bg-white rounded-xl ring-1 ring-black/5 overflow-hidden"
                    align="start"
                    side="bottom"
                    sideOffset={12}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    onOpenAutoFocus={(e) => e.preventDefault()}
                    onInteractOutside={(e) => {
                        // Prevent closing on outside interaction to stop "disappearing on click" issues
                        // User will explicitly close via "Cancel" or "X" button
                        e.preventDefault()
                    }}
                >
                    <div className="flex flex-col max-h-[600px]">
                        {/* 1. Header: "AI写作" + AI Icon */}
                        <div className="px-5 pt-5 pb-2 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 flex items-center justify-center">
                                    <Bot className="w-6 h-6 text-slate-800" />
                                </div>
                                <span className="text-xl font-semibold text-slate-800 tracking-tight">AI写作</span>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-slate-400 hover:text-slate-600 rounded-full"
                                onClick={() => {
                                    setIsAIChatOpen(false)
                                    isAIChatOpenRef.current = false
                                }}
                            >
                                <X className="w-5 h-5 text-icon-primary" />
                            </Button>
                        </div>

                        {/* 2. Content Area */}
                        <div className="px-5 pb-4 overflow-y-auto min-h-[50px] flex-1">
                            {!aiChatOutput && !isAiChatLoading && (
                                <div className="text-slate-500 text-[15px] leading-relaxed py-2 flex items-start gap-2">
                                    <span className="font-normal text-font-secondary whitespace-nowrap">要写点什么？告诉AI</span>
                                </div>
                            )}

                            {isAiChatLoading && (
                                <div className="flex items-center gap-2 py-4">
                                    <Sparkles className="w-5 h-5 text-purple-500 animate-pulse" />
                                    <span className="text-slate-500 text-sm">思考中...</span>
                                </div>
                            )}

                            {aiChatOutput && (
                                <div className="animate-in fade-in slide-in-from-bottom-2 duration-300 space-y-3">
                                    {/* Low Saturation Gradient Card */}
                                    <div className="bg-gradient-to-br from-purple-50/50 to-blue-50/50 rounded-lg p-3 border border-slate-100/50">
                                        <div className="text-slate-700 text-[15px] leading-relaxed whitespace-pre-wrap">
                                            {aiChatOutput}
                                        </div>
                                    </div>

                                    {/* Action Buttons Row */}
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="flex items-center gap-1.5 px-3 py-1.5 text-[14px] font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-50 rounded-md transition-all shadow-sm"
                                            onClick={() => {
                                                const newText = aiChatOutput;
                                                editor.chain().focus().insertContent(newText).run()
                                                streamTextToEditor(editor, newText)
                                                setIsAIChatOpen(false)
                                                isAIChatOpenRef.current = false
                                            }}
                                        >
                                            <Check className="w-4 h-4 text-purple-600" />
                                            <span>替换</span>
                                        </button>

                                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[14px] text-slate-600 hover:bg-slate-100 rounded-md transition-colors">
                                            <ArrowDownLeft className="w-4 h-4 text-icon-primary" />
                                            <span>插入</span>
                                        </button>

                                        <button className="flex items-center gap-1.5 px-3 py-1.5 text-[14px] text-slate-600 hover:bg-slate-100 rounded-md transition-colors"
                                            onClick={() => {
                                                setIsAiChatLoading(true)
                                                setAiChatOutput('')
                                                setTimeout(() => {
                                                    setAiChatOutput(`好的，我为您重新生成了一个版本：\n\n- **重点突出**：将核心诉求放在了第一段。\n- **结构优化**：使用了项目符号来增强可读性。\n\n这个版本您满意吗？`)
                                                    setIsAiChatLoading(false)
                                                }, 1000)
                                            }}
                                        >
                                            <RotateCw className="w-4 h-4 text-icon-primary" />
                                            <span>重写</span>
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Feedback icons removed as requested */}
                        </div>

                        {/* 3. Input Area */}
                        <div className="px-5 pb-3">
                            <div className="relative group">
                                <input
                                    type="text"
                                    value={aiChatInput}
                                    onChange={(e) => setAiChatInput(e.target.value)}
                                    // If we have output, displaying user input "in place" of prompt implies we might want to clear placeholder or show previous query.
                                    // For now, keeping placeholder logic consistent but allowing input.
                                    placeholder={aiChatOutput ? "告诉 AI 怎么写..." : "告诉 AI 怎么写..."}
                                    className="w-full h-[42px] px-4 text-[15px] text-slate-800 bg-white border border-slate-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 placeholder:text-slate-400 shadow-sm transition-all"
                                    onKeyDown={(e) => {
                                        // Ensure event doesn't bubble if it might be severe
                                        e.stopPropagation();
                                        if (e.key === 'Enter') {
                                            e.preventDefault()
                                            if (aiChatInput.trim()) {
                                                setIsAiChatLoading(true)
                                                setAiChatOutput('')
                                                setTimeout(() => {
                                                    setAiChatOutput(`以下是针对您要求的修改建议：\n\n- **语气调整**：使用了更加委婉和专业的措辞。\n- **内容精简**：删除了冗余的寒暄，直奔主题。\n\n您看这样修改是否符合您的预期？`)
                                                    setIsAiChatLoading(false)
                                                }, 1500)
                                            }
                                        }
                                    }}
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                                    <Button size="sm" variant="ghost" className="h-7 w-7 p-0 text-slate-400 hover:text-slate-600 rounded">
                                        <AtSign className="w-5 h-5 text-icon-primary" />
                                    </Button>
                                    <Button
                                        size="sm"
                                        variant="ghost"
                                        className={cn("h-7 w-7 p-0 rounded transition-colors", aiChatInput.trim() ? "text-purple-600 bg-purple-50" : "text-slate-300")}
                                        onClick={() => {
                                            if (aiChatInput.trim()) {
                                                setIsAiChatLoading(true)
                                                setAiChatOutput('')
                                                setTimeout(() => {
                                                    setAiChatOutput(`以下是针对您要求的修改建议：\n\n- **语气调整**：使用了更加委婉和专业的措辞。\n- **内容精简**：删除了冗余的寒暄，直奔主题。\n\n您看这样修改是否符合您的预期？`)
                                                    setIsAiChatLoading(false)
                                                }, 1500)
                                            }
                                        }}
                                    >
                                        <ArrowRight className="w-5 h-5 text-icon-primary" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </PopoverContent>
            </Popover>

            <div className="w-[1px] h-4 bg-comp-divider mx-1" />

            {/* 3. Font Size Dropdown */}
            <DropdownMenu
                open={isFontSizeOpen}
                onOpenChange={handleFontSizeOpenChange}
                modal={false}
            >
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm"
                        onMouseDown={handleTriggerMouseDown}
                        className="h-8 gap-1 px-2 rounded-md hover:bg-slate-100"
                    >
                        <span className="text-xs font-medium text-icon-primary">16px</span>
                        <ChevronDown className="w-3 h-3 text-icon-primary opacity-50" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="start"
                    className="min-w-[60px] z-[9999]"
                    sideOffset={8}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    {["12px", "14px", "16px", "18px", "24px", "30px"].map((size) => (
                        <DropdownMenuItem
                            key={size}
                            onClick={() => {
                                editor.chain().focus().setFontSize(size).run()
                                setIsFontSizeOpen(false)
                                isFontSizeOpenRef.current = false
                            }}
                            className="text-xs justify-center"
                        >
                            {size.replace('px', '')}
                        </DropdownMenuItem>
                    ))}
                </DropdownMenuContent>
            </DropdownMenu>

            <div className="w-[1px] h-4 bg-slate-200 mx-1" />

            {/* 4. Formatting Tools */}
            <BubbleButton
                icon={Bold}
                onClick={() => editor.chain().focus().toggleBold().run()}
                isActive={editor.isActive('bold')}
                iconClassName="text-icon-primary"
            />
            <BubbleButton
                icon={Italic}
                onClick={() => editor.chain().focus().toggleItalic().run()}
                isActive={editor.isActive('italic')}
                iconClassName="text-icon-primary"
            />
            <BubbleButton
                icon={Underline}
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                isActive={editor.isActive('underline')}
                iconClassName="text-icon-primary"
            />

            {/* 5. Colors */}
            <Popover open={isTextColorOpen} onOpenChange={(open) => {
                setIsTextColorOpen(open)
                isTextColorOpenRef.current = open
            }}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        onMouseDown={handleTriggerMouseDown}
                        className={cn(
                            "h-8 w-8 p-0 rounded-md hover:bg-slate-100 transition-all",
                            isTextColorOpen ? "bg-slate-100" : ""
                        )}
                        aria-label="文字颜色"
                    >
                        <Palette className="w-4 h-4 text-icon-primary" strokeWidth={1.5} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0 z-[9999]"
                    align="start"
                    sideOffset={8}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <ColorPicker
                        value={editor.getAttributes('textStyle').color || '#000000'}
                        onChange={(color) => editor.chain().focus().setColor(color).run()}
                        onChangeComplete={(color) => {
                            editor.chain().focus().setColor(color).run()
                            setIsTextColorOpen(false)
                            isTextColorOpenRef.current = false
                        }}
                        inline
                    />
                </PopoverContent>
            </Popover>

            <Popover open={isBgColorOpen} onOpenChange={(open) => {
                setIsBgColorOpen(open)
                isBgColorOpenRef.current = open
            }}>
                <PopoverTrigger asChild>
                    <Button
                        variant="ghost"
                        size="sm"
                        onMouseDown={handleTriggerMouseDown}
                        className={cn(
                            "h-8 w-8 p-0 rounded-md hover:bg-slate-100 transition-all",
                            isBgColorOpen ? "bg-slate-100" : ""
                        )}
                        aria-label="背景色"
                    >
                        <Highlighter className="w-4 h-4 text-icon-primary" strokeWidth={1.5} />
                    </Button>
                </PopoverTrigger>
                <PopoverContent
                    className="w-auto p-0 z-[9999]"
                    align="start"
                    sideOffset={8}
                    onCloseAutoFocus={(e) => e.preventDefault()}
                    onMouseDown={(e) => e.stopPropagation()}
                >
                    <ColorPicker
                        value={editor.getAttributes('highlight').color || '#FFFF00'}
                        onChange={(color) => editor.chain().focus().setHighlight({ color }).run()}
                        onChangeComplete={(color) => {
                            editor.chain().focus().setHighlight({ color }).run()
                            setIsBgColorOpen(false)
                            isBgColorOpenRef.current = false
                        }}
                        inline
                    />
                </PopoverContent>
            </Popover>

            {/* 6. Link with Divider */}
            <div className="w-[1px] h-4 bg-slate-200 mx-1" />

            <BubbleButton
                icon={Link}
                onClick={setLink}
                isActive={editor.isActive('link')}
                iconClassName="text-icon-primary"
            />

        </div>
    )
}

