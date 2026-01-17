export interface User {
    id: string;
    name: string;
    email: string;
    avatar?: string;
    role?: string;
}

export interface Folder {
    id: string;
    name: string;
    icon: string;
    type: 'system' | 'smart' | 'user';
    unreadCount?: number;
    color?: string; // Tailwind color class or hex
}

export interface Todo {
    id: string;
    content: string;
    deadline?: string; // ISO String
    sourceEmailId: string;
    isCompleted: boolean;
    priority?: 'high' | 'medium' | 'low';
    action?: {
        label: string;
        url: string;
        type?: 'primary' | 'secondary';
    };
}

export interface Email {
    id: string;
    from: User;
    to: User[];
    cc?: User[];
    bcc?: User[];
    size?: string; // e.g. "1.2 MB"
    subject: string;
    deadline?: string; // e.g. "Today at 5:00 PM"
    preview: string; // 一句话摘要 or content snippet
    content: string; // HTML or Markdown
    isRead: boolean;
    isStarred: boolean;
    sentAt: string; // ISO String
    folderId: string;
    labels: string[];

    // AI Attributes
    priority: 'high' | 'medium' | 'low';
    aiSummary?: string;
    aiTodos?: Todo[];
    aiTags?: string[]; // e.g., ["Contract", "Urgent"]
    aiReason?: string; // Why is this important?

    // Attachments
    hasAttachments?: boolean;

    // Phase 8: Reading Experience
    actionCapsules?: ActionCapsule[];
    translatedSubject?: string;
    translatedContent?: string; // for Native Language View
    translatedSummary?: string;
    translatedTodos?: Todo[];
    meetingRequest?: MeetingRequest;
}

export interface MeetingRequest {
    id: string;
    title: string;
    translatedTitle?: string;
    start: string; // ISO String
    end: string; // ISO String
    timeZone: string; // e.g. "PST", "GMT+8"
    location: string;
    translatedLocation?: string;
    joinUrl?: string; // For Join Button
    meetingType?: 'internal' | 'external';

    attendees: {
        name: string;
        email: string;
        avatar?: string;
        role?: 'organizer' | 'required' | 'optional';
        type?: 'internal' | 'external';
        status: 'accepted' | 'declined' | 'tentative' | 'pending';
    }[];

    // Structured Agenda
    agendaItems?: {
        id: string;
        title: string;
        translatedTitle?: string;
        type: string; // e.g. "Presentation", "Discussion"
        translatedType?: string;
        duration: string; // e.g. "15m"
        time: string; // e.g. "10:00 - 10:15"
        description?: string;
        translatedDescription?: string;
    }[];

    // Materials
    materials?: {
        name: string;
        translatedName?: string;
        url: string;
        type?: 'doc' | 'slide' | 'sheet' | 'other';
    }[];

    // Notices
    notices?: string[];
    translatedNotices?: string[];

    description?: string; // General description HTML
    translatedDescription?: string;
}

export interface ActionCapsule {
    id: string;
    label: string;
    type: 'primary' | 'secondary' | 'neutral'; // determines color
    icon?: string; // material symbol name
    actionUrl?: string; // deep link or mock url
}
