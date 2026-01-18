import * as React from "react"
import { useMailStore } from "@/store/mailStore"
import { EditorToolbar } from "@/components/features/editor/editor-toolbar"
import { Button } from "@/components/ui/Button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, Save, Paperclip, Lock, X, Minus, Maximize, Minimize } from "lucide-react"

export function ComposeWindow() {
    const { isComposeOpen, toggleCompose, composeDraft } = useMailStore()

    // Editor State
    const [to, setTo] = React.useState("")
    const [cc, setCc] = React.useState("")
    const [bcc, setBcc] = React.useState("")
    const [subject, setSubject] = React.useState("")
    const [content, setContent] = React.useState("")

    const [showCc, setShowCc] = React.useState(false)
    const [showBcc, setShowBcc] = React.useState(false)

    // Window State
    const [isFullscreen, setIsFullscreen] = React.useState(false)
    const [position, setPosition] = React.useState({ x: 0, y: 0 })
    const [size, setSize] = React.useState({ width: 900, height: 700 })
    const [isDragging, setIsDragging] = React.useState(false)
    const [isResizing, setIsResizing] = React.useState<string | null>(null)
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

                if (isResizing.includes('e')) newWidth = Math.max(600, Math.min(1600, resizeStart.current.width + deltaX))
                if (isResizing.includes('s')) newHeight = Math.max(500, Math.min(1000, resizeStart.current.height + deltaY))
                if (isResizing.includes('w')) {
                    newWidth = Math.max(600, Math.min(1600, resizeStart.current.width - deltaX))
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
            {/* Edges */}
            <div className="absolute top-0 left-2 right-2 h-1 cursor-n-resize" onMouseDown={handleResizeStart('n')} />
            <div className="absolute bottom-0 left-2 right-2 h-1 cursor-s-resize" onMouseDown={handleResizeStart('s')} />
            <div className="absolute left-0 top-2 bottom-2 w-1 cursor-w-resize" onMouseDown={handleResizeStart('w')} />
            <div className="absolute right-0 top-2 bottom-2 w-1 cursor-e-resize" onMouseDown={handleResizeStart('e')} />
            {/* Corners */}
            <div className="absolute top-0 left-0 w-3 h-3 cursor-nw-resize" onMouseDown={handleResizeStart('nw')} />
            <div className="absolute top-0 right-0 w-3 h-3 cursor-ne-resize" onMouseDown={handleResizeStart('ne')} />
            <div className="absolute bottom-0 left-0 w-3 h-3 cursor-sw-resize" onMouseDown={handleResizeStart('sw')} />
            <div className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize" onMouseDown={handleResizeStart('se')} />
        </>
    )

    // Window Content
    const WindowContent = (
        <div className="flex flex-col h-full bg-white rounded-xl overflow-hidden">
            {/* Header / Drag Handle */}
            <div
                className="shrink-0 cursor-grab active:cursor-grabbing"
                onMouseDown={handleDragStart}
            >
                <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-transparent select-none">
                    <div className="flex items-baseline gap-3">
                        <h3 className="font-bold text-slate-800 text-[16px]">新建邮件</h3>
                        <span className="text-xs text-slate-400 font-medium">06:20:32 自动保存</span>
                    </div>
                    <div className="flex items-center gap-2" onMouseDown={e => e.stopPropagation()}>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-md" onClick={toggleFullscreen}>
                            {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:bg-slate-100 hover:text-slate-700 rounded-md" onClick={() => toggleCompose(false)}>
                            <Minus className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-md" onClick={() => toggleCompose(false)}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </div>

            {/* Main Action Bar */}
            <div className="px-6 py-3 flex items-center gap-3 bg-white shrink-0">
                <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg px-5 h-9 shadow-sm shadow-blue-200 gap-2 transition-all active:scale-95" onClick={handleSend}>
                    <Send className="w-4 h-4 ml-[-2px] rotate-1" />
                    <span className="font-semibold text-[14px]">发送</span>
                </Button>

                <div className="flex items-center gap-1">
                    <Button variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg px-3 h-9">
                        <Save className="w-4 h-4" />
                    </Button>
                    <Button variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg px-3 h-9 flex items-center gap-1">
                        <Paperclip className="w-4 h-4" />
                        <span className="text-xs font-medium opacity-60">▼</span>
                    </Button>
                    <Button variant="secondary" className="bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg px-3 h-9 flex items-center gap-1">
                        <Lock className="w-4 h-4" />
                        <span className="text-xs font-medium opacity-60">▼</span>
                    </Button>
                </div>
            </div>

            {/* Fields Area */}
            <div className="px-6 pb-2 shrink-0">
                <div className="space-y-1">
                    {/* To */}
                    <div className="flex items-start py-2 border-b border-slate-100 group transition-colors hover:border-slate-300">
                        <div className="w-14 shrink-0 pt-1 text-sm text-slate-500">收件人</div>
                        <div className="flex-1 flex flex-col">
                            <input
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                className="w-full outline-none text-sm text-slate-800 bg-transparent placeholder:text-slate-300"
                            />
                        </div>
                        <div className="shrink-0 flex items-center gap-3 text-[13px] text-slate-400">
                            {!showCc && <button onClick={() => setShowCc(true)} className="hover:text-blue-600">抄送</button>}
                            {!showBcc && <button onClick={() => setShowBcc(true)} className="hover:text-blue-600">密送</button>}
                        </div>
                    </div>

                    {/* Cc */}
                    {showCc && (
                        <div className="flex items-center py-2 border-b border-slate-100 group transition-colors hover:border-slate-300">
                            <div className="w-14 shrink-0 text-sm text-slate-500">抄送</div>
                            <input
                                value={cc}
                                onChange={(e) => setCc(e.target.value)}
                                className="flex-1 outline-none text-sm text-slate-800 bg-transparent"
                            />
                        </div>
                    )}

                    {/* Bcc */}
                    {showBcc && (
                        <div className="flex items-center py-2 border-b border-slate-100 group transition-colors hover:border-slate-300">
                            <div className="w-14 shrink-0 text-sm text-slate-500">密送</div>
                            <input
                                value={bcc}
                                onChange={(e) => setBcc(e.target.value)}
                                className="flex-1 outline-none text-sm text-slate-800 bg-transparent"
                            />
                        </div>
                    )}

                    {/* Subject */}
                    <div className="flex items-center py-3 border-b border-slate-100 group transition-colors hover:border-slate-300">
                        <div className="w-14 shrink-0 text-sm text-slate-500 font-medium">主题</div>
                        <input
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="请输入主题"
                            className="flex-1 outline-none text-sm font-medium text-slate-800 bg-transparent placeholder:text-slate-300"
                        />
                        <div className="shrink-0">
                            <button className="text-[13px] text-slate-400 hover:text-blue-600 flex items-center gap-1">
                                重要性 <span className="text-[10px]">▼</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Toolbar */}
            <div className="px-6 py-2 shrink-0">
                <EditorToolbar />
            </div>

            {/* Body */}
            <div className="flex-1 relative min-h-0 bg-white cursor-text" onClick={() => document.getElementById('compose-editor')?.focus()}>
                <ScrollArea className="h-full w-full">
                    <div className="p-8">
                        <div
                            id="compose-editor"
                            contentEditable
                            className="outline-none min-h-[300px] text-base leading-relaxed text-slate-800"
                            onInput={(e) => setContent(e.currentTarget.textContent || "")}
                            dangerouslySetInnerHTML={{ __html: content }}
                        />
                    </div>
                </ScrollArea>
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
                className="pointer-events-auto absolute shadow-2xl rounded-xl border border-slate-200"
                style={{
                    width: size.width,
                    height: size.height,
                    left: position.x,
                    top: position.y,
                    transition: isDragging || isResizing ? 'none' : 'box-shadow 0.2s'
                }}
            >
                <ResizeHandles />
                {WindowContent}
            </div>
        </div>
    )
}

