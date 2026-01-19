import React from 'react';
import { Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import { getMarkRange } from '@tiptap/core';
import { Check, RotateCw, Trash2, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';
import { streamTextToEditor } from './utils/ai-streaming';

interface AIReviewToolbarProps {
    editor: Editor | null;
}

export const AIReviewToolbar = ({ editor }: AIReviewToolbarProps) => {
    if (!editor) return null;

    const handleAccept = () => {
        // Ungroup/Remove mark but keep text
        // Extend selection to cover the whole mark to successfully unset it
        editor.chain().focus().extendMarkRange('aiReviewMark').unsetMark('aiReviewMark').run();
    };

    const handleRewrite = () => {
        // 1. Select the mark range
        editor.chain().focus().extendMarkRange('aiReviewMark').run();

        // 2. Clear content
        editor.chain().focus().deleteSelection().run();

        // 3. Trigger Stream again (Mock)
        // Ideally we grab the "prompt" from the mark attributes if we stored it
        // For now, we simulate a regen
        const dummy = "[AI重写] 这是为您重写的内容，更加精炼且符合语境。";
        streamTextToEditor(editor, dummy);
    };

    const handleDiscard = () => {
        // Revert to original content or just delete
        // 1. Extend selection to cover mark
        // 2. Delete
        // 3. Explicitly unset mark to clear storedMarks (prevents Toolbar from staying)
        editor.chain()
            .focus()
            .extendMarkRange('aiReviewMark')
            .deleteSelection()
            .unsetMark('aiReviewMark')
            .run();
    };

    return (
        <BubbleMenu
            editor={editor}
            pluginKey="ai-review-menu"
            // Show if mark is active OR if cursor is at the end of such mark (common in streaming)
            shouldShow={({ editor }) => {
                if (editor.isActive('aiReviewMark')) return true;
                const { from, to, empty } = editor.state.selection;
                if (empty && from > 0) {
                    // Check previous character if cursor is collapsed
                    return editor.state.doc.rangeHasMark(from - 1, from, editor.schema.marks.aiReviewMark);
                }
                return false;
            }}
            // @ts-expect-error tippyOptions is missing in some versions of @tiptap/react types but works
            tippyOptions={{
                placement: 'bottom-end', // Align toolbar right edge to reference point (right edge of last character)
                // offset: [skidding, distance]. Skidding=0px, Distance=4px (down)
                offset: [0, 4],
                duration: 200,
                zIndex: 9999,
                interactive: true,
                maxWidth: 'none',
                getReferenceClientRect: () => {
                    if (!editor || !editor.view || !editor.view.dom) {
                        return new DOMRect(0, 0, 0, 0);
                    }

                    // 使用 DOM 方法直接找到带有 AI 标记的 span 元素
                    const aiMarkedSpans = editor.view.dom.querySelectorAll('span[data-type="ai-review-mark"]');

                    if (aiMarkedSpans.length === 0) {
                        return new DOMRect(0, 0, 0, 0);
                    }

                    // 获取最后一个 AI 标记元素
                    const lastSpan = aiMarkedSpans[aiMarkedSpans.length - 1];
                    const rect = lastSpan.getBoundingClientRect();

                    console.log('[AIReviewToolbar] DOM method - lastSpan:', lastSpan, 'rect:', rect);

                    // 返回参考矩形：右边界作为 x，底部作为 y
                    // bottom-start placement 会让工具栏左边缘对齐到 rect.x（即 rect.right）
                    return new DOMRect(rect.right, rect.bottom, 1, 1);
                },
                popperOptions: {
                    strategy: 'fixed',
                    modifiers: [
                        {
                            name: 'flip',
                            enabled: false,
                        },
                        {
                            name: 'preventOverflow',
                            enabled: true,
                            options: {
                                padding: 24,
                                boundary: 'viewport',
                            },
                        },
                    ],
                },
            }}
            className="flex items-center gap-1 p-1 bg-white rounded-lg shadow-lg border border-slate-200"
        >
            <Button
                variant="ghost"
                size="sm"
                onClick={handleAccept}
                className="h-7 gap-1.5 px-3 bg-blue-600 text-white hover:bg-blue-700 hover:text-white rounded-md shadow-sm"
            >
                <Check className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">采纳</span>
            </Button>

            <div className="w-[1px] h-4 bg-slate-100 mx-0.5" />

            <Button
                variant="ghost"
                size="sm"
                onClick={handleRewrite}
                className="h-7 gap-1.5 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-md"
            >
                <RotateCw className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">重写</span>
            </Button>

            <div className="w-[1px] h-4 bg-slate-100 mx-0.5" />

            <Button
                variant="ghost"
                size="sm"
                onClick={handleDiscard}
                className="h-7 gap-1.5 px-3 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-md"
            >
                <X className="w-3.5 h-3.5" />
                <span className="text-xs font-medium">放弃</span>
            </Button>
        </BubbleMenu>
    );
};
