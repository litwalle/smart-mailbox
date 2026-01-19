import { Editor } from '@tiptap/react';

/**
 * Simulates AI streaming text into the editor.
 * 1. Sets AI writing state (showing cursor).
 * 2. Streams text chunk by chunk.
 * 3. On completion, wraps content in AIReviewMark and shows the toolbar.
 */
export const streamTextToEditor = (editor: Editor, text: string, onComplete?: () => void) => {
    if (!editor || !text) return;

    // 1. Set State
    // The command name was defined in AIStreamExtension as 'setAIWriting'
    // But we need to make sure TypeScript knows about it or use 'can().run()' pattern safely
    // We'll cast to any for quick iteration or rely on command registration
    (editor.commands as any).setAIWriting(true);

    // 2. Prepare
    const { from } = editor.state.selection;
    const chunk = 3; // chars per tick
    let index = 0;

    // Speed: 30ms per chunk ~ 100 chars/sec (fast typing)
    const interval = setInterval(() => {
        if (index >= text.length) {
            clearInterval(interval);

            // 4. Finish State
            (editor.commands as any).setAIWriting(false);

            // 5. Wrap in Review Mark
            // The inserted text ranges from [from] to [from + text.length]
            // Note: If the user typed *during* this (which we should prevent), positions might be off.
            // We assume benign environment for MVP.
            const to = from + text.length;

            editor.chain()
                .setTextSelection({ from, to })
                .setMark('aiReviewMark', { id: Date.now().toString() }) // Apply mark
                .setTextSelection(to) // Move cursor to end for "Last Character" anchoring
                .run();

            if (onComplete) onComplete();
            return;
        }

        const nextChunk = text.slice(index, index + chunk);

        // Insert without adding newline by default
        editor.commands.insertContent(nextChunk);

        // Auto-scroll logic if needed (simple version)
        // editor.view.dom.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

        index += chunk;
    }, 30);
};
