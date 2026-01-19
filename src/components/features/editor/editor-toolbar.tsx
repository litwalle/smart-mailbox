import * as React from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/Button"
import type { Editor } from "@tiptap/react"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu"
import { HoverTip } from "@/components/ui/hover-tip"

// Import existing ColorPicker
import { ColorPicker } from "@/components/ui/color-picker"

import {
    Undo2,
    Redo2,
    Paintbrush,
    Eraser,
    Bold,
    Italic,
    Underline,
    Strikethrough,
    Highlighter,
    Superscript,
    Subscript,
    AlignLeft,
    List,
    Indent,
    Image as ImageIcon,
    Table as TableIcon,
    Search,
    Code,
    Link,
    Smile,
    Minus,
    ChevronDown,
    Palette,
    AlignJustify,
    CircleEllipsis,
    LucideIcon,
    AArrowUp,
    AArrowDown,
    Type
} from "lucide-react"

export interface EditorToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
    debugWidth?: number
    editor?: Editor | null
}

// Helper for Tooltip wrapping (now using HoverTip)
const WithTooltip = ({ children, content, side = "bottom", disabled = false }: { children: React.ReactNode, content: React.ReactNode, side?: "top" | "bottom" | "left" | "right", disabled?: boolean }) => (
    <HoverTip content={content} side={side} align="center" disabled={disabled}>
        {children}
    </HoverTip>
)

const ToolbarButton = React.forwardRef<HTMLButtonElement, { icon: React.ReactNode, className?: string, active?: boolean, tooltip?: React.ReactNode, onClick?: () => void, disabled?: boolean }>(
    ({ icon, className, active, tooltip, disabled, ...props }, ref) => {
        const btn = (
            <Button
                ref={ref}
                variant="ghost"
                className={cn(
                    "w-10 h-10 p-0 rounded-lg hover:bg-[rgba(0,0,0,0.05)] transition-colors shrink-0 text-icon-primary",
                    "data-[state=open]:bg-[rgba(0,0,0,0.08)]",
                    // 选中状态：比hover深一点的背景色
                    active && "bg-[rgba(0,0,0,0.08)]",
                    className
                )}
                {...props}
            >
                {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, {
                    className: cn("w-5 h-5", (icon as React.ReactElement<any>).props.className),
                    strokeWidth: 1.5
                }) : icon}
            </Button>
        )

        if (tooltip) {
            return <WithTooltip content={tooltip} disabled={disabled}>{btn}</WithTooltip>
        }
        return btn
    }
)
ToolbarButton.displayName = "ToolbarButton"


// Reusable Trigger for Dropdowns
const DropdownButtonTrigger = React.forwardRef<HTMLButtonElement, { icon?: React.ReactNode, label?: string, tooltip?: React.ReactNode, className?: string, minWidth?: string }>(
    ({ icon, label, tooltip, className, minWidth, ...props }, ref) => {
        // Detect open state from Radix UI props
        const isMenuOpen = (props as any)["data-state"] === "open"

        const content = (
            <Button
                ref={ref}
                variant="ghost"
                className={cn(
                    "flex items-center justify-between px-2 cursor-pointer hover:bg-[rgba(0,0,0,0.05)] rounded-lg h-10 select-none shrink-0 text-icon-primary",
                    "data-[state=open]:bg-[rgba(0,0,0,0.08)]", // Slightly darker, no blue
                    className
                )}
                style={minWidth ? { width: minWidth, minWidth, maxWidth: minWidth } : undefined}
                {...props}
            >
                <div className="flex items-center gap-1">
                    {icon && (
                        <div className="h-5 w-5 flex items-center justify-center shrink-0">
                            {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { strokeWidth: 1.5 }) : icon}
                        </div>
                    )}
                    {label && <span className="text-sm font-medium whitespace-nowrap text-font-primary truncate text-left">{label}</span>}
                </div>
                <ChevronDown className="h-4 w-4 text-icon-secondary shrink-0 ml-1" strokeWidth={1.5} />
            </Button>
        )

        if (tooltip) {
            return <WithTooltip content={tooltip} disabled={isMenuOpen}>{content}</WithTooltip>
        }
        return content
    }
)
DropdownButtonTrigger.displayName = "DropdownButtonTrigger"


