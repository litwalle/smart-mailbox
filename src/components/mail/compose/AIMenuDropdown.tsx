import * as React from "react"

interface AIMenuDropdownProps {
    isOpen: boolean
    onClose: () => void
    onSelect: (action: string) => void
}

export function AIMenuDropdown({ isOpen, onClose, onSelect }: AIMenuDropdownProps) {
    const dropdownRef = React.useRef<HTMLDivElement>(null)

    React.useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                onClose()
            }
        }
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside)
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [isOpen, onClose])

    if (!isOpen) return null

    const menuItems = [
        { id: 'expand', label: 'Smart Expansion', icon: 'auto_awesome', shortcut: 'Ctrl+J' },
        { id: 'polish', label: 'Polish Tone', icon: 'magic_button', shortcut: '' },
        { id: 'proofread', label: 'Proofread', icon: 'spellcheck', shortcut: '' },
        { id: 'format', label: 'Smart Format', icon: 'format_list_bulleted', shortcut: '' },
    ]

    return (
        <div
            ref={dropdownRef}
            className="absolute bottom-12 left-2 z-50 w-56 bg-background-primary rounded-lg shadow-xl border border-comp-divider flex flex-col p-1 animate-in zoom-in-95 duration-100 origin-bottom-left"
        >
            <div className="px-3 py-2 text-xs font-semibold text-font-tertiary uppercase tracking-wider">
                AI Assistant
            </div>
            {menuItems.map(item => (
                <button
                    key={item.id}
                    className="flex items-center gap-3 px-3 py-2 text-sm text-font-primary hover:bg-background-secondary rounded-lg transition-colors text-left"
                    onClick={() => onSelect(item.id)}
                >
                    <span className="material-symbols-outlined text-[18px] text-brand">{item.icon}</span>
                    <span className="flex-1">{item.label}</span>
                    {item.shortcut && <span className="text-xs text-font-tertiary">{item.shortcut}</span>}
                </button>
            ))}
        </div>
    )
}
