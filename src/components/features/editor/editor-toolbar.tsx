"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

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
} from "lucide-react"

export interface EditorToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
    debugWidth?: number
}

// Helper for Tooltip wrapping (now using HoverTip)
const WithTooltip = ({ children, content, side = "bottom" }: { children: React.ReactNode, content: React.ReactNode, side?: "top" | "bottom" | "left" | "right" }) => (
    <HoverTip content={content} side={side} align="center">
        {children}
    </HoverTip>
)

const ToolbarButton = React.forwardRef<HTMLButtonElement, { icon: React.ReactNode, className?: string, active?: boolean, tooltip?: React.ReactNode, onClick?: () => void }>(
    ({ icon, className, active, tooltip, ...props }, ref) => {
        const btn = (
            <button
                ref={ref}
                className={cn(
                    "flex items-center justify-center w-8 h-8 rounded hover:bg-comp-background-gray transition-colors shrink-0 text-icon-primary",
                    // Active state scaling and color
                    "data-[state=open]:bg-comp-background-gray data-[state=open]:text-brand",
                    active && "bg-comp-background-gray text-brand",
                    className
                )}
                {...props}
            >
                {React.isValidElement(icon) ? React.cloneElement(icon as React.ReactElement<any>, { className: "w-5 h-5", strokeWidth: 1.5 }) : icon}
            </button>
        )

        if (tooltip) {
            return <WithTooltip content={tooltip}>{btn}</WithTooltip>
        }
        return btn
    }
)
ToolbarButton.displayName = "ToolbarButton"


