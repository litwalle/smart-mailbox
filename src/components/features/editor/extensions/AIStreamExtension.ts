import { Extension } from '@tiptap/core';
import { Plugin, PluginKey } from '@tiptap/pm/state';
import { Decoration, DecorationSet } from '@tiptap/pm/view';
import React from 'react';
import { createRoot } from 'react-dom/client';
import { AIStreamCursor } from '../AIStreamCursor';

declare module '@tiptap/core' {
    interface Commands<ReturnType> {
        aiStream: {
            setAIWriting: (isWriting: boolean) => ReturnType;
        };
    }
}

export const AIStreamExtension = Extension.create({
    name: 'aiStream',

    addStorage() {
        return {
            isWriting: false,
        };
    },

    addCommands() {
        return {
            setAIWriting:
                (isWriting: boolean) =>
                    ({ editor }) => {
                        this.storage.isWriting = isWriting;
                        // Dispatch a transaction to trigger decoration update
                        editor.view.dispatch(editor.state.tr.setMeta('aiStreamStateChange', true));
                        return true;
                    },
        };
    },

    addProseMirrorPlugins() {
        return [
            new Plugin({
                key: new PluginKey('aiStreamCursor'),
                props: {
                    decorations: (state) => {
                        if (!this.storage.isWriting) {
                            return DecorationSet.empty;
                        }

                        const { to } = state.selection;
                        const decoration = Decoration.widget(to, (view) => {
                            const dom = document.createElement('span');
                            dom.className = 'ai-stream-cursor-wrapper';
                            // Should be inline-block or similar to not break layout
                            dom.style.display = 'inline-block';
                            dom.style.verticalAlign = 'middle';

                            const root = createRoot(dom);
                            root.render(React.createElement(AIStreamCursor));

                            return dom;
                        });

                        return DecorationSet.create(state.doc, [decoration]);
                    },
                },
            }),
        ];
    },
});
