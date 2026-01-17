import { create } from 'zustand';
import { Email, Folder, User } from '@/types/mail';
import {
    getEmailsForAccount,
    getFoldersForAccount,
    getUserForAccount,
    getAccounts,
    Account
} from '@/data/dataFoundation';

interface MailStore {
    // Account State
    currentAccountId: string;
    availableAccounts: Account[];
    switchAccount: (accountId: string) => void;

    // Mail State
    currentUser: User;
    folders: Folder[];
    emails: Email[];

    selectedFolderId: string; // 'inbox', 'sent', 'focus', etc.
    selectedEmailId: string | null;
    selectedEmailIds: string[]; // Multi-select state
    isFocusMode: boolean;

    activeModule: 'mail' | 'calendar' | 'contacts' | 'settings';
    setActiveModule: (module: 'mail' | 'calendar' | 'contacts' | 'settings') => void;

    isSidebarCollapsed: boolean;
    toggleSidebar: () => void;

    searchQuery: string;
    filterType: 'all' | 'unread' | 'flagged';
    isComposeOpen: boolean;
    composeDraft: { to: string; subject: string; content: string } | null;

    // Calendar State
    selectedEventId: string | null;

    // Actions
    selectFolder: (id: string) => void;
    selectEmail: (id: string | null) => void;
    selectEvent: (id: string | null) => void;
    setSearchQuery: (query: string) => void;
    setFilterType: (type: 'all' | 'unread' | 'flagged') => void;
    toggleCompose: (isOpen?: boolean) => void;
    openCompose: (draft?: { to: string; subject: string; content: string }) => void;

    sendEmail: (to: string, subject: string, content: string) => void;

    // ... other actions
    markAsRead: (id: string, isRead?: boolean) => void;
    toggleStar: (id: string) => void;
    deleteEmail: (id: string) => void;
    archiveEmail: (id: string) => void;

    // Multi-select Actions
    toggleEmailSelection: (id: string) => void;
    selectAll: () => void;
    setSelectedEmailIds: (ids: string[]) => void;
    clearSelection: () => void;

    // Getters
    getFilteredEmails: () => Email[];
}

export const useMailStore = create<MailStore>((set, get) => {
    // Initialize with default account (Alex)
    const defaultAccountId = "u1";

    return {
        // Account Init
        currentAccountId: defaultAccountId,
        availableAccounts: getAccounts(),

        switchAccount: (accountId) => set({
            currentAccountId: accountId,
            currentUser: getUserForAccount(accountId),
            folders: getFoldersForAccount(accountId),
            emails: getEmailsForAccount(accountId),
            // Reset view state
            selectedFolderId: 'focus',
            selectedEmailId: null,
            selectedEmailIds: [],
            isFocusMode: true,
            activeModule: 'mail'
        }),

        // Data Init
        currentUser: getUserForAccount(defaultAccountId),
        folders: getFoldersForAccount(defaultAccountId),
        emails: getEmailsForAccount(defaultAccountId),

        selectedFolderId: 'focus', // Default to Focus Inbox
        selectedEmailId: null,
        selectedEmailIds: [],
        isFocusMode: true,

        activeModule: 'mail',
        setActiveModule: (module) => set({ activeModule: module }),

        isSidebarCollapsed: false,
        toggleSidebar: () => set((state) => ({ isSidebarCollapsed: !state.isSidebarCollapsed })),

        searchQuery: '',
        filterType: 'all',
        isComposeOpen: false,
        composeDraft: null,

        selectFolder: (id) => set({
            selectedFolderId: id,
            selectedEmailId: null,
            selectedEmailIds: [], // Clear multi-select on folder change
            isFocusMode: id === 'focus'
        }),
        selectEmail: (id) => {
            set({ selectedEmailId: id });
            if (id) get().markAsRead(id);
        },

        // Calendar State
        selectedEventId: null,
        selectEvent: (id) => set({ selectedEventId: id, activeModule: 'calendar' }),

        setSearchQuery: (query) => set({ searchQuery: query }),
        setFilterType: (type) => set({ filterType: type }),
        toggleCompose: (isOpen) => set((state) => ({
            isComposeOpen: isOpen !== undefined ? isOpen : !state.isComposeOpen,
            // If closing, clear draft? Maybe optional. Let's keep it simple.
            composeDraft: isOpen === false ? null : state.composeDraft
        })),

        openCompose: (draft) => set({
            isComposeOpen: true,
            composeDraft: draft || null
        }),

        sendEmail: (to, subject, content) => set((state) => {
            const newEmail: Email = {
                id: `sent-${Date.now()}`,
                from: state.currentUser,
                to: [{ id: 'recipient', name: 'Recipient', email: to }],
                subject: subject,
                preview: content.substring(0, 50),
                content: content,
                isRead: true,
                isStarred: false,
                sentAt: new Date().toISOString(),
                folderId: 'sent',
                labels: [],
                priority: 'medium'
            };
            return {
                emails: [newEmail, ...state.emails],
                isComposeOpen: false,
                composeDraft: null
            };
        }),

        markAsRead: (id, isRead = true) => set((state) => ({
            emails: state.emails.map(e => e.id === id ? { ...e, isRead: isRead } : e)
        })),

        toggleStar: (id) => set((state) => ({
            emails: state.emails.map(e => e.id === id ? { ...e, isStarred: !e.isStarred } : e)
        })),

        deleteEmail: (id) => set((state) => ({
            emails: state.emails.filter(e => e.id !== id),
            selectedEmailId: state.selectedEmailId === id ? null : state.selectedEmailId
        })),

        archiveEmail: (id) => set((state) => ({
            emails: state.emails.map(e => e.id === id ? { ...e, folderId: 'archive' } : e),
            selectedEmailId: state.selectedEmailId === id ? null : state.selectedEmailId
        })),

        toggleEmailSelection: (id) => set((state) => {
            const isSelected = state.selectedEmailIds.includes(id);
            const newIds = isSelected
                ? state.selectedEmailIds.filter(pid => pid !== id)
                : [...state.selectedEmailIds, id];

            return { selectedEmailIds: newIds };
        }),

        selectAll: () => {
            const visibleEmails = get().getFilteredEmails();
            set({ selectedEmailIds: visibleEmails.map(e => e.id) });
        },

        setSelectedEmailIds: (ids: string[]) => set({ selectedEmailIds: ids }),

        clearSelection: () => set({ selectedEmailIds: [] }),

        getFilteredEmails: () => {
            const state = get();
            let filtered = state.emails.filter(e => e.folderId === state.selectedFolderId);

            if (state.filterType === 'unread') {
                filtered = filtered.filter(e => !e.isRead);
            } else if (state.filterType === 'flagged') {
                filtered = filtered.filter(e => e.isStarred);
            }

            if (state.searchQuery) {
                const q = state.searchQuery.toLowerCase();
                filtered = filtered.filter(e =>
                    e.subject.toLowerCase().includes(q) ||
                    e.from.name.toLowerCase().includes(q) ||
                    e.content.toLowerCase().includes(q)
                );
            }

            // Sort by Date Desc
            return filtered.sort((a, b) => new Date(b.sentAt).getTime() - new Date(a.sentAt).getTime());
        }
    };
});