// Reusable Trigger for Dropdowns
const DropdownButtonTrigger = React.forwardRef<HTMLDivElement, { icon?: React.ReactNode, label?: string, tooltip?: React.ReactNode, className?: string }>(
    ({ icon, label, tooltip, className, ...props }, ref) => {
        const content = (
            <div
                ref={ref}
                className={cn(
                    "flex items-center gap-0.5 px-1 cursor-pointer hover:bg-comp-background-gray rounded h-8 select-none shrink-0 text-icon-primary",
                    // Active state scaling and color
                    "data-[state=open]:bg-comp-background-gray data-[state=open]:text-brand",
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
                <ChevronDown className="h-3 w-3 text-icon-tertiary opacity-70" strokeWidth={1.5} />
            </div>
        )

        if (tooltip) {
            return <WithTooltip content={tooltip}>{content}</WithTooltip>
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


export function EditorToolbar({ className, debugWidth, ...props }: EditorToolbarProps) {
    const containerRef = React.useRef<HTMLDivElement>(null)
    const [width, setWidth] = React.useState<number>(1728)

    // Selection States
    const [textType, setTextType] = React.useState("paragraph")
    const [fontFamily, setFontFamily] = React.useState("harmony")
    const [fontSize, setFontSize] = React.useState("16px")

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
    const insertCompactLevel1 = width < 1350
    const insertCompactLevel2 = width < 1300

    const hideMinus = insertCompactLevel1
    const hideSmile = insertCompactLevel1
    const hideLink = insertCompactLevel2

    const textFoldLevel1 = width < 1180
    const textFoldLevel2 = width < 1150
    const textFoldLevel3 = width < 1120
    const textFoldLevel4 = width < 1090
    const textFoldLevel5 = width < 1060
    const textFoldLevel6 = width < 1030
    const textFoldLevel7 = width < 1000
    const textFoldLevel8 = width < 970

    const hideCode = textFoldLevel1
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
                "relative flex items-center rounded-lg overflow-hidden bg-background-primary transition-all duration-300",
                className
            )}
            style={{
                width: debugWidth ? `${debugWidth}px` : "100%",
                height: "56px",
                maxWidth: "100%"
            }}
            {...props}
        >
            <div className="flex items-center h-full flex-1 w-0 pr-4 gap-1 overflow-x-auto no-scrollbar">
                {/* 1. LEFT SECTION */}
                <div className="flex items-center shrink-0 gap-1">
                    {/* History */}
                    <div className="flex items-center gap-1">
                        <ToolbarButton icon={<Undo2 />} tooltip="后退 Ctrl+Z" />
                        <ToolbarButton icon={<Redo2 />} tooltip="前进 Ctrl+Y" />
                    </div>
                    <Divider />

                    {/* Format Painter */}
                    <div className="flex items-center gap-1">
                        <ToolbarButton icon={<Paintbrush />} tooltip="格式刷" />
                        <ToolbarButton icon={<Eraser />} tooltip="清除格式" />
                    </div>
                    <Divider />

                    {/* Font Settings Group */}
                    <div className="flex items-center gap-1">

                        {/* Text Type Dropdown */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <DropdownButtonTrigger label={textType === "paragraph" ? "正文" : textType} tooltip="文本类型" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="w-40" align="start">
                                <DropdownMenuRadioGroup value={textType} onValueChange={setTextType}>
                                    <DropdownMenuRadioItem value="paragraph">正文</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="h1" className="text-2xl font-bold">标题 1</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="h2" className="text-xl font-bold">标题 2</DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="h3" className="text-lg font-bold">标题 3</DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        {/* Font Family Dropdown */}
                        <DropdownMenu>
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
                        <DropdownMenu>
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
                            icon={<span className="text-sm font-bold">A+</span>}
                            className="w-6"
                            tooltip="增大字号 Ctrl+Shift+ >"
                            onClick={() => {
                                const val = parseInt(fontSize)
                                if (val < 100) setFontSize(`${val + 2}px`)
                            }}
                        />
                        <ToolbarButton
                            icon={<span className="text-xs font-bold">A-</span>}
                            className="w-6"
                            tooltip="减小字号 Ctrl+Shift+ <"
                            onClick={() => {
                                const val = parseInt(fontSize)
                                if (val > 10) setFontSize(`${val - 2}px`)
                            }}
                        />
                    </div>
                    <Divider />

                    {/* Colors - Using standard ColorPicker */}
                    <div className="flex items-center gap-1">
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
                    <div className="flex items-center gap-1">
                        <ToolbarButton icon={<Bold />} tooltip="加粗 Ctrl+B" />
                        <ToolbarButton icon={<Italic />} tooltip="斜体 Ctrl+I" />
                        <ToolbarButton icon={<Underline />} tooltip="下划线 Ctrl+U" />
                    </div>

                    {/* Advanced Formatting */}
                    {(!hideStrike || !hideSup || !hideSub) && (
                        <div className="flex items-center gap-1">
                            {!hideStrike && <ToolbarButton icon={<Strikethrough />} tooltip="删除线" />}
                            {!hideSup && <ToolbarButton icon={<Superscript />} tooltip="上标 Ctrl+Shift+" />}
                            {!hideSub && <ToolbarButton icon={<Subscript />} tooltip="下标 Ctrl+=" />}
                        </div>
                    )}

                    {/* Paragraph Settings */}
                    {(!hideAlignLeft || !hideList || !hideIndent || !hideAlignJustify) && (
                        <>
                            <Divider />
                            <div className="flex items-center gap-1">
                                {!hideAlignLeft && (
                                    <DropdownMenu>
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
                                    <DropdownMenu>
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
                                    <DropdownMenu>
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
                                    <DropdownMenu>
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
                            <div className="flex items-center gap-1">
                                {!hideSearch && <ToolbarButton icon={<Search />} tooltip="查找替换 Ctrl+F" />}
                                {!hideCode && <ToolbarButton icon={<Code />} tooltip="HTML代码编辑模式" />}
                            </div>
                        </>
                    )}
                </div>

                {/* TEXT MORE BUTTON */}
                {showTextMore && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button className="flex items-center justify-center w-8 h-8 rounded hover:bg-comp-background-gray transition-colors shrink-0 text-icon-primary data-[state=open]:bg-comp-background-gray data-[state=open]:text-brand">
                                <CircleEllipsis className="h-5 w-5" strokeWidth={1.5} />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            {hideStrike && <DropdownMenuItem><MenuIcon icon={Strikethrough} /> 删除线</DropdownMenuItem>}
                            {hideSup && <DropdownMenuItem><MenuIcon icon={Superscript} /> 上标</DropdownMenuItem>}
                            {hideSub && <DropdownMenuItem><MenuIcon icon={Subscript} /> 下标</DropdownMenuItem>}

                            {(hideStrike && hideAlignLeft) && <div className="h-[1px] bg-border my-1" />}

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

                {/* 2. RIGHT SECTION (Insert Tools) */}
                <Divider />

                <div className="flex items-center shrink-0 gap-1">
                    <WithTooltip content="插入图片">
                        <ToolbarButton icon={<ImageIcon />} />
                    </WithTooltip>

                    <WithTooltip content="插入表格">
                        <ToolbarButton icon={<TableIcon />} />
                    </WithTooltip>

                    {!hideLink && <ToolbarButton icon={<Link />} tooltip="添加超链接 Ctrl+K" />}
                    {!hideSmile && <ToolbarButton icon={<Smile />} tooltip="添加表情符号" />}
                    {!hideMinus && <ToolbarButton icon={<Minus />} tooltip="插入横线" />}

                    {/* Insert More Button */}
                    {showInsertMore && (
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center justify-center w-8 h-8 rounded hover:bg-comp-background-gray transition-colors shrink-0 text-icon-primary data-[state=open]:bg-comp-background-gray data-[state=open]:text-brand">
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
