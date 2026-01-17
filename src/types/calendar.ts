import { User, Email } from "./mail";

export type EventType = 'meeting' | 'task' | 'reminder';

export interface CalendarEvent {
    id: string;
    title: string;
    type: EventType;
    start: string; // ISO String
    end: string;   // ISO String
    location?: string;
    description?: string;

    // Context Integration
    sourceEmailId?: string;
    sourceEmail?: Email; // Hydrated

    // AI Context (New)
    aiContext?: {
        summary?: string;
        note?: string;
        attachments?: Array<{
            name: string;
            size: string;
            type: string;
        }>;
    };

    attendees: User[];
    isAllDay?: boolean;
}

export interface CalendarState {
    view: 'month' | 'week' | 'day';
    currentDate: string; // ISO String
}
