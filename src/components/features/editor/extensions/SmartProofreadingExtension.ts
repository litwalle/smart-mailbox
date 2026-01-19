
import { Extension } from '@tiptap/core'
import { Plugin, PluginKey } from '@tiptap/pm/state'
import { Decoration, DecorationSet } from '@tiptap/pm/view'
import { mockProofreadingErrors, ProofreadingError } from '@/data/smart-compose-mock'

export interface SmartProofreadingOptions {
    onHover?: (event: MouseEvent, error: ProofreadingError | null, dom: HTMLElement | null) => void
}

export const SmartProofreadingExtension = Extension.create<SmartProofreadingOptions>({
    name: 'smartProofreading',

    addOptions() {
        return {
            onHover: () => { },
        }
    },

    addProseMirrorPlugins() {
        const { onHover } = this.options

        return [
            new Plugin({
                key: new PluginKey('smartProofreading'),
                props: {
                    decorations(state) {
                        const { doc } = state
                        const decorations: Decoration[] = []

                        // Naive implementation: scan the whole doc for mock errors
                        // In production, this should be efficient (e.g. from an async service result mapped to positions)
                        doc.descendants((node, pos) => {
                            if (!node.isText) return

                            // Iterate through mock errors and find matches in this text node
                            mockProofreadingErrors.forEach(error => {
                                const text = node.text
                                if (!text) return

                                const regex = new RegExp(`\\b${error.text}\\b`, 'g')
                                let match
                                while ((match = regex.exec(text)) !== null) {
                                    const from = pos + match.index
                                    const to = from + error.text.length

                                    decorations.push(
                                        Decoration.inline(from, to, {
                                            class: `proofreading-underline proofreading-${error.type}`,
                                            'data-error-id': error.id,
                                            'data-suggestion': error.suggestion
                                        })
                                    )
                                }
                            })
                        })

                        return DecorationSet.create(doc, decorations)
                    },
                    handleDOMEvents: {
                        mouseover: (view, event) => {
                            const target = event.target as HTMLElement
                            if (target.classList.contains('proofreading-underline')) {
                                const errorId = target.getAttribute('data-error-id')
                                const error = mockProofreadingErrors.find(e => e.id === errorId) || null
                                onHover?.(event, error, target)
                                return true
                            }
                            // Mouse out or over non-error -> null
                            // However, mouseout might be better handled separately or by checking if we moved out
                            // For simplicity, let parent handle "if not hovering error, hide tooltip" via global mousemove or leave
                            return false
                        },
                        // We might need mouseout to hide it, but usually a global or smarter hover manager is better
                        // For now, let's rely on the parent (RichTextEditor) to handle state opening/closing
                        // based on the boolean return of this or distinct events.
                        // Actually, simpler: passing DOM event up allows parent to decide.
                    }
                },
            }),
        ]
    },
})
