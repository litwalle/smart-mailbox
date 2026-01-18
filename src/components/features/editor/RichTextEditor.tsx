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
import { cn } from "@/lib/utils"

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
    const editor = useEditor({
        immediatelyRender: false, // Prevent SSR hydration mismatch
        extensions: [
            StarterKit.configure({
                // 配置 StarterKit 内置扩展
                heading: {
                    levels: [1, 2, 3],
                },
                bulletList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
                orderedList: {
                    keepMarks: true,
                    keepAttributes: false,
                },
            }),
            Underline,
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: "text-brand underline cursor-pointer",
                },
            }),
            // Phase 3: Advanced Extensions
            TextStyle, // Required for Color, FontFamily, and FontSize
            Color,
            FontSize, // Custom font size extension
            FontFamily,
            Highlight.configure({
                multicolor: true,
            }),
            Image.configure({
                inline: true,
                allowBase64: true,
                HTMLAttributes: {
                    class: "max-w-full h-auto rounded-lg",
                },
            }),
            Table.configure({
                resizable: true,
                HTMLAttributes: {
                    class: "border-collapse border border-comp-divider",
                },
            }),
            TableRow,
            TableCell.configure({
                HTMLAttributes: {
                    class: "border border-comp-divider p-2",
                },
            }),
            TableHeader.configure({
                HTMLAttributes: {
                    class: "border border-comp-divider p-2 bg-background-secondary font-bold",
                },
            }),
        ],
        content,
        editorProps: {
            attributes: {
                class: cn(
                    "outline-none min-h-[300px] text-base leading-relaxed text-font-primary",
                    "prose prose-sm max-w-none",
                    // 标题样式
                    "prose-headings:font-bold prose-headings:text-font-primary",
                    "prose-h1:text-2xl prose-h1:mt-4 prose-h1:mb-2",
                    "prose-h2:text-xl prose-h2:mt-3 prose-h2:mb-2",
                    "prose-h3:text-lg prose-h3:mt-2 prose-h3:mb-1",
                    // 段落和列表样式
                    "prose-p:my-1",
                    "prose-ul:my-2 prose-ol:my-2",
                    "prose-li:my-0.5",
                    // 链接样式
                    "prose-a:text-brand prose-a:no-underline hover:prose-a:underline",
                    // 代码样式
                    "prose-code:bg-background-secondary prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-code:text-sm",
                    "prose-pre:bg-background-secondary prose-pre:p-4 prose-pre:rounded-lg"
                ),
            },
        },
        onUpdate: ({ editor }) => {
            onChange?.(editor.getHTML())
        },
    })

    // 通知父组件 editor 已就绪
    React.useEffect(() => {
        if (editor) {
            onEditorReady?.(editor)
        }
    }, [editor, onEditorReady])

    // 显示 placeholder
    const isEmpty = editor?.isEmpty

    return (
        <div className={cn("relative", className)}>
            {isEmpty && (
                <div className="absolute top-0 left-0 text-font-tertiary pointer-events-none text-base">
                    {placeholder}
                </div>
            )}
            <EditorContent editor={editor} />
        </div>
    )
}

// 导出 Editor 类型供其他组件使用
export type { Editor }
