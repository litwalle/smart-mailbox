import * as React from "react"
import { useMailStore } from "@/store/mailStore"
import { SidebarMail } from "./SidebarMail"
import { SidebarCalendar } from "./SidebarCalendar"
import { cn } from "@/lib/utils"

export function Sidebar() {
    const { activeModule, setActiveModule, selectFolder, isFocusMode, toggleSidebar, isSidebarCollapsed } = useMailStore()

    // Handle Module Switching
    const handleModuleChange = (module: 'mail' | 'calendar' | 'contacts' | 'settings') => {
        setActiveModule(module);

        if (module === 'calendar') {
            selectFolder('calendar');
        } else if (module === 'mail') {
            selectFolder('focus');
        }
    }

    return (
        <div className="flex flex-col h-full bg-slate-50 border-r border-slate-200 transition-all duration-300">
            {/* 1. Top Header */}
            <div className={cn(
                "h-16 flex items-center shrink-0 transition-all",
                isSidebarCollapsed ? "justify-center px-0" : "justify-between px-4"
            )}>
                {isSidebarCollapsed ? (
                    // Collapsed: Click to Expand (SM Logo)
                    <button
                        onClick={toggleSidebar}
                        className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 transition-colors"
                        title="展开侧边栏"
                    >
                        <span className="material-symbols-outlined text-[20px] transform rotate-180">dock_to_left</span>
                    </button>
                ) : (
                    // Expanded: Full Logo + Collapse Button
                    <>
                        <div className="flex items-center gap-2 text-slate-800">
                            <span className="font-serif font-black text-xl tracking-tighter italic text-blue-600">M.</span>
                            <span className="font-bold text-sm tracking-tight text-slate-700 uppercase">
                                {activeModule === 'calendar' ? 'Calendar' : 'Mailbox'}
                            </span>
                        </div>
                        <button
                            onClick={toggleSidebar}
                            className="text-slate-400 hover:text-slate-600 p-1 rounded-md hover:bg-slate-200/50 transition-colors"
                            title="收起边栏"
                        >
                            <span className="material-symbols-outlined text-[20px]">dock_to_left</span>
                        </button>
                    </>
                )}
            </div>

            {/* 2. Module Content Area */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {activeModule === 'mail' && <SidebarMail isCollapsed={isSidebarCollapsed} />}
                {activeModule === 'calendar' && <SidebarCalendar isCollapsed={isSidebarCollapsed} />}
                {activeModule === 'contacts' && (
                    <div className={cn("p-4 text-center text-slate-400 text-sm mt-10", isSidebarCollapsed && "hidden")}>通讯录模块开发中</div>
                )}
                {activeModule === 'settings' && (
                    <div className={cn("p-4 text-center text-slate-400 text-sm mt-10", isSidebarCollapsed && "hidden")}>设置模块开发中</div>
                )}
            </div>

            {/* 3. Bottom Navigation Bar */}
            <div className={cn(
                "border-t border-slate-200 bg-white shrink-0 transition-all",
                isSidebarCollapsed
                    ? "flex flex-col items-center py-4 space-y-4 w-full" // Vertical layout when collapsed
                    : "h-14 flex items-center justify-around px-2"     // Horizontal layout when expanded
            )}>
                <BottomNavIcon
                    icon="mail"
                    isActive={activeModule === 'mail'}
                    onClick={() => handleModuleChange('mail')}
                    label="邮件"
                    isCollapsed={isSidebarCollapsed}
                />
                <BottomNavIcon
                    icon="calendar_month"
                    isActive={activeModule === 'calendar'}
                    onClick={() => handleModuleChange('calendar')}
                    label="日历"
                    isCollapsed={isSidebarCollapsed}
                />
                <BottomNavIcon
                    icon="group"
                    isActive={activeModule === 'contacts'}
                    onClick={() => handleModuleChange('contacts')}
                    label="通讯录"
                    isCollapsed={isSidebarCollapsed}
                />
                <BottomNavIcon
                    icon="settings"
                    isActive={activeModule === 'settings'}
                    onClick={() => handleModuleChange('settings')}
                    label="设置"
                    isCollapsed={isSidebarCollapsed}
                />
            </div>
        </div>
    )
}

function BottomNavIcon({ icon, isActive, onClick, label, isCollapsed }: { icon: string, isActive: boolean, onClick: () => void, label: string, isCollapsed: boolean }) {
    if (isCollapsed) {
        return (
            <button
                onClick={onClick}
                className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-lg transition-all",
                    isActive ? "text-blue-600 bg-blue-50" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
                )}
                title={label}
            >
                <span className={cn(
                    "material-symbols-outlined text-[20px]",
                    isActive && "fill-current"
                )}>
                    {icon}
                </span>
            </button>
        )
    }

    // Expanded State - No Text as requested
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex flex-col items-center justify-center w-10 h-10 rounded-lg transition-all",
                isActive ? "text-blue-600 bg-blue-50" : "text-slate-400 hover:text-slate-600 hover:bg-slate-50"
            )}
            title={label}
        >
            <span className={cn(
                "material-symbols-outlined text-[24px]",
                isActive && "fill-current"
            )}>
                {icon}
            </span>
        </button>
    )
}
