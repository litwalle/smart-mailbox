import { Mark, mergeAttributes } from '@tiptap/core';

export interface AIReviewMarkOptions {
    HTMLAttributes: Record<string, any>;
}

export const AIReviewMark = Mark.create<AIReviewMarkOptions>({
    name: 'aiReviewMark',

    addOptions() {
        return {
            HTMLAttributes: {},
        };
    },

    addAttributes() {
        return {
            id: {
                default: null,
            },
            originalContent: {
                default: null, // For storing previous content if needed for discard
            },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-type="ai-review-mark"]',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            'span',
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
                'data-type': 'ai-review-mark',
                class: 'ai-review-highlight', // Matches the CSS class we added
            }),
            0,
        ];
    },
});
