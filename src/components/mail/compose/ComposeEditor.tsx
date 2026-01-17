import * as React from "react"

interface ComposeEditorProps {
    content: string
    onChange: (content: string) => void
    onSelectionChange: (selection: Selection | null) => void
    onCursorMove: (rect: DOMRect | null) => void
}

export function ComposeEditor({ content, onChange, onSelectionChange, onCursorMove }: ComposeEditorProps) {
    const editorRef = React.useRef<HTMLDivElement>(null)

    // Initial content sync (only once if empty to avoid cursor jumps, or handle properly)
    React.useEffect(() => {
        if (editorRef.current && editorRef.current.innerText !== content) {
            // Basic naive sync: only if empty to prevent overwriting user typing
            if (content === "") {
                editorRef.current.innerText = ""
            }
        }
    }, [content])

    // We intentionally don't sync `content` -> `innerText` on every render 
    // to avoid resetting cursor position. 
    // In a real app, we'd use a more robust logic or a library.
    // Here we rely on `onInput` to update parent.

    const handleInput = () => {
        if (editorRef.current) {
            onChange(editorRef.current.innerText)
            updateCursorAndSelection()
        }
    }

    const updateCursorAndSelection = () => {
        const selection = window.getSelection()
        if (!selection || selection.rangeCount === 0 || !editorRef.current?.contains(selection.anchorNode)) {
            onSelectionChange(null)
            onCursorMove(null)
            return
        }

        onSelectionChange(selection)

        const range = selection.getRangeAt(0)
        const rect = range.getBoundingClientRect()
        // If collapsed (cursor), rect width is 0. 
        // We might want checking for collapsed vs selection
        onCursorMove(rect)
    }

    return (
        <div
            className="flex-1 relative bg-white cursor-text"
            onClick={() => editorRef.current?.focus()}
        >
            <div
                ref={editorRef}
                className="w-full h-full outline-none text-sm leading-relaxed p-4 text-slate-800 overflow-y-auto whitespace-pre-wrap"
                contentEditable
                onInput={handleInput}
                onMouseUp={updateCursorAndSelection}
                onKeyUp={updateCursorAndSelection}
                suppressContentEditableWarning
                data-placeholder="Type your message here... Use '/' for commands."
                style={{ minHeight: '100%' }}
            />
            {/* Placeholder logic could be CSS based: :empty:before */}
            <style jsx>{`
                [contenteditable]:empty:before {
                    content: attr(data-placeholder);
                    color: #94a3b8;
                }
            `}</style>
        </div>
    )
}
