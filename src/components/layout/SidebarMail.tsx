import * as React from "react"
import { useMailStore } from "@/store/mailStore"
import { Button } from "@/components/ui/Button"
import { cn } from "@/lib/utils"

interface SidebarMailProps {
    isCollapsed?: boolean
}

export function SidebarMail({ isCollapsed }: SidebarMailProps) {
    const { folders, selectedFolderId, selectFolder, toggleCompose, currentUser } = useMailStore()
    const [isUserFoldersOpen, setIsUserFoldersOpen] = React.useState(true)

    // Filter Groups
    const groupFocus = folders.filter(f => ['focus', 'todo'].includes(f.id));
    const groupSmart = folders.filter(f => f.type === 'smart');
    const groupSystem = folders.filter(f => ['inbox', 'flagged', 'sent', 'trash'].includes(f.id));
    const groupUser = folders.filter(f => f.type === 'user');

    return (
        <div className="flex flex-col h-full">
            {/* Header: Compose Button */}
            <div className={cn("mb-2 pt-2 transition-all", isCollapsed ? "px-2 flex justify-center" : "px-3")}>
                <Button
                    onClick={() => toggleCompose(true)}
                    className={cn(
                        "transition-all border border-comp-divider bg-background-primary hover:bg-background-secondary text-font-primary rounded-lg shadow-none",
                        isCollapsed
                            ? "h-10 w-10 p-0 justify-center"
                            : "w-full justify-center gap-3"
                    )}
                    size="lg"
                    title="写信"
                >
                    <span className={cn("material-symbols-outlined text-brand", isCollapsed ? "text-[22px]" : "text-[20px]")}>edit_square</span>
                    {!isCollapsed && <span className="font-semibold">写信</span>}
                </Button>
            </div>

            <div className={cn(
                "flex-1 overflow-y-auto space-y-6 py-2 scrollbar-thin transition-all",
                isCollapsed ? "px-2" : "px-3"
            )}>

                {/* Group 1: Focus & Todo */}
                <div className="space-y-0.5">
                    {groupFocus.map(folder => (
                        <NavButton
                            key={folder.id}
                            folder={folder}
                            isActive={selectedFolderId === folder.id}
                            onClick={() => selectFolder(folder.id)}
                            labelOverride={folder.id === 'focus' ? '焦点收件箱' : folder.id === 'todo' ? '待办事项' : undefined}
                            isCollapsed={isCollapsed}
                        />
                    ))}
                </div>

                {/* Group 2: Smart Folders */}
                {groupSmart.length > 0 && (
                    <div className="space-y-0.5">
                        {!isCollapsed && <SectionHeader label="智能视图" />}
                        {isCollapsed && <div className="h-4"></div>} {/* Spacer for collapsed */}
                        {groupSmart.map(folder => (
                            <NavButton
                                key={folder.id}
                                folder={folder}
                                isActive={selectedFolderId === folder.id}
                                onClick={() => selectFolder(folder.id)}
                                labelOverride={
                                    folder.id === 'vip' ? '重要联系人' :
                                        folder.id === 'meetings' ? '会议纪要' :
                                            folder.id === 'approvals' ? '审批' : undefined
                                }
                                isCollapsed={isCollapsed}
                            />
                        ))}
                    </div>
                )}

                {/* Group 3: Account & Mailbox & User Folders */}
                <div className="space-y-0.5">
                    {/* Account Header */}
                    {!isCollapsed ? (
                        <div className="px-3 py-2 flex items-center gap-2 mb-1 mt-4 rounded-lg hover:bg-background-secondary cursor-pointer">
                            <div className="h-5 w-5 rounded-full bg-background-tertiary overflow-hidden shrink-0">
                                <img src={currentUser.avatar} className="object-cover h-full w-full" />
                            </div>
                            <span className="text-xs font-bold text-font-primary truncate">{currentUser.email}</span>
                            <span className="material-symbols-outlined text-[14px] ml-auto text-icon-tertiary">expand_more</span>
                        </div>
                    ) : (
                        <div className="my-4 flex justify-center">
                            <div className="h-6 w-6 rounded-full bg-background-tertiary overflow-hidden shrink-0 ring-2 ring-background-primary shadow-sm">
                                <img src={currentUser.avatar} className="object-cover h-full w-full" />
                            </div>
                        </div>
                    )}

                    {/* Standard Folders */}
                    {groupSystem.map(folder => (
                        <NavButton
                            key={folder.id}
                            folder={folder}
                            isActive={selectedFolderId === folder.id}
                            onClick={() => selectFolder(folder.id)}
                            labelOverride={folder.id === 'inbox' ? '收件箱' : folder.id === 'flagged' ? '红旗邮件' : folder.id === 'sent' ? '已发送' : folder.id === 'trash' ? '已删除' : undefined}
                            isCollapsed={isCollapsed}
                        />
                    ))}

                    {/* User Folders (Merged) */}
                    {groupUser.length > 0 && (
                        <div className="space-y-0.5 pt-0.5">
                            {groupUser.map(folder => (
                                <NavButton
                                    key={folder.id}
                                    folder={folder}
                                    isActive={selectedFolderId === folder.id}
                                    onClick={() => selectFolder(folder.id)}
                                    // Removed pl-8 indentation to merge visually with system folders
                                    isCollapsed={isCollapsed}
                                />
                            ))}
                        </div>
                    )}
                </div>

            </div>
        </div>
    )
}

// --- Helper Components ---

function SectionHeader({ label }: { label: string }) {
    return (
        <div className="px-3 py-1.5 flex items-center justify-between text-[11px] font-bold text-font-tertiary uppercase tracking-wider mt-4">
            <span>{label}</span>
        </div>
    )
}

interface NavButtonProps {
    folder: any;
    isActive: boolean;
    onClick: () => void;
    labelOverride?: string;
    className?: string;
    isCollapsed?: boolean;
}

function NavButton({ folder, isActive, onClick, labelOverride, className, isCollapsed }: NavButtonProps) {
    return (
        <button
            onClick={onClick}
            title={labelOverride || folder.name}
            className={cn(
                "flex items-center transition-colors ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/20",
                isCollapsed
                    ? "w-10 h-10 justify-center rounded-xl mx-auto"
                    : "w-full gap-3 px-3 py-1.5 rounded-md text-sm font-medium",
                isActive
                    ? "bg-background-tertiary text-font-primary font-semibold"
                    : "text-font-secondary hover:bg-background-secondary hover:text-font-primary",
                className
            )}
        >
            <div className="relative flex items-center justify-center">
                <span className={cn(
                    "material-symbols-outlined",
                    isCollapsed ? "text-[22px]" : "text-[18px]",
                    folder.color && !isActive ? folder.color : "text-icon-secondary",
                    isActive ? "text-font-primary fill-current" : ""
                )}>
                    {folder.icon}
                </span>

                {/* Red Dot for Unread in Collapsed Mode */}
                {isCollapsed && folder.unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-2.5 w-2.5 bg-warning border-2 border-background-primary rounded-full"></span>
                )}
            </div>

            {!isCollapsed && (
                <>
                    <span className="flex-1 text-left truncate">{labelOverride || folder.name}</span>
                    {folder.unreadCount > 0 && (
                        <span className={cn(
                            "text-xs font-medium px-1.5 rounded-md min-w-[1.2rem] text-center",
                            isActive ? "bg-comp-background-neutral text-font-on-primary" : "bg-background-secondary text-font-secondary"
                        )}>
                            {folder.unreadCount}
                        </span>
                    )}
                </>
            )}
        </button>
    )
}