const Divider = ({ className }: { className?: string }) => (
    <div className={cn("h-5 w-[1px] bg-comp-divider mx-1.5 shrink-0", className)} />
)

// Helper to render icon in menu with consistent style
const MenuIcon = ({ icon: Icon }: { icon: LucideIcon }) => <Icon className="mr-2 h-4 w-4" strokeWidth={1.5} />


export function EditorToolbar({ className, debugWidth, editor, ...props }: EditorToolbarProps) {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [width, setWidth] = React.useState<number>(0)
    const [initialized, setInitialized] = React.useState(false)

    // Selection States
    const [textType, setTextType] = React.useState("paragraph")
    const [fontFamily, setFontFamily] = React.useState("harmony")
    const [fontSize, setFontSize] = React.useState("16px")

    // Dropdown Exclusive State
    const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null)

    // 强制更新状态，用于在编辑器状态改变时触发重新渲染
    const [, forceUpdate] = React.useReducer(x => x + 1, 0)

    const handleDropdownChange = (id: string) => (open: boolean) => {
        setActiveDropdown(open ? id : null)
    }

    // 监听编辑器的选择和事务变化，确保格式按钮状态正确更新
    React.useEffect(() => {
        if (!editor) return

        const handleUpdate = () => {
            forceUpdate()
        }

        // 监听编辑器的选择变化和事务
        editor.on('selectionUpdate', handleUpdate)
        editor.on('transaction', handleUpdate)

        return () => {
            editor.off('selectionUpdate', handleUpdate)
            editor.off('transaction', handleUpdate)
        }
    }, [editor])

    React.useEffect(() => {
        if (debugWidth !== undefined) {
            setWidth(debugWidth)
            setInitialized(true)
            return
        }
        const el = containerRef.current
        if (!el) return
        const ro = new ResizeObserver((entries) => {
            for (const entry of entries) {
                setWidth(entry.contentRect.width)
                setInitialized(true)
            }
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [debugWidth])

    // --- RESPONSIVE LOGIC (Width Budget Algorithm) ---

    // 1. Define Width Constants (精确测量值)
    // 单个图标按钮: 40px，按钮之间的间距: 4px
    // 分隔线: 1px宽度 + mx-1.5(左右各6px) = 13px
    const BTN = 40       // 单个图标按钮宽度
    const GAP = 4        // 按钮间距
    const DIV = 13       // 分隔线宽度（1px + 12px margin）
    const TEXT_MORE_BTN = 40
    const INSERT_MORE_BTN = 40

    // Text Groups (High Priority)
    // 每个组的宽度 = 组件宽度 + 组内间距 + 组尾分隔线（如有）
    const TEXT_GROUPS = [
        { id: 'history', width: BTN + GAP + BTN + GAP + DIV },        // 撤销(40)+重做(40)+分隔线 = 101
        { id: 'painter', width: BTN + GAP + BTN + GAP + DIV },        // 格式刷(40)+清除(40)+分隔线 = 101
        { id: 'textType', width: 88 + GAP },                           // 正文下拉(88) = 92
        { id: 'fontFamily', width: 100 + GAP },                        // 字体下拉(100) = 104
        { id: 'fontSize', width: 80 + GAP + BTN + GAP + BTN + GAP + DIV }, // 字号下拉(80)+增大(40)+减小(40)+分隔线 = 181
        { id: 'colors', width: 64 + GAP + 64 + GAP + DIV },           // 字体颜色(64)+背景颜色(64)+分隔线 = 149
        { id: 'basic', width: BTN + GAP + BTN + GAP + BTN + GAP },    // 粗体+斜体+下划线(40*3) = 132
        { id: 'advanced', width: BTN + GAP + BTN + GAP + BTN + GAP + DIV }, // 删除线+上标+下标+分隔线 = 145
        { id: 'align', width: BTN + GAP },                             // 对齐下拉(40) = 44
        { id: 'list', width: BTN + GAP },                              // 列表下拉(40) = 44
        { id: 'indent', width: BTN + GAP },                            // 缩进下拉(40) = 44
        { id: 'lineHeight', width: BTN + GAP + DIV },                  // 行高下拉(40)+分隔线 = 57
        { id: 'utils', width: BTN + GAP + BTN }                        // 查找(40)+代码(40) = 84
    ]

    // Insert Items (Low Priority)
    // Always Visible: Image, Table (最小展示保证)
    // Collapsible: Link, Smile, Minus
    const INSERT_FIXED_WIDTH = DIV + BTN + GAP + BTN  // 分隔线 + 图片(40) + 表格(40) = 97
    const INSERT_VARIABLES = [
        { id: 'link', width: BTN + GAP },   // 链接(40) = 44
        { id: 'smile', width: BTN + GAP },  // 表情(40) = 44
        { id: 'minus', width: BTN }         // 分割线(40) = 40
    ]

    // 2. Calculate Visibility State
    const { visibleTextIds, visibleInsertIds, showTextMore, showInsertMore } = React.useMemo(() => {
        const result = {
            visibleTextIds: new Set<string>(),
            visibleInsertIds: new Set<string>(),
            showTextMore: false,
            showInsertMore: false
        }

        // 如果宽度为0或未初始化，返回最小展示状态
        if (width <= 0) {
            result.showTextMore = true
            result.showInsertMore = true
            return result
        }

        // Available width for content (减去左右padding)
        const available = width - 16

        // 计算各部分所需总宽度
        const textFullWidth = TEXT_GROUPS.reduce((acc, g) => acc + g.width, 0)
        const insertVarFullWidth = INSERT_VARIABLES.reduce((acc, i) => acc + i.width, 0)

        // ====================================================
        // 核心逻辑：始终保证插入区域最小展示（图片 + 表格）
        // ====================================================

        // 插入区域的最小宽度 = 分隔线 + 图片 + 表格 + 更多按钮
        // 注意：当有任何插入项被折叠时，需要显示"更多"按钮
        const insertMinWithMore = DIV + INSERT_FIXED_WIDTH + INSERT_MORE_BTN
        const insertMinWithoutMore = DIV + INSERT_FIXED_WIDTH
        const insertFullWidth = DIV + INSERT_FIXED_WIDTH + insertVarFullWidth

        // --- Pass 1: 能否放下所有功能？---
        if (available >= textFullWidth + insertFullWidth) {
            TEXT_GROUPS.forEach(g => result.visibleTextIds.add(g.id))
            INSERT_VARIABLES.forEach(i => result.visibleInsertIds.add(i.id))
            result.showTextMore = false
            result.showInsertMore = false
            return result
        }

        // --- Pass 2: 能否放下所有文本 + 部分/无插入可变项？---
        // 预留插入区域最小宽度（含更多按钮）
        const spaceAfterInsertMin = available - insertMinWithMore

        if (spaceAfterInsertMin >= textFullWidth) {
            // 可以放下所有文本，插入区域折叠部分功能
            TEXT_GROUPS.forEach(g => result.visibleTextIds.add(g.id))
            result.showTextMore = false
            result.showInsertMore = true

            // 计算剩余空间可以放多少插入可变项
            let remainingForInsert = spaceAfterInsertMin - textFullWidth
            for (const item of INSERT_VARIABLES) {
                if (remainingForInsert >= item.width) {
                    result.visibleInsertIds.add(item.id)
                    remainingForInsert -= item.width
                } else {
                    break
                }
            }

            // 如果所有插入可变项都能显示，就不需要"更多"按钮
            if (result.visibleInsertIds.size === INSERT_VARIABLES.length) {
                result.showInsertMore = false
            }

            return result
        }

        // --- Pass 3: 文本区域也需要折叠 ---
        // 插入区域保持最小状态，文本区域折叠部分功能
        result.showInsertMore = true
        result.showTextMore = true

        // 可用于文本的空间 = 总宽度 - 插入最小宽度 - 文本更多按钮
        let spaceForText = available - insertMinWithMore - TEXT_MORE_BTN

        for (const group of TEXT_GROUPS) {
            if (spaceForText >= group.width) {
                result.visibleTextIds.add(group.id)
                spaceForText -= group.width
            } else {
                break
            }
        }

        return result

    }, [width])

    // Helper to check visibility
    const showText = (id: string) => visibleTextIds.has(id)
    const showInsert = (id: string) => visibleInsertIds.has(id)

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative flex items-center transition-all duration-300 border-b border-comp-divider bg-background-primary overflow-hidden",
                className
            )}
            style={{
                width: debugWidth ? `${debugWidth}px` : "100%",
                height: "48px",
                maxWidth: "100%"
            }}
            {...props}
        >
            {/* 等待初始化完成后再渲染工具栏内容 */}
            {!initialized ? (
                <div className="flex items-center h-full w-full px-2 gap-0">
                    {/* 占位符，等待尺寸计算 */}
                </div>
            ) : (
                <div className="flex items-center h-full w-full px-2 gap-0 no-scrollbar justify-start">

                    {/* --- SEZIONE 1: TEXT TOOLS (Left) --- */}
                    {/* 文本工具区域使用 flex-shrink 允许收缩，min-w-0 阻止溢出 */}
                    <div className="flex items-center shrink min-w-0">

                        {/* Group: History */}
                        {showText('history') && (
                            <div className="flex items-center gap-1">
                                <ToolbarButton icon={<Undo2 />} tooltip="后退 Ctrl+Z" disabled={!!activeDropdown} onClick={() => editor?.chain().focus().undo().run()} />
                                <ToolbarButton icon={<Redo2 />} tooltip="前进 Ctrl+Y" disabled={!!activeDropdown} onClick={() => editor?.chain().focus().redo().run()} />
                                <Divider />
                            </div>
                        )}

                        {/* Group: Painter */}
                        {showText('painter') && (
                            <div className="flex items-center gap-1">
                                <ToolbarButton icon={<Paintbrush />} tooltip="格式刷" disabled={!!activeDropdown} />
                                <ToolbarButton icon={<Eraser />} tooltip="清除格式" disabled={!!activeDropdown} onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()} />
                                <Divider />
                            </div>
                        )}

                        {/* Group: TextType */}
                        {showText('textType') && (
                            <DropdownMenu open={activeDropdown === 'textType'} onOpenChange={handleDropdownChange('textType')}>
                                <DropdownMenuTrigger asChild>
                                    <DropdownButtonTrigger
                                        minWidth="88px"
                                        label={editor?.isActive('heading', { level: 1 }) ? "标题 1" : editor?.isActive('heading', { level: 2 }) ? "标题 2" : editor?.isActive('heading', { level: 3 }) ? "标题 3" : "正文"}
                                        tooltip="文本类型"
                                    />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-40" align="start">
                                    <DropdownMenuItem onClick={() => editor?.chain().focus().setParagraph().run()}>正文</DropdownMenuItem>
                                    <DropdownMenuItem className="text-2xl font-bold" onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>标题 1</DropdownMenuItem>
                                    <DropdownMenuItem className="text-xl font-bold" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>标题 2</DropdownMenuItem>
                                    <DropdownMenuItem className="text-lg font-bold" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>标题 3</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {/* Group: FontFamily */}
                        {showText('fontFamily') && (
                            <DropdownMenu open={activeDropdown === 'fontFamily'} onOpenChange={handleDropdownChange('fontFamily')}>
                                <DropdownMenuTrigger asChild>
                                    <DropdownButtonTrigger minWidth="100px" label={fontFamily === "harmony" ? "鸿蒙黑体" : fontFamily === "song" ? "宋体" : fontFamily === "kai" ? "楷体" : "默认"} tooltip="字体" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className="w-40" align="start">
                                    <DropdownMenuItem onClick={() => { setFontFamily("harmony"); editor?.chain().focus().setFontFamily("HarmonyOS Sans SC, sans-serif").run() }}>鸿蒙黑体</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setFontFamily("song"); editor?.chain().focus().setFontFamily("SimSun, serif").run() }}>宋体</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => { setFontFamily("kai"); editor?.chain().focus().setFontFamily("KaiTi, cursive").run() }}>楷体</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                        {/* Group: FontSize */}
                        {showText('fontSize') && (
                            <div className="flex items-center gap-1">
                                <DropdownMenu open={activeDropdown === 'fontSize'} onOpenChange={handleDropdownChange('fontSize')}>
                                    <DropdownMenuTrigger asChild>
                                        <DropdownButtonTrigger minWidth="80px" label={fontSize} tooltip="字号" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-32" align="start">
                                        {["12px", "14px", "16px", "18px", "24px", "36px"].map((size) => (
                                            <DropdownMenuItem key={size} onClick={() => { setFontSize(size); editor?.chain().focus().setFontSize(size).run() }}>{size}</DropdownMenuItem>
                                        ))}
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <ToolbarButton icon={<AArrowUp className="w-6 h-6" strokeWidth={1.5} />} className="w-10" tooltip="增大" onClick={() => { const val = parseInt(fontSize); const newSize = val < 100 ? `${val + 2}px` : fontSize; setFontSize(newSize); editor?.chain().focus().setFontSize(newSize).run() }} />
                                <ToolbarButton icon={<AArrowDown className="w-6 h-6" strokeWidth={1.5} />} className="w-10" tooltip="减小" onClick={() => { const val = parseInt(fontSize); const newSize = val > 10 ? `${val - 2}px` : fontSize; setFontSize(newSize); editor?.chain().focus().setFontSize(newSize).run() }} />
                                <Divider />
                            </div>
                        )}

                        {/* Group: Colors */}
                        {showText('colors') && (
                            <div className="flex items-center gap-1">
                                <ColorPicker onChangeComplete={(c) => editor?.chain().focus().setColor(c).run()}>
                                    <DropdownButtonTrigger icon={<Palette />} tooltip="文字颜色" />
                                </ColorPicker>
                                <ColorPicker onChangeComplete={(c) => editor?.chain().focus().toggleHighlight({ color: c }).run()}>
                                    <DropdownButtonTrigger icon={<Highlighter />} tooltip="文本背景色" />
                                </ColorPicker>
                                <Divider />
                            </div>
                        )}

                        {/* Group: Basic (Bold/Italic/Underline) */}
                        {showText('basic') && (
                            <div className="flex items-center gap-1">
                                <ToolbarButton icon={<Bold />} tooltip="加粗" active={editor?.isActive('bold')} onClick={() => editor?.chain().focus().toggleBold().run()} />
                                <ToolbarButton icon={<Italic />} tooltip="斜体" active={editor?.isActive('italic')} onClick={() => editor?.chain().focus().toggleItalic().run()} />
                                <ToolbarButton icon={<Underline />} tooltip="下划线" active={editor?.isActive('underline')} onClick={() => editor?.chain().focus().toggleUnderline().run()} />
                            </div>
                        )}

                        {/* Group: Advanced */}
                        {showText('advanced') && (
                            <div className="flex items-center gap-1">
                                <ToolbarButton icon={<Strikethrough />} tooltip="删除线" active={editor?.isActive('strike')} onClick={() => editor?.chain().focus().toggleStrike().run()} />
                                <ToolbarButton icon={<Superscript />} tooltip="上标" onClick={() => { }} />
                                <ToolbarButton icon={<Subscript />} tooltip="下标" onClick={() => { }} />
                            </div>
                        )}

                        {/* Group: Align */}
                        {showText('align') && (
                            <div className="flex items-center gap-1 pl-1">
                                <Divider />
                                <DropdownMenu open={activeDropdown === 'alignLeft'} onOpenChange={handleDropdownChange('alignLeft')}>
                                    <DropdownMenuTrigger asChild>
                                        <DropdownButtonTrigger icon={<AlignLeft />} tooltip="对齐方式" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="start">
                                        <DropdownMenuLabel>对齐方式</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem>左对齐</DropdownMenuItem>
                                        <DropdownMenuItem>居中对齐</DropdownMenuItem>
                                        <DropdownMenuItem>右对齐</DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        )}
                        {showText('list') && (
                            <DropdownMenu open={activeDropdown === 'list'} onOpenChange={handleDropdownChange('list')}>
                                <DropdownMenuTrigger asChild>
                                    <DropdownButtonTrigger icon={<List />} tooltip="列表" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem onClick={() => editor?.chain().focus().toggleBulletList().run()}>无序列表</DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => editor?.chain().focus().toggleOrderedList().run()}>有序列表</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                        {showText('indent') && (
                            <DropdownMenu open={activeDropdown === 'indent'} onOpenChange={handleDropdownChange('indent')}>
                                <DropdownMenuTrigger asChild>
                                    <DropdownButtonTrigger icon={<Indent />} tooltip="缩进" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start">
                                    <DropdownMenuItem>增加缩进</DropdownMenuItem>
                                    <DropdownMenuItem>减少缩进</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                        {showText('lineHeight') && (
                            <div className="flex items-center gap-1">
                                <DropdownMenu open={activeDropdown === 'alignJustify'} onOpenChange={handleDropdownChange('alignJustify')}>
                                    <DropdownMenuTrigger asChild>
                                        <DropdownButtonTrigger icon={<AlignJustify />} tooltip="段落间距" />
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-32" align="start">
                                        <DropdownMenuRadioGroup value="1.5">
                                            <DropdownMenuRadioItem value="1.0">1.0</DropdownMenuRadioItem>
                                            <DropdownMenuRadioItem value="1.5">1.5</DropdownMenuRadioItem>
                                        </DropdownMenuRadioGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                                <Divider />
                            </div>
                        )}

                        {/* Group: Utils */}
                        {showText('utils') && (
                            <div className="flex items-center gap-1">
                                <ToolbarButton icon={<Search />} tooltip="查找替换" />
                                <ToolbarButton icon={<Code />} tooltip="代码模式" />
                            </div>
                        )}

                        {/* Text More Button */}
                        {showTextMore && (
                            <DropdownMenu open={activeDropdown === 'more'} onOpenChange={handleDropdownChange('more')}>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[rgba(0,0,0,0.05)] transition-colors shrink-0 text-icon-primary data-[state=open]:bg-[rgba(0,0,0,0.05)] data-[state=open]:text-brand">
                                        <CircleEllipsis className="h-5 w-5" strokeWidth={1.5} />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-[200px] max-h-[400px] overflow-y-auto">
                                    {/* 按照展开顺序的逆序显示（先显示高优先级被折叠的功能） */}

                                    {/* history - 撤销/重做 */}
                                    {!showText('history') && (
                                        <>
                                            <DropdownMenuItem onClick={() => editor?.chain().focus().undo().run()}><MenuIcon icon={Undo2} /> 撤销</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => editor?.chain().focus().redo().run()}><MenuIcon icon={Redo2} /> 重做</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                        </>
                                    )}

                                    {/* painter - 格式刷/清除格式 */}
                                    {!showText('painter') && (
                                        <>
                                            <DropdownMenuItem><MenuIcon icon={Paintbrush} /> 格式刷</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => editor?.chain().focus().unsetAllMarks().clearNodes().run()}><MenuIcon icon={Eraser} /> 清除格式</DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                        </>
                                    )}

                                    {/* textType - 段落样式（级联菜单） */}
                                    {!showText('textType') && (
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger><MenuIcon icon={AlignLeft} /> 段落样式</DropdownMenuSubTrigger>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem onClick={() => editor?.chain().focus().setParagraph().run()}>正文</DropdownMenuItem>
                                                <DropdownMenuItem className="text-2xl font-bold" onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}>标题 1</DropdownMenuItem>
                                                <DropdownMenuItem className="text-xl font-bold" onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}>标题 2</DropdownMenuItem>
                                                <DropdownMenuItem className="text-lg font-bold" onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}>标题 3</DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuSub>
                                    )}

                                    {/* fontFamily - 字体（级联菜单） */}
                                    {!showText('fontFamily') && (
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger><MenuIcon icon={AlignJustify} /> 字体</DropdownMenuSubTrigger>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem onClick={() => editor?.chain().focus().setFontFamily("HarmonyOS Sans SC, sans-serif").run()}>鸿蒙黑体</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => editor?.chain().focus().setFontFamily("SimSun, serif").run()}>宋体</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => editor?.chain().focus().setFontFamily("KaiTi, cursive").run()}>楷体</DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuSub>
                                    )}

                                    {/* fontSize - 字号（级联菜单），使用 Type 图标表示字号 */}
                                    {!showText('fontSize') && (
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger><MenuIcon icon={Type} /> 字号</DropdownMenuSubTrigger>
                                            <DropdownMenuSubContent>
                                                {["12px", "14px", "16px", "18px", "24px", "36px"].map((size) => (
                                                    <DropdownMenuItem key={size} onClick={() => editor?.chain().focus().setFontSize(size).run()}>{size}</DropdownMenuItem>
                                                ))}
                                            </DropdownMenuSubContent>
                                        </DropdownMenuSub>
                                    )}

                                    {(!showText('textType') || !showText('fontFamily') || !showText('fontSize')) && <DropdownMenuSeparator />}

                                    {/* colors - 颜色（使用级联菜单样式） */}
                                    {!showText('colors') && (
                                        <>
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger><MenuIcon icon={Palette} /> 字体颜色</DropdownMenuSubTrigger>
                                                <DropdownMenuSubContent className="p-0">
                                                    <ColorPicker
                                                        inline
                                                        onChangeComplete={(c) => editor?.chain().focus().setColor(c).run()}
                                                    />
                                                </DropdownMenuSubContent>
                                            </DropdownMenuSub>
                                            <DropdownMenuSub>
                                                <DropdownMenuSubTrigger><MenuIcon icon={Highlighter} /> 背景颜色</DropdownMenuSubTrigger>
                                                <DropdownMenuSubContent className="p-0">
                                                    <ColorPicker
                                                        inline
                                                        onChangeComplete={(c) => editor?.chain().focus().toggleHighlight({ color: c }).run()}
                                                    />
                                                </DropdownMenuSubContent>
                                            </DropdownMenuSub>
                                            <DropdownMenuSeparator />
                                        </>
                                    )}

                                    {/* basic - 粗体/斜体/下划线 */}
                                    {!showText('basic') && (
                                        <>
                                            <DropdownMenuItem onClick={() => editor?.chain().focus().toggleBold().run()}><MenuIcon icon={Bold} /> 加粗</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => editor?.chain().focus().toggleItalic().run()}><MenuIcon icon={Italic} /> 斜体</DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => editor?.chain().focus().toggleUnderline().run()}><MenuIcon icon={Underline} /> 下划线</DropdownMenuItem>
                                        </>
                                    )}

                                    {/* advanced - 删除线/上标/下标 */}
                                    {!showText('advanced') && (
                                        <>
                                            <DropdownMenuItem onClick={() => editor?.chain().focus().toggleStrike().run()}><MenuIcon icon={Strikethrough} /> 删除线</DropdownMenuItem>
                                            <DropdownMenuItem><MenuIcon icon={Superscript} /> 上标</DropdownMenuItem>
                                            <DropdownMenuItem><MenuIcon icon={Subscript} /> 下标</DropdownMenuItem>
                                        </>
                                    )}

                                    {(!showText('basic') || !showText('advanced')) && <DropdownMenuSeparator />}

                                    {/* align - 对齐方式（级联菜单） */}
                                    {!showText('align') && (
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger><MenuIcon icon={AlignLeft} /> 对齐方式</DropdownMenuSubTrigger>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem>左对齐</DropdownMenuItem>
                                                <DropdownMenuItem>居中对齐</DropdownMenuItem>
                                                <DropdownMenuItem>右对齐</DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuSub>
                                    )}

                                    {/* list - 列表（级联菜单） */}
                                    {!showText('list') && (
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger><MenuIcon icon={List} /> 列表</DropdownMenuSubTrigger>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem onClick={() => editor?.chain().focus().toggleBulletList().run()}>无序列表</DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => editor?.chain().focus().toggleOrderedList().run()}>有序列表</DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuSub>
                                    )}

                                    {/* indent - 缩进（级联菜单） */}
                                    {!showText('indent') && (
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger><MenuIcon icon={Indent} /> 缩进</DropdownMenuSubTrigger>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem>增加缩进</DropdownMenuItem>
                                                <DropdownMenuItem>减少缩进</DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuSub>
                                    )}

                                    {/* lineHeight - 段落间距（级联菜单） */}
                                    {!showText('lineHeight') && (
                                        <DropdownMenuSub>
                                            <DropdownMenuSubTrigger><MenuIcon icon={AlignJustify} /> 段落间距</DropdownMenuSubTrigger>
                                            <DropdownMenuSubContent>
                                                <DropdownMenuItem>1.0</DropdownMenuItem>
                                                <DropdownMenuItem>1.5</DropdownMenuItem>
                                                <DropdownMenuItem>2.0</DropdownMenuItem>
                                            </DropdownMenuSubContent>
                                        </DropdownMenuSub>
                                    )}

                                    {(!showText('align') || !showText('list') || !showText('indent') || !showText('lineHeight')) && <DropdownMenuSeparator />}

                                    {/* utils - 查找替换/代码模式 */}
                                    {!showText('utils') && (
                                        <>
                                            <DropdownMenuItem><MenuIcon icon={Search} /> 查找替换</DropdownMenuItem>
                                            <DropdownMenuItem><MenuIcon icon={Code} /> 代码模式</DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}
                    </div>

                    {/* --- SEZIONE 2: INSERT TOOLS (Right) --- */}
                    {/* 插入工具区域紧跟文本区域，保持最小展示 */}
                    <div className="flex items-center shrink-0">
                        <Divider />

                        {/* Always Visible Items */}
                        <WithTooltip content="插入图片" disabled={!!activeDropdown}>
                            <ToolbarButton icon={<ImageIcon />} onClick={() => { const url = window.prompt("请输入图片 URL"); if (url) editor?.chain().focus().setImage({ src: url }).run() }} />
                        </WithTooltip>
                        <WithTooltip content="插入表格" disabled={!!activeDropdown}>
                            <ToolbarButton icon={<TableIcon />} onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} />
                        </WithTooltip>

                        {/* Variable Items */}
                        {showInsert('link') && (
                            <ToolbarButton icon={<Link />} tooltip="添加超链接" active={editor?.isActive('link')} onClick={() => { }} />
                        )}
                        {showInsert('smile') && <ToolbarButton icon={<Smile />} tooltip="添加表情符号" />}
                        {showInsert('minus') && <ToolbarButton icon={<Minus />} tooltip="插入横线" onClick={() => editor?.chain().focus().setHorizontalRule().run()} />}

                        {/* Insert More Button */}
                        {showInsertMore && (
                            <DropdownMenu open={activeDropdown === 'insertMore'} onOpenChange={handleDropdownChange('insertMore')}>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[rgba(0,0,0,0.05)] transition-colors shrink-0 text-icon-primary data-[state=open]:bg-[rgba(0,0,0,0.05)] data-[state=open]:text-brand">
                                        <CircleEllipsis className="h-5 w-5" strokeWidth={1.5} />
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    {!showInsert('link') && <DropdownMenuItem><MenuIcon icon={Link} /> 链接</DropdownMenuItem>}
                                    {!showInsert('smile') && <DropdownMenuItem><MenuIcon icon={Smile} /> 表情</DropdownMenuItem>}
                                    {!showInsert('minus') && <DropdownMenuItem><MenuIcon icon={Minus} /> 分割线</DropdownMenuItem>}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )}

                    </div>
                </div>
            )}
        </div>
    )
}
