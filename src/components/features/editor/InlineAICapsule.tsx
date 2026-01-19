import * as React from "react"
import { Editor } from "@tiptap/react"
import { Sparkles, ChevronDown } from "lucide-react"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { WritingImprovementSubmenu } from "./WritingImprovementSubmenu"
import { cn } from "@/lib/utils"

interface InlineAICapsuleProps {
    editor: Editor | null
}

export function InlineAICapsule({ editor }: InlineAICapsuleProps) {
    const [position, setPosition] = React.useState<{ top: number, left: number } | null>(null)
    const [isOpen, setIsOpen] = React.useState(false)
    const [isVisible, setIsVisible] = React.useState(false)

    // Track open state synchronously to handle blur events correctly
    const isOpenRef = React.useRef(isOpen)
    const openedAtRef = React.useRef<number>(0)

    // Sync ref
    React.useEffect(() => {
        isOpenRef.current = isOpen
    }, [isOpen])

    // Position update logic
    const updatePosition = React.useCallback(() => {
        if (!editor || !editor.view || editor.isDestroyed) {
            setIsVisible(false)
            return
        }

        const { selection } = editor.state
        const { empty, from, to } = selection

        // Check for AI Review Mark (Conflict validation)
        // If AI Review Toolbar is showing, we should not show the Inline Capsule
        const isAIReviewActive = editor.isActive('aiReviewMark') ||
            (empty && from > 0 && editor.state.doc.rangeHasMark(from - 1, from, editor.schema.marks.aiReviewMark));

        if (isAIReviewActive) {
            if (!isOpenRef.current) setIsVisible(false)
            return
        }

        // Hide if we have a text selection (Bubble Menu takes over)
        if (!empty) {
            if (!isOpenRef.current) setIsVisible(false)
            return
        }

        if (!editor.isFocused && !isOpenRef.current) {
            setIsVisible(false)
            return
        }

        // Get coordinates
        const { view } = editor
        const coords = view.coordsAtPos(to)

        // Calculate relative position to editor
        const editorDom = view.dom
        const editorRect = editorDom.getBoundingClientRect()

        // Offset: 5px below the line, slightly to the right
        const top = coords.bottom - editorRect.top + 5
        const left = coords.right - editorRect.left + 2

        setPosition({ top, left })
        setIsVisible(true)

    }, [editor]) // Removed isOpen dependency to avoid unnecessary recreations, relies on Ref

    React.useEffect(() => {
        if (!editor) return

        const handleUpdate = () => {
            requestAnimationFrame(updatePosition)
        }

        editor.on('selectionUpdate', handleUpdate)
        editor.on('update', handleUpdate)
        editor.on('focus', handleUpdate)
        editor.on('blur', () => {
            // Delay hiding to allow clicking the menu
            setTimeout(() => {
                if (!isOpenRef.current) handleUpdate()
            }, 100)
        })

        return () => {
            editor.off('selectionUpdate', handleUpdate)
            editor.off('update', handleUpdate)
            editor.off('focus', handleUpdate)
            editor.off('blur', handleUpdate)
        }
    }, [editor, updatePosition])

    // Handle open change with timeout check
    const handleOpenChange = (open: boolean) => {
        if (open) {
            openedAtRef.current = Date.now()
            setIsOpen(true)
            isOpenRef.current = true
        } else {
            const timeSinceOpen = Date.now() - openedAtRef.current
            if (timeSinceOpen < 300) {
                // Ignore close request if too soon
                return
            }
            setIsOpen(false)
            isOpenRef.current = false
            // Refocus editor after interaction
            setTimeout(() => editor?.commands.focus(), 0)
        }
    }

    if (!editor || !position || !isVisible) return null

    return (
        <div
            className="absolute z-50 transition-all duration-200 ease-out"
            style={{
                top: position.top,
                left: position.left,
                transform: 'translate(-0%, 0)'
            }}
        >
            <DropdownMenu open={isOpen} onOpenChange={handleOpenChange} modal={false}>
                <DropdownMenuTrigger asChild>
                    <button
                        className={cn(
                            "flex items-center justify-center w-8 h-8 rounded-full shadow-sm transition-all border-[0.5px] border-slate-200",
                            "bg-white text-purple-600 hover:text-purple-700 hover:bg-slate-50 hover:scale-105 active:scale-95",
                            "animate-in fade-in zoom-in-50 duration-200"
                        )}
                        onMouseDown={(e) => e.preventDefault()} // Prevent focus loss
                    >
                        <Sparkles className="w-3.5 h-3.5" strokeWidth={1.5} />
                    </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="start"
                    side="bottom"
                    className="w-56 p-1 z-[9999]"
                    onCloseAutoFocus={(e) => e.preventDefault()}
                >
                    <WritingImprovementSubmenu
                        editor={editor}
                        onAction={() => setIsOpen(false)}
                        onOpenMore={() => {
                            setIsOpen(false)
                            window.dispatchEvent(new CustomEvent('open-writing-assistant'))
                        }}
                    />
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}
