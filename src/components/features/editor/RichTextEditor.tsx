"use client"

import * as React from "react"
import { useEditor, EditorContent, Editor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Underline from "@tiptap/extension-underline"
import Link from "@tiptap/extension-link"
import { TextStyle } from "@tiptap/extension-text-style"
import { Color } from "@tiptap/extension-color"
import FontFamily from "@tiptap/extension-font-family"
import { FontSize } from "./extensions/FontSize"
import Highlight from "@tiptap/extension-highlight"
import Image from "@tiptap/extension-image"
import { Table } from "@tiptap/extension-table"
import { TableRow } from "@tiptap/extension-table-row"
import { TableCell } from "@tiptap/extension-table-cell"
import { TableHeader } from "@tiptap/extension-table-header"
import { EditorBubbleMenu } from "./EditorBubbleMenu"
import { cn } from "@/lib/utils"
// Smart Proofreading Integration
import { SmartProofreadingExtension } from "./extensions/SmartProofreadingExtension"
import { ProofreadingCard } from "./ProofreadingCard"
import { ProofreadingError, mockProofreadingErrors } from "@/data/smart-compose-mock"
import { AIStreamExtension } from "./extensions/AIStreamExtension"
import { AIReviewMark } from "./extensions/AIReviewMark"
import { AIReviewToolbar } from "./AIReviewToolbar"
import { InlineAICapsule } from "./InlineAICapsule"

export interface RichTextEditorProps {
    content?: string
    onChange?: (html: string) => void
    onEditorReady?: (editor: Editor) => void
    className?: string
    placeholder?: string
}

export function RichTextEditor({
    content = "",
    onChange,
    onEditorReady,
    className,
    placeholder = "请输入正文内容...",
}: RichTextEditorProps) {
    // -------------------------------------------------------------------------
    // Smart Proofreading Logic
    // -------------------------------------------------------------------------
    const [activeError, setActiveError] = React.useState<ProofreadingError | null>(null)
    const [cardPosition, setCardPosition] = React.useState<{ x: number, y: number } | null>(null)
    const [ignoredErrors, setIgnoredErrors] = React.useState<Set<string>>(new Set())

    const handleHoverError = React.useCallback((event: MouseEvent, error: ProofreadingError | null, target: HTMLElement | null) => {
        // If we found an error, and it's not ignored, show the card
        if (error && target && !ignoredErrors.has(error.id)) {
            const rect = target.getBoundingClientRect()
            setActiveError(error)
            // Position card below the error
            setCardPosition({ x: rect.left, y: rect.bottom + 5 })
        }
        // Note: We don't auto-hide on every mouse move to avoid flickering.
        // We rely on click-outside or explicit actions to close.
    }, [ignoredErrors])

    // Handler for accepting suggestion
    const handleAcceptSuggestion = () => {
        if (!editor || !activeError) return

        const { state } = editor.view
        const { doc } = state
        let found = false

        // Scan doc to find the text of the error. 
        // Ideally we use decoration positions, but mapping is complex without a persistent plugin state.
        // Simple search in current doc:
        doc.descendants((node, pos) => {
            if (found || !node.isText || !node.text) return
            const index = node.text.indexOf(activeError.text)
            if (index !== -1) {
                const from = pos + index
                const to = from + activeError.text.length
                // Replace text
                editor.chain().focus().setTextSelection({ from, to }).insertContent(activeError.suggestion).run()
                found = true
            }
        })

        if (!found) {
            // Fallback: If text not found (maybe edited), just close
            console.warn("Could not find text to replace:", activeError.text)
        }

        handleCloseCard()
    }

    // Handler for ignoring error
    const handleIgnoreError = () => {
        if (!activeError) return
        setIgnoredErrors(prev => {
            const next = new Set(prev)
            next.add(activeError.id)
            return next
        })
        handleCloseCard()
        // Note: To remove the underline immediately, the extension needs to know about ignoredErrors.
        // Since we pass 'onHover', we can't easily pass 'ignoredErrors' without reconfiguring.
        // Ideally, we'd trigger a re-render of the extension. 
        // For this MVP, the underline might persist until hover, enabling the check below.
        // A full fix requires passing ignoredErrors to the extension options dynamically or using a context.
    }

    const handleCloseCard = () => {
        setActiveError(null)
        setCardPosition(null)
    }

    // Close card when clicking outside
    React.useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            if (target.closest('.proofreading-card')) return
            if (target.classList.contains('proofreading-underline')) return
            handleCloseCard()
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // -------------------------------------------------------------------------
    // Editor Initialization
    // -------------------------------------------------------------------------
    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: { levels: [1, 2, 3] },
                bulletList: { keepMarks: true, keepAttributes: false },
                orderedList: { keepMarks: true, keepAttributes: false },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: { class: "text-brand underline cursor-pointer" },
            }),
            TextStyle,
            Color,
            FontSize,
            FontFamily,
            Highlight.configure({ multicolor: true }),
            Image.configure({
                inline: true,
                allowBase64: true,
                HTMLAttributes: { class: "max-w-full h-auto rounded-lg" },
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: { class: "border-collapse border border-comp-divider" },
            }),
            TableRow,
            TableCell.configure({
                HTMLAttributes: { class: "border border-comp-divider p-2" },
            }),
            TableHeader.configure({
                HTMLAttributes: { class: "border border-comp-divider p-2 bg-background-secondary font-bold" },
            }),
            // Our Smart Proofreading Extension
            SmartProofreadingExtension.configure({
                onHover: handleHoverError
            }),
            AIStreamExtension,
            AIReviewMark,
        ],
        content,
        editorProps: {
            attributes: {
                class: cn(
                    "outline-none min-h-[300px] text-base leading-relaxed text-font-primary",
                    "prose prose-sm max-w-none",
                    "prose-headings:font-bold prose-headings:text-font-primary",
                    "prose-h1:text-2xl prose-h1:mt-4 prose-h1:mb-2",
                    "prose-h2:text-xl prose-h2:mt-3 prose-h2:mb-2",
                    "prose-h3:text-lg prose-h3:mt-2 prose-h3:mb-1",
                    "prose-p:my-1",
                    "prose-ul:my-2 prose-ol:my-2",
                    "prose-li:my-0.5",
                    "prose-a:text-brand prose-a:no-underline hover:prose-a:underline",
                    "prose-code:bg-background-secondary prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
                    "prose-pre:bg-background-secondary prose-pre:p-4 prose-pre:rounded-lg"
                ),
            },
        },
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML())
        },
    })

    React.useEffect(() => {
        if (editor) {
            onEditorReady?.(editor)
        }
    }, [editor, onEditorReady])

    const isEmpty = editor?.isEmpty

    return (
        <div className={cn("relative", className)}>
            {isEmpty && (
                <div className="absolute top-0 left-0 text-font-tertiary pointer-events-none text-base">
                    {placeholder}
                </div>
            )}
            <EditorContent editor={editor} />
            <EditorBubbleMenu editor={editor} />
            <AIReviewToolbar editor={editor} />
            <InlineAICapsule editor={editor} />

            {/* Smart Proofreading Card Overlay */}
            {activeError && cardPosition && (
                <div className="proofreading-card absolute z-[100] pointer-events-auto text-left" style={{ left: 0, top: 0 }}>
                    <ProofreadingCard
                        error={activeError}
                        position={cardPosition}
                        onAccept={handleAcceptSuggestion}
                        onIgnore={handleIgnoreError}
                        onClose={handleCloseCard}
                    />
                </div>
            )}
        </div>
    )
}

export type { Editor }
