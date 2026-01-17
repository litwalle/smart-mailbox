import React from 'react';
import { useMailStore } from '@/store/mailStore';
import { cn } from '@/lib/utils';

export function SettingsView() {
    const { availableAccounts, currentAccountId, switchAccount } = useMailStore();

    return (
        <div className="flex flex-col h-full bg-slate-50/50">
            <div className="h-16 px-6 border-b border-border-color flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
                <h2 className="text-lg font-bold text-slate-800">设置中心</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-6 max-w-2xl mx-auto w-full space-y-8">
                <section>
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-slate-400">manage_accounts</span>
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">切换账户</h3>
                    </div>
                    <div className="space-y-3">
                        {availableAccounts.map((account) => (
                            <div
                                key={account.id}
                                onClick={() => switchAccount(account.id)}
                                className={cn(
                                    "flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all bg-white shadow-sm",
                                    currentAccountId === account.id
                                        ? "border-blue-500 ring-1 ring-blue-500/20"
                                        : "border-slate-200 hover:border-slate-300 hover:shadow-md"
                                )}
                            >
                                <div className="relative">
                                    <img src={account.avatar} alt={account.name} className="w-14 h-14 rounded-full object-cover border border-slate-100" />
                                    {currentAccountId === account.id && (
                                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5">
                                            <span className="material-symbols-outlined text-blue-600 text-[20px] bg-blue-100 rounded-full">check_circle</span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <h4 className={cn("font-bold text-base", currentAccountId === account.id ? "text-slate-900" : "text-slate-700")}>
                                            {account.name}
                                        </h4>
                                        {currentAccountId === account.id && (
                                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide bg-blue-100 text-blue-700 rounded-full">
                                                当前账户
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-slate-500 font-medium">{account.email}</p>
                                    <p className="text-xs text-slate-400 mt-1">{account.role}</p>
                                </div>
                                <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="opacity-50 pointer-events-none grayscale">
                    <div className="flex items-center gap-2 mb-4">
                        <span className="material-symbols-outlined text-slate-400">tune</span>
                        <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">通用设置</h3>
                    </div>
                    <div className="p-6 bg-white rounded-xl border border-slate-200 text-center text-slate-400 text-sm">
                        更多设置项开发中...
                    </div>
                </section>
            </div>
        </div>
    );
}
