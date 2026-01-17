import * as React from "react"
import { useMailStore } from "@/store/mailStore"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card } from "@/components/ui/Card"

export function ComposeModal() {
    const { isComposeOpen, toggleCompose, sendEmail, composeDraft } = useMailStore()
    const [to, setTo] = React.useState("")
    const [subject, setSubject] = React.useState("")
    const [content, setContent] = React.useState("")

    React.useEffect(() => {
        if (isComposeOpen) {
            if (composeDraft) {
                setTo(composeDraft.to)
                setSubject(composeDraft.subject)
                setContent(composeDraft.content)
            } else {
                // Should we reset if no draft? Or keep previous? 
                // Usually reset if opening fresh.
                setTo("")
                setSubject("")
                setContent("")
            }
        }
    }, [isComposeOpen, composeDraft])

    if (!isComposeOpen) return null

    const handleSend = () => {
        sendEmail(to, subject, content)
        // Reset form
        setTo("")
        setSubject("")
        setContent("")
    }

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-end p-6 pointer-events-none">
            {/* Modal Container */}
            <div className="bg-white rounded-t-xl shadow-2xl border border-slate-200 w-[600px] h-[600px] pointer-events-auto flex flex-col animate-in slide-in-from-bottom duration-300">

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 rounded-t-xl border-b border-gray-100">
                    <h3 className="font-bold text-slate-800">New Message</h3>
                    <div className="flex gap-1">
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleCompose(false)}>
                            <span className="material-symbols-outlined text-[18px]">minimize</span>
                        </Button>
                        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => toggleCompose(false)}>
                            <span className="material-symbols-outlined text-[18px]">close</span>
                        </Button>
                    </div>
                </div>

                {/* Form Area */}
                <div className="flex flex-col flex-1 p-4 space-y-4 overflow-y-auto">
                    <div className="space-y-2">
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                            <span className="text-sm font-medium text-slate-500 w-12 shrink-0">To:</span>
                            <input
                                value={to}
                                onChange={e => setTo(e.target.value)}
                                className="flex-1 outline-none text-sm bg-transparent"
                                placeholder="Recipient"
                                autoFocus
                            />
                        </div>
                        <div className="flex items-center gap-2 border-b border-slate-100 pb-2">
                            <span className="text-sm font-medium text-slate-500 w-12 shrink-0">Subject:</span>
                            <input
                                value={subject}
                                onChange={e => setSubject(e.target.value)}
                                className="flex-1 outline-none text-sm font-medium bg-transparent"
                                placeholder="Enter subject"
                            />
                        </div>
                    </div>

                    {/* Editor Area (Simple Textarea for now) */}
                    <textarea
                        value={content}
                        onChange={e => setContent(e.target.value)}
                        className="flex-1 resize-none outline-none text-sm leading-relaxed p-2 text-slate-800"
                        placeholder="Type your message here..."
                    />
                </div>

                {/* Footer / Toolbar */}
                <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white">
                    <div className="flex gap-1">
                        {['format_bold', 'format_italic', 'link', 'attach_file', 'image'].map(icon => (
                            <Button key={icon} variant="ghost" size="icon" className="h-8 w-8 text-slate-500">
                                <span className="material-symbols-outlined text-[18px]">{icon}</span>
                            </Button>
                        ))}
                    </div>
                    <div className="flex gap-2 items-center">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400">
                            <span className="material-symbols-outlined text-[18px] fill-current">delete</span>
                        </Button>
                        <Button
                            className="px-6"
                            onClick={handleSend}
                        >
                            Send
                            <span className="material-symbols-outlined ml-2 text-[18px]">send</span>
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
