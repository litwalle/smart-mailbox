import { LucideIcon } from "lucide-react"

export interface SmartFolderConfig {
    id: string
    name: string
    icon: string
    color: string // Palette color class, e.g. "palette-1"
    rules?: string[]
}

export interface SmartViewTemplate {
    id: string
    name: string
    description: string
    icon: string
    color: string // Palette color for template card
    folders: SmartFolderConfig[]
}

export type SmartViewMode = 'template' | 'custom'

// Rule generated from AI parsing user input
export interface SmartViewRule {
    id: string
    rawInput: string // Original user input
    parsed: {
        field: 'from' | 'subject' | 'content' | 'label'
        operator: 'contains' | 'equals' | 'startsWith'
        value: string
    }
    displayText: string // e.g. "发件人包含: @github.com"
}
