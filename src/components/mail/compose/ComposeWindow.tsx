import * as React from "react"
import { cn } from "@/lib/utils"
import { useMailStore } from "@/store/mailStore"
import { EditorToolbar } from "@/components/features/editor/editor-toolbar"
import { ComposeAISidebar } from "./ComposeAISidebar"
import { RichTextEditor, Editor } from "@/components/features/editor/RichTextEditor"
import { Button } from "@/components/ui/Button"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent,
    DropdownMenuCheckboxItem,
} from "@/components/ui/dropdown-menu"
import { Send, Save, Paperclip, Lock, X, Minus, Maximize, Minimize, ChevronDown, Sparkles, UserCheck, PenLine, MoreHorizontal, Clock, Settings, BookUser } from "lucide-react"

export function ComposeWindow() {
    const { isComposeOpen, toggleCompose, composeDraft } = useMailStore()

    // Editor State
    const [to, setTo] = React.useState("")
    const [cc, setCc] = React.useState("")
    const [bcc, setBcc] = React.useState("")
    const [subject, setSubject] = React.useState("")
    const [content, setContent] = React.useState("")
    const [editor, setEditor] = React.useState<Editor | null>(null)

    // 标头栏设置：显示/隐藏抄送密送
    const [showCc, setShowCc] = React.useState(false)
    const [showBcc, setShowBcc] = React.useState(false)

    // 输入框激活状态
    const [activeField, setActiveField] = React.useState<string | null>(null)

    // Window State
    const [isFullscreen, setIsFullscreen] = React.useState(false)
    const [position, setPosition] = React.useState({ x: 0, y: 0 })
    const [size, setSize] = React.useState({ width: 1110, height: 700 })
    const [isDragging, setIsDragging] = React.useState(false)
    const [isResizing, setIsResizing] = React.useState<string | null>(null)
    const [isAISidebarOpen, setIsAISidebarOpen] = React.useState(false)
    const dragOffset = React.useRef({ x: 0, y: 0 })
    const resizeStart = React.useRef({ x: 0, y: 0, width: 0, height: 0 })
    const windowRef = React.useRef<HTMLDivElement>(null)

    // Center window on open
    React.useEffect(() => {
        if (isComposeOpen && !isFullscreen) {
            setPosition({
                x: (window.innerWidth - size.width) / 2,
                y: (window.innerHeight - size.height) / 2
            })
        }
    }, [isComposeOpen])

    // Load draft
    React.useEffect(() => {
        if (isComposeOpen && composeDraft) {
            setTo(composeDraft.to || "")
            setSubject(composeDraft.subject || "")
            setContent(composeDraft.content || "")
        }
    }, [isComposeOpen, composeDraft])

    // Listen for AI Assistant open event (from EditorBubbleMenu)
    React.useEffect(() => {
        const handleOpenAssistant = () => setIsAISidebarOpen(true)
        window.addEventListener('open-writing-assistant', handleOpenAssistant)
        return () => window.removeEventListener('open-writing-assistant', handleOpenAssistant)
    }, [])


    // Mouse handlers for drag and resize
    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - dragOffset.current.x,
                    y: e.clientY - dragOffset.current.y
                })
            }
            if (isResizing) {
                const deltaX = e.clientX - resizeStart.current.x
                const deltaY = e.clientY - resizeStart.current.y
                let newWidth = resizeStart.current.width
                let newHeight = resizeStart.current.height

                if (isResizing.includes('e')) newWidth = Math.max(1110, Math.min(1600, resizeStart.current.width + deltaX))
                if (isResizing.includes('s')) newHeight = Math.max(500, Math.min(1000, resizeStart.current.height + deltaY))
                if (isResizing.includes('w')) {
                    newWidth = Math.max(1110, Math.min(1600, resizeStart.current.width - deltaX))
                    setPosition(prev => ({ ...prev, x: resizeStart.current.x + (resizeStart.current.width - newWidth) / 2 + deltaX }))
                }
                if (isResizing.includes('n')) {
                    newHeight = Math.max(500, Math.min(1000, resizeStart.current.height - deltaY))
                    setPosition(prev => ({ ...prev, y: resizeStart.current.y + (resizeStart.current.height - newHeight) / 2 + deltaY }))
                }

                setSize({ width: newWidth, height: newHeight })
            }
        }

        const handleMouseUp = () => {
            setIsDragging(false)
            setIsResizing(null)
        }

        if (isDragging || isResizing) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        }

        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, isResizing])

    if (!isComposeOpen) return null

    const handleDragStart = (e: React.MouseEvent) => {
        if (e.button !== 0) return
        setIsDragging(true)
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        }
    }

    const handleResizeStart = (direction: string) => (e: React.MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        setIsResizing(direction)
        resizeStart.current = {
            x: e.clientX,
            y: e.clientY,
            width: size.width,
            height: size.height
        }
    }

    const handleSend = () => {
        console.log("Sending email:", { to, subject, content })
        toggleCompose(false)
    }

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen)
    }

    // Resize Handles Component
    const ResizeHandles = () => (
        <>
            {/* Edges - Increased Area & Z-Index */}
            <div className="absolute top-0 left-2 right-2 h-2 cursor-n-resize z-50 -mt-1" onMouseDown={handleResizeStart('n')} />
            <div className="absolute bottom-0 left-2 right-2 h-2 cursor-s-resize z-50 -mb-1" onMouseDown={handleResizeStart('s')} />
            <div className="absolute left-0 top-2 bottom-2 w-2 cursor-w-resize z-50 -ml-1" onMouseDown={handleResizeStart('w')} />
            <div className="absolute right-0 top-2 bottom-2 w-2 cursor-e-resize z-50 -mr-1" onMouseDown={handleResizeStart('e')} />
            {/* Corners - Increased Area & Z-Index */}
            <div className="absolute top-0 left-0 w-4 h-4 cursor-nw-resize z-50 -mt-1 -ml-1" onMouseDown={handleResizeStart('nw')} />
            <div className="absolute top-0 right-0 w-4 h-4 cursor-ne-resize z-50 -mt-1 -mr-1" onMouseDown={handleResizeStart('ne')} />
            <div className="absolute bottom-0 left-0 w-4 h-4 cursor-sw-resize z-50 -mb-1 -ml-1" onMouseDown={handleResizeStart('sw')} />
            <div className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-50 -mb-1 -mr-1" onMouseDown={handleResizeStart('se')} />
        </>
    )

    // Window Content
    const WindowContent = (
        <div className="flex flex-col h-full bg-background-primary rounded-lg overflow-hidden relative">
            {/* Header / Drag Handle - Height 48px */}
            <div
                className="shrink-0 cursor-grab active:cursor-grabbing relative z-10"
                onMouseDown={handleDragStart}
            >
                <div className="flex items-center justify-between px-6 h-[48px] bg-background-primary border-b border-comp-divider/50 select-none">
                    <div className="flex items-baseline gap-3">
                        <h3 className="font-bold text-font-primary text-[15px]">新建邮件</h3>
                        <span className="text-[11px] text-font-tertiary">06:20:32 自动保存</span>
                    </div>
                    <div className="flex items-center gap-2" onMouseDown={e => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-icon-secondary hover:bg-background-secondary hover:text-icon-primary rounded-lg transition-colors" onClick={toggleFullscreen}>
                            {isFullscreen ? <Minimize className="w-5 h-5" strokeWidth={1.5} /> : <Maximize className="w-5 h-5" strokeWidth={1.5} />}
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-icon-secondary hover:bg-background-secondary hover:text-icon-primary rounded-lg transition-colors" onClick={() => toggleCompose(false)}>
                            <Minus className="w-5 h-5" strokeWidth={1.5} />
                        </Button>
                        <Button variant="ghost" size="icon" className="w-8 h-8 text-icon-secondary hover:bg-warning/10 hover:text-warning rounded-lg transition-colors" onClick={() => toggleCompose(false)}>
                            <X className="w-5 h-5" strokeWidth={1.5} />
                        </Button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-row overflow-hidden min-h-0 relative">
                {/* Main Left Content */}
                <div className="flex-1 flex flex-col min-w-0 bg-background-primary">
                    {/* Main Action Bar */}
                    <div className="px-6 pb-2 pt-3 flex items-center justify-between bg-background-primary shrink-0 relative z-10">
                        {/* Left Side: Send + Primary Actions */}
                        <div className="flex items-center gap-2">
                            <Button
                                variant="primary"
                                className="px-6 h-10 gap-2 shadow-none transition-all active:scale-95 rounded-lg"
                                onClick={handleSend}
                            >
                                <Send className="w-5 h-5 ml-[-2px] rotate-1" strokeWidth={1.5} />
                                <span className="font-semibold text-[14px]">发送</span>
                            </Button>

                            <div className="flex items-center gap-2">
                                {/* Restore Grey Background: use bg-background-secondary + hover darken */}
                                <Button variant="ghost" className="w-10 h-10 p-0 rounded-lg text-icon-primary bg-background-secondary hover:bg-background-tertiary">
                                    <Save className="w-5 h-5" strokeWidth={1.5} />
                                </Button>

                                {/* Combined Buttons with Dropdowns */}
                                <Button variant="ghost" className="px-1.5 h-10 rounded-lg flex items-center gap-0.5 text-icon-primary bg-background-secondary hover:bg-background-tertiary">
                                    <Paperclip className="w-5 h-5" strokeWidth={1.5} />
                                    <ChevronDown className="w-3 h-3 text-icon-tertiary opacity-70" strokeWidth={1.5} />
                                </Button>
                                <Button variant="ghost" className="px-1.5 h-10 rounded-lg flex items-center gap-0.5 text-icon-primary bg-background-secondary hover:bg-background-tertiary">
                                    <Lock className="w-5 h-5" strokeWidth={1.5} />
                                    <ChevronDown className="w-3 h-3 text-icon-tertiary opacity-70" strokeWidth={1.5} />
                                </Button>
                            </div>
                        </div>

                        {/* Right Side: Secondary Actions (AI, Check, Signature, More) */}
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                className={cn(
                                    "w-10 h-10 p-0 rounded-lg transition-colors",
                                    isAISidebarOpen
                                        ? "bg-brand/10 text-brand hover:bg-brand/20"
                                        : "text-icon-primary hover:bg-[rgba(0,0,0,0.05)]"
                                )}
                                onClick={() => setIsAISidebarOpen(!isAISidebarOpen)}
                            >
                                <Sparkles className={cn("w-5 h-5", isAISidebarOpen ? "text-brand" : "text-brand")} strokeWidth={1.5} />
                            </Button>
                            <Button variant="ghost" className="w-10 h-10 p-0 rounded-lg text-icon-primary hover:bg-[rgba(0,0,0,0.05)]">
                                <UserCheck className="w-5 h-5" strokeWidth={1.5} />
                            </Button>
                            <Button variant="ghost" className="w-10 h-10 p-0 rounded-lg text-icon-primary hover:bg-[rgba(0,0,0,0.05)]">
                                <PenLine className="w-5 h-5" strokeWidth={1.5} />
                            </Button>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" className="w-10 h-10 p-0 rounded-lg text-icon-primary hover:bg-[rgba(0,0,0,0.05)] data-[state=open]:bg-[rgba(0,0,0,0.05)]">
                                        <MoreHorizontal className="w-5 h-5" strokeWidth={1.5} />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-48">
                                    <DropdownMenuItem>
                                        <Clock className="w-4 h-4 mr-2" />
                                        定时发信
                                    </DropdownMenuItem>
                                    <DropdownMenuSub>
                                        <DropdownMenuSubTrigger>
                                            <Settings className="w-4 h-4 mr-2" />
                                            标头栏设置
                                        </DropdownMenuSubTrigger>
                                        <DropdownMenuSubContent className="w-40">
                                            <DropdownMenuCheckboxItem
                                                checked={showCc}
                                                onCheckedChange={setShowCc}
                                                onSelect={(e) => e.preventDefault()}
                                            >
                                                显示抄送
                                            </DropdownMenuCheckboxItem>
                                            <DropdownMenuCheckboxItem
                                                checked={showBcc}
                                                onCheckedChange={setShowBcc}
                                                onSelect={(e) => e.preventDefault()}
                                            >
                                                显示密送
                                            </DropdownMenuCheckboxItem>
                                        </DropdownMenuSubContent>
                                    </DropdownMenuSub>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>

                    {/* Fields Area */}
                    <div className="px-6 pb-0 shrink-0">
                        <div className="space-y-0">
                            {/* To */}
                            <div
                                className={cn(
                                    "flex items-center h-[48px] border-b transition-colors group",
                                    activeField === 'to' ? "border-[#0A59F7] border-b-[0.5px]" : "border-comp-divider/50 hover:border-comp-divider"
                                )}
                            >
                                <div className={cn("w-14 shrink-0 text-sm font-medium transition-colors", activeField === 'to' ? "text-[#000000]" : "text-font-secondary")}>收件人</div>
                                <div className="flex-1 flex flex-col justify-center relative">
                                    <input
                                        value={to}
                                        onChange={(e) => setTo(e.target.value)}
                                        onFocus={() => setActiveField('to')}
                                        onBlur={() => setActiveField(null)}
                                        className={cn("w-full outline-none text-sm font-medium bg-transparent placeholder:text-font-tertiary", activeField === 'to' ? "text-[#000000]" : "text-font-primary")}
                                    />
                                </div>
                                {activeField === 'to' && (
                                    <div className="shrink-0 animate-in fade-in zoom-in-95 duration-200">
                                        <Button variant="ghost" className="w-10 h-10 p-0 rounded-lg text-icon-primary hover:bg-[rgba(0,0,0,0.05)] transition-colors">
                                            <BookUser className="w-5 h-5" strokeWidth={1.5} />
                                        </Button>
                                    </div>
                                )}
                            </div>

                            {/* Cc */}
                            {showCc && (
                                <div
                                    className={cn(
                                        "flex items-center h-[48px] border-b transition-colors group",
                                        activeField === 'cc' ? "border-[#0A59F7] border-b-[0.5px]" : "border-comp-divider/50 hover:border-comp-divider"
                                    )}
                                >
                                    <div className={cn("w-14 shrink-0 text-sm font-medium transition-colors", activeField === 'cc' ? "text-[#000000]" : "text-font-secondary")}>抄送</div>
                                    <div className="flex-1 flex flex-col justify-center relative">
                                        <input
                                            value={cc}
                                            onChange={(e) => setCc(e.target.value)}
                                            onFocus={() => setActiveField('cc')}
                                            onBlur={() => setActiveField(null)}
                                            className={cn("w-full outline-none text-sm font-medium bg-transparent placeholder:text-font-tertiary", activeField === 'cc' ? "text-[#000000]" : "text-font-primary")}
                                        />
                                    </div>
                                    {activeField === 'cc' && (
                                        <div className="shrink-0 animate-in fade-in zoom-in-95 duration-200">
                                            <Button variant="ghost" className="w-10 h-10 p-0 rounded-lg text-icon-primary hover:bg-[rgba(0,0,0,0.05)] transition-colors">
                                                <BookUser className="w-5 h-5" strokeWidth={1.5} />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Bcc */}
                            {showBcc && (
                                <div
                                    className={cn(
                                        "flex items-center h-[48px] border-b transition-colors group",
                                        activeField === 'bcc' ? "border-[#0A59F7] border-b-[0.5px]" : "border-comp-divider/50 hover:border-comp-divider"
                                    )}
                                >
                                    <div className={cn("w-14 shrink-0 text-sm font-medium transition-colors", activeField === 'bcc' ? "text-[#000000]" : "text-font-secondary")}>密送</div>
                                    <div className="flex-1 flex flex-col justify-center relative">
                                        <input
                                            value={bcc}
                                            onChange={(e) => setBcc(e.target.value)}
                                            onFocus={() => setActiveField('bcc')}
                                            onBlur={() => setActiveField(null)}
                                            className={cn("w-full outline-none text-sm font-medium bg-transparent placeholder:text-font-tertiary", activeField === 'bcc' ? "text-[#000000]" : "text-font-primary")}
                                        />
                                    </div>
                                    {activeField === 'bcc' && (
                                        <div className="shrink-0 animate-in fade-in zoom-in-95 duration-200">
                                            <Button variant="ghost" className="w-10 h-10 p-0 rounded-lg text-icon-primary hover:bg-[rgba(0,0,0,0.05)] transition-colors">
                                                <BookUser className="w-5 h-5" strokeWidth={1.5} />
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Subject */}
                            <div
                                className={cn(
                                    "flex items-center h-[48px] border-b transition-colors group",
                                    activeField === 'subject' ? "border-[#0A59F7] border-b-[0.5px]" : "border-comp-divider/50 hover:border-comp-divider"
                                )}
                            >
                                <div className={cn("w-14 shrink-0 text-sm font-medium transition-colors", activeField === 'subject' ? "text-[#000000]" : "text-font-secondary")}>主题</div>
                                <input
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    onFocus={() => setActiveField('subject')}
                                    onBlur={() => setActiveField(null)}
                                    placeholder="请输入主题"
                                    className={cn(
                                        "flex-1 outline-none text-sm font-medium bg-transparent placeholder:text-font-tertiary",
                                        activeField === 'subject' ? "text-[#000000]" : "text-font-primary"
                                    )}
                                />
                                <div className="shrink-0">
                                    <Button variant="ghost" className="h-8 px-2 text-[13px] text-font-tertiary hover:text-brand flex items-center gap-1 font-medium rounded-md">
                                        重要性 <ChevronDown className="w-3 h-3 text-icon-tertiary" strokeWidth={1.5} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Toolbar */}
                    <div className="px-6 py-1 shrink-0">
                        <EditorToolbar className="h-[48px] !h-[48px]" editor={editor} />
                    </div>

                    {/* Body */}
                    <div className="flex-1 relative min-h-0 bg-background-primary cursor-text" onClick={() => editor?.commands.focus()}>
                        <ScrollArea className="h-full w-full">
                            <div className="px-6 py-4">
                                <RichTextEditor
                                    content={content}
                                    onChange={setContent}
                                    onEditorReady={setEditor}
                                    placeholder="请输入正文内容..."
                                />
                            </div>
                        </ScrollArea>
                    </div>
                </div>

                {/* AI Assistant Sidebar */}
                {isAISidebarOpen && (
                    <ComposeAISidebar
                        onClose={() => setIsAISidebarOpen(false)}
                        editor={editor}
                    />
                )}
            </div>
        </div>
    )

    if (isFullscreen) {
        return (
            <div className="fixed inset-0 z-50 bg-white flex flex-col animate-in fade-in duration-200">
                {WindowContent}
            </div>
        )
    }

    return (
        <div className="fixed inset-0 z-50 pointer-events-none">
            <div
                ref={windowRef}
                className="pointer-events-auto absolute shadow-lg rounded-lg border border-comp-divider"
                style={{
                    width: size.width,
                    height: size.height,
                    left: position.x,
                    top: position.y,
                    boxShadow: '0 20px 120px rgba(0, 0, 0, 0.2)', // OUTER_DEFAULT_LG
                    transition: isDragging || isResizing ? 'none' : 'box-shadow 0.2s'
                }}
            >
                <ResizeHandles />
                {WindowContent}
            </div>
        </div>
    )
}

