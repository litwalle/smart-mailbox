import * as React from "react"
import { useMailStore } from "@/store/mailStore"
import { ComposeHeader } from "./ComposeHeader"
import { Toolbar, ToolbarItem } from "@/components/ui/toolbar"
import { EditorToolbar } from "@/components/features/editor/editor-toolbar"
import { Input } from "@/components/ui/Input"
import { Button } from "@/components/ui/Button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ReaderSimulatorSidebar } from "./ReaderSimulatorSidebar"
import { Send, Save, Paperclip, Clock, MoreHorizontal, User } from "lucide-react"

export function ComposeWindow() {
    const { isComposeOpen, toggleCompose, composeDraft } = useMailStore()
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false)

    // Editor State
    const [to, setTo] = React.useState("")
    const [cc, setCc] = React.useState("")
    const [bcc, setBcc] = React.useState("")
    const [subject, setSubject] = React.useState("")
    const [content, setContent] = React.useState("")

    const [showCc, setShowCc] = React.useState(false)
    const [showBcc, setShowBcc] = React.useState(false)

    // Draggable State
    const [position, setPosition] = React.useState({ x: 0, y: 0 })
    const [isDragging, setIsDragging] = React.useState(false)
    const dragOffset = React.useRef({ x: 0, y: 0 })
    const windowRef = React.useRef<HTMLDivElement>(null)

    // Center the window initially
    React.useEffect(() => {
        if (isComposeOpen) {
            const winWidth = window.innerWidth
            const winHeight = window.innerHeight
            setPosition({
                x: (winWidth - 820) / 2,
                y: (winHeight - 840) / 2
            })
        }
    }, [isComposeOpen])

    React.useEffect(() => {
        if (isComposeOpen && composeDraft) {
            setTo(composeDraft.to || "")
            setSubject(composeDraft.subject || "")
            setContent(composeDraft.content || "")
        }
    }, [isComposeOpen, composeDraft])


    // Drag Handlers
    const handleMouseDown = (e: React.MouseEvent) => {
        if (e.button !== 0) return
        setIsDragging(true)
        dragOffset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        }
    }

    React.useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (isDragging) {
                setPosition({
                    x: e.clientX - dragOffset.current.x,
                    y: e.clientY - dragOffset.current.y
                })
            }
        }
        const handleMouseUp = () => {
            setIsDragging(false)
        }

        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove)
            document.addEventListener('mouseup', handleMouseUp)
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove)
            document.removeEventListener('mouseup', handleMouseUp)
        }
    }, [isDragging, position])


    if (!isComposeOpen) return null

    return (
        <div className="fixed inset-0 z-50 pointer-events-none">
            {/* Window Container */}
            <div
                ref={windowRef}
                className="pointer-events-auto absolute flex shadow-2xl rounded-2xl overflow-hidden bg-white border border-slate-200 animate-in zoom-in-95 duration-200 ring-1 ring-black/5"
                style={{
                    width: isSidebarOpen ? '1120px' : '820px',
                    height: '840px',
                    left: `${position.x}px`,
                    top: `${position.y}px`,
                    transition: isDragging ? 'none' : 'width 0.3s cubic-bezier(0.2, 0, 0, 1), height 0.3s ease-in-out'
                }}
            >
                {/* Main Composition Area */}
                <div className="flex flex-col w-[820px] shrink-0 bg-white relative z-10 h-full border-r border-slate-200">

                    {/* Window Header (Drag Handle) */}
                    <div onMouseDown={handleMouseDown}>
                        <ComposeHeader
                            onMinimize={() => toggleCompose(false)}
                            onClose={() => toggleCompose(false)}
                            onMouseDown={() => { }}
                            isSidebarOpen={isSidebarOpen}
                            toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
                        />
                    </div>

                    {/* 1. Action Toolbar */}
                    <div className="px-6 py-3 border-b border-slate-200 flex items-center justify-between bg-white shrink-0 z-20">
                        {/* Left Actions: Send, Save, Attach */}
                        <div className="flex items-center gap-3">
                            <Button className="bg-primary hover:bg-primary-hover text-white rounded-lg px-6 h-9 shadow-sm shadow-primary/20 gap-2 transition-all active:scale-95">
                                <Send className="w-4 h-4 ml-[-2px]" />
                                <span className="font-medium text-[14px]">Send</span>
                            </Button>

                            <div className="h-5 w-[1px] bg-slate-200 mx-1" />

                            <Toolbar mode="icon-only" spacing={4} className="w-auto">
                                <ToolbarItem icon={<Save className="w-5 h-5" />} label="Save" onClick={() => { }} />
                                <ToolbarItem icon={<Paperclip className="w-5 h-5" />} label="Attach" />
                                <ToolbarItem icon={<Clock className="w-5 h-5" />} label="Schedule" />
                            </Toolbar>
                        </div>

                        {/* Right Actions: More */}
                        <div className="flex items-center gap-2">
                            <Toolbar mode="icon-only" spacing={4} className="w-auto">
                                <ToolbarItem icon={<MoreHorizontal className="w-5 h-5" />} />
                            </Toolbar>
                        </div>
                    </div>

                    {/* 2. Header Fields (To, Cc, Bcc, Subject) */}
                    <div className="px-8 py-4 flex flex-col gap-3 shrink-0 z-10 bg-white">
                        <div className="flex flex-col gap-3">
                            {/* To */}
                            <Input
                                variant="linear"
                                label="收件人"
                                labelPosition="left"
                                labelSpacing={16}
                                value={to}
                                onChange={(e) => setTo(e.target.value)}
                                placeholder="输入收件人地址"
                                suffix={
                                    <div className="flex items-center gap-2">
                                        {!showCc && <button onClick={() => setShowCc(true)} className="text-xs text-slate-400 hover:text-slate-700">抄送</button>}
                                        {!showBcc && <button onClick={() => setShowBcc(true)} className="text-xs text-slate-400 hover:text-slate-700">密送</button>}
                                        <div className="h-4 w-[1px] bg-slate-200" />
                                        <button className="text-slate-400 hover:text-slate-700"><User className="w-4 h-4" /></button>
                                    </div>
                                }
                                suffixMode="active"
                            />

                            {/* Cc */}
                            {showCc && (
                                <Input
                                    variant="linear"
                                    label="抄送"
                                    labelPosition="left"
                                    labelSpacing={16}
                                    value={cc}
                                    onChange={(e) => setCc(e.target.value)}
                                    placeholder=" "
                                />
                            )}

                            {/* Bcc */}
                            {showBcc && (
                                <Input
                                    variant="linear"
                                    label="密送"
                                    labelPosition="left"
                                    labelSpacing={16}
                                    value={bcc}
                                    onChange={(e) => setBcc(e.target.value)}
                                    placeholder=" "
                                />
                            )}

                            {/* Subject */}
                            <div className="pt-2">
                                <Input
                                    variant="linear"
                                    className="text-lg font-bold placeholder:font-normal py-2"
                                    placeholder="添加主题"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3. Editor Toolbar */}
                    <div className="px-6 py-2 shrink-0 z-20 bg-white">
                        <EditorToolbar />
                    </div>

                    {/* 4. Editor Content */}
                    <div className="flex-1 min-h-0 relative bg-white">
                        <ScrollArea className="h-full w-full">
                            <div className="p-8 pb-32 min-h-full">
                                <div
                                    contentEditable
                                    className="outline-none min-h-[400px] text-base text-slate-900 items-center leading-relaxed max-w-[800px] mx-auto cursor-text"
                                    onInput={(e) => setContent(e.currentTarget.textContent || "")}
                                    dangerouslySetInnerHTML={{ __html: content }}
                                />
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Footer Status Bar */}
                    <div className="h-8 border-t border-slate-200 flex items-center justify-between px-6 text-xs text-slate-400 select-none shrink-0 bg-white/80">
                        <div className="flex items-center gap-2">
                            <span>HTML 模式</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="flex items-center gap-1 cursor-pointer hover:text-slate-700">
                                <Clock className="w-3 h-3" />
                                06:20:32 自动保存
                            </span>
                        </div>
                    </div>

                </div>

                {/* AI Sidebar */}
                <div
                    className={`
                         bg-slate-50 w-[300px] shrink-0 transition-opacity duration-300 ease-in-out flex flex-col h-full border-l border-slate-200
                        ${isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none w-0 overflow-hidden'}
                    `}
                >
                    <ReaderSimulatorSidebar />
                </div>
            </div>
        </div>
    )
}
