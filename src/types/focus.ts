import { Email } from "./mail";

export interface MeetingData {
    id: string
    title: string
    time: string
    location: string
    attendees: string[]
    tags?: string[]
    relatedEmailId?: string
}

export interface TransitStep {
    type: 'bus' | 'walk' | 'subway'
    instruction: string
    time: string
    from: string
    to: string
}

export interface TransitData {
    route?: string
    startLocation: string
    endLocation: string
    type?: 'taxi' | 'public' | 'drive'
    plateNumber?: string
    driver?: string
    estimateTime?: string
    fee?: string
    status?: 'arriving' | 'in-trip' | 'completed'
    departureTime: string
    pickupLocation?: string
    suggestedAction?: string
    steps: TransitStep[]
}

export interface InsightData {
    type?: 'market-alert' | 'competitor-news' | 'internal-update'
    title?: string
    content?: string
    source: string
    tag?: string
    imageUrl?: string
    impact?: 'high' | 'medium' | 'low'
}

export interface TodoItem {
    id: string
    content: string
    isDone: boolean
    isUrgent?: boolean
    deadline?: string
    relatedEmailId?: string
    action?: {
        label: string
        onClick?: () => void
    }
}

export interface FocusCardAction {
    label: string
    action?: string
    actionType?: string
    isPrimary?: boolean
}

export interface FocusCard {
    id: string
    type: 'meeting' | 'transit' | 'insight' | 'email' | 'briefing' | 'todo' | 'report' | 'urgent'
    title: string
    summary?: string
    priority: number | 'high' | 'medium' | 'low'
    isImportant?: boolean
    timeDisplay: string
    relatedEmailId?: string
    relatedEmail?: Email

    // Guidance
    guidanceIcon?: string
    guidanceText?: string

    // Type specific data
    meetingData?: MeetingData
    transitData?: TransitData
    insightData?: InsightData

    // Grouping
    meetingList?: MeetingData[]
    todoList?: TodoItem[]

    actions?: FocusCardAction[]
}

export interface MorningBriefing {
    headline: string
    summary: string
    dateDisplay: string
    cards: FocusCard[]
}

// Alias for backwards compatibility
export type FocusBriefing = MorningBriefing;
