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
    AArrowDown
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
                    "data-[state=open]:bg-[rgba(0,0,0,0.05)] data-[state=open]:text-brand",
                    active && "bg-[rgba(0,0,0,0.05)] text-brand",
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
const DropdownButtonTrigger = React.forwardRef<HTMLButtonElement, { icon?: React.ReactNode, label?: string, tooltip?: React.ReactNode, className?: string }>(
    ({ icon, label, tooltip, className, ...props }, ref) => {
        // Detect open state from Radix UI props
        const isMenuOpen = (props as any)["data-state"] === "open"

        const content = (
            <Button
                ref={ref}
                variant="ghost"
                className={cn(
                    "flex items-center gap-0.5 px-1 cursor-pointer hover:bg-[rgba(0,0,0,0.05)] rounded-lg h-10 select-none shrink-0 text-icon-primary",
                    "data-[state=open]:bg-[rgba(0,0,0,0.05)] data-[state=open]:text-brand",
                    label && "gap-1 px-1.5",
                    className
                )}
                {...props}
            >
                {icon && (
                    <div className="h-5 w-5 flex items-center justify-center">
                        {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { strokeWidth: 1.5 }) : icon}
                    </div>
                )}
                {label && <span className="text-sm font-medium whitespace-nowrap text-font-primary">{label}</span>}
                <ChevronDown className="h-4 w-4 text-icon-secondary" strokeWidth={1.5} />
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
    const [width, setWidth] = React.useState<number>(1728)

    // Selection States
    const [textType, setTextType] = React.useState("paragraph")
    const [fontFamily, setFontFamily] = React.useState("harmony")
    const [fontSize, setFontSize] = React.useState("16px")

    // Dropdown Exclusive State
    const [activeDropdown, setActiveDropdown] = React.useState<string | null>(null)

    const handleDropdownChange = (id: string) => (open: boolean) => {
        setActiveDropdown(open ? id : null)
    }

    React.useEffect(() => {
        if (debugWidth !== undefined) {
            setWidth(debugWidth)
            return
        }
        const el = containerRef.current
        if (!el) return
        const ro = new ResizeObserver((entries) => {
            for (const entry of entries) setWidth(entry.contentRect.width)
        })
        ro.observe(el)
        return () => ro.disconnect()
    }, [debugWidth])

    // --- RESPONSIVE LOGIC ---
    // User priority: Specific rules for Insert and Text sections.
    // Persistent Items: Undo/Redo, Format Painter, Colors, Fonts, B/I/U NEVER fold.

    // 🅰️ Insert Section (Right)
    // < 1550px: Minus, Smile -> Insert More
    // < 1500px: Link -> Insert More
    const insertCompactLevel1 = width < 1550
    const insertCompactLevel2 = width < 1500

    const hideMinus = insertCompactLevel1
    const hideSmile = insertCompactLevel1
    const hideLink = insertCompactLevel2

    // 🅱️ Text Section (Left/Center)
    // < 1480px: Code -> Text More
    // < 1450px: Search -> Text More
    // ...
    // < 1240px: Strikethrough -> Text More

    const textFoldLevel0 = width < 1480
    const textFoldLevel1 = width < 1450
    const textFoldLevel2 = width < 1420
    const textFoldLevel3 = width < 1390
    const textFoldLevel4 = width < 1360
    const textFoldLevel5 = width < 1330
    const textFoldLevel6 = width < 1300
    const textFoldLevel7 = width < 1270
    const textFoldLevel8 = width < 1240

    const hideCode = textFoldLevel0
    const hideSearch = textFoldLevel1
    const hideAlignJustify = textFoldLevel2
    const hideIndent = textFoldLevel3
    const hideList = textFoldLevel4
    const hideAlignLeft = textFoldLevel5
    const hideSub = textFoldLevel6
    const hideSup = textFoldLevel7
    const hideStrike = textFoldLevel8

    const showInsertMore = hideMinus || hideSmile || hideLink
    const showTextMore = hideCode || hideSearch || hideAlignJustify || hideIndent || hideList || hideAlignLeft || hideSub || hideSup || hideStrike

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
            <div className="flex items-center h-full w-full px-0 gap-1 no-scrollbar justify-start">
                {/* 1. LEFT SECTION (Text Tools) - Flexible & Foldable */}
                <div className="flex items-center gap-1 shrink overflow-hidden min-w-0">
                    {/* History */}
                    <div className="flex items-center gap-1 shrink-0">
                        <ToolbarButton icon={<Undo2 />} tooltip="后退 Ctrl+Z" disabled={!!activeDropdown} />
                        <ToolbarButton icon={<Redo2 />} tooltip="前进 Ctrl+Y" disabled={!!activeDropdown} />
                    </div>
                    <Divider />

                    {/* Format Painter */}
                    <div className="flex items-center gap-1 shrink-0">
                        <ToolbarButton icon={<Paintbrush />} tooltip="格式刷" disabled={!!activeDropdown} />
                        <ToolbarButton icon={<Eraser />} tooltip="清除格式" disabled={!!activeDropdown} />
                    </div>
                    <Divider />

                    {/* Font Settings Group */}
                    <div className="flex items-center gap-1 shrink-0">

                        {/* Text Type Dropdown */}
                        <DropdownMenu open={activeDropdown === 'textType'} onOpenChange={handleDropdownChange('textType')}>
                            <DropdownMenuTrigger asChild>
                                <DropdownButtonTrigger
                                    label={
                                        editor?.isActive('heading', { level: 1 }) ? "标题 1" :
                                            editor?.isActive('heading', { level: 2 }) ? "标题 2" :
                                                editor?.isActive('heading', { level: 3 }) ? "标题 3" : "正文"
                                    }
                                    tooltip="文本类型"
                                />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40" align="start">
                                <DropdownMenuItem onClick={() => editor?.chain().focus().setParagraph().run()}>
                                    正文
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-2xl font-bold"
                                    onClick={() => editor?.chain().focus().toggleHeading({ level: 1 }).run()}
                                >
                                    标题 1
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-xl font-bold"
                                    onClick={() => editor?.chain().focus().toggleHeading({ level: 2 }).run()}
                                >
                                    标题 2
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                    className="text-lg font-bold"
                                    onClick={() => editor?.chain().focus().toggleHeading({ level: 3 }).run()}
                                >
                                    标题 3
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Font Family Dropdown */}
                        <DropdownMenu open={activeDropdown === 'fontFamily'} onOpenChange={handleDropdownChange('fontFamily')}>
                            <DropdownMenuTrigger asChild>
                                <DropdownButtonTrigger label={fontFamily === "harmony" ? "鸿蒙黑体" : "其他字体"} tooltip="字体" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40" align="start">
                                <DropdownMenuRadioGroup value={fontFamily} onValueChange={setFontFamily}>
                                    <DropdownMenuRadioItem value="harmony">鸿蒙黑体</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="song">宋体</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="kai">楷体</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Font Size Dropdown */}
                        <DropdownMenu open={activeDropdown === 'fontSize'} onOpenChange={handleDropdownChange('fontSize')}>
                            <DropdownMenuTrigger asChild>
                                <DropdownButtonTrigger label={fontSize} tooltip="字号" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-32" align="start">
                                <DropdownMenuRadioGroup value={fontSize} onValueChange={setFontSize}>
                                    <DropdownMenuRadioItem value="12px">12px</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="14px">14px</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="16px">16px</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="18px">18px</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="24px">24px</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="36px">36px</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <ToolbarButton
                            icon={<AArrowUp className="w-6 h-6" strokeWidth={1.5} />}
                            className="w-10"
                            tooltip="增大字号 Ctrl+Shift+ >"
                            disabled={!!activeDropdown}
                            onClick={() => {
                                const val = parseInt(fontSize)
                                if (val < 100) setFontSize(`${val + 2}px`)
                            }}
                        />
                        <ToolbarButton
                            icon={<AArrowDown className="w-6 h-6" strokeWidth={1.5} />}
                            className="w-10"
                            tooltip="减小字号 Ctrl+Shift+ <"
                            disabled={!!activeDropdown}
                            onClick={() => {
                                const val = parseInt(fontSize)
                                if (val > 10) setFontSize(`${val - 2}px`)
                            }}
                        />
                    </div>
                    <Divider />

                    {/* Colors - Using standard ColorPicker */}
                    <div className="flex items-center gap-1 shrink-0">
                        <ColorPicker
                            onChangeComplete={(c) => console.log('Text Color:', c)}
                        >
                            <DropdownButtonTrigger icon={<Palette />} tooltip="文字颜色" />
                        </ColorPicker>

                        <ColorPicker
                            onChangeComplete={(c) => console.log('Bg Color:', c)}
                        >
                            <DropdownButtonTrigger icon={<Highlighter />} tooltip="文本背景色" />
                        </ColorPicker>
                    </div>
                    <Divider />

                    {/* Basic Formatting */}
                    <div className="flex items-center gap-1 shrink-0">
                        <ToolbarButton
                            icon={<Bold />}
                            tooltip="加粗 Ctrl+B"
                            disabled={!!activeDropdown}
                            active={editor?.isActive('bold')}
                            onClick={() => editor?.chain().focus().toggleBold().run()}
                        />
                        <ToolbarButton
                            icon={<Italic />}
                            tooltip="斜体 Ctrl+I"
                            disabled={!!activeDropdown}
                            active={editor?.isActive('italic')}
                            onClick={() => editor?.chain().focus().toggleItalic().run()}
                        />
                        <ToolbarButton
                            icon={<Underline />}
                            tooltip="下划线 Ctrl+U"
                            disabled={!!activeDropdown}
                            active={editor?.isActive('underline')}
                            onClick={() => editor?.chain().focus().toggleUnderline().run()}
                        />
                    </div>

                    {/* Advanced Formatting */}
                    {(!hideStrike || !hideSup || !hideSub) && (
                        <div className="flex items-center gap-1 shrink-0">
                            {!hideStrike && (
                                <ToolbarButton
                                    icon={<Strikethrough />}
                                    tooltip="删除线"
                                    disabled={!!activeDropdown}
                                    active={editor?.isActive('strike')}
                                    onClick={() => editor?.chain().focus().toggleStrike().run()}
                                />
                            )}
                            {!hideSup && <ToolbarButton icon={<Superscript />} tooltip="上标 Ctrl+Shift+" disabled={!!activeDropdown} />}
                            {!hideSub && <ToolbarButton icon={<Subscript />} tooltip="下标 Ctrl+=" disabled={!!activeDropdown} />}
                        </div>
                    )}

                    {/* Paragraph Settings */}
                    {(!hideAlignLeft || !hideList || !hideIndent || !hideAlignJustify) && (
                        <>
                            <Divider />
                            <div className="flex items-center gap-1 shrink-0">
                                {!hideAlignLeft && (
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
                                            <DropdownMenuItem>两端对齐</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                                {!hideList && (
                                    <DropdownMenu open={activeDropdown === 'list'} onOpenChange={handleDropdownChange('list')}>
                                        <DropdownMenuTrigger asChild>
                                            <DropdownButtonTrigger icon={<List />} tooltip="列表" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="start">
                                            <DropdownMenuItem>无序列表</DropdownMenuItem>
                                            <DropdownMenuItem>有序列表</DropdownMenuItem>
                                            <DropdownMenuItem>任务列表</DropdownMenuItem>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                                {!hideIndent && (
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
                                {!hideAlignJustify && (
                                    <DropdownMenu open={activeDropdown === 'alignJustify'} onOpenChange={handleDropdownChange('alignJustify')}>
                                        <DropdownMenuTrigger asChild>
                                            <DropdownButtonTrigger icon={<AlignJustify />} tooltip="段落间距" />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent className="w-32" align="start">
                                            <DropdownMenuRadioGroup value="1.5">
                                                <DropdownMenuRadioItem value="1.0">1.0</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="1.15">1.15</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="1.5">1.5</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="2.0">2.0</DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuContent>
                                    </DropdownMenu>
                                )}
                            </div>
                        </>
                    )}

                    {/* Search/Code */}
                    {(!hideSearch || !hideCode) && (
                        <>
                            <Divider />
                            <div className="flex items-center gap-1 shrink-0">
                                {!hideSearch && <ToolbarButton icon={<Search />} tooltip="查找替换 Ctrl+F" disabled={!!activeDropdown} />}
                                {!hideCode && <ToolbarButton icon={<Code />} tooltip="HTML代码编辑模式" disabled={!!activeDropdown} />}
                            </div>
                        </>
                    )}

                    {/* TEXT MORE BUTTON */}
                    {showTextMore && (
                        <DropdownMenu open={activeDropdown === 'more'} onOpenChange={handleDropdownChange('more')}>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[rgba(0,0,0,0.05)] transition-colors shrink-0 text-icon-primary data-[state=open]:bg-[rgba(0,0,0,0.05)] data-[state=open]:text-brand">
                                    <CircleEllipsis className="h-5 w-5" strokeWidth={1.5} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                                {hideStrike && <DropdownMenuItem><MenuIcon icon={Strikethrough} /> 删除线</DropdownMenuItem>}
                                {hideSup && <DropdownMenuItem><MenuIcon icon={Superscript} /> 上标</DropdownMenuItem>}
                                {hideSub && <DropdownMenuItem><MenuIcon icon={Subscript} /> 下标</DropdownMenuItem>}

                                {(hideStrike) && <div className="h-[1px] bg-border my-1" />}

                                {hideAlignLeft && (
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger><MenuIcon icon={AlignLeft} /> 对齐</DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuRadioGroup value="left">
                                                <DropdownMenuRadioItem value="left">左对齐</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="center">居中对齐</DropdownMenuRadioItem>
                                                <DropdownMenuRadioItem value="right">右对齐</DropdownMenuRadioItem>
                                            </DropdownMenuRadioGroup>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>
                                )}
                                {hideList && (
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger><MenuIcon icon={List} /> 列表</DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent>
                                            <DropdownMenuItem>无序列表</DropdownMenuItem>
                                            <DropdownMenuItem>有序列表</DropdownMenuItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>
                                )}
                                {hideIndent && <DropdownMenuItem><MenuIcon icon={Indent} /> 缩进</DropdownMenuItem>}
                                {hideAlignJustify && <DropdownMenuItem><MenuIcon icon={AlignJustify} /> 段落间距</DropdownMenuItem>}

                                {(hideAlignJustify && hideSearch) && <div className="h-[1px] bg-border my-1" />}

                                {hideSearch && <DropdownMenuItem><MenuIcon icon={Search} /> 搜索</DropdownMenuItem>}
                                {hideCode && <DropdownMenuItem><MenuIcon icon={Code} /> 代码</DropdownMenuItem>}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>

                {/* RIGHT SECTION - Insert Tools Flowing Directly */}
                <div className="flex items-center shrink-0 gap-1">
                    <Divider />
                    <WithTooltip content="插入图片" disabled={!!activeDropdown}>
                        <ToolbarButton icon={<ImageIcon />} />
                    </WithTooltip>

                    <WithTooltip content="插入表格" disabled={!!activeDropdown}>
                        <ToolbarButton icon={<TableIcon />} />
                    </WithTooltip>

                    {!hideLink && <ToolbarButton icon={<Link />} tooltip="添加超链接 Ctrl+K" disabled={!!activeDropdown} />}
                    {!hideSmile && <ToolbarButton icon={<Smile />} tooltip="添加表情符号" disabled={!!activeDropdown} />}
                    {!hideMinus && <ToolbarButton icon={<Minus />} tooltip="插入横线" disabled={!!activeDropdown} />}

                    {/* Insert More Button */}
                    {showInsertMore && (
                        <DropdownMenu open={activeDropdown === 'insertMore'} onOpenChange={handleDropdownChange('insertMore')}>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-[rgba(0,0,0,0.05)] transition-colors shrink-0 text-icon-primary data-[state=open]:bg-[rgba(0,0,0,0.05)] data-[state=open]:text-brand">
                                    <CircleEllipsis className="h-5 w-5" strokeWidth={1.5} />
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                {hideLink && <DropdownMenuItem><MenuIcon icon={Link} /> 链接</DropdownMenuItem>}
                                {hideSmile && <DropdownMenuItem><MenuIcon icon={Smile} /> 表情</DropdownMenuItem>}
                                {hideMinus && <DropdownMenuItem><MenuIcon icon={Minus} /> 分割线</DropdownMenuItem>}
                            </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                </div>
            </div>
        </div>
    )
}
